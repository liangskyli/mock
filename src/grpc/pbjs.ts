import { uniqBy } from 'lodash';
import type {
  Enum,
  Field,
  IEnum,
  IMethod,
  INamespace,
  IService,
  IType,
  Namespace,
  ReflectionObject,
  Service,
  Type,
} from 'protobufjs';
import type { TEnum, TField, TMessage, TMethod, TService } from './types';
import type protobufjs from 'protobufjs';
import genResponseData from './gen-response-data';

interface HasName {
  name: string;
  fullName: string;
  comment: string;
}

interface HasAuthor {
  author: string;
}

function formatFullName(fullName: string): string {
  return fullName.replace(/^\./, '');
}

export type IInspectNamespace =
  | {
      json: HasName & INamespace;
      services: TService[];
      methods: TMethod[];
      messages: TMessage[];
      enums: TEnum[];
    }
  | null
  | undefined;

export function inspectNamespace(namespace: ReflectionObject & INamespace): IInspectNamespace {
  const collectServices: TService[] = [];
  const collectMethods: TMethod[] = [];
  const collectMessages: TMessage[] = [];
  const collectEnums: TEnum[] = [];
  const { nested, name, fullName, comment } = namespace;
  if (typeof nested !== 'undefined') {
    const cloneNested: any = {};
    Object.keys(nested).forEach((key) => {
      const reflectionObject = nested[key];

      const asNamespace = reflectionObject as Namespace;
      const asType = reflectionObject as Type;
      const asService = reflectionObject as Service;
      const asEnum = reflectionObject as Enum;

      if (typeof asNamespace.nested !== 'undefined') {
        const namespace1 = inspectNamespace(asNamespace);
        if (namespace1) {
          cloneNested[key] = namespace1.json;

          collectMessages.push(...namespace1.messages);
          collectMethods.push(...namespace1.methods);
          collectServices.push(...namespace1.services);
          collectEnums.push(...namespace1.enums);
        }
      }
      if (typeof asType.fields !== 'undefined') {
        const inspectType1 = inspectType(asType);
        cloneNested[key] = inspectType1.json;

        collectMethods.push(...inspectType1.methods);
        collectMessages.push(...inspectType1.messages);
        collectServices.push(...inspectType1.services);
      }
      if (typeof asService.methods !== 'undefined') {
        const inspectService1 = inspectService(asService);
        cloneNested[key] = inspectService1.json;

        collectMethods.push(...inspectService1.methods);
        collectServices.push(...inspectService1.services);
      }
      if (typeof asEnum.values !== 'undefined') {
        const inspectEnum1 = inspectEnum(asEnum);
        cloneNested[key] = inspectEnum1.json;

        collectEnums.push(...inspectEnum1.enums);
      }
    });
    return {
      json: {
        name,
        fullName: formatFullName(fullName),
        nested: cloneNested,
        comment: comment as string,
      },
      services: uniqBy(collectServices, 'fullName'),
      methods: uniqBy(collectMethods, 'fullName'),
      messages: uniqBy(collectMessages, 'fullName'),
      enums: uniqBy(collectEnums, 'fullName'),
    };
  }
  return null;
}

function inspectType(message: Type): {
  json: IType & HasName;
  services: TService[];
  methods: TMethod[];
  messages: TMessage[];
} {
  const collectServices: TService[] = [];
  const collectMethods: TMethod[] = [];
  const collectMessages: TMessage[] = [];

  const { nested } = message;
  const typeClone: IType & HasName = {
    fields: {},
    name: message.name,
    fullName: formatFullName(message.fullName),
    comment: message.comment as string,
  };
  if (nested) {
    const inspectNamespace1 = inspectNamespace(message);
    if (inspectNamespace1) {
      typeClone.nested = inspectNamespace1.json.nested;
      collectServices.push(...inspectNamespace1.services);
      collectMethods.push(...inspectNamespace1.methods);
      collectMessages.push(...inspectNamespace1.messages);
    }
  }

  const fields: TField[] = [];
  Object.keys(message.fields).forEach((key) => {
    const field: Field = message.fields[key];
    const { type, name, repeated, defaultValue, bytes, id } = field;

    let { comment, required } = field;

    const regExp = /\n?\s*@required/;
    if (comment && regExp.test(comment)) {
      comment = comment.replace(regExp, '');
      required = true;
    }

    const fieldClone = {
      name,
      type,
      id,
      comment,
      required,
      repeated,
      defaultValue,
      bytes,
    } as TField;

    fields.push(fieldClone);

    typeClone.fields[key] = fieldClone;
  });
  collectMessages.push({
    name: message.name,
    fullName: formatFullName(message.fullName),
    comment: message.comment as string,
    fields,
    filename:
      message.filename &&
      (message.filename as string).replace(/^.+\/.load-proto-cache\/[^/]+\//, ''),
  });
  return {
    json: typeClone,
    services: collectServices,
    messages: collectMessages,
    methods: collectMethods,
  };
}

function inspectEnum(enum1: Enum): {
  json: IEnum & HasName;
  enums: TEnum[];
} {
  const collectEnums: TEnum[] = [];

  const clone: TEnum = {
    values: enum1.values,
    name: enum1.name,
    fullName: formatFullName(enum1.fullName),
    comment: enum1.comment as string,
    comments: enum1.comments,
    filename:
      enum1.filename && (enum1.filename as string).replace(/^.+\/.load-proto-cache\/[^/]+\//, ''),
  };

  collectEnums.push(clone);
  return {
    json: clone,
    enums: collectEnums,
  };
}

const regExpAuthor = /\n?\s*@author\s+([^\n]+)/;

function getAuthor(comment: string | null): {
  author: string | undefined | null;
  comment: string | undefined | null;
} {
  if (!comment) {
    return { author: null, comment };
  }

  let author;

  if (regExpAuthor.test(comment)) {
    const execRes = regExpAuthor.exec(comment);
    if (execRes) {
      author = execRes[1];
    }

    comment = comment.replace(regExpAuthor, '');
  }
  return { author, comment };
}

function inspectService(service: Service): {
  json: IService & HasName;
  services: TService[];
  methods: TMethod[];
} {
  const collectServices: TService[] = [];
  const collectMethods: TMethod[] = [];

  const res = getAuthor(service.comment);
  const { author } = res;
  const clone: IService & HasName & HasAuthor = {
    methods: {},
    name: service.name,
    fullName: formatFullName(service.fullName),
    comment: res.comment as string,
    author: author as string,
  };
  Object.keys(service.methods).forEach((key) => {
    const method = service.methods[key];
    const {
      name,
      type,
      options,
      requestType,
      responseType,
      requestStream,
      responseStream,
      fullName,
    } = method;

    let { comment } = method;

    const authorAndComment = getAuthor(comment);
    comment = authorAndComment.comment as string;

    const methodClone = {
      name,
      fullName: formatFullName(fullName),
      type,
      comment,
      options,
      requestType,
      responseType,
      requestStream,
      responseStream,
      author: authorAndComment.author,
    } as IMethod & HasName;
    collectMethods.push(methodClone);
    clone.methods[key] = methodClone;
  });

  const { methods: methodsClone, nested: nestedClone, ...restClone } = clone;

  collectServices.push({
    ...restClone,
    methods: collectMethods,
    filename:
      service.filename &&
      (service.filename as string).replace(/^.+\/.load-proto-cache\/[^/]+\//, ''),
  });

  return {
    json: clone,
    services: collectServices,
    methods: collectMethods,
  };
}

export const genImplementationData = (
  path: string,
  methods: TMethod[],
  protoName: string,
  root: protobufjs.Root,
  longsTypeToString: boolean,
) => {
  const data: string[] = [];
  methods.map((item) => {
    const serviceNamePath = item.fullName.substring(0, item.fullName.lastIndexOf('.'));
    const pathIndex = path.indexOf(serviceNamePath);
    if (pathIndex > -1 && pathIndex === path.length - serviceNamePath.length) {
      let typePath = `${protoName}.${item.responseType}`;
      // responseType 默认Message不能有. 存在时表明是其它命名空间下的类型
      if (item.responseType.indexOf('.') > -1) {
        typePath = `${item.responseType}`;
      }
      const typeMessage = root.lookupType(typePath);

      const response = genResponseData({
        typeMessage,
        protoName,
        root,
        longsTypeToString,
      });

      data.push(
        `${item.name}: {
          /** mock 错误数据 */
          error: CustomData['${path}']?.${item.name}?.error,
          /** mock 正常响应数据 */
          response: CustomData['${path}']?.${item.name}?.response ?? ${response},
          /** mock metadata数据 */
          metadata: CustomData['${path}']?.${item.name}?.metadata,
          /** mock 多场景响应数据,请在自定义目录下重写 */
          sceneData: CustomData['${path}']?.${item.name}?.sceneData ?? [],
        },`,
      );
    }
  });

  return `{
    ${data.join('\n')}
  },`;
};

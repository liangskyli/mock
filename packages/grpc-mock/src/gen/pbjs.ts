import { lodash } from '@liangskyli/utils';
import type {
  Enum,
  INamespace,
  Namespace,
  Root,
  Service,
  Type,
} from 'protobufjs';
import type {
  TEnum,
  TField,
  TMessage,
  TMethod,
  TNamespace,
  TService,
  TServiceJson,
  TType,
} from '../types';
import type { IDefaultMockData } from '../utils';
import genResponseData from './gen-response-data';

function formatFullName(fullName: string): string {
  return fullName.replace(/^\./, '');
}

export type IInspectNamespace =
  | {
      json: TNamespace;
      services: TService[];
      methods: TMethod[];
      messages: TMessage[];
      enums: TEnum[];
    }
  | null
  | undefined;

type IInspectType = {
  json: TType;
  services: TService[];
  methods: TMethod[];
  messages: TMessage[];
};
function inspectType(message: Type): IInspectType {
  const collectServices: TService[] = [];
  const collectMethods: TMethod[] = [];
  const collectMessages: TMessage[] = [];

  const { nested } = message;
  const cloneTypeJson: IInspectType['json'] = {
    fields: {},
    name: message.name,
    fullName: formatFullName(message.fullName),
    comment: message.comment,
  };
  if (nested) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const inspectNamespace1 = inspectNamespace(message);
    if (inspectNamespace1) {
      cloneTypeJson.nested = inspectNamespace1.json.nested;
      collectServices.push(...inspectNamespace1.services);
      collectMethods.push(...inspectNamespace1.methods);
      collectMessages.push(...inspectNamespace1.messages);
    }
  }

  const fields: TField[] = [];
  Object.keys(message.fields).forEach((key) => {
    const field = message.fields[key];
    const { type, name, repeated, defaultValue, bytes, id } = field;

    let { comment, required } = field;

    const regExp = /\n?\s*@required/;
    if (comment && regExp.test(comment)) {
      comment = comment.replace(regExp, '');
      required = true;
    }

    const fieldClone: TField = {
      name,
      type,
      id,
      comment,
      required,
      repeated,
      defaultValue,
      bytes,
    };

    fields.push(fieldClone);

    cloneTypeJson.fields[key] = fieldClone;
  });
  collectMessages.push({
    name: message.name,
    fullName: formatFullName(message.fullName),
    comment: message.comment,
    fields,
    filename:
      message.filename &&
      message.filename.replace(/^.+\/.load-proto-cache\/[^/]+\//, ''),
  });
  return {
    json: cloneTypeJson,
    services: collectServices,
    messages: collectMessages,
    methods: collectMethods,
  };
}

type IInspectEnum = {
  json: TEnum;
  enum: TEnum;
};
function inspectEnum(enum1: Enum): IInspectEnum {
  const cloneEnumJson: IInspectEnum['json'] = {
    values: enum1.values,
    name: enum1.name,
    fullName: formatFullName(enum1.fullName),
    comment: enum1.comment,
    comments: enum1.comments,
    filename:
      enum1.filename &&
      enum1.filename.replace(/^.+\/.load-proto-cache\/[^/]+\//, ''),
  };

  return {
    json: cloneEnumJson,
    enum: cloneEnumJson,
  };
}

type IInspectService = {
  json: TServiceJson;
  service: TService;
  methods: TMethod[];
};
function inspectService(service: Service): IInspectService {
  const collectMethods: TMethod[] = [];

  const cloneServiceJson: IInspectService['json'] = {
    methods: {},
    name: service.name,
    fullName: formatFullName(service.fullName),
    comment: service.comment,
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
      comment,
    } = method;

    const methodClone: TMethod = {
      name,
      fullName: formatFullName(fullName),
      type,
      options,
      requestType,
      responseType,
      requestStream,
      responseStream,
      comment,
    };
    collectMethods.push(methodClone);
    cloneServiceJson.methods[key] = {
      ...methodClone,
      comment: methodClone.comment ?? '',
    };
  });

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    methods: methodsClone,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nested: nestedClone,
    ...restClone
  } = cloneServiceJson;

  const collectService: TService = {
    ...restClone,
    methods: collectMethods,
    filename:
      service.filename &&
      service.filename.replace(/^.+\/.load-proto-cache\/[^/]+\//, ''),
  };

  return {
    json: cloneServiceJson,
    service: collectService,
    methods: collectMethods,
  };
}

export function inspectNamespace(namespace: Namespace): IInspectNamespace {
  const collectServices: TService[] = [];
  const collectMethods: TMethod[] = [];
  const collectMessages: TMessage[] = [];
  const collectEnums: TEnum[] = [];
  const { nested, name, fullName, comment } = namespace;
  if (typeof nested !== 'undefined') {
    const cloneNested: INamespace['nested'] = {};
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
        collectServices.push(inspectService1.service);
      }
      if (typeof asEnum.values !== 'undefined') {
        const inspectEnum1 = inspectEnum(asEnum);
        cloneNested[key] = inspectEnum1.json;

        collectEnums.push(inspectEnum1.enum);
      }
    });
    return {
      json: {
        name,
        fullName: formatFullName(fullName),
        nested: cloneNested,
        comment: comment,
      },
      services: lodash.uniqBy(collectServices, 'fullName'),
      methods: lodash.uniqBy(collectMethods, 'fullName'),
      messages: lodash.uniqBy(collectMessages, 'fullName'),
      enums: lodash.uniqBy(collectEnums, 'fullName'),
    };
  }
  return null;
}

type IGenImplementationDataOpts = {
  path: string;
  methods: TMethod[];
  protoName: string;
  root: Root;
  longsTypeToString: boolean;
  defaultMockData?: Partial<IDefaultMockData>;
};

export const genImplementationData = (opts: IGenImplementationDataOpts) => {
  const { path, methods, protoName, root, longsTypeToString, defaultMockData } =
    opts;
  const data: string[] = [];
  methods.forEach((item) => {
    const serviceNamePath = item.fullName.substring(
      0,
      item.fullName.lastIndexOf('.'),
    );
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
        root,
        longsTypeToString,
        defaultMockData,
      });
      const methodComment = item.comment ? `/** ${item.comment} */` : '';
      data.push(
        `${methodComment}
        ${item.name}: {
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

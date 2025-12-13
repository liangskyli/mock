import type { Enum, MapField, ReflectionObject, Root, Type } from 'protobufjs';
import {
  PROTO_TYPE_2_TS_TYPE_MAP,
  getDefaultMockData,
  longsType,
  type IDefaultMockData,
} from '../utils';

type IOpts = {
  typeMessage: Type;
  root: Root;
  longsTypeToString: boolean;
  defaultMockData?: Partial<IDefaultMockData>;
};

export default function genResponseData(opts: IOpts): string {
  const { typeMessage, root, longsTypeToString, defaultMockData = {} } = opts;

  const commentReg = /(@optional)|(@option)|[\r\n]/g;
  const repeatList: string[] = [];

  const genEnumObj = (type: Enum) => {
    const { valuesById, comments } = type;
    let firstValue = '';
    const enumCommentArr: string[] = [];
    Object.keys(valuesById).forEach((value, index) => {
      if (index === 0) {
        firstValue = value;
      }
      enumCommentArr.push(
        `${value}:${comments[`${valuesById[value as unknown as number]}`]}`,
      );
    });
    const enumCommentStr =
      enumCommentArr.length > 0 ? `/** ${enumCommentArr.join(';')} */` : '';
    return { firstValue, enumCommentStr };
  };

  const generateWithMapFieldValue = (
    fieldKeyType: string | undefined,
    fieldValue: string | number | boolean,
  ) => {
    if (fieldKeyType) {
      // map key only support string and int32
      if (fieldKeyType === 'int32') {
        fieldValue = `{${getDefaultMockData('number', defaultMockData)}:${fieldValue}}`;
      } else {
        fieldValue = `{${getDefaultMockData('mapString', defaultMockData)}:${fieldValue}}`;
      }
    }
    return fieldValue;
  };

  const genFieldObj = (type: Type) => {
    const { fields } = type;
    const jsonArr: string[] = [];
    Object.keys(fields).forEach((field) => {
      const {
        type: fieldType,
        keyType: fieldKeyType,
        repeated,
        comment,
      } = fields[field] as unknown as MapField;
      const originalTsType = PROTO_TYPE_2_TS_TYPE_MAP[fieldType];
      let tsType = originalTsType;
      const stringNumber =
        longsType.indexOf(fieldType) > -1 && longsTypeToString;
      if (tsType) {
        if (stringNumber) {
          tsType = 'string';
        }
      }

      const commentFilter = comment ? comment.replace(commentReg, '') : '';
      const commentStr = commentFilter ? `/** ${commentFilter} */` : '';
      if (commentStr) {
        jsonArr.push(commentStr);
      }

      let fieldValue: ReturnType<typeof getDefaultMockData> = '';
      if (tsType !== undefined) {
        if (tsType === 'string') {
          fieldValue = `'${field}'`;
          if (originalTsType) {
            if (stringNumber) {
              fieldValue = getDefaultMockData('stringNumber', defaultMockData);
            }
          }
        } else {
          fieldValue = getDefaultMockData(
            tsType as keyof IDefaultMockData,
            defaultMockData,
          );
        }
        if (repeated) {
          jsonArr.push(
            `${field}: [${generateWithMapFieldValue(fieldKeyType, fieldValue)}],`,
          );
        } else {
          jsonArr.push(
            `${field}: ${generateWithMapFieldValue(fieldKeyType, fieldValue)},`,
          );
        }
      } else {
        if (repeated) {
          repeatList.push(fieldType);
        }
        const repeatCount = repeatList.filter((value) => {
          return value === fieldType;
        }).length;
        // 防止死循环
        if (!repeated || (repeatCount < 2 && repeated)) {
          const typePath = `${fieldType}`;
          const lookupTypeOrEnumMessage = root.lookupTypeOrEnum(
            typePath,
          ) as ReflectionObject;
          const asType = lookupTypeOrEnumMessage as Type;
          const asEnum = lookupTypeOrEnumMessage as Enum;
          if (typeof asType.fields !== 'undefined') {
            const dataObj = genFieldObj(asType);
            let str = '';
            if (repeated) {
              str = `[{${dataObj.join('\n')}}]`;
            } else {
              str = `{${dataObj.join('\n')}}`;
            }

            jsonArr.push(
              `${field}: ${generateWithMapFieldValue(fieldKeyType, str)},`,
            );
          }
          if (typeof asEnum.values !== 'undefined') {
            const dataEnumObj = genEnumObj(asEnum);
            if (dataEnumObj.enumCommentStr) {
              jsonArr.push(dataEnumObj.enumCommentStr);
            }
            jsonArr.push(
              `${field}: ${generateWithMapFieldValue(fieldKeyType, dataEnumObj.firstValue)},`,
            );
          }
        } else {
          // only repeated
          jsonArr.push(`${field}: [],`);
        }
      }
    });
    return jsonArr;
  };

  const dataObj: string[] = genFieldObj(typeMessage);
  return `{${dataObj.join('\n')}}`;
}

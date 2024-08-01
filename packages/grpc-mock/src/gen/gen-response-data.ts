import type { Enum, MapField, ReflectionObject, Root, Type } from 'protobufjs';
import {
  PROTO_TYPE_2_TS_TYPE_MAP,
  TS_TYPE_2_DEFAULT_MAP,
  longsType,
} from '../utils';

type IOpts = {
  typeMessage: Type;
  root: Root;
  longsTypeToString: boolean;
};

let repeatList: string[] = [];

export default function genResponseData(opts: IOpts): string {
  const { typeMessage, root, longsTypeToString } = opts;

  const commentReg = /(@optional)|(@option)|[\r\n]/g;
  repeatList = [];

  const genEnumObj = (type: Enum) => {
    const { valuesById, comments } = type;
    let firstValue = '';
    const enumCommentArr: string[] = [];
    Object.keys(valuesById).forEach((value, index) => {
      if (index === 0) {
        firstValue = value;
      }
      enumCommentArr.push(
        `${value}:${comments[`${valuesById[value as any]}`]}`,
      );
    });
    const enumCommentStr =
      enumCommentArr.length > 0 ? `/** ${enumCommentArr.join(';')} */` : '';
    return { firstValue, enumCommentStr };
  };

  const generateWithMapFieldValue = (
    fieldKeyType: string | undefined,
    fieldValue: string,
  ) => {
    if (fieldKeyType) {
      // map key only support string and int32
      if (fieldKeyType === 'int32') {
        fieldValue = `{1:${fieldValue}}`;
      } else {
        fieldValue = `{string:${fieldValue}}`;
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

      let fieldValue: any = null;
      if (tsType !== undefined) {
        if (tsType === 'string') {
          fieldValue = `'${field}'`;
          if (originalTsType) {
            if (stringNumber) {
              fieldValue = TS_TYPE_2_DEFAULT_MAP['stringNumber'];
            }
          }
        } else {
          fieldValue = TS_TYPE_2_DEFAULT_MAP[tsType];
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
        repeatList.push(fieldType);
        const repeatCount = repeatList.filter((value) => {
          return value === fieldType;
        }).length;
        // 防止死循环
        if (repeatCount < 2) {
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
          if (repeated) {
            jsonArr.push(`${field}: [],`);
          } else {
            jsonArr.push(`${field}: {},`);
          }
        }
      }
    });
    return jsonArr;
  };

  const dataObj: string[] = genFieldObj(typeMessage);
  return `{${dataObj.join('\n')}}`;
}

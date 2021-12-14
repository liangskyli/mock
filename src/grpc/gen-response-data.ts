import type * as protobufjs from 'protobufjs';
import {
  longsType,
  PROTO_TYPE_2_TS_TYPE_MAP,
  stringLeftNumber,
  TS_TYPE_2_DEFAULT_MAP,
} from './utils';

type IOpts = {
  typeMessage: protobufjs.Type;
  protoName: string;
  root: protobufjs.Root;
  longsTypeToString: boolean;
};

let repeatList: string[] = [];

export default function genResponseData(opts: IOpts): string {
  const { typeMessage, protoName, root, longsTypeToString } = opts;

  const commentReg = /(@optional)|(@option)|[\r\n]/g;
  repeatList = [];

  const genFieldObj = (type: protobufjs.Type) => {
    const { fields } = type;
    const jsonArr: string[] = [];
    Object.keys(fields).map((field) => {
      const { type: fieldType, rule, comment } = fields[field];
      const originalTsType = PROTO_TYPE_2_TS_TYPE_MAP[fieldType];
      let tsType = originalTsType;
      if (tsType) {
        if (longsType.indexOf(fieldType) > -1 && longsTypeToString) {
          tsType = 'string';
        }
      }

      const commentFilter = comment ? comment.replace(commentReg, '') : '';
      const commentStr = commentFilter ? `/** ${commentFilter} */` : '';

      let fieldValue: any = null;
      if (tsType !== undefined) {
        if (tsType === 'string') {
          fieldValue = `'${field}'`;
          if (originalTsType) {
            if (longsType.indexOf(fieldType) > -1 && longsTypeToString) {
              fieldValue = TS_TYPE_2_DEFAULT_MAP[tsType];
            }
          }
        } else {
          fieldValue = TS_TYPE_2_DEFAULT_MAP[tsType];
        }
        if (commentStr) {
          jsonArr.push(commentStr);
        }
        if (rule === 'repeated') {
          jsonArr.push(`${field}: [${fieldValue}],`);
        } else {
          jsonArr.push(`${field}: ${fieldValue},`);
        }
      } else {
        jsonArr.push(commentStr);
        repeatList.push(fieldType);
        const repeatCount = repeatList.filter((value) => {
          return value === fieldType;
        }).length;
        // 防止死循环
        if (repeatCount < 2) {
          let typePath = `${protoName}.${fieldType}`;
          // typePath不能有. 存在时表明是其它命名空间下的类型
          if (typePath.indexOf('.') > -1) {
            typePath = `${fieldType}`;
          }
          const dataObj = genFieldObj(root.lookupType(typePath));

          let str = '';
          if (rule === 'repeated') {
            str = stringLeftNumber('[\n', 2);
            str = str + stringLeftNumber('{\n', 4);
            str = str + stringLeftNumber(dataObj.join('\n'), 4);
            str = str + stringLeftNumber('\n}', 2);
            str = str + stringLeftNumber('\n]', 0);
          } else {
            dataObj.unshift('{');
            str = str + stringLeftNumber(dataObj.join('\n'), 2);
            str = str + stringLeftNumber('\n}', 0);
          }

          jsonArr.push(`${field}: ${str},`);
        } else {
          if (rule === 'repeated') {
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
  if (dataObj.length > 0) {
    dataObj.unshift('{');
    let str = stringLeftNumber(dataObj.join('\n'), 10);
    str = str + stringLeftNumber('\n}', 8);
    return str;
  } else {
    dataObj.unshift('{}');
    return stringLeftNumber(dataObj.join('\n'), 10);
  }
}

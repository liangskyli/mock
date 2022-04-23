import { lodash } from '@liangskyli/utils';

export const fileTip = '// This file is auto generated by http-mock-gen, do not edit!';

export const packageName = '@liangskyli/http-mock-gen';

type AssignCustomizer = (
  objectValue: any,
  sourceValue: any,
  key?: string,
  object?: {},
  source?: {},
) => any;

const customizer: AssignCustomizer = (value, srcValue) => {
  if (lodash.isObject(value)) {
    if (lodash.isArray(value)) {
      if (lodash.isArray(srcValue) && srcValue.length > 0) {
        return value.map((item) => {
          return lodash.mergeWith(item, srcValue[0], customizer);
        });
      } else {
        return value;
      }
    } else {
      return lodash.mergeWith(value, srcValue, customizer);
    }
  } else {
    return value === undefined ? srcValue : value;
  }
};

// 自定义数据和默认数据合并
export const mergeObject = (object: any, source: any) => {
  return lodash.mergeWith(object, source, customizer);
};

import { methodList } from '@liangskyli/openapi-gen-ts';
import type { IPrettierOptions } from '@liangskyli/utils';
import { colors, copyOptions, lodash, prettierData } from '@liangskyli/utils';
import fs from 'fs-extra';

export const fileTip =
  '// This file is auto generated by @liangskyli/http-mock-gen, do not edit!';

export const packageName = '@liangskyli/http-mock-gen';

type AssignCustomizer = (
  objectValue: any,
  sourceValue: any,
  key?: string,
  object?: any,
  source?: any,
) => any;

const customizer: AssignCustomizer = (value, srcValue) => {
  if (lodash.isObject(value)) {
    if (lodash.isArray(value)) {
      if (lodash.isArray(srcValue) && srcValue.length > 0) {
        return value.map((item) => {
          if (lodash.isObject(item)) {
            return lodash.mergeWith(item, srcValue[0], customizer);
          } else {
            // simple array data, no merge, use new value
            return item;
          }
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

const mergeUndefined = (temp: any, custom: any) => {
  if (lodash.isObject(custom)) {
    if (lodash.isArray(custom)) {
      custom.forEach((item, index) => {
        if (lodash.isObject(item)) {
          mergeUndefined(temp[index], item);
        } else {
          if (item === undefined) {
            temp[index] = undefined;
          }
        }
      });
    } else {
      Object.keys(custom).forEach((key) => {
        const item = (custom as any)[key];
        if (lodash.isObject(item)) {
          mergeUndefined(temp[key], item);
        } else {
          if (item === undefined) {
            temp[key] = undefined;
          }
        }
      });
    }
  }
  return temp;
};

// 自定义数据和默认数据合并
export const mergeObject = (object: any, source: any) => {
  const tempData = lodash.mergeWith(
    lodash.cloneDeep(object),
    source,
    customizer,
  );
  // 自定义undefined数据覆盖默认数据
  const result = mergeUndefined(tempData, object);
  return result;
};

type IWriteFileOpts = {
  prettierOptions?: IPrettierOptions;
  absolutePath: string;
  data: string;
  successTip: string;
};
export const writePrettierFile = async (opts: IWriteFileOpts) => {
  const { absolutePath, prettierOptions, data, successTip } = opts;

  fs.writeFileSync(
    absolutePath,
    await prettierData(data, copyOptions(prettierOptions)),
  );

  console.info(colors.green(successTip));
};

export const getMethodData = (itemValue: any) => {
  // support all openapi method
  const result: { method: string; data: any }[] = [];
  let responseMediaType = '';
  methodList.forEach((item) => {
    if (itemValue?.[item]) {
      const method = item;
      const responsesProperties = itemValue[item]?.responses;
      // first use responses 200, then use responses default
      let responseCode: '200' | 'default' = '200';
      if (!responsesProperties?.['200']) {
        responseCode = 'default';
      }
      // first use responses 200, then use responses default
      const responsesContent = responsesProperties?.[responseCode]?.content;
      if (responsesContent) {
        // responses content only use first key
        responseMediaType = Object.keys(responsesContent)[0];
      }

      const data = responsesContent?.[responseMediaType] ?? {};
      result.push({ method, data });
    }
  });
  return result;
};

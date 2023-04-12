import type { IAPIRequest, PartialAll } from '@liangskyli/openapi-gen-ts';
import type { Request } from 'express';
import genMockData from './gen/index';
import type {
  ICustomData,
  ICustomDataValue,
  ICustomsData,
} from './gen/mock-interface-type';
import { mergeObject } from './utils';

const getMockData = <T = any>(
  defaultData: T,
  req: Request,
  data?: ICustomData<PartialAll<T>>['string'],
) => {
  let json = data?.response;
  if (typeof json === 'function') {
    json = json();
  }
  if (data?.sceneData) {
    data.sceneData.some((sceneItem) => {
      if (sceneItem.requestCase(req)) {
        json = sceneItem.response;
        if (typeof json === 'function') {
          json = json();
        }
        return true;
      }
      return false;
    });
  }
  if (!json) {
    json = defaultData;
  } else {
    // 智能合并对象
    json = mergeObject(json, defaultData);
  }
  return json;
};

export { commandCodeGenCli } from './cli/http-mock-code-gen';
export type { IGenMockDataOpts, IGenMockDataOptsCLI } from './gen/index';
export { getMockData };
export type {
  ICustomData,
  ICustomDataValue,
  ICustomsData,
  IAPIRequest,
  PartialAll,
};
export default genMockData;

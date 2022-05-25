import type { PartialAll, IAPIRequest } from '@liangskyli/openapi-gen-ts';
import genMockData from './gen/index';
import type { Request } from 'express';
import type { ICustomData, ICustomsData, ICustomDataValue } from './gen/mock-interface-type';
import { mergeObject } from './utils';

const getMockData = <T = any>(
  defaultData: T,
  req: Request,
  data?: ICustomData<PartialAll<T>>['string'],
) => {
  let json = data?.response;
  if (data?.sceneData) {
    data.sceneData.some((sceneItem) => {
      if (sceneItem.requestCase(req)) {
        json = sceneItem.response;
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

export type { IGenMockDataOpts } from './gen/index';
export default genMockData;
export { getMockData };
export type { ICustomData, ICustomDataValue, ICustomsData, IAPIRequest, PartialAll };

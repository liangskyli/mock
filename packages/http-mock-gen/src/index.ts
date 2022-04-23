import genMockData from './gen/index';
import { Request } from 'express';
import { ICustomData, ICustomsData, ICustomDataValue } from './gen/mock-interface-type';
import { mergeObject } from './utils';

type IAPIRequest = (param: {
  url?: string;
  method?: 'get' | 'GET' | 'post' | 'POST';
  params?: any;
  data?: any;
  [k: string]: any;
}) => Promise<any>;
type PartialAll<T> = {
  [P in keyof T]?: PartialAll<T[P]>;
};

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

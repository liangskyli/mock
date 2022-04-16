import genMockData from './gen/index';
import { Request } from 'express';
import { ICustomData } from './gen/mock-interface-type';

const getMockData = <T = any>(defaultData: T, req: Request, data?: ICustomData<T>['string']) => {
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
  }
  return json;
};

export type { IGenMockDataOpts } from './gen/index';
export default genMockData;
export { getMockData };
export type { ICustomData };

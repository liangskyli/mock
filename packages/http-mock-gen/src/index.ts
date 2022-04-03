import genMockData from './gen/index';
import { Request } from 'express';
import { ICustomData } from './gen/mock-interface-type';

const getMockData = (req: Request, data?: ICustomData['string']) => {
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
  return json;
};

export type { IGenMockDataOpts } from './gen/index';
export default genMockData;
export { getMockData };
export type { ICustomData };

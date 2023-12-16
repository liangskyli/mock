import type { IAPIRequest, PartialAll } from '@liangskyli/openapi-gen-ts';
import type { Request, Response } from 'express';
import type { IGenMockDataOpts, IGenMockDataOptsCLI } from './gen';
import genMockData from './gen/index';
import type {
  ICustomData,
  ICustomDataMethods,
  ICustomDataValue,
  ICustomsData,
} from './gen/mock-interface-type';
import { mergeObject } from './utils';

const getMockData = <T = any>(
  defaultData: T,
  req: Request,
  data?: ICustomDataValue<PartialAll<T>>,
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

const defineConfig = (config: IGenMockDataOptsCLI) => {
  return config;
};

export { commandCodeGenCli } from './cli/http-mock-code-gen';
export { defineConfig, getMockData };
export type {
  IAPIRequest,
  ICustomData,
  ICustomDataMethods,
  ICustomsData,
  IGenMockDataOpts,
  IGenMockDataOptsCLI,
  PartialAll,
  Request,
  Response,
};
export default genMockData;

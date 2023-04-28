import type { IPrettierOptions } from '@liangskyli/utils';
import { getRelativePath, winPath } from '@liangskyli/utils';
import fs from 'fs-extra';
import path from 'path';
import {
  fileTip,
  getMethodData,
  packageName,
  writePrettierFile,
} from '../../utils';
import { GenCustomData } from './gen-custom-data';

export type IGenInterfaceMockDataOpts = {
  genTsAbsolutePath: string;
  mockDataAbsolutePath: string;
  genMockAbsolutePath: string;
  prettierOptions?: IPrettierOptions;
  mockPathPrefix?: string;
};

export class GenInterfaceMockData {
  private readonly opts: IGenInterfaceMockDataOpts;

  constructor(opts: IGenInterfaceMockDataOpts) {
    this.opts = opts;
    this.generator();
  }
  private genInterfaceMockData(
    mockData: any,
    interfaceApiRelativePath: string,
  ) {
    const { mockPathPrefix = '' } = this.opts;
    let IApiRelativePath = winPath(interfaceApiRelativePath);
    if (!IApiRelativePath.startsWith('.')) {
      IApiRelativePath = `./${IApiRelativePath}`;
    }
    const interfaceMockData: string[] = [];
    interfaceMockData.push(`${fileTip}
    import type { Request, Response } from "express";
    import CustomData from "./custom-data";
    import { getMockData } from "${packageName}";
    import type { ICustomData, PartialAll } from "${packageName}";
    import type { IApi } from '${IApiRelativePath}';
  `);

    interfaceMockData.push('\n export default {');
    Object.keys(mockData).forEach((item) => {
      const { method, data } = getMethodData(mockData[item]);
      if (method) {
        interfaceMockData.push(`'${method} ${mockPathPrefix}${item}': (req: Request, res: Response) => {
        type IData = IApi['${item}']['Response'];
        const data = (CustomData as ICustomData<PartialAll<IData>>)['${item}'];
        const json = getMockData<IData>(${JSON.stringify(data)},req, data);
        res.json(json);
      },`);
      }
    });

    interfaceMockData.push('}');
    return interfaceMockData.join('');
  }
  private generator() {
    const {
      genTsAbsolutePath,
      mockDataAbsolutePath,
      genMockAbsolutePath,
      prettierOptions,
    } = this.opts;

    const interfaceApiRelativePath = path.join(
      getRelativePath(genMockAbsolutePath, genTsAbsolutePath),
      'interface-api',
    );

    const mockData = fs.readJSONSync(mockDataAbsolutePath);
    // 生成自定义数据模版
    const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');
    new GenCustomData({
      mockData,
      genCustomDataPath,
      interfaceApiRelativePath: path.join('../', interfaceApiRelativePath),
      prettierOptions,
    });

    const interfaceMockData = this.genInterfaceMockData(
      mockData,
      interfaceApiRelativePath,
    );
    this.writeFile(interfaceMockData);
  }

  private writeFile(data: string) {
    const { genMockAbsolutePath, prettierOptions } = this.opts;
    const absolutePath = path.join(
      genMockAbsolutePath,
      'interface-mock-data.ts',
    );

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: 'Generate mock/interface-mock-data.ts file success',
    });
  }
}

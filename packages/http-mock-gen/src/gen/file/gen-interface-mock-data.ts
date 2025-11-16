import type { IPrettierOptions } from '@liangskyli/utils';
import {
  fs,
  getRelativePath,
  winPath,
  writePrettierFile,
} from '@liangskyli/utils';
import path from 'node:path';
import { fileTip, getMethodData, packageName } from '../../utils';
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
    import CustomData from "./custom-data";
    import { getMockData } from "${packageName}";
    import type { ICustomData, PartialAll, Request, Response } from "${packageName}";
    import type { IApi } from '${IApiRelativePath}';
  `);

    interfaceMockData.push('\n export default {');
    Object.keys(mockData).forEach((item) => {
      const resultData = getMethodData(mockData[item]);
      // get all method
      resultData.forEach(({ method, data }) => {
        if (method) {
          // router path to express path, example: /path1/{path2} to /path1/:path2
          const urlPath = `${mockPathPrefix}${item}`.replace(
            /(\/)?{(\w+)}(\(.*?\))?(\*)?(\?)?/g,
            '$1:$2',
          );
          // method toUpperCase for express method
          interfaceMockData.push(`'${method.toUpperCase()} ${urlPath}': (req: Request, res: Response) => {
        type IData = IApi['${item}']['${method}']['Response'];
        const data = (CustomData as ICustomData<PartialAll<IData>,'${item}','${method}'>)['${item}']?.${method};
        const json = getMockData<IData>(${JSON.stringify(data)},req, data);
        res.json(json);
      },`);
        }
      });
    });

    interfaceMockData.push('}');
    return interfaceMockData.join('');
  }
  public async generator() {
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
    await new GenCustomData({
      mockData,
      genCustomDataPath,
      interfaceApiRelativePath: path.join('../', interfaceApiRelativePath),
      prettierOptions,
    }).generator();

    const interfaceMockData = this.genInterfaceMockData(
      mockData,
      interfaceApiRelativePath,
    );
    await this.writeFile(interfaceMockData);
  }

  private async writeFile(data: string) {
    const { genMockAbsolutePath, prettierOptions } = this.opts;
    const absolutePath = path.join(
      genMockAbsolutePath,
      'interface-mock-data.ts',
    );

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: 'Generate mock/interface-mock-data.ts file success',
    });
  }
}

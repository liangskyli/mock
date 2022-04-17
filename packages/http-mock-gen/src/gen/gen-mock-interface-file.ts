import type prettier from 'prettier';
import fs from 'fs-extra';
import path from 'path';
import { copyOptions, prettierData } from '@liangskyli/utils';
import { fileTip, packageName } from '../utils';

type IOpts = {
  mockDataAbsolutePath: string;
  genMockAbsolutePath: string;
  genSchemaAPIAbsolutePath: string;
  prettierOptions?: prettier.Options;
  requestFilePath?: string;
};

const genDefaultCustomData = async (
  genCustomDataPath: string,
  prettierOptions?: prettier.Options,
) => {
  if (!fs.pathExistsSync(path.join(genCustomDataPath, 'index.ts'))) {
    fs.ensureDirSync(genCustomDataPath);
    // 生成默认自定义mock数据入口文件
    const templateData = fs.readFileSync(
      path.join(__dirname, './custom-data-template/template-data.tpl'),
      { encoding: 'utf-8' },
    );
    fs.writeFileSync(
      path.join(genCustomDataPath, 'template-data.ts'),
      await prettierData(
        templateData.replace('packageName', packageName),
        copyOptions(prettierOptions),
      ),
    );
    const templateIndexData = fs.readFileSync(
      path.join(__dirname, './custom-data-template/index.tpl'),
      { encoding: 'utf-8' },
    );
    fs.writeFileSync(
      path.join(genCustomDataPath, 'index.ts'),
      await prettierData(
        templateIndexData.replace('packageName', packageName),
        copyOptions(prettierOptions),
      ),
    );
  }
};

const genMockInterfaceFile = async (opts: IOpts) => {
  const {
    mockDataAbsolutePath,
    genMockAbsolutePath,
    genSchemaAPIAbsolutePath,
    prettierOptions,
    requestFilePath,
  } = opts;

  const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');
  await genDefaultCustomData(genCustomDataPath, prettierOptions);
  const mockData = await import(mockDataAbsolutePath);

  if (!requestFilePath) {
    const requestData: string[] = [];
    requestData.push(`${fileTip}
    import axios from 'axios';
    import type { IAPIRequest } from '${packageName}';
    
    const request: IAPIRequest = (config) => {
      return axios(config).then((res) => res.data);
    };
    
    export default request;
  `);
    const requestDataAbsolutePath = path.join(genSchemaAPIAbsolutePath, 'request.ts');
    fs.writeFileSync(
      requestDataAbsolutePath,
      await prettierData(requestData.join(''), prettierOptions),
    );
    console.info('Generate request.ts file success');
  }

  const interfaceAPIType: string[] = [];
  interfaceAPIType.push(`${fileTip}
  import type { paths } from '${requestFilePath ? requestFilePath : './ts-schema'}';
  `);
  interfaceAPIType.push('\n export interface IApi {');

  const requestAPI: string[] = [];
  requestAPI.push(`${fileTip}
   import request from '${requestFilePath ? requestFilePath : './request'}';
   import type { IApi } from './interface-api';
  `);
  requestAPI.push('\n');
  requestAPI.push(`
    type IConfig<T extends Record<any, any>, U extends Record<any, any>> = T & U;
   `);
  requestAPI.push('\n export const requestApi = {');

  const interfaceMockData: string[] = [];
  interfaceMockData.push(`${fileTip}
    import { Request, Response } from "express";
    import CustomData from "./custom-data";
    import { getMockData, ICustomData } from "${packageName}";
    import type { IApi } from './schema-api/interface-api';
  `);

  interfaceMockData.push('\n export default {');
  Object.keys(mockData).map((item) => {
    const itemValue = mockData[item];
    // method 只支持 get post
    let method = '';
    let data: any = '';
    let haveQuery = false;
    let haveBody = false;
    if (itemValue.get) {
      method = 'GET';
      const content = itemValue.get?.responses?.['200']?.content;
      if (content && content['application/json']) {
        data = content['application/json'];
      } else {
        data = {};
      }
      haveQuery = !!itemValue.get?.parameters?.query;
    }
    if (itemValue.post) {
      method = 'POST';
      const content = itemValue.post?.responses?.['200']?.content;
      if (content && content['application/json']) {
        data = content['application/json'];
      } else {
        data = {};
      }
      haveQuery = !!itemValue.post?.parameters?.query;
      haveBody = !!itemValue.post?.requestBody?.content?.['application/json'];
    }
    if (method) {
      let IConfigT: string[] = [];
      if (haveQuery || haveBody) {
        IConfigT.push('Omit<T, ');
        if (haveQuery) {
          IConfigT.push('"params"');
        }
        if (haveBody) {
          if (haveQuery) {
            IConfigT.push(' | ');
          }
          IConfigT.push('"data"');
        }
        IConfigT.push('>,');
      }

      interfaceMockData.push(`'${method} ${item}': (req: Request, res: Response) => {
        type IData = IApi['${item}']['Response'];
        const data = (CustomData as ICustomData<IData>)['${item}'];
        let json = getMockData(${JSON.stringify(data)},req, data);
        res.json(json);
      },`);

      interfaceAPIType.push(`'${item}': {`);
      requestAPI.push(`'${item}': <T extends Record<any, any>>(
        config: IConfig<
          ${IConfigT.length > 0 ? IConfigT.join('') : 'T,'}
          {
      `);
      if (haveQuery) {
        interfaceAPIType.push(
          `Query: paths['${item}']['${method.toLowerCase()}']['parameters']['query'];`,
        );
        requestAPI.push(`params: IApi['${item}']['Query'];`);
      }
      if (haveBody) {
        interfaceAPIType.push(
          `Body: paths['${item}']['${method.toLowerCase()}']['requestBody']['content']['application/json'];`,
        );
        requestAPI.push(`data: IApi['${item}']['Body'];`);
      }
      interfaceAPIType.push(
        `Response: paths['${item}']['${method.toLowerCase()}']['responses']['200']['content']['application/json'];`,
      );
      interfaceAPIType.push('};');
      requestAPI.push(`}
        >,
      ): Promise<IApi['${item}']['Response']> => {  
      const { ${haveQuery ? 'params,' : ''} ${haveBody ? 'data,' : ''} ...otherConfig } = config;

      return request({
        method: 'GET',
        url: '${item}',
        ${haveQuery ? 'params: params,' : ''}
        ${haveBody ? 'data: data,' : ''}
        ...otherConfig,
      });
    },
      `);
    }
  });

  interfaceMockData.push('}');
  interfaceAPIType.push('}');
  requestAPI.push('}');

  const interfaceMockDataAbsolutePath = path.join(genMockAbsolutePath, 'interface-mock-data.ts');
  fs.writeFileSync(
    interfaceMockDataAbsolutePath,
    await prettierData(interfaceMockData.join(''), prettierOptions),
  );
  console.info('Generate interface-mock-data.ts file success');

  const interfaceAPITypeAbsolutePath = path.join(genSchemaAPIAbsolutePath, 'interface-api.ts');
  fs.writeFileSync(
    interfaceAPITypeAbsolutePath,
    await prettierData(interfaceAPIType.join(''), prettierOptions),
  );

  console.info('Generate schema-api/interface-api.ts file success');

  const requestAPIAbsolutePath = path.join(genSchemaAPIAbsolutePath, 'request-api.ts');
  fs.writeFileSync(
    requestAPIAbsolutePath,
    await prettierData(requestAPI.join(''), prettierOptions),
  );

  console.info('Generate schema-api/request-api.ts file success');
};

export { genMockInterfaceFile };

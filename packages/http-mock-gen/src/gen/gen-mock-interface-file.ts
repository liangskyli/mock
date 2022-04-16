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
  const { mockDataAbsolutePath, genMockAbsolutePath, genSchemaAPIAbsolutePath, prettierOptions } =
    opts;

  const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');
  await genDefaultCustomData(genCustomDataPath, prettierOptions);
  const mockData = await import(mockDataAbsolutePath);

  const interfaceAPIType: string[] = [];
  interfaceAPIType.push(`${fileTip}
  import { paths } from './ts-schema';
  `);
  interfaceAPIType.push('\n export interface API {');

  const interfaceMockData: string[] = [];
  interfaceMockData.push(`${fileTip}
    import { Request, Response } from "express";
    import CustomData from "./custom-data";
    import { getMockData, ICustomData } from "${packageName}";
    import { API } from './schema-api/interface-api';
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
      interfaceMockData.push(`'${method} ${item}': (req: Request, res: Response) => {
        type IData = API['${item}']['Response'];
        const data = (CustomData as ICustomData<IData>)['${item}'];
        let json = getMockData(${JSON.stringify(data)},req, data);
        res.json(json);
      },`);

      interfaceAPIType.push(`'${item}': {`);
      if (haveQuery) {
        interfaceAPIType.push(
          `Query: paths['${item}']['${method.toLowerCase()}']['parameters']['query'];`,
        );
      }
      if (haveBody) {
        interfaceAPIType.push(
          `Body: paths['${item}']['${method.toLowerCase()}']['requestBody']['content']['application/json'];`,
        );
      }
      interfaceAPIType.push(
        `Response: paths['${item}']['${method.toLowerCase()}']['responses']['200']['content']['application/json'];`,
      );
      interfaceAPIType.push('};');
    }
  });

  interfaceMockData.push('}');
  interfaceAPIType.push('}');

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
};

export { genMockInterfaceFile };

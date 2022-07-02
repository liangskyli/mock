import type prettier from 'prettier';
import fs from 'fs-extra';
import path from 'path';
import { colors, copyOptions, prettierData, winPath } from '@liangskyli/utils';
import { fileTip, packageName } from '../utils';

type IOpts = {
  interfaceApiRelativePath: string;
  mockDataAbsolutePath: string;
  genMockAbsolutePath: string;
  prettierOptions?: prettier.Options;
};

type IDefaultOpts = {
  mockData: any;
  genCustomDataPath: string;
  interfaceApiRelativePath: string;
  prettierOptions?: prettier.Options;
};

const getMediaTypeData = (content: any) => {
  return content?.['application/json'] ?? content?.['text/plain'] ?? {};
};

const genDefaultCustomData = async (opts: IDefaultOpts) => {
  const { mockData, genCustomDataPath, interfaceApiRelativePath, prettierOptions } = opts;
  if (!fs.pathExistsSync(path.join(genCustomDataPath, 'index.ts'))) {
    const firstPath = Object.keys(mockData)[0];
    const itemValue = mockData[firstPath];
    let responseData = {};
    if (itemValue.get) {
      const content = itemValue.get?.responses?.['200']?.content;
      responseData = getMediaTypeData(content);
    }
    if (itemValue.post) {
      const content = itemValue.post?.responses?.['200']?.content;
      responseData = getMediaTypeData(content);
    }

    fs.ensureDirSync(genCustomDataPath);
    // 生成默认自定义mock数据入口文件
    const templateData = fs.readFileSync(
      path.join(__dirname, './custom-data-template/template-data.tpl'),
      { encoding: 'utf-8' },
    );
    let IApiRelativePath = winPath(interfaceApiRelativePath);
    if (!IApiRelativePath.startsWith('.')) {
      IApiRelativePath = `./${IApiRelativePath}`;
    }
    fs.writeFileSync(
      path.join(genCustomDataPath, 'template-data.ts'),
      await prettierData(
        templateData
          .replace('packageName', packageName)
          .replace(/{{IApiRelativePath}}/gi, winPath(IApiRelativePath))
          .replace(/{{firstPath}}/gi, firstPath)
          .replace(/{{responseData}}/gi, JSON.stringify(responseData)),
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
    console.info(colors.green('Generate mock/custom-data folder file success'));
  }
};

const genMockInterfaceFile = async (opts: IOpts) => {
  const { interfaceApiRelativePath, mockDataAbsolutePath, genMockAbsolutePath, prettierOptions } =
    opts;

  const mockData = await import(mockDataAbsolutePath);
  // 生成自定义数据模版
  const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');

  await genDefaultCustomData({
    mockData,
    genCustomDataPath,
    interfaceApiRelativePath: path.join('../', interfaceApiRelativePath),
    prettierOptions,
  });

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
  Object.keys(mockData).map((item) => {
    const itemValue = mockData[item];
    // method 只支持 get post
    let method = '';
    let data: any = '';
    if (itemValue.get) {
      method = 'GET';
      const content = itemValue.get?.responses?.['200']?.content;
      data = getMediaTypeData(content);
    }
    if (itemValue.post) {
      method = 'POST';
      const content = itemValue.post?.responses?.['200']?.content;
      data = getMediaTypeData(content);
    }
    if (method) {
      interfaceMockData.push(`'${method} ${item}': (req: Request, res: Response) => {
        type IData = IApi['${item}']['Response'];
        const data = (CustomData as ICustomData<PartialAll<IData>>)['${item}'];
        const json = getMockData<IData>(${JSON.stringify(data)},req, data);
        res.json(json);
      },`);
    }
  });

  interfaceMockData.push('}');

  const interfaceMockDataAbsolutePath = path.join(genMockAbsolutePath, 'interface-mock-data.ts');
  fs.writeFileSync(
    interfaceMockDataAbsolutePath,
    await prettierData(interfaceMockData.join(''), prettierOptions),
  );
  console.info(colors.green('Generate mock/interface-mock-data.ts file success'));
};

export { genMockInterfaceFile };

import type prettier from 'prettier';
import fs from 'fs-extra';
import path from 'path';
import { copyOptions, prettierData } from '@liangskyli/utils';
import { fileTip, packageName } from '../utils';

type IOpts = {
  mockDataAbsolutePath: string;
  genMockAbsolutePath: string;
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
  const { mockDataAbsolutePath, genMockAbsolutePath, prettierOptions } = opts;

  const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');
  await genDefaultCustomData(genCustomDataPath, prettierOptions);
  const mockData = await import(mockDataAbsolutePath);
  const interfaceMockData: string[] = [];
  interfaceMockData.push(`${fileTip}
    import { Request, Response } from "express";
    import CustomData from "./custom-data";
    import { getMockData } from "${packageName}";
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
      if (content && content['application/json']) {
        data = content['application/json'];
      } else {
        data = {};
      }
    }
    if (itemValue.post) {
      method = 'POST';
      const content = itemValue.post?.responses?.['200']?.content;
      if (content && content['application/json']) {
        data = content['application/json'];
      } else {
        data = {};
      }
    }
    if (method) {
      interfaceMockData.push(`'${method} ${item}': (req: Request, res: Response) => {
        const data = CustomData['${item}'];
        let json = getMockData(req, data) ?? ${JSON.stringify(data)};
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

  console.info('Generate mock interface file success');
};

export { genMockInterfaceFile };

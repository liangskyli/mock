import type { IPrettierOptions } from '@liangskyli/utils';
import { colors, copyOptions, prettierData, winPath } from '@liangskyli/utils';
import fs from 'fs-extra';
import path from 'path';
import { fileTip, methodList, packageName } from '../utils';

type IOpts = {
  interfaceApiRelativePath: string;
  mockDataAbsolutePath: string;
  genMockAbsolutePath: string;
  prettierOptions?: IPrettierOptions;
  mockPathPrefix?: string;
};

type IDefaultOpts = {
  mockData: any;
  genCustomDataPath: string;
  interfaceApiRelativePath: string;
  prettierOptions?: IPrettierOptions;
};

const getMethodData = (itemValue: any) => {
  // support all openapi method
  let method = '';
  let data: any = '';
  let responseMediaType = '';
  methodList.forEach((item) => {
    if (itemValue?.[item]) {
      method = item;
      const responsesProperties = itemValue[item]?.responses;
      // first use responses 200, then use responses default
      let responseCode: '200' | 'default' = '200';
      if (!responsesProperties?.['200']) {
        responseCode = 'default';
      }
      // first use responses 200, then use responses default
      const responsesContent = responsesProperties?.[responseCode]?.content;
      if (responsesContent) {
        // responses content only use first key
        responseMediaType = Object.keys(responsesContent)[0];
      }

      data = responsesContent?.[responseMediaType] ?? {};
    }
  });
  return { method, data };
};

const genDefaultCustomData = (opts: IDefaultOpts) => {
  const {
    mockData,
    genCustomDataPath,
    interfaceApiRelativePath,
    prettierOptions,
  } = opts;
  if (!fs.pathExistsSync(path.join(genCustomDataPath, 'index.ts'))) {
    const firstPath = Object.keys(mockData)[0];
    const { data: responseData } = getMethodData(mockData[firstPath]);

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
      prettierData(
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
      prettierData(
        templateIndexData.replace('packageName', packageName),
        copyOptions(prettierOptions),
      ),
    );
    console.info(colors.green('Generate mock/custom-data folder file success'));
  }
};

const genMockInterfaceFile = (opts: IOpts) => {
  const {
    interfaceApiRelativePath,
    mockDataAbsolutePath,
    genMockAbsolutePath,
    prettierOptions,
    mockPathPrefix = '',
  } = opts;

  const mockData = fs.readJSONSync(mockDataAbsolutePath);
  // 生成自定义数据模版
  const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');

  genDefaultCustomData({
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

  const interfaceMockDataAbsolutePath = path.join(
    genMockAbsolutePath,
    'interface-mock-data.ts',
  );
  fs.writeFileSync(
    interfaceMockDataAbsolutePath,
    prettierData(interfaceMockData.join(''), prettierOptions),
  );
  console.info(
    colors.green('Generate mock/interface-mock-data.ts file success'),
  );
};

export { genMockInterfaceFile };

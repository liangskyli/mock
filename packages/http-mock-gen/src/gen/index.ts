import path from 'path';
import { getAbsolutePath, prettierData, copyOptions, removeFilesSync } from '@liangskyli/utils';
import fs from 'fs-extra';
import type prettier from 'prettier';
import openapiTS from '../esm-to-commjs/openapi-typescript';
import { genMockDataFile } from './gen-json-schema-file';
import { genMockInterfaceFile } from './gen-mock-interface-file';
import type { JSONSchemaFakerOptions } from 'json-schema-faker';

export type IGenMockDataOpts = {
  openapiPath: string;
  mockDir?: string;
  prettierOptions?: prettier.Options;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
  /**
   * 请求库文件路径，例如 "../../utils/request"
   * 需要注意的是此文件必须是使用 export default 默认导出
   */
  requestFilePath?: string;
  requestQueryOmit?: string[];
  requestBodyOmit?: string[];
};

const genMockData = async (opts: IGenMockDataOpts) => {
  const {
    mockDir = './',
    openapiPath,
    prettierOptions,
    jsonSchemaFakerOptions,
    mockDataReplace,
    requestFilePath,
    requestQueryOmit = [],
    requestBodyOmit = [],
  } = opts;

  const genMockPath = path.join(mockDir, 'mock');
  const genMockAbsolutePath = getAbsolutePath(genMockPath);
  const openapiAbsolutePath = getAbsolutePath(openapiPath);
  if (!fs.existsSync(getAbsolutePath(mockDir))) {
    console.error(`mockDir not exits: ${mockDir}`);
    process.exit(1);
  }
  if (!fs.existsSync(openapiAbsolutePath)) {
    console.error(`openapiPath not exits: ${openapiPath}`);
    process.exit(1);
  }

  removeFilesSync(genMockAbsolutePath);
  console.info(`Clean dir: ${genMockPath}`);

  fs.ensureDirSync(genMockAbsolutePath);
  // schema接口定义相关文件目录
  const genSchemaAPIAbsolutePath = path.join(genMockAbsolutePath, 'schema-api');
  fs.ensureDirSync(genSchemaAPIAbsolutePath);

  // openapi生成TS类型文件
  const schemaString = await openapiTS(openapiAbsolutePath);
  const schemaTsPath = path.join(genSchemaAPIAbsolutePath, 'ts-schema.ts');
  fs.writeFileSync(schemaTsPath, await prettierData(schemaString, copyOptions(prettierOptions)));
  console.info('Generate schema-api/ts-schema.ts success');
  // 生成schema file and mock data file
  const mockDataAbsolutePath = await genMockDataFile({
    schemaTsPath,
    genSchemaAPIAbsolutePath,
    prettierOptions: copyOptions(prettierOptions),
    jsonSchemaFakerOptions,
    mockDataReplace,
  });

  // 生成mock接口文件
  await genMockInterfaceFile({
    mockDataAbsolutePath,
    genMockAbsolutePath,
    genSchemaAPIAbsolutePath,
    prettierOptions: copyOptions(prettierOptions),
    requestFilePath,
    requestQueryOmit,
    requestBodyOmit,
  });
};

export default genMockData;

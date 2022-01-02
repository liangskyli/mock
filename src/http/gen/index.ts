import path from 'path';
import openapiTS from 'openapi-typescript';
import { getAbsolutePath, prettierData, copyOptions } from '../../tools';
import fs from 'fs-extra';
import type prettier from 'prettier';
import { genMockDataFile } from './gen-json-schema-file';
import { genMockInterfaceFile } from './gen-mock-interface-file';
import type { JSONSchemaFakerOptions } from 'json-schema-faker';

export type IGenMockDataOpts = {
  openapiPath: string;
  mockDir?: string;
  prettierOptions?: prettier.Options;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
};

const genMockData = async (opts: IGenMockDataOpts) => {
  const {
    mockDir = './',
    openapiPath,
    prettierOptions,
    jsonSchemaFakerOptions,
    mockDataReplace,
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

  fs.removeSync(genMockAbsolutePath);
  console.info(`Clean dir: ${genMockPath}`);

  fs.ensureDirSync(genMockAbsolutePath);

  // openapi生成TS类型文件
  const schemaString = await openapiTS(openapiAbsolutePath);
  const schemaTsPath = path.join(genMockAbsolutePath, 'ts-schema.ts');
  fs.writeFileSync(schemaTsPath, await prettierData(schemaString, copyOptions(prettierOptions)));
  console.info('Generate ts-schema.ts success');
  // 生成schema file and mock data file
  const mockDataAbsolutePath = await genMockDataFile({
    schemaTsPath,
    genMockAbsolutePath,
    prettierOptions: copyOptions(prettierOptions),
    jsonSchemaFakerOptions,
    mockDataReplace,
  });

  // 生成mock接口文件
  await genMockInterfaceFile({
    mockDataAbsolutePath,
    genMockAbsolutePath,
    prettierOptions: copyOptions(prettierOptions),
  });
};

export default genMockData;

import type { IGenTsDataOpts } from '@liangskyli/openapi-gen-ts';
import genTsData from '@liangskyli/openapi-gen-ts';
import {
  colors,
  copyOptions,
  getAbsolutePath,
  getRelativePath,
  removeFilesSync,
} from '@liangskyli/utils';
import fs from 'fs-extra';
import type { JSONSchemaFakerOptions } from 'json-schema-faker';
import path from 'path';
import { genMockDataFile } from './gen-mock-data-file';
import { genMockInterfaceFile } from './gen-mock-interface-file';

export type IGenMockDataOpts = IGenTsDataOpts & {
  mockDir?: string;
  mockPathPrefix?: string;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
};

export type IGenMockDataOptsCLI = IGenMockDataOpts | IGenMockDataOpts[];

const genMockData = async (opts: IGenMockDataOpts) => {
  const {
    mockDir = './',
    openapiPath,
    prettierOptions,
    jsonSchemaFakerOptions,
    mockDataReplace,
    requestFile,
    requestQueryOmit = [],
    requestBodyOmit = [],
    mockPathPrefix,
  } = opts;
  const genTsDir = opts.genTsDir ?? `${opts.mockDir}/mock`;

  const genMockPath = path.join(mockDir, 'mock');
  const genMockAbsolutePath = getAbsolutePath(genMockPath);
  if (!fs.existsSync(getAbsolutePath(mockDir))) {
    console.error(colors.red(`mockDir not exits: ${mockDir}`));
    process.exit(1);
  }

  removeFilesSync(genMockAbsolutePath);
  console.info(colors.green(`Clean mock dir: ${genMockPath}`));
  fs.ensureDirSync(genMockAbsolutePath);

  // openapi gen ts file
  const { schemaDefinition, genTsAbsolutePath } = await genTsData({
    genTsDir,
    openapiPath,
    prettierOptions: copyOptions(prettierOptions),
    requestFile,
    requestQueryOmit,
    requestBodyOmit,
  });

  // 生成mock数据文件
  const mockDataAbsolutePath = await genMockDataFile({
    genMockAbsolutePath,
    schemaDefinition: schemaDefinition as any,
    prettierOptions: copyOptions(prettierOptions),
    jsonSchemaFakerOptions,
    mockDataReplace,
  });

  const interfaceApiRelativePath = path.join(
    getRelativePath(genMockAbsolutePath, genTsAbsolutePath),
    'interface-api',
  );
  // 生成mock接口文件
  await genMockInterfaceFile({
    interfaceApiRelativePath,
    mockDataAbsolutePath,
    genMockAbsolutePath,
    prettierOptions: copyOptions(prettierOptions),
    mockPathPrefix,
  });
};

export default genMockData;

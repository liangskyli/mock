import type { IGenTsDataOpts } from '@liangskyli/openapi-gen-ts';
import genTsData from '@liangskyli/openapi-gen-ts';
import {
  colors,
  copyOptions,
  getAbsolutePath,
  removeFilesSync,
} from '@liangskyli/utils';
import fs from 'fs-extra';
import type { JSONSchemaFakerOptions } from 'json-schema-faker';
import path from 'path';
import generatorMockFile from './file';

export type IGenMockDataBaseOpts = {
  mockDir?: string;
  mockPathPrefix?: string;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
};
export type IGenMockDataOpts = IGenTsDataOpts & IGenMockDataBaseOpts;

export type IGenMockDataOptsCLI = IGenMockDataOpts | IGenMockDataOpts[];

const genMockData = async (opts: IGenMockDataOpts) => {
  const {
    mockDir = './',
    mockPathPrefix,
    jsonSchemaFakerOptions,
    mockDataReplace,
    //openapiPath,
    prettierOptions,
    ...genTsDataOpts
  } = opts;
  const genTsDir = opts.genTsDir ?? `${opts.mockDir}/mock`;

  const genMockPath = path.join(mockDir, 'mock');
  const genMockAbsolutePath = getAbsolutePath(genMockPath);
  if (!fs.existsSync(getAbsolutePath(mockDir))) {
    console.error(colors.red(`mockDir not exits: ${mockDir}`));
    throw new Error('mockDir not exits!');
  }

  removeFilesSync(genMockAbsolutePath);
  console.info(colors.green(`Clean mock dir: ${genMockPath}`));
  fs.ensureDirSync(genMockAbsolutePath);

  // openapi gen ts file
  const tsData = await genTsData({
    ...genTsDataOpts,
    genTsDir,
    prettierOptions: copyOptions(prettierOptions),
  });

  await generatorMockFile({
    mockDir,
    mockPathPrefix,
    jsonSchemaFakerOptions,
    mockDataReplace,
    ...tsData,
    genMockAbsolutePath,
  });
};

export default genMockData;

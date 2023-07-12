import type genTsData from '@liangskyli/openapi-gen-ts';
import type { IGenTsDataOpts } from '@liangskyli/openapi-gen-ts';
import type { IGenMockDataBaseOpts } from '../index';
import { GenInterfaceMockData } from './gen-interface-mock-data';
import { GenMockDataJson } from './gen-mock-data-json';

type IGeneratorFile = IGenMockDataBaseOpts &
  Pick<IGenTsDataOpts, 'prettierOptions'> & {
    genMockAbsolutePath: string;
  } & Awaited<ReturnType<typeof genTsData>>;

const generatorMockFile = async (opts: IGeneratorFile) => {
  const {
    genMockAbsolutePath,
    prettierOptions,
    schemaDefinition,
    jsonSchemaFakerOptions,
    mockDataReplace,
    genTsAbsolutePath,
    mockPathPrefix,
  } = opts;
  // 生成mock数据文件
  const { mockDataAbsolutePath } = await new GenMockDataJson({
    genMockAbsolutePath,
    schemaDefinition,
    prettierOptions,
    jsonSchemaFakerOptions,
    mockDataReplace,
  }).writeFile();

  // 生成mock接口文件
  await new GenInterfaceMockData({
    genTsAbsolutePath,
    mockDataAbsolutePath,
    genMockAbsolutePath,
    prettierOptions,
    mockPathPrefix,
  }).generator();
};

export default generatorMockFile;

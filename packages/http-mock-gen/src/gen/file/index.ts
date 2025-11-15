import type genTsData from '@liangskyli/openapi-gen-ts';
import type { IGenTsDataOpts } from '@liangskyli/openapi-gen-ts';
import { GenPackageJson, getAbsolutePath } from '@liangskyli/utils';
import type { IGenMockDataBaseOpts } from '../index';
import { GenInterfaceMockData } from './gen-interface-mock-data';
import { GenMockDataJson } from './gen-mock-data-json';

type IGeneratorFile = IGenMockDataBaseOpts &
  Pick<IGenTsDataOpts, 'prettierOptions'> & {
    genMockPath: string;
  } & Awaited<ReturnType<typeof genTsData>>;

const generatorMockFile = async (opts: IGeneratorFile) => {
  const {
    genMockPath,
    prettierOptions,
    schemaDefinition,
    jsonSchemaFakerOptions,
    mockDataReplace,
    genTsAbsolutePath,
    mockPathPrefix,
  } = opts;
  const genMockAbsolutePath = getAbsolutePath(genMockPath);
  // 生成mock数据文件
  const { mockDataAbsolutePath } = await new GenMockDataJson({
    genMockAbsolutePath,
    schemaDefinition,
    prettierOptions,
    jsonSchemaFakerOptions,
    mockDataReplace,
  } as any).writeFile();

  // 生成mock接口文件
  await new GenInterfaceMockData({
    genTsAbsolutePath,
    mockDataAbsolutePath,
    genMockAbsolutePath,
    prettierOptions,
    mockPathPrefix,
  } as any).generator();

  // 生成package.json
  await new GenPackageJson({
    genFilePath: genMockPath,
    prettierOptions,
  }).generator();
};

export default generatorMockFile;

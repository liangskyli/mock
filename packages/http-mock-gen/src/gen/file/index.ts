import type genTsData from '@liangskyli/openapi-gen-ts';
import type { IGenMockDataOpts } from '../index';
import { GenInterfaceMockData } from './gen-interface-mock-data';
import { GenCustomData } from './gen-mock-data-json';

type IGeneratorFile = IGenMockDataOpts & {
  genMockAbsolutePath: string;
} & Awaited<ReturnType<typeof genTsData>>;

const generatorMockFile = (opts: IGeneratorFile) => {
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
  const mockDataAbsolutePath = new GenCustomData({
    genMockAbsolutePath,
    schemaDefinition: schemaDefinition!,
    prettierOptions,
    jsonSchemaFakerOptions,
    mockDataReplace,
  }).mockDataAbsolutePath;

  // 生成mock接口文件
  new GenInterfaceMockData({
    genTsAbsolutePath,
    mockDataAbsolutePath,
    genMockAbsolutePath,
    prettierOptions,
    mockPathPrefix,
  });
};

export default generatorMockFile;

import type genTsData from '@liangskyli/openapi-gen-ts/lib/gen';
import type { IGenMockDataOpts } from '../index';
import { GenInterfaceMockData } from './gen-interface-mock-data';
import { genMockDataJson } from './gen-mock-data-json';

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
  const mockDataAbsolutePath = genMockDataJson({
    genMockAbsolutePath,
    schemaDefinition: schemaDefinition!,
    prettierOptions,
    jsonSchemaFakerOptions,
    mockDataReplace,
  });

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

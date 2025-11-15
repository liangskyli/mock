import type { Options } from '@grpc/proto-loader';
import { GenPackageJson } from '@liangskyli/utils';
import genMockData from '../gen-mock-data';
import type { GenOptions } from '../index';
import { GenGrpcObj } from './gen-grpc-obj';
import { GenTsConfigMock } from './gen-tsconfig-mock';

const generatorFiles = async (opts: GenOptions, loaderOptions: Options) => {
  const { configFilePath, prettierOptions } = opts;
  // 生成mock数据
  const { rootPath, genMockPath } = await genMockData(opts, loaderOptions);
  // 生成 genGrpcObj服务文件
  await new GenGrpcObj({
    genMockPath,
    rootPath,
    loaderOptions,
    configFilePath,
    prettierOptions,
  }).generator();
  // 生成tsconfig
  await new GenTsConfigMock({ genMockPath, prettierOptions }).generator();
  // 生成package.json
  await new GenPackageJson({
    genFilePath: genMockPath,
    prettierOptions,
  }).generator();
};

export default generatorFiles;

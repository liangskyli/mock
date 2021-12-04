import type { GenMockDataOptions } from './gen-mock-data';
import genMockData from './gen-mock-data';
import genGrpcObj from './gen-grpc-obj';
import fs from 'fs-extra';
import type { Options } from '@grpc/proto-loader';
import { getAbsolutePath } from './utils';
import genTsConfig from './gen-tsconfig';

export type GenOptions = GenMockDataOptions & {
  configFilePath?: string;
};

export type ConfigFileOptions = { loaderOptions?: Options };
export type ConfigFileOptionsCLI = GenMockDataOptions & ConfigFileOptions;
export const defaultLoaderOptions: Options = {
  defaults: true,
};

export function gen(opts: GenOptions) {
  const { configFilePath } = opts;
  let loaderOptions: Options = defaultLoaderOptions;
  if (configFilePath) {
    const configFileAbsolutePath = getAbsolutePath(configFilePath);
    if (fs.existsSync(configFileAbsolutePath)) {
      const configData: ConfigFileOptions = require(configFileAbsolutePath).default;
      if (configData.loaderOptions) {
        loaderOptions = Object.assign(defaultLoaderOptions, configData.loaderOptions);
      }
    } else {
      console.log(`配置文件${configFilePath}不存在`);
    }
  }

  // 生成mock数据
  const { rootPath, genMockPath } = genMockData(opts, loaderOptions);
  // 生成 genGrpcObj服务文件
  genGrpcObj({ grpcNpmName: 'grpc', genMockPath, rootPath, loaderOptions, configFilePath });
  // 生成tsconfig
  genTsConfig(genMockPath);
}

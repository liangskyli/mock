import type { Options } from '@grpc/proto-loader';
import { colors, getAbsolutePath, getConfig } from '@liangskyli/utils';
import fs from 'fs-extra';
import generatorFiles from './file';
import type { GenMockDataOptions } from './gen-mock-data';

export type GenOptions = GenMockDataOptions & {
  configFilePath?: string;
};

export type ConfigFileOptions = { loaderOptions?: Options };
export type ConfigFileOptionsCLI = GenMockDataOptions & ConfigFileOptions;
export const defaultLoaderOptions: Options = {
  defaults: true,
};

export async function grpcMockCodeGen(opts: GenOptions) {
  const { configFilePath } = opts;
  let loaderOptions: Options = defaultLoaderOptions;
  if (configFilePath) {
    const configFileAbsolutePath = getAbsolutePath(configFilePath);
    if (fs.existsSync(configFileAbsolutePath)) {
      const configData: ConfigFileOptions = getConfig(configFileAbsolutePath);
      if (configData.loaderOptions) {
        loaderOptions = Object.assign(
          defaultLoaderOptions,
          configData.loaderOptions,
        );
      }
    } else {
      console.error(colors.red(`配置文件${configFilePath}不存在`));
    }
  }

  await generatorFiles(opts, loaderOptions);
}

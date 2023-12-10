import type { Options } from '@grpc/proto-loader';
import { colors, getAbsolutePath } from '@liangskyli/utils';
import fs from 'fs-extra';
import { createRequire } from 'node:module';
import generatorFiles from './file';
import type { GenMockDataOptions } from './gen-mock-data';

const require = createRequire(import.meta.url);

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
      const configData: ConfigFileOptions = require(
        configFileAbsolutePath,
      ).default;
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

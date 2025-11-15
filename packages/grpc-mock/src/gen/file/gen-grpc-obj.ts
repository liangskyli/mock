import type { Options } from '@grpc/proto-loader';
import type { IPrettierOptions } from '@liangskyli/utils';
import { getAbsolutePath, writePrettierFile } from '@liangskyli/utils';
import path from 'node:path';
import {
  fileTip,
  getImportPath,
  packageName,
  tslintDisable,
} from '../../utils';
import type { GenOptions } from '../index';

export type IGenGenGrpcObjOpts = Pick<GenOptions, 'configFilePath'> & {
  genMockPath: string;
  rootPath: string;
  loaderOptions: Options;
  prettierOptions?: IPrettierOptions;
};

export class GenGrpcObj {
  private readonly opts: IGenGenGrpcObjOpts;

  constructor(opts: IGenGenGrpcObjOpts) {
    this.opts = opts;
  }

  public async generator() {
    const { genMockPath, rootPath, configFilePath } = this.opts;
    const grpcObjPath = getAbsolutePath(path.join(genMockPath, 'grpc-obj.ts'));
    const absoluteConfigFilePath = configFilePath
      ? getAbsolutePath(configFilePath)
      : undefined;

    const fileContent = [
      fileTip,
      tslintDisable,
      `import * as grpc from '@grpc/grpc-js';
import { fromJSON } from "@grpc/proto-loader";
import type { GrpcObject } from '@grpc/grpc-js';
import { defaultLoaderOptions } from '${packageName}';
${configFilePath ? 'import fs from "fs-extra";' : ''}
import { createRequire } from 'node:module';
import { tsImport } from '@liangskyli/utils';

const require = createRequire(import.meta.url);
const root = require('${getImportPath(grpcObjPath, rootPath)}');

const getGrpcObjectGroup = async () => {
  let config: any;
  ${
    absoluteConfigFilePath
      ? `
  if (fs.existsSync('${absoluteConfigFilePath}')) {
    const configData = await tsImport('${absoluteConfigFilePath}', import.meta.url);
    config = configData.default;
  }
  `
      : ''
  }
  const grpcObjectGroup: Record<string, GrpcObject> = {};
  Object.keys(root).forEach((key: string) => {
    grpcObjectGroup[key] = (grpc.loadPackageDefinition as any)(
        fromJSON(
            root[key],
            Object.assign(defaultLoaderOptions, config && config.loaderOptions),
        )
    );
  });
  return grpcObjectGroup;
};

export default getGrpcObjectGroup;
`,
    ].join('\n');

    await this.writeFile(fileContent, grpcObjPath);
  }
  private async writeFile(data: string, absolutePath: string) {
    const { genMockPath, prettierOptions } = this.opts;

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: `Generate grpc-obj.ts success in ${genMockPath}`,
    });
  }
}

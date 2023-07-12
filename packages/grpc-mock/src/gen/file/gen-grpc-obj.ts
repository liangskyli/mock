import type { Options } from '@grpc/proto-loader';
import type { IPrettierOptions } from '@liangskyli/utils';
import { getAbsolutePath } from '@liangskyli/utils';
import path from 'path';
import {
  fileTip,
  getImportPath,
  packageName,
  tslintDisable,
  writePrettierFile,
} from '../../utils';
import type { GenOptions } from '../index';

export type IGenGenGrpcObjOpts = Pick<GenOptions, 'configFilePath'> & {
  genMockPath: string;
  grpcNpmName: 'grpc';
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
    const { grpcNpmName, genMockPath, rootPath, configFilePath } = this.opts;
    const grpcObjPath = getAbsolutePath(path.join(genMockPath, 'grpc-obj.ts'));

    const fileContent = [
      fileTip,
      tslintDisable,
      `import * as grpc from '${grpcNpmName}';`,
      'import { fromJSON } from "@grpc/proto-loader";',
      'import type { GrpcObject } from "grpc";',
      `import { defaultLoaderOptions } from '${packageName}';`,
      configFilePath ? 'import * as fs from "fs-extra";\n' : '',
      `const root = require('${getImportPath(grpcObjPath, rootPath)}');\n`,
      'let config: any;',
      configFilePath
        ? `if (fs.existsSync(require.resolve('${getImportPath(
            grpcObjPath,
            configFilePath,
          )}'))) {
  config = require('${getImportPath(grpcObjPath, configFilePath)}').default;
}`
        : '',
      'const grpcObjectGroup: Record<string, GrpcObject> = {};',
      'Object.keys(root).forEach((key: string) => {',
      '  grpcObjectGroup[key] = (grpc.loadPackageDefinition as any)(fromJSON(',
      '    root[key],',
      '   Object.assign(defaultLoaderOptions, config && config.loaderOptions),',
      '  ));',
      '});\n',
      'export default grpcObjectGroup;',
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

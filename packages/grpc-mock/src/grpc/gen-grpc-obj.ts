import type { Options } from '@grpc/proto-loader';
import type { IPrettierOptions } from '@liangskyli/utils';
import { colors, getAbsolutePath, prettierData } from '@liangskyli/utils';
import * as fs from 'fs-extra';
import path from 'path';
import { fileTip, getImportPath, packageName, tslintDisable } from './utils';

type GenGrpcObjOptions = {
  genMockPath: string;
  rootPath: string;
  grpcNpmName: string;
  loaderOptions: Options;
  configFilePath?: string;
  prettierOptions?: IPrettierOptions;
};

const genGrpcObj = (opt: GenGrpcObjOptions) => {
  const {
    grpcNpmName,
    genMockPath,
    rootPath,
    configFilePath,
    prettierOptions,
  } = opt;
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

  fs.writeFileSync(grpcObjPath, prettierData(fileContent, prettierOptions));
  console.info(colors.green(`Generate grpc-obj.ts success in ${genMockPath}`));
};

export default genGrpcObj;

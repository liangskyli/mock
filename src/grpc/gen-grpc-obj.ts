import { fileTip, getAbsolutePath, getImportPath, packageName, tslintDisable } from './utils';
import * as fs from 'fs-extra';
import path from 'path';
import type { Options } from '@grpc/proto-loader';

type GenGrpcObjOptions = {
  genMockPath: string;
  rootPath: string;
  grpcNpmName: string;
  loaderOptions: Options;
  configFilePath?: string;
};

const genGrpcObj = (opt: GenGrpcObjOptions) => {
  const { grpcNpmName, genMockPath, rootPath, configFilePath } = opt;
  const grpcObjPath = getAbsolutePath(path.join(genMockPath, 'grpc-obj.ts'));

  const fileContent = [
    fileTip,
    tslintDisable,
    `import * as grpc from '${grpcNpmName}';`,
    'import * as fs from \'fs-extra\';',
    'import { fromJSON } from \'@grpc/proto-loader\';',
    'import type { GrpcObject } from \'grpc\';',
    `import { defaultLoaderOptions } from '${packageName}';\n`,
    `const root = require('${getImportPath(grpcObjPath, rootPath)}');\n`,
    'let config: any;',
    configFilePath
      ? `if (fs.existsSync(require.resolve('${getImportPath(grpcObjPath, configFilePath)}'))) {
  config = require('${getImportPath(grpcObjPath, configFilePath)}').default;
}`
      : '',
    'const grpcObjectGroup: Record<string, GrpcObject> = {};',
    'Object.keys(root).forEach((key: string) => {',
    '  grpcObjectGroup[key] = grpc.loadPackageDefinition(fromJSON(',
    '    root[key],',
    '   Object.assign(defaultLoaderOptions, config && config.loaderOptions),',
    '  ));',
    '});\n',
    'export default grpcObjectGroup;',
  ].join('\n');

  fs.writeFileSync(grpcObjPath, fileContent);
  console.info(`Generate grpc-obj.ts success in ${genMockPath}`);
};

export default genGrpcObj;

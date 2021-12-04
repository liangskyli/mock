import protobufjs from 'protobufjs';
import type { IInspectNamespace } from './pbjs';
import { genImplementationData, inspectNamespace } from './pbjs';
import {
  firstUpperCaseOfWord,
  firstWordNeedLetter,
  genSpace,
  getAbsolutePath,
  packageName,
} from './utils';
import * as fs from 'fs-extra';
import path from 'path';
import type { ProtoConfig } from './gen-proto-json';
import genProtoJson from './gen-proto-json';
import type { Options } from '@grpc/proto-loader';

export type GenMockDataOptions = {
  grpcMockDir?: string;
  grpcMockFolderName?: string;
  port?: number;
  rootPath: ProtoConfig | string;
  rootPathServerNameMap?: Record<string, string>;
};

const genMockData = (
  opts: GenMockDataOptions,
  loaderOptions: Options,
): {
  rootPath: string;
  genMockPath: string;
} => {
  const {
    grpcMockDir = './',
    grpcMockFolderName = 'grpc-mock',
    port = 50000,
    rootPathServerNameMap,
  } = opts;
  let { rootPath } = opts;
  const genMockPath = path.relative(process.cwd(), path.join(grpcMockDir, grpcMockFolderName));
  fs.removeSync(genMockPath);
  console.info(`Clean dir: ${genMockPath}`);
  const genProtoPath = path.join(genMockPath, 'proto');
  fs.ensureDirSync(genProtoPath);
  const genServerPath = path.join(genMockPath, 'server');
  fs.ensureDirSync(genServerPath);
  if (typeof rootPath !== 'string') {
    rootPath = genProtoJson({
      genMockPath,
      ...rootPath,
    });
  }
  rootPath = getAbsolutePath(rootPath);
  if (!fs.existsSync(rootPath)) {
  }

  // mock 服务端口开始自动生成(默认从50000开始)
  let servicePort = port;
  const grpcServiceMockConfigList: string[] = [];
  grpcServiceMockConfigList.push('module.exports = {');
  const spaceServerNameMockList: string[] = [];
  const indexContent: string[] = [];
  indexContent.push(`import { grpcMockInit } from '${packageName}';`);

  const rootObject = require(rootPath);
  Object.keys(rootObject).map((spaceServerName) => {
    const serverName: string = rootPathServerNameMap?.[spaceServerName] ?? spaceServerName;
    const root = protobufjs.Root.fromJSON(rootObject[spaceServerName]);
    const result: IInspectNamespace = inspectNamespace(root);
    const { services, methods } = result!;
    const serviceMockContent = [];
    serviceMockContent.push(`import type { IMockService } from '${packageName}';`);
    const protoItem: string[] = [];
    const uniqueServiceCodeNameList: string[] = [];
    const longsTypeToString = loaderOptions.longs === String;

    services.map((service, index) => {
      const protoName = service.fullName.split('.')[0];
      const protoPath = `${spaceServerName}.${service.fullName}`;
      const serviceCodeName = firstWordNeedLetter(service.name);
      let uniqueServiceCodeName = serviceCodeName;

      // 导出服务变量名唯一处理
      if (uniqueServiceCodeNameList.indexOf(uniqueServiceCodeName) > -1) {
        uniqueServiceCodeName = `${uniqueServiceCodeName}${index}`;
      }
      uniqueServiceCodeNameList.push(uniqueServiceCodeName);

      const protoServiceContent = `import type { IProtoItem } from '${packageName}';

const ${serviceCodeName}: IProtoItem = {
  path: '${protoPath}',
  implementationData: ${genImplementationData(
    protoPath,
    methods,
    protoName,
    root,
    longsTypeToString,
  )}
};
export default ${serviceCodeName};
`;
      fs.ensureDirSync(path.join(genProtoPath, serverName, protoName));
      const filePath = path.join(genProtoPath, serverName, protoName, `${serviceCodeName}.ts`);
      fs.writeFileSync(filePath, protoServiceContent);

      serviceMockContent.push(
        `import ${uniqueServiceCodeName} from '../proto/${serverName}/${protoName}/${serviceCodeName}';`,
      );
      protoItem.push(`{ ...${uniqueServiceCodeName} },`);
    });
    const spaceServerNameMock = `${firstUpperCaseOfWord(spaceServerName)}Mock`;
    serviceMockContent.push(`
const ${spaceServerNameMock}: IMockService = {
  serviceName: '${serverName}',
  servicePort: ${servicePort},
  protoList: [
    ${protoItem.join(`\n${genSpace(4)}`)}
  ],
};
export default ${spaceServerNameMock};
    `);
    grpcServiceMockConfigList.push(
      ` '${serverName}': {
    'host': '127.0.0.1',
    'port': ${servicePort},
  },`,
    );
    servicePort++;
    const filePath = path.join(genServerPath, `${spaceServerNameMock}.ts`);
    fs.writeFileSync(filePath, serviceMockContent.join('\n'));
    spaceServerNameMockList.push(spaceServerNameMock);
    indexContent.push(`import ${spaceServerNameMock} from './server/${spaceServerNameMock}';`);
  });
  // index.ts
  indexContent.push('');
  indexContent.push(`grpcMockInit([
  ${spaceServerNameMockList.join(`,\n${genSpace(2)}`)}
],'${genMockPath}');`);
  const filePath = path.join(genMockPath, 'index.ts');
  fs.writeFileSync(filePath, indexContent.join('\n'));
  grpcServiceMockConfigList.push('}');
  const fileConfigPath = path.join(genMockPath, 'grpc-service.mock.config.js');
  fs.writeFileSync(fileConfigPath, grpcServiceMockConfigList.join('\n'));
  console.info(`Generate mock data success in ${genMockPath}`);

  return { rootPath, genMockPath };
};

export default genMockData;

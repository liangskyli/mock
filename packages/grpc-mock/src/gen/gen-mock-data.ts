import type { Options } from '@grpc/proto-loader';
import type { IPrettierOptions } from '@liangskyli/utils';
import { colors, getAbsolutePath, removeFilesSync } from '@liangskyli/utils';
import fs from 'fs-extra';
import { createRequire } from 'node:module';
import path from 'node:path';
import protobufjs from 'protobufjs';
import type { IDefaultMockData } from '../utils';
import { firstUpperCaseOfWord, firstWordNeedLetter } from '../utils';
import { GenCustomData } from './file/gen-custom-data';
import { GenGrpcServiceMockConfig } from './file/gen-grpc-service-mock-config';
import { GenIndex } from './file/gen-index';
import { GenProtoMockData } from './file/gen-proto-mock-data';
import type { ProtoConfig } from './file/gen-root-json';
import { GenRootJson } from './file/gen-root-json';
import { GenServiceMockData } from './file/gen-service-mock-data';
import type { IInspectNamespace } from './pbjs';
import { inspectNamespace } from './pbjs';

const require = createRequire(import.meta.url);

export type GenMockDataOptions = {
  grpcMockDir?: string;
  grpcMockFolderName?: string;
  port?: number;
  rootPath: ProtoConfig | string;
  rootPathServerNameMap?: Record<string, string>;
  prettierOptions?: IPrettierOptions;
  defaultMockData?: Partial<IDefaultMockData>;
};

const genMockData = async (
  opts: GenMockDataOptions,
  loaderOptions: Options,
): Promise<{
  rootPath: string;
  genMockPath: string;
}> => {
  const {
    grpcMockDir = './',
    grpcMockFolderName = 'grpc-mock',
    port = 50000,
    rootPathServerNameMap,
    prettierOptions,
    defaultMockData,
  } = opts;
  let { rootPath } = opts;
  const genMockPath = path.join(grpcMockDir, grpcMockFolderName);
  const genMockAbsolutePath = getAbsolutePath(genMockPath);

  removeFilesSync(genMockAbsolutePath);
  console.info(colors.green(`Clean dir: ${genMockPath}`));

  const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');
  await new GenCustomData({
    genMockPath,
    genCustomDataPath,
    prettierOptions,
  }).generator();

  const genProtoPath = path.join(genMockAbsolutePath, 'proto');
  fs.ensureDirSync(genProtoPath);
  const genServerPath = path.join(genMockAbsolutePath, 'server');
  fs.ensureDirSync(genServerPath);
  if (typeof rootPath !== 'string') {
    const genRootJson = new GenRootJson({
      genMockPath,
      ...rootPath,
      loaderOptions,
      prettierOptions,
    });
    rootPath = await genRootJson.writeFile();
  }
  rootPath = getAbsolutePath(rootPath);

  // mock 服务端口开始自动生成(默认从50000开始)
  let servicePort = port;
  const genGrpcServiceMockConfig = new GenGrpcServiceMockConfig({
    genMockPath,
    prettierOptions,
  });
  const genIndex = new GenIndex({
    genMockPath,
    prettierOptions,
  });

  const rootObject = require(rootPath);
  await Promise.all(
    Object.keys(rootObject).map(async (spaceServerName) => {
      return { spaceServerName, servicePort: servicePort++ };
    }),
  ).then(async (serverItems) => {
    return await Promise.all(
      serverItems.map(async (curServer) => {
        const { spaceServerName, servicePort } = curServer;
        const serverName: string =
          rootPathServerNameMap?.[spaceServerName] ?? spaceServerName;
        const root = protobufjs.Root.fromJSON(rootObject[spaceServerName]);
        const result: IInspectNamespace = inspectNamespace(root);
        const { services } = result!;
        const genServiceMockData = new GenServiceMockData({
          genServerPath,
          prettierOptions,
        });
        const longsTypeToString = loaderOptions.longs === String;

        await Promise.all(
          services.map(async (service, index) => {
            const protoName = service.fullName.split('.')[0];
            const protoPath = `${spaceServerName}.${service.fullName}`;
            const serviceCodeName = firstWordNeedLetter(service.name);
            const methods = service.methods ?? [];

            await new GenProtoMockData({
              index,
              genCustomDataPath,
              serviceCodeName,
              protoPath,
              methods,
              protoName,
              root,
              longsTypeToString,
              prettierOptions,
              genProtoPath,
              serverName,
              defaultMockData,
            }).generator();

            genServiceMockData.importService({
              index,
              serverName,
              protoName,
              serviceCodeName,
            });
          }),
        );
        const spaceServerNameMock = `${firstUpperCaseOfWord(
          spaceServerName,
        )}Mock`;
        genServiceMockData.mockServerCode({
          spaceServerNameMock,
          serverName,
          servicePort,
        });
        genGrpcServiceMockConfig.body({ serverName, servicePort });
        await genServiceMockData.writeFile(spaceServerNameMock);
        genIndex.importServiceMock({ spaceServerNameMock });
      }),
    );
  });
  // index.ts
  await genIndex.writeFile();

  await genGrpcServiceMockConfig.writeFile();

  console.info(colors.green(`Generate mock data success in ${genMockPath}`));

  return { rootPath, genMockPath };
};

export default genMockData;

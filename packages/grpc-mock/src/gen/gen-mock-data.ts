import type { Options } from '@grpc/proto-loader';
import type { IPrettierOptions } from '@liangskyli/utils';
import { colors, getAbsolutePath, removeFilesSync } from '@liangskyli/utils';
import * as fs from 'fs-extra';
import path from 'path';
import protobufjs from 'protobufjs';
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

export type GenMockDataOptions = {
  grpcMockDir?: string;
  grpcMockFolderName?: string;
  port?: number;
  rootPath: ProtoConfig | string;
  rootPathServerNameMap?: Record<string, string>;
  prettierOptions?: IPrettierOptions;
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
  } = opts;
  let { rootPath } = opts;
  const genMockPath = path.join(grpcMockDir, grpcMockFolderName);
  const genMockAbsolutePath = getAbsolutePath(genMockPath);

  removeFilesSync(genMockAbsolutePath);
  console.info(colors.green(`Clean dir: ${genMockPath}`));

  const genCustomDataPath = path.join(genMockAbsolutePath, 'custom-data');
  new GenCustomData({ genMockPath, genCustomDataPath, prettierOptions });

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
    rootPath = genRootJson.writeFile();
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
      const serverName: string =
        rootPathServerNameMap?.[spaceServerName] ?? spaceServerName;
      const root = protobufjs.Root.fromJSON(rootObject[spaceServerName]);
      const result: IInspectNamespace = inspectNamespace(root);
      const { services, methods } = result!;
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

          new GenProtoMockData({
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
          });

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
      servicePort++;
      genServiceMockData.writeFile(spaceServerNameMock);
      genIndex.importServiceMock({ spaceServerNameMock });
    }),
  );
  // index.ts
  genIndex.writeFile();

  genGrpcServiceMockConfig.writeFile();

  console.info(colors.green(`Generate mock data success in ${genMockPath}`));

  return { rootPath, genMockPath };
};

export default genMockData;

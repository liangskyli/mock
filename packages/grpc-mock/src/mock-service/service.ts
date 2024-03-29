import { colors, lodash } from '@liangskyli/utils';
import type { Metadata } from 'grpc';
import * as grpc from 'grpc';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { IMetadataMap, IMockService, IProtoItem } from './service-type';

const require = createRequire(import.meta.url);

type IImplementation = Record<string, (call: any, callback: any) => void>;

const toMetadata = (metadata?: IMetadataMap): Metadata => {
  const metadataIns = new grpc.Metadata();
  if (metadata && typeof metadata === 'object') {
    Object.keys(metadata).forEach((keyName) => {
      metadataIns.add(keyName, '' + metadata[keyName]);
    });
  }
  return metadataIns;
};

const getImplementation: (proto: IProtoItem) => IImplementation = (proto) => {
  const implementationData = proto.implementationData;
  const implementation: IImplementation = {};
  Object.keys(implementationData).forEach((key) => {
    implementation[key] = (call: any, callback: any) => {
      const { request, metadata: requestMetadata } = call;
      console.info(
        '-------grpc mock server-------',
        '\n',
        'grpc servicePath:',
        proto.path,
        '\n',
        'grpc method:',
        key,
        '\n',
        'grpc go request:',
        request,
        '\n',
        'grpc go metadata:',
        requestMetadata,
      );
      const data = implementationData[key];
      let { error = null, response, metadata } = data;
      if (data.sceneData) {
        // 场景数据命中逻辑，没命中取非场景默认数据
        data.sceneData.some((sceneItem) => {
          if (sceneItem.requestCase(request)) {
            error = sceneItem.error ?? null;
            response = sceneItem.response;
            metadata = sceneItem.metadata;
            return true;
          }
          return false;
        });
      }
      callback(error, response, toMetadata(metadata));
    };
  });
  return implementation;
};

const start = (grpcObject: any, mock: IMockService) => {
  const server = new grpc.Server();
  mock.protoList.forEach((proto) => {
    const { service } = lodash.get<any, string>(grpcObject, proto.path);
    server.addService(service, getImplementation(proto));
  });

  server.bindAsync(
    `0.0.0.0:${mock.servicePort}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.info(
        colors.green(`grpc mock服务${mock.serviceName}启动,端口号:`),
        mock.servicePort,
      );
    },
  );
};

/**
 * grpc server mock 服务
 * @param mockList mock服务列表
 * @param baseDir  grpc mock代码生成路径
 */
const grpcMockInit = (mockList: IMockService[], baseDir: string) => {
  const grpcObjPath = path.join(process.cwd(), baseDir, 'grpc-obj');
  if (fs.existsSync(require.resolve(grpcObjPath))) {
    const grpcObject = require(grpcObjPath).default;
    // start server
    mockList.forEach((mock) => {
      start(grpcObject, mock);
    });
  } else {
    console.error(colors.red('请先生成grpc mock 代码'));
  }
};

export default grpcMockInit;

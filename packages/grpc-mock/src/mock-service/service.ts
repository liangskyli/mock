import type {
  GrpcObject,
  UntypedServiceImplementation as IImplementation,
  sendUnaryData,
  ServerUnaryCall,
  ServiceClientConstructor,
} from '@grpc/grpc-js';
import grpc from '@grpc/grpc-js';
import { colors, lodash, tsImport } from '@liangskyli/utils';
import fs from 'node:fs';
import path from 'node:path';
import type { IMetadataRecord, IMockService, IProtoItem } from './service-type';

const toMetadata = (metadata?: IMetadataRecord) => {
  const metadataIns = new grpc.Metadata();
  if (metadata && typeof metadata === 'object') {
    Object.keys(metadata).forEach((keyName) => {
      metadataIns.add(keyName, metadata[keyName]);
    });
  }
  return metadataIns;
};

const getImplementation: (proto: IProtoItem) => IImplementation = (proto) => {
  const implementationData = proto.implementationData;
  const implementation: IImplementation = {};
  Object.keys(implementationData).forEach((key) => {
    implementation[key] = (
      call: ServerUnaryCall<unknown, unknown>,
      callback: sendUnaryData<unknown>,
    ) => {
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

const start = (grpcObject: GrpcObject, mock: IMockService) => {
  const server = new grpc.Server();
  mock.protoList.forEach((proto) => {
    const { service } = lodash.get<GrpcObject, string>(
      grpcObject,
      proto.path,
    ) as unknown as ServiceClientConstructor;
    server.addService(service, getImplementation(proto));
  });

  server.bindAsync(
    `0.0.0.0:${mock.servicePort}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
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
const grpcMockInit = async (mockList: IMockService[], baseDir: string) => {
  const grpcObjPath = path.join(process.cwd(), baseDir, 'grpc-obj.ts');
  if (fs.existsSync(grpcObjPath)) {
    const getGrpcObjectGroup = (await tsImport(grpcObjPath, import.meta.url))
      .default;
    const grpcObject = (await getGrpcObjectGroup()) as GrpcObject;
    // start server
    mockList.forEach((mock) => {
      start(grpcObject, mock);
    });
  } else {
    console.error(colors.red('请先生成grpc mock 代码'));
  }
};

export default grpcMockInit;

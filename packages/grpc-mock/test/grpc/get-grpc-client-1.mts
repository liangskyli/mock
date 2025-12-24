import type { GrpcObject, Metadata , ServiceClientConstructor } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { lodash } from '@liangskyli/utils';
import getGrpcObjectGroup from '../grpc-mock/grpc-obj';

type MetadataMap = Record<string, string | number | Buffer>;

function toMetadata(metadata: MetadataMap): Metadata {
  const metadataIns = new grpc.Metadata();
  if (metadata && typeof metadata === 'object') {
    Object.keys(metadata).forEach((keyName) => {
      metadataIns.add(keyName, '' + metadata[keyName]);
    });
  }
  return metadataIns;
}

export const start = async (): Promise<unknown> => {
  const grpcObject = await getGrpcObjectGroup();
  const proto = lodash.get<GrpcObject, string>(
    grpcObject,
    'trade_trade_zxkp.trade_zxkp_proto',
  ) as GrpcObject;
  const client = new (proto.ActivityService as ServiceClientConstructor)(
    'localhost:50003',
    grpc.credentials.createInsecure(),
  );
  return new Promise((resolve, reject) => {
    let responseData: any;
    const call = client.GetListByBuildingId(
      { buildingId: 1 },
      toMetadata({ a: 1, b: 2 }),
      (err: any, response: any) => {
        if (err) {
          reject(err);
          return;
        }
        responseData = response;
      },
    );
    call.on('status', (status: any) => {
      // 在这里 resolve，确保已经获取到所有 metadata
      if (status.code === grpc.status.OK) {
        resolve({
          response: responseData,
          metadata: status.metadata,
        });
      }
    });
  });
};

export const start2 = async (): Promise<unknown> => {
  const grpcObject = await getGrpcObjectGroup();
  const proto = lodash.get<GrpcObject, string>(
    grpcObject,
    'serverName1.activity_package',
  ) as GrpcObject;
  const client = new (proto.ActivityService as ServiceClientConstructor)(
    'localhost:50000',
    grpc.credentials.createInsecure(),
  );
  return new Promise((resolve, reject) => {
    let responseData: any;
    // 注意：unary call 的 callback 只有两个参数 (err, response)
    // 第三个参数 metadataRes 实际上是 undefined，因为 @grpc/grpc-js 的 UnaryCallback 类型定义只支持两个参数
    const call = client.Create(
      { activityId: 1 },
      toMetadata({ a: 1, b: 2 }),
      (err: any, response: any) => {
        if (err) {
          reject(err);
          return;
        }
        responseData = response;
      },
    );
    // 获取 trailing metadata (包含在 status 事件中)
    call.on('status', (status: any) => {
      // 在这里 resolve，确保已经获取到所有 metadata
      if (status.code === grpc.status.OK) {
        resolve({
          response: responseData,
          metadata: status.metadata,
        });
      }
    });
  });
};

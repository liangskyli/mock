import * as grpc from 'grpc';
import { lodash } from '@liangskyli/utils';
import grpcObject from '../grpc-mock/grpc-obj';
import type { Metadata } from 'grpc';

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

export const start = async (): Promise<{ response: any; metadata: Metadata }> => {
  const proto = lodash.get<any, string>(grpcObject, 'trade_trade_zxkp.trade_zxkp_proto');
  const client = new proto.ActivityService('localhost:50003', grpc.credentials.createInsecure());
  return new Promise((resolve, reject) => {
    client.GetListByBuildingId(
      { buildingId: 1 },
      toMetadata({ a: 1, b: 2 }),
      (err: any, response: any, metadataRes: Metadata) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ response, metadata: metadataRes });
      },
    );
  });
};

export const start2 = async (): Promise<{ response: any; metadata: Metadata }> => {
  const proto = lodash.get<any, string>(grpcObject, 'serverName1.activity_package');
  const client = new proto.ActivityService('localhost:50000', grpc.credentials.createInsecure());
  return new Promise((resolve, reject) => {
    client.Create(
      { activityId: 1 },
      toMetadata({ a: 1, b: 2 }),
      (err: any, response: any, metadataRes: Metadata) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ response, metadata: metadataRes });
      },
    );
  });
};

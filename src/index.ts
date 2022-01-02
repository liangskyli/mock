import mockServer from './http/server/server';

export default mockServer;

export { default as genMockData } from './http/gen/index';
export type { IGenMockDataOpts } from './http/gen/index';
export { default as getMiddleware } from './http/server/middleware';
export { default as initSocketServer } from './http/server/socket-server';
export { default as grpcMockInit } from './grpc/mock-service/service';
export type {
  IMockService,
  IProtoItem,
  IImplementationData,
  ICustomData,
} from './grpc/mock-service/service-type';
export { defaultLoaderOptions, ConfigFileOptionsCLI, gen as grpcMockCodeGen } from './grpc/gen';

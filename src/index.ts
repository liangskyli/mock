import mockServer from './server';

export default mockServer;

export { default as getMiddleware } from './middleware';
export { default as initSocketServer } from './socket-server';
export { default as grpcMockInit } from './grpc/mock-service/service';
export type { IMockService, IProtoItem } from './grpc/mock-service/mock-service';
export { defaultLoaderOptions, gen as grpcMockCodeGen } from './grpc/gen';

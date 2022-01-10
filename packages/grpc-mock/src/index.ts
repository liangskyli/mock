export { default as grpcMockInit } from './grpc/mock-service/service';
export type {
  IMockService,
  IProtoItem,
  IImplementationData,
  ICustomData,
} from './grpc/mock-service/service-type';
export { defaultLoaderOptions, ConfigFileOptionsCLI, gen as grpcMockCodeGen } from './grpc/gen';

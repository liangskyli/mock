import grpcMockInit from './grpc/mock-service/service';

export { commandCodeGenCli } from './cli/grpc-mock-code-gen';
export { commandServerStartCli } from './cli/grpc-mock-server-start';
export {
  ConfigFileOptionsCLI,
  defaultLoaderOptions,
  gen as grpcMockCodeGen,
} from './grpc/gen';
export type {
  ICustomData,
  IImplementationData,
  IMockService,
  IProtoItem,
} from './grpc/mock-service/service-type';

export default grpcMockInit;

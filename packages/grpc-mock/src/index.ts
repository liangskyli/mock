import grpcMockInit from './mock-service/service';

export { commandCodeGenCli } from './cli/grpc-mock-code-gen';
export { commandServerStartCli } from './cli/grpc-mock-server-start';
export {
  ConfigFileOptionsCLI,
  defaultLoaderOptions,
  grpcMockCodeGen,
} from './gen/index';
export type {
  ICustomData,
  IImplementationData,
  IMockService,
  IProtoItem,
} from './mock-service/service-type';

export default grpcMockInit;

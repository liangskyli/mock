import type { ConfigFileOptionsCLI } from './gen';
import { defaultLoaderOptions, grpcMockCodeGen } from './gen';
import grpcMockInit from './mock-service/service';

const defineConfig = (config: ConfigFileOptionsCLI) => {
  return config;
};

export { commandCodeGenCli } from './cli/grpc-mock-code-gen';
export { commandServerStartCli } from './cli/grpc-mock-server-start';
export type {
  ICustomData,
  IImplementationData,
  IMockService,
  IProtoItem,
} from './mock-service/service-type';
export {
  ConfigFileOptionsCLI,
  defaultLoaderOptions,
  defineConfig,
  grpcMockCodeGen,
};

export default grpcMockInit;

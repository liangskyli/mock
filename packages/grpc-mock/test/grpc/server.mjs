import { mockServerLoadScript } from '@liangskyli/grpc-mock';

mockServerLoadScript({
  configFile: './test/grpc/mock.config.cli.ts',
});

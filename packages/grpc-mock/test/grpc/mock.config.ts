import type { ConfigFileOptionsCLI } from '@liangskyli/grpc-mock';

const config: Pick<ConfigFileOptionsCLI, 'loaderOptions'> = {
  loaderOptions: {
    defaults: false,
    longs: String,
  },
};
export default config;

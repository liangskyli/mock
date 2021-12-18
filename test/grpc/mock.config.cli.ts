import type { ConfigFileOptionsCLI } from '../../src';

const config: ConfigFileOptionsCLI = {
  rootPath: './test/grpc/root2.json',
  grpcMockDir: './test',
  grpcMockFolderName: 'grpc-mock',
  rootPathServerNameMap: {
    trade_server_auth: 'server_auth',
    trade_server_smart_cashier: 'server_smart_cashier',
    '2c_thanos_third': 'thanos_third',
    trade_trade_zxkp: 'trade_zxkp',
    trade_trade_center: 'trade_center',
  },
  loaderOptions: {
    defaults: false,
    longs: String,
  },
  prettierOptions: { singleQuote: false },
};
export default config;

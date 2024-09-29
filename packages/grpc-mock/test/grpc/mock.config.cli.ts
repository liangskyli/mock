import { defineConfig } from '@liangskyli/grpc-mock';

export default defineConfig({
  rootPath: './docs/root.json',
  grpcMockDir: './test',
  grpcMockFolderName: 'grpc-mock',
  grpcNpmName: '@grpc/grpc-js',
  loaderOptions: {
    defaults: false,
    longs: String,
  },
  prettierOptions: { singleQuote: true },
  /*defaultMockData: {
    number: 2,
    boolean: true,
    stringNumber: '"5"',
    mapString: 'mapString',
  },*/
});

/*export default defineConfig({
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
  prettierOptions: { singleQuote: true },
});*/

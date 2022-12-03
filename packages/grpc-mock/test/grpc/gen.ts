import { grpcMockCodeGen } from '../../src';

grpcMockCodeGen({
  grpcMockDir: './test',
  rootPath: {
    grpcProtoServes: [
      { serverName: 'serverName1', serverDir: './test/proto-servers/server1' },
      { serverName: 'serverName2', serverDir: './test/proto-servers/server2' },
    ],
  },
  prettierOptions: { singleQuote: true },
  //configFilePath:'./test/grpc/mock.config.ts',
});

/*grpcMockCodeGen({
  grpcMockDir: './test',
  rootPath:'./test/grpc/root2.json',
  rootPathServerNameMap:{
    'trade_server_auth':'server_auth',
    'trade_server_smart_cashier':'server_smart_cashier',
    '2c_thanos_third':'thanos_third',
    'trade_trade_zxkp':'trade_zxkp',
    'trade_trade_center':'trade_center',
  },
  prettierOptions: { singleQuote: true },
  configFilePath:'./test/grpc/mock.config.ts',
});*/

/*grpcMockCodeGen({
  grpcMockDir: './test',
  rootPath:'./test/grpc/root3.json',
  rootPathServerNameMap:{
    'component-center_cc_file_box':'cc_file_box',
  },
  prettierOptions: { singleQuote: true },
  configFilePath:'./test/grpc/mock.config.ts',
});*/

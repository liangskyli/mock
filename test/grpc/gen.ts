import { gen } from '../../src/grpc/gen';

gen({
  grpcMockDir: './test',
  rootPath: {
    grpcProtoServes: [
      { serverName: 'serverName1', serverDir: './test/proto-servers/server1' },
      { serverName: 'serverName2', serverDir: './test/proto-servers/server2' },
    ],
  },
  //configFilePath:'./test/grpc/mock.config.ts',
});

/*gen({
  grpcMockDir: './test',
  rootPath:'./test/grpc/root2.json',
  rootPathServerNameMap:{
    'trade_server_auth':'server_auth',
    'trade_server_smart_cashier':'server_smart_cashier',
    '2c_thanos_third':'thanos_third',
    'trade_trade_zxkp':'trade_zxkp',
    'trade_trade_center':'trade_center',
  },
  configFilePath:'./test/grpc/mock.config.ts',
});*/

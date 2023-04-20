import * as path from 'path';
import mockServer from '../src/index';

//mockServer();
//mockServer({ mockDir: 'test' });
mockServer({
  mockDir: path.join(__dirname, '/'),
  exclude: ['mock/b.ts'],
  port: 8002,
  socketConfig: {
    enable: true,
    namespaceList: ['/tvwall'],
    opts: {
      path: '/trade-zxkp-ws/socket.io/',
      cors: {
        origin: ['http://localhost:9527', 'http://localhost:63342'],
        credentials: true,
      },
    },
    mockControllerUrl: 'mock/socket/sock.ts',
  },
});
//mockServer({port: 9001 });
//mockServer({hostname: '127.0.0.1',port: 9001 });
//console.log(path.join(__dirname, '../../http-mock-gen/test/genHttpMock/'));
/*mockServer({
  port: 7010,
  mockDir: path.join(__dirname, '../../http-mock-gen/test/genHttpMock/'),
});*/

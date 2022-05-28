import mockServer from '../src';
import * as path from 'path';

//mockServer();
//mockServer({ mockDir: 'test' });
/*mockServer({
  mockDir: path.join(__dirname, '/'),
  exclude: ['mock/b.ts'],
  socketConfig: {
    enable: true,
    opts: {
      path: '/socket.io/',
      cors: {
        origin: ['http://localhost:63342'],
      },
    },
    mockControllerUrl: 'mock/socket/sock.ts',
  },
});*/
//mockServer({port: 9001 });
//mockServer({hostname: '127.0.0.1',port: 9001 });
//console.log(path.join(__dirname, '../../http-mock-gen/test/genHttpMock/'));
mockServer({
  port: 7010,
  mockDir: path.join(__dirname, '../../http-mock-gen/test/genHttpMock/'),
});

import mockServer from '../src';
import path from 'path';

//mockServer();
//mockServer({ mockDir: 'test' });
mockServer({
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
});
//mockServer({port: 9001 });
//mockServer({hostname: '127.0.0.1',port: 9001 });

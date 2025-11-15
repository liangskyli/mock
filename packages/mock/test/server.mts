import mockServer from '@liangskyli/mock';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const curDirName = path.dirname(fileURLToPath(import.meta.url));

//mockServer();
//mockServer({ mockDir: 'test' });
mockServer({
  mockDir: path.join(curDirName, '/'),
  exclude: ['mock/b.mts'],
  port: 8002,
  socketConfig: {
    enable: true,
    namespaceList: ['/namespace'],
    opts: {
      path: '/socket.io/',
      cors: {
        origin: ['http://localhost:63342'],
        credentials: true,
      },
    },
    mockControllerUrl: 'mock/socket/sock.mts',
  },
});
//mockServer({port: 9001 });
//mockServer({hostname: '127.0.0.1',port: 9001 });
//console.log(path.join(__dirname, '../../http-mock-gen/test/all-gen-dirs/gen-mock/'));
/*mockServer({
  port: 7010,
  mockDir: path.join(__dirname, '../../http-mock-gen/test/all-gen-dirs/gen-mock/'),
});*/

import mockServer from '@liangskyli/mock';
import { fileURLToPath } from 'node:url';
import * as path from 'path';

const curDirName = path.dirname(fileURLToPath(import.meta.url));

//mockServer();
//mockServer({ mockDir: 'test' });
mockServer({
  mockDir: path.join(curDirName, '../'),
  //mockDir: path.join(curDirName, '../../'),
  exclude: ['mock/b.ts'],
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
    //mockControllerUrl: 'mock/socket/sock.ts',
  },
});
//mockServer({port: 9001 });
//mockServer({hostname: '127.0.0.1',port: 9001 });
//console.log(path.join(__dirname, '../../http-mock-gen/test/all-gen-dirs/gen-mock/'));
/*mockServer({
  port: 7010,
  mockDir: path.join(__dirname, '../../http-mock-gen/test/all-gen-dirs/gen-mock/'),
});*/

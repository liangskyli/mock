import { defineConfig } from '@liangskyli/mock';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const curDirName = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  mockDir: path.join(curDirName, '/'),
  //mockDir: path.join(curDirName, '../../http-mock-gen/test/all-gen-dirs/gen-mock-cli/'),
  port: 8002,
  socketConfig: {
    enable: false,
    opts: {
      path: '/socket.io/',
      cors: {
        origin: ['http://localhost:63342'],
      },
    },
    //mockControllerUrl: path.join(__dirname, '/mock/socket/sock.ts'),
    //mockControllerUrl: 'mock/socket/sock.ts',
    //mockControllerUrl: 'mock/socket/sock.js',
    mockControllerUrl: 'mock/socket/sock3.mts',
  },
});

import path from 'path';
import type { IOpts } from '../src/http/server/server';

const config: IOpts = {
  mockDir: path.join(__dirname, '/'),
  //mockDir: path.join(__dirname, '/genHttpMock'),
  port: 8002,
  socketConfig: {
    enable: true,
    opts: {
      path: '/socket.io/',
      cors: {
        origin: ['http://localhost:63342'],
      },
    },
    //mockControllerUrl: path.join(__dirname, '/mock/socket/sock.ts'),
    //mockControllerUrl: 'mock/socket/sock.ts',
    //mockControllerUrl: 'mock/socket/sock2.js',
    mockControllerUrl: 'mock/socket/sock3.ts',
  },
};

export default config;

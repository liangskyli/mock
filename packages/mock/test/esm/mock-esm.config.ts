import { defineConfig } from '@liangskyli/mock';

export default defineConfig({
  //mockDir: path.join(curDirName, '../'),
  //mockDir: path.join(__dirname, '/gen-mock'),
  //mockDir: path.join(__dirname, '../../http-mock-gen/test/all-gen-dirs/gen-mock/'),
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
});

# socket mock 迁入已有的webpack-dev-server服务

- mock 配置文件
  - 配置文件支持使用defineConfig定义ts类型

```ts
import { defineConfig } from '@liangskyli/mock';
import path from 'node:path';

export default defineConfig({
  socketConfig: {
    enable: true,
    // 自定义命名空间
    // namespaceList:['/namespace'],
    opts: {
      path: '/socket.io/',
      cors: {
        origin: ['http://localhost:63342'],
      },
    },
    mockControllerUrl: 'mock/socket/sock.ts',
  },
});
```

- webpack.config.ts 文件

```ts
import { getMiddleware, initSocketServer } from '@liangskyli/mock';
import type Webpack from 'webpack';
import type WebpackDevServer from 'webpack-dev-server';
import mockConfig from './mock.config';

const socketConfig = mockConfig.socketConfig;
const host = '0.0.0.0';
const port = 8002;

const webpackConfig: Webpack.Configuration = {
  entry: './test/app.js',
  mode: 'development',
  devServer: {
    host,
    port,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer || !devServer.app) {
        throw new Error('webpack-dev-server is not defined');
      }

      getMiddleware({ mockDir: mockConfig.mockDir }).then(
        ({ middleware, middlewareWatcher }) => {
          devServer.app!.use(middleware);

          devServer.app!.get('/', (req, res) => {
            res.send('homepage');
          });
          console.log(`look in http://localhost:${port}/`);

          if (socketConfig && socketConfig.enable) {
            initSocketServer({
              mockDir: mockConfig.mockDir,
              socketConfig,
              server: devServer.server!,
              port,
              hostname: host,
              middlewareWatcher,
            });
          }
        },
      );

      return middlewares;
    },
  },
};
export default webpackConfig;
```

- webpack 启动服务

```ts
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';

const compiler = Webpack(webpackConfig);
const devServerOptions = { ...webpackConfig.devServer, open: false };
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

runServer().then();
```

- mockControllerUrl 逻辑
    - 可以使用better-mock库生成随机数据，支持js,ts文件，热更新。灵活模拟 socket 场景数据。

```ts
import type { ISocketDefaultController } from '@liangskyli/mock';
import mockjs from 'better-mock';

const socketDefaultController: ISocketDefaultController = (socket) => {
    const data = mockjs.mock({
        'list|2': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
        a:'1',
    });
    // 数据发送客户端
    socket.emit('toClient', data);
    // 定时推送数据
    let toClient = 1;
    setInterval(() => {
        socket.emit('toClient', toClient++);
    }, 5000);

    // 接收客户端数据
    socket.on('toServer', (clientData) => {
        console.log('from client:', clientData);
    });
};

export default socketDefaultController;
```

- 支持自定义命名空间socket连接，导出socketNamespaceController方法
  - mock 配置文件里socketConfig配置：namespaceList:['/namespace']
  - mockControllerUrl 逻辑

```ts
import type { ISocketNamespaceController } from '@liangskyli/mock';

const socketNamespaceController: ISocketNamespaceController = (
) => {
  // namespace
  return {
    '/namespace': (socket) => {
      const data = { a: 112 };
      // 数据发送客户端
      socket.emit('toClient', data);

      // 接收客户端数据
      socket.on('toServer', (clientData) => {
        console.log('from client:', clientData);
      });
    }
  };
};
export { socketNamespaceController };
```

- socket html 代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>socket</title>
    <script src="socket.io.js"></script>
  </head>
  <body>
    <script type="text/javascript">
      const url = 'ws://localhost:8002';
      // namespace 命名空间
      // const url = 'ws://localhost:8002/namespace';
      const socket = io(url, { path: '/socket.io/' });
      socket.on('connect', () => {
        console.log('connect:', socket.connected,',socketId:',socket.id);
      });

      socket.on('toClient', (data) => {
          console.log('socket data:',data);
          socket.emit('toServer',{id:'111',txt:'hello1'});
      });

      socket.on('disconnect', () => {
        console.log('disconnect!');
      });

      function send(){
        socket.emit('toServer',{id:'22',txt:'hello2'});
      }
    </script>

    socket
    <button onclick="send()">按钮</button>
  </body>
</html>
```

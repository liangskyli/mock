# http mock 迁入已有的webpack-dev-server服务

- webpack.config.ts 文件

```ts
import { getMiddleware } from '@liangskyli/mock';
import type Webpack from 'webpack';
import type WebpackDevServer from 'webpack-dev-server';

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

      getMiddleware().then(
        ({ middleware, middlewareWatcher }) => {
          devServer.app!.use(middleware);

          devServer.app!.get('/', (req, res) => {
            res.send('homepage');
          });
          console.log(`look in http://localhost:${port}/`);
          
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

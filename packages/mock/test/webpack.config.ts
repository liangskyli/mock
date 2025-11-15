import { getMiddleware, initSocketServer } from '@liangskyli/mock';
import type Webpack from 'webpack';
import mockConfig from './mock.config.mjs';

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

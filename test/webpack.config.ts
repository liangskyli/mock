import type WebpackDevServer from 'webpack-dev-server';
import type Webpack from 'webpack';
import { getMiddleware, initSocketServer } from '../src';
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
    onBeforeSetupMiddleware: (devServer: WebpackDevServer) => {
      if (!devServer || !devServer.app) {
        throw new Error('webpack-dev-server is not defined');
      }

      getMiddleware().then(({ middleware, middlewareWatcher }) => {
        devServer.app!.use(middleware);

        devServer.app!.get('/', (req, res) => {
          res.send('homepage');
        });
        console.log('look in http://localhost:4000/');

        if (socketConfig && socketConfig.enable) {
          initSocketServer({
            socketConfig,
            server: devServer.server!,
            port,
            hostname: host,
            middlewareWatcher,
          });
        }
      });
    },
  },
};
export default webpackConfig;

import type WebpackDevServer from 'webpack-dev-server';
import type Webpack from 'webpack';
import { getMiddleware } from '../src';

const webpackConfig: Webpack.Configuration = {
  entry: './test/app.js',
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    port: 4000,
    onBeforeSetupMiddleware: (devServer: WebpackDevServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      getMiddleware().then((middleware) => {
        devServer.app.use(middleware);

        devServer.app.get('/', (req, res) => {
          res.send('homepage');
        });
        console.log('look in http://localhost:4000/');
      });
    },
  },
};
export default webpackConfig;

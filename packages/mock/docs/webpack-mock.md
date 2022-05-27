# http mock 迁入已有的webpack-dev-server服务

- webpack.config.ts 文件

```ts
import type WebpackDevServer from 'webpack-dev-server';
import type Webpack from 'webpack';
import { getMiddleware } from '@liangskyli/mock';

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
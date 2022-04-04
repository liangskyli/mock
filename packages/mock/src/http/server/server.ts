import http from 'http';
import express from 'express';
import { address } from '@liangskyli/utils';
import getMiddleware from './middleware';
import { killProcess } from '../tools';
import type { ISocketConfig } from './socket-server';
import initSocketServer from './socket-server';

const app = express();

export type IOpts = {
  mockDir?: string;
  hostname?: string;
  port?: number;
  watch?: boolean;
  exclude?: string[];
  socketConfig?: ISocketConfig;
};

const mockServer = async (opts: IOpts = {}) => {
  const {
    mockDir = './',
    hostname = '0.0.0.0',
    port = 8001,
    watch = true,
    exclude,
    socketConfig,
  } = opts;
  const HOME_PAGE = 'homepage';
  let httpServer: http.Server | undefined;

  try {
    const init = async () => {
      const { middleware, middlewareWatcher } = await getMiddleware({ mockDir, watch, exclude });
      app.use(middleware);
      app.get('/', (req: any, res: any) => {
        res.end(HOME_PAGE);
      });
      httpServer = app.listen(port, hostname);

      if (socketConfig && socketConfig.enable) {
        initSocketServer({
          socketConfig,
          server: httpServer,
          mockDir,
          port: port,
          hostname: hostname,
          middlewareWatcher,
        });
      }

      return {
        hostname,
        port,
      };
    };

    init().then((result) => {
      const lanIp = address.ip();
      const protocol = 'http';
      const hostName = result.hostname === '0.0.0.0' ? 'localhost' : result.hostname;
      const localUrl = `${protocol}://${hostName}:${result.port}`;
      const lanUrl = `${protocol}://${lanIp}:${result.port}`;

      console.log(
        [
          '  http mock server running at:',
          `  - Local:   ${localUrl}`,
          lanUrl && `  - Network: ${lanUrl}`,
        ]
          .filter(Boolean)
          .join('\n'),
      );

      return Promise.resolve('init ok');
    });

    killProcess(httpServer, 'httpServer');
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};

export default mockServer;

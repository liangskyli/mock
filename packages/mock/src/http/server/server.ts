import { Server } from '@umijs/server';
import { address, chalk } from '@umijs/utils';
import getMiddleware from './middleware';
import { killProcess } from '../tools';
import type { ISocketConfig } from './socket-server';
import getSocketServer from './socket-server';

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
  let server: Server | undefined;

  try {
    const init = async () => {
      const { middleware, middlewareWatcher } = await getMiddleware({ mockDir, watch, exclude });
      server = new Server({
        beforeMiddlewares: [middleware],
        compilerMiddleware: (req, res, next) => {
          if (req.path === '/') {
            res.end(HOME_PAGE);
          } else {
            next();
          }
        },
      });
      const result = await server.listen({ hostname, port });

      if (socketConfig && socketConfig.enable) {
        getSocketServer({
          socketConfig,
          server: result.server.listeningApp,
          mockDir,
          port: result.port,
          hostname: result.hostname,
          middlewareWatcher,
        });
      }

      return result;
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
          `  - Local:   ${chalk.cyan(localUrl)}`,
          lanUrl && `  - Network: ${chalk.cyan(lanUrl)}`,
        ]
          .filter(Boolean)
          .join('\n'),
      );

      return Promise.resolve('aaa');
    });

    killProcess(server, 'server');
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};

export default mockServer;

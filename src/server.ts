import { Server } from '@umijs/server';
import { address, chalk } from '@umijs/utils';
import getMiddleware from './middleware';
import { killProcess } from './tools';

export type IOpts = {
  mockDir?: string;
  hostname?: string;
  port?: number;
  watch?: boolean;
  exclude?: string[];
};

const mockServer = (opts: IOpts = {}) => {
  const { mockDir, hostname = '0.0.0.0', port = 8001, watch = true, exclude } = opts;
  const HOME_PAGE = 'homepage';
  let server: any;

  try {
    const init = async () => {
      const middleware = await getMiddleware({ mockDir, watch, exclude });
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
      opts.port = result.port;
      opts.hostname = result.hostname;
    };

    init().then(() => {
      const lanIp = address.ip();
      const protocol = 'http';
      const hostName = opts.hostname === '0.0.0.0' ? 'localhost' : opts.hostname;
      const localUrl = `${protocol}://${hostName}:${opts.port}`;
      const lanUrl = `${protocol}://${lanIp}:${opts.port}`;

      console.log(
        [
          '  http mock server running at:',
          `  - Local:   ${chalk.cyan(localUrl)}`,
          lanUrl && `  - Network: ${chalk.cyan(lanUrl)}`,
        ]
          .filter(Boolean)
          .join('\n'),
      );
    });

    killProcess(server, 'server');
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};

export default mockServer;

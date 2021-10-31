import { Service } from '@umijs/core';
import { Server } from '@umijs/server';
import { address, chalk, parseRequireDeps, winPath } from '@umijs/utils';
import { join } from 'path';
// @ts-ignore
import createMiddleware from '@umijs/preset-built-in/lib/plugins/commands/dev/mock/createMiddleware';
// @ts-ignore
import { getMockData } from '@umijs/preset-built-in/lib/plugins/commands/dev/mock/utils';

export type IOpts = {
  mockDir?: string;
  hostname?: string;
  port?: number;
};

const mockServer = (opts: IOpts = {}) => {
  const { mockDir = '/', hostname = '0.0.0.0', port = 8001 } = opts;
  const cwd = winPath(join(process.cwd(), mockDir));
  const HOME_PAGE = 'homepage';
  let watcher: any = null;
  let server: any;

  try {
    const init = async () => {
      const service = new Service({
        cwd,
        plugins: [],
      });
      await service.init();

      const registerBabel = (paths: string[]): void => {
        // support
        // clear require cache and set babel register
        const requireDeps = paths.reduce((memo: string[], file) => {
          memo = memo.concat(parseRequireDeps(file));
          return memo;
        }, []);
        requireDeps.forEach((f) => {
          if (require.cache[f]) {
            delete require.cache[f];
          }
        });
        service.babelRegister.setOnlyMap({
          key: 'mock',
          value: [...paths, ...requireDeps],
        });
      };

      const ignore = [
        // ignore mock files under node_modules
        'node_modules/**',
        ...(service.userConfig.mock?.exclude || []),
      ];

      const mockOpts = getMockData({
        cwd,
        ignore,
        registerBabel,
      });
      const { middleware, watcher: middlewareWatcher } = createMiddleware({
        ...mockOpts,
        updateMockData: async () =>
          getMockData({
            cwd,
            ignore,
            registerBabel,
          }),
      });
      watcher = middlewareWatcher;
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

    let closed = false;
    const onSignal = async () => {
      if (closed) return;
      closed = true;
      // 退出时触发事件
      await watcher?.close?.();
      server?.listeningApp?.close();

      process.exit(0);
    };
    // kill(2) Ctrl-C
    process.once('SIGINT', () => onSignal());
    // kill(3) Ctrl-\
    process.once('SIGQUIT', () => onSignal());
    // kill(15) default
    process.once('SIGTERM', () => onSignal());
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};

export default mockServer;

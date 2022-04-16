import { winPath, parseRequireDeps } from '@liangskyli/utils';
import { join, isAbsolute } from 'path';
import type { FSWatcher } from 'chokidar';
import createMiddleware from '../mock/createMiddleware';
import { getMockData } from '../mock/utils';
import { killProcess } from '../tools';
import type { Request, Response, NextFunction } from 'express';

const register = require('@babel/register');

export type IOpts = {
  mockDir?: string;
  watch?: boolean;
  exclude?: string[];
};

const getMiddleware = async (
  opts: IOpts = {},
): Promise<{ middleware: any; middlewareWatcher?: FSWatcher }> => {
  const { mockDir = './', watch = true, exclude } = opts;
  const cwd = winPath(isAbsolute(mockDir) ? mockDir : join(process.cwd(), mockDir));

  if (process.env.MOCK === 'false') {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
      return next();
    };
    return { middleware, middlewareWatcher: undefined };
  }

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
    register({
      plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
      ignore: [/node_modules/],
      only: [...paths, ...requireDeps],
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
      babelrc: false,
      cache: false,
    });
  };

  const ignore = [
    // ignore mock files under node_modules
    'node_modules/**',
    'mock/socket/**',
    'mock/custom-data/**',
    'mock/schema-api/**',
    ...(exclude || []),
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
  if (process.env.WATCH_FILES === 'false' || !watch) {
    await middlewareWatcher?.close?.();
  }
  killProcess(middlewareWatcher);
  return { middleware, middlewareWatcher };
};

export default getMiddleware;

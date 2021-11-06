import { Service } from '@umijs/core';
import { parseRequireDeps, winPath } from '@umijs/utils';
import { join, isAbsolute } from 'path';
// @ts-ignore
import createMiddleware from '@umijs/preset-built-in/lib/plugins/commands/dev/mock/createMiddleware';
// @ts-ignore
import { getMockData } from '@umijs/preset-built-in/lib/plugins/commands/dev/mock/utils';
import { killProcess } from './tools';

export type IOpts = {
  mockDir?: string;
  watch?: boolean;
  exclude?: string[];
};

const getMiddleware = async (opts: IOpts = {}) => {
  const { mockDir = './', watch = true, exclude } = opts;
  const cwd = winPath(isAbsolute(mockDir) ? mockDir : join(process.cwd(), mockDir));

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
  return middleware;
};

export default getMiddleware;

import { winPath } from '@liangskyli/utils';
import type { FSWatcher } from 'chokidar';
import type { NextFunction, Request, Response } from 'express';
import { isAbsolute, join } from 'node:path';
import createMiddleware from '../mock/createMiddleware';
import { getMockData } from '../mock/utils';
import { killProcess } from '../tools';

export type IOpts = {
  mockDir?: string;
  watch?: boolean;
  exclude?: string[];
};

const getMiddleware = async (
  opts: IOpts = {},
): Promise<{ middleware: any; middlewareWatcher?: FSWatcher }> => {
  const { mockDir = './', watch = true, exclude } = opts;
  const cwd = winPath(
    isAbsolute(mockDir) ? mockDir : join(process.cwd(), mockDir),
  );

  if (process.env.MOCK === 'false') {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
      return next();
    };
    return { middleware, middlewareWatcher: undefined };
  }

  const ignore = [
    // ignore mock files under node_modules
    'node_modules/**',
    'mock/socket/**',
    'mock/custom-data/**',
    'mock/schema-api/**',
    ...(exclude || []),
  ];

  const mockOpts = await getMockData({
    cwd,
    ignore,
  });
  const { middleware, watcher: middlewareWatcher } = createMiddleware({
    ...mockOpts,
    updateMockData: async () =>
      await getMockData({
        cwd,
        ignore,
      }),
  });
  if (process.env.WATCH_FILES === 'false' || !watch) {
    await middlewareWatcher?.close?.();
  }
  killProcess(middlewareWatcher);
  return { middleware, middlewareWatcher };
};

export default getMiddleware;

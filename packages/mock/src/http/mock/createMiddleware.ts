import { createDebug, lodash, signale } from '@liangskyli/utils';
import type { FSWatcher } from 'chokidar';
import chokidar from 'chokidar';
import type { NextFunction, Request, RequestHandler } from 'express';
import type { IGetMockDataResult } from './utils';
import { matchMock } from './utils';

const debug = createDebug('mock:createMiddleware');

export interface IMockOpts extends IGetMockDataResult {
  updateMockData: () => Promise<IGetMockDataResult>;
}

interface ICreateMiddleware {
  middleware: RequestHandler;
  watcher: FSWatcher;
}

export default function (opts = {} as IMockOpts): ICreateMiddleware {
  const { mockData, mockWatcherPaths, updateMockData } = opts;
  let data = mockData;

  // watcher
  debug('mockWatcherPaths', mockWatcherPaths);
  const watcher = chokidar.watch(mockWatcherPaths, {
    ignoreInitial: true,
  });
  watcher
    .on('ready', () => debug('Initial scan complete. Ready for changes'))
    .on(
      'all',
      // debounce avoiding too much file change events
      lodash.debounce(async (event: any, file: any) => {
        debug(`[${event}] ${file}, reload mock data`);
        let hasError = false;
        try {
          // refresh data
          data = (await updateMockData())?.mockData;
        } catch (e) {
          signale.error(e);
          hasError = true;
        }
        if (!hasError) {
          signale.success('Mock files parse success');
        } else {
          signale.error('Mock files parse error');
        }
      }, 300),
    );
  // close
  process.once('SIGINT', async () => {
    await watcher.close();
  });

  return {
    middleware: (req: Request, res: Response, next: NextFunction) => {
      const match = data && matchMock(req, data);
      if (match) {
        debug(`mock matched: [${match.method}] ${match.path}`);
        // @ts-expect-error res property correct
        return match.handler(req, res, next);
      } else {
        return next();
      }
    },
    watcher,
  } as unknown as ICreateMiddleware;
}

import { createDebug, winPath } from '@liangskyli/utils';
import assert from 'assert';
import bodyParser from 'body-parser';
import type { NextFunction, Request, RequestHandler } from 'express';
import { existsSync } from 'fs';
import { globSync } from 'glob';
import multer from 'multer';
import { join } from 'path';
import { pathToRegexp } from 'path-to-regexp';

// support all openapi method
const VALID_METHODS = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
];
const BODY_PARSED_METHODS = VALID_METHODS.filter((item) => item !== 'get');

const debug = createDebug('mock:utils');

interface IGetMockPaths {
  cwd: string;
  ignore?: string[];
}

export interface IMockDataItem {
  method: string;
  path: string;
  re: RegExp;
  keys: NonNullable<Parameters<typeof pathToRegexp>[1]>;
  handler: RequestHandler;
}

export interface IGetMockDataResult {
  mockData: IMockDataItem[];
  mockPaths: string[];
  mockWatcherPaths: string[];
}

export function getMockConfig(files: string[]) {
  return files.reduce<Record<string, any>>((memo, mockFile) => {
    try {
      const m = require(mockFile); // eslint-disable-line
      memo = {
        ...memo,
        ...(m.default || m),
      };
      return memo;
    } catch (e: any) {
      throw new Error(e.stack);
    }
  }, {});
}

export const cleanRequireCache = (paths: string[]) => {
  Object.keys(require.cache).forEach((file) => {
    if (
      paths.some((path) => {
        return winPath(file).indexOf(path) > -1;
      })
    ) {
      delete require.cache[file];
    }
  });
};

function parseKey(key: string) {
  let method = 'get';
  let path = key;
  if (/\s+/.test(key)) {
    const splited = key.split(/\s+/);
    method = splited[0].toLowerCase();
    path = splited[1]; // eslint-disable-line
  }
  assert(
    VALID_METHODS.includes(method),
    `Invalid method ${method} for path ${path}, please check your mock files.`,
  );
  return {
    method,
    path,
  };
}

function createHandler(method: any, path: any, handler: any) {
  return function (req: Request, res: any, next: NextFunction) {
    function sendData() {
      if (typeof handler === 'function') {
        // @ts-ignore
        multer().any()(req, res, () => {
          handler(req, res, next);
        });
      } else {
        res.json(handler);
      }
    }

    if (BODY_PARSED_METHODS.includes(method)) {
      bodyParser.json({ limit: '5mb', strict: false })(req, res, () => {
        bodyParser.urlencoded({ limit: '5mb', extended: true })(
          req,
          res as any,
          () => {
            sendData();
          },
        );
      });
    } else {
      sendData();
    }
  } as unknown as RequestHandler;
}

function normalizeConfig(config: Record<string, any>) {
  return Object.keys(config).reduce<IMockDataItem[]>((memo, key) => {
    const handler = config[key];
    const type = typeof handler;
    assert(
      type === 'function' || type === 'object',
      `mock value of ${key} should be function or object, but got ${type}`,
    );
    const { method, path } = parseKey(key);
    const keys: IMockDataItem['keys'] = [];
    const re = pathToRegexp(path, keys);
    memo.push({
      method,
      path,
      re,
      keys,
      handler: createHandler(method, path, handler),
    });
    return memo;
  }, []);
}

function decodeParam(val: any) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param ' ${val} '`;
      // @ts-ignore
      err.status = 400;
      // @ts-ignore
      err.statusCode = 400;
    }
    throw err;
  }
}

/**
 * mock/*
 * .umirc.mock.js
 * .umirc.mock.ts
 * src/** or pages/**
 *
 * @param opts
 */
export const getMockData: (opts: IGetMockPaths) => IGetMockDataResult = (
  opts,
) => {
  const { cwd, ignore = [] } = opts;
  const mockPaths = [
    ...(globSync('mock/**/*.[jt]s', {
      cwd,
      ignore,
    }) || []),
    ...(globSync('**/_mock.[jt]s', {
      cwd,
      ignore,
    }) || []),
    '.umirc.mock.js',
    '.umirc.mock.ts',
  ]
    .map((path) => join(cwd, path))
    .filter((path) => path && existsSync(path))
    .map((path) => winPath(path));

  debug(`load mock data including files ${JSON.stringify(mockPaths)}`);

  // get mock data
  const mockData = normalizeConfig(getMockConfig(mockPaths));

  const mockWatcherPaths = [...(mockPaths || []), join(cwd, 'mock')]
    .filter((path) => path && existsSync(path))
    .map((path) => winPath(path));

  return {
    mockData,
    mockPaths,
    mockWatcherPaths,
  };
};

export const matchMock = (
  req: Request,
  mockData: IMockDataItem[],
): IMockDataItem | undefined => {
  const { path: targetPath, method } = req;
  const targetMethod = method.toLowerCase();

  for (const mock of mockData) {
    const { method: mockMethod, re, keys } = mock;
    if (mockMethod === targetMethod) {
      const match = re.exec(targetPath);
      if (match) {
        const params: Record<any, any> = {};
        for (let i = 1; i < match.length; i += 1) {
          const key = keys[i - 1];
          const prop = key.name;
          const val = decodeParam(match[i]);
          if (
            val !== undefined ||
            !Object.prototype.hasOwnProperty.call(params, prop)
          ) {
            params[prop] = val;
          }
        }
        req.params = params;
        return mock;
      }
    }
  }
  return undefined;
};

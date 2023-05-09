import fs from 'fs-extra';
import { describe, expect, test, vi } from 'vitest';
import { getMethodData, mergeObject, writePrettierFile } from '../src/utils';

describe('utils', () => {
  test('getMethodData', () => {
    let data: any = {
      get: {
        responses: {
          '200': {
            content: {
              'application/json': {
                code: 0,
                data: {
                  a33: 'a33',
                },
                msg: 'msg',
              },
            },
          },
        },
      },
    };
    expect(getMethodData(data)).toEqual({
      method: 'get',
      data: {
        code: 0,
        data: {
          a33: 'a33',
        },
        msg: 'msg',
      },
    });
    data = {
      get: {
        responses: {
          default: {
            content: {},
          },
        },
      },
    };
    expect(getMethodData(data)).toEqual({
      method: 'get',
      data: {},
    });
  });

  test('mergeObject', () => {
    const sourceData = {
      a: 'a',
      b: [{ a: 'a', b: 'b' }],
      c: { d: ['d'], e: 1 },
      d: [],
      e: false,
    };
    expect(mergeObject({ a: 'a1' }, sourceData)).toEqual({
      a: 'a1',
      b: [{ a: 'a', b: 'b' }],
      c: { d: ['d'], e: 1 },
      d: [],
      e: false,
    });
    expect(mergeObject({ b: [{ a: 'ab' }, {}] }, sourceData)).toEqual({
      a: 'a',
      b: [
        { a: 'ab', b: 'b' },
        { a: 'a', b: 'b' },
      ],
      c: { d: ['d'], e: 1 },
      d: [],
      e: false,
    });
    expect(mergeObject({ b: [] }, sourceData)).toEqual({
      a: 'a',
      b: [],
      c: { d: ['d'], e: 1 },
      d: [],
      e: false,
    });
    expect(mergeObject({ c: { f: 'f', e: 2 }, e: true }, sourceData)).toEqual({
      a: 'a',
      b: [{ a: 'a', b: 'b' }],
      c: { d: ['d'], e: 2, f: 'f' },
      d: [],
      e: true,
    });
    expect(
      mergeObject({ a: undefined, c: { d: undefined } }, sourceData),
    ).toEqual({
      a: undefined,
      b: [{ a: 'a', b: 'b' }],
      c: { d: undefined, e: 1 },
      d: [],
      e: false,
    });
    expect(mergeObject({ c: { d: [undefined] } }, sourceData)).toEqual({
      a: 'a',
      b: [{ a: 'a', b: 'b' }],
      c: { d: [undefined], e: 1 },
      d: [],
      e: false,
    });
    expect(mergeObject({ c: { d: ['cd'] }, d: ['d'] }, sourceData)).toEqual({
      a: 'a',
      b: [{ a: 'a', b: 'b' }],
      c: { d: ['cd'], e: 1 },
      d: ['d'],
      e: false,
    });
    expect(
      mergeObject({ c: { d: ['cd', 11] }, d: ['d', 1] }, sourceData),
    ).toEqual({
      a: 'a',
      b: [{ a: 'a', b: 'b' }],
      c: { d: ['cd', 11], e: 1 },
      d: ['d', 1],
      e: false,
    });
  });

  test('writePrettierFile', () => {
    writePrettierFile({
      absolutePath: '/absolutePath',
      data: 'const test={a:1,b:\'b\'}',
      successTip: 'successTip',
      prettierOptions: {
        singleQuote: false,
        trailingComma: 'all',
        endOfLine: 'lf',
      },
    });
    const args = vi.mocked(fs.writeFileSync).mock.calls[0];
    expect(args[0] as string).toBe('/absolutePath');
    expect(args[1] as string).toBe(`const test = { a: 1, b: "b" };
`);
  });
});

import { describe, expect, test } from 'vitest';
import { getAbsolutePath } from '../src';
import getConfig from '../src/config';

describe('config', () => {
  test('getConfig', () => {
    expect(getConfig(getAbsolutePath('./test/example/a.ts'))).toEqual({ a: 1 });
    expect(() =>
      getConfig(getAbsolutePath('./test/example/not-exist.ts')),
    ).toThrow(/Cannot find module/);
  });
});

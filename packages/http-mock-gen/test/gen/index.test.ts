import { fs } from '@liangskyli/utils';
import path from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import genMockData from '../../src/gen';

describe('genMockData', () => {
  beforeEach(() => {
    vi.unmock('../../../utils/node_modules/fs-extra');
    vi.unmock('./src/utils.ts');
  });
  test('genMockData gen-mock dir', async () => {
    await genMockData({
      mockDir: './test/all-gen-dirs/gen-mock',
      mockPathPrefix: '/mockPathPrefix',
      //genTsDir: './test/all-gen-dirs/gen-mock',
      openapiPath: new URL(
        '../example/openapi/openapiv3-example2.json',
        import.meta.url,
      ),
      jsonSchemaFakerOptions: {
        minItems: 1,
        maxItems: 1,
      },
      mockDataReplace: (key, value) => {
        if (typeof value === 'string') {
          return key;
        }
        if (typeof value === 'number') {
          return 0;
        }
        if (typeof value === 'boolean') {
          return false;
        }
        return value;
      },
    });
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          './test/all-gen-dirs/gen-mock/mock/mock-data.json',
        ),
      ),
    ).toBeTruthy();
  });

  test('genMockData mockDir not exist', async () => {
    await expect(
      genMockData({
        mockDir: './test/all-gen-dirs/gen-mock-error',
        openapiPath: new URL(
          '../example/openapi/openapiv3-example2.json',
          import.meta.url,
        ),
      }),
    ).rejects.toThrow('mockDir not exits!');
  });
});

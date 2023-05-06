import { winPath } from '@liangskyli/utils';
import fs from 'fs-extra';
import path from 'path';
import { describe, expect, test, vi } from 'vitest';
import { GenCustomData } from './gen-custom-data';

const mockData = {
  '/root/getQueryParam-v3/{id}': {
    get: {
      parameters: {
        query: {
          queryParam1: 0,
          queryParam2: 0,
          queryParam4: ['0'],
          queryParam5: [false],
          queryParam3: [0],
          queryParam10: 0,
          queryParam9: {
            a: 'a',
            b: 'b',
          },
          queryParam8: {
            param1: 'param1',
          },
        },
      },
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
  },
};
describe('Generate mock/custom-data files', () => {
  test('Generate mock/custom-data files 1', async () => {
    new GenCustomData({
      mockData,
      genCustomDataPath: '/custom-data',
      interfaceApiRelativePath: '../schema-api/interface-api',
    });

    let args = vi.mocked(fs.writeFileSync).mock.calls[0];
    expect(winPath(args[0] as string)).toBe('/custom-data/index.ts');
    await expect(args[1]).toMatchFileSnapshot(
      './__test__snapshots__/custom-data/index.ts',
    );
    args = vi.mocked(fs.writeFileSync).mock.calls[1];
    expect(winPath(args[0] as string)).toBe('/custom-data/template-data.ts');
    expect(args[1]).contains('from \'../schema-api/interface-api\'');
    await expect(args[1]).toMatchFileSnapshot(
      './__test__snapshots__/custom-data/template-data.ts',
    );

    expect(
      (global as any).writePrettierFileArgs.prettierOptions,
    ).toBeUndefined();
    expect((global as any).writePrettierFileArgs.successTip).toBe(
      'Generate mock/custom-data/template-data.ts file success',
    );
  });
  test('Generate mock/custom-data files 2', async () => {
    new GenCustomData({
      mockData,
      genCustomDataPath: '/custom-data',
      interfaceApiRelativePath: 'schema-api/interface-api',
    });

    let args = vi.mocked(fs.writeFileSync).mock.calls[0];
    expect(winPath(args[0] as string)).toBe('/custom-data/index.ts');
    await expect(args[1]).toMatchFileSnapshot(
      './__test__snapshots__/custom-data2/index.ts',
    );
    args = vi.mocked(fs.writeFileSync).mock.calls[1];
    expect(winPath(args[0] as string)).toBe('/custom-data/template-data.ts');
    expect(args[1]).contains('from \'./schema-api/interface-api\'');
    await expect(args[1]).toMatchFileSnapshot(
      './__test__snapshots__/custom-data2/template-data.ts',
    );

    expect(
      (global as any).writePrettierFileArgs.prettierOptions,
    ).toBeUndefined();
    expect((global as any).writePrettierFileArgs.successTip).toBe(
      'Generate mock/custom-data/template-data.ts file success',
    );
  });
  test('Generate mock/custom-data files custom-data has exist', () => {
    new GenCustomData({
      mockData,
      genCustomDataPath: path.join(
        __dirname,
        './__test__snapshots__/custom-data',
      ),
      interfaceApiRelativePath: 'schema-api/interface-api',
    });
    expect(vi.mocked(fs.writeFileSync).mock.calls.length).toBe(0);
  });
});

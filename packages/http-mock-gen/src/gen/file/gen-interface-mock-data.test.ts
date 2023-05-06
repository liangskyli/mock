import fs from 'fs-extra';
import path from 'path';
import { describe, expect, test, vi } from 'vitest';
import { GenInterfaceMockData } from './gen-interface-mock-data';

describe('Generate mock/custom-data files', () => {
  test('Generate mock/custom-data files 1', async () => {
    const genMockAbsolutePath = path.join(__dirname, './__test__snapshots__');
    new GenInterfaceMockData({
      genTsAbsolutePath: path.join(
        __dirname,
        './__test__snapshots__/schema-api',
      ),
      mockDataAbsolutePath: path.join(
        __dirname,
        './__test__snapshots__/mock-data.json',
      ),
      genMockAbsolutePath,
    });

    const args = vi.mocked(fs.writeFileSync).mock.calls[0];
    expect(args[0] as string).toBe(
      path.join(__dirname, './__test__snapshots__', 'interface-mock-data.ts'),
    );
    expect(args[1]).contains('from \'./schema-api/interface-api\'');
    await expect(args[1]).toMatchFileSnapshot(
      './__test__snapshots__/interface-mock-data.ts',
    );

    expect(
      (global as any).writePrettierFileArgs.prettierOptions,
    ).toBeUndefined();
    expect((global as any).writePrettierFileArgs.successTip).toBe(
      'Generate mock/interface-mock-data.ts file success',
    );
  });
  test('Generate mock/custom-data files 2', () => {
    const genMockAbsolutePath = path.join(__dirname, './__test__snapshots__');
    new GenInterfaceMockData({
      genTsAbsolutePath: path.join(__dirname, './server/schema-api'),
      mockDataAbsolutePath: path.join(
        __dirname,
        './__test__snapshots__/mock-data.json',
      ),
      genMockAbsolutePath,
    });

    const args = vi.mocked(fs.writeFileSync).mock.calls[0];
    expect(args[0] as string).toBe(
      path.join(__dirname, './__test__snapshots__', 'interface-mock-data.ts'),
    );
    expect(args[1]).contains('from \'../server/schema-api/interface-api\'');
  });
});

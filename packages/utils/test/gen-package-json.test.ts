import fs from 'fs-extra';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { GenPackageJson, winPath } from '../src';

vi.mock('fs-extra', async (importOriginal) => {
  const mod = await importOriginal<any>();
  return {
    ...mod,
    default: {
      ...mod.default,
      writeFileSync: vi.fn(),
      ensureDirSync: vi.fn(),
    },
  };
});

vi.mock('../src/tools.ts', async (importOriginal) => {
  const mod = await importOriginal<any>();
  return {
    ...mod,
    writePrettierFile: async (opts: any) => {
      vi.stubGlobal('writePrettierFileArgs', opts);
      await mod.writePrettierFile(opts);
    },
  };
});

describe('gen-package-json', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test('GenPackageJson', async () => {
    await new GenPackageJson({
      genFilePath: './genFilePath',
      prettierOptions: undefined,
    }).generator();
    const args = vi.mocked(fs.writeFileSync).mock.calls[0];
    expect(winPath(args[0] as string)).toBe('genFilePath/package.json');
    await expect(args[1]).toMatchFileSnapshot(
      './__test__snapshots__/genFilePath/package.json',
    );
    expect((global as any).writePrettierFileArgs).toEqual({
      absolutePath: 'genFilePath/package.json',
      data: `{
  "type": "module"
}`,
      prettierOptions: {
        parser: 'json',
      },
      successTip: 'Generate package.json success in ./genFilePath',
    });
  });
});

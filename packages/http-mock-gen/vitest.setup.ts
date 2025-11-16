import { beforeEach, vi } from 'vitest';

vi.mock('../utils/node_modules/fs-extra', async (importOriginal) => {
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

vi.mock('@liangskyli/utils', async (importOriginal) => {
  const mod = await importOriginal<any>();
  return {
    ...mod,
    writePrettierFile: async (opts: any) => {
      vi.stubGlobal('writePrettierFileArgs', opts);
      await mod.writePrettierFile(opts);
    },
  };
});

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

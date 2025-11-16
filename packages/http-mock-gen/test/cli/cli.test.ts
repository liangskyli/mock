import { fs, winPath } from '@liangskyli/utils';
import { execa } from 'execa';
import path from 'node:path';
import { URL } from 'node:url';
import { describe, expect, test } from 'vitest';

const cwd = new URL('../../', import.meta.url);
const cmd = 'node';
describe('CLI', () => {
  test('CLI test esm', async () => {
    await fs.remove(
      path.join(__dirname, '../all-gen-dirs/gen-mock-cli/mock/custom-data'),
    );
    const { stdout } = await execa(
      cmd,
      ['./bin/index.js', '-c', './test/cli/mock.config.cli.ts'],
      {
        cwd,
      },
    );
    await expect(winPath(stdout)).toMatchSnapshot();
  });
});

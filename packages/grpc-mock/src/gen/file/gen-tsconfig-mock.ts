import type { IPrettierOptions } from '@liangskyli/utils';
import { copyOptions, writePrettierFile } from '@liangskyli/utils';
import path from 'node:path';

export type IGenTsConfigMockOpts = {
  genMockPath: string;
  prettierOptions?: IPrettierOptions;
};

export class GenTsConfigMock {
  private readonly opts: IGenTsConfigMockOpts;

  constructor(opts: IGenTsConfigMockOpts) {
    this.opts = opts;
  }

  public async generator() {
    const { genMockPath } = this.opts;
    const genMockPathArray = path.join(genMockPath).split(path.sep);
    // 生成tsconfig.mock.json文件

    const tsconfigMockConfigData = `{
    extends: '../tsconfig.json',
    compilerOptions: {
      rootDir: '../',
    },
    include: ["${genMockPathArray[genMockPathArray.length - 1]}/**/*"],
    exclude: ['node_modules'],
  }`;
    await this.writeFile(tsconfigMockConfigData);
  }
  private async writeFile(data: string) {
    const { genMockPath, prettierOptions: defaultPrettierOptions } = this.opts;
    let prettierOptions = copyOptions(defaultPrettierOptions);
    if (prettierOptions === undefined) {
      prettierOptions = { parser: 'json' };
    }
    prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

    const absolutePath = path.join(genMockPath, 'tsconfig.mock.json');

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: `Generate tsconfig.mock.json success in ${genMockPath}`,
    });
  }
}

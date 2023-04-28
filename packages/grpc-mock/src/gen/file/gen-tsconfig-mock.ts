import type { IPrettierOptions } from '@liangskyli/utils';
import { copyOptions } from '@liangskyli/utils';
import path from 'path';
import { writePrettierFile } from '../../utils';

export type IGenTsConfigMockOpts = {
  genMockPath: string;
  prettierOptions?: IPrettierOptions;
};

export class GenTsConfigMock {
  private readonly opts: IGenTsConfigMockOpts;

  constructor(opts: IGenTsConfigMockOpts) {
    this.opts = opts;
    this.generator();
  }

  private generator() {
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
    this.writeFile(tsconfigMockConfigData);
  }
  private writeFile(data: string) {
    const { genMockPath, prettierOptions: defaultPrettierOptions } = this.opts;
    let prettierOptions = copyOptions(defaultPrettierOptions);
    if (prettierOptions === undefined) {
      prettierOptions = { parser: 'json' };
    }
    prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

    const absolutePath = path.join(genMockPath, 'tsconfig.mock.json');

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: `Generate tsconfig.mock.json success in ${genMockPath}`,
    });
  }
}

import path from 'node:path';
import type { IPrettierOptions } from './tools';
import { copyOptions, writePrettierFile } from './tools';

export type IGenPackageJsonOpts = {
  genFilePath: string;
  prettierOptions?: IPrettierOptions;
};

export class GenPackageJson {
  private readonly opts: IGenPackageJsonOpts;

  constructor(opts: IGenPackageJsonOpts) {
    this.opts = opts;
  }

  public async generator() {
    // 生成package.json文件
    const data = `{
  "type": "module"
}`;
    await this.writeFile(data);
  }
  private async writeFile(data: string) {
    const { genFilePath, prettierOptions: defaultPrettierOptions } = this.opts;
    let prettierOptions = copyOptions(defaultPrettierOptions);
    if (prettierOptions === undefined) {
      prettierOptions = { parser: 'json' };
    }
    prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

    const absolutePath = path.join(genFilePath, 'package.json');

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: `Generate package.json success in ${genFilePath}`,
    });
  }
}

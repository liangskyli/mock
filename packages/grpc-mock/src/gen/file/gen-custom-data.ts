import type { IPrettierOptions } from '@liangskyli/utils';
import fs from 'fs-extra';
import path from 'path';
import { packageName, writePrettierFile } from '../../utils';

export type IGenCustomDataOpts = {
  genMockPath: string;
  genCustomDataPath: string;
  prettierOptions?: IPrettierOptions;
};

export class GenCustomData {
  private readonly opts: IGenCustomDataOpts;

  constructor(opts: IGenCustomDataOpts) {
    this.opts = opts;
    this.generator();
  }

  private generator() {
    const { genCustomDataPath } = this.opts;
    if (!fs.pathExistsSync(path.join(genCustomDataPath, 'index.ts'))) {
      fs.ensureDirSync(genCustomDataPath);

      this.writeIndexFile();
      this.writeTemplateDataFile();
    }
  }
  private writeIndexFile() {
    const { genMockPath, genCustomDataPath, prettierOptions } = this.opts;
    let templatePath = path.join(
      __dirname,
      '../custom-data-template/index.tpl',
    );
    if (!fs.pathExistsSync(templatePath)) {
      // build path
      templatePath = path.join(
        __dirname,
        './gen/custom-data-template/index.tpl',
      );
    }
    const data = fs
      .readFileSync(templatePath, {
        encoding: 'utf-8',
      })
      .replace('packageName', packageName);
    const absolutePath = path.join(genCustomDataPath, 'index.ts');

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: `Generate custom-data/index.ts success in ${genMockPath}`,
    });
  }
  private writeTemplateDataFile() {
    const { genMockPath, genCustomDataPath, prettierOptions } = this.opts;

    // 生成默认自定义mock数据入口文件
    let templatePath = path.join(
      __dirname,
      '../custom-data-template/template-data.tpl',
    );
    if (!fs.pathExistsSync(templatePath)) {
      // build path
      templatePath = path.join(
        __dirname,
        './gen/custom-data-template/template-data.tpl',
      );
    }
    const data = fs
      .readFileSync(templatePath, { encoding: 'utf-8' })
      .replace('packageName', packageName);

    const absolutePath = path.join(genCustomDataPath, 'template-data.ts');

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: `Generate custom-data/template-data.ts success in ${genMockPath}`,
    });
  }
}

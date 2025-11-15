import type { IPrettierOptions } from '@liangskyli/utils';
import { winPath, writePrettierFile } from '@liangskyli/utils';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getMethodData, packageName } from '../../utils';

const curDirName = path.dirname(fileURLToPath(import.meta.url));

export type IGenCustomDataOpts = {
  mockData: any;
  genCustomDataPath: string;
  interfaceApiRelativePath: string;
  prettierOptions?: IPrettierOptions;
};

export class GenCustomData {
  private readonly opts: IGenCustomDataOpts;

  constructor(opts: IGenCustomDataOpts) {
    this.opts = opts;
  }

  private genTemplateData() {
    const { mockData, interfaceApiRelativePath } = this.opts;

    const firstPath = Object.keys(mockData)[0];
    const resultData = getMethodData(mockData[firstPath]);
    // get first method
    const { method, data: responseData } = resultData[0];

    // 生成默认自定义mock数据入口文件
    let templatePath = path.join(
      curDirName,
      '../custom-data-template/template-data.tpl',
    );
    if (!fs.pathExistsSync(templatePath)) {
      // build path
      templatePath = path.join(
        curDirName,
        './gen/custom-data-template/template-data.tpl',
      );
    }
    const templateData = fs.readFileSync(templatePath, { encoding: 'utf-8' });
    let IApiRelativePath = winPath(interfaceApiRelativePath);
    if (!IApiRelativePath.startsWith('.')) {
      IApiRelativePath = `./${IApiRelativePath}`;
    }
    return templateData
      .replace(/{{packageName}}/gi, packageName)
      .replace(/{{IApiRelativePath}}/gi, winPath(IApiRelativePath))
      .replace(/{{firstPath}}/gi, firstPath)
      .replace(/{{method}}/gi, method)
      .replace(/{{responseData}}/gi, JSON.stringify(responseData));
  }
  public async generator() {
    const { genCustomDataPath } = this.opts;
    if (!fs.pathExistsSync(path.join(genCustomDataPath, 'index.ts'))) {
      fs.ensureDirSync(genCustomDataPath);

      await this.writeIndexFile();
      await this.writeTemplateDataFile();
    }
  }
  private async writeIndexFile() {
    const { genCustomDataPath, prettierOptions } = this.opts;
    let templatePath = path.join(
      curDirName,
      '../custom-data-template/index.tpl',
    );
    if (!fs.pathExistsSync(templatePath)) {
      // build path
      templatePath = path.join(
        curDirName,
        './gen/custom-data-template/index.tpl',
      );
    }
    const data = fs
      .readFileSync(templatePath, {
        encoding: 'utf-8',
      })
      .replace(/{{packageName}}/gi, packageName);
    const absolutePath = path.join(genCustomDataPath, 'index.ts');

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: 'Generate mock/custom-data/index.ts file success',
    });
  }
  private async writeTemplateDataFile() {
    const { genCustomDataPath, prettierOptions } = this.opts;
    const data = this.genTemplateData();
    const absolutePath = path.join(genCustomDataPath, 'template-data.ts');

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: 'Generate mock/custom-data/template-data.ts file success',
    });
  }
}

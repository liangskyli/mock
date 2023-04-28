import type { IPrettierOptions } from '@liangskyli/utils';
import { winPath } from '@liangskyli/utils';
import fs from 'fs-extra';
import path from 'path';
import { getMethodData, packageName, writePrettierFile } from '../../utils';

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
    this.generator();
  }

  private genTemplateData() {
    const { mockData, interfaceApiRelativePath } = this.opts;

    const firstPath = Object.keys(mockData)[0];
    const { data: responseData } = getMethodData(mockData[firstPath]);

    // 生成默认自定义mock数据入口文件
    const templateData = fs.readFileSync(
      path.join(__dirname, '../custom-data-template/template-data.tpl'),
      { encoding: 'utf-8' },
    );
    let IApiRelativePath = winPath(interfaceApiRelativePath);
    if (!IApiRelativePath.startsWith('.')) {
      IApiRelativePath = `./${IApiRelativePath}`;
    }
    return templateData
      .replace('packageName', packageName)
      .replace(/{{IApiRelativePath}}/gi, winPath(IApiRelativePath))
      .replace(/{{firstPath}}/gi, firstPath)
      .replace(/{{responseData}}/gi, JSON.stringify(responseData));
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
    const { genCustomDataPath, prettierOptions } = this.opts;
    const data = fs
      .readFileSync(path.join(__dirname, '../custom-data-template/index.tpl'), {
        encoding: 'utf-8',
      })
      .replace('packageName', packageName);
    const absolutePath = path.join(genCustomDataPath, 'index.ts');

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: 'Generate mock/custom-data/index.ts file success',
    });
  }
  private writeTemplateDataFile() {
    const { genCustomDataPath, prettierOptions } = this.opts;
    const data = this.genTemplateData();
    const absolutePath = path.join(genCustomDataPath, 'template-data.ts');

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
      successTip: 'Generate mock/custom-data/template-data.ts file success',
    });
  }
}

import type { IPrettierOptions } from '@liangskyli/utils';
import { winPath } from '@liangskyli/utils';
import path from 'path';
import { fileTip, packageName, writePrettierFile } from '../../utils';

export type IGenIndexOpts = {
  genMockPath: string;
  prettierOptions?: IPrettierOptions;
};

export class GenIndex {
  private readonly opts: IGenIndexOpts;
  private indexContent: string[];
  private spaceServerNameMockList: string[];

  constructor(opts: IGenIndexOpts) {
    this.indexContent = [];
    this.spaceServerNameMockList = [];
    this.opts = opts;
    this.head();
  }

  private head() {
    this.indexContent.push(fileTip);
    this.indexContent.push(`import grpcMockInit from '${packageName}';`);
  }

  public importServiceMock(opts: { spaceServerNameMock: string }) {
    const { spaceServerNameMock } = opts;
    this.indexContent.push(
      `import ${spaceServerNameMock} from './server/${spaceServerNameMock}';`,
    );
    this.spaceServerNameMockList.push(spaceServerNameMock);
  }

  private footer() {
    const { genMockPath } = this.opts;
    this.indexContent.push('');
    this.indexContent.push(`grpcMockInit([
  ${this.spaceServerNameMockList.join(',')}
],'${winPath(genMockPath)}');`);
  }

  private toStirng() {
    return this.indexContent.join('\n');
  }

  public writeFile() {
    const { genMockPath, prettierOptions } = this.opts;

    this.footer();

    const absolutePath = path.join(genMockPath, 'index.ts');

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data: this.toStirng(),
      successTip: `Generate index.ts success in ${genMockPath}`,
    });
  }
}

import type { IPrettierOptions } from '@liangskyli/utils';
import path from 'path';
import { fileTip, packageName, writePrettierFile } from '../../utils';

export type IGenServiceMockDataOpts = {
  genServerPath: string;
  prettierOptions?: IPrettierOptions;
};

export class GenServiceMockData {
  private readonly opts: IGenServiceMockDataOpts;
  private serviceMockContent: string[];
  private protoItem: string[];
  private uniqueServiceCodeNameList: string[];
  //private uniqueServiceCodeName: string;

  constructor(opts: IGenServiceMockDataOpts) {
    this.opts = opts;
    this.serviceMockContent = [];
    this.protoItem = [];
    this.uniqueServiceCodeNameList = [];
    this.head();
  }

  private head() {
    this.serviceMockContent.push(fileTip);
    this.serviceMockContent.push(
      `import type { IMockService } from '${packageName}';`,
    );
  }

  public getUniqueServiceCodeName(opts: {
    index: number;
    serviceCodeName: string;
  }) {
    const { index, serviceCodeName } = opts;
    let uniqueServiceCodeName = serviceCodeName;

    // 导出服务变量名唯一处理
    if (this.uniqueServiceCodeNameList.indexOf(uniqueServiceCodeName) > -1) {
      uniqueServiceCodeName = `${uniqueServiceCodeName}${index}`;
    }
    this.uniqueServiceCodeNameList.push(uniqueServiceCodeName);
    return uniqueServiceCodeName;
  }

  public importService(opts: {
    index: number;
    serverName: string;
    protoName: string;
    serviceCodeName: string;
  }) {
    const { index, serverName, protoName, serviceCodeName } = opts;
    const uniqueServiceCodeName = this.getUniqueServiceCodeName({
      index,
      serviceCodeName,
    });
    this.serviceMockContent.push(
      `import ${uniqueServiceCodeName} from '../proto/${serverName}/${protoName}/${serviceCodeName}';`,
    );
    this.protoItem.push(`{ ...${uniqueServiceCodeName} },`);
  }

  public mockServerCode(opts: {
    spaceServerNameMock: string;
    serverName: string;
    servicePort: number;
  }) {
    const { spaceServerNameMock, serverName, servicePort } = opts;
    this.serviceMockContent.push(`
const ${spaceServerNameMock}: IMockService = {
  serviceName: '${serverName}',
  servicePort: ${servicePort},
  protoList: [
    ${this.protoItem.join('\n')}
  ],
};
export default ${spaceServerNameMock};
    `);
  }

  private toString() {
    return this.serviceMockContent.join('\n');
  }

  public writeFile(spaceServerNameMock: string) {
    const { genServerPath, prettierOptions } = this.opts;

    const absolutePath = path.join(genServerPath, `${spaceServerNameMock}.ts`);

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data: this.toString(),
    });

    return absolutePath;
  }
}

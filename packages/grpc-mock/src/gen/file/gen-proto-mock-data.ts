import type { IPrettierOptions } from '@liangskyli/utils';
import { winPath } from '@liangskyli/utils';
import * as fs from 'fs-extra';
import path from 'path';
import type { Root } from 'protobufjs';
import type { TMethod } from '../../types';
import { fileTip, packageName, writePrettierFile } from '../../utils';
import { genImplementationData } from '../pbjs';

export type IGenProtoMockDataOpts = {
  index: number;
  genCustomDataPath: string;
  serviceCodeName: string;
  protoPath: string;
  methods: TMethod[];
  protoName: string;
  root: Root;
  longsTypeToString: boolean;
  prettierOptions?: IPrettierOptions;
  genProtoPath: string;
  serverName: string;
};

export class GenProtoMockData {
  private readonly opts: IGenProtoMockDataOpts;

  constructor(opts: IGenProtoMockDataOpts) {
    this.opts = opts;
  }

  public async generator() {
    const {
      genCustomDataPath,
      serviceCodeName,
      protoPath,
      methods,
      protoName,
      root,
      longsTypeToString,
    } = this.opts;
    const protoMockContent = `${fileTip}
            // 自定义mock数据，请在custom-data文件夹下编写，详细见custom-data/index.ts文件说明
            import type { IProtoItem } from '${packageName}';
            import CustomData from '${winPath(genCustomDataPath)}/index';
            
            const ${serviceCodeName}: IProtoItem = {
              path: '${protoPath}',
              implementationData: ${genImplementationData(
                protoPath,
                methods,
                protoName,
                root,
                longsTypeToString,
              )}
            };
            export default ${serviceCodeName};
            `;
    await this.writeFile(protoMockContent);
  }

  private async writeFile(data: string) {
    const {
      genProtoPath,
      serverName,
      protoName,
      serviceCodeName,
      prettierOptions,
    } = this.opts;

    fs.ensureDirSync(path.join(genProtoPath, serverName, protoName));

    const absolutePath = path.join(
      genProtoPath,
      serverName,
      protoName,
      `${serviceCodeName}.ts`,
    );

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data,
    });

    return absolutePath;
  }
}

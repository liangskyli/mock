import type { Options } from '@grpc/proto-loader';
import type { IPrettierOptions } from '@liangskyli/utils';
import { copyOptions, getAbsolutePath } from '@liangskyli/utils';
import * as fs from 'fs-extra';
import path from 'path';
import protobufjs from 'protobufjs';
import { writePrettierFile } from '../../utils';

export type ProtoConfig = {
  grpcProtoServes: {
    /** grpc 服务名 */
    serverName: string;
    /** grpc 服务proto目录 */
    serverDir: string;
  }[];
  protoResolvePath?: (origin: string, target: string) => string | null;
};

export type IGenRootJsonOpts = ProtoConfig & {
  genMockPath: string;
  loaderOptions: Options;
  prettierOptions?: IPrettierOptions;
};

export class GenRootJson {
  private readonly opts: IGenRootJsonOpts;
  private allJson: Record<string, any>;

  constructor(opts: IGenRootJsonOpts) {
    this.opts = opts;
    this.allJson = {};
    this.check();
    this.generator();
  }

  private check() {
    const { grpcProtoServes } = this.opts;

    if (!grpcProtoServes) {
      throw Error('grpcProtoServes 没有设置！');
    }
  }

  private getProtoFiles(absoluteDir: string) {
    const protoFiles: string[] = [];
    fs.readdirSync(absoluteDir).forEach((filename) => {
      const fileDir = path.join(absoluteDir, filename);
      const stats = fs.statSync(fileDir);
      if (stats.isFile()) {
        if (path.extname(fileDir) === '.proto') {
          protoFiles.push(fileDir);
        }
      }
      if (stats.isDirectory()) {
        protoFiles.push(...this.getProtoFiles(fileDir));
      }
    });
    return protoFiles;
  }

  private generator() {
    const { grpcProtoServes, protoResolvePath, loaderOptions } = this.opts;

    grpcProtoServes.forEach((item) => {
      const { serverDir, serverName } = item;
      if (this.allJson[serverName]) {
        throw Error(`${serverName} 服务名重复`);
      }
      const curProtoServeAbsoluteDir = getAbsolutePath(serverDir);
      const root = new protobufjs.Root();
      if (protoResolvePath) {
        root.resolvePath = protoResolvePath;
      }
      const files = this.getProtoFiles(curProtoServeAbsoluteDir);

      const res = root.loadSync(
        files,
        Object.assign(
          {},
          {
            keepCase: true,
            alternateCommentMode: true,
            preferTrailingComment: undefined,
          },
          loaderOptions,
        ),
      );
      this.allJson[serverName] = res.toJSON({ keepComments: true });
    });
  }
  public async writeFile() {
    const { genMockPath, prettierOptions: defaultPrettierOptions } = this.opts;
    let prettierOptions = copyOptions(defaultPrettierOptions);
    if (prettierOptions === undefined) {
      prettierOptions = { parser: 'json' };
    }
    prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

    const absolutePath = path.join(genMockPath, 'root.json');

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data: JSON.stringify(this.allJson),
      successTip: `Generate root.json success in ${genMockPath}`,
    });

    return absolutePath;
  }
}

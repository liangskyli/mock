import type { IPrettierOptions } from '@liangskyli/utils';
import { writePrettierFile } from '@liangskyli/utils';
import path from 'node:path';
import { fileTip } from '../../utils';

export type IGenGrpcServiceMockConfigOpts = {
  genMockPath: string;
  prettierOptions?: IPrettierOptions;
};

export class GenGrpcServiceMockConfig {
  private readonly opts: IGenGrpcServiceMockConfigOpts;
  private grpcServiceMockConfigList: string[];

  constructor(opts: IGenGrpcServiceMockConfigOpts) {
    this.grpcServiceMockConfigList = [];
    this.opts = opts;
    this.head();
  }

  private head() {
    this.grpcServiceMockConfigList.push(fileTip);
    this.grpcServiceMockConfigList.push('module.exports = {');
  }

  public body(opts: { serverName: string; servicePort: number }) {
    const { serverName, servicePort } = opts;
    this.grpcServiceMockConfigList.push(
      ` '${serverName}': {
    'host': '127.0.0.1',
    'port': ${servicePort},
  },`,
    );
  }

  private footer() {
    this.grpcServiceMockConfigList.push('}');
  }

  private toStirng() {
    return this.grpcServiceMockConfigList.join('\n');
  }

  public async writeFile() {
    const { genMockPath, prettierOptions } = this.opts;

    this.footer();

    const absolutePathCjs = path.join(
      genMockPath,
      'grpc-service.mock.config.cjs',
    );
    const absolutePathMjs = path.join(
      genMockPath,
      'grpc-service.mock.config.mjs',
    );

    await writePrettierFile({
      prettierOptions,
      absolutePath: absolutePathCjs,
      data: this.toStirng(),
      successTip: `Generate grpc-service.mock.config.cjs success in ${genMockPath}`,
    });

    await writePrettierFile({
      prettierOptions,
      absolutePath: absolutePathMjs,
      data: this.toStirng().replace('module.exports = {', 'export default {'),
      successTip: `Generate grpc-service.mock.config.mjs success in ${genMockPath}`,
    });
  }
}

import type { IPrettierOptions } from '@liangskyli/utils';
import path from 'path';
import { fileTip, writePrettierFile } from '../../utils';

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

  public writeFile() {
    const { genMockPath, prettierOptions } = this.opts;

    this.footer();

    const absolutePath = path.join(genMockPath, 'grpc-service.mock.config.js');

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data: this.toStirng(),
      successTip: `Generate grpc-service.mock.config.js success in ${genMockPath}`,
    });
  }
}

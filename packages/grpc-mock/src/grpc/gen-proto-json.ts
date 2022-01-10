import * as fs from 'fs-extra';
import path from 'path';
import protobufjs from 'protobufjs';
import { getAbsolutePath, prettierData } from '@liangskyli/utils';
import type prettier from 'prettier';
import type { Options } from '@grpc/proto-loader';

export type ProtoConfig = {
  grpcProtoServes: {
    /** grpc 服务名 */
    serverName: string;
    /** grpc 服务proto目录 */
    serverDir: string;
  }[];
  protoResolvePath?: (origin: string, target: string) => string | null;
};
type GenProtoOptions = ProtoConfig & {
  genMockPath: string;
  loaderOptions: Options;
  prettierOptions?: prettier.Options;
};

const getProtoFiles = (absoluteDir: string): string[] => {
  const protoFiles: string[] = [];
  fs.readdirSync(absoluteDir).map((filename) => {
    const fileDir = path.join(absoluteDir, filename);
    const stats = fs.statSync(fileDir);
    if (stats.isFile()) {
      if (path.extname(fileDir) === '.proto') {
        protoFiles.push(fileDir);
      }
    }
    if (stats.isDirectory()) {
      protoFiles.push(...getProtoFiles(fileDir));
    }
  });
  return protoFiles;
};

const genProtoJson = async (opts: GenProtoOptions) => {
  const { genMockPath, grpcProtoServes, protoResolvePath, loaderOptions } = opts;
  let { prettierOptions } = opts;

  if (!grpcProtoServes) {
    throw Error('grpcProtoServes 没有设置！');
  }

  const jsonPath = path.join(genMockPath, 'root.json');
  const allJson: Record<string, any> = {};

  grpcProtoServes.forEach((item) => {
    const { serverDir, serverName } = item;
    if (allJson[serverName]) {
      throw Error(`${serverName} 服务名重复`);
    }
    const curProtoServeAbsoluteDir = getAbsolutePath(serverDir);
    const root = new protobufjs.Root();
    if (protoResolvePath) {
      root.resolvePath = protoResolvePath;
    }
    const files = getProtoFiles(curProtoServeAbsoluteDir);

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
    allJson[serverName] = res.toJSON({ keepComments: true });
  });

  if (prettierOptions === undefined) {
    prettierOptions = { parser: 'json' };
  }
  prettierOptions = Object.assign(prettierOptions, { parser: 'json' });
  fs.writeFileSync(jsonPath, await prettierData(JSON.stringify(allJson), prettierOptions));
  console.info(`Generate proto root.json success in ${genMockPath}`);
  return jsonPath;
};

export default genProtoJson;

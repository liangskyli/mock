import { colors, getAbsolutePath, tsImport } from '@liangskyli/utils';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemon from 'nodemon';
import type { ConfigFileOptionsCLI } from '../gen';

const curDirName = path.dirname(fileURLToPath(import.meta.url));

type IMockServerLoadScript = {
  /** 是否监听mock文件改动 */
  watch?: boolean;
  /** mock配置文件 */
  configFile: string;
};
const mockServerLoadScript = async (opts: IMockServerLoadScript) => {
  const { watch = true } = opts;
  let { configFile } = opts;

  if (!configFile) {
    configFile = './grpc-mock-config.ts';
  }
  const configFilePath = getAbsolutePath(configFile);
  if (!fs.existsSync(configFilePath)) {
    console.error(colors.red(`grpc mock config file not exits: ${configFile}`));
    process.exit(1);
  }

  const data: ConfigFileOptionsCLI = (
    await tsImport(configFilePath, import.meta.url)
  ).default;
  const { grpcMockDir = './', grpcMockFolderName = 'grpc-mock' } = data;

  const genMockIndexFile = getAbsolutePath(
    path.join(grpcMockDir, grpcMockFolderName, 'index.ts'),
  );

  if (!fs.existsSync(genMockIndexFile)) {
    console.error(
      colors.red(
        `grpc mock file not exits: ${genMockIndexFile}, please generate it first!`,
      ),
    );
    process.exit(1);
  }

  const mockServerLoadScript = path.join(
    curDirName,
    './cli/grpc-mock-server-load.mjs',
  );

  const runningScript = () => {
    try {
      spawn.sync('node', [mockServerLoadScript, genMockIndexFile], {
        stdio: 'inherit',
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const runningWatchScript = () => {
    try {
      const genMockFileDir = getAbsolutePath(
        path.join(grpcMockDir, grpcMockFolderName),
      );
      nodemon({
        script: mockServerLoadScript,
        watch: [genMockFileDir],
        ext: 'js,mjs,json,ts,mts',
        args: [genMockIndexFile],
      }).on('log', (msg) => {
        console.log(msg.colour);
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  if (watch) {
    runningWatchScript();
  } else {
    runningScript();
  }
};

export { mockServerLoadScript };

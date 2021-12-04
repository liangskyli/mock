import { program } from 'commander';
import type { ConfigFileOptionsCLI } from '../grpc/gen';
import fs from 'fs-extra';
import { getAbsolutePath } from '../grpc/utils';
import getConfig from './config';
import path from 'path';

const packageJson = require('../../package.json');

program
  .version(packageJson.version)
  .option('-c, --configFile [configFile]', 'grpc mock config file')
  .parse(process.argv);

let { configFile } = program.opts();

if (!configFile) {
  configFile = './grpc-mock-config.ts';
}
const configFilePath = getAbsolutePath(configFile);
if (!fs.existsSync(configFilePath)) {
  console.error(`grpc mock config file not exits: ${configFile}`);
  process.exit(1);
}

const data: ConfigFileOptionsCLI = getConfig(configFilePath);
const { grpcMockDir = './', grpcMockFolderName = 'grpc-mock' } = data;

const genMockIndexFile = getAbsolutePath(path.join(grpcMockDir, grpcMockFolderName, 'index.ts'));

if (!fs.existsSync(genMockIndexFile)) {
  console.error(`grpc mock file not exits: ${genMockIndexFile}, please generate it first!`);
  process.exit(1);
}

const runningScript = () => {
  try {
    require(genMockIndexFile);
  } catch (err: any) {
    console.error(err);
  }
};

runningScript();

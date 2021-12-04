import { program } from 'commander';
import type { ConfigFileOptionsCLI } from '../grpc/gen';
import fs from 'fs-extra';
import { getAbsolutePath } from '../grpc/utils';
import getConfig from './config';
import { gen } from '../grpc/gen';

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
const { loaderOptions, ...otherOptions } = data;
if (!otherOptions.rootPath) {
  console.error(`grpc mock config file need rootPath field: ${configFile}`);
}

const runningScript = () => {
  try {
    gen({ ...otherOptions, configFilePath });
  } catch (err: any) {
    console.error(err);
  }
};

runningScript();

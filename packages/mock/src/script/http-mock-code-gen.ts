import { program } from 'commander';
import fs from 'fs-extra';
import { getAbsolutePath, getConfig } from '@liangskyli/utils';
import type { IGenMockDataOpts } from '../index';
import { genMockData } from '../index';

const packageJson = require('../../package.json');

program
  .version(packageJson.version)
  .option('-c, --configFile [configFile]', 'http mock code gen config file')
  .parse(process.argv);

const { configFile } = program.opts();

if (!configFile) {
  console.error('-c, --configFile [configFile] field need');
  process.exit(1);
}
const configFilePath = getAbsolutePath(configFile);
if (!fs.existsSync(configFilePath)) {
  console.error(`-c, --configFile path not exits: ${configFile}`);
  process.exit(1);
}

const data: IGenMockDataOpts = getConfig(configFilePath);
if (!data.openapiPath) {
  console.error(`http mock config file need openapiPath field: ${configFile}`);
}

const runningScript = () => {
  try {
    genMockData(data).then();
  } catch (err: any) {
    console.error(err);
  }
};

runningScript();

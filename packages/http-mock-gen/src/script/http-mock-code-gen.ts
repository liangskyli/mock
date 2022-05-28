import { program } from 'commander';
import fs from 'fs-extra';
import { colors, getAbsolutePath, getConfig } from '@liangskyli/utils';
import type { IGenMockDataOpts } from '../gen';
import genMockData from '../index';

const packageJson = require('../../package.json');

program
  .version(packageJson.version)
  .option('-c, --configFile [configFile]', 'http mock code gen config file')
  .parse(process.argv);

const { configFile } = program.opts();

if (!configFile) {
  console.error(colors.red('-c, --configFile [configFile] field need'));
  process.exit(1);
}
const configFilePath = getAbsolutePath(configFile);
if (!fs.existsSync(configFilePath)) {
  console.error(colors.red(`-c, --configFile path not exits: ${configFile}`));
  process.exit(1);
}

const data: IGenMockDataOpts = getConfig(configFilePath);
if (!data.openapiPath) {
  console.error(colors.red(`http mock config file need openapiPath field: ${configFile}`));
}

const runningScript = () => {
  try {
    genMockData(data).then();
  } catch (err: any) {
    console.error(err);
  }
};

runningScript();

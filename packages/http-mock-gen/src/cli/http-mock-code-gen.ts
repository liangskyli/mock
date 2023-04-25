import { colors, getAbsolutePath, getConfig, lodash } from '@liangskyli/utils';
import { program } from 'commander';
import fs from 'fs-extra';
import type { IGenMockDataOpts, IGenMockDataOptsCLI } from '../gen';
import genMockData from '../gen';

const commandCodeGenCli = (version: string) => {
  program
    .version(version)
    .option('-c, --configFile [configFile]', 'http mock code gen config file')
    .parse(process.argv);

  let { configFile } = program.opts();

  if (!configFile) {
    configFile = './mock.config.ts';
  }
  const configFilePath = getAbsolutePath(configFile);
  if (fs.existsSync(configFilePath)) {
    console.info(colors.green(`use configFile path: ${configFile}`));
  } else {
    console.error(colors.red(`-c, --configFile path not exits: ${configFile}`));
    process.exit(1);
  }

  let opts: IGenMockDataOptsCLI = getConfig(configFilePath);

  const runningScript = async () => {
    try {
      if (!lodash.isArray(opts)) {
        opts = [opts] as IGenMockDataOpts[];
      }
      for (let i = 0; i < opts.length; i++) {
        const singleOpts = opts[i];
        if (!singleOpts.openapiPath) {
          console.error(
            colors.red(
              `http mock config file need openapiPath field: ${configFile}`,
            ),
          );
        }
        await genMockData(singleOpts);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  runningScript();
};

export { commandCodeGenCli };

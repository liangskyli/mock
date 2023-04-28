import { colors, getAbsolutePath, getConfig } from '@liangskyli/utils';
import { program } from 'commander';
import fs from 'fs-extra';
import type { ConfigFileOptionsCLI } from '../gen/gen';
import { gen } from '../gen/gen';

const commandCodeGenCli = (version: string) => {
  program
    .version(version)
    .option('-c, --configFile [configFile]', 'grpc mock config file')
    .parse(process.argv);

  let { configFile } = program.opts();

  if (!configFile) {
    configFile = './grpc-mock-config.ts';
  }
  const configFilePath = getAbsolutePath(configFile);
  if (!fs.existsSync(configFilePath)) {
    console.error(colors.red(`grpc mock config file not exits: ${configFile}`));
    process.exit(1);
  }

  const data: ConfigFileOptionsCLI = getConfig(configFilePath);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loaderOptions, ...otherOptions } = data;
  if (!otherOptions.rootPath) {
    console.error(
      colors.red(`grpc mock config file need rootPath field: ${configFile}`),
    );
  }

  try {
    gen({ ...otherOptions, configFilePath }).then();
  } catch (err: any) {
    console.error(err);
  }
};

export { commandCodeGenCli };

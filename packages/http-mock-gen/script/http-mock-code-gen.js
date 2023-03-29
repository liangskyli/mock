const {
  colors,
  getAbsolutePath,
  getConfig,
  lodash,
} = require('@liangskyli/utils');
const { program } = require('commander');
const fs = require('fs-extra');
const genMockData = require('../lib/index.cjs').default;

const packageJson = require('../package.json');

program
  .version(packageJson.version)
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

let opts = getConfig(configFilePath);

const runningScript = async () => {
  try {
    if (!lodash.isArray(opts)) {
      opts = [opts];
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
  } catch (err) {
    console.error(err);
  }
};

runningScript();

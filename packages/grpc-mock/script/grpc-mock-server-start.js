const { program } = require('commander');
const fs = require('fs-extra');
const { colors, getAbsolutePath, getConfig } = require('@liangskyli/utils');
const path = require('path');
const spawn = require('cross-spawn');

const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .option(
    '-w, --watch [watch]',
    'watch mock files change',
    (watch) => {
      return watch.toString() === 'true';
    },
    true,
  )
  .option('-c, --configFile [configFile]', 'grpc mock config file')
  .parse(process.argv);

const { watch } = program.opts();
let { configFile } = program.opts();
if (!configFile) {
  configFile = './grpc-mock-config.ts';
}
const configFilePath = getAbsolutePath(configFile);
if (!fs.existsSync(configFilePath)) {
  console.error(colors.red(`grpc mock config file not exits: ${configFile}`));
  process.exit(1);
}

const data = getConfig(configFilePath);
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

const runningScript = () => {
  try {
    require(genMockIndexFile);
  } catch (err) {
    console.error(err);
  }
};

const runningWatchScript = () => {
  try {
    const genMockFileDir = getAbsolutePath(
      path.join(grpcMockDir, grpcMockFolderName),
    );
    spawn.sync('ts-node-dev', [`--watch=${genMockFileDir}`, genMockIndexFile], {
      stdio: 'inherit',
    });
  } catch (err) {
    console.error(err);
  }
};

if (watch) {
  runningWatchScript();
} else {
  runningScript();
}

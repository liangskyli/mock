const { program } = require('commander');
const fs = require('fs-extra');
const { colors, getAbsolutePath, getConfig } = require('@liangskyli/utils');
const mockServer = require('../lib/index.cjs').default;

const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .option('-d, --dir [dir]', 'Base dir of the mock folder')
  .option(
    '-e, --exclude [exclude]',
    'Used to ignore files that do not need to go mock',
    (exclude) => {
      return exclude.split(',');
    },
  )
  .option('-p, --port [port]', 'mock servicePort start begin')
  .option('-host, --hostname [hostname]', 'mock hostname', (port) => {
    return parseInt(port);
  })
  .option(
    '-w, --watch [watch]',
    'watch mock files change',
    (watch) => {
      return watch.toString() === 'true';
    },
    true,
  )
  .option('-c, --configFile [configFile]', 'mock config file')
  .parse(process.argv);

const { dir, port, hostname, watch, exclude, configFile } = program.opts();

let opt = {};

if (dir) {
  opt.mockDir = dir;
}
opt.port = port;
if (hostname) {
  opt.hostname = hostname;
}
opt.watch = watch;
opt.exclude = exclude;

const runingScript = () => {
  try {
    mockServer(opt).then();
  } catch (err) {
    console.error(err);
  }
};

if (configFile) {
  const configFilePath = getAbsolutePath(configFile);
  if (!fs.pathExistsSync(configFilePath)) {
    console.error(colors.red(`mock config file not exits: ${configFile}`));
    process.exit(1);
  }

  const data = getConfig(configFilePath);
  opt = {
    ...opt,
    ...data,
  };
}

runingScript();

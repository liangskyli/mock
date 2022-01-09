import { program } from 'commander';
import type { IOpts } from '../http/server/server';
import mockServer from '../http/server/server';
import fs from 'fs-extra';
import getConfig from './config';
import { getAbsolutePath } from '../tools';

const packageJson = require('../../package.json');

program
  .version(packageJson.version)
  .option('-d, --dir [dir]', 'Base dir of the mock folder')
  .option<string[] | undefined>(
    '-e, --exclude [exclude]',
    'Used to ignore files that do not need to go mock',
    (exclude) => {
      return exclude.split(',');
    },
  )
  .option('-p, --port [port]', 'mock servicePort start begin')
  .option<number | undefined>('-host, --hostname [hostname]', 'mock hostname', (port) => {
    return parseInt(port);
  })
  .option<boolean>(
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

let opt: IOpts = {};

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
  } catch (err: any) {
    console.error(err);
  }
};

if (configFile) {
  const configFilePath = getAbsolutePath(configFile);
  if (!fs.pathExistsSync(configFilePath)) {
    console.error(`mock config file not exits: ${configFile}`);
    process.exit(1);
  }

  const data: IOpts = getConfig(configFilePath);
  opt = {
    ...opt,
    ...data,
  };
}

runingScript();

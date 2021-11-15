import { program } from 'commander';
import type { IOpts } from '../server';
import mockServer from '../server';
import path from 'path';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import { sleep } from '../tools';

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

const getConfigFormChildProcess = (configFilePath: string) => {
  // 通过子进程方式获取config配置
  const child = spawn(
    'ts-node',
    [require('path').join(__dirname, '../../bin/config'), configFilePath],
    { stdio: ['ipc', 'pipe', 'pipe'] },
  );

  let start: any = null;

  const timer = setTimeout(() => {
    start = true;
    runingScript();
  }, 3000);

  child.on('message', (msg = {}) => {
    const { action, data } = msg as any;
    if (action === 'get-config' && !start) {
      clearTimeout(timer);
      opt = {
        ...opt,
        ...data,
      };
      runingScript();
    }
  });

  // 为了保证子进程能运行完成，这里延迟3秒再关闭当前进程
  sleep(3000);
};

if (configFile) {
  const configFilePath = path.join(process.cwd(), configFile);

  if (!fs.pathExistsSync(configFilePath)) {
    console.error(`mock config file not exits: ${configFilePath}`);
    process.exit(1);
  }
  getConfigFormChildProcess(configFilePath);
} else {
  runingScript();
}

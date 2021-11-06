import { program } from 'commander';
import type { IOpts } from '../server';
import mockServer from '../server';

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
  .parse(process.argv);

const { dir, port, hostname, watch, exclude } = program.opts();

const opt: IOpts = {};

if (dir) {
  opt.mockDir = dir;
}
opt.port = port;
if (hostname) {
  opt.hostname = hostname;
}
opt.watch = watch;
opt.exclude = exclude;

try {
  mockServer(opt);
} catch (err: any) {
  console.error(err);
}

import { program } from 'commander';
import type { IOpts } from '../server';
import mockServer from '../server';

const packageJson = require('../../package.json');

program
  .version(packageJson.version)
  .option('-d, --dir [dir]', 'Base dir of the mock folder')
  .option('-p, --port [port]', 'mock servicePort start begin')
  .option('-host, --hostname [hostname]', 'mock hostname')
  .parse(process.argv);

const { dir, port, hostname } = program.opts();

const opt: IOpts = {};

if (dir) {
  opt.mockDir = dir;
}
if (port) {
  opt.port = parseInt(port);
}
if (hostname) {
  opt.hostname = hostname;
}

try {
  mockServer(opt);
} catch (err: any) {
  console.error(err);
}

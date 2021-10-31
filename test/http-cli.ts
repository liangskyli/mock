import * as spawn from 'cross-spawn';

const result = spawn.sync('node', 'bin/index.js -d /test'.split(' '), { stdio: 'inherit' });

process.exit(result.status ?? undefined);

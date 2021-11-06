import * as spawn from 'cross-spawn';

const result = spawn.sync('node', 'bin/index.js -d ./test -e mock/b.ts'.split(' '), {
  stdio: 'inherit',
});

process.exit(result.status ?? undefined);

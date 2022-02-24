import * as spawn from 'cross-spawn';

const result = spawn.sync(
  'node',
  'lib/bin/index.js -d ./test -e mock/b.ts -c ./test/mock.config.ts'.split(' '),
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? undefined);

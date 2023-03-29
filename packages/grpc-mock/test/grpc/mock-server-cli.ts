import * as spawn from 'cross-spawn';

const result = spawn.sync(
  'node',
  'bin/index.js server-start -w true -c ./test/grpc/mock.config.cli.ts'.split(
    ' ',
  ),
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? undefined);

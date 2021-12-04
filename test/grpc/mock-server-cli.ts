import * as spawn from 'cross-spawn';

const result = spawn.sync(
  'node',
  'bin/grpc/index.js server-start -c ./test/grpc/mock.config.cli.ts'.split(' '),
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? undefined);

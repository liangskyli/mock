import * as spawn from 'cross-spawn';

const result = spawn.sync(
  'node',
  'bin/grpc/index.js grpc-mock-code-gen -c ./test/grpc/mock.config.cli.ts'.split(' '),
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? undefined);

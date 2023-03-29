#!/usr/bin/env node
const path = require('path');
const spawn = require('cross-spawn');

const script = process.argv[2];
const args = process.argv.slice(3);

switch (script) {
  case 'code-gen': {
    const result = spawn.sync(
      'node',
      [
        '-r',
        'ts-node/register',
        '--trace-warnings',
        require.resolve(path.join('../script', `grpc-mock-${script}`)),
      ].concat(args),
      { stdio: 'inherit' },
    );
    process.exit(result.status);
    break;
  }
  case 'server-start':
    const result = spawn.sync(
      'node',
      [
        '-r',
        'ts-node/register',
        '--trace-warnings',
        require.resolve(path.join('../script', `grpc-mock-${script}`)),
      ].concat(args),
      { stdio: 'inherit' },
    );
    process.exit(result.status);
    break;
  default:
    console.log(`Unknown script "${script}".`);
    break;
}

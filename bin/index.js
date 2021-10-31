#!/usr/bin/env node
const path = require('path');
const spawn = require('cross-spawn');

const args = process.argv.slice(2);

const result = spawn.sync('node', [require.resolve(path.join('../lib/script/http'))].concat(args), {
  stdio: 'inherit',
});
process.exit(result.status);

#!/usr/bin/env node
const {
  commandCodeGenCli,
  commandServerStartCli,
} = require('../lib/index.cjs');
const { version } = require('../package.json');

const script = process.argv[2];

switch (script) {
  case 'code-gen': {
    commandCodeGenCli(version, script);
    break;
  }
  case 'server-start':
    commandServerStartCli(version, script);
    break;
  default:
    console.log(`Unknown script "${script}".`);
    break;
}

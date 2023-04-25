#!/usr/bin/env node
const {
  commandCodeGenCli,
  commandServerStartCli,
} = require('../lib/index.cjs');
const { version } = require('../package.json');

const script = process.argv[2];

switch (script) {
  case 'code-gen': {
    commandCodeGenCli(version);
    break;
  }
  case 'server-start':
    commandServerStartCli(version);
    break;
  default:
    console.log(`Unknown script "${script}".`);
    break;
}

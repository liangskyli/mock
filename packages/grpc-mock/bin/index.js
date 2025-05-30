#!/usr/bin/env node
import { createRequire } from 'node:module';
import { commandCodeGenCli, commandServerStartCli } from '../lib/index.js';

const require = createRequire(import.meta.url);
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

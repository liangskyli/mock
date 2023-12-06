#!/usr/bin/env node
import { createRequire } from 'node:module';
import { commandHttpCli } from '../lib/index.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

commandHttpCli(version);

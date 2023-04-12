const { commandServerStartCli } = require('../lib/index.cjs');
const { version } = require('../package.json');

commandServerStartCli(version);

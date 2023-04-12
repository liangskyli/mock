const { commandHttpCli } = require('../lib/index.cjs');
const { version } = require('../package.json');

commandHttpCli(version);

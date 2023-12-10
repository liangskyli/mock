import { createRequire } from 'node:module';
import copy from 'rollup-plugin-copy';
import { getConfig } from '../rollup.base.config.js';

const require = createRequire(import.meta.url);
const packageJSON = require('./package.json');

const config = getConfig(packageJSON);

config.plugins.push(
  copy({
    targets: [
      {
        src: 'src/gen/custom-data-template/**/*',
        dest: 'lib/gen/custom-data-template',
      },
    ],
  }),
);
export default [config];

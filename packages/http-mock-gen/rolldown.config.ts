import { defineConfig } from 'rolldown';
import copy from '../rolldown-plugin-copy';
import { getConfig } from '../rolldown.base.config';
import packageJSON from './package.json' with { type: 'json' };

const config = getConfig(packageJSON);
config.plugins = [
  copy({
    targets: [
      {
        src: 'src/gen/custom-data-template',
        dest: 'lib/gen/custom-data-template',
      },
    ],
  }),
];

export default defineConfig([config]);

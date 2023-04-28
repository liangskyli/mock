import copy from 'rollup-plugin-copy';
import { getConfig } from '../rollup.base.config';
import packageJSON from './package.json';

const config = getConfig(packageJSON);

config.plugins.push(
  copy({
    targets: [
      {
        src: 'src/grpc/custom-data-template/**/*',
        dest: 'lib/grpc/custom-data-template',
      },
    ],
  }),
);
export default [config];

import { createRequire } from 'node:module';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';
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

const grpcMockServerLoadConfig = getConfig(packageJSON);

grpcMockServerLoadConfig.input = './src/cli/grpc-mock-server-load.ts';
grpcMockServerLoadConfig.plugins = [
  ...grpcMockServerLoadConfig.plugins.slice(1, 2),
  typescript({ tsconfigOverride: { compilerOptions: { declaration: false } } }),
  ...grpcMockServerLoadConfig.plugins.slice(3),
];
grpcMockServerLoadConfig.output = [
  {
    file: './lib/cli/grpc-mock-server-load.js',
    format: 'esm',
  },
];

export default [config, grpcMockServerLoadConfig];

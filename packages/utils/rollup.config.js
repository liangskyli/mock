import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import packageJSON from './package.json';

const extensions = ['.js', '.ts', '.tsx'];
const getPath = (_path) => path.resolve(__dirname, _path);

// ts
const tsPlugin = typescript({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
});

// 基础配置
const commonConf = {
  input: getPath('./src/index.ts'),
  external: [
    ...Object.keys(packageJSON.dependencies || {}),
    ...Object.keys(packageJSON.peerDependencies || {}),
  ],
  plugins: [nodeResolve({ extensions }), tsPlugin, commonjs(), json()],
};
// 需要导出的模块类型
const outputMap = [
  {
    file: packageJSON.main, // 通用模块
    format: 'cjs',
  },
  {
    file: packageJSON.module, // es6模块
    format: 'es',
  },
];

const buildConf = (options) => Object.assign({}, commonConf, options);

export default outputMap.map((output) =>
  buildConf({ output: { name: packageJSON.name, ...output } }),
);

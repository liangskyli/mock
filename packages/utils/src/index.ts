import address from 'address';
import lodash from 'lodash';
import signale from 'signale';
import createDebug from 'debug';
import colors from 'colors';

export { getAbsolutePath, prettierData, copyOptions, winPath, removeFilesSync } from './tools';
export { default as getConfig } from './config';
export { address, colors, lodash, signale, createDebug };
export { default as parseRequireDeps } from './parse-require-deps/parse-require-deps';

import address from 'address';
import colors from 'colors';
import createDebug from 'debug';
import lodash from 'lodash';
import signale from 'signale';
import type { prettierData } from './tools';

export { default as getConfig } from './config';
export * as register from './register';
export {
  copyOptions,
  getAbsolutePath,
  getRelativePath,
  prettierData,
  removeFilesSync,
  winPath,
} from './tools';
export { address, colors, lodash, signale, createDebug };
export type IPrettierOptions = Parameters<typeof prettierData>[1];

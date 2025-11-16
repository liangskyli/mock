import { ip } from 'address';
import colors from 'colors';
import createDebug from 'debug';
import fs from 'fs-extra';
import lodash from 'lodash';
import signale from 'signale';
import { tsImport } from 'tsx/esm/api';
import type { IPrettierOptions } from './tools';

export { GenPackageJson } from './gen-package-json';
export {
  copyOptions,
  getAbsolutePath,
  getRelativePath,
  prettierData,
  removeFilesSync,
  winPath,
  writePrettierFile,
} from './tools';
export {
  colors,
  createDebug,
  fs,
  ip,
  IPrettierOptions,
  lodash,
  signale,
  tsImport,
};

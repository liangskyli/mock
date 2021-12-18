import { prettierData } from './utils';
import * as fs from 'fs-extra';
import path from 'path';
import type prettier from 'prettier';

const genTsConfig = async (genMockPath: string, prettierOptions?: prettier.Options) => {
  const genMockPathArray = path.join(genMockPath).split(path.sep);
  // 生成tsconfig.mock.json文件
  const tsconfigMockConfigPath = path.join(genMockPath, 'tsconfig.mock.json');
  const tsconfigMockConfigData = `{
    extends: '../tsconfig.json',
    compilerOptions: {
      rootDir: '../',
    },
    include: ["${genMockPathArray[genMockPathArray.length - 1]}/**/*"],
    exclude: ['node_modules'],
  }`;

  if (prettierOptions === undefined) {
    prettierOptions = { parser: 'json' };
  }
  prettierOptions = Object.assign(prettierOptions, { parser: 'json' });
  fs.writeFileSync(
    tsconfigMockConfigPath,
    await prettierData(tsconfigMockConfigData, prettierOptions),
  );
};

export default genTsConfig;

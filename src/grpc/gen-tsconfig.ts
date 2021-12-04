import { objectToString } from './utils';
import * as fs from 'fs-extra';
import path from 'path';

const genTsConfig = (genMockPath: string) => {
  const genMockPathArray = path.join(genMockPath).split(path.sep);
  // 生成tsconfig.mock.json文件
  const tsconfigMockConfigPath = path.join(genMockPath, 'tsconfig.mock.json');
  const tsconfigMockConfigData = {
    extends: '../tsconfig.json',
    compilerOptions: {
      rootDir: '../',
    },
    include: [`${genMockPathArray[genMockPathArray.length - 1]}/**/*`],
    exclude: ['node_modules'],
  };
  fs.writeFileSync(tsconfigMockConfigPath, objectToString(tsconfigMockConfigData, 0));
};

export default genTsConfig;

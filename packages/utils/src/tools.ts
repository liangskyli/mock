import fs from 'fs-extra';
import path from 'node:path';
import prettier from 'prettier';

export const getAbsolutePath = (pathName: string) => {
  return path.isAbsolute(pathName)
    ? pathName
    : path.join(process.cwd(), pathName);
};

export const getRelativePath = (
  absolutePath1: string,
  absolutePath2: string,
) => {
  return path.relative(absolutePath1, absolutePath2);
};

export const prettierData = async (
  fileContent: string,
  options?: prettier.Options,
) => {
  const configFile = await prettier.resolveConfigFile();
  let configFileOptions: prettier.Options | null = null;
  if (configFile !== null) {
    configFileOptions = await prettier.resolveConfig(configFile);
  }
  if (options === undefined) {
    options = { parser: 'typescript' };
  }
  if (!options.parser) {
    options.parser = 'typescript';
  }
  if (configFileOptions !== null) {
    options = Object.assign({}, configFileOptions, options);
  }
  return prettier.format(fileContent, options);
};

export const copyOptions = <T = undefined>(options: T) => {
  if (options !== undefined) {
    options = Object.assign({}, options);
  }
  return options;
};

export const winPath = (pathStr: string) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(pathStr);
  if (isExtendedLengthPath) {
    return pathStr;
  }

  return pathStr.replace(/\\/g, '/');
};

export const removeFilesSync = (dir: string) => {
  let items: string[] = [];
  try {
    items = fs.readdirSync(dir);
  } catch {
    fs.mkdirsSync(dir);
  }

  items.forEach((item) => {
    if (item !== 'custom-data') {
      fs.removeSync(path.join(dir, item));
    }
  });
};

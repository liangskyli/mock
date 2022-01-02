import path from 'path';
import prettier from 'prettier';

export const getAbsolutePath = (pathName: string) => {
  return path.isAbsolute(pathName) ? pathName : path.join(process.cwd(), pathName);
};

export const prettierData = async (fileContent: string, options?: prettier.Options) => {
  const configFile = prettier.resolveConfigFile.sync();
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

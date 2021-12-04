import path from 'path';

export const fileTip = '// This file is auto generated by grpc-mock, do not edit!';
export const tslintDisable = '// tslint:disable';
export const longsType = ['double', 'float', 'int64', 'uint64', 'sint64', 'fixed64', 'sfixed64'];
export const PROTO_TYPE_2_TS_TYPE_MAP: Record<string, string> = {
  double: 'number',
  float: 'number',
  int32: 'number',
  int64: 'number',
  uint32: 'number',
  uint64: 'number',
  sint32: 'number',
  sint64: 'number',
  fixed32: 'number',
  fixed64: 'number',
  sfixed32: 'number',
  sfixed64: 'number',
  bool: 'boolean',
  string: 'string',
  bytes: 'string',
};

export const TS_TYPE_2_DEFAULT_MAP: Record<string, any> = {
  number: 0,
  boolean: false,
  string: '\'\'',
};

export const genSpace = (num: number) => {
  let space = '';
  for (let i = 0; i < num; i++) {
    space += ' ';
  }
  return space;
};

export const stringLeftNumber = (jsonStr: string, num: number) => {
  let res = '';
  jsonStr.split('').map((char) => {
    res += char;
    if (char === '\n') {
      res += genSpace(num);
    }
  });
  return res;
};

export const firstWordNeedLetter = (str: string): string => {
  const charFirst = str.charCodeAt(0);
  if (!((charFirst >= 65 && charFirst <= 90) || (charFirst >= 97 && charFirst <= 122))) {
    //第一个字符不是字母时，补z,保证生成的语法正确
    str = `z${str}`;
  }
  return str;
};

export const objectToString = (json: Record<string, any>, num: number) => {
  const jsonStr = JSON.stringify(json, null, 2);
  return stringLeftNumber(jsonStr, num);
};

export const firstUpperCaseOfWord = (str: string) => {
  const result: string[] = [];
  str = firstWordNeedLetter(str);
  str.split('_').map((item) => {
    result.push(item.toLowerCase().replace(/^\w|\s\w/g, (w) => w.toUpperCase()));
  });
  return result.join('');
};

export function getImportPath(fromPath: string, toPath: string) {
  let relative = path.relative(path.dirname(fromPath), toPath);
  relative = relative.replace(/\.(js|d\.ts|ts)$/, '').replace(/\\/g, '/');
  if (!/^\./.test(relative)) {
    relative = `./${relative}`;
  }
  return relative;
}

export const getAbsolutePath = (pathName: string) => {
  return path.isAbsolute(pathName) ? pathName : path.join(process.cwd(), pathName);
};

//export const packageName = '@liangskyli/mock';
export const packageName = path.join(process.cwd(), './src/index');

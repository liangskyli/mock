import fs from 'fs-extra';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  copyOptions,
  getAbsolutePath,
  getRelativePath,
  prettierData,
  removeFilesSync,
  winPath,
} from '../src';

describe('utils', () => {
  test('getAbsolutePath', () => {
    expect(getAbsolutePath('/a/b')).toBe('/a/b');
    expect(winPath(getAbsolutePath('./a/b'))).toContain('/a/b');
  });
  test('getRelativePath', () => {
    expect(getRelativePath('/a/b', '/a/b/c')).toBe('c');
    expect(getRelativePath('/a/b', '/a')).toBe('..');
    expect(winPath(getRelativePath('/a/b/c/d', '/a/b/e'))).toBe('../../e');
  });
  test('winPath', () => {
    expect(winPath('\\a\\b')).toEqual('/a/b');
    expect(winPath('\\你好\\欢迎')).toEqual('/你好/欢迎');
    expect(winPath('\\$\\%')).toEqual('/$/%');
    // not convert extended-length paths
    const path = '\\\\?\\c:\\aaaa\\bbbb';
    expect(winPath(path)).toEqual(path);
  });
  test('prettierData', async () => {
    expect(await prettierData('const a=1')).toEqual('const a = 1;\n');
    expect(await prettierData('const a=\'1\'', { singleQuote: false })).toEqual(
      'const a = "1";\n',
    );
  });
  test('copyOptions', () => {
    expect(copyOptions(undefined)).toEqual(undefined);
    const obj1 = { a: 1 };
    const obj2 = copyOptions(obj1);
    expect(obj1).toEqual({ a: 1 });
    expect(obj1).toEqual({ a: 1 });
    obj2.a = 2;
    expect(obj1).toEqual({ a: 1 });
    expect(obj2).toEqual({ a: 2 });
  });
  test('removeFilesSync, not dir and custom-data dir', () => {
    const tempDir = './test/temp1';
    expect(fs.existsSync(tempDir)).toBeFalsy();
    removeFilesSync(tempDir);
    expect(fs.existsSync(tempDir)).toBeTruthy();
    fs.removeSync(tempDir);
  });
  test('removeFilesSync, have dir, not custom-data dir', () => {
    const tempDir = './test/temp1';
    const otherDir = path.join(tempDir, 'other');
    const otherFile = path.join(tempDir, 'a.txt');
    fs.mkdirsSync(tempDir);
    fs.mkdirsSync(otherDir);
    fs.writeFileSync(otherFile, 'otherFile');
    removeFilesSync(tempDir);
    expect(fs.existsSync(otherDir)).toBeFalsy();
    expect(fs.existsSync(otherFile)).toBeFalsy();
    fs.removeSync(tempDir);
  });
  test('removeFilesSync, have custom-data dir', () => {
    const tempDir = './test/temp2';
    const customDataDir = path.join(tempDir, 'custom-data');
    const otherDir = path.join(tempDir, 'other');
    const otherFile = path.join(tempDir, 'a.txt');
    fs.mkdirsSync(tempDir);
    fs.mkdirsSync(customDataDir);
    fs.mkdirsSync(otherDir);
    fs.writeFileSync(otherFile, 'otherFile');
    removeFilesSync(tempDir);
    expect(fs.existsSync(tempDir)).toBeTruthy();
    expect(fs.existsSync(customDataDir)).toBeTruthy();
    expect(fs.existsSync(otherFile)).toBeFalsy();
    fs.removeSync(tempDir);
  });
});

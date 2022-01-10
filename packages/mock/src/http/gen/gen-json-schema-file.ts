import * as TJS from 'typescript-json-schema';
import type { JSONSchemaFakerOptions } from 'json-schema-faker';
import jsf from 'json-schema-faker';
import fs from 'fs-extra';
import path from 'path';
import type prettier from 'prettier';
import { prettierData } from '@liangskyli/utils';

type IOpts = {
  schemaTsPath: string;
  genMockAbsolutePath: string;
  compilerOptions?: TJS.CompilerOptions;
  prettierOptions?: prettier.Options;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
};

const genMockDataFile = async (opts: IOpts) => {
  const {
    schemaTsPath,
    genMockAbsolutePath,
    compilerOptions = { strictNullChecks: true },
    mockDataReplace,
  } = opts;
  let { prettierOptions, jsonSchemaFakerOptions } = opts;
  const program = TJS.getProgramFromFiles([schemaTsPath], compilerOptions);
  const schema = TJS.generateSchema(program, 'paths', { required: true });
  if (prettierOptions === undefined) {
    prettierOptions = { parser: 'json' };
  }
  prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

  const schemaPath = path.join(genMockAbsolutePath, 'schema.json');
  const schemaString = JSON.stringify(schema, null, 2);
  fs.writeFileSync(schemaPath, await prettierData(schemaString, prettierOptions));
  console.info('Generate schema.json success');

  if (jsonSchemaFakerOptions === undefined) {
    jsonSchemaFakerOptions = { alwaysFakeOptionals: true, fillProperties: false };
  }
  jsonSchemaFakerOptions = Object.assign(jsonSchemaFakerOptions, {
    alwaysFakeOptionals: true,
    fillProperties: false,
  });

  jsf.option(jsonSchemaFakerOptions);
  const mockData = jsf.generate(schema as any);
  const mockDataString = JSON.stringify(mockData, mockDataReplace, 2);
  const mockDataAbsolutePath = path.join(genMockAbsolutePath, 'mock-data.json');
  fs.writeFileSync(mockDataAbsolutePath, await prettierData(mockDataString, prettierOptions));

  console.info('Generate mock-data.json success');

  return mockDataAbsolutePath;
};

export { genMockDataFile };

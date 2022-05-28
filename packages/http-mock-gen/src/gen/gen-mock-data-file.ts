import type { JSONSchemaFakerOptions } from 'json-schema-faker';
import jsf from 'json-schema-faker';
import fs from 'fs-extra';
import path from 'path';
import type prettier from 'prettier';
import { colors, prettierData } from '@liangskyli/utils';
import type { Definition } from '@liangskyli/openapi-gen-ts';

type IOpts = {
  genMockAbsolutePath: string;
  schemaDefinition: Definition;
  prettierOptions?: prettier.Options;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
};

const genMockDataFile = async (opts: IOpts) => {
  const { genMockAbsolutePath, schemaDefinition, mockDataReplace } = opts;
  let { prettierOptions, jsonSchemaFakerOptions } = opts;
  if (prettierOptions === undefined) {
    prettierOptions = { parser: 'json' };
  }
  prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

  if (jsonSchemaFakerOptions === undefined) {
    jsonSchemaFakerOptions = { alwaysFakeOptionals: true, fillProperties: false };
  }
  jsonSchemaFakerOptions = Object.assign(jsonSchemaFakerOptions, {
    alwaysFakeOptionals: true,
    fillProperties: false,
  });

  jsf.option(jsonSchemaFakerOptions);
  const mockData = jsf.generate(schemaDefinition as any);
  const mockDataString = JSON.stringify(mockData, mockDataReplace, 2);
  const mockDataAbsolutePath = path.join(genMockAbsolutePath, 'mock-data.json');
  fs.writeFileSync(mockDataAbsolutePath, await prettierData(mockDataString, prettierOptions));

  console.info(colors.green('Generate mock/mock-data.json success'));

  return mockDataAbsolutePath;
};

export { genMockDataFile };

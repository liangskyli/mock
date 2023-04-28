import type { Definition } from '@liangskyli/openapi-gen-ts';
import type { IPrettierOptions } from '@liangskyli/utils';
import { colors, prettierData } from '@liangskyli/utils';
import fs from 'fs-extra';
import type { JSONSchemaFakerOptions } from 'json-schema-faker';
import { JSONSchemaFaker } from 'json-schema-faker';
import path from 'path';

type IOpts = {
  genMockAbsolutePath: string;
  schemaDefinition: Definition;
  prettierOptions?: IPrettierOptions;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
};

const genMockDataFile = (opts: IOpts) => {
  const { genMockAbsolutePath, schemaDefinition, mockDataReplace } = opts;
  let { prettierOptions, jsonSchemaFakerOptions } = opts;
  if (prettierOptions === undefined) {
    prettierOptions = { parser: 'json' };
  }
  prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

  if (jsonSchemaFakerOptions === undefined) {
    jsonSchemaFakerOptions = {
      alwaysFakeOptionals: true,
      fillProperties: false,
    };
  }
  jsonSchemaFakerOptions = Object.assign(jsonSchemaFakerOptions, {
    alwaysFakeOptionals: true,
    fillProperties: false,
  });

  JSONSchemaFaker.option(jsonSchemaFakerOptions);
  const mockData = JSONSchemaFaker.generate(schemaDefinition as any);
  const mockDataString = JSON.stringify(mockData, mockDataReplace, 2);
  const mockDataAbsolutePath = path.join(genMockAbsolutePath, 'mock-data.json');
  fs.writeFileSync(
    mockDataAbsolutePath,
    prettierData(mockDataString, prettierOptions),
  );

  console.info(colors.green('Generate mock/mock-data.json success'));

  return mockDataAbsolutePath;
};

export { genMockDataFile };

import type { Definition } from '@liangskyli/openapi-gen-ts';
import type { IPrettierOptions } from '@liangskyli/utils';
import { copyOptions, writePrettierFile } from '@liangskyli/utils';
import type { JSONSchemaFakerOptions, Schema } from 'json-schema-faker';
import { JSONSchemaFaker } from 'json-schema-faker';
import path from 'node:path';

type IGenMockDataJsonOpts = {
  genMockAbsolutePath: string;
  schemaDefinition: Definition;
  prettierOptions?: IPrettierOptions;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
};

export class GenMockDataJson {
  private readonly opts: IGenMockDataJsonOpts;
  private mockDataString: string;

  constructor(opts: IGenMockDataJsonOpts) {
    this.opts = opts;
    this.mockDataString = '';
    this.generator();
  }
  private generator() {
    const { schemaDefinition, mockDataReplace } = this.opts;

    let jsonSchemaFakerOptions = this.opts.jsonSchemaFakerOptions;
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
    const mockData = JSONSchemaFaker.generate(
      schemaDefinition as unknown as Schema,
    );
    this.mockDataString = JSON.stringify(mockData, mockDataReplace, 2);
  }

  public async writeFile() {
    const { genMockAbsolutePath, prettierOptions: defaultPrettierOptions } =
      this.opts;

    let prettierOptions = copyOptions(defaultPrettierOptions);
    if (prettierOptions === undefined) {
      prettierOptions = { parser: 'json' };
    }
    prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

    const absolutePath = path.join(genMockAbsolutePath, 'mock-data.json');

    await writePrettierFile({
      prettierOptions,
      absolutePath,
      data: this.mockDataString,
      successTip: 'Generate mock/mock-data.json success',
    });

    return { mockDataAbsolutePath: absolutePath };
  }
}

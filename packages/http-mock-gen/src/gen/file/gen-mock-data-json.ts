import type { Definition } from '@liangskyli/openapi-gen-ts';
import type { IPrettierOptions } from '@liangskyli/utils';
import { copyOptions } from '@liangskyli/utils';
import type { JSONSchemaFakerOptions, Schema } from 'json-schema-faker';
import { JSONSchemaFaker } from 'json-schema-faker';
import path from 'path';
import { writePrettierFile } from '../../utils';

type IGenCustomDataOpts = {
  genMockAbsolutePath: string;
  schemaDefinition: Definition;
  prettierOptions?: IPrettierOptions;
  jsonSchemaFakerOptions?: JSONSchemaFakerOptions;
  mockDataReplace?: (this: any, key: string, value: any) => any;
};

export class GenCustomData {
  private readonly opts: IGenCustomDataOpts;
  private mockDataString: string;
  public mockDataAbsolutePath: string;

  constructor(opts: IGenCustomDataOpts) {
    this.opts = opts;
    this.mockDataString = '';
    this.mockDataAbsolutePath = '';
    this.generator();
    this.writeFile();
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

  private writeFile() {
    const { genMockAbsolutePath, prettierOptions: defaultPrettierOptions } =
      this.opts;

    let prettierOptions = copyOptions(defaultPrettierOptions);
    if (prettierOptions === undefined) {
      prettierOptions = { parser: 'json' };
    }
    prettierOptions = Object.assign(prettierOptions, { parser: 'json' });

    const absolutePath = path.join(genMockAbsolutePath, 'mock-data.json');

    writePrettierFile({
      prettierOptions,
      absolutePath,
      data: this.mockDataString,
      successTip: 'Generate mock/mock-data.json success',
    });

    this.mockDataAbsolutePath = absolutePath;
  }
}

import type { IGenMockDataOptsCLI } from '../../src';

const config: IGenMockDataOptsCLI = [
  {
    mockDir: './test/all-gen-dirs/genHttpMock',
    openapiPath: './test/example/openapi/openapiv3-example.json',
    jsonSchemaFakerOptions: {
      minItems: 1,
      maxItems: 1,
    },
    mockDataReplace: (key, value) => {
      if (typeof value === 'string') {
        return key;
      }
      if (typeof value === 'number') {
        return 0;
      }
      if (typeof value === 'boolean') {
        return false;
      }
      return value;
    },
  },
  {
    mockDir: './test/all-gen-dirs/genHttpMock2',
    openapiPath: './test/example/openapi/openapiv3-example.json',
  },
];
export default config;

import genMockData from '../../src/index';

genMockData({
  mockDir: './test/genHttpMock',
  openapiPath: './test/openapi/openapiv3-example.json',
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
}).then();

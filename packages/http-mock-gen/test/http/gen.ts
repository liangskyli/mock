import genMockData from '../../src/index';
//import * as path from 'path';

genMockData({
  mockDir: './test/genHttpMock',
  //genTsDir: './test/genHttpMock',
  openapiPath: './test/openapi/openapiv3-example2.json',
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
  //requestFilePath: '../../../http/request',
  //requestFilePath: path.join(__dirname, './request'),
  //requestQueryOmit: ['activityId','b'],
  //requestBodyOmit: ['a','b'],
}).then();

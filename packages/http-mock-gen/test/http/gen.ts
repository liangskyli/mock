import genMockData from '../../src/index';
//import * as path from 'path';

genMockData({
  mockDir: './test/all-gen-dirs/genHttpMock',
  mockPathPrefix: '/mockPathPrefix',
  //genTsDir: './test/all-gen-dirs/genHttpMock',
  openapiPath: './test/example/openapi/openapiv3-example2.json',
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
  /*requestFile: {
    path: '../../../http/request',
    //path: path.join(__dirname, './request'),
  },*/
  //requestQueryOmit: ['activityId','b'],
  //requestBodyOmit: ['a','b'],
}).then();

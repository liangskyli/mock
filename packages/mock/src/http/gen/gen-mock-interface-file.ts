import type prettier from 'prettier';
import fs from 'fs-extra';
import path from 'path';
import { prettierData } from '../../tools';

type IOpts = {
  mockDataAbsolutePath: string;
  genMockAbsolutePath: string;
  prettierOptions?: prettier.Options;
};

const genMockInterfaceFile = async (opts: IOpts) => {
  const { mockDataAbsolutePath, genMockAbsolutePath, prettierOptions } = opts;
  const mockData = await import(mockDataAbsolutePath);
  //console.log('ddd:',mockData);
  const interfaceMockData: string[] = [];
  interfaceMockData.push('export default {');
  Object.keys(mockData).map((item) => {
    const itemValue = mockData[item];
    // method 只支持 get post
    let method = '';
    let data: any = '';
    if (itemValue.get) {
      method = 'GET';
      const content = itemValue.get?.responses?.['200']?.content;
      if (content && content['application/json']) {
        data = content['application/json'];
      } else {
        data = {};
      }
    }
    if (itemValue.post) {
      method = 'POST';
      const content = itemValue.post?.responses?.['200']?.content;
      if (content && content['application/json']) {
        data = content['application/json'];
      } else {
        data = {};
      }
    }
    if (method) {
      interfaceMockData.push(`'${method} ${item}': ${JSON.stringify(data)},`);
    }
  });

  interfaceMockData.push('}');

  const interfaceMockDataAbsolutePath = path.join(genMockAbsolutePath, 'interface-mock-data.ts');
  fs.writeFileSync(
    interfaceMockDataAbsolutePath,
    await prettierData(interfaceMockData.join(''), prettierOptions),
  );

  // todo
  console.info('Generate mock interface file success');
};

export { genMockInterfaceFile };

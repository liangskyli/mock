import fs from 'fs-extra';
import path from 'path';
import { describe, expect, test, vi } from 'vitest';
import { GenMockDataJson } from '../../../src/gen/file/gen-mock-data-json';

describe('Generate mock/mock-data.json file', () => {
  test('Generate mock/mock-data.json file 1', () => {
    const genMockAbsolutePath = path.join(__dirname, './__test__snapshots__');
    const schemaDefinition = fs.readJSONSync(
      path.join(__dirname, './__test__snapshots__/example/schema.json'),
    );
    const mockDataAbsolutePath = new GenMockDataJson({
      genMockAbsolutePath,
      schemaDefinition,
    }).mockDataAbsolutePath;

    const args = vi.mocked(fs.writeFileSync).mock.calls[0];
    expect(args[0] as string).toBe(
      path.join(__dirname, './__test__snapshots__', 'mock-data.json'),
    );
    expect(mockDataAbsolutePath).toBe(args[0] as string);
    expect(args[1]).contains('"/root/v4/getQueryParams1-v4"');

    expect((global as any).writePrettierFileArgs.prettierOptions).toEqual({
      parser: 'json',
    });
    expect((global as any).writePrettierFileArgs.successTip).toBe(
      'Generate mock/mock-data.json success',
    );
  });
  test('Generate mock/mock-data.json file 2', /*async*/ () => {
    const genMockAbsolutePath = path.join(__dirname, './__test__snapshots__');
    const schemaDefinition = fs.readJSONSync(
      path.join(__dirname, './__test__snapshots__/example/schema.json'),
    );
    const mockDataAbsolutePath = new GenMockDataJson({
      genMockAbsolutePath,
      schemaDefinition,
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
    }).mockDataAbsolutePath;

    const args = vi.mocked(fs.writeFileSync).mock.calls[0];
    expect(args[0] as string).toBe(
      path.join(__dirname, './__test__snapshots__', 'mock-data.json'),
    );
    expect(mockDataAbsolutePath).toBe(args[0] as string);
    expect(args[1]).contains('"/root/v4/getQueryParams1-v4"');
    /*await expect(args[1]).toMatchFileSnapshot(
      './__test__snapshots__/schema.json',
    );*/

    expect((global as any).writePrettierFileArgs.prettierOptions).toEqual({
      parser: 'json',
    });
    expect((global as any).writePrettierFileArgs.successTip).toBe(
      'Generate mock/mock-data.json success',
    );
  });
});

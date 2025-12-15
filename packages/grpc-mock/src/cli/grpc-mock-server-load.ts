import { tsImport } from '@liangskyli/utils';
import { pathToFileURL } from 'node:url';

const loadMockServer = async () => {
  const genMockIndexFile = process.argv[2];
  const genMockIndexFileURL = pathToFileURL(genMockIndexFile).href;
  await tsImport(genMockIndexFileURL, import.meta.url);
};

loadMockServer();

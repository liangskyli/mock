import { tsImport } from '@liangskyli/utils';

const loadMockServer = async () => {
  const genMockIndexFile = process.argv[2];
  await tsImport(genMockIndexFile, import.meta.url);
};

loadMockServer();

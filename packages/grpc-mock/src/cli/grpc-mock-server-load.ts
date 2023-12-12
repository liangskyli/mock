import { register } from '@liangskyli/utils';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const loadMockServer = () => {
  const registerKey = 'grpc-mock-load';

  const { unregister } = register.register({
    key: registerKey,
  });

  const genMockIndexFile = process.argv[2];
  require(genMockIndexFile);
  unregister();
};

loadMockServer();

import { createRequire } from 'node:module';
import { register } from './register';

const require = createRequire(import.meta.url);

const getConfig = (configFile: string) => {
  let config: any = null;
  const { unregister } = register({ key: 'utils-getConfig' });
  let errInfo: any = null;
  try {
    config = require(configFile).default;
  } catch (err: any) {
    errInfo = err;
  } finally {
    unregister();
  }
  if (errInfo !== null) {
    throw errInfo;
  }
  return config;
};
export default getConfig;

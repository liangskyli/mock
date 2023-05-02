import colors from 'colors';
import { register } from './register';

const getConfig = (configFile: string) => {
  let config: any = null;
  const { unregister } = register({ key: 'utils-getConfig' });
  try {
    config = require(configFile).default;
  } catch (err: any) {
    if ((err.details || err.message).indexOf('Cannot find') > -1) {
      console.info(colors.red('配置文件找不到，请检查：'), configFile);
    } else {
      throw err;
    }
  } finally {
    unregister();
  }
  return config;
};
export default getConfig;

const getConfig = (configFile: string) => {
  let config: any = null;

  try {
    config = require(configFile).default;
  } catch (err: any) {
    if ((err.details || err.message).indexOf('Cannot find') > -1) {
      console.info('mock 配置文件找不到，请检查：', configFile);
    } else {
      throw err;
    }
  }
  return config;
};
export default getConfig;

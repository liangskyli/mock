/*
 * 通过子进程的方式运行ts代码，获取config配置
 */
const path = require('path');

const getConfig = require(path.join(__dirname, '../lib/script/config')).default;
const config = getConfig(process.argv[2]);

process.send({
  action: 'get-config',
  data: config,
});

process.exit(1);

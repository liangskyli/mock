import type { FSWatcher } from 'chokidar';
import type http from 'node:http';

type IKillProcessOpts = { httpServer?: http.Server; fsWatcher?: FSWatcher };
export const killProcess = (opts: IKillProcessOpts) => {
  const { httpServer, fsWatcher } = opts;
  let closed = false;
  const onSignal = async () => {
    if (closed) return;
    closed = true;
    // 退出时触发事件
    httpServer?.close();
    await fsWatcher?.close();

    process.exit(0);
  };
  // kill(2) Ctrl-C
  process.once('SIGINT', () => onSignal());
  // kill(3) Ctrl-\
  process.once('SIGQUIT', () => onSignal());
  // kill(15) default
  process.once('SIGTERM', () => onSignal());
};

export const sleep = (time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, time);
  });
};

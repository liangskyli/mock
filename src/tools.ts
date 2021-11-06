export const killProcess = (target: any, type: 'server' | 'watcher' = 'watcher') => {
  let closed = false;
  const onSignal = async () => {
    if (closed) return;
    closed = true;
    // 退出时触发事件
    if (type === 'server') {
      target?.listeningApp?.close();
    }
    if (type === 'watcher') {
      await target?.close?.();
    }

    process.exit(0);
  };
  // kill(2) Ctrl-C
  process.once('SIGINT', () => onSignal());
  // kill(3) Ctrl-\
  process.once('SIGQUIT', () => onSignal());
  // kill(15) default
  process.once('SIGTERM', () => onSignal());
};

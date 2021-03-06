import { address, colors, winPath } from '@liangskyli/utils';
import type { FSWatcher } from 'chokidar';
import type http from 'http';
import { isAbsolute, join } from 'path';
import type { ServerOptions, Socket } from 'socket.io';
import { Server as SocketServer } from 'socket.io';

export type ISocketConfig = {
  enable: boolean;
  opts?: Partial<ServerOptions>;
  mockControllerUrl?: string;
};

type ISocketServerConfig = {
  socketConfig: ISocketConfig;
  server: http.Server;
  mockDir?: string;
  port: number;
  hostname: string;
  middlewareWatcher?: FSWatcher;
};

const initSocketServer = (socketServerConfig: ISocketServerConfig) => {
  const {
    socketConfig,
    server,
    mockDir = './',
    hostname,
    port,
    middlewareWatcher,
  } = socketServerConfig;
  const sockets: Socket[] = [];
  // socket server
  const io = new SocketServer(server, {
    serveClient: false,
    ...socketConfig.opts,
  });
  const lanIp = address.ip();
  const protocol = 'http';
  const hostName = hostname === '0.0.0.0' ? 'localhost' : hostname;
  const localUrl = `${protocol}://${hostName}:${port}`;
  const lanUrl = `${protocol}://${lanIp}:${port}`;
  console.log(
    [
      colors.green('  socket mock server running at:'),
      `  - Local:   ${localUrl}`,
      lanUrl && `  - Network: ${lanUrl}`,
      `  - path:   ${socketConfig.opts?.path}`,
    ]
      .filter(Boolean)
      .join('\n'),
  );

  const runSocketController = (socket: Socket) => {
    if (!socketConfig.mockControllerUrl) {
      return;
    }

    // socket main 函数入口
    let mockControllerUrl = socketConfig.mockControllerUrl;
    if (!isAbsolute(mockControllerUrl)) {
      mockControllerUrl = isAbsolute(mockDir)
        ? join(mockDir, socketConfig.mockControllerUrl)
        : join(process.cwd(), mockDir, socketConfig.mockControllerUrl);
    }
    const socketControllerMainPath = winPath(mockControllerUrl);

    const socketMain = require(socketControllerMainPath).default;
    if (!socketMain || typeof socketMain !== 'function') {
      return;
    }
    socketMain(socket);
  };

  io.on('connection', (socket) => {
    console.log(
      colors.green('socket.io mock server connection success,socketId:'),
      socket.id,
    );
    sockets.push(socket);

    // socket mock逻辑
    runSocketController(socket);

    socket.on('disconnect', (reason) => {
      console.log(
        colors.green('socket.io mock server disconnect,socketId:'),
        socket.id,
        colors.green('reason:'),
        reason,
      );
    });
  });

  if (middlewareWatcher) {
    middlewareWatcher.on('all', () => {
      sockets.forEach((value) => {
        // 文件更改后，客户端断开，重新链接
        value.client.conn.close();
      });
      sockets.length = 0;
    });
  }
};

export default initSocketServer;

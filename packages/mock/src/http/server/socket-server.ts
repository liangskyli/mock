import { colors, ip, tsImport, winPath } from '@liangskyli/utils';
import type { FSWatcher } from 'chokidar';
import type http from 'node:http';
import { isAbsolute, join } from 'node:path';
import type { ServerOptions, Socket } from 'socket.io';
import { Server as SocketServer } from 'socket.io';

export type ISocketConfig = {
  enable: boolean;
  opts?: Partial<ServerOptions>;
  mockControllerUrl?: string;
  namespaceList?: string[];
};

export type ISocketDefaultController = (socket: Socket) => void;

export type ISocketNamespaceController = () => Record<
  /** namespace */
  string,
  (socket: Socket) => void
>;

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
    allowEIO3: true,
    ...socketConfig.opts,
  });
  const lanIp = ip();
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

  const getSocketController = async () => {
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

    const { default: socketMain, socketNamespaceController } = await tsImport(
      socketControllerMainPath,
      import.meta.url,
    );
    return { socketMain, socketNamespaceController };
  };

  const runDefaultSocketController = async (socket: Socket) => {
    const controllerData = await getSocketController();
    if (!controllerData) {
      return;
    }

    const socketMain = controllerData.socketMain;
    if (!socketMain || typeof socketMain !== 'function') {
      return;
    }
    socketMain(socket);
  };

  const runCustomNamespaceSocketController = async (
    namespace: string,
    socket: Socket,
  ) => {
    const controllerData = await getSocketController();
    if (!controllerData) {
      return;
    }

    const socketNamespaceController = controllerData.socketNamespaceController;
    if (
      !socketNamespaceController ||
      typeof socketNamespaceController !== 'function'
    ) {
      return;
    }
    (socketNamespaceController as ISocketNamespaceController)()?.[namespace]?.(
      socket,
    );
  };

  let namespaceList = socketConfig.namespaceList ?? [];
  namespaceList = namespaceList.filter((value) => value !== '/');
  namespaceList.unshift('/');

  namespaceList.forEach((namespace) => {
    io.of(namespace).on('connection', (socket) => {
      console.log(
        colors.green('socket.io mock server connection success,socketId:'),
        socket.id,
      );
      sockets.push(socket);

      if (namespace === '/') {
        // socket 默认命名空间 mock逻辑
        runDefaultSocketController(socket);
      } else {
        // socket 自定义命名空间 mock逻辑
        runCustomNamespaceSocketController(namespace, socket);
      }

      socket.on('disconnect', (reason) => {
        console.log(
          colors.green('socket.io mock server disconnect,socketId:'),
          socket.id,
          colors.green('reason:'),
          reason,
        );
      });
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

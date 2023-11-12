import type { IOpts } from './http/server/server';
import mockServer from './http/server/server';

const defineConfig = (config: IOpts) => {
  return config;
};

export default mockServer;
export { defineConfig };

export { commandHttpCli } from './cli/http';
export { default as getMiddleware } from './http/server/middleware';
export { default as initSocketServer } from './http/server/socket-server';
export type {
  ISocketDefaultController,
  ISocketNamespaceController,
} from './http/server/socket-server';

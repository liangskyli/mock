import mockServer from './http/server/server';

export default mockServer;

export { default as getMiddleware } from './http/server/middleware';
export { default as initSocketServer } from './http/server/socket-server';
export type {
  ISocketDefaultController,
  ISocketNamespaceController,
} from './http/server/socket-server';

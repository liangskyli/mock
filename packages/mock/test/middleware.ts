import { getMiddleware, initSocketServer } from '@liangskyli/mock';
import express from 'express';
import mockConfig from './mock.config';

const app = express();

const socketConfig = mockConfig.socketConfig;

const mockDir = mockConfig.mockDir;

getMiddleware({ mockDir }).then(({ middleware, middlewareWatcher }) => {
  app.use(middleware);

  app.get('/', (req: any, res: any) => {
    res.send('homepage');
  });
  const port = 8002;
  const httpServer = app.listen(port);
  console.log(`look in http://localhost:${port}/`);

  if (socketConfig && socketConfig.enable) {
    initSocketServer({
      socketConfig,
      server: httpServer,
      mockDir,
      port,
      hostname: '0.0.0.0',
      middlewareWatcher,
    });
  }
});

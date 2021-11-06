// @ts-ignore
import express from 'express';
import { getMiddleware } from '../src';

const app = express();

getMiddleware().then((middleware) => {
  app.use(middleware);

  app.get('/', (req: any, res: any) => {
    res.send('homepage');
  });

  app.listen(3000);
  console.log('look in http://localhost:3000/');
});

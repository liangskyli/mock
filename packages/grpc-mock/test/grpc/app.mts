import express from 'express';
import { start, start2 } from './get-grpc-client-1.mjs';

const app = express();

app.get('/', (_req, res) => {
  res.send('homepage');
});

app.get('/1', async (_req, res) => {
  try {
    const result = await start();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.get('/2', async (_req, res) => {
  try {
    const result = await start2();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

const port = 8002;
app.listen(port);
console.log(`look in http://localhost:${port}/`);

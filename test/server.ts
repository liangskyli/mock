import mockServer from '../src';
import * as path from 'path';

//mockServer();
//mockServer({ mockDir: 'test' });
mockServer({ mockDir: path.join(__dirname, '/'), exclude: ['mock/b.ts'] });
//mockServer({port: 9001 });
//mockServer({hostname: '127.0.0.1',port: 9001 });

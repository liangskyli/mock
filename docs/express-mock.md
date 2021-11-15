# http mock 迁入已有的express服务

```ts
import express from 'express';
import { getMiddleware } from '@liangskyli/mock';

const app = express();

getMiddleware().then(({ middleware }) => {
    app.use(middleware);

    app.get('/', (req: any, res: any) => {
        res.send('homepage');
    });

    app.listen(3000);
    console.log('look in http://localhost:3000/');
});
```
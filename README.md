# 多种Mock服务方式提供MOCK数据，总有一种方式适合你

Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发独立自主，不会被服务端的开发所阻塞。

## 安装:
```
yarn add @liangskyli/mock --dev
```

## 使用方式:
## mockServer 调用方式
```ts
import mockServer from '@liangskyli/mock';

mockServer({ port: 9001, hostname: '0.0.0.0' });
```

### mockServer 参数
| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| opts      | mockServer配置参数 | `见下面opts参数` |

### mockServer opts参数
| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| mockDir  | mock文件夹所在目录  | `./` |
| exclude   | 用于忽略不需要走 mock 的文件 `Array(string) 如：['a.ts','b.ts']`  |  |
| hostname  | 服务器地址        | `0.0.0.0` |
| port      | 端口号 `设置的端口被占用，自动使用新端口` | `8001` |
| watch     | 是否监听mock文件改动 `bool值`  | `true` |


## CLI 命令方式

```
yarn mock-server -p 8001
```

### 环境变量
| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| WATCH_FILES  | 是否监听mock文件改动 `bool值`  | `true` |

### 命令参数

| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| -d, --dir  | mock文件夹所在目录  | `./` |
| -e, --exclude | 用于忽略不需要走 mock 的文件 `多个路径用英文逗号分割，如：a.ts,b.ts`  |  |
| -host, --hostname  | 服务器地址        | `0.0.0.0` |
| -p, --port      | 端口号 `设置的端口被占用，自动使用新端口` | `8001` |
| -w, --watch     | 是否监听mock文件改动 `bool值` | `true` |

## 中间件方式，迁入已有的express服务或webpack-dev-server服务中

- express服务
```ts
// @ts-ignore
import express from 'express';
import { getMiddleware } from '@liangskyli/mock';

const app = express();

getMiddleware().then((middleware) => {
    app.use(middleware);

    app.get('/', (req: any, res: any) => {
        res.send('homepage');
    });

    app.listen(3000);
    console.log('look in http://localhost:3000/');
});
```
- webpack-dev-server服务
```ts
import type WebpackDevServer from 'webpack-dev-server';
import type Webpack from 'webpack';
import { getMiddleware } from '@liangskyli/mock';

const webpackConfig: Webpack.Configuration = {
    entry: './test/app.js',
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        port: 4000,
        onBeforeSetupMiddleware: (devServer: WebpackDevServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            getMiddleware().then((middleware) => {
                devServer.app.use(middleware);

                devServer.app.get('/', (req, res) => {
                    res.send('homepage');
                });
                console.log('look in http://localhost:4000/');
            });
        },
    },
};
export default webpackConfig;
```

### getMiddleware 参数
| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| opts      | getMockMiddleware配置参数 | `见下面opts参数` |

### getMiddleware opts参数
| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| mockDir  | mock文件夹所在目录  | `./` |
| exclude   | 用于忽略不需要走 mock 的文件 `Array(string) 如：['a.ts','b.ts']`  |  |
| watch     | 是否监听mock文件改动 `bool值`  | `true` |

### getMiddleware 方法异步返回中间件middleware
| 异步返回属性 | 说明             | 
| ---------  | ---------------  |
| middleware  | express中间件 `可用于express服务或webpack-dev-server服务中`  |

## 约定式 Mock 文件

约定 `/mock` 文件夹下所有文件为 mock 文件。
约定 `**/_mock.[jt]s` 下所有_mock.js文件,_mock.ts文件为 mock 文件。

比如：

```bash
.
├── mock
    ├── api.ts
    └── users.ts
└── src
    └── pages
        └── index.tsx
        └── _mock.ts
```

`/mock` 下的 `api.ts` 和 `users.ts` 会被解析为 mock 文件。
`/src/pages` 下的 `_mock.ts` 会被解析为 mock 文件。

## 编写 Mock 文件

如果 `/mock/api.ts` 的内容如下，

```js
export default {
  // 支持值为 Object 和 Array
  'GET /api/users': { users: [1, 2] },

  // GET 可忽略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('ok');
  },
}
```

然后访问 `/api/users` 就能得到 `{ users: [1,2] }` 的响应，其他以此类推。

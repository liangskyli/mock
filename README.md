# mockServer
mockServer for web

use:
```
import mockServer from '@liangsky/mock';

mockServer({ port: 9001, hostname: '0.0.0.0' });
```

# mockServer 参数

| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| mockDir  | mock文件夹所在目录  | `/` |
| hostname  | 服务器地址        | `0.0.0.0` |
| port      | 端口号 `设置的端口被占用，自动使用新端口` | `8001` |


# Mock 数据

Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发独立自主，不会被服务端的开发所阻塞。

## 约定式 Mock 文件

约定 `/mock` 文件夹下所有文件为 mock 文件。

比如：

```bash
.
├── mock
    ├── api.ts
    └── users.ts
└── src
    └── pages
        └── index.tsx
```

`/mock` 下的 `api.ts` 和 `users.ts` 会被解析为 mock 文件。

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

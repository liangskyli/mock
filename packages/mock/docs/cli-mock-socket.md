# CLI mock socket 例子

- mock 配置文件
  - 配置文件支持使用defineConfig定义ts类型

```ts
import { defineConfig } from '@liangskyli/mock';
import path from 'path';

export default defineConfig({
  mockDir: path.join(__dirname, '/'),
  socketConfig: {
    enable: true,
    // 自定义命名空间
    // namespaceList:['/namespace'],
    opts: {
      path: '/socket.io/',
      cors: {
        origin: ['http://localhost:63342'],
      },
    },
    mockControllerUrl: 'mock/socket/sock2.js',
  },
});
```

- CLI 运行命令

```bash
yarn mock-server -p 8001 -c ./mock.config.ts
```

- mockControllerUrl 逻辑
  - 可以使用mockjs库生成随机数据，支持js,ts文件，热更新。灵活模拟 socket 场景数据。

```ts
import type { ISocketDefaultController } from '@liangskyli/mock';

const socketDefaultController: ISocketDefaultController = (socket) => {
  const data = { a: 112 };
  // 数据发送客户端
  socket.emit('toClient', data);

  // 接收客户端数据
  socket.on('toServer', (clientData) => {
    console.log('from client:', clientData);
  });
};

export default socketDefaultController;
```

- 支持自定义命名空间socket连接，导出socketNamespaceController方法
  - mock 配置文件里socketConfig配置：namespaceList:['/namespace']
  - mockControllerUrl 逻辑
  
```ts
import type { ISocketNamespaceController } from '@liangskyli/mock';

const socketNamespaceController: ISocketNamespaceController = (
) => {
  // namespace
  return {
    '/namespace': (socket) => {
      const data = { a: 112 };
      // 数据发送客户端
      socket.emit('toClient', data);

      // 接收客户端数据
      socket.on('toServer', (clientData) => {
        console.log('from client:', clientData);
      });
    }
  };
};
export { socketNamespaceController };
```

- socket html 代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>socket</title>
    <script src="socket.io.js"></script>
  </head>
  <body>
    <script type="text/javascript">
      const url = 'ws://localhost:8002';
      // namespace 命名空间
      // const url = 'ws://localhost:8002/namespace';
      const socket = io(url, { path: '/socket.io/' });
      socket.on('connect', () => {
        console.log('connect:', socket.connected,',socketId:',socket.id);
      });

      socket.on('toClient', (data) => {
          console.log('socket data:',data);
          socket.emit('toServer',{id:'111',txt:'hello1'});
      });

      socket.on('disconnect', () => {
        console.log('disconnect!');
      });

      function send(){
        socket.emit('toServer',{id:'22',txt:'hello2'});
      }
    </script>

    socket
    <button onclick="send()">按钮</button>
  </body>
</html>
```

# CLI mock socket 例子

- mock 配置文件

```ts
import path from 'path';

export default {
  mockDir: path.join(__dirname, '/'),
  socketConfig: {
    enable: true,
    opts: {
      path: '/socket.io/',
      cors: {
        origin: ['http://localhost:63342'],
      },
    },
    mockControllerUrl: 'mock/socket/sock2.js',
  },
};
```

- CLI 运行命令

```bash
yarn mock-server -p 8001 -c ./mock.config.ts
```

- mockControllerUrl 逻辑
  - 可以使用mockjs库生成随机数据，支持js,ts文件，热更新。灵活模拟 socket 场景数据。

```ts
import type {Socket} from 'socket.io';

const socketController = (socket: Socket) => {
  const data = { a: 112 };
  // 数据发送客户端
  socket.emit('toClient', data);

  // 接收客户端数据
  socket.on('toServer', (clientData) => {
    console.log('from client:', clientData);
  });
};

export default socketController;
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
      const socket = io('http://localhost:8002', { path: '/socket.io/' });
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

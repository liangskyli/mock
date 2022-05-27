# mockServer socket 例子

- mockServer服务代码

```ts
import mockServer from '@liangskyli/mock';
import path from 'path';

mockServer({
    mockDir: path.join(__dirname, '/'),
    exclude: ['mock/b.ts'],
    socketConfig: {
        enable: true,
        opts: {
            path: '/socket.io/',
            cors: {
                origin: ['http://localhost:63342'],
            },
        },
        mockControllerUrl: 'mock/socket/sock.ts',
    },
});
```

- mockControllerUrl 逻辑
  - 可以使用mockjs库生成随机数据，支持js,ts文件，热更新。灵活模拟 socket 场景数据。

```ts
import type { Socket } from 'socket.io';
import mockjs from 'mockjs';

const socketController = (socket: Socket) => {
    const data = mockjs.mock({
        'list|2': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
        a:'1',
    });
    // 数据发送客户端
    socket.emit('toClient', data);
    // 定时推送数据
    let toClient = 1;
    setInterval(() => {
        socket.emit('toClient', toClient++);
    }, 5000);

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

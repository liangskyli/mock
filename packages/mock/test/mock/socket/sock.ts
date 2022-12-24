import mockjs from 'mockjs';
import type {
  ISocketDefaultController,
  ISocketNamespaceController,
} from '../../../src';

const socketDefaultController: ISocketDefaultController = (socket) => {
  const data = mockjs.mock({
    'list|2': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
    a: '1',
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

export default socketDefaultController;

const socketNamespaceController: ISocketNamespaceController = () => {
  return {
    '/namespace': (socket) => {
      socket.emit('toClient', { data: 'init' });

      // 定时推送数据
      let toClient = 1;
      setInterval(() => {
        socket.emit('toClient', toClient++);
      }, 5000);

      // 接收客户端数据
      socket.on('toServer', (clientData) => {
        console.log('from client:', clientData);
      });
    },
  };
};
export { socketNamespaceController };

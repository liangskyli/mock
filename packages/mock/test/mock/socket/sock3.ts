import type { ISocketDefaultController } from '../../../src';

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

import type { ISocketDefaultController } from '@liangskyli/mock';

const socketDefaultController: ISocketDefaultController = (socket) => {
  const data = { a: 112 };
  // 数据发送客户端
  socket.emit('toClient', data);

  // 接收客户端数据
  socket.on('toServer', (clientData) => {
    console.log('from client default namespace:', clientData);
  });
};

export default socketDefaultController;

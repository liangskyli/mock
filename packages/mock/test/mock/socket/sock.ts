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

const addList = (begin: number, count: number) => {
  const list = [];
  for (let i = begin; i < begin + count; i++) {
    list.push({
      id: `${i}`,
      desc: `1栋-1单元-${i}-${mockjs.Random.string(
        '壹贰叁肆伍陆柒捌玖拾',
        2,
        10,
      )}`,
    });
  }
  return list;
};

let beginIndex = 0;

const socketNamespaceController: ISocketNamespaceController = () => {
  return {
    '/tvwall': (socket) => {
      socket.emit('toClient', { data: 'init' });
      // console.log('socket headers:',socket.handshake)
      const heatData = [
        {
          chooseRoomId: 481475,
          data: {
            /** 收藏热度百分比 */
            heatPresent: 60,
            /** 第一意向热度百分比 */
            firstHeatPresent: 80,
            /** 第一意向收藏数 */
            firstFavorite: 50,
            /** 收藏数 */
            favorite: 70,
          },
        },
        {
          chooseRoomId: 481492,
          data: {
            /** 收藏热度百分比 */
            heatPresent: 60,
            /** 第一意向热度百分比 */
            firstHeatPresent: 80,
            /** 第一意向收藏数 */
            firstFavorite: 50,
            /** 收藏数 */
            favorite: 70,
          },
        },
        {
          chooseRoomId: 481511,
          data: {
            /** 收藏热度百分比 */
            heatPresent: 60,
            /** 第一意向热度百分比 */
            firstHeatPresent: 80,
            /** 第一意向收藏数 */
            firstFavorite: 50,
            /** 收藏数 */
            favorite: 70,
          },
        },
        {
          chooseRoomId: 481456,
          data: {
            /** 收藏热度百分比 */
            heatPresent: 100,
            /** 第一意向热度百分比 */
            firstHeatPresent: 80,
            /** 第一意向收藏数 */
            firstFavorite: 50,
            /** 收藏数 */
            favorite: 70,
          },
        },
      ];
      socket.emit('tvwall_push', heatData);
      const hotData = () => {
        const getFavoriteDynamicData = () => {
          beginIndex = beginIndex + 5;
          return addList(beginIndex, 5);
        };
        return {
          blockHotData: [
            {
              id: '1',
              name: '1栋',
              hotPresent: 100,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '2',
              name: '2栋2栋2栋2栋2栋2栋2栋2栋2栋2栋2栋2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '3',
              name: '2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '4',
              name: '2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '5',
              name: '555栋',
              hotPresent: mockjs.Random.integer(0, 100),
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '6',
              name: '2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '7',
              name: '2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
          ],
          houseTypeHotData: [
            {
              id: '1',
              name: '1栋',
              hotPresent: 100,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '2',
              name: '2栋2栋2栋2栋2栋2栋2栋2栋2栋2栋2栋2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '3',
              name: '2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '4',
              name: '2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
            {
              id: '5',
              name: '2栋',
              hotPresent: 60,
              totalRoomNum: 100,
              favoriteRoomNum: 30,
              favoriteCustomerNum: 50,
            },
          ],
          favoriteDynamicData: getFavoriteDynamicData(),
        };
      };
      socket.emit('tvwall_hot_push', hotData());

      // 定时推送数据
      let toClient = 1;
      setInterval(() => {
        socket.emit('toClient', toClient++);
        socket.emit('tvwall_hot_push', hotData());
      }, 3000);

      // 接收客户端数据
      socket.on('toServer', (clientData) => {
        console.log('from client:', clientData);
      });
    },
  };
};
export { socketNamespaceController };

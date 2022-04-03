import type { ICustomData } from 'packageName';
import { Request } from 'express';

export const ActivityData: ICustomData = {
  '/v1/activity/create': {
    /** mock 正常响应数据 */
    response: { retCode: 0, retMsg: 'retMsg', data: {} },
    /** mock 多场景响应数据 */
    sceneData: [
      {
        // eslint-disable-next-line
        requestCase: (request: Request) => {
          // request 为http传入参数，可以根据不同参数配置不同场景数据
          // mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配
          return false;
        },
        response: { retCode: 0, retMsg: 'retMsg', data: {} },
      },
    ],
  },
};

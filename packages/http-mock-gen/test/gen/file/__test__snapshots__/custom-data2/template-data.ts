import type {
  ICustomDataValue,
  ICustomsData,
  PartialAll,
} from '@liangskyli/http-mock-gen';
import type { Request } from 'express';
import type { IApi } from './schema-api/interface-api';

export const TemplateData: ICustomsData<{
  '/root/getQueryParam-v3/{id}': ICustomDataValue<
    PartialAll<IApi['/root/getQueryParam-v3/{id}']['Response']>
  >;
}> = {
  '/root/getQueryParam-v3/{id}': {
    /** mock 响应数据(函数调用，支持动态生成数据) */
    response: { code: 0, data: { a33: 'a33' }, msg: 'msg' },
    /** mock 多场景响应数据 */
    sceneData: [
      {
        // eslint-disable-next-line
        requestCase: (request: Request) => {
          // request 为http传入参数，可以根据不同参数配置不同场景数据
          // mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配
          return false;
        },
        response: { code: 0, data: { a33: 'a33' }, msg: 'msg' },
      },
    ],
  },
};

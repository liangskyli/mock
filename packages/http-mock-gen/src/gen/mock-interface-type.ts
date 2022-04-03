import { Request } from 'express';

type IResponseData = {
  /** mock 响应数据 */
  response: any;
};

export type ICustomData = Record<
  /** http 接口路径 */
  string,
  | (IResponseData & {
      /** mock 多场景响应数据 */
      sceneData?: (IResponseData & {
        /** mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配 */
        requestCase: (request: Request) => boolean;
      })[];
    })
  | undefined
>;

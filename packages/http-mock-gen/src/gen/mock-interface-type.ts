import { Request } from 'express';

type IResponseData<T = any> = {
  /** mock 响应数据 */
  response: T;
};

export interface ISceneDataItem<T> extends IResponseData<T> {
  /** mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配 */
  requestCase: (request: Request) => boolean;
}

export type ICustomData<T = any> = Record<
  /** http 接口路径 */
  string,
  | (IResponseData<T> & {
      /** mock 多场景响应数据 */
      sceneData?: ISceneDataItem<T>[];
    })
  | undefined
>;

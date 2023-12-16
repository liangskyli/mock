import type { IOpenapiMethod } from '@liangskyli/openapi-gen-ts';
import type { Request } from 'express';

interface IResponseData<T = any> {
  /** mock 响应数据(函数调用，支持动态生成数据) */
  response: T | (() => T);
}
export interface ISceneDataItem<T> extends IResponseData<T> {
  /** mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配 */
  requestCase: (request: Request) => boolean;
}

export type ICustomDataValue<T> = IResponseData<T> & {
  /** mock 多场景响应数据 */
  sceneData?: ISceneDataItem<T>[];
};
export type ICustomDataMethods<
  T = any,
  M extends IOpenapiMethod = any,
> = Partial<Record<M, ICustomDataValue<T>>>;

export type ICustomData<
  T = any,
  K extends keyof any = string,
  M extends IOpenapiMethod = any,
> = Record<
  /** http 接口路径 */
  K,
  ICustomDataMethods<T, M> | undefined
>;

export type ICustomsData<
  T extends Record<
    /** http 接口路径 */
    string,
    ICustomDataMethods
  > = Record<
    /** http 接口路径 */
    string,
    ICustomDataMethods
  >,
> = T;

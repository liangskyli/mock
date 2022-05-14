import type { ICustomsData, PartialAll, ICustomDataValue } from 'packageName';
import type { Request } from 'express';
import type { IApi } from '{{IApiRelativePath}}';

export const TemplateData: ICustomsData<{
  '{{firstPath}}': ICustomDataValue<PartialAll<IApi['{{firstPath}}']['Response']>>;
}> = {
  '{{firstPath}}': {
    /** mock 响应数据 */
    response: {{responseData}},
    /** mock 多场景响应数据 */
    sceneData: [
      {
        // eslint-disable-next-line
        requestCase: (request: Request) => {
          // request 为http传入参数，可以根据不同参数配置不同场景数据
          // mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配
          return false;
        },
        response: {{responseData}},
      },
    ],
  },
};

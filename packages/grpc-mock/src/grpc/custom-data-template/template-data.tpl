import type { IImplementationData } from 'packageName';

export const ActivityServiceData: IImplementationData = {
  Create: {
    /** mock 正常响应数据 */
    response: {
      /** 活动名称 */
      activityName: 'activityName_custom_data',
    },
    /** mock 多场景响应数据 */
    sceneData: [
      {
        // eslint-disable-next-line
        requestCase: (request: any) => {
          // request 为grpc传入参数，可以更具不同参数配置不同场景数据
          // mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配
          return false;
        },
        response: {
          /** 活动名称 */
          activityName: 'activityName_custom_sceneData',
        },
      },
    ],
  },
};
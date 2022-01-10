# Mock 数据修改指引
 
默认`/grpc-mock` 文件夹下所有文件为 grpc-mock 文件。

比如：

```bash
.
├── grpc-mock
    ├── custom-data // 自定义mock数据文件夹
    |   └── index.ts // 自定义mock数据入口文件
    |   └── template-data.ts // 模版数据例子
    └── proto  // proto mock数据文件夹（自动生成，不要更改）
    |   └── serverName1 // 服务文件夹
    |       └── accitity_package // proto 包名文件夹
    |           └── ActibityService.ts // proto服务mock数据
    ├── server // mock 服务代码文件夹
    |   └── Severname1Mock.ts // mock服务配置代码
    └── root.json // 生成的proto对应的json文件
    └── index.ts // grpc-mock服务启动文件
    └── grpc-obj.ts // grpc-mock服务依赖文件
    └── grpc-service.mock.config.js // grpc-mock服务名和端口配置文件
```

- proto 数据修改，例如：在上图结构中 grpc-mock/proto/serverName1/ 下的文件不要修改，请转移到custom-data目录下，进行自定义数据修改。
  - custom-data/index.ts
  
  ```ts
  // 自定义mock数据入口，文件不可删除。
  import type { ICustomData } from '@liangskyli/grpc-mock';
  import { ActivityServiceData } from './template-data';
  
  const CustomData: ICustomData = {
    // 自定义mock数据示例
    // key 对应proto文件夹下，服务文件里的path属性
    // ActivityServiceData 对应proto文件夹下，服务文件里的implementationData属性
    'serverName1.activity_package.ActivityService': ActivityServiceData,
  };
  export default CustomData;
  ```
  - custom-data/template-data.ts
  
  ```ts
  import type { IImplementationData } from '@liangskyli/grpc-mock';
  
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  ```
- implementationData 数据结构，里面可以按格式要求，配置错误数据，响应数据，metadata数据，及多场景相关数据。
- 优先级error > response ， error > metadata
- sceneData 命中优先级 > 非命中优先级
```ts
type IResponseData = {
  /** mock 错误数据 */
  error?: {
    /** mock 错误码 */
    code: number;
    /** mock 错误信息 */
    message: string;
  };
  /** mock 正常响应数据 */
  response: any;
  /** mock metadata数据 */
  metadata?: IMetadataMap;
};

export type IImplementationData = Record<
  /** grpc 调用方法名 */
  string,
  IResponseData & {
    /** mock 多场景响应数据 */
    sceneData?: (IResponseData & {
      /** mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配 */
      requestCase: (request: any) => boolean;
    })[];
  }
>;
```

## 引入 Mock.js

[Mock.js](http://mockjs.com/) 是常用的辅助生成模拟数据的三方库，借助他可以提升我们的 mock 数据能力。

比如：
- custom-data/template-data.ts
```ts
import type { IImplementationData } from '@liangskyli/grpc-mock';
import mockjs from 'mockjs';

export const ActivityServiceData: IImplementationData = {
  Create: {
    /** mock 正常响应数据 */
    response: {
      /** 活动名称 */
      activityName: mockjs.Random.string(3),
    },
    /** mock 多场景响应数据 */
    sceneData: [
      {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        requestCase: (request: any) => {
          // request 为grpc传入参数，可以更具不同参数配置不同场景数据
          // mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配
          return request.activityId === '10';
        },
        response: {
          /** 活动名称 */
          activityName: 'activityName_custom_sceneData',
        },
      },
    ],
  },
};
```
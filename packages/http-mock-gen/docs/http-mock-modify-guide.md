# Mock 数据修改指引
 
默认`/mock` 文件夹下所有文件为 mock 文件。

比如：

```bash
.
├── mock
    ├── custom-data // 自定义mock数据文件夹
    |   └── index.ts // 自定义mock数据入口文件
    |   └── template-data.ts // 模版数据例子
    ├── schema-api // schema接口定义文件夹
    |   ├── interface-api.ts // 生成最终的http 接口api数据类型入出参定义
    |   ├── mock-data.ts // 生成mock数据文件
    |   ├── request.ts // requestFilePath没设置时，生成默认axios请求库文件
    |   ├── request-api.ts // 请求接口文件
    |   ├── schema.ts // ts类型文件生成json schema文件
    |   └── ts-schema.ts // openapi 生成ts类型文件
    └── interface-mock-data.ts // 生成最终的http mock 默认数据
```

- mock 数据修改，例如：在上图结构中 只能在custom-data目录下，进行自定义数据修改。
  - custom-data/index.ts
  
  ```ts
  // 自定义mock数据入口，文件不可删除。
  import type { ICustomData } from '@liangskyli/http-mock-gen';
  import { BuildingData } from './template-data';
  
  const CustomData: ICustomData = {
  // 自定义mock数据示例
  // BuildingData 对应接口数据
  ...BuildingData,
  };
  export default CustomData;
  ```
  - custom-data/template-data.ts
  
  ```ts
  import type { ICustomData } from '@liangskyli/http-mock-gen';
  import { Request } from 'express';
  import { IApi } from '../schema-api/interface-api';
  
  type IBuildingData = IApi['/v1/building/get-list']['Response'];
  
  export const BuildingData: ICustomData<IBuildingData> = {
    '/v1/building/get-list': {
      /** mock 响应数据 */
      response: {
        retCode: 0,
        retMsg: 'retMsg',
        data: { isFuLi: false, blockList: [{ isBindErp: false, buildingName: 'buildingName11' }] },
      },
      /** mock 多场景响应数据 */
      sceneData: [
        {
          // eslint-disable-next-line
          requestCase: (request: Request) => {
            // request 为http传入参数，可以根据不同参数配置不同场景数据
            // mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配
            return false;
          },
          response: {
            retCode: 0,
            retMsg: 'retMsg',
            data: { isFuLi: false, blockList: [{ isBindErp: false, buildingName: 'buildingName' }] },
          },
        },
      ],
    },
  }; 
  ```
  
- ICustomData 数据结构，里面可以按格式要求，配置响应数据，及多场景相关数据。
- sceneData 命中优先级 > 非命中优先级
```ts
import { Request } from 'express';

type IResponseData<T = any> = {
  /** mock 响应数据 */
  response: T;
};

export type ICustomData<T = any> = Record<
  /** http 接口路径 */
  string,
  | (IResponseData<T> & {
      /** mock 多场景响应数据 */
      sceneData?: (IResponseData<T> & {
        /** mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配 */
        requestCase: (request: Request) => boolean;
      })[];
    })
  | undefined
>;
```

## 引入 Mock.js

[Mock.js](http://mockjs.com/) 是常用的辅助生成模拟数据的三方库，借助他可以提升我们的 mock 数据能力。

比如：
- custom-data/template-data.ts
```ts
import type { ICustomData } from '@liangskyli/http-mock-gen';
import { Request } from 'express';
import mockjs from 'mockjs';

export const BuildingData: ICustomData = {
  '/v1/building/get-list': {
    /** mock 正常响应数据 */
    response: {
      retCode: 0,
      retMsg: 'retMsg',
      data: { isFuLi: false, blockList: [{ isBindErp: false, buildingName: mockjs.Random.string(3) }] },
    },
    /** mock 多场景响应数据 */
    sceneData: [
      {
        // eslint-disable-next-line
        requestCase: (request: Request) => {
          // request 为http传入参数，可以根据不同参数配置不同场景数据
          // mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配
          return false;
        },
        response: {
          retCode: 0,
          retMsg: 'retMsg',
          data: { isFuLi: false, blockList: [{ isBindErp: false, buildingName: 'buildingName' }] },
        },
      },
    ],
  },
};
```
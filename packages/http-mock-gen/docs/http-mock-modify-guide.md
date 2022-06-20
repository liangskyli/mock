# Mock 数据修改指引
 
默认`/mock` 文件夹下所有文件为 mock 文件。

比如：

```bash
.
├── mock
    ├── custom-data // 自定义mock数据文件夹
    |   └── index.ts // 自定义mock数据入口文件
    |   └── template-data.ts // 模版数据例子  
    ├── schema-api // schema接口定义文件夹(genTsDir没配置，默认生成在mock下)
    |   ├── interface-api.ts // 生成最终的http 接口api数据类型入出参定义
    |   ├── request.ts // requestFilePath没设置时，生成默认axios请求库文件
    |   ├── request-api.ts // 请求接口文件
    |   ├── schema.ts // ts类型文件生成json schema文件
    |   └── ts-schema.ts // openapi 生成ts类型文件
    ├── interface-mock-data.ts // 生成最终的http mock 默认数据  
    └── mock-data.ts // 生成mock数据文件
```

- 注意：生成的mock数据，使用需要忽略custom-data，schema-api文件夹，不需要走 mock 的文件。
  - @liangskyli/mock 已经默认忽略了,不需要额外配置。

  ```ts
  exclude: [
   'mock/custom-data/**',
   'mock/schema-api/**',
  ],
  ```

- mock 数据修改，例如：在上图结构中 只能在custom-data目录下，进行自定义数据修改。
  - custom-data/index.ts
  
  ```ts
  // 自定义mock数据入口，文件不可删除。
  import type { ICustomsData } from '@liangskyli/http-mock-gen';
  import { TemplateData } from './template-data';
  
  const CustomData: ICustomsData = {
    // 自定义mock数据示例
    // TemplateData 对应接口数据
    ...TemplateData,
  };
  export default CustomData;
  ```
  
  - custom-data/template-data.ts
  
  ```ts
  import type { ICustomsData, PartialAll, ICustomDataValue } from '@liangskyli/http-mock-gen';
  import type { Request } from 'express';
  import type { IApi } from '../schema-api/interface-api';
  
  export const TemplateData: ICustomsData<{
    '/v1/building/get-list': ICustomDataValue<PartialAll<IApi['/v1/building/get-list']['Response']>>;
  }> = {
    '/v1/building/get-list': {
      /** mock 响应数据(函数调用，支持动态生成数据) */
      response: {
        retCode: 0,
        data: { blockList: [{ isBindErp: false, buildingName: 'buildingName' }], isFuLi: false },
        retMsg: 'retMsg',
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
            data: { blockList: [{ isBindErp: false, buildingName: 'buildingName' }], isFuLi: false },
            retMsg: 'retMsg',
          },
        },
      ],
    },
  }; 
  ```
  
- ICustomData 数据结构，里面可以按格式要求，配置响应数据，及多场景相关数据。
- 自定义mock数据(含多场景响应数据)支持按需配置，未配置使用默认值。
  - 智能合并mock数据例子如下

  ```ts
  // 默认数据
  const defaultData = {
    retCode: 0,
    data: { blockList: [{ isBindErp: false, buildingName: 'buildingName' }], isFuLi: false },
    retMsg: 'retMsg',
  };
  
  //自定义数据response里可以这样
  const response = {
    data: {
      blockList: [
        {
          buildingName: 'buildingName11'
        },
        {
          isBindErp: true,
        },     
      ],
    },
  };
  //自定义数据和默认数据合并后，会生成下面mock数据
  const result = {
    retCode: 0,
    data: {
      blockList: [
        {
          isBindErp: false,
          buildingName: 'buildingName11'
        },
        {
          isBindErp: true,
          buildingName: 'buildingName',
        },
      ],
      isFuLi: false,
    },
    retMsg: 'retMsg',
  };
  ```
- sceneData 命中优先级 > 非命中优先级
- 相关类型定义说明

```ts
import type { Request } from 'express';

type IResponseData<T = any> = {
  /** mock 响应数据(函数调用，支持动态生成数据) */
  response: T | (() => T);
};

export interface ISceneDataItem<T> extends IResponseData<T> {
  /** mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配 */
  requestCase: (request: Request) => boolean;
}

export type ICustomDataValue<T = any> = IResponseData<T> & {
  /** mock 多场景响应数据 */
  sceneData?: ISceneDataItem<T>[];
};

export type ICustomData<T = any, K extends keyof any = string> = Record<
  /** http 接口路径 */
  K,
  ICustomDataValue<T> | undefined
>;

export type ICustomsData<
  T extends Record<
    /** http 接口路径 */
    string,
    ICustomDataValue
  > = Record<
    /** http 接口路径 */
    string,
    ICustomDataValue
  >,
> = T;
```

## 引入 Mock.js

[Mock.js](http://mockjs.com/) 是常用的辅助生成模拟数据的三方库，借助他可以提升我们的 mock 数据能力。

比如：
- custom-data/template-data.ts

```ts
import type { ICustomsData, PartialAll, ICustomDataValue } from '@liangskyli/http-mock-gen';
import type { Request } from 'express';
import type { IApi } from '../schema-api/interface-api';

export const TemplateData: ICustomsData<{
  '/v1/building/get-list': ICustomDataValue<PartialAll<IApi['/v1/building/get-list']['Response']>>;
}> = {
  '/v1/building/get-list': {
    /** mock 响应数据(函数调用，支持动态生成数据) */
    response: () => {
      return {
        retCode: 0,
        data: { blockList: [{ isBindErp: false, buildingName: mockjs.Random.string(3) }], isFuLi: false },
        retMsg: 'retMsg',
      };
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
          data: { blockList: [{ isBindErp: false, buildingName: 'buildingName' }], isFuLi: false },
          retMsg: 'retMsg',
        },
      },
    ],
  },
};
```
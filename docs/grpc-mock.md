# grpc mock功能

> 提供grpc mock数据自动生成和mock服务启动功能，减轻手动编写mock数据代码，mock数据填充默认值。

## grpc mock 生成方式:
## 1、CLI 命令方式（推荐）

```bash
yarn grpc-mock code-gen -c ./mock.config.cli.ts
```

### 命令参数

| 参数       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| -w, --watch     | 是否监听mock文件改动 `bool值` | `true` |
| -c, --configFile  | mock配置文件 `配置参数见下面`  |  |

## 命令参数 configFile mock配置文件参数属性
| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| grpcMockDir  | mock文件夹所在目录  | `./` |
| grpcMockFolderName   | mock文件夹名  | `grpc-mock` |
| port      | 端口号 | `50000` |
| rootPath     | `见下面rootPath参数`  |  |
| rootPathServerNameMap | `见下面rootPathServerNameMap参数`  |  |

### configFile rootPath参数属性（string 或 ProtoConfig 类型）
####  string 时，表示proto文件通过protobufjs生成的json文件,合并后root.json根文件的路径。  
- 文件格式如下：[root.json](./root.json)
    ```json
    {
        "serverName1": {
            
        },
        "serverName2": {
    
        }
    }
    ```
  serverName1，serverName2表示多个proto服务生成的json文件内容。
#### ProtoConfig 类型时，配置proto路径，程序自动生成root.json文件。

| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| grpcProtoServes    |  grpc 服务名，proto路径列表 `详细配置见ProtoConfig.grpcProtoServes` |  |
| protoResolvePath      | proto路径修正方法  | |
| loaderOptions  | proto loader 参数 `详细配置见`[proto-loader](https://hub.fastgit.org/grpc/grpc-node/blob/master/packages/proto-loader/README.md) | {defaults: true} |

- ProtoConfig.grpcProtoServes 参数属性
  
  类型：{ serverName: string; serverDir: string; }[]

  | 属性       | 说明             | 默认值      |
  | --------- | ---------------  | ---------- |
  | serverName | grpc 服务名 |  |
  | serverDir  | grpc 服务proto目录  | |

  - configFile rootPathServerNameMap参数属性

    类型：Record<string, string>
    - 格式：
    ```
    {
      serverName1: 'rename-serverName1',
      serverName2: 'rename-serverName2',
    }
    ```
    - rootPathServerNameMap参数对生成的[root.json](./root.json)grpc服务名重命名。


- configFile mock配置文件示例
```ts
import type { ConfigFileOptionsCLI } from '@liangskyli/mock';

const config: ConfigFileOptionsCLI = {
  rootPath: {
    grpcProtoServes: [
      { serverName: 'serverName1', serverDir: './src/proto-servers/server1' },
      { serverName: 'serverName2', serverDir: './src/proto-servers/server2' },
    ],
  },
  loaderOptions: {
    defaults: false,
    longs: String,
  },
};
export default config;
```

## 2、函数调用方式
- node命令调用自己写的文件（如：grpc-mock-gen.ts）
```base
node -r ts-node/register ./grpc-mock-gen.ts
```

```ts
import { grpcMockCodeGen } from '@liangskyli/mock';

grpcMockCodeGen({
  grpcMockDir: './',
  rootPath: {
    grpcProtoServes: [
      { serverName: 'serverName1', serverDir: './test/proto-servers/server1' },
      { serverName: 'serverName2', serverDir: './test/proto-servers/server2' },
    ],
  },
});
```

- grpcMockCodeGen 方法参数

| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| grpcMockDir  | mock文件夹所在目录  | `./` |
| grpcMockFolderName   | mock文件夹名  | `grpc-mock` |
| port      | 端口号 | `50000` |
| rootPath     | `和命令方式rootPath参数一致`  |  |
| rootPathServerNameMap | `和命令方式rootPathServerNameMap参数一致`  |  |
| configFilePath | 配置文件路径 `文件内配置参数和CLI 命令方式configFile一致`  |  |

## grpc mock server 启动方式:
## 1、CLI 命令方式（推荐，默认启用热更新）
```bash
yarn grpc-mock server-start -c ./mock.config.cli.ts
```

### 命令参数

| 参数       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| -c, --configFile  | mock配置文件 `配置参数和grpc mock 生成CLI命令方式一致`  |  |

## 2、函数调用方式（更加灵活）

```base
node -r ts-node/register --trace-warnings grpc-mock/index.ts
```

### 说明：
- 运行生成的grpc-mock文件夹下index.ts文件。
- 如需要热更新功能，可以使用CLI 命令方式 或 在命令脚本里使用ts-node-dev实现。

# Mock 数据修改指引
 
默认`/grpc-mock` 文件夹下所有文件为 grpc-mock 文件。

比如：

```bash
.
├── grpc-mock
    └── proto  // proto mock数据文件夹
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

- proto 数据修改，例如：在上图结构中 grpc-mock/proto/serverName1/ 下的文件里修改
   
```ts
  import type { IProtoItem } from '@liangskyli/mock';
  const ActivityService: IProtoItem = {
  path: 'serverName1.activity_package.ActivityService',
  implementationData: [
    {
      Create: {
        /** mock 正常响应数据 */
        response: {
          /** 活动名称 */
          activityName: 'activityName',
        },
        /** mock 多场景响应数据 */
        sceneData: [
          {
            requestCase: (request: any) => {
              // 命中逻辑，命中返回true
              return request.activityId === '10';
            },
            response: {
              /** 活动名称 */
              activityName: 'activityName',
            },
          },
        ],
      },
    },
    {
      Update: {
        response: {},
      },
    },
  ],
};
export default ActivityService;

```
- implementationData 数据结构，里面可以按格式要求，配置错误数据，响应数据，metadata数据，及多场景相关数据。
- 优先级error > response ， error > metadata
- sceneData 命中优先级 > 非命中优先级
```ts
export type IImplementationData = Record<
  string,
  {
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
    /** mock 多场景响应数据 */
    sceneData?: {
      /** mock 场景数据判断,返回true时使用该场景，匹配成功后，跳出匹配 */
      requestCase: (request: any) => boolean;
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
    }[];
  }
  >[];
```

- mock数据生成规则
  - number: 0
  - boolean: false
  - string: 'attributeName' //默认给属性名，longs为String时，要给数字，默认给1
  - 对象类型：对象里基础类型数据生成
  - 基础数组类型：生成第一个数组基础数据
  - 多维数组：proto目前不支持

## 引入 Mock.js

[Mock.js](http://mockjs.com/) 是常用的辅助生成模拟数据的三方库，借助他可以提升我们的 mock 数据能力。

比如：

```ts
import mockjs from 'mockjs';
import type { IProtoItem } from '@liangskyli/mock';
const ActivityService: IProtoItem = {
  path: 'serverName1.activity_package.ActivityService',
  implementationData: [
    {
      Create: {
        /** mock 正常响应数据 */
        response: {
          /** 活动名称 */
          activityName: mockjs.Random.string(3),
        },
        /** mock 多场景响应数据 */
        sceneData: [
          {
            requestCase: (request: any) => {
              // 命中逻辑，命中返回true
              return request.activityId === '10';
            },
            response: {
              /** 活动名称 */
              activityName: 'activityName',
            },
          },
        ],
      },
    },
    {
      Update: {
        response: {},
      },
    },
  ],
};
export default ActivityService;
```
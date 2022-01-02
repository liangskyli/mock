# grpc mock 生成方式:
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
| loaderOptions  | proto loader 参数 `详细配置见`[proto-loader](https://hub.fastgit.org/grpc/grpc-node/blob/master/packages/proto-loader/README.md) | {defaults: true} |
| prettierOptions | `生成文件格式化，默认取项目配置，该配置优先级更高，会合并覆盖项目prettier配置文件，如项目有prettier配置文件，这里无需配置，详情配置见` [prettier文档](https://github.com/prettier/prettier/blob/main/docs/options.md)  |  |

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
    longs: String,
  },
  prettierOptions: { singleQuote: true },
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
  prettierOptions: { singleQuote: true },
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
| configFilePath | 配置文件路径 `文件内配置参数和CLI 命令方式configFile里loaderOptions参数属性一致`  |  |
| prettierOptions | `生成文件格式化，默认取项目配置，该配置优先级更高，会合并覆盖项目prettier配置文件，如项目有prettier配置文件，这里无需配置，详情配置见` [prettier文档](https://github.com/prettier/prettier/blob/main/docs/options.md)  |  |

- mock数据生成规则
  - number: 0
  - boolean: false
  - string: 'attributeName' //默认给属性名，longs为String时，要给数字，默认给1
  - 对象类型：对象里基础类型数据生成
  - 基础数组类型：生成第一个数组基础数据
  - 多维数组：proto目前不支持
  
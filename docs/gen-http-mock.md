# http mock 生成方式:
## 1、CLI 命令方式（推荐）

```bash
yarn http-mock-gen -c ./mock.config.cli.ts
```

### 命令参数

| 参数       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| -c, --configFile  | mock数据生成配置文件 `配置参数见下面`  |  |

## 命令参数 configFile mock数据生成配置文件参数属性
| 属性       | 说明             | 默认值      |
| --------- | ---------------  | ---------- |
| openapiPath  | openapi v3 YAML or JSON 格式的文件路径,需要自己根据业务逻辑生成  | `./` |
| mockDir  | mock文件夹所在目录  | `./` |
| prettierOptions | `生成文件格式化，默认取项目配置，该配置优先级更高，会合并覆盖项目prettier配置文件，如项目有prettier配置文件，这里无需配置，详情配置见` [prettier文档](https://github.com/prettier/prettier/blob/main/docs/options.md)  |  |
| jsonSchemaFakerOptions     | `生成mock 数据 faker配置参数，详情配置见` [json-schema-faker options文档](https://github.com/json-schema-faker/json-schema-faker/blob/HEAD/docs/README.md#available-options)  | { alwaysFakeOptionals: true, fillProperties: false } |
| mockDataReplace | `生成mock 数据处理函数，可以覆盖faker数据` (this: any, key: string, value: any) => any  | undefined |

- configFile mock数据生成配置文件示例
```ts
import type { IGenMockDataOpts } from '@liangskyli/mock';

const config: IGenMockDataOpts = {
  mockDir: './',
  openapiPath: './openapi/openapiv3-example.json',
  jsonSchemaFakerOptions: {
    minItems: 1,
    maxItems: 1,
  },
  mockDataReplace: (key, value) => {
    if (typeof value === 'string') {
      return key;
    }
    if (typeof value === 'number') {
      return 0;
    }
    if (typeof value === 'boolean') {
      return false;
    }
    return value;
  },
};
export default config;

```

- openapi v3 YAML or JSON 格式的文件[示例](./openapiv3-example.json)，openapi需要自己根据业务逻辑生成。

- 生成mock 数据结构，最终使用interface-mock-data.ts文件

```bash
.
├── mock
    ├── interface-mock-data.ts // 生成最终的http mock 数据
    ├── mock-data.ts // 生成mock数据文件
    ├── schema.ts // ts类型文件生成json schema文件
    └── ts-schema.ts // openapi 生成ts类型文件
├── openapi
    ├── openapiv3-example.json // openapiv3 文件
```

生成的interface-mock-data.ts 文件，用于http mock 功能。
```ts
export default {
  'POST /v1/beta-round/delete': { retCode: 0, retMsg: 'retMsg' },
  'GET /v1/building/get-list': {
    retCode: 0,
    data: { blockList: [{ buildingName: 'buildingName', isBindErp: false }], isFuLi: false },
    retMsg: 'retMsg',
  },
};
```

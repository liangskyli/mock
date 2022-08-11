# http mock 代码生成工具

<p>
  <a href="https://www.npmjs.com/package/@liangskyli/http-mock-gen">
   <img alt="preview badge" src="https://img.shields.io/npm/v/@liangskyli/http-mock-gen?label=%40liangskyli%2Fhttp-mock-gen">
  </a>
</p>

- 基于openapi v3 生成 ts数据类型和http mock 数据代码。
- mock数据填充默认值，自定义mock数据支持按需配置，未配置使用默认值。
- ts接口类型文件生成
- 通用请求库接口调用文件生成

## 安装:

```bash
yarn add @liangskyli/http-mock-gen --dev
```

# 生成方式:

## 1、CLI 命令方式（推荐）

- 默认配置文件在运行目录下mock.config.ts

```bash
yarn http-mock-gen
```

- 配置文件别名mock.config2.ts

```bash
yarn http-mock-gen -c ./mock.config2.ts
```

- 注意：如果项目里tsconfig.json，module不是CommonJS，则要求配置ts-node节点

```json
{
  "ts-node": {
    "compilerOptions": {
      "allowJs": false,
      "module": "CommonJS"
    }
  }
}
```

### 命令参数

| 参数               | 说明                     | 默认值                |
|------------------|------------------------|--------------------|
| -c, --configFile | mock数据生成配置文件 `配置参数见下面` | `./mock.config.ts` |

## 命令参数 configFile mock数据生成配置文件参数属性 

- 类型：IGenMockDataOpts | IGenMockDataOpts[]

### IGenMockDataOpts 参数属性

| 属性                     | 说明                                                                                                                                                                                          | 类型                                                                                                                                     | 默认值                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| mockDir                | mock文件夹所在目录                                                                                                                                                                                 | `string`                                                                                                                               | `./`                                                   |
| jsonSchemaFakerOptions | 生成mock 数据 faker配置参数                                                                                                                                                                         | 详情配置见 [json-schema-faker options文档](https://github.com/json-schema-faker/json-schema-faker/blob/HEAD/docs/README.md#available-options) | `{ alwaysFakeOptionals: true, fillProperties: false }` |
| mockDataReplace        | 生成mock 数据处理函数，可以覆盖faker数据                                                                                                                                                                   | `(this: any, key: string, value: any) => any`                                                                                          | `undefined`                                            |
| openapiPath            | openapi v3 YAML or JSON 格式的文件路径,需要自己根据业务逻辑生成。如果使用routing-controllers，可以使用[@liangskyli/routing-controllers-openapi 工具生成openapi文件](https://github.com/liangskyli/routing-controllers-openapi) | `string`                                                                                                                               |                                                        |
| genTsDir               | 生成ts文件夹所在目录                                                                                                                                                                                 | `string`                                                                                                                               | `未设置时，默认mockDir配置目录下mock文件夹`                           |
| prettierOptions        | 生成文件格式化，默认取项目配置，该配置优先级更高，会合并覆盖项目prettier配置文件，如项目有prettier配置文件，这里无需配置                                                                                                                        | 详情配置见 [prettier文档](https://github.com/prettier/prettier/blob/main/docs/options.md)                                                     |                                                        |
| requestFilePath        | ajax请求库路径，默认使用axios,文件默认导出函数                                                                                                                                                                | `string`                                                                                                                               | `undefined`                                            |
| requestParamsType      | ajax请求库文件里导出的请求库方法入参类型定义名称（非默认导出）  `string`                                                                                                                                                 | undefined                                                                                                                              |
| requestQueryOmit       | ajax请求库里对公共get参数做了传入处理时，请求接口忽略get参数ts类型声明                                                                                                                                                   | `string[]`                                                                                                                             | `undefined`                                            |
| requestBodyOmit        | ajax请求库里对公共post参数做了传入处理时，请求接口忽略post参数ts类型声明                                                                                                                                                 | `string[]`                                                                                                                             | `undefined`                                            |

- configFile mock数据生成配置文件示例

```ts
import type { IGenMockDataOptsCLI } from '@liangskyli/http-mock-gen';

const config: IGenMockDataOptsCLI = [
  {
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
  }
];
export default config;

```

- openapi v3 YAML or JSON 格式的文件[示例](https://github.com/liangskyli/openapi-ts/blob/master/packages/openapi-gen-ts/docs/openapiv3-example.json) ，[openapi](https://www.openapis.org/) 需要自己根据业务逻辑生成。
- openapi v3 method 只支持 get post接口，只生成application/json响应数据
- 如果你的http接口使用routing-controllers,可以使用[@liangskyli/routing-controllers-openapi 工具生成openapi文件](https://github.com/liangskyli/routing-controllers-openapi)
- openpai 生成数据类型和接口使用说明，详见[使用说明](https://github.com/liangskyli/openapi-ts)
- 生成mock 数据结构，最终使用interface-mock-data.ts文件
- Mock 数据修改指引 [文档](docs/http-mock-modify-guide.md)
- 接口API使用指引 [文档](https://github.com/liangskyli/openapi-ts/blob/master/packages/openapi-gen-ts/docs/request-api-guide.md)

生成的interface-mock-data.ts 文件(不要手动修改这个文件)，用于http mock 功能。

```ts
// This file is auto generated by http-mock-gen, do not edit!
import type { Request, Response } from 'express';
import CustomData from './custom-data';
import { getMockData } from '@liangskyli/http-mock-gen';
import type { ICustomData, PartialAll } from '@liangskyli/http-mock-gen';
import type { IApi } from './schema-api/interface-api';

export default {
  'GET /v1/building/get-list': (req: Request, res: Response) => {
    type IData = IApi['/v1/building/get-list']['Response'];
    const data = (CustomData as ICustomData<PartialAll<IData>>)['/v1/building/get-list'];
    let json = getMockData<IData>(
      {
        retCode: 0,
        retMsg: 'retMsg',
        data: { isFuLi: false, blockList: [{ buildingName: 'buildingName', isBindErp: false }] },
      },
      req,
      data,
    );
    res.json(json);
  },
  'POST /v1/card/delete': (req: Request, res: Response) => {
    type IData = IApi['/v1/card/delete']['Response'];
    const data = (CustomData as ICustomData<PartialAll<IData>>)['/v1/card/delete'];
    let json = getMockData<IData>({ retCode: 0, retMsg: 'retMsg' }, req, data);
    res.json(json);
  },
};
```

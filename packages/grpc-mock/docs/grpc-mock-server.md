## grpc mock server 启动方式:

## 1、CLI 命令方式（推荐，默认启用热更新）

```bash
yarn grpc-mock server-start -c ./mock.config.cli.ts
```

### 命令参数

| 参数               | 说明                                   | 类型       | 默认值 |
|------------------|--------------------------------------|----------|-----|
| -c, --configFile | mock配置文件(配置参数和grpc mock 生成CLI命令方式一致) | `string` |     |

## 2、函数调用方式（更加灵活）
- 使用mockServerLoadScript方法

### mockServerLoadScript方法里IMockServerLoadScript参数

| 参数         | 说明                                   | 类型        | 默认值    |
|------------|--------------------------------------|-----------|--------|
| watch      | 是否监听mock文件改动                         | `boolean` | `true` |
| configFile | mock配置文件(配置参数和grpc mock 生成CLI命令方式一致) | `string`  | -      |

- 注意：
  - 支持热更新配置
  - 可以灵活使用程序代码调用

- 代码调用逻辑示例

```ts
import { mockServerLoadScript } from '@liangskyli/grpc-mock';

mockServerLoadScript({
  configFile: './test/grpc/mock.config.cli.ts',
});
```

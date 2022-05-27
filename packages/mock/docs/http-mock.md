## 环境变量
- 1、mockServer 调用方式
- 2、CLI 命令方式
- 3、中间件方式

| 环境变量        | 说明           | 类型        | 默认值    |
|-------------|--------------|-----------|--------|
| WATCH_FILES | 是否监听mock文件改动 | `boolean` | `true` |
| MOCK        | 是否需要使用mock服务 | `boolean` | `true` |

## 使用方式:

## 1、mockServer 调用方式

### mockServer函数参数
| 参数   | 说明             | 类型          | 默认值 |
|------|----------------|-------------|-----|
| opts | mockServer配置参数 | `见下面opts参数` |     |

### mockServer opts参数属性
| 属性           | 说明                | 类型                                          | 默认值         |
|--------------|-------------------|---------------------------------------------|-------------|
| mockDir      | mock文件夹所在目录       | `string`                                    | `./`        |
| exclude      | 用于忽略不需要走 mock 的文件 | `Array(string) 如：['mock/a.ts','mock/b.ts']` |             |
| hostname     | 服务器地址             | `string`                                    | `0.0.0.0`   |
| port         | 端口号               | `number`                                    | `8001`      |
| watch        | 是否监听mock文件改动      | `boolean`                                   | `true`      |
| socketConfig | socket.io 配置      | `见下面socketConfig参数`                         | `undefined` |

### mockServer opts socketConfig参数属性
| 属性                | 说明                                                  | 类型                                                            | 默认值 |
|-------------------|-----------------------------------------------------|---------------------------------------------------------------|-----|
| enable            | mock是否开启                                            | `boolean`                                                     |     |
| opts              | SocketServer 配置                                     | `详细配置见`[socket.io](https://socket.io/docs/v4/server-options/) |     |
| mockControllerUrl | socket mock server 逻辑入口代码路径 `使用用相对路径时，相对于mockDir路径` | `string`                                                      |     |

- mockServer 例子
```ts
import mockServer from '@liangskyli/mock';

mockServer({ port: 9001, hostname: '0.0.0.0' });
```
- [mockServer socket 例子](mock-server-socket.md)

## 2、CLI 命令方式

### 命令参数

| 参数                | 说明                                                    | 类型        | 默认值       |
|-------------------|-------------------------------------------------------|-----------|-----------|
| -d, --dir         | mock文件夹所在目录                                           | `string`  | `./`      |
| -e, --exclude     | 用于忽略不需要走 mock 的文件 `多个路径用英文逗号分割，如：mock/a.ts,mock/b.ts` | `string`  |           |
| -host, --hostname | 服务器地址                                                 | `string`  | `0.0.0.0` |
| -p, --port        | 端口号                                                   | `number`  | `8001`    |
| -w, --watch       | 是否监听mock文件改动                                          | `boolean` | `true`    |
| -c, --configFile  | mock配置文件                                              | `配置参数见下面` |           |

## 命令参数 configFile mock配置文件参数属性

| 属性           | 说明                                              | 类型                  | 默认值       |
|--------------|-------------------------------------------------|---------------------|-----------|
| mockDir      | mock文件夹所在目录                                     | `string`            | `./`      |
| exclude      | 用于忽略不需要走 mock 的文件 `如：['mock/a.ts','mock/b.ts']` | `string[]`          |           |
| hostname     | 服务器地址                                           | `string`            | `0.0.0.0` |
| port         | 端口号                                             | `number`            | `8001`    |
| watch        | 是否监听mock文件改动                                    | `boolean`           | `true`    |
| socketConfig | socket.io 配置                                    | `见下面socketConfig参数` |           |

### configFile socketConfig参数属性

- 注意：配置文件配置参数优先级高于命令参数。

| 属性                | 说明                                                 | 类型                                                            | 默认值 |
|-------------------|----------------------------------------------------|---------------------------------------------------------------|-----|
| enable            | mock是否开启                                           | `boolean`                                                     |     |     |
| opts              | SocketServer 配置                                    | `详细配置见`[socket.io](https://socket.io/docs/v4/server-options/) |     |     |
| mockControllerUrl | socket mock server 逻辑入口代码路径`使用用相对路径时，相对于mockDir路径` | `string`                                                      |     |     |

- mock http接口例子
    - 监听mock文件改动

      ```bash
      yarn mock-server -p 8001
      ```
      
    - 不监听mock文件改动

    ```bash
    yarn cross-env WATCH_FILES=false mock-server -p 8001
    ```

- [CLI mock 配置文件, mock socket 例子](cli-mock-socket.md)


## 3、中间件方式

> 迁入已有的express服务或webpack-dev-server服务中

### getMiddleware函数参数

| 参数   | 说明                    | 类型          | 默认值 |
|------|-----------------------|-------------|-----|
| opts | getMockMiddleware配置参数 | `见下面opts参数` |     |

### getMiddleware opts参数属性

| 属性      | 说明                                              | 类型         | 默认值    |
|---------|-------------------------------------------------|------------|--------|
| mockDir | mock文件夹所在目录                                     | `string`   | `./`   |
| exclude | 用于忽略不需要走 mock 的文件 `如：['mock/a.ts','mock/b.ts']` | `string[]` |        |
| watch   | 是否监听mock文件改动                                    | `boolean`  | `true` |

### getMiddleware异步方法返回中间件middleware

| 异步返回属性            | 说明                                                         | 
|-------------------|------------------------------------------------------------|
| middleware        | express中间件 `可用于express服务或webpack-dev-server服务中`            |
| middlewareWatcher | express中间件件文件听器 `用于socket mock Server 的initSocketServer方法` |


- express服务
    - [http mock](express-mock.md)
    - [socket mock](express-mock-socket.md)


- webpack-dev-server服务
    - [http mock](webpack-mock.md)
    - [socket mock](webpack-mock-socket.md)

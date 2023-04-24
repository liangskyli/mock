## grpc mock server 启动方式:

## 1、CLI 命令方式（推荐，默认启用热更新）

```bash
yarn grpc-mock server-start -c ./mock.config.cli.ts
```

### 命令参数

| 参数               | 说明       | 类型                           | 默认值 |
|------------------|----------|------------------------------|-----|
| -c, --configFile | mock配置文件 | `配置参数和grpc mock 生成CLI命令方式一致` |     |

## 2、函数调用方式（更加灵活）

- 注意：
  - 如果使用ts-node，需要手动安装
  - 可以灵活使用程序代码调用

```base
node -r ts-node/register --trace-warnings grpc-mock/index.ts
```

### 说明：

- 运行生成的grpc-mock文件夹下index.ts文件。
- 如需要热更新功能，可以使用CLI 命令方式 或 在命令脚本里使用ts-node-dev实现。

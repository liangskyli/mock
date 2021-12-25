# 多种Mock服务提供MOCK数据，总有一种方式适合你。

> Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发独立自主，不会被服务端的开发所阻塞。全面支持http，socket，grpc接口。支持mock数据更改时热更新获取新数据，支持Mock数据自动生成和自定义场景化数据能力。

## 安装:
```bash
yarn add @liangskyli/mock --dev
```
## mock 场景

### http 或 socket mock
> 提供http，socket接口的mock服务功能，mock数据场景化手动编写。支持mock数据更改时热更新获取新数据。

- 包含 http 和 socket 的mock功能
- [文档](docs/http-mock.md)
### grpc mock
> 提供grpc mock数据自动生成和mock服务启动功能，减轻手动编写mock数据代码，mock数据填充默认值。支持mock数据更改时热更新获取新数据。

- 基于node.js 实现 grpc mock 服务
- [文档](docs/grpc-mock.md)

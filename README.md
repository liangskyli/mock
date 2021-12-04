# 多种Mock服务方式提供MOCK数据，总有一种方式适合你

> Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发独立自主，不会被服务端的开发所阻塞。支持http和socket接口。支持mock数据更改时热更新修改。

## 安装:
```bash
yarn add @liangskyli/mock --dev
```
## mock 场景
### http/socket mock
- 包含 http 和 socket 的mock功能
- [文档](docs/http-mock.md)
### grpc mock
- 基于node.js 实现 grpc mock 服务
- [文档](docs/grpc-mock.md)

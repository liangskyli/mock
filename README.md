# 多种Mock服务提供MOCK数据，总有一种方式适合你。

<p>
  <a href="https://github.com/liangskyli/mock/releases">
    <img alt="preview badge" src="https://img.shields.io/github/v/release/liangskyli/mock">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/grpc-mock">
   <img alt="preview badge" src="https://img.shields.io/npm/v/@liangskyli/grpc-mock?label=%40liangskyli%2Fgrpc-mock">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/http-mock-gen">
   <img alt="preview badge" src="https://img.shields.io/npm/v/@liangskyli/http-mock-gen?label=%40liangskyli%2Fhttp-mock-gen">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/mock">
   <img alt="preview badge" src="https://img.shields.io/npm/v/@liangskyli/mock?label=%40liangskyli%2Fmock">
  </a>
</p>

> Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发独立自主，不会被服务端的开发所阻塞。全面支持http，socket，grpc接口。支持mock数据更改时热更新获取新数据，支持Mock数据自动生成和自定义场景化数据能力。

## mock 场景

### 1、http 或 socket mock服务
> 提供http，socket接口的mock服务功能，mock数据场景化手动编写。支持mock数据更改时热更新获取新数据。

### 安装:
```bash
yarn add @liangskyli/mock --dev
```

- Mock 数据修改指引 [文档](packages/mock/docs/mock.md)
- 包含 http 和 socket 的mock功能 [文档](packages/mock/docs/http-mock.md)

### 1.1 http mock 代码生成工具
> 提供http mock数据自动生成功能，减轻手动编写mock数据代码，mock数据填充默认值。<br/>
> 支持生成数据和自定义数据分离。

### 安装:
```bash
yarn add @liangskyli/http-mock-gen --dev
```

如果项目没有安装prettier，需要安装prettier(^2.0.0 || ^3.0.0)
```bash
yarn add prettier --dev
```

- [文档](packages/http-mock-gen/README.md)



### 2、grpc mock
> 提供grpc mock数据自动生成和mock服务启动功能，减轻手动编写mock数据代码，mock数据填充默认值。<br/>
> 支持生成数据和自定义数据分离。<br/>
> 支持mock数据更改时热更新获取新数据。

### 安装:
```bash
yarn add @liangskyli/grpc-mock --dev
```

如果项目没有安装prettier，需要安装prettier(^2.0.0 || ^3.0.0)
```bash
yarn add prettier --dev
```

- 基于node.js 实现 grpc mock 数据生成 [文档](packages/grpc-mock/docs/gen-grpc-mock.md)
- Mock 数据修改指引 [文档](packages/grpc-mock/docs/grpc-mock-modify-guide.md)
- 基于node.js 实现 grpc mock 服务 [文档](packages/grpc-mock/docs/grpc-mock-server.md)

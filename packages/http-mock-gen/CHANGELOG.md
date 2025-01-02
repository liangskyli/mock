# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.6](https://github.com/liangskyli/mock/compare/v4.0.5...v4.0.6) (2025-01-02)


### Bug Fixes

* node engines from 16.10.0 to 16.0.0 ([243466c](https://github.com/liangskyli/mock/commit/243466cadcfa813add8e99bc759b7dd43e44dfa8))



## [4.0.4](https://github.com/liangskyli/mock/compare/v4.0.3...v4.0.4) (2024-09-30)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [4.0.1](https://github.com/liangskyli/mock/compare/v4.0.0...v4.0.1) (2024-08-03)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [4.0.0](https://github.com/liangskyli/mock/compare/v4.0.0-beta.0...v4.0.0) (2024-02-28)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [4.0.0-beta.0](https://github.com/liangskyli/mock/compare/v3.2.0-beta.0...v4.0.0-beta.0) (2024-02-26)


### ⚠ BREAKING CHANGES

* **http-mock-gen:** generator file structure change in type,request and mock data

### Features

* **http-mock-gen:** same url mock data get first method ([a710094](https://github.com/liangskyli/mock/commit/a7100949f322be7e04b2223167951ce7ab0714ba))
* **http-mock-gen:** update @liangskyli/openapi-gen-ts, support mock data same url multiple method ([6d798fb](https://github.com/liangskyli/mock/commit/6d798fbb57e3cdd9041b6e0bdac5785acd1f13bd))



## 3.2.0-beta.0 (2023-12-10)

* feat: http-mock-gen and utils package add "type": "module" as default ([e616e6f](https://github.com/liangskyli/mock/commit/e616e6f))





## 3.1.0 (2023-12-03)

* chore: upgrade dependencies ([f6251cd](https://github.com/liangskyli/mock/commit/f6251cd))
* chore: vitest file rename ([952e3ff](https://github.com/liangskyli/mock/commit/952e3ff))
* docs: update doc ([4600742](https://github.com/liangskyli/mock/commit/4600742))
* docs: update doc ([9553979](https://github.com/liangskyli/mock/commit/9553979))
* feat: add defineConfig config support ts type ([19dcae9](https://github.com/liangskyli/mock/commit/19dcae9))





## [3.0.1](https://github.com/liangskyli/mock/compare/v3.0.0...v3.0.1) (2023-10-21)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [3.0.0](https://github.com/liangskyli/mock/compare/v3.0.0-beta.1...v3.0.0) (2023-07-15)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [3.0.0-beta.1](https://github.com/liangskyli/mock/compare/v3.0.0-beta.0...v3.0.0-beta.1) (2023-07-15)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [3.0.0-beta.0](https://github.com/liangskyli/mock/compare/v2.1.0...v3.0.0-beta.0) (2023-07-12)


### Bug Fixes

* prettier V3 prettierOptions type use any ([42b818d](https://github.com/liangskyli/mock/commit/42b818d6e96165f7847733f3ae4f1cec54a008cd))



## [2.1.0](https://github.com/liangskyli/mock/compare/v2.0.0...v2.1.0) (2023-06-05)


### Features

* **http-mock-gen:** generate interface-mock-data.ts method toUpperCase for express method ([698ec95](https://github.com/liangskyli/mock/commit/698ec95babf5199fcac36dbbbeec115a0f58a7b4))
* **http-mock-gen:** support router path interface-mock-data.ts generator ([b21b5f3](https://github.com/liangskyli/mock/commit/b21b5f341ffce432636e350db903d2f1e904afca))
* **http-mock-gen:** use json-schema-faker and @liangskyli/openapi-gen-ts@1.1.0 support swagger2 ([5dcd03e](https://github.com/liangskyli/mock/commit/5dcd03e8c56ec958c62b7316453c7b947e29886a))



## [2.0.0](https://github.com/liangskyli/mock/compare/v2.0.0-beta.5...v2.0.0) (2023-05-13)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [2.0.0-beta.5](https://github.com/liangskyli/mock/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2023-05-13)


### Features

* support Request,Response type export for pnpm use ([5a6f931](https://github.com/liangskyli/mock/commit/5a6f9318932c2798f02e539f7751e96d913adb34))


### Bug Fixes

* **http-mock-gen:** mock data,simple array data merge error ([c6e4053](https://github.com/liangskyli/mock/commit/c6e40531a15f62a45ad9aedad91719f31d59bcb9))



## [2.0.0-beta.4](https://github.com/liangskyli/mock/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2023-05-07)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [2.0.0-beta.3](https://github.com/liangskyli/mock/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2023-05-02)

**Note:** Version bump only for package @liangskyli/http-mock-gen





## [2.0.0-beta.2](https://github.com/liangskyli/mock/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2023-05-01)


### ⚠ BREAKING CHANGES

* prettierData change async to sync
* requestFilePath and requestParamsType configuration change to requestFile

### Features

* **http-mock-gen:** support all openapi method and responseMediaType ([de557e5](https://github.com/liangskyli/mock/commit/de557e5c48c9352df080c1feadeafd9326cc05e4))
* upgrade @liangskyli/openapi-gen-ts ([87ad6c3](https://github.com/liangskyli/mock/commit/87ad6c356f2bd3ded066ba3aecb6f431db6583c8))


### Bug Fixes

* generator custom-data-template(grpc-mock,htp-mock-gen) ([4c56b0f](https://github.com/liangskyli/mock/commit/4c56b0f7fd40d33ddfab4d638f334b072f2d80c0))


### Code Refactoring

* prettierData change async to sync ([15ff688](https://github.com/liangskyli/mock/commit/15ff688131f8a21ba86be69edea0dc4f88844f2d))



## [2.0.0-beta.1](https://github.com/liangskyli/mock/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2023-04-25)


### ⚠ BREAKING CHANGES

* drop support for Node 14, now support >=16.10.0

### Bug Fixes

* **http-mock-gen:** bin file bug ([e03cbaf](https://github.com/liangskyli/mock/commit/e03cbafadc3b3985e5be362e241a09ada3e7052d))


### Miscellaneous Chores

* drop support for Node 14 ([8f825b2](https://github.com/liangskyli/mock/commit/8f825b27fed596f7a9e5ab10b2265a75bdcb6504))



## [2.0.0-beta.0](https://github.com/liangskyli/mock/compare/v1.6.0...v2.0.0-beta.0) (2023-04-24)


### Features

* add register, move cross-spawn,ts-node to devDependencies ([ad2c90d](https://github.com/liangskyli/mock/commit/ad2c90db6f288fdff18e63850d46b51e5040a006))
* move json-schema-faker deprecated api to new api ([0923bf3](https://github.com/liangskyli/mock/commit/0923bf31309169c2c42776ea5b883c743ba9b307))



## [1.6.0](https://github.com/liangskyli/mock/compare/v1.5.0...v1.6.0) (2023-02-25)


### Features

* prettierOptions type use @liangskyli/utils IPrettierOptions type ([c6a7295](https://github.com/liangskyli/mock/commit/c6a72959bba638d2630a1149fd69405ee47ac731))



## [1.5.0](https://github.com/liangskyli/mock/compare/v1.4.0...v1.5.0) (2022-12-03)

### Features

- **http-mock-gen:** add the prefix of the mock interface URL address ([806c942](https://github.com/liangskyli/mock/commit/806c942342b749be6d7c7060635ffcf83f2e5f5d))

## [1.4.0](https://github.com/liangskyli/mock/compare/v1.3.0...v1.4.0) (2022-10-04)

### Features

- **http-mock-gen:** support CLI config file default vale ([fbc7b3b](https://github.com/liangskyli/mock/commit/fbc7b3bf0af9d7f7ebf4b19e8d64e9945a6c05af))

## [1.3.0](https://github.com/liangskyli/mock/compare/v1.2.1...v1.3.0) (2022-08-10)

### Features

- **http-mock-gen:** support CLI config multiple IGenMockDataOpts type ([8353f44](https://github.com/liangskyli/mock/commit/8353f44f0e5c523d847bb07bbbead6c28bc896ef))

## [1.2.1](https://github.com/liangskyli/mock/compare/v1.2.0...v1.2.1) (2022-07-10)

### Features

- upgrade dependencies and fix @liangskyli/openapi-gen-ts post method query data err ([373db5f](https://github.com/liangskyli/mock/commit/373db5fb1d7c7bc3c8d6d1d71c5da69aa6a728ea))

## [1.2.0](https://github.com/liangskyli/mock/compare/v1.1.3...v1.2.0) (2022-07-02)

### Features

- **http-mock-gen:** mock response support function,now can support dynamic data generation ([891d135](https://github.com/liangskyli/mock/commit/891d1352e514f59a5a943bbf11ac927d8db622e0))
- **mock:** support text/plain media type ([3f5b568](https://github.com/liangskyli/mock/commit/3f5b56844fb3343e0bd0f85c69eee60a616e6e52))

## [1.1.3](https://github.com/liangskyli/mock/compare/v1.1.2...v1.1.3) (2022-06-19)

### Bug Fixes

- merge custom undefined to target data ([2a1d83f](https://github.com/liangskyli/mock/commit/2a1d83f1983ad24d7ccdb27b33b95208f443afa6))

## [1.1.1](https://github.com/liangskyli/mock/compare/v1.1.0...v1.1.1) (2022-06-02)

**Note:** Version bump only for package @liangskyli/http-mock-gen

## [1.1.0](https://github.com/liangskyli/mock/compare/v1.0.0...v1.1.0) (2022-05-28)

### Features

- console colors show ([614a473](https://github.com/liangskyli/mock/commit/614a4738612f471598263e562d14fce5c215c17b))
- console colors show for update @liangskyli/openapi-gen-ts ([52c6559](https://github.com/liangskyli/mock/commit/52c655939e862b8af6b9f9b778c4d2dc2f5ba88d))
- **http-mock-gen:** optimization ts type ([8f7c5d5](https://github.com/liangskyli/mock/commit/8f7c5d5a76b00dbb666c6981c2a08659b7239ce1))
- optimization ts type and code ([d48f9ce](https://github.com/liangskyli/mock/commit/d48f9ce9c9921a961fc8bcba54c328643cdb5abb))

## [1.0.0](https://github.com/liangskyli/mock/compare/v1.0.0-beta.0...v1.0.0) (2022-05-15)

**Note:** Version bump only for package @liangskyli/http-mock-gen

## [1.0.0-beta.0](https://github.com/liangskyli/mock/compare/v0.12.0...v1.0.0-beta.0) (2022-05-15)

### Features

- **http-mock-gen:** openapi to typescript gen move to @liangskyli/openapi-gen-ts ([ca4de4a](https://github.com/liangskyli/mock/commit/ca4de4aa4c64530ec47c14d1382642f5bfe5ce9d))

## [0.12.0](https://github.com/liangskyli/mock/compare/v0.11.0...v0.12.0) (2022-04-24)

### Features

- **http-mock-gen:** enhance custom data gen and mock data intellect merge ([13acb4e](https://github.com/liangskyli/mock/commit/13acb4ef7131a9e0f133da0f983c26ffc72e0ecb))
- **http-mock-gen:** support interface type omit global query/body parameter by gen ([02e0d41](https://github.com/liangskyli/mock/commit/02e0d41df5430d05b8b9602a8991db16f7419f42))

### Bug Fixes

- sceneData type use interface replace type ([e7a94d3](https://github.com/liangskyli/mock/commit/e7a94d3bb2886da2485ab887366fd502ab6ce871))

## [0.11.0](https://github.com/liangskyli/mock/compare/v0.10.0-beta.1...v0.11.0) (2022-04-17)

### Features

- **http-mock-gen:** gen interface-api ts type file and mock data add ts type ([a029d2c](https://github.com/liangskyli/mock/commit/a029d2c4e599d3ccc93591ee9cecc02144d87e39))
- **http-mock-gen:** gen request-api ts file and support customer ajax request ([5811655](https://github.com/liangskyli/mock/commit/58116559661f14b604a24814c5762da7c638575a))

## [0.10.0-beta.1](https://github.com/liangskyli/mock/compare/v0.10.0-beta.0...v0.10.0-beta.1) (2022-04-04)

**Note:** Version bump only for package @liangskyli/http-mock-gen

## [0.10.0-beta.0](https://github.com/liangskyli/mock/compare/v0.9.1-beta.0...v0.10.0-beta.0) (2022-04-04)

### Features

- http-mock-gen support separation of custom data and generated data ([585e59d](https://github.com/liangskyli/mock/commit/585e59db3ccf208203087751e1db27b627d6d0f9))
- **mock:** custom-data-template modify ([a836707](https://github.com/liangskyli/mock/commit/a8367071a6feee715f0cb9f5c843e96e00902652))

### [0.9.1-beta.0](https://github.com/liangskyli/mock/compare/v0.9.0...v0.9.1-beta.0) (2022-02-25)

**Note:** Version bump only for package @liangskyli/http-mock-gen

## [0.9.0](https://github.com/liangskyli/mock/compare/v0.9.0-beta.5...v0.9.0) (2022-01-27)

**Note:** Version bump only for package @liangskyli/http-mock-gen

## [0.9.0-beta.0](https://github.com/liangskyli/mock/compare/v0.8.1...v0.9.0-beta.0) (2022-01-27)

**Note:** Version bump only for package @liangskyli/http-mock-gen

### [0.8.1](https://github.com/liangskyli/mock/compare/v0.8.0...v0.8.1) (2022-01-22)

### Bug Fixes

- ts-node devDependencies to dependencies ([c43e611](https://github.com/liangskyli/mock/commit/c43e611ca86e7211750dc37b5ea06729248bb1c5))

## [0.8.0](https://github.com/liangskyli/mock/compare/v0.8.0-beta.0...v0.8.0) (2022-01-14)

**Note:** Version bump only for package @liangskyli/http-mock-gen

## [0.8.0-beta.0](https://github.com/liangskyli/mock/compare/v0.7.0...v0.8.0-beta.0) (2022-01-13)

**Note:** Version bump only for package @liangskyli/http-mock-gen

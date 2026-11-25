<div align="center">
  <a href="https://oiyo.js.org">
    <img alt="Oiyo logo" src="./.github/assets/logo.png" width="128">
  </a>

  <h1>Oiyo Standard</h1>
</div>

<p align="center">由 <a href="https://oiyo.js.org">Oiyo</a> 官方维护的标准起手模板，一个只保留框架约定的极简工程</p>

## 🍊 介绍

**Oiyo Standard** 是 Oiyo 的「最佳模板」，也是其他衍生模板的基线。它不捆绑 UI 库与业务方案，只把页面元信息、布局、中间件、自动导入、请求与状态这些框架约定落在一个最小可运行的工程里。

## ✨ 特性

- **根上下文** — 在 `App.vue` 中通过 `defineRootContext()` 集中声明应用级状态与方法，任意页面可经 `useRootContext()` 取用
- **约定式页面** — 页面内 `definePageMeta()` 声明标题、布局、Tab 与中间件，自动生成路由与 `pages.json`
- **布局系统** — `layouts/` 下按需定义布局，页面用 `layout` 元信息切换，`layout: false` 可关闭布局
- **路由中间件** — 全局中间件与具名中间件并用，内置登录拦截示例，未登录跳转登录页并携带 `redirect` 回跳
- **自动导入** — 页面宏、Vue / UniApp API、组件、组合式函数、`apis`、`stores`、`utils`、`types` 按配置扫描，少写 import
- **HTTP 请求层** — 基于 `http.create()` 的请求客户端，支持请求 / 响应 / 错误钩子，并可扩展自定义请求参数
- **状态管理** — Pinia 搭配内置持久化插件，支持按 key、按状态路径、多存储实例持久化
- **自动分包** — `src/packages/` 约定即原生 `subPackages`，优化小程序包体积
- **暗色主题** — `useSystemDark()` 实时跟随系统主题
- **原子化样式** — 基于 uni-unocss，零运行时、按需生成
- **TypeScript** — 全量类型定义与自动生成的类型提示
- **AI 友好** — 内置 `.agents/skills`，便于 Agent 理解项目约定与迁移方式

## 🚀 快速开始

### 1. 环境要求

- Node.js `>=20.19.0 || >=22.12.0`
- 包管理器推荐 pnpm `10.x`

### 2. 创建项目

```bash
# 如果没有 pnpm 可以通过 npm i -g pnpm 安装。
pnpm create oiyo --template=standard
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 开发 / 构建

```bash
# 交互式选择目标平台（H5 / 微信小程序 / App 等）
pnpm dev
pnpm build

# 指定 test 模式构建
pnpm build:test

# 类型检查
pnpm typecheck
```

环境变量集中在 `.env`、`.env.development`、`.env.test`、`.env.production`，其中 `VITE_API_URL` 等字段按环境切换。

## 📖 文档

强烈建议阅读文档，进一步挖掘框架能力：

- Oiyo 官方文档：[oiyo.js.org/docs](https://oiyo.js.org/docs)

## 🧩 模板选择

| 模板                                                                    | 说明                                                   | 创建命令                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------- |
| **standard**（当前）                                                    | 极简基线，只保留框架约定                               | `pnpm create oiyo --template=standard`    |
| [unibest](https://github.com/skiyee/oiyo-starters/tree/unibest)         | 融合 unibest 最佳实践，内置鉴权、国际化、自定义 TabBar | `pnpm create oiyo --template=unibest`     |
| [wot-starter](https://github.com/skiyee/oiyo-starters/tree/wot-starter) | 接入 Wot UI 2.x，含状态持久化与图表示例                | `pnpm create oiyo --template=wot-starter` |

## 💞 社群

我们提供社群，让每一个开发者都能参与最直接的交流：

- QQ群：[246107301](https://qm.qq.com/q/iVPctWtKQS)

  <img src="./.github/assets/qq-qrcode-1.png" alt="Qiyo 交流群" width="280">

## 💝 关于

作者: **sky [Skiyee]** - 切图仔、全干攻城猫、轮子砖家

| 平台      | 链接                                             |
| --------- | ------------------------------------------------ |
| 🌐 官网   | [oiyo.js.org](https://oiyo.js.org/)              |
| 🐧 QQ     | [319619193](https://oiyo.js.org/)                |
| 🗻 掘金   | [skiyee](https://juejin.cn/user/300614247782265) |
| 💬 公众号 | 微信搜「天空言码」或扫码关注 ↓                   |

<img src="./.github/assets/wechat-qrcode-1.png" alt="公众号二维码" width="360">

## 💖 赞赏

<p align="center">
  <a href="https://github.com/skiyee/sponsors">
    <img alt="sponsors" src="https://cdn.jsdelivr.net/gh/skiyee/sponsors@main/oiyo-sponsors.svg"/>
  </a>
</p>

## 🔗 外链

- [Oiyo 专栏 - 掘金](https://juejin.cn/column/7663486605853229102)

## ⚖️ 许可

[Oiyo 许可协议](./LICENSE) © 2026-PRESENT [sKy (skiyee)](https://github.com/skiyee)

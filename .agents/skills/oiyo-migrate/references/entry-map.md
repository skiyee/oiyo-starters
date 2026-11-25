# 入口与符号对照（0.8.x → 1.0.0）

## 包与入口

| 0.8.x | 1.0.0 | 说明 |
| --- | --- | --- |
| `@skiyee/oiyo` | `oiyo` | 根入口 = `@oiyo/schema` + `@oiyo/plugin` + `@oiyo/runtime` |
| `@skiyee/oiyo/config` | `oiyo/config` | 只剩 `define*Config` 与 `OiyoConfig` / `PagesConfig` / `ManifestConfig` / `DefineOiyoConfig` / `DefinePagesConfig` / `DefineManifestConfig` |
| （无） | `oiyo/schema` | `@oiyo/schema` 全量转发：配置类型、`OiyoConfigSchema`、`createDefaultConfig`、`resolveOiyoConfig`、`DEFAULT_EXCLUDE` |
| `@skiyee/oiyo/plugin` | `oiyo/plugin` | 默认导出和具名 `OiyoPlugin` 都在；返回值是 `Plugin[]`，`plugins: [OiyoPlugin()]` 可直接使用 |
| `@skiyee/oiyo/global` | `oiyo/runtime` | `/global` 入口已删除 |
| `@skiyee/oiyo/runtime` | `oiyo/runtime` | 符号不变，继续转发 Vue 与 `@dcloudio/uni-app` API |
| `@skiyee/oiyo/types` | `oiyo/types` | 仅类型入口；`.oiyo/oiyo.d.ts` 由 CLI 自动改写 |
| `@oiyo/core` | `oiyo/runtime` / `oiyo/schema` | 客户端 API 在 runtime，配置在 schema |
| `@oiyo/config` | `oiyo/config` / `oiyo/schema` | `define*Config` 在 config，其余在 schema |
| `@oiyo/framework` | `oiyo/runtime` | http、路由中间件、Vue 与 uni-app API 都在 runtime |
| `@oiyo/framework/oiyo` | `oiyo/runtime` | http、中间件 |
| `@oiyo/framework/vue` | `oiyo/runtime` | Vue API |
| `@oiyo/framework/uni` | `oiyo/runtime` | `@dcloudio/uni-app` API |
| `@oiyo/framework/types` | `oiyo/types` | |
| `@oiyo/plugin` | `oiyo/plugin` | 内部包不再单独发布 |
| `@oiyo/cli` | `oiyo`（bin） | 内部包不再单独发布；`oiyo` / `uni` 两个 bin 由 `oiyo` 提供 |
| `@oiyo/uni-app`、`@oiyo/uni` | `@oiyo/uniapp` | 仅 1.0.0 预发布用户会遇到 |
| `@oiyo/uni-app/config`、`@oiyo/uni/config` | `@oiyo/uniapp/config` | |
| `@oiyo/uni-app/runtime`、`@oiyo/uni/runtime` | `@oiyo/uniapp/runtime` | |
| `@oiyo/uni-app/plugin`、`@oiyo/uni/plugin` | `@oiyo/uniapp/plugin` | |

## 类型与值

| 旧来源 | 符号 | 新来源 |
| --- | --- | --- |
| `@skiyee/oiyo/global`、`@skiyee/oiyo` | `PageMeta` | `oiyo/runtime` |
| `@skiyee/oiyo/global`、`@skiyee/oiyo` | `definePageMeta`、`defineRootContext`、`useRootContext`、`OiyoPage`、`OiyoLayout` | `oiyo/runtime` |
| `@skiyee/oiyo/config` | `PagesJson`、`Page`、`GlobalStyle`、`TabBarItem`、`SubPackage`、`ManifestJson` 等结构类型 | `@oiyo/uniapp/config` |
| `@skiyee/oiyo/config` | `PagesConfig`、`ManifestConfig`、`OiyoConfig` | `oiyo/config`（或 `oiyo/schema`） |
| `@skiyee/oiyo/config` | `ApiScanTarget` | `ApisOptions`（`oiyo/schema`） |
| `@skiyee/oiyo/config` | `ComponentScanTarget` | `ComponentsOptions`（`oiyo/schema`） |
| `@skiyee/oiyo/config` | `OiyoConfigScan` | `ScanOptions`（`oiyo/schema`） |
| `@skiyee/oiyo/config` | `OiyoConfigCI` | `CIOptions`（`oiyo/schema`） |
| `@skiyee/oiyo/config` | `OiyoConfigDir`、`OiyoConfigIDE`、`IDEPlatformPath`、`GlobRule`、`OnlyPickNameItem` | 不再单独导出：目录/IDE 形状内联在 `OiyoConfig`，其余用 `OnlyPickOptions` 等新名字（`oiyo/schema`） |
| `@skiyee/oiyo/config` | `defaultConfig` | 已移除 → `createDefaultConfig()`（`oiyo/schema`） |
| `@skiyee/oiyo/config` | `resolveOiyoConfig`、`DEFAULT_EXCLUDE` | `oiyo/schema` |
| `@skiyee/oiyo/runtime` | `createHttp`、`http`、`HttpError`、`isHttpError`、`createHttpAborter`、`UniAppAdapter`、`defineRouteMiddleware`、`goTo`、`abortNavigation`、`createOiyoMiddleware`、`toMiddlewareEntries` 及 Http/Route 类型 | `oiyo/runtime`（符号不变） |

## 模块增强

```ts
// 0.8.x
declare module '@skiyee/oiyo/global' {
  interface PageMeta {
    auth?: boolean
  }
}

// 1.0.0
declare module 'oiyo/runtime' {
  interface PageMeta {
    auth?: boolean
  }
}
```

根上下文类型增强同样写到 `oiyo/runtime`。`defineRootContext<SomeExportedType>` 且类型从 `App.vue` 导出时，`.oiyo/types/root.d.ts` 会自动生成增强，无需手写。

## 容易漏掉的位置

- `vite.config.*` 的插件导入。
- `oiyo.config.*`、`pages.config.*`、`manifest.config.*` 的 `define*Config` 导入。
- `main.ts` 里的 `app.use(oiyoMiddleware)` 相关导入（若显式写了导入）。
- `App.vue` 的宏与占位组件导入（多数项目靠自动导入，但显式导入会留下旧路径）。
- 手写的 `.d.ts`、`types/` 目录中的 `declare module`。
- `eslint` / `unocss` / 测试文件里对旧包的引用。
- `package.json` 的 `overrides` / `resolutions` 中固定的 `@dcloudio/*` 或旧 oiyo 包。

# 迁移失败处理

按症状定位。处理一次仍失败就停下，报告已检查的事实，不要连续改配置试探。

## 依赖与模块格式

### 加载 `vite.config.ts` 报 ESM 错误

症状：`ERR_REQUIRE_ESM`、`Cannot use import statement outside a module`、`require() of ES Module`。

原因：`package.json` 缺少 `"type": "module"`，或项目仍是 CJS 工程。

处理：加 `"type": "module"`；把 `vite.config.js` 改成 ESM（必要时改名为 `vite.config.mjs` 或 `.ts`）；检查是否有 CJS 的 `postcss.config.js`、`commitlint.config.js` 等，改为 `export default` 或使用 `.cjs` 后缀。不要为了兼容 CJS 回退到旧包。

### `Cannot find package 'oiyo'` / `'@oiyo/uniapp'` / `'@oiyo/schema'`

原因：依赖安装不完整，或包管理器不支持、未启用必需 peer 的自动安装。项目未显式声明 `@oiyo/uniapp` 本身不是错误。

处理：确认 `dependencies` 有 `oiyo`，然后重新安装。pnpm 默认设置和 npm 7+ 会自动安装 `@oiyo/uniapp`，无需显式声明；关闭自动安装时先恢复该设置，不支持自动安装的包管理器才按提示补齐缺失 peer。用户主动选择 UniApp 版本时可显式安装 `@oiyo/uniapp`，不要把其他 `@oiyo/*` 内部包加回依赖。

### `Cannot find module '@skiyee/oiyo/global'`

原因：`/global` 入口已删除。

处理：改为 `oiyo/runtime`。若只是自动导入默认值里的旧来源，删除自定义配置交给默认值。

### 平台插件找不到 / 提示移除 node_modules 重装

原因：旧 `prepare` 改写过的 `@dcloudio/vite-plugin-uni` 残留在 `node_modules`。

处理：

```sh
rm -rf node_modules .oiyo dist
<pm> install
```

1.0.0 通过 `@oiyo/uniapp/plugin` 在运行时临时设置 `UNI_CLI_CONTEXT`，不再改写文件。

## 扫描与路径

### 告警：无法解析的包说明符 / 自动导入失效

症状：日志提示 `composables`、`components` 之类的来源无法解析，或新写的 composable 没有自动导入。

原因：旧配置相对 `srcDir` 且没有 `./`，1.0.0 把它当成了包名。

处理：改为 `./src/composables`、`./src/components` 等相对 `rootDir` 的路径；或删除该条目使用默认值。

### 页面/分包没有生成

原因：`dir.subPackages` 语义变化。

处理：

- 容器目录以 `/*` 结尾：`'./src/packages/*'`。
- 显式包根不要带 `/*`：`'./src/sub/biz'`。
- 确认路径真实存在，且相对 `rootDir` 而不是 `srcDir`。

### 生成文件里仍是旧包名

原因：`.oiyo` 未重新生成。

处理：删除 `.oiyo` 后执行 `oiyo prepare`。不要手工编辑 `.oiyo/oiyo.d.ts`、`.oiyo/tsconfig.json` 或生成的 `pages.json`、`manifest.json`。

## 类型

### 自定义 `PageMeta` 字段没有提示

原因：仍在增强旧模块名。

处理：`declare module 'oiyo/runtime'`。如果项目用了自动生成的根上下文类型，确认 `.oiyo/types/root.d.ts` 已生成。

### `useRootContext()` 启动即抛错

原因：在模块顶层解构或读取，早于 `App.vue` setup 完成。

处理：把读取移到组件 setup 内；需要全局共享时，值应由 `defineRootContext` 工厂返回，并在 `App.vue` 里显式接住。

### `defineOiyoConfig()` 类型报错

原因：1.0.0 要求传参。

处理：写 `defineOiyoConfig({})`。

### `import.meta.env` 报 `Property 'env' does not exist on type 'ImportMeta'`

原因：根 `tsconfig.json` 覆盖了 `types`，但没有包含 `vite/client`。

处理：在根 tsconfig 的 `compilerOptions.types` 中加入 `vite/client`，或删除自定义 `types` 让它继承 `.oiyo/tsconfig.json`。1.0.0 生成的配置默认已包含 `vite/client`。

### `Cannot find type definition file for 'vite/client'`

原因：应用没有安装 `vite`，或 `types` 里写错了名称。

处理：把 `vite` 加进 `devDependencies`（版本与 `@oiyo/uniapp` 匹配）后重新安装；确认 `types` 写的是 `vite/client`。

## 运行时

### 小程序 IDE 没有自动打开

原因：`ide.path.weixin` 指向安装目录、路径不存在，或开发者工具未开启服务端口。

处理：填 CLI 文件路径（`cli.bat` / `Contents/MacOS/cli`）；确认 `ide.open` 为 `true`；确认使用的是 `oiyo dev`（`build` 不会打开 IDE）。

### 预览/上传失败

原因：未配置 `ci`，或平台 SDK 未安装、私钥路径错误。

处理：按平台补 `ci.weixin` / `ci.alipay` / `ci.toutiao` / `ci.xhs`；私钥路径相对 `rootDir`；安装对应平台 SDK。

## 不要做的事

- 不要手改 `.oiyo/`、`dist/`、生成的 `pages.json` / `manifest.json`。
- 不要为兼容旧包名添加别名或 `overrides` 指向 `@skiyee/oiyo`。
- 不要递归扫描 `node_modules` 推断公共 API；需要确认行为时查官方文档。
- 不要在没有备份或干净 git 状态时批量替换源码。

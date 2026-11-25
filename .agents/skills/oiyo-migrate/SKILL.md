---
name: oiyo-migrate
description: >
  oiyo 项目迁移专用 skill：把 0.8.x 的 @skiyee/oiyo 项目升级到 oiyo 1.0.0。
  只要用户提到“升级 oiyo”“迁移 oiyo”“从 @skiyee/oiyo 换到 oiyo”“oiyo 升 1.0”“包名改成 oiyo”“@oiyo/uni-app 改成 @oiyo/uniapp”“oiyo 报 ESM/Cannot find package”“oiyo 配置路径不生效”，或当前项目依赖 @skiyee/oiyo、@oiyo/core、@oiyo/config、@oiyo/framework、@oiyo/uni-app 需要切换到公开入口时，都必须使用此 skill，即使用户没有说“迁移”二字。
  不要用于：全新 oiyo 1.x 项目的日常开发（用 oiyo skill）、与 oiyo 无关的普通 UniApp/Vue 升级、单纯升级 uni-app 版本。
---

# Oiyo 迁移（0.8.x → 1.0.0）

把依赖 `@skiyee/oiyo` 的 UniApp 项目迁移到 `oiyo` 1.0.0。1.0.0 是破坏性升级：包名、入口、配置路径基准、模块格式、UniApp 依赖归属都变了。迁移必须分步进行，每一步都能单独验证。

## 先判断是否真的需要迁移

1. 读取项目 `package.json`。
2. 依赖里有 `@skiyee/oiyo`，或源码里出现 `@skiyee/oiyo/*`、`@oiyo/core`、`@oiyo/config`、`@oiyo/framework`、`@oiyo/uni-app`：执行本 skill。
3. 依赖里已经是 `oiyo` 1.x 且没有旧入口：不要迁移，改用 `oiyo` skill 做日常开发。
4. 只有 `@oiyo/uniapp` 版本变化（如 5.26 → 5.27）：不是本 skill 的范围，按官方 uni-app 升级说明处理。

## 硬性检查点

这些是执行门槛，不是建议：

- **改动前**：已读取 `package.json`、`vite.config.*`、`oiyo.config.*`、`tsconfig.json`，并确认 `node -v`、包管理器、`"type"` 字段。
- **删除前**：`node_modules`、`.oiyo`、`dist` 都是可再生成产物，可以删除；项目源码、锁文件、配置不能擅自删除。
- **改配置前**：确认每个 `dir.*` / `scan.*` 路径在项目里真实存在，不要照抄示例路径。
- **交付前**：完成「交付检查清单」，并明确列出未验证项。

## 迁移流程

### 第 1 步：盘点旧用法

先跑只读扫描，拿到准确的改动面（脚本不修改任何文件）：

```sh
node <skill-dir>/scripts/scan-legacy-usage.mjs <project-root>
```

扫描结果分两类：依赖与工程字段、源码引用。把结果作为后续步骤的清单；扫描不到不等于没有，仍需人工检查 `vite.config.*`、`oiyo.config.*`、`App.vue`、`main.ts`、`pages.config.*`、`manifest.config.*`。

如果项目不是 git 仓库或工作区不干净，先提醒用户提交或备份，再继续。非 git 项目至少要有一份目录副本。

如果项目缺少 `App.vue`、`main.ts`、`tsconfig.json` 等关键文件，不要臆造：把缺失项写进交付清单的“未验证项”，并按现有文件能验证的部分继续。

### 第 2 步：依赖与工程字段

按下面的目标状态改 `package.json`：

- `"type": "module"` 必须存在；缺失时 Vite 加载 `vite.config.ts` 会因 ESM-only 入口失败。
- `dependencies` 加入 `oiyo`（`^1.0.0`）。`@oiyo/uniapp` 是 `oiyo` 的必需 peer，pnpm 默认设置和 npm 7+ 会自动安装，无需在项目中显式声明。
- 只有用户需要选择或固定 UniApp 版本时，才显式安装 `@oiyo/uniapp`（当前 `^5.26.0`，版本跟随 uni-app 发行版）；已有有效声明保留。
- `devDependencies` 加入 `vite`，版本与 `@oiyo/uniapp` 匹配（当前 `5.2.8`）。`vite` 是可选 peer，不会被自动安装。
- 删除 `@skiyee/oiyo`、`@oiyo/core`、`@oiyo/config`、`@oiyo/framework`、`@oiyo/plugin`、`@oiyo/cli`、直接声明的 `@dcloudio/*`、`vue`。
- 把 `engines.node` 提到 `^20.19.0 || >=22.12.0`（`oxc-parser` 要求）。

改完执行：

```sh
rm -rf node_modules .oiyo dist
<pm> install
```

`<pm>` 用项目实际包管理器（有 `pnpm-lock.yaml` 用 pnpm，有 `yarn.lock` 用 yarn，其余 npm）。清空 `node_modules` 是必要的：旧 `prepare` 会改写 `node_modules` 里的 `@dcloudio/vite-plugin-uni`，残留补丁会让新流程报平台插件错误。

### 第 3 步：替换导入与类型来源

逐条按 `references/entry-map.md` 替换。最容易漏的三类：

1. `/global` 入口已删除 → `oiyo/runtime`。
2. 配置类型搬家：`pages.json` / `manifest.json` 结构类型去 `@oiyo/uniapp/config`，`PageMeta` 去 `oiyo/runtime`，其余配置类型和默认值去 `oiyo/schema`。
3. 手写 `declare module '@skiyee/oiyo/global'`（或 `'@skiyee/oiyo'`）→ `declare module 'oiyo/runtime'`。

`oiyo/config` 只保留 `define*Config` 与 `OiyoConfig` / `PagesConfig` / `ManifestConfig` / `Define*` 类型；`defaultConfig` 已移除，需要默认值时调用 `createDefaultConfig()`。

### 第 4 步：改 `oiyo.config.ts`

路径基准从 `srcDir` 变为 `rootDir`，本地路径必须显式以 `./` 开头。逐字段对照 `references/config-migration.md`，重点是：

- `dir.mainPackage: 'pages'` → `'./src/pages'`；`dir.layouts`、`dir.middlewares` 同理。
- `scan.apis: ['composables']` → `'./src/composables'`；`scan.components` 同理。
- 分包：`/*` 结尾是容器目录，不带 `/*` 是显式包根。
- 默认值采用追加语义，项目没有额外来源时可以删掉旧条目，交给默认值。
- **目录不存在时删除条目**：扫描脚本会给出“存在/未找到”提示；只有目录真实存在才翻译成 `./src/...`，否则删除该条目并依赖默认值，不要留下指向不存在目录的配置。
- `package.json#version` 是应用自己的版本号，与框架版本无关，迁移不要改。
- `defineOiyoConfig()` 不接受无参调用，空配置写 `defineOiyoConfig({})`。
- `ide.path.weixin` 必须是 CLI 文件路径，不是安装目录；旧值是目录或无法确认时，删除 `path` 并在交付清单里列为“待补充 CLI 路径”，不要猜路径。`ide.open` 只在 `oiyo dev` 生效。
- 需要小程序预览/上传时新增 `ci` 配置，并使用 `oiyo preview` / `oiyo upload`。

### 第 5 步：检查 `App.vue`、根上下文与页面元信息

- `defineRootContext(factory)` 仍是工厂函数；要在模板里使用返回值，必须显式接住（`const ctx = ...` 或解构）。
- 页面继续用 `useRootContext()`；不要在模块顶层解构，它会在 `App.vue` setup 完成前抛错。
- `PageMeta` 的自定义字段用 `declare module 'oiyo/runtime'` 增强。
- `App.vue` 必须保留 `<OiyoPage />`；需要布局时用 `<OiyoLayout>` 包裹。

### 第 6 步：检查 TypeScript 配置

- 根 `tsconfig.json` 必须继承 `./.oiyo/tsconfig.json`；1.0.0 生成的配置已包含 `types: ["vite/client"]` 与 `~`/`@`、`~~`/`@@` 别名。
- 旧项目根 tsconfig 里手写的 `"types": ["vite/client"]` 可以保留，也可以删除，两者等价。
- 如果项目自定义了 `types` 数组（例如 `["@dcloudio/types"]`），必须把 `vite/client` 一并列进去。`types` 在子配置里是整体覆盖，不写就会丢失，表现为 `import.meta.env` 报 `Property 'env' does not exist on type 'ImportMeta'`。
- `vite` 必须是应用依赖；没有安装时 `vue-tsc` 会报 `Cannot find type definition file for 'vite/client'`。
- 不要通过改 `.oiyo/tsconfig.json` 解决类型问题。

### 第 7 步：重新生成并验证

```sh
<pm> exec oiyo prepare
<pm> exec vue-tsc --noEmit
<pm> exec oiyo build h5
<pm> exec oiyo build mp-weixin
```

按项目实际脚本调整（例如项目里是 `typecheck` 而不是 `vue-tsc --noEmit`）。构建平台按项目实际支持的平台选择，不要为了验证引入项目原本不支持的平台。

验证失败时先读 `references/troubleshooting.md` 的对应症状，再考虑扩大改动；同一问题处理一次仍失败就停下，报告已检查的事实与剩余不确定性。

### 第 8 步：交付检查清单

- `package.json`：无旧包、有 `oiyo` + `vite`、有 `"type": "module"`、`engines.node` 已更新；不要求显式声明 `@oiyo/uniapp`，通过安装与构建确认必需 peer 可用。
- 源码：`rg "@skiyee/oiyo|@oiyo/(core|config|framework|uni-app)"` 无命中（`node_modules`、`dist`、`.oiyo` 除外）。
- `oiyo.config.*`：所有本地路径以 `./` 开头且相对 `rootDir` 正确；分包容器/显式包根语义正确。
- `.oiyo/oiyo.d.ts` 引用 `oiyo/types`；`.oiyo/types/` 下有 `apis`、`components`、`layouts`、`middlewares`、`pages`、`root`。
- 类型检查与 H5 / 小程序构建通过；没有扫描来源告警。
- `tsconfig.json` 存在且继承 `./.oiyo/tsconfig.json`；生成的配置已含 `vite/client`，自定义 `types` 时需保留它；缺失时明确提醒用户生成配置不会被自动继承，IDE 与类型检查需要手动配置。
- 没有手工编辑 `.oiyo/`、`dist/` 或生成的 `pages.json`、`manifest.json`。
- 未验证项（例如未安装的小程序 IDE、未配置的 CI 密钥）明确列出。

## 失败处理

先按症状定位，不要靠猜测改配置：

1. 读 `references/troubleshooting.md`。
2. 仍无答案时，读项目自己的错误输出、生成产物和配置文件；不要递归扫描 `node_modules`，也不要根据包内实现推断公共行为。
3. 需要确认官方行为时，抓取 `https://oiyo.js.org/llms.txt` 找到对应文档页。
4. 仍无法确认时，向用户说明缺失的具体行为、已检查的来源，以及为什么该缺口会阻止可靠改动。

## 回滚

迁移只改依赖、配置和源码引用，回滚很直接：

```sh
git checkout -- package.json <lockfile> src
<pm> install
rm -rf .oiyo dist
```

如果项目不是 git 仓库，回滚前先确认备份存在；没有备份时不要开始迁移。

## 参考资料

- `references/entry-map.md`：入口、类型、值符号的完整新旧对照，含已删除入口与常见误用。
- `references/config-migration.md`：`oiyo.config.ts` 逐字段迁移、路径语义、分包容器、IDE/CI。
- `references/troubleshooting.md`：症状 → 原因 → 处理。
- `scripts/scan-legacy-usage.mjs`：只读扫描旧依赖、旧入口与旧配置写法。

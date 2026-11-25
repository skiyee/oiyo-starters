---
name: oiyo-starter
description: >
  开发和维护使用 oiyo 与 @oiyo/uniapp 的 UniApp 项目，依据项目实际配置处理页面、分包、布局、应用壳、根上下文、自动导入、请求与构建。
  用户要求在 Oiyo 项目或 starter 中新增功能、调整页面与配置、接入接口或验证构建时使用。旧版 @skiyee/oiyo 的升级属于迁移任务；与 Oiyo 工程约定无关的普通 Vue/CSS 修改不使用此 skill。
---

# Oiyo 项目通用开发 Skill

本 skill 记录 Oiyo 项目的通用开发方法，而不是某个 starter 当前示例的文件清单。执行任务时，始终先读取目标项目的真实配置和附近源码，再把下述职责映射到实际路径、命名与实现。

本 skill 使用当前 `oiyo` 的公开入口与目录约定。项目仍依赖 `@skiyee/oiyo` 时，先确认旧版与迁移范围，不直接套用当前配置或混用包入口。

下文使用 `<project-root>` 表示命令工作目录，`<rootDir>` 表示 Oiyo 配置解析后的项目根目录，`<srcDir>` 表示相对 `<rootDir>` 解析后的源码目录。默认 `rootDir` 是命令工作目录，`srcDir` 是 `src`；显式配置和现有项目结构优先。表中的 `src/` 仅表示默认源码目录。

## 1. 先确认项目边界

- 优先使用用户明确指定的项目目录；否则从当前工作目录向上查找 `package.json`，结合 `oiyo` 依赖、Oiyo/Vite 配置与工作区结构识别目标应用，避免把 monorepo 根目录当作应用根目录。配置文件可能使用 `.ts`、`.js` 或 `.mjs`，不以固定扩展名判断项目是否存在。
- 如果当前目录包含多个项目，在用户目标范围内查找候选根目录；存在多个合理候选且无法可靠判断时，再向用户确认。
- 所有命令以 `<project-root>` 为工作目录；Oiyo 配置中的路径按 `<rootDir>` 解析，不把 starter 名称或本仓库路径写死。
- 改动前至少读取：
  - `<project-root>/package.json`
  - `<project-root>/oiyo.config.*`（若存在）
  - `<project-root>/vite.config.*`
  - 受影响目录及附近现有文件
- 涉及 TypeScript、UnoCSS、环境变量或平台配置时，再读取对应的 `tsconfig.json`、`uno.config.*`、相关环境变量声明、`manifest.config.*` 或手写 `manifest.json`；读取 `.env*` 时只检查任务需要的字段，不输出密钥值。
- 项目源码与配置是项目事实来源；Oiyo 公共 API、配置字段或默认行为不确定时查官方文档，不默认读取 `node_modules/` 内部实现。

## 2. 项目地图与职责边界

以下是职责地图，不是强制要求每个项目都存在所有路径。路径由 `oiyo.config.ts`、项目现状和附近文件共同确认；如果项目调整过目录布局，应把职责映射到实际路径。

| 路径                                   | 职责                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `package.json`                         | 项目依赖、包管理器边界、开发/构建/检查脚本及生命周期命令。                                                         |
| `oiyo.config.ts`                       | Oiyo 的源码目录、约定式目录、扫描来源、生成行为和其他框架配置。                                                    |
| `vite.config.ts`                       | Vite 插件、开发服务器和构建扩展；维护 Oiyo、UniApp、UnoCSS 等既有插件链路。                                        |
| `tsconfig.json`                        | 项目 TypeScript 配置以及 Oiyo 生成类型配置的继承关系。                                                             |
| `src/App.vue`                          | 应用壳、应用级生命周期、根上下文和 Oiyo 页面/布局渲染入口。                                                        |
| `src/main.ts`                          | 创建应用、安装 Pinia 等全局插件、引入全局样式并挂载应用。                                                          |
| `src/pages.config.ts`                  | 全局页面配置与页面默认值；页面专属元信息不放在这里。                                                               |
| `src/pages/`                           | 主包路由页面；目录层级、文件形态和路由地址以当前项目约定为准。                                                     |
| `src/packages/`                        | 默认分包目录；各分包页面通常位于 `<package>/pages/` 下。若 `oiyo.config.ts` 显式配置了其他分包路径，则以配置为准。 |
| `src/layouts/`                         | 可复用的页面布局与公共页面壳；负责结构、公共导航或容器，并通过插槽渲染页面内容，避免承载具体页面业务。             |
| `src/components/`                      | 可复用视图组件；是否自动导入以及扫描深度以项目配置和 Oiyo 约定为准。                                               |
| `src/composables/`                     | 可复用组合式逻辑；保持单一职责，并遵循项目的自动导入与命名约定。                                                   |
| `src/middlewares/`                     | 全局或具名路由中间件；负责导航前后的通用控制，不承载页面 UI。                                                      |
| `src/apis/`                            | 请求客户端、接口函数及相关请求/响应类型；公共请求能力在此集中复用。                                                |
| `src/stores/`                          | Pinia store、store 初始化和插件；用于跨页面或跨组件的领域状态。                                                    |
| `src/types/`                           | 项目共享类型、模块扩展和根上下文等类型声明。                                                                       |
| `src/utils/`                           | 无 UI 依赖的通用工具函数。                                                                                         |
| `src/static/`                          | 由 UniApp/Oiyo 约定处理的静态资源。                                                                                |
| `src/manifest.config.ts`               | 可选的应用配置输入；与框架默认值合并后生成 `manifest.json`。                                                        |
| `src/manifest.json`                    | 无 `manifest.config.*` 时是手写输入；配置模式下是生成产物。                                                         |
| `.oiyo/`、`dist/`、生成的 `pages.json` | 框架或构建生成产物，只用于验证结果，不作为日常手工维护目标。                                                       |

不要在职责地图中枚举某个示例项目当前有哪些页面、布局、组件、store、接口或字段。需要这些信息时，现场读取对应目录。

## 3. Oiyo 接入约定

- 保留项目已有的 Oiyo 开发、构建和 prepare 链路；具体脚本名称与参数以 `package.json` 为准，不凭本 skill 补造。
- 应用声明 `"type": "module"`，使用 `oiyo` 和必需 peer `@oiyo/uniapp`；Vite 是可选 peer，需要应用显式安装与 UniApp 匹配的版本。Node 要求 `^20.19.0 || >=22.12.0`，具体依赖版本以项目与对应版本文档为准。
- Vue、Vue 编译器与 `@dcloudio/*` 由 `@oiyo/uniapp` 统一提供，不在应用中另装一份 Vue 或 UniApp 运行时。`@dcloudio/types` 可作为类型检查依赖；个别 UniApp 依赖覆盖沿用项目的包管理器配置。
- 修改 `vite.config.ts` 时保留从 `oiyo/plugin` 导入的 `OiyoPlugin()`；它已组合 Oiyo 与 UniApp 插件，不重复注册官方 UniApp 插件。保留现有 UnoCSS 和其他插件及其顺序。
- 配置辅助函数从 `oiyo/config` 导入；完整配置 schema、默认值与 resolver 从 `oiyo/schema` 导入；页面宏、占位组件、根上下文、HTTP、中间件以及 Vue/UniApp API 从 `oiyo/runtime` 导入或按已配置来源自动导入。没有 `oiyo/global` 入口，也不把构建入口引入客户端。
- 如果 `tsconfig.json` 继承 Oiyo 生成配置，继续维护该继承关系；不要通过编辑 `.oiyo/` 修复类型问题。
- `oiyo.config.ts` 是源码目录、页面/布局/中间件目录和自动扫描来源的配置依据。新增配置时保留无关现有条目和对象形态。
- `dir.*`、API/组件扫描的本地 `from`、组件类型入口的本地 `types.from` 都相对 `<rootDir>` 解析，显式写 `./…`（或绝对路径）；扫描来源中的裸名称是包说明符，不会退回本地目录。默认目录跟随 `srcDir` 推导，但这不改变显式路径的解析基准。
- `~`/`@` 指向 `<srcDir>`，`~~`/`@@` 指向 `<rootDir>`；`App.vue`、`main.ts`、`pages.json`、`manifest.json` 仍位于 `<srcDir>`，不会随 `dir.mainPackage` 移动。
- 新增页面、布局、组件、API、中间件或自动导入来源时，只维护配置与源码输入，再由 Oiyo 刷新类型、路由和其他生成信息。
- 不手动编辑 `.oiyo/*`、`dist/*` 或已确认由 Oiyo 生成的 `pages.json`。生成结果错误时，回到页面源码、页面元信息、全局页面配置或 Oiyo 配置修复。

### Manifest 输入模式

- 存在 `<srcDir>/manifest.config.*` 时，在该配置中通过 `defineManifestConfig()` 维护覆盖键，生成的 `manifest.json` 仅用于核对。数组整体替换默认数组，不做拼接。
- 不存在配置文件时，`manifest.json` 是手写输入，直接维护它；Oiyo 不创建或改写该文件，不为修改名称、appid 或版本自动切换到配置模式。
- 用户要求切换模式时，先读取并保留现有自定义配置，再生成并核对差异；`.env` 与模式变量沿用项目实际约定。

## 4. 页面、布局与路由

### 新增或修改主包页面

1. 从 `oiyo.config.ts` 确认 `<srcDir>` 和主包页面目录。
2. 在解析后的 `dir.mainPackage` 下沿用现有扁平页面或 `<route>/index.vue` 形态；未配置时主包目录默认是 `<srcDir>/pages`，不强制统一已有页面结构。
3. 检查相邻页面，确认路由命名、页面文件形态、Vue/TypeScript 写法和样式组织方式。
4. 页面标题与局部页面样式放在路由页面顶层 `definePageMeta()` 的 `style` 中；布局选择、页面类型、TabBar 项和中间件分别使用 `layout`、`type`、`tab`、`middleware`，不把宏移入生命周期或普通组件。
5. 需要成为应用首页或主包 TabBar 首页的页面，才根据项目现有约定在 `definePageMeta()` 中设置 `type: 'home'`；普通主包页面不要为了“看起来像首页”随意添加该字段。一个应用通常只应有一个实际生效的首页，新增或调整前先检查现有首页及生成配置。
6. 全局默认页面配置放在 `<srcDir>/pages.config.ts`；不要把同一份默认值复制到每个页面。
7. 页面只承担本页内容与交互；重复页面壳放进 `layouts/`，可复用视图放进 `components/`，跨页面状态放进根上下文、store 或 composable。

### 新增或修改布局

- 先解析 `dir.layouts`，检查现有文件、页面里的 `layout` 元信息与 `<OiyoLayout>` 标签，确认布局命名和使用方式。
- 布局文件负责公共结构、容器、导航和跨页面一致的视图外壳，并保留渲染页面内容所需的 `<slot />`。
- 不假设项目一定存在 `default.vue`、`tabbar.vue` 或其他固定布局；新增布局名应由业务职责和项目命名约定决定。
- 依赖默认布局时确认布局目录中的 `default.vue` 存在；页面声明 `<OiyoLayout name="…">` 时使用静态布局名，元信息中的 `layout: false` 表示禁用元信息布局。
- 页面专属请求、表单、列表和交互逻辑不要上移到布局；只有确实跨使用该布局的页面共享的行为才放入布局。
- 修改布局后检查 `App.vue` 的 Oiyo 布局/页面渲染链路仍然有效，并验证引用该布局的页面。

### 新增分包页面

1. 先读取 `oiyo.config.ts` 的 `dir.subPackages`。以 `/*` 结尾的条目是容器目录，其下每个一级目录各为一个分包；没有该标记的条目就是分包根目录，不再向下展开。
2. 默认容器是 `<srcDir>/packages/*`；在实际分包根目录下沿用现有页面形态，常见位置是 `<package>/pages/<route>/index.vue`。不要把 `./src/sub/biz` 错当成多个分包的容器。
3. 检查相邻分包页面，沿用项目现有的命名、页面文件形态和页面元信息写法。
4. 根据实际生成或约定的路由地址跳转；普通页面和分包页面通常使用 `uni.navigateTo()`、`uni.redirectTo()` 等非 TabBar API。
5. 分包页面不能设置 `type: 'home'`、`tab` 或被误设为主包 TabBar 页面；如果需求涉及架构调整，先核对 Oiyo 与 UniApp 的约束。
6. 添加后可检查生成的页面配置或路由类型是否包含对应分包，但不直接修改生成产物。

### TabBar 设置与调整

- 先检查项目当前的 TabBar 页面、页面元信息、布局和应用壳，确认 TabBar 是由页面元信息与 Oiyo 生成配置共同驱动，还是存在额外的平台配置。
- 只有属于主包 TabBar 的页面才声明 `tab` 元信息；TabBar 的首页通常还需要结合项目约定设置 `type: 'home'`。TabBar 的索引、标题、图标、页面类型和布局等字段，沿用项目当前 `definePageMeta()` 的写法。
- 新增 TabBar 页面时，同时检查 TabBar 项的排序、唯一索引、显示文案、图标资源、默认首页以及对应的页面布局，避免只新增页面而遗漏导航入口。
- 调整 TabBar 时，检查受影响页面的 `tab` 元信息、`type: 'home'`、布局引用、跳转调用和生成后的页面配置是否保持一致；不要直接编辑生成的 `pages.json`。
- TabBar 页面必须属于主包；分包页面和普通非 TabBar 页面不要添加 `tab`，也不要使用 `uni.switchTab()`。
- TabBar 页面之间使用 `uni.switchTab()`；其他页面根据导航语义使用 `uni.navigateTo()`、`uni.redirectTo()` 或项目现有的非 TabBar API，URL 使用项目实际生成的绝对路由地址。
- 如果需要修改 TabBar 的全局外观、平台能力或生成规则，先定位项目实际配置入口，再同步检查布局和各 TabBar 页面，不要把全局配置重复写进每个页面。

### 中间件

- 中间件放在解析后的 `dir.middlewares`（默认 `<srcDir>/middlewares`），负责认证、权限和重定向等导航控制，不承载页面 UI 和具体页面业务。
- 全局中间件遵循项目的 `.global` 文件命名约定；具名中间件使用不带 `.global` 的文件名，并通过页面元信息中的 `middleware` 字段引用。
- 中间件默认导出 `defineRouteMiddleware((to, from) => …)`；全局中间件先于页面具名中间件执行，不在 `App.vue`、`main.ts` 或页面中手动重复注册。放行返回 `void`/`true`，中止或重定向要返回 `false`、`abortNavigation()` 或 `goTo()` 的结果。
- 新增或调整认证、权限和重定向逻辑前，先读取现有中间件、登录流程、白名单、回跳参数和错误处理；不能复用其他 starter 的示例值。
- 页面引用具名中间件时，名称必须与实际文件名、导出方式和 Oiyo 生成类型一致；修改文件名后同步更新所有页面元信息。
- 修改中间件后，至少验证受保护页面、白名单页面、已登录和未登录跳转，以及 TabBar/分包页面是否仍使用正确的导航 API。

## 5. App.vue、根上下文与状态管理

- 修改 `<srcDir>/App.vue` 前先确认当前 `<OiyoLayout>`、`<OiyoPage />`、生命周期和根上下文结构；保留 `<OiyoPage />`，不向其内部添加内容。需要壳层布局时用 `<OiyoLayout>` 包裹页面入口，布局以 `<slot />` 渲染页面。
- 只服务应用壳模板的绑定可直接放在 App 的 `<script setup>` 顶层；跨页面共享状态才在 `App.vue` 用 `defineRootContext(() => ({ … }))` 定义，由页面通过 `useRootContext()` 消费。根上下文值供 App 模板使用时，需要显式接住返回值或解构。
- 自动根上下文类型要求 `defineRootContext<RootContext>(…)` 的类型从 `App.vue` 导出，生成的 `.oiyo/types/root.d.ts` 会增强 `oiyo/runtime` 的 `OiyoRootContext`；沿用手写类型的项目也可保持显式泛型或模块声明，不手改生成声明。
- 在组件 setup 或 App 初始化后的调用中读取根上下文，不在模块顶层解构 `useRootContext()`；App setup 完成前读取会报错。
- 业务领域状态、复杂派生状态、持久化状态或跨组件共享行为优先放入 `stores/`；沿用项目现有的 Pinia 创建、激活和插件机制。
- 页面局部状态留在页面或局部 composable，不要为了“统一”全部提升到 App 根上下文或全局 store。
- 修改持久化或认证状态前，先读取当前存储键、序列化方式、过期策略与登录流程；示例 token 或模拟状态不能直接当作生产方案。
- `App.vue` 只承载应用壳职责，避免放入某个页面专属的请求、展示和交互逻辑。

## 6. 自动导入、API 与请求

### 自动导入

- 先读取 `oiyo.config.ts`，区分默认来源与项目追加来源。默认 API 来源包括 `<srcDir>/composables` 和 `oiyo/runtime` 的预设名单，公开导出不等于默认自动导入；默认组件来源包括 `<srcDir>/components` 与 `OiyoPage`/`OiyoLayout`。`apis/`、`stores/`、`utils/` 不自动成为默认扫描目录。
- `scan.apis`/`scan.components` 支持 `false`（禁用）、`true`（使用默认值）或数组（追加来源并保留默认来源）；不要用空数组当作禁用开关。
- 新增符号前检查同类文件的导出和使用方式，决定沿用自动导入还是显式导入。
- 自动扫描的 API、store、composable、工具和类型应使用可追踪的导出方式；避免通过多层 barrel 再导出造成来源不清或扫描失效。
- API 扫描只处理 JS/TS；Vue/NVue 文件交给组件扫描。新增 API 类型导出使用 `{ from, types: true }`；组件的 `types` 指定外部声明入口，二者含义不同，默认导出的组件类型使用 `name: 'default'`。
- 包来源优先使用公开导出：`pkg/*` 匹配一层 exports 子路径，`pkg/**` 匹配全部深度，两者都不包含根入口；根入口单独写 `pkg`。包含具体目录或文件扩展名的 glob 按文件扫描处理，不把所有包 glob 都当作 exports 匹配。
- 组件名称从实际扫描来源推导；出现名称冲突或外部类型不生效时检查配置与生成声明，不复制 starter 中的组件注册名。
- 配置或扫描来源变化后，刷新 Oiyo 元数据并运行类型检查；不要手改生成声明文件。

### HTTP/API

- 先查项目已有的 `createHttp()` 实例、派生客户端、钩子、认证约定和错误处理，不限定它们必须放在 `apis/`；新增接口复用现有实例，需要叠加公共能力时使用 `实例.create()`。
- 公共 `baseURL`、headers、认证和拦截器放在公共请求实例；单次请求差异放在具体调用处，避免页面重复创建客户端或拼接公共配置。
- 接口函数与请求/响应类型按项目现有方式放在 `apis/` 或其业务子目录，并保持可追踪导出。
- 新增自定义请求选项前，检查项目已有的模块声明或类型扩展，并核对 Oiyo 官方 HTTP 文档。
- 环境变量名、模式文件和注入方式以当前项目为准；不把密钥、生产地址或固定凭证写入源码。
- 外部接口失败与本地类型、路由或构建失败分开判断；报告验证结果时明确失败发生在哪一层。

## 7. Vue、UniApp 与样式

- 沿用项目现有的 Vue 3 与 TypeScript 组件风格；使用 `<script setup lang="ts">` 时保持类型清晰、逻辑就近。
- 跨端页面优先使用 UniApp 支持的节点和 API；引入 Web-only 能力前确认目标平台与兼容方案。
- 如果项目已接入 `uni-unocss`，沿用现有 utility-first 风格、preset、transformer 和快捷规则；不要无理由增加另一套 CSS 框架。
- 页面、布局和组件样式与自身职责就近维护；全局页面默认样式放在全局配置或既有全局样式入口。
- 修改 UI 时先观察附近页面和组件的设计语言，不复制某个 starter 示例的文案、颜色或布局细节。

## 8. 命令与验证策略

运行命令前先读 `<project-root>/package.json` 的 `scripts`，只选择项目实际存在的命令。

- 优先执行与改动最接近、有限时长的检查，例如项目已有的 `typecheck`、`lint`、单元测试或测试模式构建。
- 页面、布局、Oiyo 配置、Vite/UnoCSS 配置或生成路由相关改动，除类型检查外，通常还需要执行可覆盖生成流程的平台构建或测试构建。
- 需要验证平台生成与编译时使用 `oiyo build <platform>`；它默认使用 production 模式，但不等于发布。环境模式按项目脚本或 `--mode/-m` 选择，不为常规验证调用发布命令。
- `dev` 通常是长驻进程，仅在用户需要运行时预览且能够管理进程时启动；不要把“服务成功启动”冒充完整验证。
- 只需刷新声明与路由时，使用项目脚本或包管理器执行 `oiyo prepare`；`oiyo dev`/`oiyo build` 自带 prepare，不在它们之前重复执行。
- `build` 不打开 IDE；`dev` 在小程序服务就绪且 `ide.open` 为真时打开一次。IDE 路径只放在 `ide.path.*`，微信路径指向 CLI 文件，不是安装目录；预览/上传参数属于 `ci.*`。
- `oiyo preview`、`oiyo upload` 及 `build --preview/--upload` 都会构建并执行发布动作，只在用户授权相应操作时使用。IDE 默认使用 `dist/dev/<platform>`，CI 默认使用 `dist/build/<platform>`，自定义输出路径以项目配置为准。
- 如果预期脚本不存在，列出实际可用脚本并选择替代验证；不要声称运行了不存在的 `test`、`lint` 或其他命令。
- 如果项目处于 Git 工作树中，交付前运行 `git diff --check` 和 `git status --short`；同时确认未纳入生成目录、临时日志或环境密钥。

## 9. 交付前检查清单

- [ ] 已识别正确的 `<project-root>`、`<srcDir>` 和受影响目录，没有写死 starter 路径。
- [ ] 改动落在项目源码或配置输入，而不是 `.oiyo/`、`dist/` 或其他已确认的生成产物。
- [ ] Manifest 模式已确认：配置模式改 `manifest.config.*`，手写模式改 `manifest.json`。
- [ ] 页面文件形态、路由、布局名、TabBar 元信息和中间件名称来自当前项目事实。
- [ ] 所有布局仍能通过插槽渲染页面，App 中的 Oiyo 页面/布局渲染链路未被破坏。
- [ ] 主包、分包与 TabBar 页面的跳转 API 使用正确，没有把分包页面当作 TabBar 页面。
- [ ] 根上下文类型与实现同步；Pinia 仍由项目既有入口安装并沿用现有插件机制。
- [ ] 显式本地扫描路径相对 `<rootDir>`，分包容器与分包根目录没有混淆，未重复安装 Vue 或注册 UniApp 插件。
- [ ] 自动导入符号能追踪到 Oiyo 内置来源或 `oiyo.config.ts` 的项目扫描配置。
- [ ] 请求复用了当前项目的公共客户端与环境变量约定，没有硬编码公共配置或敏感值。
- [ ] 已运行项目实际存在且与改动匹配的有限时长验证命令，并如实报告结果与剩余风险。
- [ ] 若项目使用 Git，`git diff --check` 通过，`git status --short` 中没有意外文件。

## 10. 何时查官方 Oiyo 文档

本 skill 保留当前工程约定摘要；具体 API 字段、默认值和版本差异以对应版本文档为准。出现以下情况时，先核对项目配置，再查官方文档：

- Oiyo API、配置字段、页面元信息、布局、中间件或 HTTP 行为不确定；
- 需要新增自动扫描、分包、布局或生成规则；
- 生成类型、页面配置或路由异常，且项目输入文件无法解释问题；
- 用户要求确认当前版本的精确默认值或官方推荐写法。

从官方维护的 AI 文档索引 `https://oiyo.js.org/llms.txt` 定位对应主题。官方文档仍无法回答时，明确说明已确认的事实与剩余缺口；未经用户同意，不用 `node_modules` 内部实现替代公共文档。

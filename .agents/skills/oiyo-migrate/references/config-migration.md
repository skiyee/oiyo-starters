# `oiyo.config.ts` 迁移

## 核心变化：路径基准

0.8.x 的 `dir.*` 和 `scan.*` 本地路径相对 `srcDir`；1.0.0 统一相对 `rootDir`，并且必须显式以 `./` 开头（或写绝对路径）。不带 `./` 的写法会被当作包说明符，解析不到时只产生告警，不会回退到目录。

| 字段 | 0.8.x 写法 | 1.0.0 写法 |
| --- | --- | --- |
| `dir.mainPackage` | `'pages'` | `'./src/pages'` |
| `dir.layouts` | `'layouts'` | `'./src/layouts'` |
| `dir.middlewares` | `'middlewares'` | `'./src/middlewares'` |
| `dir.subPackages` | `['packages/order']` | `['./src/packages/order']` |
| `scan.apis` | `['composables']` | `['./src/composables']` |
| `scan.apis` glob | `['composables/*.ts']` | `['./src/composables/*.ts']` |
| `scan.components` | `['components']` | `['./src/components']` |

`srcDir` 不是 `src` 时按实际值换算；`srcDir` 为绝对路径时，默认值直接拼成绝对路径。

包说明符不受影响，`from: '@scope/pkg'`、`from: '@scope/pkg/*'` 保持原样。

## 路径不存在时

扫描脚本会为 `dir` / `scan` 的旧值给出“存在/未找到”提示，按下面规则处理：

- 目录真实存在：按上表翻译成 `./src/...`。
- 目录不存在：删除该条目，依赖默认值；不要保留指向不存在目录的路径。
- `dir.subPackages` 的旧条目对应目录不存在时优先删除，交给默认 `./src/packages/*`。
- `scan.*` 中无法判断是包名还是不存在的本地目录时（例如 `'pinia'`、`'stores'`），保持原样并请用户确认，不要猜测。
- 旧值是 glob 时按 glob 的父目录判断是否存在，例如 `packages/*` 看 `src/packages` 是否存在。

## 默认值

1.0.0 的默认值随 `srcDir` 推导，`srcDir: 'src'` 时等价于：

```ts
{
  dir: {
    mainPackage: './src/pages',
    subPackages: ['./src/packages/*'],
    layouts: './src/layouts',
    middlewares: './src/middlewares',
  },
  scan: {
    apis: [
      './src/composables',
      {
        from: 'oiyo/runtime',
        only: [/* 内置 API 与类型列表 */],
      },
    ],
    components: [
      './src/components',
      { from: 'oiyo/runtime', only: ['OiyoPage', 'OiyoLayout'] },
    ],
  },
}
```

合并规则是追加：用户项在前、默认项在后；`exclude` 也一样。空数组仍会追加默认项，想彻底关闭某一类扫描用 `false`。

```ts
scan: {
  apis: false,          // 关闭 API 自动导入
  components: true,     // 使用默认组件扫描
}
```

## 分包语义

- `'./src/packages/*'`：容器目录，其下每个一级目录自动成为一个分包。
- `'./src/sub/biz'`：显式包根，不再向下展开。
- 旧版本自动发现的 `<srcDir>/packages/*` 已由默认值覆盖，通常不需要显式配置。
- 显式包根不要带 `/*`；需要展开时才用容器写法。

## 配置类型改名

| 0.8.x | 1.0.0 |
| --- | --- |
| `ApiScanTarget` | `ApisOptions` |
| `ComponentScanTarget` | `ComponentsOptions` |
| `OiyoConfigScan` | `ScanOptions` |
| `OiyoConfigCI` | `CIOptions` |
| `OnlyPickNameItem` | `OnlyPickOptions` |
| `OiyoConfigDir` / `OiyoConfigIDE` / `IDEPlatformPath` / `GlobRule` | 不再单独导出；目录与 IDE 形状内联在 `OiyoConfig` 中 |

`OiyoConfig` 名称保留。配置类型从 `oiyo/schema` 导入；`oiyo/config` 只导出 `define*Config` 与它们直接接受的三个配置类型。

## `defineOiyoConfig`

```ts
// 0.8.x：允许无参
export default defineOiyoConfig()

// 1.0.0：必须传对象
export default defineOiyoConfig({})
```

## IDE

```ts
ide: {
  open: true,                              // 仅 oiyo dev 生效
  path: {
    weixin: 'C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat',
    alipay: '/Applications/小程序开发者工具.app/Contents/MacOS/cli',
  },
}
```

- `path.weixin` 必须是 CLI 文件（`cli.bat` 或 `Contents/MacOS/cli`），填安装目录会直接报错。
- 旧值是安装目录或无法确认时，删除 `path`，在交付清单里标注“待补充 CLI 路径”，不要猜测位置。
- 微信默认路径之外的安装位置才需要配置。
- 打开失败时先确认开发者工具已开启“服务端口”。

## CI

1.0.0 新增 `ci` 配置与 `preview` / `upload` 命令：

```ts
export default defineOiyoConfig({
  ci: {
    version: '1.0.0',
    desc: '测试版',
    weixin: {
      appid: 'wx1234567890',
      privateKeyPath: './key/private.wx1234567890.key',
    },
  },
})
```

- `ci.project` 默认取 `dist/build/<platform>`。
- 各平台 SDK 由项目自行安装，oiyo 不内置。
- 命令：`oiyo preview <platform>`、`oiyo upload <platform>`、`oiyo build <platform> --preview|--upload`。

## 其它

- `oiyo dev` / `oiyo build` 会自动执行 prepare，不要在其他脚本里重复调用。
- 旧 `prepare` 会改写 `node_modules` 中的 `@dcloudio/vite-plugin-uni`；1.0.0 不再改写，迁移时删除 `node_modules` 重新安装即可。
- `OIYO_PLUGIN`、`OIYO_UNI_CALLED` 环境变量已移除。
- 想固定某个 `@dcloudio/*` 版本时用 `pnpm.overrides`，不要把它们加回应用依赖。

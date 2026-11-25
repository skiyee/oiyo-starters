import { defineOiyoConfig } from 'oiyo/config'

export default defineOiyoConfig({
  /**
   * 自动扫描机制
   * @see https://oiyo.js.org/docs/api/config/define-oiyo-config#oiyoconfigscan
   */
  scan: {
    apis: [
      'pinia',
      './src/apis/*.ts',
      './src/stores/*.ts',
      './src/utils/*.ts',
      { from: './src/types/*.ts', types: true },
    ],
  },
  /**
   * 小程序 IDE 配置
   * @see https://oiyo.js.org/docs/api/config/define-oiyo-config#ide
   */
  ide: {
    open: true,
  },
})

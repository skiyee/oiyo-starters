import { defineOiyoConfig } from 'oiyo/config'

/**
 * oiyo 框架配置
 * @see https://oiyo.js.org/docs/api/config/define-oiyo-config
 */
export default defineOiyoConfig({
  scan: {
    components: [
      '@wot-ui/ui/components/**/*.vue',
      {
        from: 'uni-echarts',
        only: [{ name: 'default', as: 'UniEcharts' }],
      },
    ],
    apis: [
      'pinia',
      { from: '@wot-ui/ui', types: true },

      './src/apis/*.ts',
      './src/utils/*.ts',
      './src/stores/*.ts',
      { from: './src/types/*.ts', types: true },
    ],
  },
  ide: {
    open: true,
  },
})

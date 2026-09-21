import { defineOiyoConfig } from '@skiyee/oiyo/config'

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
      'apis/*.ts',
      'utils/*.ts',
      'stores/*.ts',
      { from: 'types/*.ts', types: true },

      'pinia',
      { from: '@wot-ui/ui', types: true },
    ],
  },
  ide: {
    open: true,
  },
})

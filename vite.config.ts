import OiyoPlugin from '@skiyee/oiyo/plugin'
import { UniEcharts } from 'uni-echarts/vite'
import UniUnoCSS from 'uni-unocss'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    exclude: ['@wot-ui/ui', 'uni-echarts'],
  },
  plugins: [
    UniUnoCSS(),
    UniEcharts(),
    OiyoPlugin(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    host: true,
  },
})

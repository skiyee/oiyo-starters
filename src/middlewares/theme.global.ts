/**
 * 全局中间件：每次导航前初始化主题
 */
import { useThemeStore } from '~/stores/theme'

export default defineRouteMiddleware(() => {
  useThemeStore().initTheme()
})

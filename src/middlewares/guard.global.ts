/**
 * 全局守卫：拦截受保护页面，需要用户确认后才放行
 * @see https://oiyo.js.org/docs/manual/page/middleware
 */
import type { RootContext } from '~/types/root-context'

export default defineRouteMiddleware(async (to) => {
  if (to.path !== '/packages/features/router/demo-protected') {
    return
  }

  const { dialog } = useRootContext<RootContext>()

  const allowed = await new Promise<boolean>((resolve) => {
    dialog.confirm({
      title: '守卫拦截演示',
      msg: '这是一个受保护的页面，需要确认后才能访问',
      confirmButtonText: '允许访问',
      cancelButtonText: '取消',
      success: () => resolve(true),
      fail: () => resolve(false),
    })
  })

  if (!allowed) {
    console.log('❌ 用户取消访问，阻止导航')
    return false
  }
  console.log('✅ 用户确认访问，允许导航')
})

/**
 * 读取当前页面路由信息
 */

export function useCurrentRoute() {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as { route?: string; options?: Record<string, string> } | undefined

  const currentRoute = readonly({
    path: page?.route ? `/${page.route}` : '',
    query: page?.options ?? {},
  })

  return {
    currentRoute,
  }
}

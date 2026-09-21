export interface TabbarItem {
  name: string;
  value?: number;
  active: boolean;
  title: string;
  icon: string;
  path: string;
}

const tabbarItems = ref<TabbarItem[]>([
  { name: 'home', active: true, title: '首页', icon: 'home', path: 'pages/home/index' },
  { name: 'about', active: false, title: '关于', icon: 'user', path: 'pages/about/index' },
])

export function useTabbar() {
  const tabbarList = computed(() => tabbarItems.value)

  const activeTabbar = computed(() => {
    const item = tabbarItems.value.find(item => item.active)
    return item || tabbarItems.value[0]
  })

  const getTabbarItemValue = (name: string) => {
    const item = tabbarItems.value.find(item => item.name === name)
    return item?.value
  }

  const setTabbarItem = (name: string, value: number) => {
    const tabbarItem = tabbarItems.value.find(item => item.name === name)
    if (tabbarItem) {
      tabbarItem.value = value
    }
  }

  const setTabbarItemActive = (name: string) => {
    tabbarItems.value.forEach((item) => {
      if (item.name === name) {
        item.active = true
      }
      else {
        item.active = false
      }
    })
  }

  const getTabbarPath = (name: string) => {
    const item = tabbarItems.value.find(item => item.name === name)
    return item ? `/${item.path}` : `/${tabbarItems.value[0]?.path ?? ''}`
  }

  const setTabbarActiveByPath = (path: string) => {
    const normalized = path.startsWith('/') ? path.slice(1) : path
    const item = tabbarItems.value.find(item => item.path === normalized)
    if (item) {
      setTabbarItemActive(item.name)
    }
  }

  return {
    tabbarList,
    activeTabbar,
    getTabbarItemValue,
    setTabbarItem,
    setTabbarItemActive,
    getTabbarPath,
    setTabbarActiveByPath,
  }
}

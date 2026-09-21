<script lang="ts" setup>
const { activeTabbar, getTabbarItemValue, setTabbarItemActive, tabbarList, getTabbarPath, setTabbarActiveByPath } = useTabbar()

function handleTabbarChange({ value }: { value: string }) {
  setTabbarItemActive(value)
  uni.switchTab({ url: getTabbarPath(value) })
}

onMounted(() => {
  // #ifdef APP
  uni.hideTabBar()
  // #endif
  nextTick(() => {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1] as { route?: string } | undefined
    if (page?.route) {
      setTabbarActiveByPath(page.route)
    }
  })
})
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <slot />
  <WdGap safe-area-bottom height="var(--wot-tabbar-height, 50px)" />
  <WdTabbar
    :model-value="activeTabbar!.name" bordered safe-area-inset-bottom fixed
    @change="handleTabbarChange"
  >
    <WdTabbarItem
      v-for="(item, index) in tabbarList" :key="index" :name="item.name"
      :value="getTabbarItemValue(item.name)" :title="item.title" :icon="item.icon"
    />
  </WdTabbar>
</template>

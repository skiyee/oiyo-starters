<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  type: 'home',
  name: 'home',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
  },
  tab: {
    index: 0,
  },
})

const { theme, toast } = useRootContext<RootContext>()

const isDark = computed({
  get() {
    return theme.theme === 'dark'
  },
  set() {
    theme.toggleTheme()
  },
})

const showThemeColorSheet = ref(false)

function openThemeColorPicker() {
  showThemeColorSheet.value = true
}

function closeThemeColorPicker() {
  showThemeColorSheet.value = false
}

// 处理主题色选择
function handleThemeColorSelect(option: ThemeColorOption) {
  theme.setThemeColor(option)
  closeThemeColorPicker()
}

// 页面跳转方法
function navigateTo(url: string) {
  uni.navigateTo({ url })
}

function openUrl(url: string) {
  // #ifdef H5
  window.open(url, '_blank')
  // #endif
  // #ifdef MP
  uni.setClipboardData({
    data: url,
    showToast: false,
    success: () => {
      uni.hideToast()
      toast.success({ msg: `网址 ${url} 已复制到剪贴板` })
    },
  })
  // #endif
}
</script>

<template>
  <view class="box-border py-3">
    <view class="mx-3 box-border rounded-3 px-4 py-6 text-center wot-bg-filled-oppo">
      <text class="mb-3 block text-left text-5 font-bold wot-text-text-main">
        Oiyo Starter
      </text>
      <text class="mb-3 block text-left text-30rpx leading-relaxed wot-text-text-secondary">
        ⚡️ 由 oiyo 框架赋能的 wot-stater 快速启动模板
      </text>
      <text class="block text-left text-3 leading-relaxed wot-text-text-auxiliary">
        背靠 Oiyo、Wot UI 团队，告别 HBuilderX ，拥抱现代前端开发工具链
      </text>
    </view>

    <DemoBlock title="基础设置" transparent>
      <WdCellGroup custom-class="border rounded-2! overflow-hidden">
        <WdCell title="暗黑模式">
          <WdSwitch v-model="isDark" size="18px" />
        </WdCell>
        <WdCell title="跟随系统">
          <WdButton size="small" @click="theme.setFollowSystem(true)">
            跟随系统
          </WdButton>
        </WdCell>
        <WdCell title="选择主题色" is-link @click="openThemeColorPicker">
          <view class="flex items-center justify-end gap-2">
            <view
              class="h-4 w-4 rounded-full"
              :style="{ backgroundColor: theme.currentThemeColor.primary }"
            />
            <text>{{ theme.currentThemeColor.name }}</text>
          </view>
        </WdCell>
      </WdCellGroup>
    </DemoBlock>

    <DemoBlock title="工具链介绍" transparent>
      <WdCellGroup custom-class="border rounded-2! overflow-hidden">
        <WdCell title="🍊 Oiyo 框架" is-link @click="openUrl('https://oiyo.js.org/')" />
        <WdCell title="🧩 WotUI 组件库" is-link @click="openUrl('https://wot-ui.cn/')" />
        <WdCell title="🚦 Router 路由管理" is-link @click="navigateTo('/packages/features/router/index')" />
        <WdCell title="🎨 Icon 图标" is-link @click="navigateTo('/packages/features/icon/index')" />
        <WdCell title="✨ Unocss 原子化" is-link @click="navigateTo('/packages/features/styles/index')" />
        <WdCell title="🍍 Pinia 持久化" is-link @click="navigateTo('/packages/features/pinia/index')" />
        <WdCell title="💬 Fedback 反馈组件" is-link @click="navigateTo('/packages/features/feedback/index')" />
        <WdCell title="🔄 CI/CD 持续集成" is-link @click="navigateTo('/packages/features/ci/index')" />
        <WdCell title="📊 Uni Echarts 图表" is-link @click="navigateTo('/packages/echarts/index')" />
      </WdCellGroup>
    </DemoBlock>

    <!-- 主题色选择 ActionSheet -->
    <WdActionSheet
      v-model="showThemeColorSheet"
      title="选择主题色"
      :close-on-click-action="true"
      @cancel="closeThemeColorPicker"
    >
      <view class="px-4 pb-4">
        <view
          v-for="option in themeColorOptions"
          :key="option.value"
          class="flex items-center justify-between border-b py-3 wot-border-border-main last:border-b-0"
          @click="handleThemeColorSelect(option)"
        >
          <view class="flex items-center gap-3">
            <view
              class="h-6 w-6 border-2 rounded-full wot-border-border-main"
              :style="{ backgroundColor: option.primary }"
            />
            <text class="text-4 wot-text-text-main">
              {{ option.name }}
            </text>
          </view>
          <WdIcon
            v-if="theme.currentThemeColor.value === option.value"
            name="check"
            :color="option.primary"
            size="20px"
          />
        </view>
      </view>
      <WdGap :height="50" />
    </WdActionSheet>
  </view>
</template>

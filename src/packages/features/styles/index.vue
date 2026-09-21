<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  name: 'styles',
  style: {
    navigationBarTitleText: 'UnoCSS 演示',
  },
})

/**
 * 消费全局根部上下文
 * @see https://oiyo.js.org/docs/manual/shell/root-context
 */
const { toast } = useRootContext<RootContext>()

// 演示状态
const animationState = ref(false)

// UnoCSS 核心特性
const unocssFeatures = ref([
  {
    icon: '⚡',
    title: '即时按需',
    desc: '只生成你使用的CSS',
    example: 'text-red-500 bg-blue-100',
  },
  {
    icon: '🎨',
    title: '完全可定制',
    desc: '灵活的配置和预设',
    example: 'custom-color-brand',
  },
  {
    icon: '🔧',
    title: '预设丰富',
    desc: '内置Tailwind、Windi等预设',
    example: '@unocss/preset-wind',
  },
  {
    icon: '🚀',
    title: '性能优异',
    desc: '极快的构建速度',
    example: '< 200ms',
  },
])

// 颜色系统演示
const colorCategories = ref([
  {
    name: '灰色系',
    colors: [
      { name: 'gray-50', class: 'wot-bg-bg', value: '#f9fafb' },
      { name: 'gray-100', class: 'bg-gray-100', value: '#f3f4f6' },
      { name: 'gray-200', class: 'bg-gray-200', value: '#e5e7eb' },
      { name: 'gray-300', class: 'bg-gray-300', value: '#d1d5db' },
      { name: 'gray-400', class: 'bg-gray-400', value: '#9ca3af' },
      { name: 'gray-500', class: 'wot-bg-bg0', value: '#6b7280' },
    ],
  },
  {
    name: '主题色',
    colors: [
      { name: 'blue-500', class: 'bg-blue-500', value: '#3b82f6' },
      { name: 'green-500', class: 'bg-green-500', value: '#10b981' },
      { name: 'red-500', class: 'bg-red-500', value: '#ef4444' },
      { name: 'yellow-500', class: 'bg-yellow-500', value: '#f59e0b' },
      { name: 'purple-500', class: 'bg-purple-500', value: '#8b5cf6' },
      { name: 'pink-500', class: 'bg-pink-500', value: '#ec4899' },
    ],
  },
])

// 布局演示数据
const layoutExamples = ref([
  {
    title: 'Flex 居中',
    code: 'flex items-center justify-center',
    class: 'flex items-center justify-center h-20 bg-blue-100 rounded-2 text-blue-800',
  },
  {
    title: 'Grid 网格',
    code: 'grid grid-cols-3 gap-4',
    class: 'grid grid-cols-3 gap-2',
  },
  {
    title: 'Space Between',
    code: 'flex justify-between items-center',
    class: 'flex justify-between items-center h-16 bg-green-100 rounded-2 px-4 text-green-800',
  },
])

// 间距系统
const spacingExamples = ref([
  { name: 'p-1', value: '4px', class: 'p-1 bg-red-100 inline-block m-1 rounded' },
  { name: 'p-2', value: '8px', class: 'p-2 bg-blue-100 inline-block m-1 rounded' },
  { name: 'p-4', value: '16px', class: 'p-4 bg-green-100 inline-block m-1 rounded' },
  { name: 'p-6', value: '24px', class: 'p-6 bg-yellow-100 inline-block m-1 rounded' },
  { name: 'p-8', value: '32px', class: 'p-8 bg-purple-100 inline-block m-1 rounded' },
])

// 字体系统
const fontExamples = ref([
  { name: 'text-xs', size: '12px', class: 'text-xs' },
  { name: 'text-sm', size: '14px', class: 'text-sm' },
  { name: 'text-base', size: '16px', class: 'text-base' },
  { name: 'text-lg', size: '18px', class: 'text-lg' },
  { name: 'text-xl', size: '20px', class: 'text-xl' },
  { name: 'text-2xl', size: '24px', class: 'text-2xl' },
  { name: 'text-3xl', size: '30px', class: 'text-3xl' },
])

// 阴影和效果
const effectExamples = ref([
  { name: 'shadow-sm', class: 'shadow-sm wot-bg-filled-oppo p-4 rounded-2 mb-3' },
  { name: 'shadow', class: 'shadow wot-bg-filled-oppo p-4 rounded-2 mb-3' },
  { name: 'shadow-md', class: 'shadow-md wot-bg-filled-oppo p-4 rounded-2 mb-3' },
  { name: 'shadow-lg', class: 'shadow-lg wot-bg-filled-oppo p-4 rounded-2 mb-3' },
  { name: 'shadow-xl', class: 'shadow-xl wot-bg-filled-oppo p-4 rounded-2 mb-3' },
])

// 切换动画
function toggleAnimation() {
  animationState.value = !animationState.value
  toast.success({ msg: `动画状态: ${animationState.value ? '开启' : '关闭'}` })
}

// 复制代码
function copyCode(code: string) {
  uni.setClipboardData({
    data: code,
    showToast: false,
    success: () => {
      uni.hideToast()
      toast.success({ msg: '代码已复制到剪贴板' })
    },
  })
}

// 链接导航处理
function handleNavigate(url: string) {
  // #ifdef H5
  window.open(url, '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: url,
    showToast: false,
    success: () => {
      uni.hideToast()
      toast.success({ msg: `${url} 已复制到剪贴板` })
    },
  })
  // #endif
}
</script>

<template>
  <view class="min-h-screen py-3">
    <!-- 头部介绍 -->
    <view class="mx-3 mb-3">
      <view class="rounded-3 px-5 py-8 text-center wot-bg-filled-oppo">
        <view class="mb-3 text-10">
          🎨
        </view>
        <view class="mb-2 text-6 font-bold wot-text-text-main">
          UnoCSS 原子化CSS
        </view>
        <view class="mb-2 text-3.5 leading-relaxed wot-text-text-secondary">
          即时按需的原子化CSS引擎
        </view>
        <view class="text-3 wot-text-text-secondary">
          具有高性能且极具灵活性的即时原子化CSS引擎
        </view>
      </view>
    </view>

    <!-- UnoCSS 核心特性 -->
    <DemoBlock title="UnoCSS 核心特性" transparent>
      <view class="grid grid-cols-2 gap-3">
        <view
          v-for="feature in unocssFeatures"
          :key="feature.title"
          class="rounded-2 p-4 wot-bg-filled-oppo"
        >
          <view class="mb-2 text-6">
            {{ feature.icon }}
          </view>
          <view class="mb-1 text-3.5 font-bold wot-text-text-main">
            {{ feature.title }}
          </view>
          <view class="mb-2 text-3 leading-snug wot-text-text-secondary">
            {{ feature.desc }}
          </view>
          <view class="rounded px-2 py-1 text-2.5 font-mono wot-text-text-secondary">
            {{ feature.example }}
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 颜色系统 -->
    <DemoBlock title="颜色系统" transparent>
      <view
        v-for="category in colorCategories"
        :key="category.name"
        class="mb-4 last:mb-0"
      >
        <view class="mb-3 text-4 font-bold wot-text-text-main">
          {{ category.name }}
        </view>
        <view class="grid grid-cols-3 gap-2">
          <view
            v-for="color in category.colors"
            :key="color.name"
            class="overflow-hidden rounded-2 shadow-sm wot-bg-filled-oppo"
            @click="copyCode(color.class)"
          >
            <view :class="color.class" class="h-12 w-full" />
            <view class="p-2">
              <view class="text-2.5 font-mono wot-text-text-main">
                {{ color.name }}
              </view>
              <view class="text-2 wot-text-text-secondary">
                {{ color.value }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 布局系统 -->
    <DemoBlock title="布局系统" transparent>
      <view class="space-y-4">
        <view
          v-for="example in layoutExamples"
          :key="example.title"
          class="rounded-2 p-4 wot-bg-filled-oppo"
        >
          <view class="mb-3 flex items-center justify-between">
            <view class="text-4 font-bold wot-text-text-main">
              {{ example.title }}
            </view>
            <view class="rounded px-2 py-1 text-2.5 font-mono wot-text-text-secondary" @click="copyCode(example.code)">
              {{ example.code }}
            </view>
          </view>
          <view v-if="example.title === 'Flex 居中'" :class="example.class">
            <text class="text-3.5">
              居中内容
            </text>
          </view>
          <view v-else-if="example.title === 'Grid 网格'" :class="example.class">
            <view
              v-for="n in 6"
              :key="n"
              class="rounded bg-blue-100 p-2 text-center text-3 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {{ n }}
            </view>
          </view>
          <view v-else :class="example.class">
            <text class="text-3.5">
              左侧
            </text>
            <text class="text-3.5">
              右侧
            </text>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 间距系统 -->
    <DemoBlock title="间距系统" transparent>
      <view class="rounded-2 p-4 wot-bg-filled-oppo">
        <view class="mb-3 text-4 font-bold wot-text-text-main">
          内边距 (Padding)
        </view>
        <view class="mb-4 text-3 leading-relaxed wot-text-text-secondary">
          点击下方色块复制对应的 padding 类名
        </view>
        <view class="flex flex-wrap items-center gap-2">
          <view
            v-for="spacing in spacingExamples"
            :key="spacing.name"
            :class="spacing.class"
            class="cursor-pointer"
            @click="copyCode(spacing.name)"
          >
            <text class="text-2.5 font-mono wot-text-text-secondary">
              {{ spacing.name }}
            </text>
          </view>
        </view>
        <view class="mt-4 text-2.5 wot-text-text-secondary">
          💡 提示：p-1 = 4px, p-2 = 8px, p-4 = 16px, p-6 = 24px, p-8 = 32px
        </view>
      </view>
    </DemoBlock>

    <!-- 字体系统 -->
    <DemoBlock title="字体系统" transparent>
      <view class="rounded-2 p-4 wot-bg-filled-oppo">
        <view class="mb-3 text-4 font-bold wot-text-text-main">
          字体大小
        </view>
        <view class="space-y-3">
          <view
            v-for="font in fontExamples"
            :key="font.name"
            class="flex items-center justify-between border-b pb-2 wot-border-border-main last:border-b-0"
            @click="copyCode(font.name)"
          >
            <text :class="font.class" class="wot-text-text-main">
              字体演示文字
            </text>
            <view class="flex items-center space-x-2">
              <text class="text-2.5 wot-text-text-secondary">
                {{ font.size }}
              </text>
              <text class="rounded px-2 py-1 text-2.5 font-mono wot-text-text-secondary">
                {{ font.name }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 阴影效果 -->
    <DemoBlock title="阴影效果" transparent>
      <view class="space-y-3">
        <view
          v-for="effect in effectExamples"
          :key="effect.name"
          :class="effect.class"
          @click="copyCode(effect.name)"
        >
          <view class="flex items-center justify-between">
            <text class="text-3.5 wot-text-text-main">
              阴影效果演示
            </text>
            <text class="rounded px-2 py-1 text-2.5 font-mono wot-text-text-secondary">
              {{ effect.name }}
            </text>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 交互效果 -->
    <DemoBlock title="交互效果" transparent>
      <view class="space-y-4">
        <!-- 悬停效果 -->
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            悬停效果
          </view>
          <view class="grid grid-cols-2 gap-3">
            <view class="rounded-2 bg-blue-100 p-4 text-center transition-all duration-300 active:scale-95 hover:scale-105 hover:bg-blue-200">
              <text class="text-3 text-blue-800">
                悬停变色
              </text>
            </view>
            <view class="rounded-2 bg-green-100 p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <text class="text-3 text-green-800">
                悬停上浮
              </text>
            </view>
          </view>
          <view class="mt-3 rounded p-2 text-2.5 font-mono wot-text-text-secondary" @click="copyCode('hover:bg-blue-200 hover:scale-105 transition-all duration-300')">
            hover:bg-blue-200 hover:scale-105 transition-all duration-300
          </view>
        </view>

        <!-- 动画效果 -->
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            动画效果
          </view>
          <WdButton type="primary" block @click="toggleAnimation">
            切换动画状态
          </WdButton>
          <view class="mt-4 flex justify-center">
            <view
              class="rounded-2 p-6 text-center transition-all duration-500 ease-in-out"
              :class="[
                animationState
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white transform rotate-12 scale-110 shadow-lg'
                  : 'wot-text-text-main transform rotate-0 scale-100 shadow-sm  ',
              ]"
            >
              <text class="text-4 font-bold">
                动画演示
              </text>
            </view>
          </view>
          <view class="mt-3 rounded p-2 text-2.5 leading-relaxed font-mono wot-text-text-secondary" @click="copyCode('transition-all duration-500 ease-in-out transform rotate-12 scale-110')">
            transition-all duration-500 ease-in-out\n
            transform rotate-12 scale-110
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 响应式设计 -->
    <DemoBlock title="响应式设计" transparent>
      <view class="rounded-2 p-4 wot-bg-filled-oppo">
        <view class="mb-3 text-4 font-bold wot-text-text-main">
          响应式断点
        </view>
        <view class="mb-4 text-3 leading-relaxed wot-text-text-secondary">
          UnoCSS 支持响应式断点，可以根据屏幕尺寸应用不同样式
        </view>
        <view class="mb-4 rounded-2 bg-red-100 p-4 text-center dark:bg-red-900/30 lg:bg-yellow-100 md:bg-blue-100 sm:bg-green-100 dark:lg:bg-yellow-900/30 dark:md:bg-blue-900/30 dark:sm:bg-green-900/30">
          <text class="text-3.5 font-bold wot-text-text-main">
            响应式背景色
          </text>
        </view>
        <view class="grid grid-cols-1 gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          <view
            v-for="n in 8"
            :key="n"
            class="rounded bg-purple-100 p-3 text-center text-3 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
          >
            项目 {{ n }}
          </view>
        </view>
        <view class="mt-4 rounded p-2 text-2.5 leading-relaxed font-mono wot-text-text-secondary" @click="copyCode('grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4')">
          grid-cols-1 sm:grid-cols-2\n
          md:grid-cols-3 lg:grid-cols-4
        </view>
      </view>
    </DemoBlock>

    <!-- 实用工具类 -->
    <DemoBlock title="实用工具类" transparent>
      <view class="space-y-4">
        <!-- 显示隐藏 -->
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            显示/隐藏
          </view>
          <view class="mb-3 flex flex-wrap gap-2">
            <view class="rounded bg-green-100 px-3 py-2 text-3 text-green-800">
              显示 (block)
            </view>
            <view class="rounded bg-blue-100 px-3 py-2 text-3 text-blue-800">
              内联 (inline)
            </view>
            <view class="rounded bg-purple-100 px-3 py-2 text-3 text-purple-800">
              弹性 (flex)
            </view>
          </view>
          <view class="rounded p-2 text-2.5 font-mono wot-text-text-secondary" @click="copyCode('block inline flex hidden')">
            block inline flex hidden
          </view>
        </view>

        <!-- 定位 -->
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            定位系统
          </view>
          <view class="relative h-24 rounded-2 bg-gray-100">
            <view class="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-2.5 text-white">
              top-2 left-2
            </view>
            <view class="absolute right-2 top-2 rounded bg-blue-500 px-2 py-1 text-2.5 text-white">
              top-2 right-2
            </view>
            <view class="absolute bottom-2 left-2 rounded bg-green-500 px-2 py-1 text-2.5 text-white">
              bottom-2 left-2
            </view>
            <view class="absolute bottom-2 right-2 rounded bg-purple-500 px-2 py-1 text-2.5 text-white wot-bg-warning">
              bottom-2 right-2
            </view>
          </view>
          <view class="mt-3 rounded p-2 text-2.5 font-mono wot-text-text-secondary" @click="copyCode('absolute relative top-2 left-2 right-2 bottom-2')">
            absolute relative top-2 left-2 right-2 bottom-2
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 相关链接 -->
    <DemoBlock title="相关链接" transparent>
      <WdCellGroup border custom-class="rounded-2! overflow-hidden">
        <WdCell title="📚 UnoCSS 官方文档" value="unocss.dev" is-link @click="handleNavigate('https://unocss.dev/')" />
        <WdCell title="🐙 GitHub 仓库" value="unocss/unocss" is-link @click="handleNavigate('https://github.com/unocss/unocss')" />
        <WdCell title="🎮 在线演练场" value="在线体验" is-link @click="handleNavigate('https://unocss.dev/play/')" />
        <WdCell title="📖 Tailwind CSS" value="参考文档" is-link @click="handleNavigate('https://tailwindcss.com/docs')" />
        <WdCell title="💡 最佳实践" value="使用指南" is-link @click="handleNavigate('https://unocss.dev/guide/')" />
      </WdCellGroup>
    </DemoBlock>
  </view>
</template>

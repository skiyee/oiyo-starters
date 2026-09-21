<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  name: 'demo-guard',
  style: {
    navigationBarTitleText: '导航守卫演示',
  },
})

function goBack() {
  uni.navigateBack()
}

// 前往受保护页面，触发全局守卫确认拦截
function handleBeforeEach() {
  uni.navigateTo({ url: '/packages/features/router/demo-protected' })
}

// 跳转到中间件触发演示页面，验证全局中间件在每次导航前执行
function demoAfterEachPage() {
  uni.navigateTo({ url: '/packages/features/router/demo-aftereach' })
}
</script>

<template>
  <view class="py-3">
    <!-- 头部 -->
    <view class="mx-3 mb-3">
      <view class="rounded-3 px-5 py-6 text-center wot-bg-filled-oppo">
        <view class="mb-3 text-8">
          🛡️
        </view>
        <view class="mb-2 text-5 font-bold wot-text-text-main">
          导航守卫演示
        </view>
        <view class="text-3.5 wot-text-text-secondary">
          演示全局页面中间件的拦截与触发
        </view>
      </view>
    </view>

    <!-- 中间件演示 -->
    <DemoBlock title="中间件演示" transparent>
      <view class="mb-3 border border-blue-200 rounded-2 bg-blue-50 p-3 dark:bg-blue-900/20">
        <view class="mb-2 text-3.5 text-blue-700 font-bold dark:text-blue-300">
          💡 全局页面中间件
        </view>
        <view class="text-3 text-blue-600 leading-relaxed dark:text-blue-200">
          src/middlewares/ 下的 .global 中间件在每次页面进入前执行：guard.global.ts 拦截受保护页面、theme.global.ts 初始化主题、logger.global.ts 记录导航日志。
        </view>
      </view>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            全局守卫拦截（guard.global.ts）
          </view>
          <view class="mb-3 text-3.5 wot-text-text-secondary">
            进入受保护页面时会触发全局中间件的确认弹窗，确认后才会放行
          </view>
          <WdButton type="warning" block @click="handleBeforeEach">
            🔒 触发守卫拦截
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            全局中间件触发演示
          </view>
          <view class="mb-3 text-3.5 wot-text-text-secondary">
            进入页面会触发 theme.global.ts / logger.global.ts 等全局中间件
          </view>
          <WdButton type="success" block @click="demoAfterEachPage">
            📊 中间件触发演示
          </WdButton>
        </view>
      </view>
    </DemoBlock>

    <!-- 操作按钮 -->
    <DemoBlock title="导航" transparent>
      <view class="px-3">
        <WdButton type="warning" block @click="goBack">
          返回上一页
        </WdButton>
      </view>
    </DemoBlock>
  </view>
</template>

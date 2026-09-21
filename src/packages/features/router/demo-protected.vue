<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  name: 'demo-protected',
  style: {
    navigationBarTitleText: '受保护页面（守卫拦截）',
  },
})

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="min-h-screen py-3">
    <!-- 头部 -->
    <view class="mx-3 mb-3">
      <view class="rounded-3 px-5 py-6 text-center wot-bg-filled-oppo">
        <view class="mb-3 text-8">
          🔒
        </view>
        <view class="mb-2 text-5 font-bold wot-text-text-main">
          受保护页面（守卫拦截）
        </view>
        <view class="text-3.5 wot-text-text-secondary">
          本页面被全局中间件 guard.global.ts 拦截，需要确认弹窗通过后才可进入
        </view>
      </view>
    </view>

    <!-- 内容 -->
    <DemoBlock title="守卫拦截成功" transparent>
      <view class="border border-green-200 rounded-2 bg-green-50 p-4 dark:bg-green-900/20">
        <view class="mb-2 text-4 text-green-700 font-bold dark:text-green-300">
          🎉 恭喜！
        </view>
        <view class="text-3.5 text-green-600 leading-relaxed dark:text-green-200">
          如果你能看到这个页面，说明全局中间件 guard.global.ts 的确认弹窗已经通过！\n
          取消确认会被拦截，无法进入本页面。
        </view>
      </view>
    </DemoBlock>

    <!-- 操作按钮 -->
    <DemoBlock title="导航" transparent>
      <WdButton type="warning" block @click="goBack">
        返回上一页
      </WdButton>
    </DemoBlock>
  </view>
</template>

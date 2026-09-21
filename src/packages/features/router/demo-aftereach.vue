<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
import type { RootContext } from '~/types/root-context'

definePageMeta({
  name: 'demo-aftereach',
  style: {
    navigationBarTitleText: '中间件触发演示',
  },
})

const { toast } = useRootContext<RootContext>()

function goBack() {
  uni.navigateBack()
}

onShow(() => {
  setTimeout(() => toast.show('全局中间件已触发！'), 500)
})
</script>

<template>
  <view class="min-h-screen py-3">
    <!-- 头部 -->
    <view class="mx-3 mb-3">
      <view class="rounded-3 px-5 py-6 text-center wot-bg-filled-oppo">
        <view class="mb-3 text-8">
          📊
        </view>
        <view class="mb-2 text-5 font-bold wot-text-text-main">
          中间件触发演示
        </view>
        <view class="text-3.5 wot-text-text-secondary">
          进入本页会触发全局中间件（logger 记录导航、theme 初始化主题）
        </view>
      </view>
    </view>

    <!-- 内容 -->
    <DemoBlock title="全局中间件触发成功" transparent>
      <view class="border border-green-200 rounded-2 bg-green-50 p-4 dark:bg-green-900/20">
        <view class="mb-2 text-4 text-green-700 font-bold dark:text-green-300">
          🎉 恭喜！
        </view>
        <view class="text-3.5 text-green-600 leading-relaxed dark:text-green-200">
          如果你能看到这个页面，说明全局中间件已经执行了！\n
          打开浏览器控制台（F12 → Console）可以看到 logger 中间件的导航日志。\n
          theme 中间件会在每次导航前初始化主题，页面 onShow 会弹出提示。
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

<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  name: 'demo-string',
  style: {
    navigationBarTitleText: '字符串路径跳转',
  },
})

const { currentRoute } = useCurrentRoute()

function goBack() {
  uni.navigateBack()
}

function pushToObject() {
  uni.navigateTo({ url: '/packages/features/router/demo-object' })
}
</script>

<template>
  <view class="min-h-screen py-3">
    <!-- 头部 -->
    <view class="mx-3 mb-3">
      <view class="rounded-3 px-5 py-6 text-center wot-bg-filled-oppo">
        <view class="mb-3 text-8">
          📝
        </view>
        <view class="mb-2 text-5 font-bold wot-text-text-main">
          字符串路径跳转演示
        </view>
        <view class="text-3.5 wot-text-text-secondary">
          使用 uni.navigateTo({ url: '/path' }) 进行跳转
        </view>
      </view>
    </view>

    <!-- 跳转信息 -->
    <DemoBlock title="跳转信息" transparent>
      <view class="rounded-3 p-4 wot-bg-filled-oppo">
        <view class="mb-3 text-4 font-bold wot-text-text-main">
          当前页面信息
        </view>
        <view class="space-y-2">
          <view class="flex items-center justify-between border-b py-2 wot-border-border-main">
            <text class="text-3.5 wot-text-text-secondary">
              路径:
            </text>
            <text class="text-3.5 font-mono wot-text-text-main">
              {{ currentRoute.path }}
            </text>
          </view>
          <view class="flex items-center justify-between border-b py-2 wot-border-border-main">
            <text class="text-3.5 wot-text-text-secondary">
              跳转方式:
            </text>
            <text class="text-3.5 wot-text-text-main">
              字符串路径
            </text>
          </view>
          <view class="flex items-center justify-between py-2">
            <text class="text-3.5 wot-text-text-secondary">
              代码:
            </text>
            <text class="text-3.5 font-mono wot-text-text-main">
              uni.navigateTo({ url: '/packages/features/router/demo-object' })
            </text>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 操作按钮 -->
    <DemoBlock title="继续演示" transparent>
      <view class="space-y-3">
        <WdButton type="primary" block @click="pushToObject">
          跳转到对象路径演示
        </WdButton>
        <WdButton type="warning" block @click="goBack">
          返回上一页
        </WdButton>
      </view>
    </DemoBlock>
  </view>
</template>

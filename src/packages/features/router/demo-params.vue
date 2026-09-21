<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  name: 'demo-params',
  style: {
    navigationBarTitleText: '参数接收演示',
  },
})

const { currentRoute } = useCurrentRoute()

// 接收参数
const receivedParams = ref({})
const decodedUser = ref(null)

onLoad((option) => {
  console.log('onLoad option:', option)
  receivedParams.value = option || {}

  // 如果有user参数，尝试解码对象
  if (option && option.user) {
    try {
      decodedUser.value = JSON.parse(decodeURIComponent(option.user))
    }
    catch (e) {
      console.error('解码user参数失败:', e)
    }
  }
})

function goBack() {
  uni.navigateBack()
}

function pushToGuard() {
  uni.navigateTo({ url: '/packages/features/router/demo-guard' })
}
</script>

<template>
  <view class="min-h-screen py-3">
    <!-- 头部 -->
    <view class="mx-3 mb-3">
      <view class="rounded-3 px-5 py-6 text-center wot-bg-filled-oppo">
        <view class="mb-3 text-8">
          📥
        </view>
        <view class="mb-2 text-5 font-bold wot-text-text-main">
          params 参数接收演示
        </view>
        <view class="text-3.5 wot-text-text-secondary">
          演示如何接收和处理路由参数
        </view>
      </view>
    </view>

    <!-- 路由信息 -->
    <DemoBlock title="当前路由信息" transparent>
      <view class="rounded-3 p-4 wot-bg-filled-oppo">
        <view class="space-y-2">
          <view class="flex items-center justify-between border-b py-2 wot-border-border-main">
            <text class="text-3.5 wot-text-text-secondary">
              路径:
            </text>
            <text class="text-3.5 font-mono wot-text-text-main">
              {{ currentRoute.path }}
            </text>
          </view>
          <view class="flex items-center justify-between py-2">
            <text class="text-3.5 wot-text-text-secondary">
              接收方式:
            </text>
            <text class="text-3.5 wot-text-text-main">
              onLoad(option)
            </text>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 参数信息 -->
    <DemoBlock title="接收到的参数" transparent>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            原始参数 (option)
          </view>
          <view class="wot-bg-bg border rounded-2 p-3 wot-border-border-main">
            <text class="text-3 font-mono wot-text-text-secondary">
              {{ JSON.stringify(receivedParams, null, 2) }}
            </text>
          </view>
        </view>

        <view v-if="decodedUser" class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            解码后的对象参数
          </view>
          <view class="wot-bg-bg border rounded-2 p-3 wot-border-border-main">
            <text class="text-3 font-mono wot-text-text-secondary">
              {{ JSON.stringify(decodedUser, null, 2) }}
            </text>
          </view>
          <view class="mt-3 text-3.5 wot-text-text-secondary">
            使用 JSON.parse(decodeURIComponent(option.user)) 解码
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- API 说明 -->
    <DemoBlock title="参数传递说明" transparent>
      <view class="rounded-2 p-4 wot-bg-filled-oppo">
        <view class="mb-3 text-4 font-bold wot-text-text-main">
          参数传递方式说明
        </view>
        <view class="mb-3 border border-orange-200 rounded-2 bg-orange-50 p-3 dark:bg-orange-900/20">
          <view class="mb-2 text-3.5 text-orange-700 font-bold dark:text-orange-300">
            ⚠️ 重要说明
          </view>
          <view class="text-3 text-orange-600 leading-relaxed dark:text-orange-200">
            uni-app 中参数统一通过查询字符串传递，页面内用 onLoad(option) 接收；对象参数需 JSON.stringify + encodeURIComponent 序列化
          </view>
        </view>
        <view class="wot-bg-bg border rounded-2 p-3 wot-border-border-main">
          <text class="text-3 leading-relaxed font-mono wot-text-text-secondary">
            // 发送方
            uni.navigateTo({ url: '/demo-params?username=eduardo' })
            // 结果: /demo-params?username=eduardo

            // 对象参数序列化
            uni.navigateTo({ url: '/demo-params?user=' + encodeURIComponent(JSON.stringify(user)) })
            // 接收方
            onLoad((option) => {
            if (option && option.user) {
            const user = JSON.parse(decodeURIComponent(option.user))
            }
            })
          </text>
        </view>
      </view>
    </DemoBlock>

    <!-- 代码示例 -->
    <DemoBlock title="代码示例" transparent>
      <view class="rounded-2 p-4 wot-bg-filled-oppo">
        <view class="mb-3 text-4 font-bold wot-text-text-main">
          接收参数的标准写法
        </view>
        <view class="wot-bg-bg border rounded-2 p-3 wot-border-border-main">
          <text class="text-3 leading-relaxed font-mono wot-text-text-secondary">
            onLoad((option) => {
            if (option && option.username) {
            const username = option.username
            }

            // 对象参数需要解码
            if (option && option.user) {
            const user = JSON.parse(decodeURIComponent(option.user))
            }
            })
          </text>
        </view>
      </view>
    </DemoBlock>

    <!-- 操作按钮 -->
    <DemoBlock title="继续演示" transparent>
      <view class="space-y-3">
        <WdButton type="primary" block @click="pushToGuard">
          跳转到导航守卫演示
        </WdButton>
        <WdButton type="warning" block @click="goBack">
          返回上一页
        </WdButton>
      </view>
    </DemoBlock>
  </view>
</template>

<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  name: 'router',
  style: {
    navigationBarTitleText: '导航与中间件',
  },
})

/**
 * 消费全局根部上下文
 * @see https://oiyo.js.org/docs/manual/shell/root-context
 */
const { toast } = useRootContext<RootContext>()
const { currentRoute } = useCurrentRoute()

// 表单数据
const userId = ref('eduardo')
const searchKeyword = ref('vue')
const userName = ref('小星星')
const userLabel = ref('小熊熊')

// 基础导航方法
function pushByString() {
  // 字符串路径
  uni.navigateTo({ url: '/packages/features/router/demo-string' })
  toast.success({ msg: '使用字符串路径跳转' })
}

function pushByPath() {
  // 带有路径的对象
  uni.navigateTo({ url: '/packages/features/router/demo-object' })
  toast.success({ msg: '使用path对象跳转' })
}

function pushByName() {
  // 直接使用完整路径跳转
  uni.navigateTo({ url: '/packages/features/router/demo-object' })
  toast.success({ msg: '使用路径跳转' })
}

// 参数传递示例
function pushWithParams() {
  if (!userId.value) {
    uni.showToast({
      title: '请输入用户ID',
      icon: 'none',
    })
    return
  }
  // 参数直接拼接在 url 查询串中
  uni.navigateTo({ url: `/packages/features/router/demo-params?username=${userId.value}` })
  toast.success({ msg: `传递参数: ${userId.value}` })
}

function pushWithQuery() {
  if (!searchKeyword.value) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none',
    })
    return
  }
  // 带查询参数
  uni.navigateTo({ url: `/packages/features/router/demo-query?keyword=${searchKeyword.value}&type=framework` })
  toast.success({ msg: `传递查询参数: ${searchKeyword.value}` })
}

// 传递对象参数
function pushWithObjectParams() {
  const user = {
    name: userName.value,
    label: userLabel.value,
  }
  // 对象参数序列化后放入查询串
  uni.navigateTo({ url: `/packages/features/router/demo-params?user=${encodeURIComponent(JSON.stringify(user))}` })
  toast.success({ msg: '传递对象参数(params)' })
}

function pushWithObjectQuery() {
  const user = {
    name: userName.value,
    label: userLabel.value,
  }
  uni.navigateTo({ url: `/packages/features/router/demo-query?user=${encodeURIComponent(JSON.stringify(user))}` })
  toast.success({ msg: '传递对象参数(query)' })
}

// 页面中间件演示
function demoNavigationGuards() {
  toast.success({ msg: '跳转到完整的中间件演示页面' })
  uni.navigateTo({ url: '/packages/features/router/demo-guard' })
}

function demoProtected() {
  toast.success({ msg: '前往受保护页面，触发全局守卫确认拦截' })
  uni.navigateTo({ url: '/packages/features/router/demo-protected' })
}

function demoMiddlewareTrigger() {
  toast.success({ msg: '前往中间件触发演示页面' })
  uni.navigateTo({ url: '/packages/features/router/demo-aftereach' })
}

// uni 导航 API 演示
function demoPush() {
  uni.navigateTo({ url: '/packages/features/router/demo-string' })
  toast.success({ msg: 'uni.navigateTo() - 保留当前页面跳转' })
}

function demoPushTab() {
  uni.switchTab({ url: '/pages/home/index' })
  toast.success({ msg: 'uni.switchTab() - 跳转到tabBar页面' })
}

function demoReplace() {
  uni.redirectTo({ url: '/packages/features/router/demo-object' })
  toast.success({ msg: 'uni.redirectTo() - 替换当前页面' })
}

function demoReplaceAll() {
  uni.reLaunch({ url: '/pages/home/index' })
  toast.success({ msg: 'uni.reLaunch() - 关闭所有页面重新开始' })
}

function demoBack() {
  uni.navigateBack()
  toast.success({ msg: 'uni.navigateBack() - 返回上一页' })
}

// 复制代码到剪贴板
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
          🚀
        </view>
        <view class="mb-2 text-6 font-bold wot-text-text-main">
          Oiyo 页面中间件 · uni 导航
        </view>
        <view class="mb-2 text-3.5 leading-relaxed wot-text-text-secondary">
          uni 原生导航 + 页面进入前的中间件
        </view>
        <view class="text-3 wot-text-text-secondary">
          支持编程式导航、参数传递、全局中间件校验等功能
        </view>
      </view>
    </view>

    <!-- 当前路由信息 -->
    <DemoBlock title="当前路由信息" transparent>
      <view class="rounded-3 p-4 wot-bg-filled-oppo">
        <view class="flex items-center justify-between border-b py-2 wot-border-border-main last:border-b-0">
          <text class="text-3.5 wot-text-text-secondary">
            路径:
          </text>
          <text class="text-3.5 font-mono wot-text-text-main">
            {{ currentRoute.path }}
          </text>
        </view>
        <view class="flex items-center justify-between py-2">
          <text class="text-3.5 wot-text-text-secondary">
            查询:
          </text>
          <text class="break-all text-3.5 font-mono wot-text-text-main">
            {{ JSON.stringify(currentRoute.query) }}
          </text>
        </view>
      </view>
    </DemoBlock>

    <!-- 编程式导航 -->
    <DemoBlock title="编程式导航" transparent>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            基础用法
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.navigateTo({ url: \'/user\' })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              uni.navigateTo({ url: '/user' })
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <view class="grid grid-cols-1 gap-2">
            <WdButton type="primary" size="small" @click="pushByString">
              字符串路径跳转
            </WdButton>
            <WdButton type="success" size="small" @click="pushByPath">
              对象路径跳转
            </WdButton>
            <WdButton type="warning" size="small" @click="pushByName">
              命名路由跳转
            </WdButton>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- uni 导航 API 演示 -->
    <DemoBlock title="uni 导航 API 演示" transparent>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            navigateTo 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            保留当前页面，跳转到应用内的某个页面
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.navigateTo({ url: target })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              uni.navigateTo({ url: target })
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="primary" block @click="demoPush">
            演示 navigateTo 方法
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            switchTab 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面（仅 TabBar 页面可用）
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.switchTab({ url: \'/pages/home/index\' })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              uni.switchTab({ url: '/pages/home/index' })
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="success" block @click="demoPushTab">
            演示 switchTab 方法
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            redirectTo 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            关闭当前页面，跳转到应用内的某个页面
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.redirectTo({ url: \'/user\' })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              uni.redirectTo({ url: '/user' })
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="warning" block @click="demoReplace">
            演示 redirectTo 方法
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            reLaunch 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            关闭所有页面，打开到应用内的某个页面
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.reLaunch({ url: \'/pages/home/index\' })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              uni.reLaunch({ url: '/pages/home/index' })
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="danger" block @click="demoReplaceAll">
            演示 reLaunch 方法
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            navigateBack 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            关闭当前页面，返回上一页面或多级页面
          </view>
          <view class="mb-3 space-y-2">
            <view class="wot-bg-bg flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.navigateBack()')">
              <text class="flex-1 text-3 font-mono wot-text-text-secondary">
                uni.navigateBack()
              </text>
              <WdIcon name="copy" size="16px" color="#666" />
            </view>
            <view class="wot-bg-bg flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.navigateBack({ delta: 2 })')">
              <text class="flex-1 text-3 font-mono wot-text-text-secondary">
                uni.navigateBack({ delta: 2 })
              </text>
              <WdIcon name="copy" size="16px" color="#666" />
            </view>
          </view>
          <WdButton type="info" block @click="demoBack">
            返回上一页
          </WdButton>
        </view>
      </view>
    </DemoBlock>

    <!-- 参数传递 -->
    <DemoBlock title="参数传递" transparent>
      <view class="mb-3 border border-orange-200 rounded-2 bg-orange-50 p-3 dark:bg-orange-900/20">
        <view class="mb-2 text-3.5 text-orange-700 font-bold dark:text-orange-300">
          ⚠️ 重要提示
        </view>
        <view class="text-3 text-orange-600 leading-relaxed dark:text-orange-200">
          uni-app 页面参数统一通过查询字符串（URL ?key=value）传递，页面内用 onLoad(option) 接收；对象参数需 JSON.stringify + encodeURIComponent 序列化。
        </view>
      </view>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            参数传递
          </view>
          <view class="mb-3 text-3.5 wot-text-text-secondary">
            参数直接拼接到 url 查询字符串中
          </view>
          <view class="mb-3">
            <WdInput v-model="userId" placeholder="请输入用户名" />
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.navigateTo({ url: \'/user?name=xxx\' })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              uni.navigateTo({ url: '/user?name=xxx' })
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="primary" block @click="pushWithParams">
            传递参数
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            query 参数
          </view>
          <view class="mb-3 text-3.5 wot-text-text-secondary">
            多个参数用 & 连接，与普通参数写法一致
          </view>
          <view class="mb-3">
            <WdInput v-model="searchKeyword" placeholder="请输入搜索关键词" />
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('uni.navigateTo({ url: \'/user?name=xxx\' })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              uni.navigateTo({ url: '/user?name=xxx' })
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="success" block @click="pushWithQuery">
            传递 query 参数
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            传递对象参数
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            URL有长度限制，复杂对象需要使用 encodeURIComponent 编码
          </view>
          <view class="grid grid-cols-2 mb-3 gap-2">
            <WdInput v-model="userName" placeholder="姓名" />
            <WdInput v-model="userLabel" placeholder="标签" />
          </view>
          <view class="grid grid-cols-2 gap-2">
            <WdButton type="primary" size="small" @click="pushWithObjectParams">
              对象参数
            </WdButton>
            <WdButton type="success" size="small" @click="pushWithObjectQuery">
              对象 query
            </WdButton>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 页面中间件 -->
    <DemoBlock title="页面中间件" transparent>
      <view class="mb-3 border border-blue-200 rounded-2 bg-blue-50 p-3 dark:bg-blue-900/20">
        <view class="mb-2 text-3.5 text-blue-700 font-bold dark:text-blue-300">
          💡 完整演示
        </view>
        <view class="text-3 text-blue-600 leading-relaxed dark:text-blue-200">
          页面中间件在页面进入前执行，支持校验、重定向与导航控制。我们准备了专门的演示页面，包含权限验证与全局触发演示。
        </view>
      </view>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            中间件基础
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            src/middlewares/ 下的 .global 后缀文件自动全局生效，在页面进入前执行
          </view>
          <view class="mb-3 space-y-2">
            <view class="wot-bg-bg flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('// src/middlewares/guard.global.ts\nexport default defineRouteMiddleware((to, from) => {\n  if (to.path === \'/packages/features/router/demo-protected\') {\n    return false // 中止导航\n  }\n  return goTo(\'/pages/login/index\') // 重定向\n})')">
              <text class="flex-1 text-3 font-mono wot-text-text-secondary">
                // src/middlewares/guard.global.ts
                export default defineRouteMiddleware((to, from) => {
                if (to.path === '/packages/features/router/demo-protected') {
                return false // 中止导航
                }
                return goTo('/pages/login/index') // 重定向
                })
              </text>
              <WdIcon name="copy" size="16px" color="#666" />
            </view>
          </view>
          <view class="space-y-2">
            <WdButton type="primary" block @click="demoNavigationGuards">
              🛡️ 进入完整中间件演示
            </WdButton>
            <WdButton type="warning" block @click="demoProtected">
              🔒 前往受保护页
            </WdButton>
            <WdButton type="success" block @click="demoMiddlewareTrigger">
              📊 中间件触发演示
            </WdButton>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 相关链接 -->
    <DemoBlock title="相关链接" transparent>
      <WdCellGroup border custom-class="rounded-2! overflow-hidden">
        <WdCell title="📖 uni-app 页面路由文档" value="页面路由" is-link @click="handleNavigate('https://uniapp.dcloud.net.cn/tutorial/page.html')" />
        <WdCell title="📚 Oiyo 中间件文档" value="页面中间件" is-link @click="handleNavigate('https://oiyo.js.org/docs/manual/page/middleware')" />
        <WdCell title="🐙 Oiyo GitHub" value="项目仓库" is-link @click="handleNavigate('https://github.com/skiyee/oiyo')" />
      </WdCellGroup>
    </DemoBlock>
  </view>
</template>

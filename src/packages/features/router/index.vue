<script setup lang="ts">
/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  name: 'router',
  style: {
    navigationBarTitleText: '路由管理',
  },
})

/**
 * 消费全局根部上下文
 * @see https://oiyo.js.org/docs/manual/shell/root-context
 */
const { toast } = useRootContext<RootContext>()
const router = useRouter()
const route = useRoute()

// 表单数据
const userId = ref('eduardo')
const searchKeyword = ref('vue')
const userName = ref('小星星')
const userLabel = ref('小熊熊')

// 基础导航方法
function pushByString() {
  // 字符串路径
  router.push('/packages/features/router/demo-string')
  toast.success({ msg: '使用字符串路径跳转' })
}

function pushByPath() {
  // 带有路径的对象
  router.push({ path: '/packages/features/router/demo-object' })
  toast.success({ msg: '使用path对象跳转' })
}

function pushByName() {
  // 命名的路由
  router.push({ name: 'demo-object' })
  toast.success({ msg: '使用name跳转' })
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
  // 命名的路由，并加上参数
  router.push({ name: 'demo-params', params: { username: userId.value } })
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
  router.push({ path: '/packages/features/router/demo-query', query: { username: searchKeyword.value } })
  toast.success({ msg: `传递查询参数: ${searchKeyword.value}` })
}

// 传递对象参数
function pushWithObjectParams() {
  const user = {
    name: userName.value,
    label: userLabel.value,
  }
  // 命名路由传递对象参数
  router.push({
    name: 'demo-params',
    params: { user: encodeURIComponent(JSON.stringify(user)) },
  })
  toast.success({ msg: '传递对象参数(params)' })
}

function pushWithObjectQuery() {
  const user = {
    name: userName.value,
    label: userLabel.value,
  }
  // path+query传递对象参数
  router.push({
    path: '/packages/features/router/demo-query',
    query: { user: encodeURIComponent(JSON.stringify(user)) },
  })
  toast.success({ msg: '传递对象参数(query)' })
}

// 导航守卫演示
function demoNavigationGuards() {
  toast.success({ msg: '跳转到完整的导航守卫演示页面' })
  router.push({
    name: 'demo-guard',
  })
}

// Router方法演示
function demoPush() {
  router.push('/packages/features/router/demo-string')
  toast.success({ msg: 'router.push() - 保留当前页面跳转' })
}

function demoPushTab() {
  router.pushTab('/pages/home/index')
  toast.success({ msg: 'router.pushTab() - 跳转到tabBar页面' })
}

function demoReplace() {
  router.replace('/packages/features/router/demo-object')
  toast.success({ msg: 'router.replace() - 替换当前页面' })
}

function demoReplaceAll() {
  router.replaceAll('/pages/home/index')
  toast.success({ msg: 'router.replaceAll() - 关闭所有页面重新开始' })
}

function demoBack() {
  router.back()
  toast.success({ msg: 'router.back() - 返回上一页' })
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
          Uni Router
        </view>
        <view class="mb-2 text-3.5 leading-relaxed wot-text-text-secondary">
          轻量级路由管理解决方案
        </view>
        <view class="text-3 wot-text-text-secondary">
          支持编程式导航、参数传递、导航守卫等功能
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
            {{ route.path }}
          </text>
        </view>
        <view class="flex items-center justify-between border-b py-2 wot-border-border-main last:border-b-0">
          <text class="text-3.5 wot-text-text-secondary">
            名称:
          </text>
          <text class="text-3.5 font-mono wot-text-text-main">
            {{ route.name || '未设置' }}
          </text>
        </view>
        <view class="flex items-center justify-between border-b py-2 wot-border-border-main last:border-b-0">
          <text class="text-3.5 wot-text-text-secondary">
            参数:
          </text>
          <text class="break-all text-3.5 font-mono wot-text-text-main">
            {{ JSON.stringify(route.params) }}
          </text>
        </view>
        <view class="flex items-center justify-between py-2">
          <text class="text-3.5 wot-text-text-secondary">
            查询:
          </text>
          <text class="break-all text-3.5 font-mono wot-text-text-main">
            {{ JSON.stringify(route.query) }}
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
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.push(\'/user\')')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              router.push('/user')
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

    <!-- Router方法演示 -->
    <DemoBlock title="Router方法演示" transparent>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            push 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            保留当前页面，跳转到应用内的某个页面，相当于 uni.navigateTo()
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.push(target)')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              router.push(target)
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="primary" block @click="demoPush">
            演示 push 方法
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            pushTab 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面，相当于 uni.switchTab()
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.pushTab(target)')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              router.pushTab(target)
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="success" block @click="demoPushTab">
            演示 pushTab 方法
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            replace 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            关闭当前页面，跳转到应用内的某个页面，相当于 uni.redirectTo()
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.replace(target)')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              router.replace(target)
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="warning" block @click="demoReplace">
            演示 replace 方法
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            replaceAll 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            关闭所有页面，打开到应用内的某个页面，相当于 uni.reLaunch()
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.replaceAll(target)')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              router.replaceAll(target)
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="danger" block @click="demoReplaceAll">
            演示 replaceAll 方法
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            back 方法
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            关闭当前页面，返回上一页面或多级页面，相当于 uni.navigateBack()
          </view>
          <view class="mb-3 space-y-2">
            <view class="wot-bg-bg flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.back()')">
              <text class="flex-1 text-3 font-mono wot-text-text-secondary">
                router.back()
              </text>
              <WdIcon name="copy" size="16px" color="#666" />
            </view>
            <view class="wot-bg-bg flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.back({ delta: 2 })')">
              <text class="flex-1 text-3 font-mono wot-text-text-secondary">
                router.back({ delta: 2 })
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
          在 Uni Router 中，params 和 query 参数都会以查询字符串形式放在 URL 中，两者在实际效果上并无区别。这种 API 设计主要是为了与 vue-router 保持一致。
        </view>
      </view>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            params 参数
          </view>
          <view class="mb-3 text-3.5 wot-text-text-secondary">
            注意：name 和 params 搭配使用，与 query 效果相同
          </view>
          <view class="mb-3">
            <WdInput v-model="userId" placeholder="请输入用户名" />
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.push({ name: \'user\', params: { username: \'eduardo\' } })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              router.push({ name: 'user', params: { username: 'eduardo' } })
            </text>
            <WdIcon name="copy" size="16px" color="#666" />
          </view>
          <WdButton type="primary" block @click="pushWithParams">
            传递 params 参数
          </WdButton>
        </view>

        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            query 参数
          </view>
          <view class="mb-3 text-3.5 wot-text-text-secondary">
            注意：path 可以与 query 一起使用，与 params 效果相同
          </view>
          <view class="mb-3">
            <WdInput v-model="searchKeyword" placeholder="请输入搜索关键词" />
          </view>
          <view class="wot-bg-bg mb-3 flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.push({ path: \'/user\', query: { username: \'eduardo\' } })')">
            <text class="flex-1 text-3 font-mono wot-text-text-secondary">
              router.push({ path: '/user', query: { username: 'eduardo' } })
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
              对象 params
            </WdButton>
            <WdButton type="success" size="small" @click="pushWithObjectQuery">
              对象 query
            </WdButton>
          </view>
        </view>
      </view>
    </DemoBlock>

    <!-- 导航守卫 -->
    <DemoBlock title="导航守卫" transparent>
      <view class="mb-3 border border-blue-200 rounded-2 bg-blue-50 p-3 dark:bg-blue-900/20">
        <view class="mb-2 text-3.5 text-blue-700 font-bold dark:text-blue-300">
          💡 完整演示
        </view>
        <view class="text-3 text-blue-600 leading-relaxed dark:text-blue-200">
          导航守卫功能比较复杂，我们准备了专门的演示页面，包含实时日志、权限验证、参数检查等完整功能演示。
        </view>
      </view>
      <view class="space-y-3">
        <view class="rounded-2 p-4 wot-bg-filled-oppo">
          <view class="mb-3 text-4 font-bold wot-text-text-main">
            基础守卫 API
          </view>
          <view class="mb-3 text-3.5 leading-relaxed wot-text-text-secondary">
            beforeEach 和 afterEach 是最常用的导航守卫
          </view>
          <view class="mb-3 space-y-2">
            <view class="wot-bg-bg flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.beforeEach((to, from, next) => { next() })')">
              <text class="flex-1 text-3 font-mono wot-text-text-secondary">
                router.beforeEach((to, from, next) => { next() })
              </text>
              <WdIcon name="copy" size="16px" color="#666" />
            </view>
            <view class="wot-bg-bg flex items-center justify-between border rounded-2 p-3 wot-border-border-main" @click="copyCode('router.afterEach((to, from) => {  })')">
              <text class="flex-1 text-3 font-mono wot-text-text-secondary">
                router.afterEach((to, from) => { console.log(to) })
              </text>
              <WdIcon name="copy" size="16px" color="#666" />
            </view>
          </view>
          <WdButton type="primary" block @click="demoNavigationGuards">
            🛡️ 进入完整守卫演示
          </WdButton>
        </view>
      </view>
    </DemoBlock>

    <!-- 相关链接 -->
    <DemoBlock title="相关链接" transparent>
      <WdCellGroup border custom-class="rounded-2! overflow-hidden">
        <WdCell title="📚 Uni Router 文档" value="路由管理" is-link @click="handleNavigate('https://moonofweisheng.github.io/Uni Router/')" />
        <WdCell title="🐙 GitHub 仓库" value="Uni Router" is-link @click="handleNavigate('https://my-uni.wot-ui.cn/')" />
        <WdCell title="📖 uni-app 路由文档" value="页面路由" is-link @click="handleNavigate('https://uniapp.dcloud.net.cn/tutorial/page.html')" />
      </WdCellGroup>
    </DemoBlock>
  </view>
</template>

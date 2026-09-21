<script setup lang="ts">
import { defineStore } from 'pinia'

/**
 * 页面元信息
 * @see https://oiyo.js.org/docs/manual/page/meta
 */
definePageMeta({
  name: 'pinia',
  style: {
    navigationBarTitleText: 'Pinia 演示',
  },
})

/**
 * 消费全局根部上下文
 * @see https://oiyo.js.org/docs/manual/shell/root-context
 */
const { toast } = useRootContext<RootContext>()

const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  return { count, doubleCount, increment, decrement, reset }
})

const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    name: '',
    email: '',
    avatar: '',
    theme: 'light',
  })

  const isLoggedIn = computed(() => !!userInfo.value.name)

  function setUserInfo(info: Partial<typeof userInfo.value>) {
    userInfo.value = { ...userInfo.value, ...info }
  }

  function logout() {
    userInfo.value = { name: '', email: '', avatar: '', theme: 'light' }
  }

  function toggleTheme() {
    userInfo.value.theme = userInfo.value.theme === 'light' ? 'dark' : 'light'
  }

  return { userInfo, isLoggedIn, setUserInfo, logout, toggleTheme }
})

const useTempStore = defineStore('temp', () => {
  const message = ref('')
  function setMessage(msg: string) {
    message.value = msg
  }
  function clear() {
    message.value = ''
  }
  return { message, setMessage, clear }
})

const counterStore = useCounterStore()
const userStore = useUserStore()
const tempStore = useTempStore()

const formName = ref('')
const formEmail = ref('')
const tempMessage = ref('')

const defineStoreExample = 'const useCounterStore = defineStore(\'counter\', () => {\n  const count = ref(0)\n  function increment() { count.value++ }\n  return { count, increment }\n})'
const useStoreExample = 'const counterStore = useCounterStore()\ncounterStore.increment()'

function saveUser() {
  if (!formName.value.trim()) {
    toast.success({ msg: '请输入用户名' })
    return
  }
  userStore.setUserInfo({ name: formName.value, email: formEmail.value })
  toast.success({ msg: '用户信息已保存（会持久化）' })
}

function saveTemp() {
  if (!tempMessage.value.trim()) {
    toast.success({ msg: '请输入消息内容' })
    return
  }
  tempStore.setMessage(tempMessage.value)
  toast.success({ msg: '临时消息已保存（不持久化）' })
}

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
</script>

<template>
  <view class="min-h-screen py-3">
    <view class="mx-3 mb-3">
      <view class="rounded-3 px-5 py-8 text-center wot-bg-filled-oppo">
        <view class="mb-2 text-6 font-bold wot-text-text-main">
          Pinia 演示
        </view>
        <view class="text-3 wot-text-text-secondary">
          状态管理示例；全局反馈已迁移到 useRootContext，不再依赖 Pinia
        </view>
      </view>
    </view>

    <DemoBlock title="计数器 Store" transparent>
      <view class="rounded-2 p-4 wot-bg-filled-oppo">
        <view class="mb-3 text-4 font-bold wot-text-text-main">
          count: {{ counterStore.count }} / double: {{ counterStore.doubleCount }}
        </view>
        <view class="grid grid-cols-3 gap-2">
          <WdButton type="primary" @click="counterStore.increment()">
            +1
          </WdButton>
          <WdButton type="warning" @click="counterStore.decrement()">
            -1
          </WdButton>
          <WdButton type="info" @click="counterStore.reset()">
            重置
          </WdButton>
        </view>
      </view>
    </DemoBlock>

    <DemoBlock title="用户 Store（持久化）" transparent>
      <view class="mb-3 space-y-2">
        <WdInput v-model="formName" label="用户名" placeholder="请输入用户名" />
        <WdInput v-model="formEmail" label="邮箱" placeholder="请输入邮箱" />
      </view>
      <view class="grid grid-cols-2 gap-2 mb-3">
        <WdButton type="primary" @click="saveUser">
          保存用户
        </WdButton>
        <WdButton type="danger" @click="userStore.logout()">
          退出登录
        </WdButton>
      </view>
      <view class="rounded-2 p-3 wot-bg-filled-oppo text-3 wot-text-text-secondary">
        <view>已登录: {{ userStore.isLoggedIn }}</view>
        <view>name: {{ userStore.userInfo.name || '-' }}</view>
        <view>email: {{ userStore.userInfo.email || '-' }}</view>
        <view>theme: {{ userStore.userInfo.theme }}</view>
      </view>
    </DemoBlock>

    <DemoBlock title="临时 Store（不持久化）" transparent>
      <view class="mb-3">
        <WdInput v-model="tempMessage" label="消息" placeholder="请输入消息内容" />
      </view>
      <view class="grid grid-cols-2 gap-2 mb-3">
        <WdButton type="primary" @click="saveTemp">
          保存消息
        </WdButton>
        <WdButton type="warning" @click="tempStore.clear()">
          清空
        </WdButton>
      </view>
      <view class="rounded-2 p-3 wot-bg-filled-oppo text-3 wot-text-text-secondary">
        message: {{ tempStore.message || '-' }}
      </view>
    </DemoBlock>

    <DemoBlock title="代码示例" transparent>
      <view class="rounded-2 p-3 wot-bg-filled-oppo mb-3" @click="copyCode(defineStoreExample)">
        <view class="mb-2 text-3 font-bold wot-text-text-secondary">
          定义 Store
        </view>
        <view class="whitespace-pre-line text-2.5 font-mono wot-text-text-secondary">
          {{ defineStoreExample }}
        </view>
      </view>
      <view class="rounded-2 p-3 wot-bg-filled-oppo" @click="copyCode(useStoreExample)">
        <view class="mb-2 text-3 font-bold wot-text-text-secondary">
          使用 Store
        </view>
        <view class="whitespace-pre-line text-2.5 font-mono wot-text-text-secondary">
          {{ useStoreExample }}
        </view>
      </view>
    </DemoBlock>
  </view>
</template>

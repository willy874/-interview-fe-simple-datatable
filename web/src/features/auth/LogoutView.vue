<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { preciseCountDown } from './utils';
import { useLocalStorage } from '@/libs/storage';

const router = useRouter()
const timeoutSeconds = ref(10)
const storage = useLocalStorage('ACCESS_TOKEN')
let clear: () => void

onMounted(() => {
  storage.value = null
  clear = preciseCountDown({
    timeout: 1000 * 10,
    onTick: ({ currentTime, targetTime }) => {
      timeoutSeconds.value = Math.ceil((targetTime - currentTime) / 1000)
    },
    onEnd: () => {
      router.push('/login')
    },
  })
})
onUnmounted(() => {
  clear()
})

</script>

<template>
  <div class="logout-page">
    <div>
      <div>已登出</div>
      <div>將於 {{ timeoutSeconds }} 秒後自動回到登入頁面</div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.logout-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
  text-align: center;
}
</style>

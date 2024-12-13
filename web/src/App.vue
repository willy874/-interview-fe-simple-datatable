<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="root">
    <RouterView />
  </div>
</template>

<style>
</style>
<style scoped>
.root {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

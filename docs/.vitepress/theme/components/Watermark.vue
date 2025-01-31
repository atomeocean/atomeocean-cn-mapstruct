<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useData } from 'vitepress'

const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
const { isDark } = useData()

watch(() => {
  font.color = isDark.value
      ? 'rgba(255, 255, 255, .15)'
      : 'rgba(0, 0, 0, .15)'
})

</script>

<template>
  <el-watermark :font="font">
    <slot></slot>
  </el-watermark>
</template>

<style scoped>

</style>
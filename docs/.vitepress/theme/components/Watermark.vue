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
  <!--设置水印内容-->
  <el-watermark
      :font="font"
      :content="['Atomeocean', 'Open Source']"
      :z-index="9"
  >
    <slot></slot>
  </el-watermark>
</template>

<style scoped>

</style>
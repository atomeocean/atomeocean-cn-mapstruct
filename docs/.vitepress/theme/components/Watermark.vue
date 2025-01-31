<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useData } from 'vitepress'

const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
const { isDark } = useData()

// 水印图片atomeocean logo地址
const watermarkImageUrl =
    "https://idt1hcljg8t5.objectstorage.us-ashburn-1.oci.customer-oci.com/n/idt1hcljg8t5/b/atomeocean-image-v1/o/atomeocean-static%2Fblue-atomeocean-logo-watermark.webp"

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
      :z-index="-2"
      :width="103"
      :height="100"
      :image=watermarkImageUrl
  >
    <slot></slot>
  </el-watermark>
</template>

<style scoped>

</style>
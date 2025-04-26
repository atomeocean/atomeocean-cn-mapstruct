<script setup lang="ts">
/**
 * 展示谷歌广告的组件
 */
import { onMounted, ref } from 'vue'

const props = defineProps<{
  adClient: string
  adSlot: string
  adFormat?: string  // 废弃时可不传
  style?: string     // 自定义宽高，例：display:block;min-height:90px
}>()

const adRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 懒加载可选：若需 IntersectionObserver
  // const io = new IntersectionObserver(([entry]) => {
  //   if (entry.isIntersecting) {
  //     (window.adsbygoogle = window.adsbygoogle || []).push({})
  //     io.disconnect()
  //   }
  // })
  // io.observe(adRef.value!)

  // 简单写法：直接 push
  (adsbygoogle = window.adsbygoogle || []).push({});
})
</script>

<template>
  <!-- ⭐ 手动配置的广告 unit ⭐ -->
  <ins
      ref="adRef"
      class="adsbygoogle"
      :style="style || 'display:block;text-align:center;'"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat || 'auto'"
  />
</template>
<script setup>
import { ElLink } from 'element-plus'
import 'element-plus/es/components/link/style/css'

const props = defineProps({
  href: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, default: 'default' }, // 可选: primary / success / warning / danger / info
  underline: { type: Boolean, default: true },
  icon: { type: String, default: '' }, // 可选图标类名
  target: { type: String, default: '_blank' }
})
</script>

<template>
  <el-link
      :href="href"
      :type="type"
      :underline="underline"
      :target="target"
      :icon="icon"
  >
    {{ text }}
  </el-link>
</template>
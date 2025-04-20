<script setup>
import { ElLink } from 'element-plus'
import 'element-plus/dist/index.css'          // 建议直接引入完整样式，最稳
import 'element-plus/es/components/link/style/css'

const props = defineProps({
  href: { type: String, required: true },
  text: { type: String, required: true, default: 'Atomeocean Link' },
  type: { type: String, default: 'success' }, // 可选: primary / success / warning / danger / info
  underline: { type: Boolean, default: false },
  icon: { type: String, default: '' }, // 可选图标类名
  target: { type: String, default: '_blank' },
  // disabled: { type: Boolean, default: true },
})

// const linkType = props.type
const linkType = 'warning'
</script>

<template>
  <div class="custom-el-link">
    <el-link
        :href="href"
        :type="linkType"
        :underline="underline"
        :target="target"
        :icon="icon"
    >
      {{ text }}
      {{ type }}
      {{ linkType }}
    </el-link>
  </div>
</template>
<!--确定组件作用域样式，不受vitepress整体样式穿透覆盖-->
<style scoped>

/* 防止 el-link 被 vitepress 的 vp-doc a 样式覆盖 */
/* .vitepress/theme/style.css 或自定义 CSS 文件 */

.custom-el-link a.el-link {
  /* 或精确控制需要重置的属性 */
  color: inherit !important;        /* 继承父级颜色 */
  text-decoration: none !important; /* 移除下划线 */
  font: inherit !important;         /* 继承字体 */
  background: transparent !important;

  /* 保持光标样式一致 */
  cursor: pointer;

  /* 移除点击后的轮廓线 */
  outline: none !important;
}

/* 处理 hover/focus 状态 */
.custom-el-link a.el-link:hover,
.custom-el-link a.el-link:focus {
  text-decoration: none !important;
  color: inherit !important;
}

</style>
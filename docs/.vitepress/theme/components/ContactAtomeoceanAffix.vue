<!--固钉组件，钉在页面固定位置，点击后显示联系我们信息-->
<script setup>
import { onMounted } from "vue";

const contactUsPageUrl = "/about-us/contact"; // 联系我们页面的 URL
let goToContactUsPage;

// 处理跳转到“联系我们”页面
// const goToContactUsPage = () => {
//   window.location.href = contactUsPageUrl;
// };

onMounted(() => {
  goToContactUsPage.value = () => {
    window.location.href = contactUsPageUrl;
  };
});
</script>

<template>
  <el-affix position="bottom" :offset="50">
    <el-button type="primary" class="contact-atomeocean-button" @click="goToContactUsPage">
      📞 联系我们
    </el-button>
  </el-affix>
</template>

<style scoped>
.contact-atomeocean-button {
  z-index: 1000; /* 确保固定按钮在最上层 */
  position: fixed;
  right: 190px; /* 距离右侧 190px */
  border-radius: 50px; /* 让按钮更美观 */
  padding: 10px 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
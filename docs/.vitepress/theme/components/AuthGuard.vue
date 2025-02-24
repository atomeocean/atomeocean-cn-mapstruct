<!--用来包住需要权限控制的文章内容-->
<script setup>
import { useData } from "vitepress";
import { ref, onBeforeMount, computed } from "vue";
import { ElMessage } from "element-plus";
import { clearToken, getToken } from "../utils/tokenUtils.ts";

const adminLoginUrl = "https://admin.atomeocean.com/sign-in"
const userRoleRequestUrl = "https://api-admin.atomeocean.com/admin/user-role/current-user";
const userRoles = ref([])
const hasAccess = ref(false)
const token = getToken()

// 接收frontmatter中定义的参数
const { frontmatter } = useData();
const requiredRoles = computed(() => frontmatter.value.requiredRoles || []);

// 向后端请求获取当前用户的角色信息列表
async function checkUserRole() {
  try {
    const response = await fetch(userRoleRequestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    // 获取后端返回的角色列表
    const {data} = await response.json();

    return data

  } catch (error) {
    ElMessage.error("系统异常，请稍后重试")

    // 清理token cookie
    clearToken()
    // 跳转至登录页
    window.location.href = adminLoginUrl

    return []
  }
}

onBeforeMount(async () => {
  if(token){
    // 利用token向后端请求当前用户角色信息
    userRoles.value = await checkUserRole();

    // 进行角色匹配
    hasAccess.value = userRoles.value.some((role) =>
        requiredRoles.value.includes(role)
    );

    // 如果没有指定权限，需要限制访问
    if(!hasAccess.value){
      ElMessage.error("无访问权限，请联系管理员")
    }
  }
  else {
    // 如果token值为空，则将页面重定向至admin的登录页
    window.location.href = adminLoginUrl
  }
})
</script>

<template>
  <div v-if="hasAccess">
    <slot></slot>
  </div>
</template>

<style scoped></style>
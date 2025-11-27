<!--用来包住需要权限控制的文章内容-->
<script setup>
import { useData } from "vitepress";
import { ref, onBeforeMount, computed } from "vue";
import { ElMessage } from "element-plus";
import { clearToken, getToken } from "../utils/tokenUtils.ts";

// TODO: Replace with your actual Spring Boot Backend URL
const backendLoginUrl = "https://api.atomeocean.com/oauth2/authorization/github";
const userRoleRequestUrl = "https://api-admin.atomeocean.com/admin/user-role/current-user";

const userRoles = ref([])
const hasAccess = ref(false)
const isLoading = ref(true)
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
    return []
  }
}

function login() {
  window.location.href = backendLoginUrl;
}

onBeforeMount(async () => {
  if(token){
    // 利用token向后端请求当前用户角色信息
    userRoles.value = await checkUserRole();

    // 进行角色匹配
    // 如果没有定义 requiredRoles，默认允许访问 (或者根据需求修改)
    if (requiredRoles.value.length === 0) {
        hasAccess.value = true;
    } else {
        hasAccess.value = userRoles.value.some((role) =>
            requiredRoles.value.includes(role)
        );
    }

    // 如果没有指定权限，需要限制访问
    if(!hasAccess.value){
      ElMessage.error("无访问权限，请联系管理员")
    }
  } else {
    hasAccess.value = false;
  }
  isLoading.value = false;
})
</script>

<template>
  <div v-if="isLoading">
    <!-- Loading State -->
    <div class="auth-loading">
      Loading...
    </div>
  </div>
  <div v-else-if="hasAccess">
    <slot></slot>
  </div>
  <div v-else class="auth-login-container">
    <div class="auth-card">
      <h1>Login Required</h1>
      <p>Please sign in with GitHub to access this content.</p>
      <el-button type="primary" size="large" @click="login">
        Sign in with GitHub
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.auth-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
}

.auth-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-card {
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  max-width: 400px;
  width: 100%;
}

.auth-card h1 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.auth-card p {
  margin-bottom: 2rem;
  color: var(--vp-c-text-2);
}
</style>
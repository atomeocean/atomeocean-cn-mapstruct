<!--
  导航栏里的登录状态入口，负责触发登录、登出，并处理回跳带回来的 auth_error。
  整站只要挂一个（挂多个也安全，/auth/me 只发一次）。
-->
<script setup>
import { onMounted } from "vue";
import { useAuth } from "./useAuth";

const { isLoading, isLoggedIn, user, displayName, messages, load, login, logout, consumeAuthError } =
    useAuth();

onMounted(() => {
  // 登录失败时后端把 auth_error 追加在 next 后面，提示完就从 URL 上清掉
  consumeAuthError();
  load();
});
</script>

<template>
  <div class="auth-status">
    <span v-if="isLoading" class="auth-status-loading">…</span>

    <slot v-else-if="!isLoggedIn" name="anonymous" :login="login">
      <el-button size="small" type="primary" @click="login()">
        {{ messages.loginButton }}
      </el-button>
    </slot>

    <slot v-else name="authenticated" :user="user" :display-name="displayName" :logout="logout">
      <span class="auth-status-user" :title="displayName">{{ displayName }}</span>
      <el-button size="small" link @click="logout()">{{ messages.logoutButton }}</el-button>
    </slot>
  </div>
</template>

<style scoped>
.auth-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.auth-status-loading {
  color: var(--vp-c-text-3);
}

.auth-status-user {
  max-width: 10em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* 窄屏导航栏位置紧张，只留操作按钮 */
@media (max-width: 767px) {
  .auth-status-user {
    display: none;
  }
}
</style>

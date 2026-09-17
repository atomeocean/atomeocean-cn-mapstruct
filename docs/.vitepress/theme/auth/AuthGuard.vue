<!--
  用来包住需要权限控制的文章内容，三种登录态分别可用 slot 覆盖。
  用法见同目录 README.md。
-->
<script setup>
import { computed, onMounted } from "vue";
import { useData } from "vitepress";
import { useAuth } from "./useAuth";

const props = defineProps({
  // 放行需要的权限，优先级：本 prop > frontmatter.requiredRoles > 站点配置的 roles
  roles: {
    type: Array,
    default: null,
  },
});

const { frontmatter } = useData();
const { isLoading, isLoggedIn, user, displayName, siteRoles, messages, hasRoles, formatMessage, load, login } =
    useAuth();

const requiredRoles = computed(
    () => props.roles || frontmatter.value.requiredRoles || siteRoles.value
);

const hasAccess = computed(() => isLoggedIn.value && hasRoles(requiredRoles.value));

const forbiddenHint = computed(() =>
    formatMessage(messages.value.forbiddenHint, {
      name: displayName.value,
      roles: requiredRoles.value.join("、"),
    })
);

onMounted(load);
</script>

<template>
  <!-- 构建期和 /auth/me 返回前都是这个状态 -->
  <div v-if="isLoading" class="auth-guard-box">
    <slot name="loading">
      <p class="auth-guard-loading">{{ messages.loading }}</p>
    </slot>
  </div>

  <slot v-else-if="hasAccess"></slot>

  <!-- 未登录：给登录入口 -->
  <div v-else-if="!isLoggedIn" class="auth-guard-box">
    <slot name="anonymous" :login="login">
      <h3>{{ messages.anonymousTitle }}</h3>
      <p>{{ messages.anonymousHint }}</p>
      <el-button type="primary" @click="login()">{{ messages.loginButton }}</el-button>
    </slot>
  </div>

  <!-- 已登录但权限不够：不能显示成未登录，再点一次登录还是进不来 -->
  <div v-else class="auth-guard-box">
    <slot name="forbidden" :user="user" :required-roles="requiredRoles">
      <h3>{{ messages.forbiddenTitle }}</h3>
      <p>{{ forbiddenHint }}</p>
    </slot>
  </div>
</template>

<style scoped>
.auth-guard-box {
  margin: 24px 0;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  text-align: center;
}

.auth-guard-box h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 600;
}

.auth-guard-box p {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
}

.auth-guard-loading {
  margin: 0;
}
</style>

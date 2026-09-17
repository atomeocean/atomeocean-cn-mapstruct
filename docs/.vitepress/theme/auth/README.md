---
createdDate: 2026-09-17
lastUpdated: 2026-09-17
---
# GitHub 登录模块（跨仓库复制件）

版本 **1.0.0**（见 `index.ts` 里的 `AUTH_MODULE_VERSION`）

后端契约：`GET /auth/oauth2/github` 发起登录 → `GET /auth/me` 查登录态 → `POST /auth/oauth2/logout` 登出。
会话是 `.atomeocean.com` 域下的 HttpOnly Cookie，**JS 读不到**，判断登录态只能调 `/auth/me`。

## 这是一个整体复制的目录

本目录在多个 VitePress 仓库之间**整目录复制**。更新时删掉整个 `auth/` 再拷新的，不要逐文件合。

因此有一条硬规矩：**不要在本目录内写站点专属的东西**。站点差异全部通过 `createAuth()` 的参数传进来，
这样覆盖更新永远不会丢配置。需要改样式或文案时用 slot 和 `messages`，不要改这里的源码。

真要改协议（比如后端加了微信登录），改完把 `AUTH_MODULE_VERSION` 升一位，再同步到其他仓库。
用 `grep -r AUTH_MODULE_VERSION` 可以查各仓库现在是哪一版。

## 接入三步

1. 把整个 `auth/` 目录拷到本仓库的 `docs/.vitepress/theme/` 下。
2. 确认已装 `element-plus`（本模块的默认 UI 用了 `el-button` 和 `ElMessage`）。
3. 在 `docs/.vitepress/theme/index.ts` 里注册：

```ts
import { createAuth, AuthStatus } from "./auth";

export default {
  enhanceApp({ app }) {
    app.use(ElementPlus);          // 要在 createAuth 之前
    app.use(createAuth({
      roles: ["MEMBER"],           // 换成本站的放行权限
    }));
  },
  Layout: () => h(DefaultTheme.Layout, null, {
    // 导航栏登录入口，整站挂一个即可
    "nav-bar-content-after": () => h(AuthStatus),
    "nav-screen-content-after": () => h(AuthStatus),
  }),
};
```

## createAuth 配置项

| 参数 | 默认值 | 说明 |
|---|---|---|
| `baseUrl` | `VITE_API_BASE_URL`，再缺省 `https://api-admin.atomeocean.com` | 后端地址。各仓库按自己既有的方式传（logbook 走 `@ao-config/apiEndpoints`，wiki 走 `utils/axios.ts`）。端点路径属于协议，写死在模块里，不用传 |
| `roles` | `["MEMBER"]` | 本站默认放行权限，命中任意一个即放行 |
| `messages` | 见 `useAuth.ts` | 文案覆盖，按需传几条。`forbiddenHint` 支持 `{name}` `{roles}` 占位 |
| `mock` | `VITE_AUTH_MOCK` | 本地开发用，**仅 dev 生效**，生产构建会被摇掉 |

各站放行权限对照：

| 站点 | roles |
|---|---|
| logbook 会员内容 | `["MEMBER"]` |
| internal.atomeocean.com | `["INTERNAL"]` |
| wiki.atomeocean.com | `["WIKI"]` |
| opensource.atomeocean.com | `["MEMBER"]` |

任何账号登录成功都拿到 `MEMBER`；在 `atomeocean-core` team 额外拿 `INTERNAL` + `WIKI`，
在 `atomeocean-light-weight` team 额外拿 `WIKI`。

## AuthGuard

不写就是公开页，要挡内容才包：

```markdown
---
requiredRoles: ["INTERNAL"]
---
<AuthGuard>
正文
</AuthGuard>
```

也可以直接写在组件上，优先级 `:roles` > `frontmatter.requiredRoles` > `createAuth` 的 `roles`：

```markdown
<AuthGuard :roles="['INTERNAL']">
正文
</AuthGuard>
```

三种状态各有 slot，用来替换默认 UI 而不必改本目录：

```vue
<AuthGuard>
  <template #loading>…</template>
  <template #anonymous="{ login }">
    <MyButton @click="login()">登录</MyButton>
  </template>
  <template #forbidden="{ user, requiredRoles }">…</template>
  正文
</AuthGuard>
```

`AuthStatus` 同样有 `#anonymous="{ login }"` 和 `#authenticated="{ user, displayName, logout }"`。

要自己完全接管 UI 就只用 composable：

```ts
const { isLoading, isLoggedIn, user, roles, hasRoles, login, logout, load } = useAuth();
```

## 登录态有三种，UI 必须区分

1. 未登录 → 显示登录入口
2. 已登录但 `roles` 不含本站权限 → 显示「无权限」，**不要**显示成「未登录」，再点登录还是进不来。
   对 internal / wiki 来说这是外部客户的常态，不是边缘情况
3. 已登录且有本站权限 → 正常内容

## 本地开发

本地跑不通真实登录：`localhost` 不在后端 `next` 白名单，且 `localhost` → `atomeocean.com` 是跨站，
`SameSite=Lax` 的 Cookie 不会随 fetch 发送。Cloudflare Pages 的 `*.pages.dev` 预览域名同样不行。

用 mock 验三种 UI 状态（`.env` 放在 `docs/` 下，VitePress 的 vite root 是 `docs/`）：

```
# docs/.env.local
VITE_AUTH_MOCK=anonymous   # 或 member / internal
```

真实链路只能部署到正式域名后验证。

## 已知限制

- **组件挡不住内容**。静态站的 HTML 从边缘发出，JS 只能「藏」不能「防」：被 `AuthGuard` 包住的内容
  不在 HTML 里，但在该页的 JS 产物里，扒一下就能看到。**敏感内容不要放进静态构建再用它挡**，
  真正的拦截要靠 Pages Function 在边缘校验 Cookie。
- Cookie 7 天到期后 `/auth/me` 返回 `status: 401`，没有刷新接口，重新登录即可。
- 被移出 team 的人最多 7 天内仍持有旧权限（JWT 自包含，不做在线校验），已知取舍。
- `next` 参数的来源必须在后端白名单里，否则被静默忽略，登录后落到默认页而不是回到当前页。
  新站接入时记得让后端把域名加进白名单。

import type { App } from "vue";
import AuthGuard from "./AuthGuard.vue";
import AuthStatus from "./AuthStatus.vue";
import { configureAuth, useAuth } from "./useAuth";
import type { AuthMessages, AuthOptions, AuthUser } from "./useAuth";

/** 本目录版本号。跨仓库同步时用 grep AUTH_MODULE_VERSION 对版本，改动本目录请同时改它 */
export const AUTH_MODULE_VERSION = "1.0.0";

/**
 * VitePress 主题插件：写入站点配置并注册 AuthGuard / AuthStatus 全局组件。
 *
 * 在 enhanceApp 里调用一次：
 *   app.use(createAuth({ roles: ["MEMBER"] }))
 */
export function createAuth(options: AuthOptions = {}) {
    return {
        install(app: App) {
            configureAuth(options);
            app.component("AuthGuard", AuthGuard);
            app.component("AuthStatus", AuthStatus);
        },
    };
}

export { useAuth, AuthGuard, AuthStatus };
export type { AuthMessages, AuthOptions, AuthUser };

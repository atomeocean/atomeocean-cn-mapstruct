import { computed, ref } from "vue";
import { ElMessage } from "element-plus";

/** /auth/me 返回的账号信息 */
export interface AuthUser {
    /** 登录账号 id，同一个人不管用哪种方式登录都是这一个 */
    accountId: string;
    /** GitHub 用户名。将来只绑微信的账号为 null，展示名不要只依赖它 */
    login: string | null;
    /** 本次登录用的方式，目前只有 "github" */
    provider: string;
    /** 权限名数组，至少含 MEMBER */
    roles: string[];
    /** 该账号已绑定的登录方式，目前只有 ["github"] */
    linked: string[];
}

/** 可覆盖的文案，{name} {roles} 是占位符 */
export interface AuthMessages {
    loading: string;
    loginButton: string;
    logoutButton: string;
    anonymousTitle: string;
    anonymousHint: string;
    forbiddenTitle: string;
    forbiddenHint: string;
    loggedOut: string;
    logoutFailed: string;
    /** auth_error 码对应的提示 */
    authErrors: Record<string, string>;
}

export interface AuthOptions {
    /** 后端地址，缺省取 VITE_API_BASE_URL，再缺省用生产环境 */
    baseUrl?: string;
    /** 本站默认放行权限，组件上的 roles 和 frontmatter 的 requiredRoles 可逐页覆盖 */
    roles?: string[];
    /** 文案覆盖，按需传几条就行 */
    messages?: Partial<AuthMessages>;
    /** 本地开发 mock，缺省取 VITE_AUTH_MOCK。只在 dev 下生效 */
    mock?: string;
}

const DEFAULT_BASE_URL = "https://api-admin.atomeocean.com";

const defaultMessages: AuthMessages = {
    loading: "正在确认登录状态…",
    loginButton: "使用 GitHub 登录",
    logoutButton: "登出",
    anonymousTitle: "需要登录后查看",
    anonymousHint: "使用 GitHub 账号登录即可阅读本节内容，授权范围只有读取公开资料（read:user）。",
    forbiddenTitle: "无访问权限",
    forbiddenHint: "当前登录账号 {name} 没有本节内容所需的权限（{roles}），如需访问请联系 atomeocean 管理员。",
    loggedOut: "已登出",
    logoutFailed: "登出失败，请稍后重试",
    authErrors: {
        github_unavailable: "暂时无法与 GitHub 确认身份，请稍后重试",
        authorization_request_not_found: "登录会话已过期，请重新点击登录",
        login_failed: "登录失败，请重新点击登录",
    },
};

// VitePress 是 SSG，构建时没有 window / location，碰这些东西前都要守一下
const isClient = typeof window !== "undefined";

// 站点配置，由 createAuth() 在 enhanceApp 阶段写入，早于任何组件渲染
const config = ref({
    baseUrl: DEFAULT_BASE_URL,
    roles: ["MEMBER"],
    messages: defaultMessages,
    mock: undefined as string | undefined,
});

// 登录态，模块级共享：导航栏和页面上的多个 AuthGuard 共用同一次 /auth/me
const user = ref<AuthUser | null>(null);
const loading = ref(true);
let inflight: Promise<void> | null = null;

/** 写入站点配置，只该由 createAuth() 调用 */
export function configureAuth(options: AuthOptions = {}) {
    const baseUrl = options.baseUrl || import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

    config.value = {
        baseUrl: baseUrl.replace(/\/$/, ""),
        roles: options.roles?.length ? options.roles : ["MEMBER"],
        messages: {
            ...defaultMessages,
            ...options.messages,
            authErrors: { ...defaultMessages.authErrors, ...options.messages?.authErrors },
        },
        mock: options.mock ?? import.meta.env.VITE_AUTH_MOCK,
    };
}

/** 端点路径属于协议，不是站点配置，各站只给 baseUrl */
const endpoints = computed(() => ({
    /** 发起 GitHub 登录，必须浏览器顶层跳转，fetch / XHR 跟不了这串 302 */
    githubLogin: `${config.value.baseUrl}/auth/oauth2/github`,
    /** 当前登录用户，HTTP 状态恒为 200，登录态看 body 里的 status */
    me: `${config.value.baseUrl}/auth/me`,
    /** 注意不是 /auth/logout，那个属于 admin 邮箱密码登录那套 */
    logout: `${config.value.baseUrl}/auth/oauth2/logout`,
}));

function formatMessage(template: string, vars: Record<string, string>) {
    return template.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match);
}

/**
 * 本地开发跑不通真实登录：localhost 不在 next 白名单，且 localhost 到 atomeocean.com
 * 是跨站，Lax Cookie 不会随 fetch 发送。开发时用 docs/.env.local 里的
 * VITE_AUTH_MOCK=anonymous | member | internal 验证三种 UI 状态。
 *
 * 返回 undefined 表示没开 mock，走真实请求；生产构建里这段会被摇掉。
 */
function readMockUser(): AuthUser | null | undefined {
    if (!import.meta.env.DEV) return undefined;

    switch (config.value.mock) {
        case "anonymous":
            return null;
        case "member":
            return {
                accountId: "1971234567890123456",
                login: "mock-member",
                provider: "github",
                roles: ["MEMBER"],
                linked: ["github"],
            };
        case "internal":
            return {
                accountId: "1971234567890123457",
                login: "mock-internal",
                provider: "github",
                roles: ["MEMBER", "INTERNAL", "WIKI"],
                linked: ["github"],
            };
        default:
            return undefined;
    }
}

async function requestMe(): Promise<AuthUser | null> {
    const mocked = readMockUser();
    if (mocked !== undefined) return mocked;

    // 身份全在 HttpOnly Cookie 里：credentials 必须带上，不要加自定义 header
    const response = await fetch(endpoints.value.me, {
        method: "GET",
        credentials: "include",
    });
    const body = await response.json();

    // 已登录和未登录 HTTP 都是 200，靠 body 里的 status 区分
    return body?.status === 100 ? (body.data as AuthUser) : null;
}

/** 拉一次 /auth/me，重复调用复用同一个请求 */
function load(): Promise<void> {
    if (!isClient) return Promise.resolve();

    if (!inflight) {
        loading.value = true;
        inflight = requestMe()
            .then((data) => {
                user.value = data;
            })
            .catch((error) => {
                // 网络异常或 CORS 被拒都按未登录处理，不打断页面；
                // 但打条告警，免得后端没放行本站来源时看起来只是「没登录」
                console.warn("[auth] 读取 /auth/me 失败，按未登录处理", error);
                user.value = null;
            })
            .finally(() => {
                loading.value = false;
            });
    }

    return inflight;
}

/**
 * 跳到后端发起 GitHub 登录
 *
 * 必须顶层跳转：这是一串 302（GitHub 授权页 → 回调 → 回到 next），fetch 跟不了；
 * 也不能直接链 github.com，防 CSRF 的 state 参数要后端生成。
 *
 * 注意 next 的来源（scheme://host）要在后端白名单里，否则会被静默忽略，
 * 登录后落到默认页而不是回到当前页。
 */
function login(next?: string) {
    if (!isClient) return;

    const target = next || window.location.href;
    window.location.href = `${endpoints.value.githubLogin}?next=${encodeURIComponent(target)}`;
}

async function logout() {
    if (!isClient) return;

    try {
        await fetch(endpoints.value.logout, { method: "POST", credentials: "include" });
        user.value = null;
        ElMessage.success(config.value.messages.loggedOut);
    } catch (error) {
        ElMessage.error(config.value.messages.logoutFailed);
    }
}

/** 读走 URL 上的 auth_error 并提示，随后清掉，避免刷新重复提示 */
function consumeAuthError() {
    if (!isClient) return;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("auth_error");
    if (!code) return;

    const { authErrors } = config.value.messages;
    ElMessage.error(authErrors[code] || authErrors.login_failed);

    url.searchParams.delete("auth_error");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
}

export function useAuth() {
    const isLoading = computed(() => loading.value);
    const isLoggedIn = computed(() => user.value !== null);
    const roles = computed(() => user.value?.roles || []);
    // login 将来可能为 null，兜一个不依赖它的展示名
    const displayName = computed(() => (user.value ? user.value.login || "已登录用户" : ""));
    /** 本站默认放行权限 */
    const siteRoles = computed(() => config.value.roles);
    const messages = computed(() => config.value.messages);

    /** 要求的权限命中任意一个即放行 */
    const hasRoles = (required: string[]) =>
        required.length === 0 || required.some((role) => roles.value.includes(role));

    return {
        user,
        isLoading,
        isLoggedIn,
        roles,
        displayName,
        siteRoles,
        messages,
        hasRoles,
        formatMessage,
        load,
        login,
        logout,
        consumeAuthError,
    };
}

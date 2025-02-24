import { getCookie } from "./cookieUtils";

/**
 * 从cookie中获取token
 */
export const getToken = () => {
    const tokenKey = "token"
    return getCookie(tokenKey)
}

/**
 * 清空token cookie值
 */
export const clearToken = () => {
    document.cookie = `token=; path=/; domain=.atomeocean.com; max-age=0;`
}
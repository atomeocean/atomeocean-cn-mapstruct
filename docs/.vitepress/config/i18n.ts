import {VitePressI18nOptions} from "vitepress-i18n/dist/types";

/**
 * 配置多语言唯一文件
 */

// 默认语言为简体中文
export const defaultLocale: string = 'zhHans';
export const supportLocales: string[] = [defaultLocale, 'en'] as const;

export const vitePressI18nOptions : VitePressI18nOptions = {
  locales: supportLocales, // support locales
  rootLocale: defaultLocale, // default locale
  label: {
    default: '中文',
    en: 'English',
  },
  searchProvider: 'local',
};
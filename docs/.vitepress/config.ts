import {defineConfig, UserConfig} from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import { withMermaid } from "vitepress-plugin-mermaid";
import { withI18n } from "vitepress-i18n";
import {VitePressI18nOptions} from "vitepress-i18n/dist/types";

// 默认语言为简体中文
const defaultLocale: string = 'zhHans';
const supportLocales: string[] = [defaultLocale, 'en'];

/**
 * sidebar公共配置
 * [vitepress-sidebar](https://github.com/jooy2/vitepress-sidebar)
 */
const commonSidebarConfig =  {
  debugPrint: true,
  collapsed: false,
  capitalizeFirst: true,
  useTitleFromFileHeading: true,
  useTitleFromFrontmatter: true,
  useFolderTitleFromIndexFile: true,
  sortMenusByFrontmatterOrder: true,
};

const vitePressSidebarOptions = [
  ...supportLocales.map((lang) => {
    return {
      ...commonSidebarConfig,
      documentRootPath: `/docs/${lang}`,
      resolvePath: defaultLocale === lang ? '/' : `/${lang}/`,
      ...(defaultLocale === lang ? {} : { basePath: `/${lang}/` })
    };
  })
];

const vitePressI18nOptions : VitePressI18nOptions = {
  locales: supportLocales, // support locales
  debugPrint: true,
  label: {
    default: '中文',
    en: 'English',
  }
};

// 参考 https://vitepress.dev/reference/site-config
const vitePressConfig: UserConfig = {
  // https://vitepress.dev/guide/deploy#setting-a-public-base-path
  base: '/',
  title: 'Atomeocean open source mapstruct',
  description: 'Mapstruct 开源文档',
  head: [
    // 添加谷歌广告 https://juejin.cn/post/7363078360786370599
    ['script', {
      async: 'async',
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5598390904013681',
      crossorigin: 'anonymous',
    }]
  ],
  themeConfig: {
    logo: '/favicon.ico',
    siteTitle: false,
    search: {
      provider: 'local',
    },
    nav: [
      {
        text: 'Websites',
        items: [
          {text: 'Atomeocean', link: 'https://atomeocean.com'},
          {text: 'Cruise', link: 'https://cruise.atomeocean.com'}
        ]
      },
    ],

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    footer: {
      message: 'Atomeocean Open Source Mapstruct',
      copyright: 'Copyright © 2021-present Atomeocean'
    },

    // https://github.com/jooy2/vitepress-sidebar
    sidebar: generateSidebar(vitePressSidebarOptions),
    socialLinks: [
      {icon: 'github', link: 'https://github.com/atomeocean'},
      {icon: 'youtube', link: 'https://www.youtube.com/@atomeocean'},
      {icon: 'linkedin', link: 'https://www.linkedin.com/company/atomeocean'},
    ],
  },
  mermaid: {
    //mermaidConfig !theme here works for light mode since dark theme is forced in dark mode
  },
  ignoreDeadLinks: true
};


export default defineConfig(
  withI18n(
    withMermaid(vitePressConfig),
    vitePressI18nOptions
  ),
);

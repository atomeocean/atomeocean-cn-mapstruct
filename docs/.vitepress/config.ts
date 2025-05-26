import {defineConfig, UserConfig} from 'vitepress'
import {withMermaid} from "vitepress-plugin-mermaid";
import {withI18n} from "vitepress-i18n";
import {vitePressI18nOptions} from "./config/i18n";
import {themeConfig} from "./config/theme";


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
      // src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5598390904013681',
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', // 只加载广告脚本，不启用Auto ads
      crossorigin: 'anonymous',
    }]
  ],
  rewrites: {
    'zhHans/:rest*': ':rest*'
  },
  themeConfig,
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

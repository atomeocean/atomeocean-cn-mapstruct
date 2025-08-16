import {defineConfig, UserConfig} from 'vitepress'
import {withMermaid} from "vitepress-plugin-mermaid";
import {withI18n} from "vitepress-i18n";
import {vitePressI18nOptions} from "./config/i18n";
import {themeConfig} from "./config/theme";
import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite'
import {mapAuthors} from "./theme/constants/contributors";
import {
  InlineLinkPreviewElementTransform
} from "@nolebase/vitepress-plugin-inline-link-preview/markdown-it";
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'

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
  markdown: {
    config: (md) => {
      md.use(InlineLinkPreviewElementTransform)
      // 添加双向链接支持
      md.use(BiDirectionalLinks());
    }
  },
  mermaid: {
    //mermaidConfig !theme here works for light mode since dark theme is forced in dark mode
  },
  ignoreDeadLinks: true,
  // 集成git记录插件
  vite:{
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-inline-link-preview/client',
      ],
    },
    ssr: {
      noExternal: [
        '@nolebase/ui',
        '@nolebase/vitepress-plugin-inline-link-preview',
      ],
    },
    plugins: [
      GitChangelog({
        // 填写在此处填写您的仓库链接
        repoURL: () => 'https://github.com/atomeocean/atomeocean-cn-mapstruct',
        mapAuthors: mapAuthors
      }),
      GitChangelogMarkdownSection({
        sections: {
          // 隐藏git历史修改记录和贡献者列表，只在文章上方展示贡献者列表
          disableChangelog: true,
          disableContributors: true,
        },
      }),
    ],
  },
};

export default defineConfig(
  withI18n(
    withMermaid(vitePressConfig),
    vitePressI18nOptions
  ),
);

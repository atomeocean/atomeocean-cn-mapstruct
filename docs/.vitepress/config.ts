import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
    defineConfig({
      // https://vitepress.dev/guide/deploy#setting-a-public-base-path
      base: '/atomeocean-cn-mapstruct/',
      title: 'Atomeocean open source mapstruct',
      description: 'Mapstruct 开源文档',
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
              { text: 'Atomeocean', link: 'https://atomeocean.com' },
              { text: 'Cruise', link: 'https://cruise.atomeocean.com'}
            ]
          },
        ],

        // https://github.com/jooy2/vitepress-sidebar
        sidebar: generateSidebar({
          documentRootPath: '/docs',
          capitalizeFirst: true, // 用文件命做菜单名字 首字母大写
          collapsed: false,
          collapseDepth: 1, // 初始情况下 只把根目录的文件夹展开
          // 这个配置决定侧边栏是否用文件标题命名
          // useTitleFromFileHeading: true,
        }),
        socialLinks: [
          { icon: 'github', link: 'https://github.com/atomeocean' },
          { icon: 'youtube', link: 'https://www.youtube.com/@atomeocean' }
        ],
      },
      mermaid:{
        //mermaidConfig !theme here works for light mode since dark theme is forced in dark mode
      },
      ignoreDeadLinks: true
    })
);
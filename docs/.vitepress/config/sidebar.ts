import { generateSidebar } from 'vitepress-sidebar'
import { supportLocales, defaultLocale } from './i18n' // 导入i18n配置

/**
 * sidebar公共配置
 * [vitepress-sidebar](https://github.com/jooy2/vitepress-sidebar)
 */

// sidebar参数
export const commonSidebarConfig =  {
  debugPrint: true,
  collapsed: false,
  capitalizeFirst: true,
  useTitleFromFileHeading: true,
  useTitleFromFrontmatter: true,
  useFolderTitleFromIndexFile: true,
  sortMenusByFrontmatterOrder: true,
};

export function generateVitePressSidebar() {
  return generateSidebar(
    // 生成多语言侧边栏
    supportLocales.map((lang) => ({
      ...commonSidebarConfig,
      documentRootPath: `/docs/${lang}`,
      resolvePath: defaultLocale === lang ? '/' : `/${lang}/`,
      ...(defaultLocale === lang ? {} : { basePath: `/${lang}/` })
    }))
  )
}
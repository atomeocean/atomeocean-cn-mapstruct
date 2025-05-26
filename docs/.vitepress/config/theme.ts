import { DefaultTheme } from 'vitepress'
import { generateVitePressSidebar } from './sidebar'

export const themeConfig: DefaultTheme.Config = {
  logo: '/favicon.ico',
  siteTitle: false,
  search: { provider: 'local' },
  nav: [
    {
      text: 'Websites',
      items: [
        { text: 'Atomeocean', link: 'https://atomeocean.com' },
        { text: 'Cruise', link: 'https://cruise.atomeocean.com' },
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
  sidebar: generateVitePressSidebar(),
  socialLinks: [
    { icon: 'github', link: 'https://github.com/atomeocean/atomeocean-cn-mapstruct' },
    { icon: 'youtube', link: 'https://www.youtube.com/@atomeocean' },
    { icon: 'linkedin', link: 'https://www.linkedin.com/company/atomeocean' },
  ]
}
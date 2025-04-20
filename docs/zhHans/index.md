---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Open Source"
  text: "Mapstruct中文技术文档"
  tagline: atomeocean开源项目系列
  actions:
    - theme: brand
      text: 快速开始
      link: /get-started/map-struct-in-2-minutes
    - theme: alt
      text: English Docs
      link: /en/mapstruct-introduction

features:
  - title: Atomeocean Logbook
    details: https://logbook.atomeocean.com
  - title: Atomeocean Job Compass
    details: https://jobcompass.atomeocean.com
---

<div>
  <CustomLink href="https://ci.eclipse.org/mapstruct/" text="CI 构建" type="danger" />
</div>

<script setup>

import { VPTeamMembers } from 'vitepress/theme';

const members = [
  {
    avatar: 'https://www.github.com/k90zz.png',
    name: 'Jack',
    title: 'Developer',
    links: [
      { icon: 'github', link: 'https://github.com/k90zz' },
    ]
  },
  {
    avatar: 'https://www.github.com/tengtianxiang.png',
    name: 'Colton',
    title: 'Developer',
    links: [
      { icon: 'github', link: 'https://github.com/tengtianxiang' },
    ]
  },
  {
    avatar: 'https://www.github.com/bojianwangny.png',
    name: 'Bojian',
    title: 'Developer',
    links: [
      { icon: 'github', link: 'https://github.com/bojianwangny' },
    ]
  },
  {
    avatar: 'https://www.github.com/orochileo.png',
    name: 'Leo',
    title: 'Developer',
    links: [
      { icon: 'github', link: 'https://github.com/orochileo' },
    ]
  },

]
</script>

## Contributors in Atomeocean

Say hello to our awesome team.

<VPTeamMembers size="medium" :members="members" />

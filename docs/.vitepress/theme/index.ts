import { h } from 'vue'
import DefaultTheme from "vitepress/theme";
import Watermark from "./components/Watermark.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import AuthGuard from "./components/AuthGuard.vue";
import PasswordReveal from "./components/PasswordReveal.vue";
import YoutubeEmbedCard from "./components/YoutubeEmbedCard.vue";
import ContactAtomeoceanAffix from "./components/ContactAtomeoceanAffix.vue";
import LicenseNotice from "./components/LicenseNotice.vue";
import GoogleAds from "./components/GoogleAds.vue";
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';
import { toRefs } from "vue";
import {
  NolebaseGitChangelogPlugin
} from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component("Watermark", Watermark);
    app.component("AuthGuard", AuthGuard);
    app.component("PasswordReveal", PasswordReveal);
    app.component("YoutubeEmbedCard", YoutubeEmbedCard);
    app.component("ContactAtomeoceanAffix", ContactAtomeoceanAffix);
    app.component("LicenseNotice", LicenseNotice);
    app.component("GoogleAds", GoogleAds);
    app.use(NolebaseGitChangelogPlugin)

    // 注册 ElementPlus
    app.use(ElementPlus);
    // 注册所有图标组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
  setup() {
    // Get frontmatter and route
    const { frontmatter } = toRefs(useData());
    const route = useRoute();

    // Obtain configuration from: https://giscus.app/
    giscusTalk({
        repo: 'atomeocean/atomeocean-cn-mapstruct',
        repoId: 'R_kgDOMJ696w',
        category: 'Announcements', // default: `General`
        categoryId: 'DIC_kwDOMJ69684CgHTd',
        mapping: 'pathname', // default: `pathname`
        inputPosition: 'top', // default: `top`
        lang: 'zh-CN', // default: `zh-CN`
        // i18n setting (Note: This configuration will override the default language set by lang)
        // Configured as an object with key-value pairs inside:
        // [your i18n configuration name]: [corresponds to the language pack name in Giscus]
        locales: {
          'zh-Hans': 'zhHans',
          'en-US': 'en'
        },
        homePageShowComment: false, // Whether to display the comment area on the homepage, the default is false
        lightTheme: 'light', // default: `light`
        darkTheme: 'transparent_dark', // default: `transparent_dark`
        // ...
      }, {
        frontmatter, route
      },
      // Whether to activate the comment area on all pages.
      // The default is true, which means enabled, this parameter can be ignored;
      // If it is false, it means it is not enabled.
      // You can use `comment: true` preface to enable it separately on the page.
      true
    );
  }
};
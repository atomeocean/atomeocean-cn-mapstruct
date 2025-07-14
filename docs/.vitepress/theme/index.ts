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
import GiscusComment from "./components/GiscusComment.vue";

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
    app.component("GiscusComment", GiscusComment);

    // 注册 ElementPlus
    app.use(ElementPlus);
    // 注册所有图标组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  }
};
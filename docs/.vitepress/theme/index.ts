import DefaultTheme from "vitepress/theme";
import Watermark from "./components/Watermark.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component("Watermark", Watermark);

    // 注册 ElementPlus
    app.use(ElementPlus);
    // 注册所有图标组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  }
};
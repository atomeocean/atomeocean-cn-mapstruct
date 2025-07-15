
<template>
  <div class="comments">
    <Giscus
        :repo="giscusConfig.repo"
        :repoId="giscusConfig.repoId"
        :category="giscusConfig.category"
        :categoryId="giscusConfig.categoryId"
        :mapping="giscusConfig.mapping"
        strict=0
        reactionsEnabled=1
        emitMetadata=1
        inputPosition=top
        lang="zh-CN"
        theme="preferred_color_scheme"
        loading=lazy
        crossorigin="anonymous"
    />
  </div>
</template>


<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import {useRoute } from "vitepress";
import Giscus from '@giscus/vue';

const route = useRoute();

// params generate in https://giscus.app/zh-CN
const giscusConfig = reactive({
  repo: "atomeocean/atomeocean-cn-mapstruct",
  repoId: "R_kgDOMJ696w",
  category: "Announcements",
  categoryId: "DIC_kwDOMJ69684CgHTd",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  theme: "preferred_color_scheme",
  lang: "zh-CN",
  loading: "lazy",
  crossorigin:"anonymous"
});

const showComment = ref(true);

watch(
    () => route.path,
    () => {
      showComment.value = false;
      setTimeout(() => {
        showComment.value = true;
      }, 200);
    },
    {
      immediate: true,
    }
);
</script>

<style>

.comments {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
}
</style>
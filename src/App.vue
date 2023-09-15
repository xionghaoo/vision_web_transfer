<script setup>
import { RouterLink, RouterView } from 'vue-router'
import VisionPage from "@/views/VisionPage.vue";
import AboutView from "@/views/AboutView.vue";
</script>

<template>
<!--  <RouterView />-->
  <VisionPage/>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  padding: 0;
}
html {
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>

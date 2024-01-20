<script setup>
import VisionPage from "@/views/VisionPage.vue";
</script>

<template>
  <router-view></router-view>
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
.web-office-default-container {
  width: 100vw !important;
  height: 96vh !important;
  margin-top: 3.6vh !important;
}
.web-office-iframe {
  width: 100vw !important;
  height: 96vh !important;
}
</style>

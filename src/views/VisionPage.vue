<template>
  <div>
    幻境资源
  </div>
</template>

<script>
export default {
  name: "VisionPage",
  created() {
    document.title = "幻境资源";

    const params = location.search.match(/id=([^?=]+)/);
    if (params && params[1]) {
      this.section_id = params[1];
      //上报统计数据
      this.loadSectionDetail();
    } else {
      console.log('id not exist');
    }
  },
  data() {
    return {
      section_id: '',
    };
  },
  methods: {
    loadSectionDetail() {
      this.$http.get(`http://rvi.ubtrobot.com:5009/api/fairyland/section_detail?id=${this.section_id}`).then((res) => {
        console.log("data", res.data)
        if (res.data.code === 0) {
          const screens = res.data.data.screens;
          if (screens.length > 0) {
            let url = screens[0].item_uri
            let type = screens[0].file_type
            console.log('url', url)
            if (type >= 1000) {
              window.location.replace(url);
            } else {
              window.location.replace("https://roboland-deliv.ubtrobot.com/" + url);
            }
          }
          console.log('screens', screens)
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
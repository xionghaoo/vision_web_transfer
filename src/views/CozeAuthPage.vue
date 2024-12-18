<script>
export default {
  name: "CozeAuthPage",
  created() {
    document.title = "Coze Auth Page";
    console.log(`key: ${this.$route.query.key}`)
    this.loadAuthPage()
  },
  methods: {
    loadAuthPage() {
      let url = "https://ai.udicaria.com/agent/short_url?key=" + this.$route.query.key
      this.$http.get(url).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          console.log("url = ", res.data.data)
          window.open(res.data.data)
        }
      })
    }
  }
}
</script>

<template>
  <p>正在跳转。。。</p>
</template>

<style scoped>

</style>
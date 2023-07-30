<template>
  <div class="page">
    <div class="content" v-if="content_type === 0">
      <img :src="resUrl" width="100%"/>
    </div>
    <div v-else-if="content_type === 1">
      <video
          class="content"
          :src="resUrl"
          preload="auto"
          loop
          webkit-playsinline
          playsinline
          x5-playsinline
          controls
          controlsList="nodownload"
          disablePictureInPicture
      />
    </div>
    <div v-else-if="content_type === 6">
      <!-- pdf     -->
<!--      <iframe :src="resUrl" width="100%" height="100%"></iframe>-->
      正在加载pdf...
    </div>
    <div v-else-if="content_type === 7">
      <!-- ppt     -->
      正在加载ppt...
    </div>
  </div>
</template>

<script>
import Config from "@/config";

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
    // let routeUrl = 'https://roboland-ai.oss-cn-shenzhen.aliyuncs.com/test/Java%E8%99%9A%E6%8B%9F%E6%9C%BA%E8%A7%84%E8%8C%83%EF%BC%88Java%20SE%207%EF%BC%89.pdf';
    // // test
    // let img = 'test/xionghaoo_Full_body_portrait_of_girl_20_years_old_wearing_a_dar_b1be5ea2-7025-468c-b8e3-dac3225ee223.png'
    // let video = 'test/guide1.mp4';
    // let pdf = 'test/Java%E8%99%9A%E6%8B%9F%E6%9C%BA%E8%A7%84%E8%8C%83%EF%BC%88Java%20SE%207%EF%BC%89.pdf';
    // let ppt = 'test/EvoCreator%E5%BC%95%E5%AF%BC%E8%AE%B2%E8%A7%A3.pptx'
    // let type = 7
    // this.showContent(type, ppt);
  },
  data() {
    return {
      section_id: '',
      pdfSrc: '',
      content_type: 0,
      resUrl: ''
    };
  },
  methods: {
    // showPpt() {
    //   let routeUrl = 'https://roboland-deliv.ubtrobot.com/test/App%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%9E%B6%E6%9E%84.pptx'
    //   let url = encodeURIComponent(routeUrl)
    //   let officeUrl = 'http://view.officeapps.live.com/op/view.aspx?src='+url
    //   window.open(officeUrl,'_target')
    // },
    // showPdf(routeUrl){
    //   // this.pdffile=file
    //   let pSrc = routeUrl + '?r=' + new Date();
    //   this.pdfSrc = 'http://192.168.8.103:5001/static/web/pdf/web/viewer.html?file=' + encodeURIComponent(pSrc) + '.pdf';
    // },
    loadSectionDetail() {
      // http://rvi.ubtrobot.com:5009
      // let host = "http://" + window.location.host.split(":")[0] + ":5001"
      let host = Config.baseUrl
      this.$http.get(`${host}/api/fairyland/section_detail?id=${this.section_id}`).then((res) => {
        console.log("data", res.data)
        if (res.data.code === 0) {
          const screens = res.data.data.screens;
          if (screens.length > 0) {
            let url = screens[0].item_uri
            let type = screens[0].file_type
            if (type === 7) {
              type = 6
              url = screens[0].item_uri_convert
            }
            this.showContent(type, url);
          }
          console.log('screens', screens)
        }
      })
    },
    showContent(type, url) {
      console.log('url', url)
      // this.resUrl = url;
      this.content_type = type;
      // 6 pdf
      // 7 ppt
      if (type >= 1000) {
        window.location.replace(url);
      } else if (type === 6) {
        // pdf
        let pSrc = this.getRealUrl(url);
        let localHost = window.location.host
        this.resUrl = Config.baseUrl + '/static/web/pdf/web/viewer.html?file=' + encodeURIComponent(pSrc);
        window.location.replace(this.resUrl)
      } else if (type === 7) {
        // ppt
        // let routeUrl = 'https://roboland-deliv.ubtrobot.com/test/App%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%9E%B6%E6%9E%84.pptx'
        let officeUrl = 'http://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(this.getRealUrl(url))
        window.location.replace(officeUrl)
      } else if (type === 1) {
        // video
        this.resUrl = this.getRealUrl(url)
      } else {
        this.resUrl = this.getRealUrl(url)
        // window.location.replace("https://roboland-deliv.ubtrobot.com/" + url);
      }
    },
    getRealUrl(name) {
      return Config.ossHost + name;
    },
  }
}
</script>

<style scoped>
.content img,
video {
  width: 100%;
  object-fit: contain;
}
.page iframe {
  width: 100%;
  background: white;
}
.content {
  width: 100%;
  margin: 0 auto;
}
</style>
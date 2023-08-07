<template>
  <div class="page">
    <div v-if="content_type === 0 || content_type === 1">
      <div class="content" v-for="(item, index) in section.screens" :key="index">
<!--        <img v-if="item.file_type === 0" :src="getRealUrl(item.item_uri)" width="100%"/>-->
        <el-image
            v-if="item.file_type === 0"
            style="width: 100%"
            :src="getRealUrl(item.item_uri)">
        </el-image>
        <video
            class="content_video"
            v-else-if="item.file_type === 1"
            :src="getRealUrl(item.item_uri)"
            preload="auto"
            loop
            :autoplay="false"
            webkit-playsinline
            playsinline
            x5-playsinline
            controls
            controlsList="nodownload"
            disablePictureInPicture
            :poster="poster"
        />
      </div>
    </div>

<!--    <div class="content" v-if="content_type === 0">-->
<!--      <img :src="item.item_uri" width="100%"/>-->
<!--    </div>-->
<!--    <div v-else-if="content_type === 1">-->
<!--      <video-->
<!--          class="content"-->
<!--          :src="resUrl"-->
<!--          preload="auto"-->
<!--          loop-->
<!--          autoplay-->
<!--          webkit-playsinline-->
<!--          playsinline-->
<!--          x5-playsinline-->
<!--          controls-->
<!--          controlsList="nodownload"-->
<!--          disablePictureInPicture-->
<!--          :poster="poster"-->
<!--      />-->
<!--    </div>-->
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

    // wx.config({
    //   debug: false,
    //   appId: '111',
    //   timestamp: '111',
    //   nonceStr: '111',
    //   signature: '111',
    //   jsApiList: []
    // })
    // wx.ready(()=> {
    //   let video = document.querySelectorAll("video")[0];
    //   video.play();
    // });

    // let routeUrl = 'https://roboland-ai.oss-cn-shenzhen.aliyuncs.com/test/Java%E8%99%9A%E6%8B%9F%E6%9C%BA%E8%A7%84%E8%8C%83%EF%BC%88Java%20SE%207%EF%BC%89.pdf';
    // // test
    // let img = 'test/xionghaoo_Full_body_portrait_of_girl_20_years_old_wearing_a_dar_b1be5ea2-7025-468c-b8e3-dac3225ee223.png'
    // let url = 'test/guide1.mp4';
    // let pdf = 'test/Java%E8%99%9A%E6%8B%9F%E6%9C%BA%E8%A7%84%E8%8C%83%EF%BC%88Java%20SE%207%EF%BC%89.pdf';
    // let ppt = 'test/EvoCreator%E5%BC%95%E5%AF%BC%E8%AE%B2%E8%A7%A3.pptx'
    // let type = 1
    // this.showContent(type, url);
  },
  data() {
    return {
      section_id: '',
      pdfSrc: '',
      content_type: 0,
      resUrl: '',
      poster: '',
      section: {
        screens: [],
      },
    };
  },
  methods: {
    loadSectionDetail() {
      let _this = this;
      // http://rvi.ubtrobot.com:5009
      let host = "http://" + window.location.host.split(":")[0] + ":5001"
      // let host = Config.baseUrl
      this.$http.get(`${host}/api/fairyland/section_detail?id=${this.section_id}`).then((res) => {
        console.log("data", res.data)
        if (res.data.code === 0) {
          document.title = res.data.name || '幻境资源';
          let section = res.data.data
          this.$data.section = section;
          if (section.screen_content_type === 6
              || section.screen_content_type === 7
              || section.screen_content_type === 1000) {
            _this.showContent(section.screen_content_type, section.screen_url);
          }

          // const screens = res.data.data.screens;
          // if (screens.length > 0) {
          //   let url = screens[0].item_uri
          //   let type = screens[0].file_type
          //   if (type === 7) {
          //     type = 6
          //     url = screens[0].item_uri_convert
          //   }
          //   _this.poster = this.getRealUrl(screens[0].poster)
          //   _this.showContent(type, url);
          // }
          console.log('screens', section)
        }
      })
    },
    showContent(type, url) {
      let _this = this;
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
        this.poster = this.resUrl + "?x-oss-process=video/snapshot,t_0000,f_jpg,m_fast"
      } else {
        this.resUrl = this.getRealUrl(url)
        // window.location.replace("https://roboland-deliv.ubtrobot.com/" + url);
      }
    },
    getRealUrl(name) {
      return Config.ossHost + name;
    },

    doPlay(video){
      console.log('do play')
      WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
        // var $video = $("#video")
        // var $video2 = $("#video2")
        // $video1[0].play()
        // $video2[0].play()
        video.play()
      })
    }
  }
}
</script>

<style scoped>
.content img,
video {
  width: 100%;
  object-fit: contain;
}
.page {
  width: 100%;
  height: 100%;
  display: flex;
  /*align-items: center;     !* 垂直居中 *!*/
  /*justify-content: center;*/
  background: white;
}
.content {
  width: 100%;
  margin: 0 auto;
}
.content_video {
  margin-top: 10px;
}
</style>
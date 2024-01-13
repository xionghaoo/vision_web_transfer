<template>
  <div class="page" :style="`${section.screens.length === 1 ? 'align-items: center;justify-content: center;' : ''}`">
    <div v-if="content_type === 0 || content_type === 1">
      <div class="content" v-for="(item, index) in section.screens" :key="index">
        <el-image
            class="content_image"
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
            :poster="getPoster(item.item_uri)"
        />
      </div>
    </div>
    <div v-else-if="content_type === 6 || content_type === 7">
      <p>正在打开文档。。。</p>
    </div>
    <div id="richText" class="rich-text" v-else-if="content_type === 1001" v-html="resUrl">
    </div>
  </div>
</template>

<script>
import Config from "@/config";

export default {
  name: "VisionPage",
  created() {
    document.title = "幻境资源";
    console.log('created')
    let type = localStorage.getItem("type")
    let value = localStorage.getItem("value")
    if (type && value) {
      this.loadSectionDetail(type, value)
      return
    }
    const params = location.search.match(/id=([^?=]+)/);
    if (params && params[1]) {
      this.section_id = params[1];
      console.log('get section id: ', this.section_id)
      //上报统计数据
      this.loadSectionDetail("id", this.section_id);
    } else {
      console.log('id not exist');
      const code = location.search.match(/code=([^?=]+)/);
      if (code && code[1]) {
        let section_rec_code = code[1];
        this.loadSectionDetail("code", section_rec_code);
      }
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
  mounted() {
    this.updateImages()
  },
  updated() {
    this.updateImages()
  },
  methods: {
    updateImages() {
      let rt = document.getElementById('richText')
      console.log('rt', rt)
      if (rt) {
        let imgs = rt.getElementsByTagName("img")
        console.log('images', imgs)
        for (let i = 0; i < imgs.length; i++) {
          imgs[i].style['width'] = "100%";
        }

        let videos = rt.getElementsByTagName("video")
        for (let i = 0; i < videos.length; i++) {
          videos[i].setAttribute('controls', '')
          videos[i].style['width'] = "100%";
          // videos[i].style['height'] = "300px";
        }

        let iframes = rt.getElementsByTagName("iframe")
        for (let i = 0; i < iframes.length; i++) {
          iframes[i].style['width'] = "100%";
          // videos[i].style['height'] = "300px";
        }
      }
    },
    loadSectionDetail(type, value) {
      localStorage.setItem("type", type)
      localStorage.setItem("value", value)
      let _this = this;
      // http://rvi.ubtrobot.com:5009
      // let host = "http://" + window.location.host.split(":")[0] + ":5001"
      let host = Config.baseUrl
      let headers = {
        "auth-token": localStorage.getItem("token")
      }
      this.$http.get(`${host}/api/fairyland/section_detail?${type}=${value}`, {headers: headers}).then((res) => {
        console.log("data", res.data)
        if (res.data.code === 0) {
          localStorage.removeItem('type')
          localStorage.removeItem("value")
          let section = res.data.data
          this.$data.section = section;
          document.title = section.card_name || '幻境资源';
          if (section.screen_content_type === 6
              || section.screen_content_type === 7
              || section.screen_content_type === 8
              || section.screen_content_type === 9
              || section.screen_content_type === 1000
              || section.screen_content_type === 1001
          ) {
            _this.showContent(section.screen_content_type, section.screen_url, section.wps_file_id);
          }
          console.log('screens', section)
        } else if (res.data.code === -2) {
          // 用户未找到，跳转到登入页面
          _this.$router.replace({name: "Login"})
        }
      })
    },
    showContent(type, url, wps_id) {
      let _this = this;
      console.log('url', url)
      // this.resUrl = url;
      this.content_type = type;
      // 6 pdf
      // 7 ppt
      if (type === 1000) {
        window.location.replace(url);
      } else if (type === 6 || type === 7 || type === 8 || type === 9) {
        let officeType = WebOfficeSDK.OfficeType.Pdf
        switch (type) {
          case 6:
            // pdf
            officeType = WebOfficeSDK.OfficeType.Pdf
            break;
          case 7:
            // ppt
            officeType = WebOfficeSDK.OfficeType.Presentation
            break;
          case 8:
            // word
            officeType = WebOfficeSDK.OfficeType.Writer
            break;
          case 9:
            // excel
            officeType = WebOfficeSDK.OfficeType.Spreadsheet
            break
        }
        // https://solution.wps.cn/docs/web/quick-start.html#%E6%AD%A5%E9%AA%A4-3-%E5%88%9D%E5%A7%8B%E5%8C%96
        const instance = WebOfficeSDK.init({
          officeType: officeType,
          appId: 'AK20231116UGFGZW',
          fileId: wps_id,
          token: ''
        })

        // pdf
        // let pSrc = this.getRealUrl(url);
        // let localHost = window.location.host
        // this.resUrl = Config.baseUrl + '/static/web/pdf/web/viewer.html?file=' + encodeURIComponent(pSrc);
        // window.location.replace(this.resUrl)
      } else if (type === 7) {
        // ppt
        // let routeUrl = 'https://roboland-deliv.ubtrobot.com/test/App%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%9E%B6%E6%9E%84.pptx'
        // let officeUrl = 'http://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(this.getRealUrl(url))
        // window.location.replace(officeUrl)
      } else if (type === 1) {
        // video
        this.resUrl = this.getRealUrl(url)
        this.poster = this.resUrl + "?x-oss-process=video/snapshot,t_0000,f_jpg,m_fast"
      } else if (type === 1001) {
        this.resUrl = url
      } else {
        this.resUrl = this.getRealUrl(url)
        // window.location.replace("https://roboland-deliv.ubtrobot.com/" + url);
      }
    },
    getPoster(url) {
      return this.getRealUrl(url) + "?x-oss-process=video/snapshot,t_0000,f_jpg,m_fast"
    },
    getRealUrl(name) {
      return Config.ossHost + name;
    },
    openPdf(url) {
      // let pSrc = this.getRealUrl(url);
      // let localHost = window.location.host
      // this.resUrl = Config.baseUrl + '/static/web/pdf/web/viewer.html?file=' + encodeURIComponent(pSrc);
      // window.location.replace(this.resUrl)

    },
    openPpt(url) {
      let officeUrl = 'http://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(this.getRealUrl(url))
      window.location.replace(officeUrl)
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
  width: 100%
}
.content_image {
  width: 100%
}
.rich-text {
  width: 100%;
}
</style>
<template>
  <div v-if="code === 0" class="page" :style="`${section.screens.length === 1 ? 'align-items: center;justify-content: center;' : ''}`">
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
    <div style="width: 100%" v-else-if="content_type === 6 || content_type === 7 || content_type === 8 || content_type === 9">
      <div v-if="instance" style="height: 3.6vh; width: 100%; display: flex; align-items: center;justify-content: end">
        <el-button type="primary" size="small" style="margin-right: 10px;" v-on:click="logout">
          {{isVisitor ? "登入" : "退出登入"}}
        </el-button>
      </div>
      <p v-else>正在打开文档。。。</p>
    </div>
    <div id="richText" class="rich-text" v-else-if="content_type === 1001" v-html="resUrl">
    </div>
    <div v-else-if="content_type === -1" style="width: 100%;height: 100%">
      <p class="permission-text" style="color: black">
        {{period_message}}
      </p>
    </div>
  </div>
  <div v-else-if="code === -1" class="page">
    <p class="permission-text" style="color: black">
      内容未找到，请先绑定卡片
    </p>
  </div>
  <div v-else-if="code === -3" class="page">
    <p class="permission-text">
      您当前没有访问权限，<br>
      请让文档拥有者{{owner_name}}授权
    </p>
  </div>
</template>

<script>
import Config from "@/config";

export default {
  name: "VisionPage",
  created() {
    document.title = "幻境资源";
    console.log('created')
    const params_id = location.search.match(/id=([0-9]+)/);
    const params_code = location.search.match(/code=([0-9a-zA-Z]+)/);
    const params_token = location.search.match(/token=([0-9]+)/);
    let token = params_token && params_token[1] ? params_token[1] : null
    let sectionId = params_id && params_id[1] ? params_id[1] : null
    let sectionCode = params_code && params_code[1] ? params_code[1] : null
    console.log('query = ', token, sectionId, sectionCode)
    let loginToken = localStorage.getItem('login_h5_token')
    if (loginToken) {
      token = loginToken
      localStorage.removeItem('login_h5_token')
    }
    if (!token) {
      let localToken = localStorage.getItem('h5_user_id')
      if (localToken) {
        token = localToken
      } else {
        if (token) {
          // 通过url登入
          localStorage.setItem('h5_user_id', token)
        } else {
          localStorage.setItem('h5_user_id', "")
        }
      }
    } else {
      localStorage.setItem('h5_user_id', token)
    }
    let type = localStorage.getItem("type")
    let value = localStorage.getItem("value")
    if (type && value) {
      this.loadSectionDetail(type, value, token)
      return
    }
    if (sectionId) {
      this.section_id = sectionId;
      console.log('get section id: ', this.section_id)
      //上报统计数据
      this.loadSectionDetail("id", this.section_id, token);
    } else {
      console.log('id not exist');
      // const code = location.search.match(/code=([^?=]+)/);
      if (sectionCode) {
        this.loadSectionDetail("code", sectionCode, token);
      } else {
        console.log('code not exist');
      }
    }
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
      code: 0,
      owner_name: '',
      period_message: '',
      instance: null,
      isVisitor: true
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
    loadSectionDetail(type, value, token) {
      localStorage.setItem("type", type)
      localStorage.setItem("value", value)
      let _this = this;
      // http://rvi.ubtrobot.com:5009
      // let host = "http://" + window.location.host.split(":")[0] + ":5003"
      let host = Config.baseUrl
      let headers = {
        "auth-token": token
      }
      this.$http.get(`${host}/api/fairyland/section_detail?${type}=${value}`, {headers: headers}).then((res) => {
        console.log("data", res.data)
        _this.$data.code = res.data.code
        if (res.data.code === 0) {
          let section = res.data.data
          this.$data.section = section;
          document.title = section.card_name || '幻境资源';
          if (section.period_status === 'before') {
            this.$data.content_type = -1
            this.$data.period_message = `内容未开启，开启时间：\n${section.period_start.split(' ')[0]} ~ ${section.period_end.split(' ')[0]}`
          } else if (section.period_status === 'after') {
            this.$data.content_type = -1
            this.$data.period_message = "内容已过期"
          } else {
            // 显示内容
            if (section.screen_content_type === 6
                || section.screen_content_type === 7
                || section.screen_content_type === 8
                || section.screen_content_type === 9
                || section.screen_content_type === 1000
                || section.screen_content_type === 1001
            ) {
              _this.showContent(section.screen_content_type, section.screen_url, section.wps_file_id, section.permission_type);
            }
          }
          this.clearRequestParams()
        } else if (res.data.code === -1) {
          this.clearRequestParams()
          // 内容未找到
        } else if (res.data.code === -2) {
          // 用户未找到，跳转到登入页面
          // _this.$router.replace({name: "Login"})
          this.$router.replace({name: "Login", query: {
              key: localStorage.getItem('type'),
              value: localStorage.getItem("value")
            }})
        } else if (res.data.code === -3) {
          this.clearRequestParams()
          // 没权限
          _this.$data.owner_name = res.data.data.owner.name
        }
      })
    },
    clearRequestParams() {
      localStorage.removeItem('type')
      localStorage.removeItem("value")
    },
    showContent(type, url, wps_id, permission_type) {
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
        this.loadWPS(wps_id, officeType, permission_type)

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
    },
    async loadWPS(wps_id, officeType, permission_type) {
      if (this.instance) {
        this.instance.destroy()
      }
      // https://solution.wps.cn/docs/web/quick-start.html#%E6%AD%A5%E9%AA%A4-3-%E5%88%9D%E5%A7%8B%E5%8C%96
      let user_id = localStorage.getItem("h5_user_id")
      let visitor_id = "v" + Math.floor(Math.random() * 99999)
      this.isVisitor = user_id === null || user_id === undefined || user_id === ""
      let modifier_id = !this.isVisitor ? user_id+"" : visitor_id
      console.log('modifier id', modifier_id, this.isVisitor)
      this.instance = WebOfficeSDK.init({
        officeType: officeType,
        appId: Config.wpsAppId,
        fileId: wps_id,
        token: '',
        customArgs: {
          'modifier_id': modifier_id,
          'permission_type': permission_type
        }
      })
      await this.instance.ready()
    },
    logout() {
      localStorage.removeItem("h5_user_id")
      this.instance.destroy()
      this.instance = null
      document.body.removeChild(document.getElementsByClassName("web-office-default-container")[0])
      this.$router.replace({name: "Login"})
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
.permission-text{
  padding: 20px;
  justify-content: center;
  margin: auto;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: red;
  white-space: pre-wrap;
}
</style>
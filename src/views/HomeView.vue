<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="数字人视频列表" name="first">
      <human-video-list/>
    </el-tab-pane>
    <el-tab-pane label="上传头像/卡片" name="second">
      <el-select v-model="imgType" placeholder="请选择">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div style="width: 300px;height: 300px; margin-top: 10px">
        <el-upload
            class="upload-demo"
            drag
            accept="image/jpeg,image/png,image/jpg"
            :http-request="uploadImage"
            multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
        </el-upload>
      </div>
    </el-tab-pane>
    <el-tab-pane label="上传讲解文本" name="third">
      <div style="width: 300px;height: 300px; margin-top: 10px">
        <el-upload
            class="upload-demo"
            drag
            accept="text/plain"
            :http-request="uploadContent"
            multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传txt文件</div>
        </el-upload>
      </div>
    </el-tab-pane>
    <el-tab-pane label="上传PPT讲解页面" name="fourth">
      <div style="width: 300px;height: 300px; margin-top: 10px">
        <el-upload
            class="upload-demo"
            drag
            accept="application/pdf,video/*,image/*"
            :http-request="uploadPdf"
            multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">请上传图片/视频/pdf文件</div>
        </el-upload>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

import HumanVideoList from "@/views/HumanVideoList.vue";

export default {
  name: "Home",
  components: {HumanVideoList},
  data() {
    return {
      activeName: "first",
      imageList: [],
      uploadType: 'avatar',
      imgType: 'avatar',
      options: [
        {
          value: 'avatar',
          label: '上传头像'
        },
        {
          value: 'card',
          label: '上传卡片'
        },
      ]
    }
  },
  created() {
  },
  methods: {
    uploadDisabled: function() {
      return this.imageList.length > 0
    },
    handleClick(tab, event) {
    },
    onFileChange(file, fileList) {
      this.imageList = fileList
    },
    handleRemove(f) {
      this.imageList = []
      console.log('remove file: ' + f.name)
    },
    uploadContent(param) {
      this.uploadType = 'content'
      this.uploadFile(param)
    },
    uploadPdf(param) {
      this.uploadType = 'pdf'
      this.uploadFile(param)
    },
    uploadImage(param) {
      this.uploadType = this.imgType
      this.uploadFile(param)
    },
    uploadFile(param) {
      let _this = this;
      // let url = "192.168.8.176:4567"
      let url = location.host
      let formData = new FormData();
      formData.append("image", param.file);
      formData.append("type", _this.uploadType)
      this.$http.post(`http://${url}/api/upload_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        console.log("res code = ", res.data)
        if (res.data.code === 200) {
          this.$notify({
            message: `上传成功`,
            type: 'success'
          });
        }
      })
    },
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
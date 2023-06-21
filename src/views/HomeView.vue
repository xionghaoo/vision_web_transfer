<template>
  <div style="background: white">
    <div>文件列表</div>
    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column
          prop="name"
          label="名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="url"
          label="文件名称">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button v-on:click="download_video(scope.row.filename)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    <button name="下载" v-on:click="download_video('section_46_zh-Hans.mp4')"/>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          name: "数字人1",
          url: "/local",
          filename: ''
        },
        {
          name: "数字人2",
          url: "/local3",
          filename: ''
        }
      ]
    }
  },
  created() {
    this.get_video_list();
  },
  methods: {
    get_video_list() {
      this.$http.get("http://192.168.8.176:4007/api/video_list").then((response) => {
        if (response.data.code === 0) {
          let data = response.data.data
          let items = []
          for (let i = 0; i < data.length; i++) {
            items.push({
              name: 'digital human',
              url: data[i],
              filename: data[i]
            })
          }
          this.tableData = items
        }
        console.log(response.data)
      })
    },
    download_video(name) {
      console.log('download: ' + name)
      window.open("http://192.168.8.176:4007/api/download?name=" + name)
    }
  }
}
</script>

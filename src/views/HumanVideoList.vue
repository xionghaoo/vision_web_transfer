<template>
  <div style="background: white">
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
  </div>
</template>

<script>
export default {
  name: "humanVideoList",
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
    console.log(location.host)
    this.get_video_list();
  },
  methods: {
    get_video_list() {
      this.$http.get(`http://${location.host}/api/video_list`).then((response) => {
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
      window.open(`http://${location.host}/api/download?name=${name}`)
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div>
    <h1>文件列表</h1>

    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column
          prop="date"
          label="日期"
          width="180">
      </el-table-column>
      <el-table-column
          prop="name"
          label="姓名"
          width="180">
      </el-table-column>
      <el-table-column
          prop="address"
          label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
/*@media (min-width: 1024px) {*/
/*  .about {*/
/*    min-height: 100vh;*/
/*    display: flex;*/
/*    align-items: center;*/
/*  }*/
/*}*/
</style>

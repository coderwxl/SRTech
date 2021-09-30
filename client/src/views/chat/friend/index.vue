<template>
  <div class="app-container">
    <el-scrollbar class="left"></el-scrollbar>
    <div class="right">
      <el-scrollbar class="right-top"></el-scrollbar>
      <el-scrollbar style="right-bottom"></el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data() {
    return {

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
    }
  }
}
</script>

<style lang="scss" scoped>
.left {
  width: 200px;
  height: 100%;
  overflow-x: hidrongan
.right {
  width: calc(100% - 200px);
  height: 100%;

  .right-top {
    width: 100px;
    height: 100%;
  }
  
}
</style>
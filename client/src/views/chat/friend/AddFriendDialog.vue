<template>
  <el-dialog class="mydialog" :visible="dialogVisible" :modal="false" @open="handleDialogOpen" @close="handleDialogClose">
    <div class="main-container">
      <div class="top-container">
        <el-input placeholder="查找新朋友" v-model="input3" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
            </el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click.prevent="searchFriends"></el-button>
        </el-input>
      </div>
      <div class="bottom-container">
        <el-card :body-style="{ padding: '0px' }" v-for="n in 12">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo, editInfo } from '@/api/user'
// import PublicMixin from '@/utils/public-mixin'

export default {
  name: 'AddFriendDialog',
  props: {
    dialogVisible: Boolean
  },
  // mixins: [PublicMixin],
  data() {
    return {
      options: [{
          value: 1,
          label: '用户名'
        }, {
          value: 2,
          label: '地址'
        }, {
          value: 3,
          label: '年龄 '
        }, {
          value: 4,
          label: '住址'
        }],
      select: 1
    }
  },
  created: function() {
    //按esc关闭对话框
    document.onkeydown = e => {   if (this.dialogVisible && e.key === 'Escape') {
        this.dialogVisible = false
      }
    }
  },
  computed: {

  },
  methods: {
    handleDialogOpen() {

    },
    handleDialogClose() {
      this.$emit('update:dialogVisible', false)
    },
    searchFriends() {
      alert('search')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select .el-input {
  width: 100px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.el-card {
  width: 160px;
  margin: 20px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}


.main-container {

  .top-container {
    padding-left: 150px;
    padding-right: 150px;
    padding-bottom: 30px;
    border-bottom: 1px solid lightgray;
  }

  .bottom-container {
    width: 100%;
    height: 400px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

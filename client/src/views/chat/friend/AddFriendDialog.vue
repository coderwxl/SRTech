<template>
  <el-dialog class="mydialog" :visible="dialogVisible" :modal="false" @open="handleDialogOpen" @close="handleDialogClose">
    <div class="main">
      <div class="top-container">
        <el-input placeholder="查找新朋友" v-model="search" class="input-with-select">
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
        <el-card :body-style="{ padding: '0px' }" v-for="friend in new_friends" :key="friend.id">
          <img :src="friend.avatar" class="image">
          <div style="padding: 8px;">
            <div>
              <span style="font-size: 1.1em">{{ friend.username }}</span>
              <el-button type="text" icon="fa fa-user-plus" class="button" @click="addFriend(friend.username)"></el-button>
            </div>
            <div class="bottom clearfix">
              <span class="time">{{ friend.signature }}</span>
              <el-popover
                placement="right-end"
                width="180"
                trigger="hover">
                <div>
                  <p><span class="info-title">工作</span><span>{{ friend.job }}</span></p>
                  <p><span class="info-title">年龄</span><span>{{ friend.age }}</span></p>
                  <p><span class="info-title">电话</span><span>{{ friend.phone }}</span></p>
                  <p><span class="info-title">邮箱</span><span>{{ friend.email }}</span></p>
                  <p><span class="info-title">住址</span><span>{{ friend.address }}</span></p>
                </div>
                <i class="fa fa-info-circle info"  slot="reference"></i>
              </el-popover>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getNewFriendList, addNewFriend } from '@/api/friend'
import PublicMixin from '@/utils/public-mixin'

export default {
  name: 'AddFriendDialog',
  props: {
    dialogVisible: Boolean
  },
  mixins: [PublicMixin],
  data() {
    return {
      new_friends: [],
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
      select: 1,
      search: ''
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
      getNewFriendList().then(res => {
        console.log(res.data)
        this.new_friends = res.data.map(friend => {
          return Object.assign({}, friend, { age: this.getAge(friend.birth_date) })
        })
      })
    },
    handleDialogClose() {
      this.$emit('update:dialogVisible', false)
    },
    searchFriends() {
      alert('search')
    },
    addFriend(name) {
      addNewFriend(name).then(() => {
        getNewFriendList().then(res => {
          console.log(res.data)
          this.new_friends = res.data.map(friend => {
            return Object.assign({}, friend, { age: this.getAge(friend.birth_date) })
          })
        })
        this.$emit('add-new-friend')
      })
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
  height: 210px;
  width: 160px;
  margin: 20px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 8px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.info {
  font-size: 1em;
  color: #999;
  padding: 0;
  float: right;
}

.info-title {
  color: gray;  
  margin-right: 8px;
}

.image {
  height: 150px;
  width: 100%;
  display: block;
  object-fit: cover;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}


.main {

  .top-container {
    padding-left: 150px;
    padding-right: 150px;
    padding-bottom: 30px;
    border-bottom: 1px solid lightgray;
  }

  .bottom-container {
    width: 100%;
    height: 500px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

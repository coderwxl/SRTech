<template>
  <div class="components-container">
    <div class="left-container column">
      <div class="left-top">
        <el-input
          placeholder="搜索"
          v-model="search"
          clearable
          prefix-icon="el-icon-search"
          size="small"
          @input="onSearch"
          >
        </el-input>
        <el-divider direction="vertical"></el-divider>
        <el-tooltip content="添加好友" placement="right">
          <el-button icon="el-icon-plus" size="small" @click.native.prevent="addFriend"></el-button>
        </el-tooltip>
      </div>
      <friend-item v-for="friend in friends" :id="friend.id" :image-url="friend.avatar" :name="friend.username" :signature="friend.signature" :key="friend.username" :is-clicked="friend.isClicked" @item-click="onFriendClicked"/>
    </div>
    <div v-if="hasDetail" class="right-container column">
      <div class="detail-1">
        <div class="name-signature">
          <p class="username">{{ detail.username }}</p>
          <p class="signature">{{ detail.signature }}</p>
        </div>
        <img :src="detail.avatar" alt="暂无头像" class="avatar">
      </div>
      <div class="detail-2">
        <p><span class="title">备注</span><span>{{ detail.remark }}</span></p>
        <p><span class="title">电话</span><span>{{ detail.phone }}</span></p>
        <p><span class="title">邮箱</span><span>{{ detail.email }}</span></p>
        <p><span class="title">工作</span><span>{{ detail.job }}</span></p>
        <p><span class="title">年龄</span><span>{{ detail.age }}</span></p>
        <p><span class="title">住址</span><span>{{ detail.address }}</span></p>
      </div>
    </div>
    <add-friend-dialog :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import FriendItem from './FriendItem.vue'
import { getFriendList, getFriendDetail } from '@/api/friend'
import AddFriendDialog from './AddFriendDialog.vue'

export default {
  name: 'SplitpaneDemo',
  components: { splitPane, FriendItem, AddFriendDialog },
  data() {
    return {
      friends: [],
      friendsBak: [],
      detail: {}, 
      hasDetail: false,
      search: '',
      dialogVisible: false
    }
  },
  created() {
    this.getFriends()
  },
  methods: {
    isLeapYear(year) {
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        return true
      } else {
        return false
      }
    },
    getAge(date) {
      console.log(date)
      let age = 0
      let friendDate = new Date(date);
      let now = new Date()
      if (now.getMonth() > friendDate.getMonth()) {
        age = now.getFullYear() - friendDate.getFullYear()
      } else if (now.getMonth() < friendDate.getMonth()) {
        age = now.getFullYear() - friendDate.getFullYear() - 1
      } else {
        if (now.getDate() >= friendDate.getDate()) {
          age = now.getFullYear() - friendDate.getFullYear()
        } else {
          age = now.getFullYear() - friendDate.getFullYear() - 1
        }
      }
      
      return age
    },
    getFriends() {
      getFriendList().then(response => {
        this.friends = response.data.map(friend => {
          return Object.assign({}, friend, { isClicked: false })
        })
        this.friendsBak = this.friends
      })
    },
    onFriendClicked(id) {
      this.hasDetail = true
      this.friends.forEach(friend => {
        if (friend.id == id) {
          friend.isClicked = true
        } else {
          friend.isClicked = false
        }
      })

      getFriendDetail(id).then(res => {
        console.log(res.data)
        this.detail = Object.assign({}, res.data, { age: this.getAge(res.data.birth_date)})
      })
    },
    addFriend() {
      this.dialogVisible = true
    },
    onSearch(str) {
      console.log(str)
      this.detail = {}
      this.hasDetail = false
      this.friendsBak.forEach(friend => {
        friend.isClicked = false
      })
      this.friends = this.friendsBak.filter(friend => {
        return friend.username.indexOf(str) !== -1
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .components-container {
    position: relative;
    height: calc(100vh - 50px);
  }

  .column {
    float: left;
  }

  .left-container {
    border-right: 1px solid #BDC8D6;
    height: 100%;
    width: 300px;

    .left-top {
      padding-top: 5px;
      padding-left: 5px;
      padding-bottom: 3px;
      border-bottom: 1px solid lightgray;
      .el-input {
        width: 77%;
      }
    }
    
  }

  .right-container {
    height: 100%;
    width: calc(100% - 300px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .detail-1 {
    padding: 20px;
    padding-bottom: 0px;
    border-bottom: 1px solid lightgray;
    width: 400px;
    display: flex;
    justify-content: space-between;
  }

  .name-signature {
    display: flex;
    flex-direction: column;
    justify-content: center;

    p { 
      margin: 0px;
    }

    .username {
      font-size: 2em;
      margin-bottom: 15px;
    }
  }

  .avatar {
    float: right;
    width: 150px;
    height: 150px;
    border-radius: 20px;
    object-fit: contain;
  }

  .detail-2 {
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 5px;
    width: 400px;

    .title {
      color: gray;  
      margin-right: 20px;
    }

    .el-input {
      width: 75%;
    }
  }




</style>

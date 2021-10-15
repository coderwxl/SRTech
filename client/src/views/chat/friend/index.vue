<template>
  <div class="components-container">
    <div class="left-container column">
      <friend-item v-for="friend in friends" :id="friend.id" :image-url="friend.avatar" :name="friend.username" :signature="friend.signature" :key="friend.username" :is-clicked="friend.isClicked" @item-click="onFriendClicked"/>
    </div>
    <div v-if="hasDetail" class="right-container column">
      <div class="detail-1">
        <div class="name-signature column">
          <p>{{ detail.username }}</p>
          <p>{{ detail.signature }}</p>
        </div>
        <img :src="detail.avatar" alt="暂无头像" class="avatar">
      </div>
      <div class="detail-2">
        <p><span>备注</span><span>{{ detail.remark }}</span></p>
        <p><span>电话</span><span>{{ detail.phone }}</span></p>
        <p><span>邮箱</span><span>{{ detail.email }}</span></p>
        <p><span>工作</span><span>{{ detail.job }}</span></p>
        <p><span>年龄</span><span>{{ detail.birth_date }}</span></p>
        <p><span>住址</span><span>{{ detail.address }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import FriendItem from './FriendItem.vue'
import { getFriendList, getFriendDetail } from '@/api/friend'

export default {
  name: 'SplitpaneDemo',
  components: { splitPane, FriendItem },
  data() {
    return {
      friends: [],
      detail: {}, 
      hasDetail: false
    }
  },
  created() {
    this.getFriends()
  },
  methods: {
    getFriends() {
      getFriendList().then(response => {
        this.friends = response.data.map(friend => {
          return Object.assign({}, friend, { isClicked: false })
        })
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
        this.detail = res.data
      })
    }
  }
}
</script>

<style  scoped>
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
    /* background-color: gray; */
    border-bottom: 1px solid gray;
    width: 400px;
    display: flex;
    justify-content: space-between;
  }

  .detail-2 {
    padding: 20px;
    /* background-color: lightgray; */
    width: 400px;
  }

  .avatar {
    float: right;
    width: 120px;
    height: 120px;
    border-radius: 20px;
    object-fit: contain;
  }


</style>

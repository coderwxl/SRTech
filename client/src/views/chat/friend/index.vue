<template>
  <div class="components-container">
    <div class="left-container column">
      <friend-item v-for="friend in friends" :id="friend.id" :image-url="friend.avatar" :name="friend.username" :signature="friend.signature" :key="friend.username" :is-clicked="friend.isClicked" @item-click="onFriendClicked"/>
    </div>
    <div class="right-container column">
      aaa
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
      friends: []
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
      this.friends.forEach(friend => {
        if (friend.id == id) {
          friend.isClicked = true
        } else {
          friend.isClicked = false
        }
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
  }
</style>

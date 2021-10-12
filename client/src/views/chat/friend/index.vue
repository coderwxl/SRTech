<template>
  <div class="components-container">
    <div class="left-container column">
      <friend-item v-for="friend in friends" :image-url="friend.avatar" :name="friend.username" :signature="friend.signature" :key="friend.username" />
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
        this.friends = response.data
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

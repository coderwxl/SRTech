<template>
  <div class="components-container">
    <split-pane split="vertical" :default-percent="25" :min-percent="20">
      <template slot="paneL">
        <div class="left-container">
          <friend-item v-for="friend in friends" :image-url="friend.avatar" :name="friend.username" :signature="friend.signature" :key="friend.username" />
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container" />
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import FriendItem from '../friend/FriendItem.vue'
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

  .left-container {
    /* background-color: #F38181; */
    height: 100%;
  }

  .right-container {
    /* background-color: #FCE38A; */
    height: 100%;
  }
</style>

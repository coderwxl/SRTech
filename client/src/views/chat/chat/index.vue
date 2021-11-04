<template>
  <div class="components-container">  
    <div class="left-container column">
      <chat-item v-for="chat in chatList" :chat-id="chat.chat_id" :image-url="chat.friend_avatar" :name="chat.friend_name" :message="chat.message" :time="chat.time" :key="chat.chat_id" :is-clicked="chat.isClicked" 
        @item-click="onChatItemClicked"/>
    </div>
    <div v-if="hasDetail" class="right-container column">
      <split-pane split="horizontal" :default-percent="75" :min-percent="20">
        <template slot="paneL">
          <div class="top-container">
          </div>
        </template>
        <template slot="paneR">
          <div class="bottom-container">
          </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import ChatItem from './ChatItem.vue'
import { getChatList, getChatDetail } from '@/api/chat'

export default {
  name: 'Chat',
  components: { splitPane, ChatItem },
  data() {
    return {
      chatList: [],
      hasDetail: false,
      chatList: []
    }
  },
  created() {
    this.getChats()
  },
  methods: {
    getChats() {
      getChatList().then(response => {
        console.log(response)
        this.chatList = response.data.map(chat => {
          return Object.assign({}, chat, { isClicked: false })
        })
      })
    },
    onChatItemClicked(id) {
      this.hasDetail = true
      this.chatList.forEach(chat => {
        if (chat.chat_id == id) {
          chat.isClicked = true
        } else {
          chat.isClicked = false
        }
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
}

.right-container {
  height: 100%;
  width: calc(100% - 300px);
}

.top-container {
  /* background-color: #F38181; */
  width: 100%;
  height: 100%;
}

.bottom-container {
  /* background-color: #FCE38A; */
  width: 100%;
  height: 100%;
}
</style>

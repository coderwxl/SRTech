<template>
  <div class="components-container">  
    <div class="left-container column">
      <chat-item v-for="chat in chatList" :chat-id="chat.chat_id" :image-url="chat.friend_avatar" :name="chat.friend_name" :message="chat.message" :time="chat.time2" :key="chat.chat_id" :is-clicked="chat.isClicked" 
        @item-click="onChatItemClicked"/>
    </div>
    <div v-if="hasDetail" class="right-container column">
      <split-pane split="horizontal" :default-percent="75" :min-percent="20">
        <template slot="paneL">
          <div class="top-container">
            <message-item v-for="message in messageList" :message="message" :key="message.id" />
          </div>
        </template>
        <template slot="paneR">
          <div class="bottom-container">
            <div contenteditable="true" class="input-area" ref="inputarea"></div>
            <div class="tip-button-row">
              <span class="tip">Enter 发送，Ctrl+Enter 换行</span>
              <el-button class="send-button" type="primary" @click="onSubmit">发送</el-button>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import ChatItem from './ChatItem.vue'
import { getChatList, getChatDetail, sendMessage } from '@/api/chat'
import PublicMixin from '@/utils/public-mixin'
import MessageItem from './messageItem.vue'

export default {
  name: 'Chat',
  components: { splitPane, ChatItem, MessageItem },
  data() {
    return {
      chatList: [],
      hasDetail: false,
      messageList: [],
      inputdata: '',
      currentChatId: null
    }
  },
  mixins: [ PublicMixin ],
  created() {
    this.getChats()
  },
  methods: {
    getChats() {
      getChatList().then(response => {
        this.chatList = response.data.map(chat => {
          return Object.assign({}, chat, { isClicked: false, time2: this.StringToDate(chat.time, "YYYY-MM-DD HH:mm:ss.SSS") })
        })
      })
    },
    onChatItemClicked(id) {
      this.currentChatId = id
      this.hasDetail = true
      this.chatList.forEach(chat => {
        if (chat.chat_id == id) {
          chat.isClicked = true
        } else {
          chat.isClicked = false
        }
      })
      getChatDetail(id).then(res => {
        this.messageList = res.data
      })
    },
    onSubmit() {  
      sendMessage(this.currentChatId, this.$refs.inputarea.innerHTML).then(res => {
        this.$refs.inputarea.innerHTML = ''
        getChatDetail(this.currentChatId).then(res => {
          this.messageList = res.data
        })
      })
    }
  },
  sockets: {
    newMessage(val) {
      let msg = JSON.parse(val)
      if (this.currentChatId && msg[this.currentChatId.toString()]) {
        getChatDetail(this.currentChatId).then(res => {
          this.messageList = res.data
        })
      }
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
  background-color: #F1F2F3;
  width: 100%;
  height: 100%;

}

.bottom-container {
  width: 100%;
  height: 100%;
}

.tip-button-row {       
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
}

.input-area {
  height: calc(100% - 50px);
}

.send-button {
  margin-left: 10px;
  margin-right: 15px;
}

.tip {
  color: gray
}
</style>

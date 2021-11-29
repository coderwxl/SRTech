<template>
  <div class="components-container">  
    <div class="left-container column">
      <chat-item v-for="chat in chatList" :chat-id="chat.chat_id" :image-url="chat.friend_avatar" :name="chat.friend_name" :message="chat.message" :time="chat.time2" :key="chat.chat_id" :is-clicked="chat.isClicked" 
        @item-click="onChatItemClicked"/>
    </div>
    <div v-if="hasDetail" class="right-container column">
      <split-pane split="horizontal" :default-percent="75" :min-percent="20">
        <template slot="paneL">
          <div ref="msgct" class="top-container">
            <message-item v-for="message in messageList" :message="message" :key="message.id" />
          </div>
        </template>
        <template slot="paneR">
          <div class="bottom-container">
            <div contenteditable="true" class="input-area" ref="inputarea"></div>
            <div class="tip-button-row">
              <span class="tip">Enter 发送，Ctrl+Enter 换行</span>
              <el-button class="send-button" type="primary" size="medium" @click="onSubmit">发送</el-button>
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
      currentChatId: null,
      currentFriendId: null
    }
  },
  mixins: [ PublicMixin ],
  created() {
    this.currentFriendId=this.$route.query.friendId;
    this.getChats()
  },
  methods: {
    getChats() {
      getChatList().then(response => {
        this.chatList = response.data.map(chat => {
          if (this.currentFriendId === chat.friend_id) {
            this.onChatItemClicked(chat.chat_id)
          }
          return Object.assign({}, chat, { isClicked: this.currentFriendId === chat.friend_id ? true : false, time2: this.StringToDate(chat.time, "YYYY-MM-DD HH:mm:ss.SSS") })
        })
      })
    },
    onChatItemClicked(id) {
      this.currentChatId = id
      this.hasDetail = true
      this.chatList.forEach(chat => {
        if (chat.chat_id == id) {
          this.currentFriendId = chat.friend_id
          chat.isClicked = true
        } else {
          chat.isClicked = false
        }
      })
      getChatDetail(id).then(res => {
        this.messageList = res.data
        this.$nextTick(function() {
          this.$refs.msgct.scrollTop = this.$refs.msgct.scrollHeight - this.$refs.msgct.clientHeight
        })
      })
    },
    onSubmit() {  
      sendMessage(this.currentChatId, this.currentFriendId, this.$refs.inputarea.innerHTML).then(() => {
        this.$refs.inputarea.innerHTML = ''
      })
    }
  },
  sockets: {
    newMessage(val) {
      for (let id in val) {
        let find = false
        for (let obj of this.chatList) {
          if (obj.chat_id.toString() === id) {
            obj.message = val[id]
            find = true
            break
          }
        }
        if (!find) {
          getChatList().then(response => {
            this.chatList = response.data.map(chat => {
              return Object.assign({}, chat, { isClicked: this.currentFriendId === chat.friend_id ? true : false, time2: this.StringToDate(chat.time, "YYYY-MM-DD HH:mm:ss.SSS") })
            })
          })
          break
        }
      }
      if (this.currentChatId && val[this.currentChatId.toString()]) {
        getChatDetail(this.currentChatId).then(res => {
          this.messageList = res.data
          this.$nextTick(function() {
            this.$refs.msgct.scrollTop = this.$refs.msgct.scrollHeight - this.$refs.msgct.clientHeight
          })
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
  overflow: auto;
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
  padding: 10px;
  overflow: auto;
}

.send-button {
  margin-left: 10px;
  margin-right: 15px;
}

.tip {
  color: gray;
  font-size: 0.8em;
}
</style>

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
            <div contenteditable="true" class="input-area" ref="inputarea" @keydown="textareaKeydown" 
              @dragenter="onDrayEnterOrOver"
              @dragover="onDrayEnterOrOver"
              @drop="onDrop"
              @paste="onPaste">
            </div>
            <div class="tip-button-row">
              <div class="video-div">
                <el-tooltip content="语音聊天" placement="top">
                  <el-button type="text" class="fa fa-phone fa-lg" @click="onVoiceChat"></el-button>
                </el-tooltip>
                <el-tooltip content="视频聊天" placement="top">
                  <el-button type="text" class="fa fa-video-camera fa-lg" @click="onVideoChat"></el-button>
                </el-tooltip>
              </div>
              <div>
                <span class="tip">Enter 发送，Ctrl+Enter 换行</span>
                <el-button class="send-button" type="primary" size="medium" @click="onSubmit">发送</el-button>
              </div>
            </div>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog
      title="视频聊天"
      width="720px"
      :visible.sync="videoDialogVisible"
      :before-close="onVideoDialogBeforeClose">
      <div class="video-dialog">
        <video id="received_video" autoplay></video>
        <div class="video-dialog-right">
          <video id="local_video" autoplay muted></video>
          <el-button id="hangup-button" type="danger" class="hang-up-btn" size="medium" @click="videoHangUpCall" disabled>挂断</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import ChatItem from './ChatItem.vue'
import { getChatList, getChatDetail, sendMessage, sendFile } from '@/api/chat'
import PublicMixin from '@/utils/public-mixin'
import MessageItem from './messageItem.vue'
import imageCompression from 'browser-image-compression';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import adapter from 'webrtc-adapter'
import VideoChat from './videochat'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

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
      currentFriendId: null,
      videoDialogVisible: false,
      voiceDialogVisible: false
    }
  },
  mixins: [ PublicMixin, VideoChat ],
  mounted() {
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
        this.$refs.inputarea.focus()
        this.messageList = res.data
        this.$nextTick(function() {
          this.$refs.msgct.scrollTop = this.$refs.msgct.scrollHeight - this.$refs.msgct.clientHeight
        })
      })
    },
    onSubmit() {  
      if (!this.$refs.inputarea.innerHTML) {
        return
      }
      sendMessage(this.currentChatId, this.currentFriendId, this.$refs.inputarea.innerHTML).then(() => {
        this.$refs.inputarea.innerHTML = ''
      })
    },
    textareaKeydown(e) {
      var e = e || window.event, ec = e.keyCode || e.which;
      if(e.ctrlKey && ec === 13) {   //用户点击了ctrl+enter触发
        if (this.browserType() == "IE" || this.browserType() == "Edge") {
          this.$refs.inputarea.innerHTML += "<div></div>";
        }
        else if (this.browserType() == "FF") {
          this.$refs.inputarea.innerHTML += "<br/><br/>";
        } else {
          this.$refs.inputarea.innerHTML += "<div><br/></div>";
        }
        //设置输入焦点
        var last = this.$refs.inputarea.lastChild;
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(this.$refs.inputarea);
        range.collapse(false);
        range.setEndAfter(last);
        range.setStartAfter(last);
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (ec === 13) { //用户点击了enter触发
        this.onSubmit();
        e.preventDefault() // 阻止浏览器默认换行操作
        return false
      }  
    },
    browserType () {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isOpera = false;
      if (userAgent.indexOf('Edge') > -1) {
        return "Edge";
      }
      if (userAgent.indexOf('.NET') > -1) {
        return "IE";
      }
      if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        isOpera = true;
        return "Opera"
      }; //判断是否Opera浏览器
      if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
      } //判断是否Firefox浏览器
      if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
      }
      if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
      } //判断是否Safari浏览器
      if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
      }; //判断是否IE浏览器
    },
    onDrayEnterOrOver(e) {
      e.stopPropagation(); 
      e.preventDefault();
    },
    onDrop(e) {
      e.stopPropagation(); 
      e.preventDefault();
      this.dealFiles(e, e.dataTransfer.files);
    },
    onUploadProgressFunc(e) {
      NProgress.set(e.loaded/e.total)
    },
    onPaste(e) {
      this.dealFiles(e, e.clipboardData.files);
    },
    dealFiles(e, files) {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1000,
        useWebWorker: true
      }
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        // console.log(file)
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
          var data = new FormData();
          data.append("file", file);
          data.append("chatID", this.currentChatId)
          data.append("friendID", this.currentFriendId)
          sendFile(data, this.onUploadProgressFunc).then(res => {
            // console.log('upload over');
          })
          continue;
        }
        imageCompression(file, options)
          .then((compressedFile) => {
            var img = document.createElement("img");
            img.style="max-width:200px"
            img.file = compressedFile;
            e.target.appendChild(img); 
            var reader = new FileReader();
            reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
            reader.readAsDataURL(compressedFile);
          })
          .catch(function (error) {
            console.log(error.message);
          });
      }
    },
    onVoiceChat() {
      
    },
    onVideoChat() {
      this.videoDialogVisible = true
      this.invite().catch(() => {
        this.videoDialogVisible = false
      })
    },
    onVideoDialogBeforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.hangUpCall()
        })
        .catch(_ => {});
    },
    videoHangUpCall() {
      this.videoDialogVisible = false
      this.hangUpCall()
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
          this.$refs.inputarea.focus()
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
  overflow: auto;
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
  justify-content: space-between;
  align-items: center;
  height: 50px;

  .video-div {
    margin-left: 15px;
  }
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

.video-dialog {
  display: flex;
  justify-content: center;
  .video-dialog-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .hang-up-btn {
      width: 80px;
      height: 40px;
    }
  }
}

#received_video {
  width: 500px;
  height: 400px;
  border: 1px solid gray;
}

#local_video {
  width: 150px;
  height: 150px;
  border: 1px solid gray;
}
</style>

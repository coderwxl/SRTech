<template>
  <div class="chat-item" :style="{ '--bgcolor': isClicked ? '#dee4e4' : 'transparent', '--bghovercolor': isClicked ? '#dee4e4' : '#F7F8F8' }" @click="$emit('item-click', chatId)" @contextmenu.prevent="onContextmenu">
    <img :src="imageUrl" alt="暂无头像" class="user-avatar">
    <div class="info">
      <div>
        <span class="name">{{ name }}</span>
        <span class="time">{{ handledTime }}</span>
      </div>
      <div class="message" v-html="message"></div>
    </div>
  </div>
</template>

<script>
// import { deleteFriend } from '@/api/friend'

  export default {
    name: 'ChatItem',
    props: {
      chatId: Number,
      imageUrl: String,
      name: String,
      message: String,
      isClicked: Boolean,
      time: Date
    },
    methods: {
      onContextmenu(event) {
        this.$emit('item-click', this.id)
        this.$contextmenu({
          items: [
            {
              label: "置顶",
              icon: "el-icon-chat-dot-round",
              onClick: () => {
                console.log("置顶" + this.name);
              }
            },
            {
              label: "移除会话",
              icon: "el-icon-chat-dot-round",
              onClick: () => {
                console.log("移除会话" + this.name);
              }
            },
            {
              label: "消息免打扰",
              icon: "el-icon-chat-dot-round",
              divided: true,
              onClick: () => {
                console.log("消息免打扰" + this.name);
              }
            },
            {
              label: "个人信息",
              icon: "el-icon-edit",
              onClick: () => {
                console.log("个人信息" + this.name);
              }
            },
            {
              label: "清空聊天记录",
              icon: "el-icon-delete",
              onClick: () => {
                this.$confirm('确定清空聊天记录吗？ 清空后不可恢复', '提示', {
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  type: 'success'
                }).then(() => {
                  // deleteFriend(this.id).then(() => {
                  //   this.$emit("refresh")
                  // })
                })
              }
            }
          ],
          event,
          zIndex: 3,
          minWidth: 100,
          customClass: "custom-menu"
        });
        return false;
      }
    },
    computed: {
      handledTime() {
        let today = new Date();
        if (this.time.getFullYear() === today.getFullYear() 
          && this.time.getMonth() === today.getMonth()
          && this.time.getDate() === today.getDate()) {
          return `${today.getHours()}:${today.getSeconds()}`
        } else if (this.time.getFullYear() === today.getFullYear() 
          && this.time.getMonth() === today.getMonth()
          && this.time.getDate() === today.getDate() - 1) {
          return "昨天"
        } else {
          return `${this.time.getFullYear()}-${this.time.getMonth() + 1}-${this.time.getDate()}`;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.custom-menu .menu{
  padding: 4px 0;
}
.chat-item {
  display: flex;
  align-items: center;
  height: 60px;
  width: 100%;
  padding-left: 10px;
  background-color: var(--bgcolor);

  &:hover {
    background-color: var(--bghovercolor);
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: contain;
  }

  .info {
    width: 100%;
    margin-left: 10px;
    margin-right: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .name{
      float: left;
    }
    .time {
      float: right;
      font-size: 0.7em;
      color: grey;
    }
    .message {
      font-size: 0.7em;
      color: grey;
      margin-top: 5px;
      height: 1em;
      overflow: hidden;
    }
  }

}
</style>

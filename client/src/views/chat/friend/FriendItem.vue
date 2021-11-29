<template>
  <div class="friend-item" :style="{ '--bgcolor': isClicked ? '#dee4e4' : 'transparent', '--bghovercolor': isClicked ? '#dee4e4' : '#F7F8F8' }" @click="$emit('item-click', id)" @contextmenu.prevent="onContextmenu">
    <img :src="imageUrl" alt="暂无头像" class="user-avatar">
    <div class="info">
      <span class="name">{{ name }}</span>
      <span class="signature">{{ signature }}</span>
    </div>
  </div>
</template>

<script>
import { deleteFriend, sendMessage } from '@/api/friend'

  export default {
    name: 'FriendItem',
    props: { 
      id: Number,
      imageUrl: String,
      name: String,
      signature: String,
      isClicked: Boolean
    },
    methods: {
      onContextmenu(event) {
        this.$emit('item-click', this.id)
        this.$contextmenu({
          items: [
            {
              label: "发送消息",
              icon: "el-icon-chat-dot-round",
              onClick: () => {
                sendMessage(this.id).then(() => {
                  this.$router.push({ path: '/chat/chat' , query: { friendId: this.id }})
                })
              }
            },
            {
              label: "修改备注",
              divided: true,
              icon: "el-icon-edit",
              onClick: () => {
                this.$emit("edit-remark")
              }
            },
            {
              label: "删除好友",
              icon: "el-icon-delete",
              onClick: () => {
                this.$confirm('确定删除该好友吗？', '提示', {
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  type: 'success'
                }).then(() => {
                  deleteFriend(this.id).then(() => {
                    this.$emit("refresh")
                  })
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
    }
  }
</script>

<style lang="scss" scoped>
.custom-menu .menu{
  padding: 4px 0;
}
.friend-item {
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
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .signature {
      font-size: 0.7em;
      color: grey;
      margin-top: 5px;
    }
  }

}
</style>

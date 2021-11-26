<template>
  <div class="main" :style="{ '--flexdir': isMe ? 'row-reverse' : 'row', '--databg' : isMe ? '#C9E7FF' : 'white', '--dataml': isMe ? '0' : '8px', '--datamr': isMe ? '8px' : '0' }">
    <img :src="message.avatar" alt="暂无头像" class="avatar">
    <div class="data">{{ message.data }}</div>
  </div>
</template>

<script>
  export default {
    name: 'messageItem',
    props: {
      message: Object
    },
    methods: {
    },
    computed: {
        isMe() {
            return this.$store.state.user.name === this.message.username
        }
    }

  }
</script>


<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  flex-direction: var(--flexdir);
  padding: 7px;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    object-fit: contain;
  }

  .data {
    background-color: var(--databg);
    padding: 7px;
    border-radius: 4px;
    margin-left: var(--dataml);
    margin-right: var(--datamr);
  }
}
</style>
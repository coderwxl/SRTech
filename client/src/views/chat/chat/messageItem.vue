<template>
  <div>
    <div class="main" :style="{ '--flexdir': isMe ? 'row-reverse' : 'row' }">
      <img :src="message.avatar" alt="暂无头像" class="avatar">
      <div class="data">{{ message.data }}</div>
    </div>
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
  flex-direction: var(--flexdir);
  margin: 5px;

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    object-fit: contain;
  }

  .data {
    background-color: lightgrey;
  }
}
</style>
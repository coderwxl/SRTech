<template>
  <div class="friend-item">
    <img :src="imageUrl" alt="暂无头像" class="user-avatar">
    <div class="info">
      <span class="name">{{ name }}</span>
      <span class="signature">{{ signature }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FriendItem',
    props: { 
      imageUrl: String,
      name: String,
      signature: String
    }
  }
</script>

<style lang="scss" scoped>
.friend-item {
  display: flex;
  align-items: center;
  height: 60px;
  width: 100%;
  padding-left: 10px;

  &:hover {
    background-color: #F5F5F6;
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

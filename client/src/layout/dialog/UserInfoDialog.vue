<template>
  <el-dialog :visible.sync="dialogVisible">
    <div class="body-left">
      <el-upload
        class="avatar-uploader"
        action="/user/avatar"
        :show-file-list="false"
        :headers="authHeader"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div class="body-right">
      <el-form ref="userInfo" :model="userInfo">
        <el-form-item>
          <div class="edit-button">
            <el-button type="text" @click="dialogVisible = false">取消</el-button>
            <el-button type="text" @click="dialogVisible = false">编辑</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <i class="fa fa-user-o fa-fw"></i>
          <el-input 
            v-model="userInfo.username" 
            placeholder="用户名"
            tabindex="1"
          />
        </el-form-item>
        <el-form-item>
          <i class="fa fa-tags fa-fw"></i>
          <el-input 
            v-model="userInfo.signature" 
            placeholder="个性签名"
            tabindex="2"
          />
        </el-form-item>
        <el-form-item>
          <i class="fa fa-birthday-cake fa-fw"></i>
          <el-date-picker 
            type="date" 
            placeholder="出生日期" 
            v-model="userInfo.birthday"
            tabindex="3"
            prefix-icon=""
          />
        </el-form-item>
        <el-form-item>
          <i class="fa fa-briefcase fa-fw"></i>
          <el-select v-model="userInfo.job" placeholder="职业" tabindex="4">
            <el-option value="工人"></el-option>
            <el-option value="农民"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <i class="fa fa-map-marker fa-lg fa-fw"></i>
          <el-input 
            v-model="userInfo.address" 
            placeholder="现居住地"
            tabindex="5"
          />
        </el-form-item>
        <el-form-item>
          <i class="fa fa-mobile fa-lg fa-fw"></i>
          <el-input 
            v-model="userInfo.phone" 
            placeholder="电话"
            tabindex="6"
          />
        </el-form-item>
        <el-form-item>
          <i class="fa fa-envelope-o fa-fw"></i>
          <el-input 
            v-model="userInfo.email" 
            placeholder="邮箱"
            tabindex="7"
          />
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'UserInfoDialog',
  props: {
    userInfoDialogVisible: Boolean
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.userInfoDialogVisible
      },
      set: function(value) {
        this.$emit('update:user-info-dialog-visible', value)
      }
    },
    authHeader: function() {
      return { Authorization: 'Bearer ' + getToken() }
    },
    avatarUrl: function() {
      return this.$store.state.user.avatar
    }
  },
  data() {
    return {
      userInfo: {
        username: '',
        signature: '',
        birth_date: '',
        job: '',
        address: '',
        phone: '',
        email: ''
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$store.commit('user/SET_AVATAR', res.data.avatar)
      console.log(res)
      console.log(file)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style lang="scss" scoped>

$avatar_size:150px;

.body-left {
  display: inline-block;
  width: 35%;

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: $avatar_size;
    height: $avatar_size;
    margin: 110px auto;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: $avatar_size;
    height: $avatar_size;
    line-height: $avatar_size;
    text-align: center;
  }
  .avatar {
    width: $avatar_size;
    height: $avatar_size;
    display: block;
  }
}

.body-right {
  display: inline-block;
  width: 65%;

  .edit-button {
    float: right;
  }

  .el-form-item {
    margin: 10px;

    .el-input, .el-date-picker, .el-select {
      display: inline-block;
      width: 90%;
      float: right;
    }

    i {
      width: 10%;
      text-align: center;
    }
  }
}
</style>
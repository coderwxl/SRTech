<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" :rules="loginRules" class="login-form" autocomplete="off" label-position="left">

      <div class="title-container">
        <h3 class="title">新用户注册</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="用户名"
          type="text"
          tabindex="1"
          prefix-icon="el-icon-user"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          ref="password"
          key="password"
          v-model="registerForm.password"
          type="password"
          placeholder="密码"
          tabindex="2"
          show-password
          prefix-icon="el-icon-lock"
        />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="确认密码"
          tabindex="3"
          show-password
          prefix-icon="el-icon-lock"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleRegister">注册</el-button>
      <el-button type="text" style="padding: 0px; margin: 0px; float: left;" @click.native.prevent="backtoLogin">返回登录页面</el-button>

    </el-form>
  </div>
</template>

<script>
import { register } from '@/api/user'
import md5 from 'md5'

export default {
  name: 'Register',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
          { min: 6, max: 20, trigger: 'blur', message: '用户名长度不满足要求（最短6位，最长20位）' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { min: 6, max: 20, trigger: 'blur', message: '密码长度不满足要求（最短6位，最长20位）' }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: '确认密码不能为空' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(Object.assign({}, this.registerForm, { password: md5(this.registerForm.password) })).then(() => {
            this.loading = false
            this.$confirm('注册成功，是否返回登录页面', '提示', {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'success'
            }).then(async() => {
              await this.$store.dispatch('user/resetToken')
              this.$router.push({ path: '/login' })
            }).catch(() => {
              this.$refs.registerForm.resetFields()
            })
          }, () => {
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('validate failed!')
          return false
        }
      })
    },

    async backtoLogin() {
      await this.$store.dispatch('user/resetToken')
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss" scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>

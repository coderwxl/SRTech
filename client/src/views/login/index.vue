<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">SR科技</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
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
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
          tabindex="2"
          autocomplete="off"
          show-password
          prefix-icon="el-icon-lock"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-button type="text" style="padding: 0px; margin: 0px; float: right;" @click.native.prevent="gotoRegister">注册</el-button>

    </el-form>
  </div>
</template>

<script>
import md5 from 'md5'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
          { min: 6, trigger: 'blur', message: '用户名长度不满足要求（最少6位）' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { min: 6, trigger: 'blur', message: '密码长度不满足要求（最少6位）' }
        ]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', Object.assign({}, this.loginForm, { password: md5(this.loginForm.password) })).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            window.location.reload()
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

    gotoRegister() {
      this.$router.push({ path: '/register' })
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

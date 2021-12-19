import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import 'font-awesome/css/font-awesome.min.css' // font-awesome

// import dayjs from 'dayjs'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import Contextmenu from "vue-contextmenujs"
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';

import { getToken } from '@/utils/auth'

Vue.use(Contextmenu);

// setTimeout(() => {
//   // Vue.$root.$destroy();
//   window.location.reload()
//   //后面把地址改成动态获取的

// }, 5000);

// let serverAddress = window.location.origin;
let serverAddress = "https://192.168.31.159:443"
console.log(serverAddress)
if (serverAddress) {
  const socket = io(serverAddress, {
    auth: {
      token: ""
    }
  });
  
  Vue.use(VueSocketIOExt, socket);
}


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

// Vue.filter('DateTimeFormat', function(datetime, format) {
//   return dayjs(datetime).format(format)
// })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  sockets: {
    connect() {
      console.log('socket connected')
    },
    connect_error() {
      setTimeout(() => {
        console.log(getToken())
        if (getToken()) {
          this.$socket.client.auth.token = getToken()
        }
        this.$socket.client.connect();
      }, 1000);
    },
    disconnect(reason) {
      console.log('socket disconnect: ' + reason)
    }
  }
})

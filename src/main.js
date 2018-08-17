// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import Axios from 'axios'
import QS from 'qs'
import { ToastPlugin, AlertPlugin, LoadingPlugin, ConfirmPlugin, WechatPlugin } from 'vux'
import './assets/style/main.less'
import './assets/style/iconfont.css'
import './assets/style/animate.css'

Vue.use(Vuex)
Vue.use(ToastPlugin, {position: 'middle', type: 'text', width: 'inherit'})
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(WechatPlugin)

const BASE_URL = 'http://api.ellabook.cn/rest/'
// const BASE_URL = 'http://118.31.171.207:9000/rest/'

Axios.defaults.baseURL = BASE_URL + 'api/service'
Vue.prototype.$axios = Axios
Vue.prototype.$QS = QS

Axios.get(BASE_URL + 'wxshare/Weixinshare?weixinurl=' + window.location.href)
  .then(function (response) {
    Vue.wechat.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wxca187025bd70cab8', // 必填，公众号的唯一标识
      timestamp: response.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
      signature: response.data.signature, // 必填，签名，见附录1
      jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'scanQRCode',
        'chooseWXPay'
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
  })
  .catch(function (error) {
    console.log(error)
  })

const store = new Vuex.Store({}) // 这里你可能已经有其他 module

store.registerModule('vux', { // 名字自己定义
  state: {
    direction: 'forward',
    uid: window.localStorage.getItem('uid'),
    token: window.localStorage.getItem('token')
  },
  mutations: {
    updateDirection (state, payload) {
      state.direction = payload.direction
    },
    updateUid (state, payload) {
      state.uid = payload.uid
    },
    updateToken (state, payload) {
      state.token = payload.token
    }
  }
})

const history = window.sessionStorage
let historyCount = history.getItem('count') * 1

router.beforeEach(function (to, from, next) {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10)) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      store.commit('updateDirection', {direction: 'reverse'})
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }
  next()
})

router.afterEach(function (to) {
})

FastClick.attach(document.body)

window.onresize = setHtmlFontSize
function setHtmlFontSize () {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
  const htmlDom = document.getElementsByTagName('html')[0]
  htmlDom.style.fontSize = htmlWidth / 10 + 'px'
};
setHtmlFontSize()

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

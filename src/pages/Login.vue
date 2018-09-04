<template>
  <div id="login">
    <div class="el-sign-header">欢迎登录</div>
    <div class="el-sign-content">
      <input type="text" placeholder="请输入手机号" maxlength=11 v-model.trim="phone">
      <div class="el-password" v-show="!showPassword">
        <input type="password" placeholder="请输入密码" v-model.trim="password">
        <a href="#/resetPassword">忘记密码</a>
        <i @click="toShowPassword" class="icon iconfont icon-iconnoshowpassword"></i>
      </div>
      <div class="el-password" v-show="showPassword">
        <input type="text" placeholder="请输入密码" v-model.trim="password">
        <a href="#/resetPassword">忘记密码</a>
        <i @click="hidePassword" class="icon iconfont icon-icon_showpassword"></i>
      </div>
      <div class="el-btn btn-green" @click="login">登录</div>
      <a href="#/register" class="el-register">注册账号</a>
      <div class="el-third-party-login">
        <p>快速登录</p>
        <div class="el-third-party">
          <img src="../../static/img/login_icon_weixin_default@2x.png" alt="" @click="wxPreLogin">
          <!-- <img src="../../static/img/login_icon_qq_default@2x.png" alt="">
          <img src="../../static/img/login_icon_weibo_default@2x.png" alt=""> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { md5 } from 'vux'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      showPassword: false,
      phone: '',
      password: ''
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token,
      isWX: state => state.vux.isWX,
      wxUserInfo: state => state.vux.wxUserInfo
    })
  },
  created () {
    // console.log(2)
  },
  activated () {
    console.log(this.$route.query.from)
  },
  components: {
  },
  methods: {
    toShowPassword () {
      this.showPassword = true
    },
    hidePassword () {
      this.showPassword = false
    },
    login () {
      if (this.phone === '') {
        this.$vux.toast.show({
          text: '手机号不能为空'
        })
        return
      }
      if (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.phone)) {
        this.$axios.post('', this.$QS.SF({
          method: 'ella.user.login',
          content: JSON.stringify({
            customerName: this.phone,
            password: md5(this.password),
            deviceNo: 'h5',
            deviceToken: 'h5',
            clientType: 'h5',
            resource: 'h5',
            clientVersion: 'h5',
            channelCode: 'h5',
            registerVerificationType: '0'
          })
        })).then((response) => {
          if (response.data.status === '1') {
            window.localStorage.setItem('uid', response.data.data.uid)
            window.localStorage.setItem('token', response.data.data.token)
            this.$store.commit('updateUid', {uid: response.data.data.uid})
            this.$store.commit('updateToken', {token: response.data.data.token})
            this.$router.replace(this.$route.query.from || 'index/mine')
          } else {
            this.$vux.toast.show({
              text: response.data.message
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        this.$vux.toast.show({
          text: '手机号格式不正确'
        })
      }
    },
    wxPreLogin () {
      if (this.isWX) {
        this.WXLogin('0')
      } else {
        this.$vux.alert.show({
          title: '提示',
          content: '请在微信内打开页面，并授权~'
        })
      }
    },
    WXLogin (loginFrom) {
      let _this = this
      if (this.wxUserInfo) {
        let wxUserInfo = JSON.parse(this.wxUserInfo)
        this.$vux.loading.show()
        this.$axios.post('', this.$QS.SF({
          method: 'ella.user.bindAndLogin',
          content: JSON.stringify({
            customerName: '',
            password: '',
            deviceNo: '',
            deviceToken: '',
            clientType: '',
            resource: '',
            uid: wxUserInfo.unionid,
            unionID: wxUserInfo.unionid,
            idname: wxUserInfo.nickname,
            gender: wxUserInfo.sex === 1 ? 'MALE' : 'FEMALE',
            iconurl: wxUserInfo.headimgurl,
            platformType: 'WEIXIN',
            loginFrom: loginFrom,
            loginVerificationType: '0',
            checkCode: ''
          })
        })).then((response) => {
          if (response.data.status === '1') {
            console.log(response.data)
            if (response.data.code === '10001010') {
              this.$vux.confirm.show({
                title: '绑定已有账号',
                content: '若您是新用户可选择“取消”',
                confirmText: '已有咿啦账号',
                onCancel () {
                  console.log('plugin cancel')
                  _this.WXLogin('1')
                },
                onConfirm () {
                  _this.$router.push('../bindMobile?from=' + _this.$route.query.from || 'index/mine')
                }
              })
            } else {
              window.localStorage.setItem('uid', response.data.data.uid)
              window.localStorage.setItem('token', response.data.data.token)
              this.$store.commit('updateUid', {uid: response.data.data.uid})
              this.$store.commit('updateToken', {token: response.data.data.token})
              this.$router.replace(this.$route.query.from || 'index/mine')
              this.$vux.toast.show({
                text: '登陆成功，欢迎回来'
              })
            }
          } else {
            this.$vux.toast.show({
              text: response.data.message
            })
          }
          this.$vux.loading.hide()
        }).catch(function (error) {
          this.$vux.loading.hide()
          console.log(error)
        })
      } else {
        this.$vux.confirm.show({
          title: '提示',
          content: '还未授权，请先授权哦~',
          confirmText: '去授权',
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            window.location.reload()
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/sign.less');
#login{
  min-height: 100%;
  background-color: #fff;
}

</style>

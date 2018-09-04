<template>
  <div id="register">
    <div class="el-sign-header">欢迎注册</div>
    <div class="el-sign-content">
      <div class="el-password">
        <input type="text" placeholder="请输入手机号" v-model.trim="phone" maxlength=11>
        <span @click="getCode" v-show="!isCountDown">获取验证码</span>
        <span v-show="isCountDown">{{countDownText}}</span>
      </div>
      <div class="el-password">
        <input type="text" placeholder="请输入验证码" v-model.trim="code" maxlength=11>
      </div>
      <div class="el-password" v-show="!showPassword">
        <input type="password" placeholder="请输入密码" v-model.trim="password">
        <i @click="showPassword = true" class="icon iconfont icon-iconnoshowpassword"></i>
      </div>
      <div class="el-password" v-show="showPassword">
        <input type="text" placeholder="请输入密码" v-model.trim="password">
        <i @click="showPassword = false" class="icon iconfont icon-icon_showpassword"></i>
      </div>
      <div class="el-btn btn-green" @click="register">注册</div>
      <p class="el-user-agreement">点击注册即表明您已阅读并同意<a href="#/userAgreement">用户协议</a></p>
      <a href="#/login" class="el-register">已有咿啦账号</a>
      <!-- <div class="el-third-party-login">
        <p>快速登录</p>
        <div class="el-third-party">
          <img src="../../static/img/login_icon_weixin_default@2x.png" alt="">
          <img src="../../static/img/login_icon_qq_default@2x.png" alt="">
          <img src="../../static/img/login_icon_weibo_default@2x.png" alt="">
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { md5 } from 'vux'
export default {
  data () {
    return {
      showPassword: false,
      phone: '',
      code: '',
      password: '',
      isCountDown: false,
      countDownText: '60s',
      T: null
    }
  },
  created () {
    // console.log(2)
  },
  activated () {
  },
  components: {
  },
  methods: {
    getCode () {
      if (this.phone === '') {
        this.$vux.toast.show({
          text: '手机号不能为空'
        })
        return
      }
      if (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.phone)) {
        this.countDown()
        this.$axios.post('', this.$QS.SF({
          method: 'ella.user.sendMessage',
          content: JSON.stringify({
            mobileNum: this.phone,
            type: 'LOGIN_CHECK'
          })
        })).then((response) => {
          if (response.data.status === '1') {
            console.log(response.data)
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
    register () {
      this.$axios.post('', this.$QS.SF({
        method: 'ella.user.register',
        content: JSON.stringify({
          customerName: this.phone,
          password: md5(this.password),
          checkCode: this.code,
          clientVersion: 'h5',
          countryCode: 'h5',
          channelCode: 'h5',
          deviceNo: 'h5',
          deviceToken: 'h5',
          registerType: 'h5',
          clientType: 'h5',
          resource: 'h5',
          registerVerificationType: '1'
        })
      })).then((response) => {
        if (response.data.status === '1') {
          this.$router.replace('login')
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    countDown () {
      this.T && clearInterval(this.T)
      let count = 59
      this.isCountDown = true
      this.countDownText = '60s'
      this.T = setInterval(() => {
        if (count > -1) {
          this.countDownText = count + 's'
          count--
        } else {
          clearInterval(this.T)
          this.countDownText = '重新获取'
          this.isCountDown = false
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/sign.less');
#register{
  min-height: 100%;
  background-color: #fff;
}
</style>

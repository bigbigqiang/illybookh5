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
          <img src="../../static/login_icon_weixin_default@2x.png" alt="">
          <!-- <img src="../../static/login_icon_qq_default@2x.png" alt="">
          <img src="../../static/login_icon_weibo_default@2x.png" alt=""> -->
        </div>
      </div>
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
      password: ''
    }
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
        this.$axios.post('', this.$QS.stringify({
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

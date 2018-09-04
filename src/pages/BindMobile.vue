<template>
  <div id="bindMobile">
    <div class="el-sign-header">绑定手机号</div>
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
      <div class="el-btn btn-green" @click="bindMobile">完成</div>
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
    bindMobile () {
      if (this.phone === '') {
        this.$vux.toast.show({
          text: '手机号不能为空'
        })
        return
      }
      if (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.phone)) {
        if (this.wxUserInfo) {
          let wxUserInfo = JSON.parse(this.wxUserInfo)
          this.$vux.loading.show()
          this.$axios.post('', this.$QS.SF({
            method: 'ella.user.bindAndLogin',
            content: JSON.stringify({
              customerName: this.phone,
              password: md5(this.password),
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
              loginFrom: '2',
              loginVerificationType: '0',
              checkCode: ''
            })
          })).then((response) => {
            if (response.data.status === '1') {
              console.log(response.data)
              window.localStorage.setItem('uid', response.data.data.uid)
              window.localStorage.setItem('token', response.data.data.token)
              this.$store.commit('updateUid', {uid: response.data.data.uid})
              this.$store.commit('updateToken', {token: response.data.data.token})
              this.$vux.toast.show({
                text: '绑定成功，欢迎回来'
              })
            } else {
              this.$vux.alert.show({
                title: '提示',
                content: response.data.message + ',页面将返回~',
                onShow () {
                  console.log('Plugin: I\'m showing')
                },
                onHide () {
                  this.$router.go(-1)
                }
              })
            }
            this.$router.replace(this.$route.query.from || 'index/mine')
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
#bindMobile{
  min-height: 100%;
  background-color: #fff;
}

</style>

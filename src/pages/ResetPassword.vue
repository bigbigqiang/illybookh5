<template>
  <div id="forget">
    <i @click="goBack" class="icon iconfont icon-page-left"></i>
    <div class="el-sign-header">重置密码</div>
    <div class="el-sign-content">
      <div class="step-1" v-show="step === 1">
        <div class="el-password">
          <input type="text" placeholder="请输入手机号" v-model.trim="phone" maxlength=11>
          <span @click="getCode" v-show="!isCountDown">获取验证码</span>
          <span v-show="isCountDown">{{countDownText}}</span>
        </div>
        <div class="el-password">
          <input type="text" placeholder="请输入验证码" v-model.trim="code" maxlength=11>
        </div>
        <div class="el-btn btn-green" @click="next">下一步</div>
      </div>
      <div class="step-2" v-show="step === 2">
        <div class="el-password" v-show="!showPassword">
          <input type="password" placeholder="请输入密码" v-model.trim="password">
          <i @click="showPassword = true" class="icon iconfont icon-iconnoshowpassword"></i>
        </div>
        <div class="el-password" v-show="showPassword">
          <input type="text" placeholder="请输入密码" v-model.trim="password">
          <i @click="showPassword = false" class="icon iconfont icon-icon_showpassword"></i>
        </div>
        <div class="el-btn btn-green" @click="modifyDone">完成</div>
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
      code: '',
      password: '',
      isCountDown: false,
      countDownText: '60s',
      T: null,
      step: 1
    }
  },
  created () {
    // console.log(2)
  },
  activated () {
    if (this.$route.query.phone) {
      this.phone = this.$route.query.phone
    }
  },
  components: {
  },
  methods: {
    next () {
      if (this.code === '') {
        this.$vux.toast.show({
          text: '验证码不能为空'
        })
        return
      }
      this.$axios.post('', this.$QS.SF({
        method: 'ella.user.verifyCheckCode',
        content: JSON.stringify({
          mobileNum: this.phone,
          checkCode: this.code
        })
      })).then((response) => {
        if (response.data.status === '1') {
          this.step = 2
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    modifyDone () {
      this.$axios.post('', this.$QS.SF({
        method: 'ella.user.resetPassword',
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
          isCheck: '1'
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
    goBack () {
      switch (this.step) {
        case 1:
          this.$router.go(-1)
          break
        case 2:
          this.step--
          break
        default:
      }
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
    },
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
            type: 'REGISTER_CHECK'
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
          this.$router.push('login')
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/sign.less');
#forget{
  min-height: 100%;
  background-color: #fff;
  position: relative;
  &>i{
    font-size: 64px;
    position: absolute;
    left: 50px;
    top: 50px;
  }
}
.step-1{
  height: 100%;
  width: 100%;
}
</style>

<template>
  <div class="payment">
    <div class="payment-mask" v-show="paymentOpen"></div>
    <transition name="custom-classes-transition"
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown">
      <div class="el-payment" v-show="paymentOpen">
        <h3 class="el-payment-header vux-1px-b">
          <i class="icon iconfont icon-close" @click="$emit('listenPaymentOpen', false)"></i>
          支付
        </h3>
        <p class="el-goods-type">{{goodsType}}</p>
        <p class="el-pay-amount">合计 <span>{{payCoinType.price}}</span> </p>
        <divider class="el-prompt">支付方式</divider>
        <div class="el-pay-type">
          <div class="platform">
            <img src="../../static/img/pay_wechat@2x.png" alt="">
            <span>微信支付</span>
          </div>
          <span><i class="icon iconfont icon-right"></i></span>
        </div>
        <div style="width:80%;" class="el-btn btn-green" @click="confirmPay">确认支付</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Divider } from 'vux'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token,
      isWX: state => state.vux.isWX
    })
  },
  props: [
    'paymentOpen',
    'goodsType',
    'payCoinType'
  ],
  components: {
    Divider
  },
  mounted () {
  },
  methods: {
    confirmPay () {
      if (this.isWX) {
        this.$vux.alert.show({
          title: '提示',
          content: '请在微信外打开页面并完成支付~'
        })
      } else {
        this.$axios.post('', this.$QS.SF({
          method: 'ella.order.pay',
          platform: 'APP',
          content: JSON.stringify({
            uid: this.uid,
            paymentPlantform: 'WXPAY_WAP',
            orderType: 'ELLA_COIN_BUY',
            thirdCode: this.payCoinType.coinCode,
            channelCode: 'H5'
          })
        })).then((response) => {
          if (response.data.status === '1') {
            window.location.href = response.data.data.mweb_url
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
}
</script>
<style lang="less" scoped>
.payment{
  .payment-mask{
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.7);
    width: 100%;
    height: 100%;
    z-index: 1000;
  }
  .el-payment{
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    height: 50%;
    font-size: 0.48rem;
    text-align: center;
    padding-bottom: 50px;
    z-index: 1001;
    .el-payment-header{
      height: 104px;
      line-height: 104px;
      text-align: center;
      font-weight: normal;
      position: relative;
      &>i{
        color: #aaaaaa;
        font-size: 56px;
        position: absolute;
        left: 16px;
        top: 6px;
      }
    }
    .el-goods-type{
      font-size: 24px;
      color: #aaa;
      margin-top:50px;
      margin-bottom: 24px;
    }
    .el-pay-amount{
      font-size: 24px;
      color: #aaa;
      span{
        color: #333;
        font-size: 32px;
        font-weight: bold;
      }
    }
    .el-pay-type{
      width: 60%;
      margin: 60px auto 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .platform{
        color: #666;
        font-size: 26px;
        display: flex;
        align-items: center;
        img{
          display: block;
          height: 54px;
          margin-right: 10px;
        }
      }
      &>span{
        display: block;
        height: 36px;
        width: 36px;
        background-color: #40d8b1;
        border-radius: 50%;
        font-size: 36px;
        line-height: 36px;
        i{
          color: #fff;
          font-size: 36px;
        }
      }
    }
  }
}
</style>

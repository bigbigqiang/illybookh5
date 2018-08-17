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
        <p class="el-pay-amount">合计 <span>{{payAmount}}</span> 元</p>
        <divider class="el-prompt">支付方式</divider>
        <div class="el-pay-type">
          <div class="platform">
            <img src="../../static/pay_wechat@2x.png" alt="">
            <span>微信支付</span>
          </div>
          <span><i class="icon iconfont icon-right"></i></span>
        </div>
        <div class="el-btn btn-green" @click="confirmPay">确认支付</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Divider } from 'vux'
export default {
  data () {
    return {
    }
  },
  props: [
    'paymentOpen',
    'goodsType',
    'payAmount'
  ],
  components: {
    Divider
  },
  mounted () {
  },
  methods: {
    confirmPay () {
      this.$vux.toast.show({
        text: '下一步要做的事情~'
      })
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

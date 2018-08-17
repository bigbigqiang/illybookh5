<template>
<div class="Recharge">
  <transition name="custom-classes-transition"
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown">
      <div class="el-recharge" v-show="rechargeOpen">
        <i class="icon iconfont icon-close" @click="$emit('listenRechargeOpen', false)"></i>
        <p class="el-recharge-header">余额不足请充值</p>
        <div class="el-recharge-content">
          <div class="el-recharge-item" v-for="(item, index) in recharge" :key="index" :class="{active: index === selectIndex}" @click="selectIndex = index">
              <div class="el-cost">{{item.cost}}<span>元</span></div>
              <div class="el-ellaCoin">{{item.ellaCoin}}</div>
              <div class="el-gift" v-if="item.gift">{{item.gift}}</div>
          </div>
        </div>
        <div class="el-recharge-pay" @click="rechargePay">立即支付</div>
      </div>
    </transition>
    <payment :paymentOpen="paymentOpen" @listenPaymentOpen="listenPaymentOpen" :goodsType="'咿啦币充值'" :payAmount="recharge[selectIndex].cost"></payment>
</div>
</template>

<script>
import Payment from '../components/Payment'
export default {
  data () {
    return {
      recharge: [
        {
          cost: 6,
          ellaCoin: '6咿啦币',
          gift: ''
        },
        {
          cost: 30,
          ellaCoin: '30咿啦币',
          gift: '送5购书红包'
        },
        {
          cost: 50,
          ellaCoin: '50咿啦币',
          gift: '送10购书红包'
        },
        {
          cost: 98,
          ellaCoin: '98咿啦币',
          gift: '送30购书红包'
        },
        {
          cost: 138,
          ellaCoin: '138咿啦币',
          gift: '送50购书红包'
        },
        {
          cost: 198,
          ellaCoin: '198咿啦币',
          gift: '送80购书红包'
        }
      ],
      selectIndex: 0,
      paymentOpen: false
    }
  },
  props: [
    'rechargeOpen'
  ],
  watch: {
    // rechargeOpen: function (val, oldVal) {
    //   if (val) {
    //     this.renderChineseNum()
    //   }
    // }
  },
  components: {
    Payment
  },
  mounted () {
  },
  methods: {
    listenPaymentOpen (value) {
      this.paymentOpen = value
    },
    rechargePay () {
      this.paymentOpen = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-recharge{
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(222,222,222,0.96);
  width: 100%;
  height: 100%;
  font-size: 36px;
  text-align: center;
  z-index: 1000;
  &>i{
    color: #40d8b1;
    font-size: 56px;
    position: absolute;
    left: 32px;
    top: 32px;
  }
  .el-recharge-header{
    padding-top: 150px;
    padding-bottom: 8px;
    color: #333;
    font-size: 40px;
    font-weight: bold;
  }
  .el-recharge-content{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 32px;
    margin-top: 100px;
    .el-recharge-item{
      height: 195px;
      width: 218px;
      padding-top: 100px;
      background-color: #fff;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 16px;
      text-align: center;
      position: relative;
      .el-cost{
        color: #eebf5a;
        font-size: 48px;
        margin-bottom: 12px;
        span{
          font-size: 24px;
        }
      }
      .el-ellaCoin{
        font-size: 28px;
        color:#666;
        margin-bottom: 12px;
      }
      .el-gift{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 44px;
        line-height: 44px;
        font-size: 22px;
        color: #fff;
        background-color: #eebf5a;
      }
    }
    .active{
      background-color: #eebf5a;
      .el-cost{
        color: #fff;
      }
      .el-ellaCoin{
        color:#fff;
      }
      .el-gift{
        color: #eebf5a;
        background-color: #fff;
      }
    }
  }
  .el-recharge-pay{
    background-color: #40d8b1;
    color: #fff;
    text-align: center;
    width: 542px;
    height: 96px;
    font-size: 36px;
    line-height: 96px;
    border-radius: 96px;
    font-size: 36px;
    margin: 45px auto 0;
  }
}
</style>

<template>
  <div class="payEnd">
    <div class="payEnd-mask" v-show="payEndOpen"></div>
    <div class="el-payEnd" v-show="payEndOpen">
      <h3 class="vux-1px-b">请确认微信支付是否已完成</h3>
      <p class="vux-1px-b" style="color: #29CCA6;" @click="$emit('listenPayEndOpen', false)">已完成支付</p>
      <p @click="$emit('listenPayEndOpen', false)">支付遇到问题，重新支付</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: [
    'payEndOpen'
  ],
  methods: {
    confirmPay () {
    }
  }
}
</script>
<style lang="less" scoped>
.payEnd{
  .payEnd-mask{
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.7);
    width: 100%;
    height: 100%;
    z-index: 2000;
  }
  .el-payEnd{
    position: fixed;
    left: 50%;
    top: 25%;
    background-color: #fff;
    width: 65%;
    height: 270px;
    text-align: center;
    z-index: 2001;
    transform: translateX(-50%);
    border-radius: 12px;
    h3{
      font-size: 32px;
      height: 100px;
      line-height: 100px;
    }
    p{
      font-size: 26px;
      height: 80px;
      line-height: 80px;
    }
  }
}
</style>

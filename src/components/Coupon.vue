<template>
  <div class="el-coupon-item">
    <img v-if="coupon.status === '1'" src="../../static/img/red_envelope@2x.png" alt="">
    <img v-else src="../../static/img/red_envelope_past@2x.png" alt="">
    <div class="el-coupon-info">
      <p :class="{black:coupon.status === '1'}">购书红包</p>
      <p v-if="coupon.status === '1'">还剩{{getDateDiff(coupon.expireTime)}}天</p>
    </div>
    <div class="el-coupon-amount">
      <p>{{coupon.couponAmount}}</p>
      <p>咿啦币</p>
    </div>
    <div class="el-coupon-status" v-if="coupon.status === '3'">已过期</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: [
    'coupon'
  ],
  methods: {
    getDateDiff (dateTimeStamp) {
      let day = 1000 * 60 * 60 * 24
      let now = new Date().getTime()
      let diffValue = dateTimeStamp - now
      let dayC = diffValue / day
      let result = Math.ceil(dayC)
      return result
    }
  }
}
</script>
<style lang="less" scoped>
.el-coupon-item{
  height:190px;
  background:#fff;
  border-radius:8px;
  border:1px solid rgba(238,238,238,1);
  display: flex;
  align-items: center;
  font-size: 24px;
  margin-bottom: 16px;
  padding: 0 50px;
  position: relative;
  overflow: hidden;
  img{
    display: block;
    height: 110px;
  }
  .el-coupon-info{
    margin-left: 40px;
    .black{
      color: #333;
    }
    p{
      color: #999;
    }
    &>p:last-child{
      font-size: 26px;
    }
    &>p:first-child{
      font-size: 32px;
      margin-bottom: 10px;
    }
  }
  .el-coupon-amount{
    text-align: center;
    margin-left: auto;
    &>p:last-child{
      font-size: 26px;
      color: #999;
    }
    &>p:first-child{
      font-size: 50px;
      color: #FF4A40;
      margin-bottom: 10px;
    }
  }
  .el-coupon-status{
    position: absolute;
    color: #fff;
    font-size: 22px;
    height: 40px;
    width: 200px;
    background-color: #999;
    line-height: 40px;
    text-align: center;
    transform:rotate(45deg);
    right: -65px;
    top: 15px;
  }
}
</style>

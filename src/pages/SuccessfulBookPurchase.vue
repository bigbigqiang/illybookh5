<template>
  <div id="SuccessfulBookPurchase">
    <div class="SuccessfulBookPurchase-content">
      <img src="../../static/Pay_success@2x.png" alt="">
      <p>购买成功</p>
      <a class="el-btn btn-green btn-shadow" href="">前往书房</a>
      <a class="el-btn btn-green-empty" href="">返回</a>
    </div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped>
#SuccessfulBookPurchase{
  background-color: #fff;
  min-height: 100%;
  overflow-x: hidden;
}
.SuccessfulBookPurchase-content{
  padding: 80px 65px 0 65px;
  img{
    display: block;
    height: 284px;
    margin: 0 auto;
  }
  p{
    text-align: center;
    font-size:34px;
    color: #333;
    padding-top: 24px;
  }
}
</style>

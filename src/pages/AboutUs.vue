<template>
  <div id="aboutUs">
    <div class="aboutUs-content">
      <div class="el-aboutUs-top">
        <img src="../../static/img/icon-1024.png" alt="">
        <h2>咿啦看书2.0.0</h2>
      </div>
      <h3>咿啦看书简介：</h3>
      <p>咿啦看书是全球首个交互式动画书阅读平台，为3-8岁儿童提供了包含动画、游戏、配音、交互、亲自等阅读和交互于一身的新一代动画书阅读模式。</p>
      <div class="el-aboutUs-line vux-1px-b"></div>
      <h3>官方微信公众号：</h3>
      <div class="el-weixin">
        <div class="el-weixin-img">
          <img src="../../static/img/weixin.png" alt="">
        </div>
        <div class="el-weixin-dsc">
          <p style="color:#333">咿啦看书公众号（ellabook）</p>
          <p >每天一期听绘本，宝宝睡前故事</p>
          <p >专注儿童正版，用心推荐优质绘本</p>
          <p >不定期会员活动，丰厚的福利奖励</p>
        </div>
      </div>
      <div class="el-aboutUs-line vux-1px-b"></div>
      <h3>官网地址：</h3>
      <p>www.ellabook.cn</p>
      <h3>在线客服：</h3>
      <p>客服电话：400-637-1137</p>
      <p>粉丝官微信：yilakanshu4</p>
      <h3>企业合作：</h3>
      <p>商务合作QQ：120212970</p>
      <p>版权合作QQ：31439942</p>
      <div class="el-aboutUs-line vux-1px-b"></div>
      <a class="el-userAgreement" href="#/userAgreement">用户协议</a>
    </div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped>
#aboutUs{
  background-color: #fff;
  min-height: 100%;
  overflow: hidden;
}
.aboutUs-content{
  padding: 32px;
  h3{
    font-size: 36px;
    color: #333;
    padding: 20px 0;
  }
  p{
    font-size: 26px;
    line-height: 36px;
    padding: 16px 0;
    color: #888;
  }
}
.el-aboutUs-top{
  text-align: center;
  padding: 76px 0 190px 0;
  img{
    height: 160px;
    width: 160px;
    border-radius: 24px;
    box-shadow: 0 8px 10px #ecefef;
  }
  h2{
    font-size: 36px;
    margin-top: 60px;
  }
}
.el-aboutUs-line{
  height: 1px;
  width: 200%;
  margin-top: 60px;
  margin-bottom: 60px;
}
.el-weixin{
  display: flex;
  .el-weixin-img{
    padding: 24px;
    height: 205px;
    border:1px solid #ddd;/* no*/
    border-radius: 24px;
    margin-right: 36px;
    flex: none;
    img{
      display: block;
      width: 205px;
      height: 205px;
    }
  }
  .el-weixin-dsc{
    flex: 1;
    p{
      line-height: 28px;
    }
  }
}
.el-userAgreement{
  font-size: 26px;
  color:#51baa6
}
</style>

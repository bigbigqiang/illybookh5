<template>
<div class="el-book-list el-block-style2" v-if="bookList.length > 0">
    <div class="el-style2-content">
      <a v-for="(item, index) in bookList" :key="index" :href="isLink?('#/details/'+item.bookCode):'javascript:void(0);'" class="el-style2-content-item" @click="toast&&$vux.toast.show({
            text: '请在咿啦看书APP中进行阅读~'
          })">
        <img v-lazy="item.ebBookResource[0].ossUrl" alt="">
        <slot :item="item"></slot>
        <p>{{item.bookName}}</p>
      </a>
    </div>
</div>
</template>

<script>
export default {
  props: [
    'bookList',
    'isLink',
    'toast'
  ]
}
</script>
<style lang="less" scoped>
.el-block-style2{
  .el-style2-content{
    display: flex;
    flex-wrap: wrap;
    padding-top: 24px;
    .el-style2-content-item{
      display: flex;
      flex-direction: column;
      width: 31%;
      margin-bottom: 56px;
      margin-right: 3.5%;
      position: relative;
      border-radius: 8px;
      // overflow: hidden;
      span{
        display: block;
        font-size: 0.32rem;
        color: #fff;
        background-color: #bbb;
        width: 120px;
        height: 40px;
        line-height: 40px;
        border-top-right-radius: 40px;
        border-bottom-right-radius: 40px;
        text-align: center;
        position: absolute;
        top: 28px;
        left: -8px;
        box-shadow: 2px 8px 8px rgba(0,0,0,0.2);
      }
      span::after{
        content: " ";
        border-top:4px solid #828282;
        border-right:4px solid #828282;
        border-left:4px solid transparent;
        border-bottom:4px solid transparent;
        position: absolute;
        bottom: -8px;
        left: 0;
      }
      img{
        width: 216px;
        height: 300px;
        display: block;
        border-radius: 8px;
        margin-bottom: 16px;
        box-shadow: 0px 0px 10px #ddd;
      }
      img.el-expired{
        position: absolute;
        left: 0;
        top: 20%;
      }
      p{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: #434343;
        font-size: 28px;
      }
    }
    &>a:nth-child(3n+0){
      margin-right: 0;
    }
  }
  .el-no-book{
    font-size: 24px;
    text-align: center;
    width: 100%;
    color: #999;
  }
}
</style>

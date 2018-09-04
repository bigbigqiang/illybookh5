<template>
  <div class="el-book-list-column">
    <a class="el-book-list-column-item" v-for="(item, index) in bookList" :key="index" :href="'#/details/'+item.bookCode">
      <img v-lazy="item.ebBookResource[0].ossUrl" alt="">
      <div class="el-book-column-info vux-1px-b">
        <div class="el-book-name">{{item.bookName}}</div>
        <div class="el-book-tags">
          <span v-for="(tag, index) in item.tags.split(',').slice(0, 10)" :key="index">{{tag}}</span>
        </div>
        <p>{{item.bookIntroduction}}</p>
        <div class="el-book-score">{{item.bookScore.toFixed(1)}}分</div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      defaultImg: require('../../static/img/pic_homebanner.png')
    }
  },
  props: [
    'bookList'
  ]
}
</script>

<style lang="less" scoped>
#bookListColumn{
  min-height: 100%;
  background-color: #fff;
}
.el-book-list-column{
  &>a:last-child .el-book-column-info::after{
    content: none;
  }
  .el-book-list-column-item{
    display: flex;
    align-items: center;
    padding-left: 32px;
    img{
      display: block;
      height: 240px;
      width: 174px;
      border-radius:8px;
      margin-right: 48px;
      box-shadow: 0 0 20px #a5a5a7;
      flex: none;
    }
    .el-book-column-info{
      flex: 1;
      padding: 45px 32px 45px 0;
      .el-book-name{
        font-size: 32px;
        color: #333;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .el-book-tags{
        font-size: 20px;
        color: #bbb;
        height: 48px;
        overflow: hidden;
        -webkit-line-clamp: 1;
        margin-top:10px;
        padding-bottom: 10px;
        span{
          display: inline-block;
          padding: 3px 10px;
          border:1px solid #bbb;/* no*/
          border-radius: 6px;
          margin-right: 10px;
          margin-bottom: 200px;
        }
      }
      p{
        font-size: 24px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: #838383;
        margin-bottom: 20px;
      }
      .el-book-score{
        color:#F5A624;
        font-size: 34px;
      }
    }
  }
}
</style>

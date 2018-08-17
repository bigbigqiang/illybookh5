<template>
  <div id="dailyBook">
    <div class="el-book-list">
      <a class="el-book-item" v-for="(item, index) in bookList" :key="index" :href="item.targetPage">
        <p>{{item.effectDate}}</p>
        <div class="el-book-info">
          <!-- <img :src="item.dailyImg" alt=""> -->
          <x-img :default-src="defaultImg" :src="item.dailyImg"></x-img>
          <p>{{item.dailyTitle}}</p>
        </div>
      </a>
    </div>
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
  </div>
</template>

<script>
import LoadMore from '../components/LoadMore'
import { XImg } from 'vux'
export default {
  data () {
    return {
      defaultImg: require('../../static/pic_homebanner.png'),
      pageSize: 10,
      pageIndex: 0,
      isRequest: false,
      bookList: [],
      isEnd: false
    }
  },
  created () {
    // console.log(2)
  },
  activated () {
    this.getBookList()
  },
  beforeRouteLeave (to, from, next) {
    this.resetData()
    window.removeEventListener('scroll', this.getPageData)
    next()
  },
  components: {
    LoadMore,
    XImg
  },
  methods: {
    resetData () {
      this.pageIndex = 0
      this.isRequest = false
      this.bookList = []
      this.isEnd = false
    },
    showLoading () {
      this.pageIndex === 0 ? this.$vux.loading.show() : (this.isRequest = true)
    },
    hideLoading () {
      this.pageIndex === 0 ? this.$vux.loading.hide() : (this.isRequest = false)
    },
    getBookList () {
      this.showLoading()
      setTimeout(() => {
        this.$axios.post('', this.$QS.stringify({
          method: 'ella.book.listDailyBook',
          content: JSON.stringify({
            listType: 'LIST',
            pageSize: this.pageSize,
            pageIndex: this.pageIndex
          })
        })).then((response) => {
          this.hideLoading()
          if (response.data.status === '1') {
            this.pageIndex === 0 && this.addScrollEvent()
            this.bookList = this.bookList.concat(response.data.data)
            this.isRequest = false
            if (response.data.data.length < this.pageSize) {
              this.isEnd = true
            } else {
              this.pageIndex++
            }
          } else {
            this.$vux.toast.show({
              text: response.data.message
            })
          }
        }).catch(function (error) {
          this.hideLoading()
          console.log(error)
        })
      }, 1000)
    },
    getScrollTop () {
      let scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    getClientHeight () {
      let clientHeight = 0
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
      } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
      }
      return clientHeight
    },
    getScrollHeight () {
      let scrollHeight = 0
      let bodyScrollHeight = 0
      let documentScrollHeight = 0
      if (document.body) {
        bodyScrollHeight = document.body.scrollHeight
      }
      if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight
      }
      scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight
      return scrollHeight
    },
    getPageData () {
      if (!this.isEnd && !this.isRequest) {
        if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight()) {
          this.getBookList()
        }
      }
    },
    addScrollEvent () {
      window.removeEventListener('scroll', this.getPageData)
      window.addEventListener('scroll', this.getPageData)
    }
  }
}
</script>

<style lang="less" scoped>
#dailyBook{
  min-height: 100%;
}
.el-book-list{
  padding: 32px;
  .el-book-item{
    display: block;
    margin-bottom: 32px;
    &>p{
      text-align: center;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .el-book-info{
      border-radius: 6px;
      overflow: hidden;
      background-color: #fff;
      img{
        display: block;
        width: 100%;
        margin-bottom: 16px;
      }
      p{
        font-size: 28px;
        color: #444;
        font-weight: bold;
        padding: 0 32px 16px;
        line-height: 48px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
}
</style>

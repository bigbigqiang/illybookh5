<template>
  <div id="PackageBook">
    <book-list-column :bookList="bookList"></book-list-column>
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
    <div class="el-btn-group">
      <div class="el-white-btn"><span class="goodsPrice"> {{bookPackageInfo.goodsPrice}} </span> 咿啦币 <span class="goodsSrcPrice"> 原价{{bookPackageInfo.goodsSrcPrice}} </span></div>
      <div class="el-green-btn" @click="payNow">立即购买</div>
    </div>
  </div>
</template>

<script>
import BookListColumn from '../components/BookListColumn'
import LoadMore from '../components/LoadMore'
export default {
  data () {
    return {
      pageSize: 10,
      pageIndex: 0,
      isRequest: false,
      bookList: [],
      bookPackageInfo: {},
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
    BookListColumn
  },
  methods: {
    resetData () {
      this.pageIndex = 0
      this.isRequest = false
      this.bookList = []
      this.bookPackageInfo = {}
      this.isEnd = false
    },
    showLoading () {
      this.pageIndex === 0 ? this.$vux.loading.show() : (this.isRequest = true)
    },
    hideLoading () {
      this.pageIndex === 0 ? this.$vux.loading.hide() : (this.isRequest = false)
    },
    payNow () {
    },
    getBookList () {
      this.showLoading()
      this.$axios.post('', this.$QS.stringify({
        method: 'ella.book.getBookPackageBookListInfo',
        content: JSON.stringify({
          packageCode: this.$route.params.packageCode,
          uid: '',
          pageVo: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        })
      })).then((response) => {
        setTimeout(() => {
          this.hideLoading()
          if (this.$route.params.packageCode) {
            if (response.data.status === '1') {
              this.pageIndex === 0 && this.addScrollEvent()
              this.bookList = this.bookList.concat(response.data.data.bookList)
              this.bookPackageInfo = response.data.data.bookPackageInfo
              this.isRequest = false
              if (response.data.data.bookList.length < this.pageSize) {
                this.isEnd = true
              } else {
                this.pageIndex++
              }
              this.setTitle()
            } else {
              this.$vux.toast.show({
                text: response.data.message
              })
            }
          }
        }, 1000)
      }).catch(function (error) {
        this.hideLoading()
        console.log(error)
      })
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
        if (this.getScrollTop() + this.getClientHeight() + 1 > this.getScrollHeight()) {
          this.getBookList()
        }
      }
    },
    addScrollEvent () {
      window.removeEventListener('scroll', this.getPageData)
      window.addEventListener('scroll', this.getPageData)
    },
    setTitle () {
      if (this.bookPackageInfo) {
        document.title = this.bookPackageInfo.packageName
      }
    }
  }
}
</script>

<style lang="less" scoped>
#PackageBook{
  min-height: 100%;
  background-color: #fff;
  padding-bottom: 96px;
}
.el-btn-group{
  height: 96px;
  width: 100%;
  font-size: 36px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  line-height: 96px;
  display: flex;
  box-shadow: 0 -3px 19px rgba(0,0,0,0.06);
  .el-green-btn{
    flex: 1;
    display: block;
    background-color: #40d8b0;
    color: #fff;
  }
  .el-white-btn{
    flex: 1;
    display: block;
    background-color: #fff;
    font-size: 24px;
    color: #E52138;
    .goodsPrice{
      color: #E52138;
      font-size: 36px;
    }
    .goodsSrcPrice{
      color: #aaa;
      text-decoration: line-through;
    }
  }
}
</style>

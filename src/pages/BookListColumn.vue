<template>
  <div id="bookListColumn">
    <book-list-column :bookList="bookList"></book-list-column>
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
  </div>
</template>

<script>
import BookListColumn from '../components/BookListColumn'
import LoadMore from '../components/LoadMore'
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
    this.resetData()
    this.getBookList()
  },
  beforeRouteLeave (to, from, next) {
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
      this.$axios.post('', this.$QS.stringify({
        method: 'ella.book.listBookCommons',
        content: JSON.stringify({
          sourceCode: this.$route.params.sourceCode,
          resource: 'normal',
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        })
      })).then((response) => {
        setTimeout(() => {
          this.hideLoading()
          if (this.$route.params.sourceCode) {
            if (response.data.status === '1') {
              this.pageIndex === 0 && this.addScrollEvent()
              this.bookList = this.bookList.concat(response.data.data)
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
#bookListColumn{
  min-height: 100%;
  background-color: #fff;
}
</style>

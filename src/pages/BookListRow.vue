<template>
  <div id="bookListRow" @scroll="handleScroll">
    <div class="el-book-content">
      <book-list :bookList="bookList" :isLink="true"></book-list>
    </div>
    <no-record :prompt="'没有找到任何内容'" v-if="(!bookList.length && isEnd) || error"></no-record>
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
  </div>
</template>

<script>
import LoadMore from '../components/LoadMore'
import BookList from '../components/BookList'
import NoRecord from '../components/NoRecord'
export default {
  data () {
    return {
      error: false,
      pageSize: 15,
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
    next()
  },
  components: {
    LoadMore,
    BookList,
    NoRecord
  },
  methods: {
    resetData () {
      this.pageIndex = 0
      this.bookList = []
      this.isRequest = false
      this.isEnd = false
    },
    showLoading () {
      this.pageIndex === 0 ? this.$vux.loading.show() : (this.isRequest = true)
    },
    hideLoading () {
      this.pageIndex === 0 ? this.$vux.loading.hide() : (this.isRequest = false)
    },
    handleScroll (e) {
      if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
        if (!this.isEnd && !this.isRequest) {
          this.getBookList()
        }
      }
    },
    getBookList () {
      this.showLoading()
      this.$axios.post('', this.$QS.SF({
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
        this.error = true
        this.hideLoading()
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
#bookListRow{
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
}
.el-book-content{
  padding: 0 24px;
}
</style>

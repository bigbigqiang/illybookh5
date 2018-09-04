<template>
  <div id="bookListColumn" @scroll="handleScroll">
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
        this.hideLoading()
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
#bookListColumn{
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
}
</style>

<template>
  <div id="search" @scroll="handleScroll">
    <search  @on-submit="onSubmit" @on-focus="onFocus" @on-cancel="onCancel" v-model="searchValue" placeholder="搜索绘本" ref="search" style="position:fixed;top:0;left:0;z-index:500;"></search>
    <a class="el-sort-search vux-1px-b" href="#/bookSort" v-show="!searched">
      <img src="../../static/img/search_icon_books@2x.png" alt=""> 分类索引<i class="icon iconfont icon-small-arrow-right"></i>
    </a>
    <div class="el-history-search" v-show="!searched && history.length>0">
      <div class="el-history-search-content">
        <div class="el-history-header">
          <p>历史搜索</p>
          <span @click="clearHistory"><i class="icon iconfont icon-close"></i></span>
        </div>
        <div class="el-history-item">
          <span v-for="(item, index) in history" :key="index" @click="searchHistory(item)">{{item}}</span>
        </div>
      </div>
    </div>
    <div class="el-book-content">
      <book-list :bookList="bookList" :isLink="true"></book-list>
    </div>
    <no-record :prompt="'没有找到任何内容'" v-if="!bookList.length && searched"></no-record>
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
  </div>
</template>

<script>
import { Search } from 'vux'
import LoadMore from '../components/LoadMore'
import BookList from '../components/BookList'
import NoRecord from '../components/NoRecord'
export default {
  data () {
    return {
      searchValue: '',
      keyword: '',
      bookList: [],
      history: [],
      isRequest: false,
      pageSize: 30,
      pageIndex: 0,
      searched: false,
      isEnd: false
    }
  },
  computed: {
  },
  created () {
    // console.log(2)
  },
  activated () {
    let history = window.localStorage.getItem('search')
    if (history) {
      this.history = JSON.parse(history)
    }
    this.$refs.search.setFocus()
    this.pageIndex !== 0 && this.addScrollEvent()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'Home') {
      this.resetData()
    }
    window.removeEventListener('scroll', this.getPageData)
    next()
  },
  components: {
    Search,
    LoadMore,
    BookList,
    NoRecord
  },
  methods: {
    resetData () {
      this.searchValue = ''
      this.keyword = ''
      this.bookList = []
      this.history = []
      this.isRequest = false
      this.pageIndex = 0
      this.searched = false
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
    searchAgain () {
      this.keyword = this.searchValue
      this.bookList = []
      this.isRequest = false
      this.pageIndex = 0
      this.isEnd = false
      this.getBookList()
    },
    getBookList () {
      this.showLoading()
      setTimeout(() => {
        this.$axios.post('', this.$QS.SF({
          method: 'ella.book.search',
          content: JSON.stringify({
            keyword: this.keyword,
            size: this.pageSize,
            from: this.pageIndex
          })
        })).then((response) => {
          this.hideLoading()
          if (response.data.status === '1') {
            this.bookList = this.bookList.concat(response.data.data)
            this.isRequest = false
            this.searched = true
            this.updataHistory()
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
    searchHistory (item) {
      this.searchValue = item
      this.searchAgain()
    },
    clearHistory () {
      let _this = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确定清空所有搜索记录？',
        onCancel () {
          console.log('plugin cancel')
        },
        onConfirm () {
          window.localStorage.removeItem('search')
          _this.history = []
        }
      })
    },
    updataHistory () {
      let isInHistory = false
      for (let i = 0; i < this.history.length; i++) {
        if (this.history[i] === this.keyword) {
          isInHistory = true
          break
        }
      }
      if (!isInHistory) {
        this.history.push(this.keyword)
        window.localStorage.setItem('search', JSON.stringify(this.history))
      }
    },
    onSubmit (val) {
      if (this.searchValue !== '' && this.keyword !== val) {
        this.searchAgain()
      }
    },
    onCancel () {
      this.resetData()
      this.$router.push('/index/home')
    },
    onFocus () {
      console.log('on focus')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/bookList.less');
#search{
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
}
.el-book-content{
  padding: 92px 24px 0;
}
.el-sort-search{
  display: block;
  height: 72px;
  text-align: center;
  font-size: 24px;
  color: #999;
  line-height: 72px;
  background-color: #fbfbfb;
  position: fixed;
  width: 100%;
  top: 92px;
  left: 0;
  img{
    height: 48px;
    vertical-align: middle;
  }
  i{
    font-size: 24px;
  }
}
.el-history-search{
  position: fixed;
  top: 164px;
  left: 0;
  width: 100%;
  .el-history-search-content{
    padding: 60px 32px 0 32px;
    .el-history-header{
      display: flex;
      font-size: 28px;
      line-height: 40px;
      height: 40px;
      margin-bottom: 40px;
      p{
        flex: 1;
        color: #aaa;
        font-weight: 100;
      }
      span{
        flex: none;
        display: block;
        width: 40px;
        height: 40px;
        background-color: rgba(0,0,0,0.3);
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        font-size: 24px;
        i{
          font-size: 24px;
          color: #fff;
        }
      }
    }
    .el-history-item{
      font-size: 28px;
      color: #333;
      span{
        display: inline-block;
        margin-right: 30px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>

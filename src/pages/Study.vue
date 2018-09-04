<template>
  <div id="study" @scroll="handleScroll">
    <search  @on-submit="onSubmit" @on-focus="onFocus" @on-cancel="onCancel" v-model="searchValue" placeholder="书房内搜索" style="position:fixed;top:0;left:0;z-index:500;"></search>
    <div class="el-book-sort" @click="sort" v-if="studyBook.length>0">
      {{sortMenu[selected]}}
      <i class="icon iconfont" :class="[isSelect?'icon-arrow-up':'icon-arrow-right']"></i>
      <ul v-show="isSelect">
        <li v-for="(value, key, index) in sortMenu" :key="index" @click="select(key)">{{value}}</li>
      </ul>
    </div>
    <div class="el-book-content">
      <book-list :bookList="bookList" :isLink="false" :toast="true">
        <template slot-scope="{ item }">
          <span v-if="item.ebBookStudy.useState === 'READ_NO'">已过期</span>
        </template>
      </book-list>
      <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
      <div class="el-study-empty" v-if="bookList.length===0 && studyBook.length>0">没有找到任何内容</div>
    </div>
    <no-record :icon="icon" :prompt="'啊哦~这里什么都没有...'" v-if="(!studyBook.length && isEnd) || error || !uid"></no-record>
  </div>
</template>

<script>
import { Search, Spinner } from 'vux'
import LoadMore from '../components/LoadMore'
import { mapState } from 'vuex'
import BookList from '../components/BookList'
import NoRecord from '../components/NoRecord'
export default {
  data () {
    return {
      error: false,
      searchValue: '',
      studyBook: [],
      bookList: [],
      isRequest: false,
      isSelect: false,
      testIndex: 2,
      sortMenu: {
        ALL: '全部绘本',
        HAS_READ: '已读',
        IN_READ: '阅读中',
        NOT_READ: '未读'
      },
      selected: 'ALL',
      pageSize: 30,
      pageIndex: 0,
      isEnd: false,
      icon: require('../../static/img/pic_empty@2x.png')
    }
  },
  watch: {
    selected: function (val, oldVal) {
      if (val === 'ALL') {
        this.bookList = this.studyBook
        this.addScrollEvent()
      } else {
        window.removeEventListener('scroll', this.getPageData)
        this.bookList = this.studyBook.filter((book) => {
          return book.ebBookStudy.readStatus === val
        })
      }
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  created () {
    // console.log(2)
  },
  activated () {
    if (this.uid) {
      this.getBookList()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.resetData()
    next()
  },
  components: {
    Search,
    LoadMore,
    Spinner,
    BookList,
    NoRecord
  },
  methods: {
    resetData () {
      this.studyBook = []
      this.bookList = []
      this.isRequest = false
      this.isSelect = false
      this.selected = 'ALL'
      this.pageIndex = 0
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
        if (!this.isEnd && this.uid && !this.isRequest) {
          this.getBookList()
        }
      }
    },
    getBookList () {
      this.showLoading()
      setTimeout(() => {
        this.$axios.post('', this.$QS.SF({
          method: 'ella.book.listBookStudy',
          content: JSON.stringify({
            uid: this.uid,
            resource: 'normal',
            pageSize: this.pageSize,
            pageIndex: this.pageIndex
          })
        })).then((response) => {
          this.hideLoading()
          if (response.data.status === '1') {
            this.studyBook = this.studyBook.concat(response.data.data)
            this.bookList = this.studyBook
            this.isRequest = false
            if (response.data.data.length < this.pageSize) {
              this.isEnd = true
            } else {
              this.pageIndex++
            }
          } else {
            this.$vux.toast.show({
              text: '登录失效，请重新登录~'
            })
            console.log(response.data)
          }
        }).catch((error) => {
          this.hideLoading()
          this.error = true
          console.log(error)
        })
      }, 1000)
    },
    sort () {
      this.isSelect = !this.isSelect
    },
    select (key) {
      this.selected = key
    },
    onSubmit (val) {
      console.log('on submit')
      window.removeEventListener('scroll', this.getPageData)
      this.bookList = this.studyBook.filter((book) => {
        return book.bookName.search(val) !== -1
      })
    },
    onCancel () {
      console.log('on cancel')
      this.bookList = this.studyBook
    },
    onFocus () {
      console.log('on focus')
      this.selected = 'ALL'
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/bookList.less');
#study{
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
}
.el-book-sort{
  height: 72px;
  padding: 0 32px;
  line-height: 72px;
  font-size: 32px;
  color: #333;
  position: fixed;
  top: 91px;
  left: 0;
  width: 100%;
  background-color: #f6f8fa;
  z-index: 500;
  i{
    font-size: 32px;
  }
  ul{
    position: absolute;
    left: 0;
    top: 72px;
    list-style: none;
    width: 100%;
    background: #f6f8fa;
    transition: all .3s ease;
    li{
      padding: 12px;
      padding-left: 32px;
      color: #999;
    }
  }
}
.el-book-content{
  padding: 160px 24px 90px;
  .el-study-empty{
    font-size: 32px;
    color: #999;
    text-align: center;
    margin-top: 48px;
  }
}
.test-ui{
  width: 80%;
  margin: 0 auto;
}
</style>

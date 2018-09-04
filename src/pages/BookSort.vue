<template>
  <div id="bookSort" @scroll="handleScroll">
    <div class="el-book-wiki el-tab-swiper" v-if="bookWikiAll.length>0">
      <div class="el-tab-content">
        <tabs v-model="index" @click="onTabClick">
          <tab v-for="(item, index) in bookWikiAll" :key="index" :title="item.wikiName"></tab>
        </tabs>
      </div>
      <div class="el-tab-drop">
        <i class="icon iconfont icon-arrow-right" @click="isShowTab=false"></i>
      </div>
    </div>
    <transition name="custom-classes-transition"
    enter-active-class="animated slideInDown"
    leave-active-class="animated slideOutUp">
      <div class="el-book-wiki" v-show="!isShowTab">
        <div class="el-sort-text">全部分类</div>
        <div class="el-sort-drop">
          <i class="icon iconfont icon-arrow-up" @click="isShowTab=true"></i>
        </div>
        <div class="el-sort-content">
          <span v-for="(item, idx) in bookWikiAll" :key="idx" @click.stop="wikiSelect(idx)" :class="{'sort-active':idx===index}">{{item.wikiName}}</span>
        </div>
      </div>
    </transition>
    <div class="el-book-content">
      <book-list :bookList="bookList" :isLink="true"></book-list>
    </div>
    <no-record :prompt="'没有找到任何内容'" v-if="!bookList.length && isEnd"></no-record>
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
  </div>
</template>

<script>
import LoadMore from '../components/LoadMore'
import BookList from '../components/BookList'
import NoRecord from '../components/NoRecord'
import Tab from '../components/vant-tab/tab'
import Tabs from '../components/vant-tab/tabs'
export default {
  data () {
    return {
      bookWikiAll: [],
      isShowTab: true,
      isRequest: false,
      index: 0,
      pageSize: 15,
      pageIndex: 0,
      bookList: [],
      wikiCode: '',
      isEnd: false
    }
  },
  created () {
    // console.log(2)
  },
  activated () {
    this.getListBookWikiAll()
  },
  beforeRouteLeave (to, from, next) {
    this.resetData()
    next()
  },
  components: {
    LoadMore,
    BookList,
    // Tab,
    // TabItem,
    NoRecord,
    Tab,
    Tabs
  },
  methods: {
    resetData () {
      this.pageIndex = 0
      this.bookList = []
      this.isRequest = false
      this.isEnd = false
    },
    wikiSelect (index) {
      this.isShowTab = true
      this.updataBookList(index)
    },
    onTabClick (index, item) {
      this.updataBookList(index)
    },
    updataBookList (index) {
      if (this.wikiCode !== this.bookWikiAll[index].wikiCode) {
        this.index = index
        this.resetData()
        this.wikiCode = this.bookWikiAll[this.index].wikiCode
        this.getBookList()
      }
    },
    getListBookWikiAll () {
      this.$vux.loading.show()
      this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listBookWikiAll'
      })).then((response) => {
        this.$vux.loading.hide()
        if (response.data.status === '1') {
          console.log(response.data)
          this.bookWikiAll = response.data.data
          this.wikiCode = response.data.data[0].wikiCode
          this.getBookList()
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
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
      setTimeout(() => {
        this.$axios.post('', this.$QS.SF({
          method: 'ella.book.listBookByWiki',
          content: JSON.stringify({
            wikiCode: this.wikiCode,
            resource: 'normal',
            pageSize: this.pageSize,
            pageIndex: this.pageIndex
          })
        })).then((response) => {
          this.hideLoading()
          if (response.data.status === '1') {
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
    }
  }
}
</script>

<style lang="less" scoped>
#bookSort{
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
}
.el-book-content{
  padding: 80px 24px 0;
}
.el-tab-swiper{
  display: flex;
  .el-tab-content{
    font-size: 28px;
    flex: 1;
  }
  .el-tab-drop{
    width: 50px;
    height: 75px;
    line-height: 75px;
    background-color: #fff;
    font-size: 42px;
    text-align: center;
    position: relative;
    z-index: 100;
    i{
      font-size: 42px;
      color: #999;
    }
  }
  .el-tab-drop::after{
    content: " ";
    height: 100%;
    width: 25px;
    position: absolute;
    left: -25px;
    top: 0;
    background: -webkit-gradient(linear, left, right, color-stop(0%,rgba(255, 255, 255, 0.0)), color-stop(100%,#fff));
    background: -webkit-linear-gradient(to right,   rgba(255, 255, 255, 0.3) 0%,#fff  100%);
    background: linear-gradient(to right,  rgba(255, 255, 255, 0.3) 0%,#fff 100%);
  }
}
.el-book-wiki{
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 500;
  box-shadow: 0 2px 10px #dad8d8;
  .el-sort-text{
    padding: 16px 32px;
    font-size: 28px;
    color: #444;
    background-color: #fff;
  }
  .el-sort-content{
    padding: 16px 32px;
    background-color: #f6f6f6;
    line-height: 48px;
    span{
      color: #444;
      font-size: 28px;
      width: 160px;
      height: 56px;
      border-radius: 56px;
      border:1px solid #444;/* no*/
      display: inline-block;
      text-align: center;
      line-height: 56px;
      margin-right: 6px;
      z-index: 100;
    }
    .sort-active{
      color: #40d8b0;
      border: 1px solid #40d8b0;/* no*/
    }
  }
  .el-sort-drop{
    width: 50px;
    height: 75px;
    position: absolute;
    right: 0;
    top: 0;
    line-height: 75px;
    background-color: #fff;
    font-size: 42px;
    box-shadow: -10px 0 20px #fff;
    i{
      font-size: 42px;
      color: #999;
    }
  }
}
</style>

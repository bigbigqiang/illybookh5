<template>
  <div id="PackageBook" @scroll="handleScroll">
    <div class="el-book-content">
      <book-list-column :bookList="bookList"></book-list-column>
      <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
    </div>
    <div class="el-btn-group" v-if="bookPackageInfo.isBuy==='NO'&& (bookPackageInfo.isAllBuy==='NO' || !bookPackageInfo.isAllBuy)">
      <div class="el-white-btn"><span class="goodsPrice"> {{bookPackageInfo.goodsPrice}} </span> 咿啦币 <span class="goodsSrcPrice"> 原价{{bookPackageInfo.goodsSrcPrice}} </span></div>
      <div class="el-green-btn" @click="payNow">立即购买</div>
    </div>
    <div class="el-btn-group" v-else-if="bookPackageInfo.isBuy==='YES'||bookPackageInfo.isAllBuy==='YES'">
      <a class="el-green-btn" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ellabook">前往app阅读</a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      this.bookPackageInfo = {}
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
    payNow () {
      let _this = this
      if (this.uid) {
        if (this.bookPackageInfo.hasBuyNum !== '0') {
          this.$vux.confirm.show({
            title: '提示',
            content: '您已经购买其中' + this.bookPackageInfo.hasBuyNum + '本书，是否继续购买？',
            confirmText: '购买',
            onCancel () {
              console.log('plugin cancel')
            },
            onConfirm () {
              _this.$router.push('../packageBookOrder?packageCode=' + _this.$route.params.packageCode)
            }
          })
        } else {
          this.$router.push('../packageBookOrder?packageCode=' + this.$route.params.packageCode)
        }
      } else {
        this.$vux.confirm.show({
          title: '提示',
          content: '请先登录哦~',
          confirmText: '去登陆',
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            _this.$router.push('../login?from=' + '../packageBook/' + _this.$route.params.packageCode)
          }
        })
      }
    },
    getBookList () {
      this.showLoading()
      this.$axios.post('', this.$QS.SF({
        method: 'ella.book.getBookPackageBookListInfo',
        content: JSON.stringify({
          packageCode: this.$route.params.packageCode,
          uid: this.uid || '',
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
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
}
.el-book-content{
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

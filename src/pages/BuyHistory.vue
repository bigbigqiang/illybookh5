<template>
  <div id="buyHistory" @scroll="handleScroll">
    <div class="buyHistory-content">
      <div class="el-buyHistory-item vux-1px-b" v-for="(item, index) in buyHistory" :key="index">
        <div class="el-buy-time">
          <p>{{dateFormat(item.createTime).split(' ')[0]}}</p>
          <p style="color:#aaa">{{dateFormat(item.createTime).split(' ')[1]}}</p>
        </div>
        <div class="el-cost" :class="{active: item.orderType === 'ELLA_COIN_BUY'}">{{(item.orderType === 'ELLA_COIN_BUY'?'+':'-') + item.orderAmount}}</div>
        <div class="el-type">{{renderText(item.orderType)}}</div>
      </div>
    </div>
    <no-record :prompt="'没有找到任何内容'" v-if="(!buyHistory.length && isEnd) || error"></no-record>
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dateFormat } from 'vux'
import LoadMore from '../components/LoadMore'
import NoRecord from '../components/NoRecord'
export default {
  data () {
    return {
      error: false,
      buyHistory: [],
      pageSize: 15,
      pageIndex: 0,
      isRequest: false,
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
    this.getBuyHistory()
  },
  activated () {
  },
  beforeRouteLeave (to, from, next) {
    this.resetData()
    next()
  },
  components: {
    LoadMore,
    NoRecord
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
          this.getBuyHistory()
        }
      }
    },
    getBuyHistory () {
      this.showLoading()
      setTimeout(() => {
        this.$axios.post('', this.$QS.SF({
          method: 'ella.user.buyHistory',
          content: JSON.stringify({
            uid: this.uid,
            appModel: 'ANDROID',
            page: this.pageIndex,
            pageSize: this.pageSize
          })
        })).then((response) => {
          this.hideLoading()
          if (response.data.status === '1') {
            this.buyHistory = this.buyHistory.concat(response.data.data)
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
          this.error = true
          console.log(error)
        })
      }, 1000)
    },
    renderText (type) {
      switch (type) {
        case 'BOOK_BUY' :
          return '购书'
        case 'BALANCE_MEMBER_BUY' :
          return '余额购买会员'
        case 'ELLA_COIN_BUY' :
          return '充值'
        case 'COURSE_BUY' :
          return '购买课程'
        default:
          return ''
      }
    },
    dateFormat (date) {
      return dateFormat(date, 'YYYY.MM.DD HH:mm')
    }
  }
}
</script>

<style lang="less" scoped>
#buyHistory{
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
}
.buyHistory-content{
  padding-left: 32px;
  .el-buyHistory-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 120px;
    font-size: 28px;
    color: #666;
    .el-cost{
      color: #ff3e5e;
      font-size: 36px;
    }
    .active{
      color: #40d8b1;
    }
    .el-type{
      text-align: right;
      padding-right: 32px;
    }
  }
}
</style>

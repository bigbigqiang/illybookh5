<template>
  <div id="coupon">
    <div class="el-coupon-content" v-if="coupon.length>0">
      <coupon v-for="(item, index) in coupon" :key="index" :coupon="item"></coupon>
    </div>
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
    <no-record :icon="icon" :prompt="'一个红包都没有'" v-if="(coupon.length === 0 && isEnd) || !uid"></no-record>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoadMore from '../components/LoadMore'
import NoRecord from '../components/NoRecord'
import Coupon from '../components/Coupon'
export default {
  data () {
    return {
      coupon: [],
      pageSize: 20,
      pageIndex: 0,
      isRequest: false,
      isEnd: false,
      icon: require('../../static/un_red_envelope@2x.png')
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  created () {
    if (this.uid) {
      this.getCouponList()
    }
  },
  activated () {
  },
  beforeRouteLeave (to, from, next) {
    this.resetData()
    window.removeEventListener('scroll', this.getPageData)
    next()
  },
  components: {
    LoadMore,
    NoRecord,
    Coupon
  },
  methods: {
    resetData () {
      this.pageIndex = 0
      this.isRequest = false
      this.coupon = []
      this.isEnd = false
    },
    showLoading () {
      this.pageIndex === 0 ? this.$vux.loading.show() : (this.isRequest = true)
    },
    hideLoading () {
      this.pageIndex === 0 ? this.$vux.loading.hide() : (this.isRequest = false)
    },
    getCouponList () {
      this.showLoading()
      setTimeout(() => {
        this.$axios.post('', this.$QS.stringify({
          method: 'ella.user.getCouponList',
          content: JSON.stringify({
            uid: this.uid,
            coupon_type: '01',
            page: this.pageIndex,
            pageSize: this.pageSize
          })
        })).then((response) => {
          this.hideLoading()
          if (response.data.status === '1') {
            this.pageIndex === 0 && this.addScrollEvent()
            this.coupon = this.coupon.concat(response.data.data.filter((item) => {
              return item.status !== '2'
            }))
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
        }).catch((error) => {
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
          this.getCouponList()
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
#coupon{
  min-height: 100%;
}
.el-coupon-content{
  padding: 32px;
}
</style>

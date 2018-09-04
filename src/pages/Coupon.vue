<template>
  <div id="coupon" @scroll="handleScroll">
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
      icon: require('../../static/img/un_red_envelope@2x.png')
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  created () {
  },
  activated () {
    this.getCouponList()
  },
  beforeRouteLeave (to, from, next) {
    this.resetData()
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
    handleScroll (e) {
      if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
        if (!this.isEnd && !this.isRequest) {
          this.getCouponList()
        }
      }
    },
    getCouponList () {
      this.showLoading()
      setTimeout(() => {
        this.$axios.post('', this.$QS.SF({
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
    }
  }
}
</script>

<style lang="less" scoped>
#coupon{
  height: 100%;
  overflow-y: auto;
}
.el-coupon-content{
  padding: 32px;
}
</style>

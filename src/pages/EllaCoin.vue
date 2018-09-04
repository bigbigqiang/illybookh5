<template>
  <div id="ellaCion">
    <div class="el-balance">
      <p>咿啦币余额</p>
      <div class="el-el-balance">{{userInfo.balance}}</div>
      <a href="#/buyHistory">查看消费记录</a>
    </div>
    <div class="ellaCion-content">
      <div class="el-recharge" v-if="coinList.length>0">
        <div class="el-recharge-item vux-1px-b" v-for="(item, index) in coinList" :key="index" @click="checkFirst(index)">
          <img src="../../static/img/pay_ella@2x.png" alt="">
          <div>
            <div class="el-ellaCoin">{{item.coin}} <span v-if="index === 1 || index === 2">推荐</span> </div>
            <span class="el-gift" v-if="item.giftCoin">{{item.giftCoin}}</span>
          </div>
          <div class="el-cost">￥{{item.price}}</div>
        </div>
      </div>
      <div class="el-pay-prompt">温馨提示</div>
      <ul>
        <li>充值比例：1元=1咿啦币，咿啦币不能退还、不予返现；</li>
        <li>网页端的账号充值及余额和安卓端通用，不与苹果账户通用；</li>
        <li>使用咿啦币购买的所有内容产品可在咿啦看书所有平台同步使用；</li>
        <li>使用咿啦币购买内容产品时，有限扣除赠送购书红包；</li>
        <li>充值到账可能有时间延时，如遇充值问题，请致电客服：400-637-1137 或添加客服微信：yilakanshu4</li>
      </ul>
    </div>
    <parents-confirm :checkOpen="checkOpen" @listenCheckOpen="listenCheckOpen" @listenParentChecked="listenParentChecked"></parents-confirm>
    <payment :paymentOpen="paymentOpen" :goodsType="'咿啦币充值'" :payCoinType="coinList.length>0?coinList[selectIndex]:{price:6}" @listenPaymentOpen="listenPaymentOpen"></payment>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Divider } from 'vux'
import ParentsConfirm from '../components/ParentsConfirm'
import Payment from '../components/Payment'
export default {
  data () {
    return {
      coinList: [],
      selectIndex: 0,
      userInfo: {},
      parentChecked: false,
      checkOpen: false,
      paymentOpen: false
    }
  },
  watch: {
    parentChecked (newValue, oldValue) {
      if (newValue === true) {
        this.paymentOpen = true
      } else {
        this.parentChecked = false
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
  },
  activated () {
    this.cardList()
    if (this.uid) {
      this.getUserInfo()
    } else {
      this.userInfo = {}
      this.userInfo.balance = '0.00'
    }
  },
  components: {
    Divider,
    ParentsConfirm,
    Payment
  },
  methods: {
    listenCheckOpen (value) {
      this.checkOpen = value
    },
    listenParentChecked (value) {
      this.parentChecked = value
    },
    listenPaymentOpen (value) {
      this.paymentOpen = value
    },
    listenPayEndOpen (value) {
      this.payEndOpen = value
    },
    check (index) {
      if (this.num[index] === this.chineseNums[this.checkIndex]) {
        this.checkIndex++
        if (this.checkIndex === 3) {
          this.checked = true
          this.checkOpen = false
        }
      } else {
        this.renderChineseNum()
      }
    },
    checkFirst (index) {
      let _this = this
      if (this.uid) {
        this.parentChecked = false
        this.checkOpen = true
        this.selectIndex = index
      } else {
        this.$vux.confirm.show({
          title: '提示',
          content: '请先登录哦~',
          confirmText: '去登陆',
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            _this.$router.push('../login?from=' + '../ellaCoin')
          }
        })
      }
    },
    renderChineseNum () {
      this.checkIndex = 0
      this.checked = false
      let chineseNums = []
      for (let i = 0; i < 3; i++) {
        chineseNums.push(this.num[Math.round(Math.random() * 8)])
      }
      this.chineseNums = chineseNums
    },
    // 获取用户信息
    getUserInfo () {
      this.$axios.post('', this.$QS.SF({
        method: 'ella.user.getInfo',
        uid: this.uid,
        token: this.token,
        content: JSON.stringify({
          uid: this.uid,
          clientType: 'h5'
        })
      })).then((response) => {
        if (response.data.status === '1') {
          this.userInfo = response.data.data.userInfo
        } else {
          window.localStorage.removeItem('uid')
          window.localStorage.removeItem('token')
          this.$store.commit('updateUid', {uid: null})
          this.$store.commit('updateToken', {token: null})
          this.$vux.toast.show({
            text: '登录失效，请重新登录~'
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 获取咿啦币充值类型配置信息
    cardList () {
      this.$vux.loading.show()
      this.$axios.post('', this.$QS.SF({
        method: 'ella.user.coinList',
        content: JSON.stringify({
          appModel: 'ANDROID'
        })
      })).then((response) => {
        if (response.data.status === '1') {
          this.coinList = response.data.data
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
        this.$vux.loading.hide()
      }).catch(function (error) {
        this.$vux.loading.hide()
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
#ellaCion{
  min-height: 100%;
}
.el-balance{
  background-color: #fff;
  text-align: center;
  padding: 55px 0;
  background-image: url('../../static/img/ellaB_bj@2x.png');
  background-repeat: no-repeat;
  background-size: 255px 186px;
  background-position: bottom right;
  margin-bottom: 20px;
  p{
    font-size: 28px;
    color: #666;
  }
  .el-el-balance{
    font-size: 56px;
    font-weight: bold;
    margin: 16px 0;
  }
  a{
    font-size: 24px;
    color: #40d8b1;
    display: block;
  }
}
.ellaCion-content{
  padding: 32px;
  background-color: #fff;
  .el-recharge{
    .el-recharge-item{
      height: 130px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      font-size: 28px;
      &>img{
        display: block;
        height: 76px;
        margin-right: 11px;
      }
      .el-cost{
        margin-left: auto;
        width: 130px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 50px;
        background: #29CCA6; /* For browsers that do not support gradients */
        background: -webkit-linear-gradient(left, #29CCA6 , #85f9bf); /* For Safari 5.1 to 6.0 */
        background: -o-linear-gradient(right, #29CCA6, #85f9bf); /* For Opera 11.1 to 12.0 */
        background: -moz-linear-gradient(right, #29CCA6, #85f9bf); /* For Firefox 3.6 to 15 */
        background: linear-gradient(to right, #29CCA6 , #85f9bf); /* Standard syntax */

      }
      .el-ellaCoin{
        color: #333;
        span{
          display: inline-block;
          padding: 0 10px;
          border-radius: 30px;
          color: #fff;
          font-size: 22px;
          background: #ff4c41; /* For browsers that do not support gradients */
          background: -webkit-linear-gradient(left, #fa8e68 , #ff4c41); /* For Safari 5.1 to 6.0 */
          background: -o-linear-gradient(right, #fa8e68 , #ff4c41); /* For Opera 11.1 to 12.0 */
          background: -moz-linear-gradient(right, #fa8e68 , #ff4c41); /* For Firefox 3.6 to 15 */
          background: linear-gradient(to right, #fa8e68 , #ff4c41); /* Standard syntax */
        }
      }
      .el-gift{
        color: #29CCA6;
        font-size: 22px;
        background-color: #E9FFFA;
        padding: 5px;
      }
    }
  }
  .el-pay-prompt{
    font-size: 28px;
    padding: 35px 0 16px;
  }
  ul{
    color: #aaa;
    font-size: 20px;
    list-style: decimal;
    margin-left: 32px;
    li{
      padding-right: 32px;
    }
  }
}
</style>

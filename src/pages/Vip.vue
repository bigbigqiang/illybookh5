<template>
  <div id="vip">
    <div class="el-user" v-if="userInfo && userInfo.is_vip ==='YES'">
      <div class="el-user-avatar">
        <img class="el-avatar-img" :src="userInfo.userAvatar||defaultAvatar" alt="">
        <img class="el-vip-img" src="../../static/img/mine_icon_crown_light@2x.png" alt="">
      </div>
      <div class="el-user-info">
        <p class="el-user-name">咿啦看书会员</p>
        <p>有效期至： {{dateFormat(userInfo.vip_end_time)}}</p>
      </div>
    </div>
    <div class="el-user" v-else>
      <div class="el-user-avatar">
        <img class="el-avatar-img" :src="userInfo.userAvatar||defaultAvatar" alt="">
        <img class="el-vip-img" src="../../static/img/mine_icon_crown_gray@2x.png" alt="">
      </div>
      <div class="el-user-info">
        <p class="el-user-name">未购买会员</p>
        <p>成为咿啦会员，畅享无限绘本</p>
      </div>
    </div>
    <div class="el-buy-vip">
      <div class="el-vip-item" v-for="(item, index) in vipCards" :key="index">
        <div class="el-vip-type">
          <p>{{item.title}}</p>
          <p>{{item.remark}}</p>
        </div>
        <div class="el-vip-pay">
          <p><span>{{item.price}}</span> {{item.priceContent.split(' ')[1]}} </p>
          <p>{{item.marketPriceContent}}</p>
        </div>
        <div class="el-pay-btn">
          <span @click="preBuy(item, index)">购买</span>
        </div>
      </div>
    </div>
    <div class="el-vip-benefit">
      <img src="../../static/img/mine_pic_tittle.png" alt="">
      <div class="el-benefit-content">
        <div class="el-benefit-item" v-for="(item, index) in benefit" :key="index">
          <img :src="item.url" alt="">
          <p>{{item.text}}</p>
        </div>
      </div>
    </div>
    <div class="buy-vip-mask" v-show="showBuyVip"></div>
    <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
      <div class="el-buy-vips" v-show="showBuyVip">
        <h3 class="el-payment-header vux-1px-b">
          <i class="icon iconfont icon-close" @click="showBuyVip = false"></i>
          支付
        </h3>
        <div class="el-payment-content" v-if="vipCards.length>0">
          <p class="el-goods-type">{{vipCards[vipTypeIndex].title}}</p>
          <p class="el-pay-amount">合计 <span>{{vipCards[vipTypeIndex].price}}</span> 元</p>
          <divider class="el-prompt">支付方式</divider>
          <div class="el-pay-type">
            <div class="pay-type-item" @click="vipPayType = 'ELLACOIN'">
              <div class="platform">
                <img src="../../static/img/pay_ella@2x.png" alt="">
                <span>咿啦币（{{parseFloat(userInfo.balance) > vipCards[vipTypeIndex].price ? ('剩余' + parseFloat(userInfo.balance) + '个') : '余额不足'}}）</span>
              </div>
              <span class="pay-active" v-if="vipPayType === 'ELLACOIN'"><i class="icon iconfont icon-right"></i></span>
              <span v-else class="pay-unchecked"></span>
            </div>
            <div class="pay-type-item" @click="vipPayType = 'WEIXIN'">
              <div class="platform">
                <img src="../../static/img/pay_wechat@2x.png" alt="">
                <span>微信支付</span>
              </div>
              <span class="pay-active" v-if="vipPayType === 'WEIXIN'"><i class="icon iconfont icon-right"></i></span>
              <span v-else class="pay-unchecked"></span>
            </div>
          </div>
          <div class="el-btn btn-green" @click="buyVip">确认支付</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dateFormat, Divider } from 'vux'
export default {
  data () {
    return {
      userInfo: {},
      vipCards: [],
      vipType: '',
      showBuyVip: false,
      defaultAvatar: require('../../static/img/user.png'),
      vipTypeIndex: 0,
      vipPayType: 'ELLACOIN',
      benefit: [
        {
          url: require('../../static/img/icon_vip01@2x.png'),
          text: '海量绘本免费看'
        },
        {
          url: require('../../static/img/icon_vip02@2x.png'),
          text: '福利抽奖赢不停'
        },
        {
          url: require('../../static/img/icon_vip03@2x.png'),
          text: 'VIP皇冠头像展示'
        },
        {
          url: require('../../static/img/icon_vip04@2x.png'),
          text: '宝宝生日大礼包'
        },
        {
          url: require('../../static/img/icon_vip05@2x.png'),
          text: '名师育儿课堂'
        },
        {
          url: require('../../static/img/icon_vip06@2x.png'),
          text: '独家新书抢先体验'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token,
      isWX: state => state.vux.isWX
    })
  },
  activated () {
    this.cardList()
    if (this.uid) {
      this.getUserInfo()
    } else {
      this.userInfo = {}
    }
  },
  components: {
    Divider
  },
  methods: {
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
    // 获取会员类型配置信息
    cardList () {
      this.$vux.loading.show()
      this.$axios.post('', this.$QS.SF({
        method: 'ella.user.cardList',
        content: JSON.stringify({
          appModel: 'ANDROID'
        })
      })).then((response) => {
        if (response.data.status === '1') {
          this.vipCards = response.data.data
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
    },
    dateFormat (date) {
      return dateFormat(date, 'YYYY-MM-DD')
    },
    listenPayEndOpen (value) {
      this.payEndOpen = value
    },
    getNum (num) {
      let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      let nums = ''
      for (let i = 0; i < num; i++) {
        let id = parseInt(Math.random() * 61)
        nums += chars[id]
      }
      return nums
    },
    preBuy (item, index) {
      let _this = this
      if (this.uid) {
        this.showBuyVip = true
        this.vipTypeIndex = index
      } else {
        this.$vux.confirm.show({
          title: '提示',
          content: '请先登录哦~',
          confirmText: '去登陆',
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            _this.$router.push('../login?from=' + '../vip')
          }
        })
      }
    },
    buyVip () {
      let _this = this
      if (this.vipPayType === 'ELLACOIN') {
        if (parseFloat(this.userInfo.balance) < this.MonthVipPrice) {
          this.$vux.confirm.show({
            title: '提示',
            content: '余额不足',
            confirmText: '去充值',
            onCancel () {
              console.log('plugin cancel')
            },
            onConfirm () {
              _this.$router.push('../ellaCoin')
            }
          })
        } else {
          this.$axios.post('', this.$QS.SF({
            method: 'ella.order.balanceByVip',
            platform: 'APP',
            content: JSON.stringify({
              uid: this.uid,
              orderType: 'BALANCE_MEMBER_BUY',
              paymentPlantform: 'ELLA_COIN',
              channelCode: 'H5',
              thirdCode: 'ELLA-VIP-ANDROID-MONTH'
            })
          })).then((response) => {
            if (response.data.status === '1') {
              this.$vux.alert.show({
                title: '恭喜',
                content: '您已成为咿啦会员！'
              })
              this.$router.go(0)
            } else {
              this.$vux.toast.show({
                text: response.data.message
              })
            }
          }).catch(function (error) {
            console.log(error)
          })
        }
      } else {
        if (this.isWX) {
          this.$vux.alert.show({
            title: '提示',
            content: '请在微信外打开页面并完成支付~'
          })
        } else {
          this.$axios.post('', this.$QS.SF({
            method: 'ella.order.pay',
            platform: 'APP',
            content: JSON.stringify({
              uid: this.uid,
              paymentPlantform: 'WXPAY_WAP',
              orderType: 'CASH_MEMBER_BUY',
              thirdCode: this.vipCards[this.vipTypeIndex].cardCode,
              channelCode: 'H5'
            })
          })).then((response) => {
            if (response.data.status === '1') {
              window.location.href = response.data.data.mweb_url
            } else {
              this.$vux.toast.show({
                text: response.data.message
              })
            }
          }).catch(function (error) {
            console.log(error)
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#vip{
  min-height: 100%;
  width: 100%;
}
.el-user{
  padding: 30px;
  display: flex;
  height: 350px;
  background-color: #d1ba86;
  background-image: url('../../static/img/mine_pic_topbg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  align-items: center;
  color: #fff;
  .el-user-avatar{
    position: relative;
    .el-avatar-img{
      height: 124px;
      width: 124px;
      border-radius: 50%;
      margin-right: 16px;
    }
    .el-vip-img{
      height: 96px;
      width: 96px;
      position: absolute;
      right: -28px;
      top: -52px;
    }
  }
  .el-user-info{
    font-size: 28px;
    .el-user-name{
      font-size: 40px;
      font-weight: bold;
    }
  }
}
.el-baby{
  margin: 0 32px 32px 32px;
  overflow: hidden;
  padding: 48px 80px 32px 80px;
  background-color: #fff;
  border-radius: 8px;
  .el-baby-info{
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    img{
      height: 56px;
      width: 56px;
      border-radius: 50%;
      margin-right: 16px;
    }
    p{
      color: #444;
      font-size: 32px;
    }
  }
  .el-baby-read{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 32px;
    .el-read-item{
      color: #aaa;
      font-size: 24px;
      text-align: center;
      &>p:first-child{
        color: #40d8b0;
        font-size: 22px;
        span{
          font-size: 40px;
        }
      }
    }
  }
  .el-read-competition{
    p{
      color: #eebf5a;
      font-size: 24px;
      text-align: center;
      margin-bottom: 16px;
    }
    .el-progress{
      border:7px solid #f9eacd;
      height: 22px;
      border-radius: 22px;
      background-color: #d2a94d;
      overflow: hidden;
      i{
        display: block;
        height: 110%;
        width: 50%;
        background-color: #efbf5b;
        border-radius: 22px;
      }
    }
  }
}
.el-add-baby{
  color: #ccc;
  font-size: 26px;
  height: 72px;
  line-height: 72px;
  text-align: center;
  margin: 0 32px 32px 32px;
  background-color: #ebeff2;
}
.el-buy-vip{
  padding: 32px;
  .el-vip-item{
    background-color: #fff;
    display: flex;
    font-size: 24px;
    padding: 32px;
    border-radius: 6px;
    align-items: center;
    margin-bottom: 16px;
    .el-vip-type{
      flex: 1;
      &>p:last-child{
        font-size: 24px;
        color: #aaa;
      }
      &>p:first-child{
        color: #666;
        font-size: 36px;
        font-weight: bold;
      }
    }
    .el-vip-pay{
      flex: 1;
      text-align: center;
      color: #aaa;
      &>p:first-child{
        color: #efbf5b;
        span{
          font-size: 36px;
          font-weight: bold;
        }
      }
    }
    .el-pay-btn{
      flex: 1;
      text-align: right;
      span{
        display:inline-block;
        background-color: #efbf5b;
        color: #fff;
        padding: 10px 24px;
        border-radius: 50px;
        font-size: 26px;
      }
    }
  }
}
.el-vip-benefit{
  text-align: center;
  &>img{
    display: block;
    height: 36px;
    margin: 0 auto;
    margin-bottom: 42px;
  }
  .el-benefit-content{
    padding: 0 32px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #f6f8fa;
    .el-benefit-item{
      margin-bottom: 56px;
      img{
        display: block;
        height: 100px;
        margin: 0 auto;
      }
      p{
        font-size: 26px;
        color: #c2aa74;
      }
    }
  }
}
.buy-vip-mask{
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  z-index: 500;
}
.el-buy-vips{
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  .el-payment-header{
    height: 104px;
    line-height: 104px;
    text-align: center;
    font-weight: normal;
    position: relative;
    &>i{
      color: #aaaaaa;
      font-size: 56px;
      position: absolute;
      left: 16px;
      top: 6px;
    }
  }
  .el-payment-content{
    width: 75%;
    margin: 0 auto;
    padding-bottom: 51px;
    text-align: center;
    .el-goods-type{
      font-size: 24px;
      color: #aaa;
      margin-top:50px;
      margin-bottom: 24px;
    }
    .el-pay-amount{
      font-size: 24px;
      color: #aaa;
      span{
        color: #333;
        font-size: 32px;
        font-weight: bold;
      }
    }
  }
  &>h3{
    color: #333;
    font-size: 34px;
    text-align: center;
    margin-bottom: 49px;
  }
  &>img{
    display: block;
    height: 306px;
    margin: 0 auto;
  }
  .el-pay-type{
    margin: 60px auto 0;
    .pay-type-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 31px;
      .platform{
        color: #666;
        font-size: 26px;
        display: flex;
        align-items: center;
        img{
          display: block;
          height: 54px;
          margin-right: 14px;
        }
      }
      .pay-active{
        display: block;
        height: 36px;
        width: 36px;
        background-color: #40d8b1;
        border-radius: 50%;
        font-size: 36px;
        line-height: 36px;
        i{
          color: #fff;
          font-size: 36px;
        }
      }
      .pay-unchecked{
        display: block;
        height: 34px;
        width: 34px;
        border:1px solid #aaa;/*no */
        border-radius: 50%;
      }
    }
  }
}
</style>

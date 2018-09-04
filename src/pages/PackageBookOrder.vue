<template>
  <div id="SettleAccounts" v-if="bookList.length>0 && !!bookPackageInfo && !!userInfo">
    <transition name="custom-classes-transition" enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
      <div class="settle-accounts-page" v-show="!showCouponList">
        <div class="el-settleAccounts-content" v-if="bookList.length>0">
          <div id="packageBookList" class="el-book-list" :class="{ bookSlideDown: bookSlideDown}">
            <div class="el-book-item" v-for="(item, index) in bookList" :key="index">
              <img :src="item.ossUrl" alt="">
              <div class="el-book-info">
                <p>{{item.bookName}}</p>
                <div class="el-goods-info">
                  <div class="el-book-author">
                    <p v-if="item.bookPressName">{{item.bookPressName}}</p>
                    <p>{{item.originalAuthor}}</p>
                  </div>
                  <div class="el-goods-price">
                    <p>咿啦币</p>
                    <p>{{item.goodPrice}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bookSilde split-line" @click="packageBookSlide">{{bookSlideDown?'收起列表':'查看全部'}}</div>
          <div class="el-price-info split-line">
            <div class="el-group">
              <div class="el-menu-item" >
                <a class="el-cell vux-1px-b" href="javascript:void(0);">
                  <div class="el-cell-title">优惠活动</div>
                  <div class="el-cell-value">-{{( parseFloat(bookPackageInfo.goodsSrcPrice) - parseFloat(bookPackageInfo.goodsPrice)).toFixed(2)}} 咿啦币</div>
                </a>
              </div>
              <div class="el-menu-item" >
                <a class="el-cell vux-1px-b" href="javascript:void(0)" @click="showCouponList = true">
                  <div class="el-cell-title">购书红包</div>
                  <div class="el-cell-value">{{chosenCoupon ? ('-' + chosenCoupon.couponAmount.toFixed(2) + '咿啦币') : '请选择'}}</div>
                  <i class="iconfont icon-small-arrow-right"></i>
                </a>
              </div>
              <div class="el-menu-item" >
                <a class="el-cell vux-1px-b" href="javascript:void(0);">
                  <div class="el-cell-title">小计</div>
                  <div class="el-cell-value el-goods-amount">{{amount}} <span>咿啦币</span></div>
                </a>
              </div>
            </div>
          </div>
          <div class="el-month-vip split-line">
            <div class="el-group" v-if="userInfo.is_vip==='NO'">
              <div class="el-menu-item" >
                <a class="el-cell vux-1px-b" href="javascript:void(0)" @click="showBuyVip = true">
                  <div class="el-cell-title">
                    <p><img src="../../static/img/details_members@2x.png" alt="">咿啦会员</p>
                    <p>开通后无需购买，全场<span>免费借书</span></p>
                  </div>
                  <div class="el-cell-value">仅{{vipCard[0].price}}元/月</div>
                  <i class="iconfont icon-small-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="el-pay-type">
            <div class="el-group">
              <div class="el-menu-item" >
                <a class="el-cell vux-1px-b" href="javascript:void(0);">
                  <div class="el-cell-title el-pay-header">支付方式</div>
                </a>
              </div>
              <div class="el-menu-item" >
                <a class="el-cell vux-1px-b" href="javascript:void(0);">
                  <div class="el-cell-title">咿啦币（剩余{{userInfo.balance}}个）</div>
                  <div class="el-cell-value"><i class="iconfont icon-right"></i></div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="el-vip-tips" v-if="userInfo.is_vip==='YES'">
          <img src="../../static/img/details_members@2x.png" alt="">您是咿啦会员用户，可返回直接借阅图书
        </div>
        <div class="el-btn-group" v-if="bookPackageInfo && bookPackageInfo.isBuy ==='NO'">
          <div class="el-white-btn">应付：<span>{{amount}}</span><span>咿啦币</span></div>
          <div class="el-green-btn" @click="settlement">立即购买</div>
        </div>
        <div class="el-btn-group" v-if="bookPackageInfo && bookPackageInfo.isBuy ==='YES'">
          <a class="el-green-btn" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ellabook">前往app阅读</a>
        </div>
        <div class="el-be-vip" v-show="beVIP"></div>
        <transition name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div class="el-vip-content" v-show="beVIP">
            <img src="../../static/img/POP_members@2x.png" alt="">
            <h3>恭喜成为咿啦会员</h3>
            <p>是否免费借阅已选图书</p>
            <div class="btns">
              <div @click="beVIP = false">再看看</div>
              <div @click="borrowBook">好的</div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
      <div class="pay-coupon-page" v-show="showCouponList">
        <i @click="goBack" class="icon iconfont icon-page-left"></i>
        <div class="el-pay-coupon" v-if="coupon.length>0">
          <coupon v-for="(item, index) in coupon" :key="index" :coupon="item" @click.native="chooseCoupon(item)"></coupon>
        </div>
        <no-record v-else :icon="icon" :prompt="'暂无可用红包'"></no-record>
      </div>
    </transition>
    <div class="buy-vip-mask" v-show="showBuyVip"></div>
    <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
      <div class="el-buy-vip" v-show="showBuyVip">
        <span class="close" @click="showBuyVip = false">取消</span>
        <h3>咿啦会员</h3>
        <div class="el-vip-card">
          <h3>咿啦会员卡<span>（￥{{vipCard[0].price}}/月）</span></h3>
          <p>免费借阅全场任意绘本</p>
          <p>有效期：1个月</p>
        </div>
        <divider class="el-prompt">支付方式</divider>
        <div class="el-pay-type">
          <div class="pay-type-item" @click="vipPayType = 'ELLACOIN'">
            <div class="platform">
              <img src="../../static/img/pay_ella@2x.png" alt="">
              <span>咿啦币（{{parseFloat(userInfo.balance) > vipCard[0].price ? ('剩余' + parseFloat(userInfo.balance) + '个') : '余额不足'}}）</span>
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
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dateFormat, Divider } from 'vux'
import NoRecord from '../components/NoRecord'
import Coupon from '../components/Coupon'
export default {
  data () {
    return {
      bookList: [],
      bookPackageInfo: null,
      beVIP: false,
      packageCode: '',
      userInfo: null,
      bookSlideDown: false,
      showCouponList: false,
      coupon: [],
      chosenCoupon: null,
      icon: require('../../static/img/un_red_envelope@2x.png'),
      showBuyVip: false,
      vipCard: null,
      amount: (0).toFixed(2),
      vipPayType: 'ELLACOIN'
    }
  },
  watch: {
    chosenCoupon (newValue, oldValue) {
      if (this.bookPackageInfo.goodsPrice && newValue.couponAmount) {
        this.amount = (parseFloat(this.bookPackageInfo.goodsPrice) - newValue.couponAmount <= 0) ? (0).toFixed(2) : ((this.bookPackageInfo.goodsPrice) - newValue.couponAmount).toFixed(2)
      } else {
        if (this.bookPackageInfo.goodsPrice) {
          this.amount = (this.bookPackageInfo.goodsPrice).toFixed(2)
        } else {
          this.amount = (0).toFixed(2)
        }
      }
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token,
      isWX: state => state.vux.isWX
    })
  },
  created () {
  },
  activated () {
    this.resetData()
    if (this.$route.query.packageCode) {
      this.packageCode = this.$route.query.packageCode
      this.getAllData()
    }
  },
  components: {
    Divider,
    Coupon,
    NoRecord
  },
  methods: {
    // 图书详情
    getBookPackageBookListInfo () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.getBookPackageBookListInfo',
        content: JSON.stringify({
          packageCode: this.packageCode,
          uid: this.uid || '',
          type: 'FOR_SETTLE'
        })
      }))
    },
    // 获取用户信息
    getUserInfo () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.user.getInfo',
        uid: this.uid,
        token: this.token,
        content: JSON.stringify({
          uid: this.uid,
          clientType: 'h5'
        })
      }))
    },
    // 获取红包信息
    getCouponList () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.user.getCouponList',
        content: JSON.stringify({
          uid: this.uid,
          coupon_type: '01',
          page: this.pageIndex,
          pageSize: this.pageSize
        })
      }))
    },
    // 获取会员类型配置信息
    cardList () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.user.cardList',
        content: JSON.stringify({
          appModel: 'ANDROID'
        })
      }))
    },
    resetData () {
      this.bookList = []
      this.bookPackageInfo = null
      this.packageCode = ''
      this.beVIP = false
      this.userInfo = null
      this.showCouponList = false
      this.coupon = []
      this.chosenCoupon = null
      this.showBuyVip = false
      this.amount = (0).toFixed(2)
      this.vipPayType = 'ELLACOIN'
    },
    chooseCoupon (item) {
      this.chosenCoupon = item
      this.showCouponList = false
    },
    buyVip () {
      let _this = this
      if (this.vipPayType === 'ELLACOIN') {
        if (parseFloat(this.userInfo.balance) < this.vipCard[0].price) {
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
              _this.beVIP = true
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
              thirdCode: this.vipCard[0].cardCode,
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
    },
    borrowBook () {
      let bookCodeList = []
      for (let i = 0; i < this.bookList.length; i++) {
        bookCodeList.push(this.bookList[i].bookCode)
      }
      this.$axios.post('', this.$QS.SF({
        method: 'ella.order.batchRentBook',
        platform: 'APP',
        content: JSON.stringify({
          uid: this.uid,
          bookCodeList: bookCodeList
        })
      })).then((response) => {
        if (response.data.status === '1') {
          this.$vux.toast.show({
            text: '借阅成功，已添加到书房！'
          })
          this.beVIP = false
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    packageBookSlide () {
      this.bookSlideDown = !this.bookSlideDown
      document.getElementById('packageBookList').scrollTop = 0
    },
    settlement () {
      let _this = this
      this.$axios.post('', this.$QS.SF({
        method: 'ella.order.settlement',
        uid: this.uid,
        token: this.token,
        platform: 'APP',
        channelCode: 'H5',
        content: JSON.stringify({
          thirdCodes: this.packageCode,
          couponCode: this.chosenCoupon ? this.chosenCoupon.couponCode : '',
          resource: 'ANDROID'
        })
      })).then((response) => {
        if (response.data.status === '1') {
          this.$router.push('../successfulBookPurchase')
        } else if (response.data.status === '0' && response.data.code === '1000010005') {
          this.$vux.confirm.show({
            title: '提示',
            content: response.data.message,
            confirmText: '去充值',
            onCancel () {
              console.log('plugin cancel')
            },
            onConfirm () {
              _this.$router.push('../ellaCoin')
            }
          })
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    goBack () {
      this.showCouponList = false
    },
    getAllData () {
      this.$vux.loading.show()
      this.$axios.all([this.getBookPackageBookListInfo(), this.getUserInfo(), this.getCouponList(), this.cardList()])
        .then(this.$axios.spread((packageBook, userInfo, coupons, card) => {
          this.bookList = packageBook.data.data.bookList
          this.bookPackageInfo = packageBook.data.data.bookPackageInfo
          this.userInfo = userInfo.data.data.userInfo
          this.coupon = this.coupon.concat(coupons.data.data.filter((item) => {
            return item.status === '1'
          }))
          this.amount = parseFloat(this.bookPackageInfo.goodsPrice).toFixed(2)
          this.vipCard = card.data.data.filter((item) => {
            return item.type === 'CARD_MONTH'
          })
          this.$vux.loading.hide()
        })).catch((error) => {
          this.$vux.loading.hide()
          console.log(error)
        })
    },
    dateFormat (date) {
      return dateFormat(date, 'YYYY.MM.DD')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/cell.less');
#SettleAccounts{
  background-color: #f6f8fa;
  width: 100%;
}
.settle-accounts-page{
  background-color: #fff;
  position: relative;
}
.settle-accounts-page::after{
    content: " ";
    height: 100px;
    width: 100%;
    position: absolute;
    bottom: -100px;
    left: 0;
    background-color: #f6f8fa;
}
.el-settleAccounts-content{
  padding: 40px 40px 0 40px;
  overflow-x: hidden;
  .el-book-list{
    max-height: 250px;
    overflow: hidden;
    .el-book-item{
      display: flex;
      padding-bottom: 50px;
      &>img{
        display: block;
        height: 220px;
        box-shadow: 0 0 20px #a5a5a7;
        border-radius: 6px;
        margin-right: 28px;
      }
      .el-book-info{
        flex: 1;
        &>p{
          font-size: 32px;
          color: #333;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .el-goods-info{
          display: flex;
          .el-book-author{
            width: 65%;
            p{
              font-size: 24px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              margin-bottom: 12px;
            }
            &>p:first-child{
              color: #333;
            }
            &>p:last-child{
              color: #999;
            }
          }
          .el-goods-price{
            color: #29CCA6;
            margin-left: auto;
            width: 20%;
            text-align: center;
            &>p:first-child{
              font-size: 22px;
            }
            &>p:last-child{
              font-size: 36px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
  .bookSlideDown{
    max-height: 780px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .bookSilde{
    text-align: center;
    font-size: 26px;
    color: #A6A9AE;
    background: #fff;
    padding: 10px 0;
  }
  .el-group{
    padding-left: 0;
    .el-menu-item{
      .el-cell{
        padding-left: 0;
        padding-right: 0;
        .el-goods-amount{
          color: #29CCA6;
          font-size: 30px;
          span{
            font-size: 24px;
          }
        }
      }
    }
  }
  .el-month-vip{
    .el-group{
      .el-menu-item{
        .el-cell{
          .el-cell-title{
            &>p:first-child{
              font-size: 32px;
              font-weight: bold;
              color: #000;
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              img{
                height: 38px;
                margin-right: 5px;
              }
            }
            &>p:last-child{
              font-size: 28px;
              color: #aaa;
              span{
                color: #FEBF00;
              }
            }
          }
        }
      }
    }
  }
  .el-pay-type{
    .el-group{
      .el-menu-item{
        .el-cell{
          .el-cell-title{
            color: #333;
            font-size: 28px;
          }
          .el-pay-header{
            font-weight: bold;
            font-size: 30px;
          }
          .el-cell-value{
            i.icon-right{
              font-size: 42px;
              color: #29CCA6;
            }
          }
        }
      }
    }
  }
}
.el-vip-tips{
  font-size: 26px;
  color: #FEC248;
  background-color: #FFF9E9;
  display: flex;
  align-items: center;
  position: relative;
  height: 68px;
  padding-left: 40px;
  img{
    height: 42px;
    margin-right: 18px;
  }
}
.el-vip-tips::after{
  content: " ";
  height: 20px;
  width: 200%;
  position: absolute;
  top: -20px;
  left: 0;
  background-color: #f6f8fa;
  margin-left: -50%;
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
  z-index: 100;
  .el-green-btn{
    flex: 1;
    display: block;
    background-color: #40d8b0;
    color: #fff;
  }
  .el-white-btn{
    flex: 2;
    display: block;
    background-color: #fff;
    color: #999;
    font-size: 24px;
    span{
      color: #29CCA6;
    }
    &>span:first-child{
      font-size: 44px;
    }
  }
}
.pay-coupon-page{
  position: relative;
  padding-top: 120px;
  &>i{
    font-size: 64px;
    position: absolute;
    left: 30px;
    top: 30px;
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
.el-buy-vip{
  z-index: 1000;
  padding: 34px 51px;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  .close{
    display: block;
    position: absolute;
    top: 37px;
    left: 50px;
    font-size: 30px;
    color: #aaa;
    width: 63px;
    height: 42px;
  }
  &>h3{
    color: #333;
    font-size: 34px;
    text-align: center;
    margin-bottom: 49px;
  }
  .el-vip-card{
    height: 190px;
    width: 370px;
    margin: 0 auto;
    font-size: 24px;
    color: #fff;
    background-image: url('../../static/img/membership_card@2x.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 58px 64px;
    h3{
      font-size: 32px;
      margin-bottom: 60px;
      span{
        font-size: 24px;
        font-weight: normal;
      }
    }
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
.el-be-vip{
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.7);
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.el-vip-content{
  z-index: 1001;
  width: 70%;
  height: 370px;
  position: absolute;
  background-color: #fff;
  top:25%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 12px;
  text-align: center;
  img{
    display: block;
    width: 396px;
    margin: -125px auto 20px;
  }
  h3{
    font-size: 36px;
    color: #666;
    margin-bottom: 20px;
  }
  p{
    font-size: 26px;
    color: #aaa;
  }
  .btns{
    position: absolute;
    bottom: 0;
    height: 120px;
    display: flex;
    align-items: center;
    width: 100%;
    div{
      flex: 1;
      font-size: 32px;
    }
    &>div:first-child{
      color: #ccc;
    }
    &>div:last-child{
      color: #40D8B1;
    }
  }
}
</style>

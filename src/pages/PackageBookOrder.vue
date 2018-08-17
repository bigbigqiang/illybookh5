<template>
  <div id="SettleAccounts">
    <transition name="custom-classes-transition" enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
      <div class="settle-accounts-page" v-show="!showCouponList">
        <div class="el-settleAccounts-content">
          <div class="el-book-list split-line">
            <div class="el-book-item" v-for="(item, index) in bookList" :key="index">
              <img :src="item.ebBookResource[0].ossUrl" alt="">
              <!-- <div class="el-book-info">
                <p>{{item.bookName}}</p>
                <div class="el-goods-info">
                  <div class="el-book-author">
                    <p>{{item.bookPressName}}</p>
                    <p>{{item.bookAuthor[0].authorName}}</p>
                  </div>
                  <div class="el-goods-price">
                    <p>咿啦币</p>
                    <p>{{item.bookPrice[0].goodsPrice}}</p>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <div class="el-price-info split-line">
            <div class="el-group">
              <div class="el-menu-item" >
                <a class="el-cell vux-1px-b" href="javascript:void(0);">
                  <div class="el-cell-title">优惠活动</div>
                  <div class="el-cell-value">-0.00 咿啦币</div>
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
            <div class="el-group">
              <div class="el-menu-item" >
                <a class="el-cell vux-1px-b" href="javascript:void(0)" @click="showBuyVip = true">
                  <div class="el-cell-title">
                    <p><img src="../../static/details_members@2x.png" alt="">咿啦会员</p>
                    <p>开通后无需购买，全场<span>免费借书</span></p>
                  </div>
                  <div class="el-cell-value">仅19.9元/月</div>
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
        <div class="el-vip-tips">
          <img src="../../static/details_members@2x.png" alt="">您是咿啦会员用户，可返回直接借阅图书
        </div>
        <div class="el-btn-group">
          <div class="el-white-btn">应付：<span>{{amount}}</span><span>咿啦币</span></div>
          <div class="el-green-btn">立即购买</div>
        </div>
      </div>
    </transition>
    <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
      <div class="pay-coupon-page" v-show="showCouponList">
        <i @click="goBack" class="icon iconfont icon-page-left"></i>
        <div class="el-pay-coupon" v-if="coupon.length>0">
          <coupon v-for="(item, index) in coupon" :key="index" :coupon="item" @click="chooseCoupon(item)"></coupon>
        </div>
        <no-record v-else :icon="icon" :prompt="'暂无可用红包'"></no-record>
      </div>
    </transition>
    <div class="buy-vip-mask" v-show="showBuyVip"></div>
    <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
      <div class="el-buy-vip" v-show="showBuyVip">
        <span class="close" @click="showBuyVip = false">取消</span>
        <h3>咿啦会员</h3>
        <img src="../../static/membership_card@2x.png" alt="">
        <divider class="el-prompt">支付方式</divider>
        <div class="el-pay-type">
          <div class="pay-type-item" @click="vipPayType = 'ELLACOIN'">
            <div class="platform">
              <img src="../../static/pay_ella@2x.png" alt="">
              <span>咿啦币（剩余{{userInfo.balance}}个）</span>
            </div>
            <span class="pay-active" v-if="vipPayType === 'ELLACOIN'"><i class="icon iconfont icon-right"></i></span>
            <span v-else class="pay-unchecked"></span>
          </div>
          <div class="pay-type-item" @click="vipPayType = 'WEIXIN'">
            <div class="platform">
              <img src="../../static/pay_wechat@2x.png" alt="">
              <span>微信支付</span>
            </div>
            <span class="pay-active" v-if="vipPayType === 'WEIXIN'"><i class="icon iconfont icon-right"></i></span>
            <span v-else class="pay-unchecked"></span>
          </div>
        </div>
        <div class="el-btn btn-green" >确认支付</div>
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
      bookPackageInfo: {},
      pageSize: 20,
      pageIndex: 0,
      userInfo: null,
      showCouponList: false,
      coupon: [],
      chosenCoupon: null,
      icon: require('../../static/un_red_envelope@2x.png'),
      showBuyVip: false,
      amount: (0).toFixed(2),
      vipPayType: 'ELLACOIN'
    }
  },
  watch: {
    // chosenCoupon (newValue, oldValue) {
    //   if (this.bookInfo.bookPrice[0].goodsPrice && newValue.couponAmount) {
    //     this.amount = (this.bookInfo.bookPrice[0].goodsPrice - newValue.couponAmount <= 0) ? (0).toFixed(2) : (this.bookInfo.bookPrice[0].goodsPrice - newValue.couponAmount).toFixed(2)
    //   } else {
    //     if (this.bookInfo.bookPrice[0].goodsPrice) {
    //       this.amount = this.bookInfo.bookPrice[0].goodsPrice.toFixed(2)
    //     } else {
    //       this.amount = (0).toFixed(2)
    //     }
    //   }
    // }
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
    this.resetData()
    if (this.$route.query.type === 'bookPackage' && this.$route.query.packageCode) {
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
      return this.$axios.post('', this.$QS.stringify({
        method: 'ella.book.getBookPackageBookListInfo',
        content: JSON.stringify({
          packageCode: this.$route.query.packageCode,
          uid: this.uid || '',
          pageVo: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        })
      }))
    },
    // 获取用户信息
    getUserInfo () {
      return this.$axios.post('', this.$QS.stringify({
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
      return this.$axios.post('', this.$QS.stringify({
        method: 'ella.user.getCouponList',
        content: JSON.stringify({
          uid: this.uid,
          coupon_type: '01',
          page: this.pageIndex,
          pageSize: this.pageSize
        })
      }))
    },
    resetData () {
      this.bookList = []
      this.bookPackageInfo = {}
      this.pageSize = 20
      this.pageIndex = 0
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
    },
    goBack () {
      this.showCouponList = false
    },
    getAllData () {
      this.$vux.loading.show()
      this.$axios.all([this.getBookPackageBookListInfo(), this.getUserInfo(), this.getCouponList()])
        .then(this.$axios.spread((packageBook, userInfo, coupons) => {
          this.bookList = this.bookList.concat(packageBook.data.data.bookList)
          this.bookPackageInfo = packageBook.data.data.bookPackageInfo
          this.userInfo = userInfo.data.data.userInfo
          this.coupon = this.coupon.concat(coupons.data.data.filter((item) => {
            return item.status === '1'
          }))
          this.amount = (0).toFixed(2)
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
  .el-book-list{
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
            p{
              font-size: 24px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              margin-bottom: 12px;
              max-width: 85%;
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
  padding-top: 100px;
  &>i{
    font-size: 64px;
    position: absolute;
    left: 50px;
    top: 50px;
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
  position: absolute;
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

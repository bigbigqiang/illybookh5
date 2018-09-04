<template>
  <div id="mine">
    <div class="el-user" @click="login" v-if="!uid || invalid">
      <img src="../../static/img/user.png" alt="">
      <div class="el-user-info">
        <p class="el-user-name">未登录</p>
      </div>
    </div>
    <div class="el-user" v-else @click="toUserInfo">
      <img :src="userInfo.userAvatar || defaultAvatar" alt="">
      <div class="el-user-info">
        <p class="el-user-name">{{userInfo.userNick||'未登录'}}</p>
        <p>{{userInfo.sign||''}}</p>
      </div>
    </div>
    <div class="el-baby" v-for="(item, index) in childrenInfo" :key="index" @click="toBabies(index)">
      <div class="el-baby-info">
        <img :src="item.childrenAvatar?item.childrenAvatar:(item.childrenSex === 'FEMALE'?gril:boy)" alt="">
        <p class="el-baby-name">{{item.childrenNick}}</p>
      </div>
      <div class="el-baby-read">
        <div class="el-read-item">
          <p><span>{{item.readHistory.historyReadTime || 0}}</span>分钟</p>
          <p>阅读时长</p>
        </div>
        <div class="el-read-item">
          <p><span>{{item.readHistory.bookTotal || 0}}</span>本</p>
          <p>阅读数量</p>
        </div>
        <div class="el-read-item">
          <p><span>{{item.readHistory.todayReadTime || 0}}</span>分钟</p>
          <p>今日阅读</p>
        </div>
      </div>
      <div class="el-read-competition">
        <p>超过全国{{item.readHistory.surpassRate || 0}}%的用户</p>
        <div class="el-progress">
          <i :style="{width: (item.readHistory.surpassRate || 0) + '%'}"></i>
        </div>
      </div>
    </div>
    <!-- <div class="el-add-baby" v-if="childrenInfo.length<3">添加宝宝</div> -->
    <div class="el-group">
      <div class="el-menu-item" >
        <img src="../../static/img/yl-coin.png" alt="">
        <a class="el-cell vux-1px-b" href="#/ellaCoin">
          <div class="el-cell-title">咿啦币</div>
          <div class="el-cell-value">{{(userInfo.balance||0) + '个'}}</div>
          <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div>
      <div class="el-menu-item" >
        <img src="../../static/img/mine_icon_redpacket@2x.png" alt="">
        <a class="el-cell vux-1px-b" href="#/coupon">
          <div class="el-cell-title">红包</div>
          <div class="el-cell-value">{{(userInfo.count||0) + '个'}}</div>
          <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div>
      <div class="el-menu-item" >
        <img src="../../static/img/mine_icon_member@2x.png" alt="">
        <a class="el-cell vux-1px-b" href="#/vip">
          <div class="el-cell-title">我的会员</div>
          <div class="el-cell-value">{{userInfo.is_vip === 'YES' ? userInfo.vip_end_date : ''}}</div>
          <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div>
      <div class="el-menu-item" >
        <img src="../../static/img/mine_icon_seting.png" alt="">
        <a class="el-cell vux-1px-b" :href="'#/set?phone='+(userInfo.mobile||'')">
          <div class="el-cell-title">设置</div>
          <div class="el-cell-value"></div>
          <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div>
      <!-- <div class="el-menu-item" >
        <img src="../../static/img/mine_icon_recommend@2x.png" alt="">
        <a class="el-cell vux-1px-b" :href="'http://ellabook.cn/ellabook/bookService/Invitation/active/?uid='+uid">
          <div class="el-cell-title">邀请好友</div>
          <div class="el-cell-value"></div>
          <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div> -->
      <div class="el-menu-item" >
        <img src="../../static/img/icon_mine_change@3x.png" alt="">
        <a class="el-cell vux-1px-b" :href="'http://ellabook.cn/bookService/cardexchange/exchange.html?uid='+uid">
          <div class="el-cell-title">兑换</div>
          <div class="el-cell-value"></div>
          <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div>
      <div class="el-menu-item" >
        <img src="../../static/img/mine_icon_feedback@2x.png" alt="">
        <a class="el-cell vux-1px-b" href="javascript:void(0);" @click="toFeedBack">
          <div class="el-cell-title">信息反馈</div>
          <div class="el-cell-value"></div>
          <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div>
      <div class="el-menu-item" >
        <img src="../../static/img/mine_icon_aboutus@2x.png" alt="">
        <a class="el-cell vux-1px-b" href="#/aboutUs">
          <div class="el-cell-title">关于我们</div>
          <div class="el-cell-value"></div>
          <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      defaultAvatar: require('../../static/img/user.png'),
      gril: require('../../static/img/gril.png'),
      boy: require('../../static/img/boy.png'),
      userInfo: {},
      childrenInfo: [],
      invalid: false
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  activated () {
    if (this.uid && this.token) {
      this.$vux.loading.show()
      this.$axios.all([this.getInfo(), this.getChildrenInfo(), this.listReadHistory()])
        .then(this.$axios.spread((userInfo, childrenInfo, readHistory) => {
          this.$vux.loading.hide()
          if (userInfo.data.status === '1') {
            this.invalid = false
            this.userInfo = userInfo.data.data.userInfo
            childrenInfo.data.data.forEach((item, index) => {
              item.readHistory = readHistory.data.data[index] || {}
            })
            this.childrenInfo = childrenInfo.data.data
          } else {
            this.invalid = true
            window.localStorage.removeItem('uid')
            window.localStorage.removeItem('token')
            this.$store.commit('updateUid', {uid: null})
            this.$store.commit('updateToken', {token: null})
            this.$vux.toast.show({
              text: '登录失效，请重新登录~'
            })
          }
        }))
    } else {
      this.userInfo = {}
      this.childrenInfo = []
    }
  },
  components: {
  },
  methods: {
    login () {
      this.$router.push('../login?from=' + this.$router.currentRoute.fullPath)
    },
    toUserInfo () {
      this.$router.push('../userInfo')
    },
    toBabies (index) {
      this.$router.push('../babies?babyIndex=' + index)
    },
    linkTo (item) {
      if (item.title === '设置') {
        this.$router.push({path: '../set', query: {phone: this.userInfo.mobile}})
      }
    },
    toFeedBack () {
      let _this = this
      if (this.uid) {
        this.$router.push('../feedBack')
      } else {
        this.$vux.confirm.show({
          title: '提示',
          content: '请先登录哦~',
          confirmText: '去登陆',
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            _this.$router.push('../login?from=' + '../feedBack')
          }
        })
      }
    },
    getInfo () {
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
    getChildrenInfo () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.user.getChildrenInfo',
        uid: this.uid,
        token: this.token,
        content: JSON.stringify({
          uid: this.uid
        })
      }))
    },
    listReadHistory () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listReadHistory',
        uid: this.uid,
        token: this.token,
        content: JSON.stringify({
          uid: this.uid
        })
      }))
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/cell.less');
#mine{
  padding-bottom: 90px;
  background: #f6f8fa;
}
.el-user{
  padding: 30px;
  display: flex;
  height: 125px;
  align-items: center;
  img{
    height: 124px;
    width: 124px;
    border-radius: 50%;
    margin-right: 16px;
  }
  .el-user-info{
    color: #aaa;
    font-size: 28px;
    .el-user-name{
      color: #333;
      font-size: 40px;
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
</style>

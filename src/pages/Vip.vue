<template>
  <div id="vip">
    <div class="el-user" v-if="userInfo && userInfo.is_vip ==='YES'">
      <div class="el-user-avatar">
        <img class="el-avatar-img" :src="userInfo.userAvatar||defaultAvatar" alt="">
        <img class="el-vip-img" src="../../static/mine_icon_crown_light@2x.png" alt="">
      </div>
      <div class="el-user-info">
        <p class="el-user-name">咿啦看书会员</p>
        <p>有效期至： {{dateFormat(userInfo.vip_end_time)}}</p>
      </div>
    </div>
    <div class="el-user" v-else>
      <div class="el-user-avatar">
        <img class="el-avatar-img" :src="userInfo.userAvatar||defaultAvatar" alt="">
        <img class="el-vip-img" src="../../static/mine_icon_crown_gray@2x.png" alt="">
      </div>
      <div class="el-user-info">
        <p class="el-user-name">未购买会员</p>
        <p>成为咿啦会员，畅享无限绘本</p>
      </div>
    </div>
    <div class="el-buy-vip">
      <div class="el-vip-item">
        <div class="el-vip-type">
          <p>月卡会员</p>
          <p>30天无限畅读</p>
        </div>
        <div class="el-vip-pay">
          <p><span>28</span> 元/月 </p>
          <p>原价： 40元/月</p>
        </div>
        <div class="el-pay-btn">
          <span @click="buy">购买</span>
        </div>
      </div>
      <div class="el-vip-item">
        <div class="el-vip-type">
          <p>年卡会员</p>
          <p>365天无限畅读</p>
        </div>
        <div class="el-vip-pay">
          <p><span>238</span> 元/月 </p>
          <p>原价： 360元/年</p>
        </div>
        <div class="el-pay-btn">
          <span @click="buy">购买</span>
        </div>
      </div>
    </div>
    <div class="el-vip-benefit">
      <img src="../../static/mine_pic_tittle.png" alt="">
      <div class="el-benefit-content">
        <div class="el-benefit-item" v-for="(item, index) in benefit" :key="index">
          <img :src="item.url" alt="">
          <p>{{item.text}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dateFormat } from 'vux'
export default {
  data () {
    return {
      userInfo: {},
      defaultAvatar: require('../../static/user.png'),
      benefit: [
        {
          url: require('../../static/icon_vip01@2x.png'),
          text: '海量绘本免费看'
        },
        {
          url: require('../../static/icon_vip02@2x.png'),
          text: '福利抽奖赢不停'
        },
        {
          url: require('../../static/icon_vip03@2x.png'),
          text: 'VIP皇冠头像展示'
        },
        {
          url: require('../../static/icon_vip04@2x.png'),
          text: '宝宝生日大礼包'
        },
        {
          url: require('../../static/icon_vip05@2x.png'),
          text: '名师育儿课堂'
        },
        {
          url: require('../../static/icon_vip06@2x.png'),
          text: '独家新书抢先体验'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  activated () {
    if (this.uid) {
      this.getInfo()
    } else {
      this.userInfo = {}
    }
  },
  components: {
  },
  methods: {
    getInfo () {
      this.$vux.loading.show()
      this.$axios.post('', this.$QS.stringify({
        method: 'ella.user.getInfo',
        uid: this.uid,
        token: this.token,
        content: JSON.stringify({
          uid: this.uid,
          clientType: 'h5'
        })
      })).then((response) => {
        this.$vux.loading.hide()
        if (response.data.status === '1') {
          this.userInfo = response.data.data.userInfo
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    dateFormat (date) {
      return dateFormat(date, 'YYYY-MM-DD')
    },
    buy () {
      this.$vux.toast.show({
        text: '功能正在开发，请到app内购买~'
      })
    }
  }
}
</script>

<style lang="less" scoped>
#vip{
  min-height: 100%;
}
.el-user{
  padding: 30px;
  display: flex;
  height: 350px;
  background-color: #d1ba86;
  background-image: url('../../static/mine_pic_topbg.png');
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
</style>

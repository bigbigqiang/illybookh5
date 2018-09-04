<template>
  <div id="babies">
    <div class="el-babies" v-if="currentBaby">
      <div class="el-babies-content">
        <div class="el-prev">
          <img src="../../static/img/mine_button_prev.png" alt="" v-show="currentIndex!==0" @click="prev">
        </div>
        <div class="el-baby-avatar">
          <transition name="custom-classes-transition"
          :enter-active-class="'animated ' + (direction === 'forward' ? 'slideInRight' : 'slideInLeft')"
          :leave-active-class="'animated ' + (direction === 'forward' ? 'slideOutLeft' : 'slideOutRight')">
            <img v-show="showAvatar" :src="currentBaby.childrenAvatar?currentBaby.childrenAvatar:(currentBaby.childrenSex === 'FEMALE'?gril:boy)" alt="">
          </transition>
        </div>
        <div class="el-next">
          <img src="../../static/img/mine_button_next.png" alt="" v-show="currentIndex!==(childrenInfo.length-1)" @click="next">
        </div>
      </div>
      <div class="el-baby-name">
        <span>
          {{currentBaby.childrenNick}}
          <img :src="currentBaby.childrenSex === 'FEMALE'?female:male" alt="">
        </span>
      </div>
      <div class="el-baby-birthday">宝宝生日：{{currentBaby.childrenBirthday}}</div>
    </div>
    <div class="el-baby-read-history" v-if="currentBaby">
      <div class="el-baby-read">
        <div class="el-read-item">
          <p><span>{{currentBaby.readHistory.historyReadTime || 0}}</span>分钟</p>
          <p>阅读时长</p>
        </div>
        <div class="el-read-item">
          <p><span>{{currentBaby.readHistory.bookTotal || 0}}</span>本</p>
          <p>阅读数量</p>
        </div>
        <div class="el-read-item">
          <p><span>{{currentBaby.readHistory.todayReadTime || 0}}</span>分钟</p>
          <p>今日阅读</p>
        </div>
      </div>
      <div class="el-read-competition">
        <p>超过全国{{currentBaby.readHistory.surpassRate || 0}}%的用户</p>
        <div class="el-progress">
          <i :style="{width: (currentBaby.readHistory.surpassRate || 0) + '%'}"></i>
        </div>
      </div>
    </div>
    <div class="el-chart">
      <div v-show="showLine" id="lineChart"></div>
      <div v-show="showPie" id="pieChart"></div>
      <img v-show="!showLine&&!showPie" src="../../static/img/nodata.png" alt="">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dateFormat } from 'vux'
import { lineOption, pieOption } from '../assets/js/chartOption'
import echarts from 'echarts/index.common'
export default {
  data () {
    return {
      gril: require('../../static/img/gril.png'),
      boy: require('../../static/img/boy.png'),
      female: require('../../static/img/icon_sex_girl@2x.png'),
      male: require('../../static/img/icon_sex_boy@2x.png'),
      childrenInfo: [],
      currentBaby: {
        readHistory: {}
      },
      showIframe: false,
      currentIndex: 0,
      showAvatar: false,
      lineChart: null,
      pieChart: null,
      showLine: false,
      showPie: false,
      direction: 'forward'
    }
  },
  watch: {
    currentIndex (newValue, oldValue) {
      if (newValue > oldValue) {
        this.direction = 'forward'
      } else {
        this.direction = 'back'
      }
      setTimeout(() => {
        this.showAvatar = true
        this.currentBaby = this.childrenInfo[newValue]
        this.renderChart()
      }, 200)
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  activated () {
    if (this.$route.query.babyIndex) {
      this.currentIndex = parseInt(this.$route.query.babyIndex)
      if (this.uid && this.token) {
        this.$vux.loading.show()
        this.$axios.all([this.getChildrenInfo(), this.listReadHistory()])
          .then(this.$axios.spread((childrenInfo, readHistory) => {
            this.$vux.loading.hide()
            if (childrenInfo.data.status === '1') {
              childrenInfo.data.data.forEach((item, index) => {
                item.readHistory = readHistory.data.data[index] || {}
              })
              this.childrenInfo = childrenInfo.data.data
              setTimeout(() => {
                this.showAvatar = true
                this.currentBaby = childrenInfo.data.data[this.currentIndex]
                this.$nextTick(function () {
                  this.lineChart = echarts.init(document.getElementById('lineChart'))
                  this.pieChart = echarts.init(document.getElementById('pieChart'))
                  this.renderChart()
                })
              }, 200)
            } else {
              this.$vux.toast.show({
                text: '登录失效，请重新登录~'
              })
            }
          }))
      } else {
        this.childrenInfo = []
        this.$router.push('/index/home')
      }
    } else {
      this.$router.push('index/mine')
    }
  },
  components: {
  },
  methods: {
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
    },
    listReadHistoryByDay (lineChart) {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listReadHistoryByDay',
        content: JSON.stringify({
          uid: this.uid,
          childrenUid: this.currentBaby.cid,
          countDay: 5
        })
      }))
    },
    listBookReadWiki (pieChart) {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listBookReadWiki',
        content: JSON.stringify({
          uid: this.uid,
          childrenUid: this.currentBaby.cid
        })
      }))
    },
    renderLineChart (lineData) {
      let xData = []
      let yData = []
      for (let i = 0; i < lineData.length; i++) {
        xData.push(lineData[i].readTime)
        yData.push(this.dateFormat(lineData[i].readDate))
      }
      lineOption.xAxis[0].data = yData
      lineOption.series[0].data = xData
      lineOption.yAxis.max = (parseInt(Math.max.apply(null, xData) * 1 / 10) + 1) * 10
      this.lineChart.setOption(lineOption)
      setTimeout(() => {
        this.lineChart.resize()
      }, 100)
    },
    renderPieChart (pieData) {
      let seriesData = []
      for (let i = 0; i < pieData.length; i++) {
        seriesData.push({value: pieData[i].wikRate, name: pieData[i].wikName + pieData[i].wikRate + '%'})
      }
      pieOption.series[0].data = seriesData
      this.pieChart.setOption(pieOption)
      setTimeout(() => {
        this.pieChart.resize()
      }, 100)
    },
    prev () {
      if (this.currentIndex) {
        this.currentIndex--
        this.showAvatar = false
      }
    },
    next () {
      if (this.currentIndex < this.childrenInfo.length - 1) {
        this.currentIndex++
        this.showAvatar = false
      }
    },
    dateFormat (date) {
      return dateFormat(date, 'MM-DD')
    },
    renderChart () {
      this.$axios.all([this.listReadHistoryByDay(), this.listBookReadWiki()])
        .then(this.$axios.spread((lineData, pieData) => {
          if (lineData.data.status === '1') {
            if (lineData.data.data.length > 0) {
              this.showLine = true
              this.renderLineChart(lineData.data.data)
            } else {
              this.showLine = false
            }
            if (pieData.data.data.length > 0) {
              this.showPie = true
              this.renderPieChart(pieData.data.data)
            } else {
              this.showPie = false
            }
          } else {
            this.$vux.toast.show({
              text: lineData.data.message
            })
          }
        }))
    }
  }
}
</script>

<style lang="less" scoped>
#babies{
  padding-bottom: 90px;
  background: #f6f8fa;
}
.el-babies{
  background-image: url('../../static/img/topbg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 100px;
  padding-bottom: 126px;
  .el-babies-content{
    display: flex;
    margin: 0 auto;
    align-items: center;
    width: 395px;
    justify-content: space-between;
    .el-prev,.el-next{
      height: 66px;
      width: 66px;
      img{
        display: block;
        height: 66px;
        width: 66px;
      }
    }
    .el-baby-avatar{
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      img{
        display: block;
        width: 140px;
        height: 140px;
        border-radius: 50%;
        border:5px solid #fff;
      }
    }
  }
  .el-baby-name{
    color: #fff;
    font-size: 36px;
    text-align: center;
    font-weight: bold;
    span{
      display: inline-block;
      position: relative;
      padding: 32px 16px 24px 16px;
      img{
        vertical-align: middle;
        height: 46px;
        position: absolute;
        right: -32px;
        top: 34px;
      }
    }
  }
  .el-baby-birthday{
    height: 44px;
    width: 345px;
    text-align: center;
    color: #fff;
    font-size: 28px;
    background-color: #aec7c1;
    border-radius: 44px;
    margin: 0 auto;
    line-height: 44px;
  }
}
.el-iframe{
  padding: 0 32px;
  iframe{
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    min-width: 100%;
    *width:100%;
    width:1px;/* no*/
    height: 1100px;
  }
}
.el-baby-read-history{
  margin: -80px 32px 32px 32px;
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
.el-chart{
  padding: 32px;
  img{
    display: block;
    width: 50%;
    margin: 0 auto;
  }
  #lineChart{
    width: 100%;
    height: 700px;
  }
  #pieChart{
    width: 100%;
    height: 700px;
  }
}
</style>

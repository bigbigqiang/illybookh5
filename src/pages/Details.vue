<template>
  <div id="details" v-if="!!bookInfo">
    <div class="el-details-content">
      <div class="el-book-info vux-1px-b">
        <img :src="bookInfo.ebBookResource[0].ossUrl" alt="">
        <div class="el-book-r">
          <div class="el-book-name">{{bookInfo.bookName}}</div>
          <div class="el-rater">
            <rater :value="bookInfo.bookScore"></rater> <span class="el-score">{{bookInfo.bookScore.toFixed(1)}}</span>
          </div>
          <div class="el-press">
            {{bookInfo.bookPressName}}
          </div>
          <div class="el-press">
            {{bookInfo.bookAuthor[0].authorName}}
          </div>
          <div class="el-book-tags vux-1px-b">
            <span v-for="(tag, index) in bookInfo.tags.split(',').slice(0, 10)" :key="index">{{tag}}</span>
          </div>
          <p class="el-bookPrice">
            {{bookInfo.bookPrice[0].goodsPrice}}
            <span>咿啦币</span>
          </p>
          <p class="el-market-price">
            纸质书价格￥<span style="text-decoration:line-through">{{bookInfo.bookPrice[0].goodsMarketprice}}</span>
            <a href="#/vip" class="el-vip-free">会员免费借阅 <img src="../../static/img/icon-huiyuan xiangqing@3x.png" alt=""> </a>
          </p>
        </div>
      </div>
      <div class="el-book-introduction split-line">
        <div class="el-block-header">
          <h3>绘本简介</h3>
        </div>
        <p :class="{'el-silde-up': isSlideUp}">{{bookInfo.bookIntroduction}}</p>
        <div class="el-slide-btn" @click="isSlideUp = !isSlideUp"><i class="icon iconfont" :class="[isSlideUp?'icon-arrow-right':'icon-arrow-up']"></i></div>
      </div>
      <div class="el-book-preview split-line">
        <div class="el-block-header">
          <h3>绘本预览</h3>
        </div>
        <div class="el-preview-content">
          <div class="el-video">
            <div class="el-play-btn" @click="play" v-if="!isPlay">
              <i class="icon iconfont icon-play"></i>
            </div>
            <video id="el_video" width="100%" preload="auto" name="media">
              <source :src="bookVideo.ossUrl" type="video/mp4" />
            </video>
          </div>
          <img v-for="(item, index) in bookList" :key="index" :src="item.src" @click="imgPreview(index)">
        </div>
      </div>
      <div class="el-book-recommend split-line">
        <div class="el-block-header">
          <h3>相关推荐</h3>
        </div>
        <div class="el-style3-content">
          <a v-for="(item, index) in recommend" :key="index" :href="'#/details/'+item.bookCode" class="el-style3-content-item" >
            <img :src="item.ebBookResource[0].ossUrl" alt="">
            <p>{{item.bookName}}</p>
          </a>
        </div>
      </div>
    </div>
    <div class="el-book-comment" v-if="comment.length>0">
      <div class="el-block-header">
        <h3>书评 <span>共{{commentCount}}条</span> </h3>
      </div>
      <div class="el-comment-content">
        <div class="el-comment-item" v-for="(item, index) in comment.slice(0, 5)" :key="index">
          <img :src="item.userAvatar || defaultAvatar" alt="">
          <div class="el-comment-info vux-1px-b">
            <div class="el-user-name">{{item.userNick}}</div>
            <div class="el-date">{{dateFormat(item.commentTime)}}</div>
            <rater :value="item.commentScore"></rater>
            <p v-if="item.commentType==='COMMENT_TEXT'">{{item.commentContent}}</p>
            <div class="el-comment-voice" v-else-if="item.commentType==='COMMENT_VOICE'" @click.prevent="playAudio">
              <i class="icon iconfont icon-andio"></i>
              <audio :src="item.commentVoiceUrl" >
              </audio>
              <span>{{item.commentDuration?(item.commentDuration + 's'):''}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a v-if="comment.length>5" :href="'#/comments/'+bookCode" class="el-more-comment vux-1px-t split-line">查看全部{{commentCount}}条评论</a>
    <div class="el-more-info" v-if="bookInfo">
      <div class="el-block-header">
        <h3>更多图书信息</h3>
      </div>
      <div class="el-more-content">
        <ul>
          <li>上架时间：{{dateFormat(bookInfo.bookPrice[0].goodsPublishTime)}}</li>
          <li>版权方：{{bookInfo.bookPressName}}</li>
          <li>作者：{{bookInfo.bookAuthor[0].authorName}}</li>
          <li v-if="bookInfo.bookAuthor.length>1">动画设计：{{bookInfo.bookAuthor[1].authorName}}</li>
        </ul>
      </div>
    </div>
    <div v-transfer-dom>
      <previewer :list="bookList" ref="previewer" @on-index-change="logIndexChange"></previewer>
    </div>
    <div class="el-btn-group" v-if="!userInfo || !!userInfo && userInfo.is_vip === 'NO' && bookInfo.useState ==='READ_NO'">
      <a class="el-white-btn" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ellabook">前往app</a>
      <div class="el-green-btn" @click="payNow">立即购买</div>
    </div>
    <div class="el-btn-group" v-else-if="!!userInfo && userInfo.is_vip === 'YES' && bookInfo.useState ==='READ_NO'">
      <a class="el-white-btn" href="javascript:void(0);" @click="borrowBook"> <img src="../../static/img/bookdetail_icon_crown.png" alt="" > 免费借阅</a>
      <div class="el-green-btn" @click="payNow">立即购买</div>
    </div>
    <div class="el-btn-group" v-else-if="bookInfo.useState ==='READ_YES'">
      <a class="el-green-btn" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ellabook">前往app阅读</a>
    </div>
    <parents-confirm :checkOpen="checkOpen" @listenCheckOpen="listenCheckOpen" @listenParentChecked="listenParentChecked"></parents-confirm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Previewer, TransferDom, dateFormat, Divider } from 'vux'
import Rater from '../components/Rater'
import ParentsConfirm from '../components/ParentsConfirm'
export default {
  data () {
    return {
      bookInfo: {
        ebBookResource: [{}],
        tags: '',
        bookScore: 5,
        bookPrice: [{}],
        bookAuthor: [{}, {}]
      },
      parentChecked: false,
      defaultAvatar: require('../../static/img/user.png'),
      isSlideUp: true,
      bookList: [],
      bookVideo: {},
      recommend: [],
      comment: [],
      bookCode: '',
      commentCount: 0,
      checkOpen: false,
      isPlay: false,
      userInfo: null
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
    this.resetData()
    this.bookCode = this.$route.params.bookCode
    this.getAllData()
  },
  beforeRouteUpdate (to, from, next) {
    this.resetData()
    this.bookCode = to.params.bookCode
    this.getAllData()
    next()
  },
  directives: {
    TransferDom
  },
  components: {
    Rater,
    Previewer,
    ParentsConfirm,
    Divider
  },
  mounted () {
    this.$nextTick(function () {
      let elVideo = document.getElementById('el_video')
      elVideo.addEventListener('play', () => {
        this.isPlay = true
      })
      elVideo.addEventListener('pause', () => {
        this.isPlay = false
      })
    })
  },
  methods: {
    // 图书详情
    getBookByCode () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.getBookByCode',
        content: JSON.stringify({
          bookCode: this.bookCode,
          uid: this.uid || '',
          resource: 'normal'
        })
      }))
    },
    // 图书预览资源
    listBookPreview () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listBookPreview',
        content: JSON.stringify({
          bookCode: this.bookCode,
          resource: 'normal'
        })
      }))
    },
    // 相关推荐
    listBooksRecommend () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listBooksRecommend',
        content: JSON.stringify({
          bookCode: this.bookCode,
          pageIndex: '0',
          pageSize: '5'
        })
      }))
    },
    // 图书评论
    listBookComment () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listBookComment',
        content: JSON.stringify({
          bookCode: this.bookCode,
          pageIndex: 0,
          pageSize: 6
        })
      }))
    },
    // 图书评论总数
    bookCommentCount () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.bookCommentCount',
        content: JSON.stringify({
          bookCode: this.bookCode
        })
      }))
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
    payNow () {
      let _this = this
      this.parentChecked = false
      if (this.uid) {
        this.checkOpen = true
      } else {
        this.$vux.confirm.show({
          title: '提示',
          content: '请先登录哦~',
          confirmText: '去登陆',
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          },
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            _this.$router.push('../login?from=' + '../details/' + _this.bookCode)
          }
        })
      }
    },
    borrowBook () {
      this.$axios.post('', this.$QS.SF({
        method: 'ella.order.addRentBookOrder',
        platform: 'APP',
        content: JSON.stringify({
          uid: this.uid,
          bookCode: this.bookCode
        })
      })).then((response) => {
        if (response.data.status === '1') {
          this.$vux.toast.show({
            text: '借阅成功,已添加到书房~'
          })
          this.bookInfo.useState = 'READ_YES'
        } else {
          this.$vux.toast.show({
            text: response.data.message
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    listenCheckOpen (value) {
      this.checkOpen = value
    },
    listenParentChecked (value) {
      this.parentChecked = value
      if (value) {
        this.$router.push('../bookOrder?bookCode=' + this.bookCode)
      }
    },
    resetData () {
      this.bookInfo = {
        ebBookResource: [{}],
        tags: '',
        bookScore: 5,
        bookPrice: [{}],
        bookAuthor: [{}, {}]
      }
      this.isSlideUp = true
      this.commentCount = 0
      this.bookList = []
      this.bookVideo = {}
      this.bookVideo = {}
      this.recommend = []
      this.comment = []
      this.bookCode = ''
      this.isPlay = false
      this.checkOpen = false
      this.userInfo = null
    },
    getAllData () {
      this.$vux.loading.show()
      this.$axios.all([this.getBookByCode(), this.listBookPreview(), this.listBooksRecommend(), this.listBookComment(), this.bookCommentCount()])
        .then(this.$axios.spread((bookInfo, bookPreview, recommend, comment, commentCount) => {
          let bookList = []
          let bookVideo = {}
          this.bookInfo = bookInfo.data.data
          this.recommend = recommend.data.data
          this.comment = comment.data.data
          for (let i = 0; i < bookPreview.data.data.length; i++) {
            if (bookPreview.data.data[i].resourceType === 'PREVIEW_IMG') {
              bookPreview.data.data[i].src = bookPreview.data.data[i].ossUrl
              bookList.push(bookPreview.data.data[i])
            } else {
              bookVideo = bookPreview.data.data[i]
            }
          }
          this.bookList = bookList
          this.bookVideo = bookVideo
          this.commentCount = commentCount.data.data.commentCount
          this.$vux.loading.hide()
          this.setTitle()
          if (this.uid) {
            this.getUserInfo()
          }
        })).catch((error) => {
          this.$vux.loading.hide()
          console.log(error)
        })
    },
    logIndexChange (arg) {
      console.log(arg)
    },
    imgPreview (index) {
      this.$refs.previewer.show(index)
    },
    play () {
      let elVideo = document.getElementById('el_video')
      elVideo.pause()
      setTimeout(function () {
        elVideo.play()
      }, 150)
    },
    playAudio (e) {
      let Audio = e.target.getElementsByTagName('audio')[0]
      Audio.pause()
      setTimeout(() => {
        Audio.play()
      }, 150)
    },
    dateFormat (date) {
      return dateFormat(date, 'YYYY.MM.DD')
    },
    setTitle () {
      if (this.bookInfo) {
        document.title = this.bookInfo.bookName
      }
    }
  }
}
</script>

<style lang="less" scoped>
#details{
  background-color: #ffffff;
  overflow-x: hidden;
  padding-bottom: 96px;
}
.el-details-content{
  padding: 32px 32px 0 32px;
}
.el-book-info{
  padding: 20px 0 48px;
  display: flex;
  img{
    display: block;
    height: 340px;
    border-radius: 8px;
    margin-right: 28px;
    box-shadow: 0 0 20px #a5a5a7;
    flex: 1;
  }
  .el-book-r{
    flex: auto;
    .el-book-name{
      color: #555;
      font-size: 36px;
      margin-bottom: 10px;
      font-weight: bold;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .el-book-tags{
      font-size: 20px;
      color: #bbb;
      height: 48px;
      overflow: hidden;
      -webkit-line-clamp: 1;
      margin-top:10px;
      padding-bottom: 10px;
      span{
        display: inline-block;
        padding: 3px 10px;
        border:1px solid #bbb;/* no*/
        border-radius: 6px;
        margin-right: 10px;
        margin-bottom: 200px;
      }
    }
    .el-rater{
      font-size: 24px;
      color: #666;
      .el-score{
        font-size: 26px;
        color: #555;
      }
    }
    .el-press{
      font-size: 26px;
      color: #575757;
      line-height: 40px;
    }
    .el-bookPrice{
      font-size:36px;
      color:#F5A624;
      margin-bottom: 10px;
      span{
        font-size: 24px;
        color: #666;
      }
    }
    .el-market-price{
      color: #999;
      font-size: 24px;
      margin-bottom: 10px;
      .el-vip-free{
        color: #40d8b0;
        img{
          height: 32px;
          display: inline-block;
        }
      }
    }
    .el-vip{
      font-size: 24px;
      color: #666;
      span{
        color: #40d8b1;
      }
      a{
        float: right;
        color: #a5bfff;
      }
    }
  }
}
.el-read-mode{
  padding-top: 50px;
  .el-show-more{
    img{
      height: 32px;
      margin-right: 10px;
    }
  }
  .el-mode-content{
    display: flex;
    padding-top: 42px;
    padding-bottom: 36px;
    .el-mode-item{
      text-align: center;
      font-size: 24px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        height: 36px;
        margin-right: 5px;
      }
    }
  }
}
.el-book-introduction{
  padding-top: 30px;
  p{
    font-size: 26px;
    color: #444;
    line-height: 42px;
    padding-top: 36px;
  }
  .el-silde-up{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .el-slide-btn{
    text-align: center;
    font-size: 42px;
    i{
      font-size: 36px;
    }
  }
}
.el-book-preview{
  padding-top: 30px;
  .el-preview-content{
    height: 180px;
    padding: 40px 0;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    .el-video{
      height: 180px;
      width: 320px;
      border-radius: 10px;
      margin-right: 20px;
      background-color: #000;
      overflow: hidden;
      flex: none;
      position: relative;
      .el-play-btn{
        height: 80px;
        width: 80px;
        background-color: rgba(255,255,255,0.8);
        border-radius: 50%;
        font-size: 22px;
        text-align: center;
        line-height: 80px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        z-index: 50;
        i{
          font-size: 42px;
        }
      }
    }
    img{
      height: 180px;
      border-radius: 10px;
      margin-right: 20px;
    }
    #el_video{
      width: 100%;
      height: 180px;
      width: 320px;
    }
  }
}
.el-book-recommend{
  padding: 30px 0 26px 0;
  .el-style3-content{
    overflow-y: hidden;
    overflow-x: auto;
    display: flex;
    padding-left: 24px;
    margin-left: -24px;
    padding-top: 24px;
    .el-style3-content-item{
      display: flex;
      flex-direction: column;
      margin-right: 16px;
      img{
        height: 260px;
        display: block;
        border-radius: 8px;
      }
      p{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: #434343;
        font-size: 28px;
      }
    }
  }
}
.el-book-comment{
  padding: 30px 0 0 32px;
  .el-comment-content{
    &>div:last-child{
      padding-bottom: 0;
      &>div::after{
        content: none;
      }
    }
    .el-comment-item{
      padding: 32px 0 50px 0;
      display: flex;
      img{
        display: block;
        height: 60px;
        width: 60px;
        border-radius: 50%;
        margin-right: 20px;
        flex: none;
      }
      .el-comment-info{
        flex: 1;
        font-size: 24px;
        padding-right: 32px;
        .el-user-name{
          color: #888;
          font-size: 24px;
          margin-bottom: 15px;
        }
        .el-date{
          color: #888;
          font-size: 20px;
          margin-bottom: 32px;
        }
        p{
          margin-top: 28px;
          word-break:break-all;
          margin-bottom: 50px;
        }
        .el-comment-voice{
          background-color: #40d8b0;
          height: 52px;
          width: 220px;
          margin-top: 28px;
          margin-bottom: 50px;
          border-top-right-radius: 50px;
          border-bottom-left-radius: 50px;
          border-bottom-right-radius: 50px;
          color:#fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          i{
            color:#fff;
            font-size: 36px;
            line-height: 52px;
          }
          audio{
            display: none;
          }
          span{
            margin-right: 10px;
          }
        }
      }
    }
  }
}
.el-more-comment{
  color:#40d8b0;
  font-size: 28px;
  text-align: center;
  line-height: 100px;
  height: 100px;
  display: block;
}
.el-more-info{
  padding: 32px;
  .el-more-content{
    ul{
      list-style: none;
      padding-top: 24px;
      li{
        color: #aaa;
        font-size: 24px;
      }
    }
  }
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
    img{
      height: 56px;
      vertical-align: middle;
      margin-top: -12px;
    }
  }
}
</style>

<template>
  <div id="comments" @scroll="handleScroll">
    <div class="el-book-comment" v-if="comment.length>0">
      <div class="el-comment-content">
        <div class="el-comment-item" v-for="(item, index) in comment" :key="index">
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
    <load-more v-show="isRequest" :tip="'正在加载更多数据...'"></load-more>
  </div>
</template>

<script>
import { dateFormat } from 'vux'
import LoadMore from '../components/LoadMore'
import Rater from '../components/Rater'
export default {
  data () {
    return {
      comment: [],
      pageSize: 15,
      pageIndex: 0,
      isRequest: false,
      defaultAvatar: require('../../static/img/user.png'),
      isEnd: false
    }
  },
  computed: {
  },
  created () {
  },
  activated () {
    this.getComments()
  },
  beforeRouteLeave (to, from, next) {
    this.resetData()
    window.removeEventListener('scroll', this.getPageData)
    next()
  },
  components: {
    Rater,
    LoadMore
  },
  mounted () {
  },
  methods: {
    resetData () {
      this.pageIndex = 0
      this.isRequest = false
      this.comment = []
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
          this.getComments()
        }
      }
    },
    getComments () {
      this.showLoading()
      this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listBookComment',
        content: JSON.stringify({
          bookCode: this.$route.params.bookCode,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
      })).then((response) => {
        setTimeout(() => {
          this.hideLoading()
          if (this.$route.params.bookCode) {
            if (response.data.status === '1') {
              this.comment = this.comment.concat(response.data.data)
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
          }
        }, 1000)
      }).catch(function (error) {
        this.hideLoading()
        console.log(error)
      })
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
    }
  }
}
</script>

<style lang="less" scoped>
#comments{
  background-color: #ffffff;
  overflow-x: hidden;
  height: 100%;
  overflow-y: auto;
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
</style>

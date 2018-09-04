<template>
  <div id="home">
    <div class="el-fake-search" @click="toSearch">
      <div class="el-fake-input">
        <i class="weui-icon-search"></i>
        <span>搜索绘本</span>
      </div>
    </div>
    <swiper :aspect-ratio="160/375" dots-position="center" loop auto v-if="bannerList.length>0">
      <swiper-item class="el-swiper" v-for="(item, index) in bannerList" :key="index" >
        <img :src="item.bannerImageUrl" @click="toTargetPage(item)">
      </swiper-item>
    </swiper>
    <div class="el-listSubject" v-if="listSubject.length>0">
      <a class="el-listSubject-item" href="#/bookSort">
        <img :src="listSubject[0].bgImageUpUrl" alt="">
        <p>全部分类</p>
      </a>
      <a class="el-listSubject-item" v-for="(item, index) in listSubject.slice(1)" :key="index" :href="'#/bookListColumn/'+item.subjectCode">
        <img :src="item.bgImageUpUrl" alt="">
        <p>{{item.subjectTitle}}</p>
      </a>
    </div>
    <div v-for="(partItem, index) in listAllPart" :key="index" v-if="listAllPart.length>0">
      <a v-if="partItem.partStyle === 'DAILY_BOOK'" :href="partItem.dailyList[0].targetPage" class="el-block-daily" style="display:none">
        <div class="el-block-header">
          <h3>{{partItem.partTitle}}</h3>
          <a href="#/dailyBook" class="el-show-more">
            <span>更多</span> <i class="iconfont icon-small-arrow-right"></i>
          </a>
        </div>
        <p>{{partItem.dailyList[0].dailyTitle}}</p>
        <img :src="partItem.dailyList[0].dailyImg" alt="">
      </a>
      <div v-else-if="partItem.partStyle === 'IMAGE_TEXT'" class="el-block-style1">
        <div class="el-block-header">
          <h3>{{partItem.partTitle}}</h3>
          <a :href="'#/bookListColumn/'+partItem.partCode" class="el-show-more">
            <span>更多</span> <i class="iconfont icon-small-arrow-right"></i>
          </a>
        </div>
        <div class="el-style1-content">
          <a v-for="(item, index) in partItem.bookList" :key="index" :href="'#/details/'+item.bookCode" class="el-style1-content-item" >
            <img :src="item.ebBookResource[0].ossUrl" alt="">
            <div class="el-style1-book">
              <div class="el-book-name">{{item.bookName}}</div>
              <p>{{item.bookIntroduction}}</p>
              <div class="el-check-detail">查看详情</div>
            </div>
          </a>
        </div>
      </div>
      <div v-else-if="partItem.partStyle === 'SLIDE_PORTRAIT'" class="el-block-style2">
        <div class="el-block-header">
          <h3>{{partItem.partTitle}}</h3>
          <a :href="'#/bookListRow/'+partItem.partCode" class="el-show-more">
            <span>更多</span> <i class="iconfont icon-small-arrow-right"></i>
          </a>
        </div>
        <div class="el-style2-content">
          <a v-for="(item, index) in partItem.bookList" :key="index" :href="'#/details/'+item.bookCode" class="el-style2-content-item" >
            <img v-lazy="item.ebBookResource[0].ossUrl" alt="">
            <p>{{item.bookName}}</p>
          </a>
        </div>
      </div>
      <div v-else-if="partItem.partStyle === 'AD_SINGLE'" class="el-block-ad" @click="toPackage(partItem)">
        <img v-lazy="partItem.adBanner.bannerImageUrl" alt="">
      </div>
      <div v-else class="el-block-style3">
        <div class="el-block-header">
          <h3>{{partItem.partTitle}}</h3>
          <a :href="'#/bookListRow/'+partItem.partCode" class="el-show-more">
            <span>更多</span> <i class="iconfont icon-small-arrow-right"></i>
          </a>
        </div>
        <div class="el-style3-content">
          <a v-for="(item, index) in partItem.bookList" :key="index" :href="'#/details/'+item.bookCode" class="el-style3-content-item" >
            <img v-lazy="item.ebBookResource[0].ossUrl" alt="">
            <p>{{item.bookName}}</p>
          </a>
        </div>
      </div>
    </div>
    <div v-if="guess.length>0" class="el-block-style2">
      <div class="el-block-header">
        <h3>猜你喜欢</h3>
        <a href="#/guessList" class="el-show-more">
          <span>更多</span> <i class="iconfont icon-small-arrow-right"></i>
        </a>
      </div>
      <div class="el-style2-content">
        <a v-for="(item, index) in guess" :key="index" :href="'#/details/'+item.bookCode" class="el-style2-content-item" >
          <img v-lazy="item.ebBookResource[0].ossUrl" alt="">
          <p>{{item.bookName}}</p>
        </a>
      </div>
    </div>
    <not-found v-if="error" :prompt="'出错了'"></not-found>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Swiper, SwiperItem } from 'vux'
import NotFound from '../components/NotFound'
import LoadMore from '../components/LoadMore'
import BookList from '../components/BookList'
export default {
  data () {
    return {
      error: false,
      bannerList: [],
      listSubject: [],
      listAllPart: [],
      guess: []
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  created () {
    // console.log(2)
  },
  activated () {
    this.$vux.loading.show()
    this.$axios.all([this.getBanner(), this.getSubject(), this.getAllPart(), this.listRecommendBookSelection()])
      .then(this.$axios.spread((banner, subject, allPart, guess) => {
        if (banner.data.status === '1') {
          this.bannerList = banner.data.data
          this.listSubject = subject.data.data
          this.listAllPart = allPart.data.data
          this.guess = guess.data.data
        } else {
          this.$vux.toast.show({
            text: banner.data.message
          })
        }
        this.$vux.loading.hide()
      })).catch((error) => {
        console.log(error)
        this.error = true
        this.$vux.loading.hide()
      })
  },
  components: {
    Swiper,
    SwiperItem,
    NotFound,
    LoadMore,
    BookList
  },
  methods: {
    toSearch (e) {
      this.$router.push('../search')
    },
    getBanner () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listBanner'
      }))
    },
    getSubject () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listSubject'
      }))
    },
    getAllPart () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listAllPart'
      }))
    },
    listRecommendBookSelection () {
      return this.$axios.post('', this.$QS.SF({
        method: 'ella.book.listRecommendBookSelection',
        content: JSON.stringify({
          uid: this.uid || '',
          channelCode: '',
          pageSize: 15,
          pageIndex: 0
        })
      }))
    },
    toPackage (item) {
      this.$router.push('../packageBook/' + this.getQueryString(item.adBanner.targetPage, 'packageCode'))
    },
    toTargetPage (item) {
      if (item.targetType === 'H5') {
        if (item.bannerDesc === '签到送书') {
          window.location = item.targetPage + '&uid=' + this.uid + '&token=' + this.token
        } else {
          window.location = item.targetPage
        }
      } else if (item.targetType === 'BOOK_PACKAGE_DETAIL') {
        this.$router.push('../packageBook/' + this.getQueryString(item.targetPage, 'packageCode'))
      } else if (item.targetType === 'SYSTEM_INTERFACE') {
        this.$router.push('../' + item.targetPage.split('//')[1])
      } else if (item.targetType === 'BOOK_LIST') {
        this.$router.push('../bookListColumn/' + this.getQueryString(item.targetPage, 'sourceCode'))
      }
    },
    getQueryString (url, name) {
      let theRequest = {}
      if (url.indexOf('?') !== -1) {
        let str = url.split('?')[1]
        let strs = str.split('&')
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }
      return theRequest[name]
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/bookList.less');
@icon-gray:#999;
#home{
  padding-top: 90px;
  padding-bottom: 90px;
  background-color: #f6f8fa;
}
.el-fake-search{
  height: 50px;
  width: 100%;
  background-color: #fdfdfd;
  padding-top: 20px;
  padding-bottom: 20px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 500;
  box-shadow: 0 2px 5px rgba(76, 76, 76, 0.12);
  .el-fake-input{
    height: 50px;
    width: 88%;
    background-color: #f2f4f6;
    color: #888;
    text-align: center;
    vertical-align: middle;
    font-size: 22px;
    line-height: 50px;
    margin: 0 auto;
    border-radius: 50px;
  }
  .weui-icon-search {
    font-size: 22px;
  }
}
.el-swiper{
  width: 100%;
  img{
    display: block;
    width: 100%;
  }
}
.el-listSubject{
  padding: 20px 0 32px;
  display: flex;
  background-color: #fff;
  margin-bottom: 20px;
  .el-listSubject-item{
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    img{
      display: block;
      height: 88px;
    }
    p{
      font-size: 28px;
      color: #444;
      margin-top: 16px;
    }
  }
}
.el-block-daily{
  background-color: #fff;
  padding: 32px 24px;
  display: block;
  p{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: 28px;
    color: #444;
    line-height: 48px;
    margin: 32px 0;
  }
  img{
    display: block;
    border-radius: 6px;
    width: 100%;
  }
}
.el-block-header{
  display: flex;
  align-items: center;
  .el-show-more{
    display: inherit;
    i{
      margin-top: 5px;
    }
    span,i{
    color: @icon-gray;
    font-size: 26px;
  }
  }
  h3{
    flex: 1;
    font-size: 36px;
    color: #333;
  }
}
.el-block-style1{
  padding: 32px 24px 0;
  .el-style1-content{
    overflow-y: hidden;
    overflow-x: auto;
    display: flex;
    margin-left: -24px;
    padding: 24px 0 32px 24px;
    .el-style1-content-item{
      overflow: hidden;
      display: flex;
      padding: 32px;
      background: #fff;
      border-radius: 8px;
      width: 75%;
      margin-right: 32px;
      flex: none;
      box-shadow: 0 3px 10px #d5d8d7;
      img{
        height: 256px;
        display: block;
        border-radius: 8px;
        margin-right: 16px;
      }
      .el-style1-book{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        flex-direction: column;
        .el-book-name{
          font-weight: bold;
          font-size: 32px;
          color: #333;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        p{
          font-size: 24px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          color: #838383;
        }
        .el-check-detail{
          color: #40d8b1;
          border: 1px solid #40d8b1;/* no*/
          padding: 10px 16px;
          border-radius: 28px;
          text-align: center;
          align-self: flex-end;
          font-size: 24px;
        }
      }
    }
  }
}
.el-block-style3{
  padding: 32px 24px;
  background-color: #fff;
  margin-bottom: 20px;
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
      width: 216px;
      flex: none;
      img{
        height: 300px;
        width: 216px;
        display: block;
        border-radius: 8px;
      }
      p{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        color: #434343;
        font-size: 28px;
      }
    }
  }
}
.el-block-ad{
  margin-bottom: 20px;
  padding: 0 24px;
  img{
    display: block;
    width: 100%;
  }
}
</style>

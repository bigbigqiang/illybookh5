<template>
  <div id="feedback">
    <div class="el-feedback-content">
      <div class="el-textarea-content">
        <textarea class="el-input" placeholder="请描述反馈的问题" maxlength=320 v-model="feedbackInfo"></textarea>
        <span>{{feedbackInfo.length}}/{{num}}</span>
      </div>
      <div class="el-input-content">
        <input class="el-input" type="text" placeholder="联系方式：手机/微信/QQ/邮箱" v-model="contactWay">
      </div>
      <div class="el-photo-content">
        <div class="el-imgs" v-for="(item, index) in imgs" :key="index" v-if="imgs.length>0">
          <img :src="item" alt="">
          <span @click="deletImg(index)"><i class="icon iconfont icon-close"></i></span>
        </div>
        <div class="el-upload" v-if="imgs.length<3">
          <div class="el-upload-img">添加照片</div>
          <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="fileImage">
        </div>
      </div>
      <div class="el-submit-btn" @click="addFeedback">提交</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Axios from 'axios'
export default {
  data () {
    return {
      userInfo: {},
      num: 320,
      feedbackInfo: '',
      contactWay: '',
      imgs: []
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  activated () {
  },
  components: {
  },
  methods: {
    fileImage (e) {
      let file = e.target.files[0]
      let param = new FormData()
      param.append('pictureStream', file)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      Axios.post('http://api.ellabook.cn/rest/upload/avatar', param, config)
        .then(response => {
          this.imgs.push(response.data.data)
        }).catch((error) => {
          console.log(error)
          this.$vux.toast.show({
            text: '上传图片出错了~'
          })
        })
    },
    deletImg (index) {
      this.imgs.splice(index, 1)
    },
    addFeedback () {
      this.$vux.loading.show()
      this.$axios.post('', this.$QS.SF({
        method: 'ella.user.addFeedback',
        content: JSON.stringify({
          uid: this.uid || '',
          contactWay: this.contactWay,
          feedbackInfo: this.feedbackInfo,
          images: this.imgs,
          channelCode: 'H5',
          clientVersion: '2.1.0'
        })
      })).then((response) => {
        this.$vux.loading.hide()
        if (response.data.status === '1') {
          this.$router.push('index/mine')
          this.$vux.toast.show({
            text: '提交成功，感谢您的反馈~'
          })
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
</script>

<style lang="less" scoped>
#feedback{
  background-color: #fff;
  min-height: 100%;
  .el-input::-webkit-input-placeholder{
      color:#d8d8d8;
  }
  .el-input:-moz-placeholder{
      color:#d8d8d8;
  }
  .el-input::-moz-placeholder{
      color:#d8d8d8;
  }
  .el-input:-ms-input-placeholder{
      color:#d8d8d8;
  }
  .el-feedback-content{
    padding: 40px 56px;
    .el-textarea-content{
      text-align: right;
      margin-bottom: 46px;
      textarea{
        display: block;
        width: 100%;
        height: 300px;
        border:none;
        outline: none;
        font-size: 32px;
        color: #333;
      }
      span{
        font-size: 32px;
        color: #aaa;
        display: block;
      }
    }
    .el-input-content{
      margin-bottom: 38px;
      border-bottom: 1px solid #efedec;/* no*/
      input{
        display: block;
        width: 100%;
        font-size: 32px;
        height: 56px;
        line-height: 56px;
        border: none;
        outline: none;
      }
    }
    .el-photo-content{
      display: flex;
      margin-bottom: 100px;
      .el-imgs{
        height: 140px;
        width: 140px;
        margin-right: 40px;
        position: relative;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
        span{
          position: absolute;
          right: -15px;
          top: -15px;
          display: block;
          height: 30px;
          width: 30px;
          background-color: rgba(0, 0, 0, 0.7);
          font-size: 24px;
          line-height: 30px;
          border-radius: 50%;
          text-align: center;
          i{
            color: #fff;
          }
        }
      }
      .el-upload{
        height: 140px;
        width: 140px;
        background-color: #f6f6f6;
        color: #aaa;
        position: relative;
        .el-upload-img{
          height: 100%;
          width: 100%;
          line-height: 140px;
          font-size: 24px;
          text-align: center;
        }
        &>input{
          display: block;
          height: 100%;
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
        }
      }
    }
    .el-submit-btn{
      height: 96px;
      background-color: #40d8b1;
      border-radius: 96px;
      width: 100%;
      font-size: 36px;
      color:#fff;
      text-align: center;
      line-height: 96px;
      margin-bottom: 50px;
    }
  }
}
</style>

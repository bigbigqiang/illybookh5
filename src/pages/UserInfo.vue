<template>
  <div id="userInfo">
    <div class="el-group">
      <div class="el-menu-item" >
        <div class="el-left">头像</div>
        <div class="el-cell vux-1px-b">
          <div style="flex:1"></div>
          <div class="el-upload-avatar">
            <img :src="userAvatar" alt="">
            <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="fileImage">
          </div>
          <i class="iconfont icon-small-arrow-right el-cell-avatar"></i>
        </div>
      </div>
      <div class="el-menu-item" >
        <div class="el-left">昵称</div>
        <div class="el-cell vux-1px-b">
          <input class="el-form-value" type="text" placeholder="未填写" v-model.trim="userNick">
        </div>
      </div>
      <div class="el-menu-item" >
        <div class="el-left">个人签名</div>
        <div class="el-cell vux-1px-b">
          <input class="el-form-value" type="text" placeholder="未填写" v-model.trim="sign">
        </div>
      </div>
    </div>
    <div class="el-group">
      <div class="el-menu-item" >
        <div class="el-left">性别</div>
        <div class="el-cell vux-1px-b">
          <div class="el-form-value" @click="sexShow=!sexShow">{{gender}}</div>
        </div>
      </div>
      <div class="el-menu-item" >
        <div class="el-left">生日</div>
        <div class="el-cell vux-1px-b">
          <datetime v-model="birthday" :min-year="1928" :max-year="2019" class="el-datetime"></datetime>
        </div>
      </div>
      <div class="el-menu-item" >
        <div class="el-left">地区</div>
        <div class="el-cell vux-1px-b">
          <div class="el-address">
            {{address}}
            <x-address v-model="Xaddress" class="el-datetime el-address-select" :title="''" :hide-district="true" :list="addressData" :show.sync="showAddress" placeholder="未选择"></x-address>
          </div>
        </div>
      </div>
    </div>
    <div class="el-group">
      <div class="el-menu-item" >
        <div class="el-left" @click="show5 = !show5">学历</div>
        <div class="el-cell vux-1px-b">
          <div class="el-form-value" @click="educationShow=!educationShow">{{education || '本科'}}</div>
        </div>
      </div>
      <div class="el-menu-item" >
        <div class="el-left">行业</div>
        <div class="el-cell vux-1px-b">
          <input class="el-form-value" type="text" placeholder="未填写" v-model.trim="industry">
        </div>
      </div>
      <div class="el-menu-item" >
        <div class="el-left">职业</div>
        <div class="el-cell vux-1px-b">
          <input class="el-form-value" type="text" placeholder="未填写" v-model.trim="profession">
        </div>
      </div>
    </div>
    <actionsheet v-model="sexShow" :menus="sex" show-cancel @on-click-menu="chooseGender"></actionsheet>
    <actionsheet v-model="educationShow" :menus="educationMenu" show-cancel @on-click-menu="chooseEducation"></actionsheet>
    <div class="el-userInfo-submit" @click="submit">保存</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Axios from 'axios'
import { Datetime, Actionsheet, dateFormat, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'
export default {
  data () {
    return {
      defaultAvatar: require('../../static/img/user.png'),
      userInfo: {},
      show5: true,
      birthday: '',
      userNick: '',
      sign: '',
      userAvatar: require('../../static/img/user.png'),
      gender: '',
      sex: {
        menu1: '男',
        menu2: '女'
      },
      education: '',
      educationMenu: {
        menu1: '高中及以下',
        menu2: '专科',
        menu3: '本科',
        menu4: '研究生及以上'
      },
      educationShow: false,
      sexShow: false,
      address: '',
      Xaddress: [],
      showAddress: false,
      addressData: ChinaAddressV4Data,
      profession: '',
      industry: '',
      educations: {
        UNDERGRADUATE: '本科',
        SENIOR: '高中及以下',
        JUNIOR: '专科',
        GRADUATE: '研究生及以上'
      }
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token
    })
  },
  watch: {
    Xaddress (newValue, oldValue) {
      this.address = value2name(newValue, ChinaAddressV4Data).replace(/\s+/g, '')
    }
  },
  activated () {
    this.getInfo()
  },
  components: {
    Datetime,
    Actionsheet,
    XAddress
  },
  methods: {
    getInfo () {
      this.$vux.loading.show()
      this.$axios.post('', this.$QS.SF({
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
          this.birthday = response.data.data.userInfo.birthday || this.dateFormat(new Date().getTime())
          this.userNick = response.data.data.userInfo.userNick
          this.sign = response.data.data.userInfo.sign
          this.userAvatar = response.data.data.userInfo.userAvatar
          this.gender = response.data.data.userInfo.gender === 'MALE' ? '男' : '女'
          this.education = this.educations[response.data.data.userInfo.education]
          this.address = response.data.data.userInfo.address
          this.profession = response.data.data.userInfo.profession
          this.industry = response.data.data.userInfo.industry
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
    fileImage (e) {
      let file = e.target.files[0]
      let param = new FormData()
      param.append('pictureStream', file)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      Axios.post('http://api.ellabook.cn/rest/upload/avatar', param, config)
        .then(response => {
          this.userAvatar = response.data.data
        }).catch((error) => {
          console.log(error)
          this.$vux.toast.show({
            text: '上传图片出错了~'
          })
        })
    },
    chooseGender (item) {
      if (item !== 'cancel') {
        item && (this.gender = this.sex[item])
      }
    },
    chooseEducation (item) {
      console.log(item)
      if (item !== 'cancel') {
        item && (this.education = this.educationMenu[item])
      }
    },
    getEducation (education) {
      for (let key in this.educations) {
        if (this.educations[key] === education) {
          return key
        }
      }
    },
    dateFormat (date) {
      return dateFormat(date, 'YYYY-MM-DD')
    },
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
    submit () {
      if (!this.userNick) {
        this.$vux.toast.show({
          text: '昵称不能为空'
        })
        return
      }
      this.$vux.loading.show()
      this.$axios.post('', this.$QS.SF({
        method: 'ella.user.saveUser',
        content: JSON.stringify({
          uid: this.uid,
          userNick: this.userNick,
          userAvatar: this.userAvatar,
          sign: this.sign,
          gender: this.gender === '男' ? 'MALE' : 'FEMALE',
          birthday: this.birthday,
          profession: this.profession,
          education: this.getEducation(this.education),
          industry: this.industry,
          address: this.address
        })
      })).then((response) => {
        this.$vux.loading.hide()
        if (response.data.status === '1') {
          this.$router.push('./index/mine')
          this.$vux.toast.show({
            text: '修改信息成功'
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
@import url('../assets/style/cell.less');
#userInfo{
  background: #f6f8fa;
  padding-top: 20px;
  padding-bottom: 50px;
  .el-group{
    padding-bottom: 20px;
    padding-left: 0;
    background-color: #f6f8fa;
    &>div:last-child .el-cell::after{
      content: none;
    }
    .el-menu-item{
      background-color: #fff;
      .el-left{
        font-size: 32px;
        color: #444;
        margin-left: 32px;
        margin-right: 10px;
      }
      .el-cell{
        padding: 20px 30px 20px 0 !important;
        .el-cell-avatar{
          line-height: 80px;
        }
        .el-form-value{
          font-size: 32px;
          color: #aaa;
          height: 80px;
          line-height: 80px;
          text-align: right;
          margin-left: auto;
          min-width: 30%;
        }
        .el-upload-avatar{
          width: 80px;
          height: 80px;
          align-self:flex-end;
          position: relative;
          img{
            display: block;
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
          input{
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            display: block;
            width: 80px;
            height: 80px;
          }
        }
        .el-address{
          height: 80px;
          line-height: 80px;
          font-size: 32px;
          color: #aaa;
          margin-left: auto;
          text-align: right;
          position: relative;
          .el-address-select{
            opacity: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        &>input{
          display: block;
          height: 80px;
          width: 100%;
          border: none;
          outline: none;
          text-align: right;
          font-size: 32px;
          line-height: 80px;
          color: #aaa;
        }
      }
    }
  }
}
.el-datetime{
  height: 80px;
  line-height: 80px;
  font-size: 32px;
  color: #aaa;
  margin-left: auto;
  padding: 0 !important;
}
.el-userInfo-submit{
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
</style>

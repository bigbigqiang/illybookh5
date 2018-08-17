<template>
  <div id="set">
    <div class="el-group vux-1px-b vux-1px-t">
      <div class="el-menu-item">
        <div class="el-cell vux-1px-b" @click="resetPassword">
          <div class="el-cell-title">重置密码</div>
          <i class="iconfont icon-small-arrow-right"></i>
        </div>
      </div>
    </div>
    <div class="el-quit" @click="quit">退出账号</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      phone: ''
    }
  },
  created () {
    // console.log(2)
  },
  activated () {
    if (this.$route.query.phone) {
      this.phone = this.$route.query.phone
    }
  },
  components: {
  },
  methods: {
    resetPassword () {
      this.$router.push({path: 'resetPassword', query: {phone: this.phone}})
    },
    quit () {
      window.localStorage.removeItem('uid')
      window.localStorage.removeItem('token')
      this.$store.commit('updateUid', {uid: null})
      this.$store.commit('updateToken', {token: null})
      this.$router.push('index/mine')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/cell.less');
#set{
  padding-top: 20px;
}
.el-quit{
  text-align: center;
  color: #f00;
  background-color: #fff;
  padding: 20px 0;
  margin-top: 50px;
  font-size: 32px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>

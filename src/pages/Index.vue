<template>
  <div id="index">
     <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
      <keep-alive>
        <router-view class="router-view" ></router-view>
      </keep-alive>
    </transition>
    <tabbar>
      <tabbar-item link="/index/home" :selected="index === 0">
        <img slot="icon" src="../../static/img/tab_icon_home_default@2x.png">
        <img slot="icon-active" src="../../static/img/tab_icon_home_selected@2x.png">
        <span slot="label">精选</span>
      </tabbar-item>
      <tabbar-item link="/index/study" :selected="index === 1">
        <img slot="icon" src="../../static/img/tab_icon_study_default@2x.png">
        <img slot="icon-active" src="../../static/img/tab_icon_study_selected@2x.png">
        <span slot="label">书房</span>
      </tabbar-item>
      <tabbar-item link="/index/mine" :selected="index === 2">
        <img slot="icon" src="../../static/img/tab_icon_mine_default@2x.png">
        <img slot="icon-active" src="../../static/img/tab_icon_mine_selected@2x.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
import { mapState } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      index: 0,
      router: ['home', 'study', 'mine']
    }
  },
  components: {
    Tabbar,
    TabbarItem
  },
  computed: {
    ...mapState({
      direction: state => state.vux.direction
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.router.map((item, index) => {
      if (to.path.indexOf(item) !== -1) {
        this.index = index
      }
    })
    next()
  },
  activated () {
    this.router.map((item, index) => {
      if (this.$route.path.indexOf(item) !== -1) {
        this.index = index
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="less">
#index{
  height: 100%;
}
.weui-tabbar{
  background-color: #fdfdfd !important;
  position: fixed !important;
}
.weui-bar__item_on .weui-tabbar__label{
  color: #40d8b0 !important;
}
.weui-tabbar__label{
  color: #a6b6b6 !important;
}
.vux-loading-no-text .weui-toast{
  min-height: 30px;
  height: 160px;
  width: 160px;
  line-height: 160px;
  top:35%;
}
.weui-icon_toast.weui-loading{
  margin: 0;
  height: 50px;
  width: 50px;
}
.weui-tabbar__item{
    padding: 12px 0 0;
    .weui-tabbar__icon {
      width: 44px;
      height: 44px;
    }
    .weui-tabbar__label{
        font-size: 24px;
    }
}
</style>

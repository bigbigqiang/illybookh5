<template>
<div class="parents-confirm">
  <transition name="custom-classes-transition"
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown">
      <div class="el-parents-confirm" v-show="checkOpen">
        <i class="icon iconfont icon-close" @click="$emit('listenCheckOpen', false)"></i>
        <p class="el-parents-header">父母确认</p>
        <p class="el-parents-text">请按顺序输入下列数字</p>
        <div class="el-parents-block">
          <div class="el-chinese-num">
            <div class="el-num-item" v-for="(item, index) in chineseNums" :key="index" :class="{active: index < checkIndex}">{{item.text}}</div>
          </div>
          <div class="el-num">
            <div class="el-num-item" v-for="(item, index) in num" :key="index" @click="check(index)">{{item.value}}</div>
          </div>
        </div>
      </div>
    </transition>
</div>
</template>

<script>
export default {
  data () {
    return {
      checkIndex: 0,
      checked: false,
      num: [
        {
          text: '壹',
          value: 1
        },
        {
          text: '贰',
          value: 2
        },
        {
          text: '叁',
          value: 3
        },
        {
          text: '肆',
          value: 4
        },
        {
          text: '伍',
          value: 5
        },
        {
          text: '陆',
          value: 6
        },
        {
          text: '柒',
          value: 7
        },
        {
          text: '捌',
          value: 8
        },
        {
          text: '玖',
          value: 9
        }
      ],
      chineseNums: []
    }
  },
  props: [
    'checkOpen'
  ],
  watch: {
    checkOpen: function (val, oldVal) {
      if (val) {
        this.renderChineseNum()
      }
    }
  },
  components: {
  },
  mounted () {
    this.renderChineseNum()
  },
  methods: {
    check (index) {
      if (this.num[index] === this.chineseNums[this.checkIndex]) {
        this.checkIndex++
        if (this.checkIndex === 3) {
          this.$emit('listenParentChecked', true)
          this.$emit('listenCheckOpen', false)
        }
      } else {
        this.$emit('listenParentChecked', false)
        this.renderChineseNum()
      }
    },
    checkFirst () {
      this.renderChineseNum()
    },
    renderChineseNum () {
      this.checkIndex = 0
      this.checked = false
      let chineseNums = []
      for (let i = 0; i < 3; i++) {
        chineseNums.push(this.num[Math.round(Math.random() * 8)])
      }
      this.chineseNums = chineseNums
    }
  }
}
</script>
<style lang="less" scoped>
.el-parents-confirm{
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(222,222,222,0.96);
  width: 100%;
  height: 100%;
  font-size: 36px;
  text-align: center;
  z-index: 1000;
  &>i{
    color: #40d8b1;
    font-size: 56px;
    position: absolute;
    left: 32px;
    top: 32px;
  }
  .el-parents-header{
    padding-top: 100px;
    padding-bottom: 8px;
    color: #333;
    font-size: 40px;
    font-weight: bold;
  }
  .el-parents-text{
    color: #444;
    margin-bottom: 56px;
  }
  .el-parents-block{
    width: 496px;
    margin: 0 auto;
    .el-chinese-num{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 32px;
      .el-num-item{
        height: 144px;
        width: 144px;
        background-color: #fff;
        border-radius: 6px;
        line-height: 144px;
        font-size: 64px;
        color: #c9dcd8;
      }
      .active{
        color: #40d8b1;
      }
    }
    .el-num{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .el-num-item{
        height: 144px;
        width: 144px;
        background-color: #40d8b1;
        border-radius: 6px;
        line-height: 144px;
        font-size: 72px;
        color: #fff;
        margin-bottom: 32px;
      }
    }
  }
}
</style>

<template>
  <span class="el-cm-rater">
    <i class="icon iconfont icon-collection_fill" v-for="i in fill" :key="i"></i>
    <span class="el-rater-fraction" v-if="fraction>0">
        <i class="icon iconfont icon-collection_fill" :style="{width: fraction+'%'}"></i>
        <i class="icon iconfont icon-collection"></i>
    </span>
    <i class="icon iconfont icon-collection" v-for="(n, k) in hollow" :key="k"></i>
  </span>
</template>

<script>
export default {
  data () {
    return {
      max: 5
    }
  },
  computed: {
    fill () {
      return Math.floor(this.value)
    },
    hollow () {
      if (this.max === Math.floor(this.value)) {
        return 0
      } else {
        return this.max - Math.floor(this.value) - ((this.value - Math.floor(this.value)) ? 1 : 0)
      }
    },
    fraction () {
      return (this.value - Math.floor(this.value)) * 100
    }
  },
  created () {
    // console.log(2)
  },
  activated () {
  },
  components: {
  },
  props: [
    'value'
  ],
  methods: {
  }
}
</script>

<style lang="less" scoped>
.el-cm-rater{
    font-size: 24px;
    .el-rater-fraction{
        position: relative;
        color: #f5a623;
        margin: 0 -5px;
        i{
            font-size: 36px;
        }
        &>i.icon-collection_fill{
            position: absolute;
            width: 69%;
            overflow: hidden;
        }
    }
    &>i{
        color: #f5a623;
        font-size: 36px;
    }
}
</style>

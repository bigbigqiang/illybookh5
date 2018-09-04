<template>
  <div class="not-found">
    <img :src="icon || defaultIcon" alt="">
    <h1>{{prompt || '啊哦~这里什么都没有...'}}</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      defaultIcon: require('../../static/img/pic_norecord@2x.png')
    }
  },
  props: [
    'prompt',
    'icon'
  ]
}
</script>

<style lang="less" scoped>
.not-found{
  padding-top: 20%;
  img{
    width: 80%;
    display: block;
    margin: 0 auto;
  }
  h1{
    color: #d6e0de;
    font-size: 36px;
    text-align: center;
    font-weight: normal;
  }
}
</style>

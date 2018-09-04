<template>
  <div class="not-found">
    <img src="../../static/img/pic_empty@2x.png" alt="">
    <h1>{{prompt}}</h1>
  </div>
</template>

<script>

export default {
  props: [
    'prompt'
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
  }
}
</style>

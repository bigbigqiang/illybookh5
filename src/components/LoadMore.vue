<template>
<div class="load-more">
 <spinner type="ios" :size="'24px'"></spinner>
 <span>{{tip || '正在加载...'}}</span>
</div>
</template>

<script>
import { Spinner } from 'vux'
export default {
  data () {
    return {
    }
  },
  props: [
    'tip'
  ],
  components: {
    Spinner
  }
}
</script>
<style lang="less" scoped>
.load-more{
  font-size: 24px;
  line-height: 24px;
  color: #999;
  text-align: center;
  padding-bottom: 32px;
  span{
    font-size: 20px;
  }
}
</style>

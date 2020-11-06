<template>
  <div class="notice">
    <list></list>
    <!-- <van-tabs type="card" v-model="active" sticky animated swipeable>
      <van-tab title="任务消息">
        <list></list>
      </van-tab>
      <van-tab title="系统消息">
        <list></list>
      </van-tab>
    </van-tabs> -->
  </div>
</template>
<script>
import list from './components/list';
export default {
  data() {
    return {
      active: 0,
    };
  },
  components: {
    list
  },
};
</script>
<style lang="less" scoped>
.notice {
  /deep/.van-sticky {
    background: @white;
    padding: 10px 0;
    .van-tabs__nav--card {
      border-color: @blue;
      margin: 0 15%;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      .van-tab {
        border-color: @blue;
        color: @blue;
        height: 40px;
        line-height: 40px;
      }
    }
    .van-tabs__nav--card .van-tab.van-tab--active {
      background: @blue;
      color: @white;
    }
  }
}
</style>
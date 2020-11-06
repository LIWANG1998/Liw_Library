<template>
  <div class="my-center">
    <div class="head">
      <div class="bg"></div>
      <div class="box">
        <img src="@/assets/images/mycenter-bg.png" class="user-bg" />
        <van-row align="center" type="flex" class="info">
          <van-col span="6">
            <van-image width="68" height="68" round :src="userInfo.avatar" />
          </van-col>
          <van-col span="18">
            <div class="name">{{ userInfo.name }}</div>
            <div class="postion">{{userInfo.position}}</div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div>
      <van-cell-group class="group">
        <van-cell title="任务报表历史" is-link to="/report" center>
          <template #icon>
            <svg-icon icon-class="user2" class="user-icon" />
          </template>
        </van-cell>
        <van-cell title="任务统计" is-link to="/statistics" center>
          <template #icon>
            <svg-icon icon-class="user3" class="user-icon" />
          </template>
        </van-cell>
        <van-cell title="消息通知" is-link to="/notice" center>
          <template #icon>
            <svg-icon icon-class="user4" class="user-icon" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group class="group">
        <van-cell title="关于轻松任务" is-link to="/about" center>
          <template #icon>
            <svg-icon icon-class="user5" class="user-icon" />
          </template>
          <template #default>版本V1.0.1</template>
        </van-cell>
        <van-cell title="联系客服" is-link to="/contact" center>
          <template #icon>
            <svg-icon icon-class="user6" class="user-icon" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: mapGetters(["userInfo"]),
};
</script>
<style lang="less" scoped>
.my-center {
  .head {
    background: @white;
    height: 180px;
    position: relative;
    top: 0;
    .bg {
      position: absolute;
      height: 110px;
      width: 100%;
      overflow: hidden;
      &::after {
        content: "";
        width: 120%;
        height: 110px;
        position: absolute;
        left: -10%; //椭圆左边隐藏10%，右边隐藏10%
        top: 0;
        border-radius: 0 0 50% 50%; //左上角，右上角，右下角，左下角
        background: @wx-blue;
      }
    }
    .box {
      position: relative;
      bottom: -40px;
      z-index: 1;
      border-radius: 10px;
      box-sizing: border-box;
      .info {
        padding: 30px 20px;
        margin: 0 19px;
      }
      .name {
        color: #303133;
        font-size: 18px;
        line-height: 45px;
        z-index: 1;
        position: relative;
      }
      .postion {
        font-size: 12px;
        z-index: 1;
        position: relative;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .user-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
      }
    }
  }
  .group {
    margin-top: 10px;
    .user-icon {
      width: 22px;
      height: 22px;
      margin-right: 9px;
    }
  }
}
</style>

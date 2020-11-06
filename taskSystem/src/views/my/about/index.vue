<template>
  <div class="about">
    <div class="logo">
      <van-image
        width="123"
        height="123"
        :src="logo"
      />
      <div class="sys-name">{{ name }}</div>
    </div>
    <div class="action-box">
      <van-cell title="剩余到期时间">
        <template #default>
          <span>{{ leftTime }}</span>
        </template>
      </van-cell>
      <!-- <van-cell title="功能介绍" is-link to="/updateLog"></van-cell>
      <van-cell title="核心操作流程" is-link to="/course"></van-cell> -->
    </div>
  </div>
</template>
<script>
  let moment = require("moment");
  import { getStore } from "@/utils/store";
export default {
  data() {
    return {
      name: "轻松任务v1.0.1",
      leftTime: "",
      logo:require("@/assets/images/logo.png")
    };
  },
  methods: {
    //时间
    getTime() {
      let time = getStore({
        name: "overdueDay",
      })?.day;
      if (time > 0) {
        this.leftTime = `${moment(new Date()).add('days', time).format("YYYY年MM月DD日")}(剩余${time}天)`;
      } else {
        this.leftTime = `${moment(new Date()).format(
          "YYYY年MM月DD日"
        )}(剩余${time}天)`;
      }
    },
  },
  created() {
    this.getTime()
  }
};
</script>
<style lang="less" scoped>
.about {
  .logo {
    text-align: center;
    background: @white;
    padding: 40px 0 35px;
    .van-image {
      border-radius: 10px;
      overflow: hidden;
    }
    .sys-name {
      font-size: 16px;
      line-height: 30px;
    }
  }
  .action-box {
    margin-top: 10px;
  }
  .van-cell__value {
    min-width: 55%;
    span {
      display: inline-block;
      text-align: left;
      word-break: break-all;
    }
  }
}
</style>

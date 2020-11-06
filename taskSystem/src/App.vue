<template>
  <div id="app">
    <router-view />
    <van-popup v-model="show" class="overdue-box">
      <div class="icon-time">
        <i
          :class="[timeType == 1 ? 'time-icon' : 'warning-icon', 'sprite-icon']"
        ></i>
      </div>
      <div class="time">
        <template v-if="timeType == 1">
          系统还剩
          <span>{{ day }} 天</span>到期
        </template>
        <template v-else>系统已到期</template>
      </div>
      <div>请联系商务或客服进行续费：</div>
      <div class="servcie">
        <div class="box tel-box">
          <p class="tel">4000-2828-80</p>
          <p class="text">请致电客服人员</p>
          <i class="phone-icon sprite-icon bg-icon"></i>
        </div>
        <div class="box wx-box">
          <div>
            <i class="custrom-service-icon sprite-icon qr-icon"></i>
          </div>
          <div class="text" style="padding-left: 16px">
            <p>微信扫描</p>
            <p>添加客服微信</p>
          </div>
          <i class="wx-icon sprite-icon bg-icon"></i>
        </div>
      </div>
      <van-icon
        name="close"
        class="close"
        v-if="timeType == 1"
        @click="handleClose"
      />
    </van-popup>
  </div>
</template>
<script>
import { common } from "@/api";
import { getStore, setStore } from "@/utils/store";
export default {
  data() {
    return {
      show: false,
      timeType: 1,
      day: 0,
    };
  },
  created() {
    this.$store.dispatch("GetUserInfo");
    let wxInfo = this.$store.getters.signature;
    if (wxInfo && wxInfo.config) {
      this.setWx(wxInfo);
    } else {
      this.getWxConfig();
    }
    let storeTime = getStore({ name: "overdueDay" });
    let now = new Date();
    if (storeTime && new Date().getTime() - storeTime > 24 * 60 * 60 * 60)
      return;
    this.getAppTime();
  },
  mounted() {
    const that = this;
    window.screenHeight = document.body.clientHeight;
    let screenHeight = window.screenHeight;
    // 解决弹出层字体模糊问题(使用transform，高度或者宽度为奇数时，字体模糊)
    if ((screenHeight, screenHeight % 2 != 0)) {
      window.isPoupHeightReset = true;
    } else {
      window.isPoupHeightReset = false;
    }
  },
  methods: {
    async getWxConfig() {
      let url = location.href.split("#")[0];
      let that = this;
      const { data, code } = await common.getSignature({ url: url });
      if (code == 0) {
        return that.$toast("url不正确");
      }
      that.$store.commit("SET_SIGNATURE", data);
      that.setWx(data);
    },
    // 获取应用使用时间
    async getAppTime() {
      const { code, data } = await common.getAppTime();
      let now = new Date();
      if (code == 200) {
        if (data.overdue_day <= 7) {
          if (data.is_admin) {
            this.show = true;
          }
          if (data.overdue_day <= 0) {
            this.timeType = 2;
            this.show = true;
            return false;
          }
          this.day = data.overdue_day;
        }
        setStore({
          name: "overdueDay",
          content: { day: data.overdue_day, time: now.getTime() },
        });
      }
    },
    handleClose() {
      this.show = false;
    },
    setWx(data) {
      const { config, agent_config } = data;
      wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: false,
        appId: config.corpid, // 必填，企业微信的corpID
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.noncestr, // 必填，生成签名的随机串
        signature: config.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: [
          "onMenuShareAppMessage",
          "onMenuShareTimeline",
          "onMenuShareWechat",
          "openUserProfile",
        ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
      });
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: [
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareWechat",
            "openUserProfile",
          ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function (res) {
            console.log(res);
          },
        });
        wx.agentConfig({
          corpid: agent_config.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
          agentid: agent_config.agent_id, // 必填，企业微信的应用id （e.g. 1000247）
          timestamp: agent_config.timestamp, // 必填，生成签名的时间戳
          nonceStr: agent_config.noncestr, // 必填，生成签名的随机串
          signature: agent_config.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
          jsApiList: ["openUserProfile"], //必填
          success: function (res) {
            console.log("agent", res);
          },
        });
        wx.hideOptionMenu();
      });
      wx.error(function () {
      });
    },
  },
};
</script>
<style>
</style>
<style lang="less">
html,
body {
  background: #f5f7fa;
  height: 100vh;
  overflow: hidden;
}
* {
  font-family: "PingFang SC", "Microsoft YaHei", SCHeiti, Helvetica;
}
.no-title {
  border-radius: 8px !important;
  .van-dialog__content {
    padding: 43px 0 23px;
  }
}
#app {
  font-family: "PingFang SC", "Microsoft YaHei", SCHeiti, Helvetica;
  height: 100vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  > div {
    width: 100%;
    overflow: auto;
    height: 100%;
    -webkit-overflow-scrolling: touch;
  }
  .van-picker {
    .van-picker__toolbar {
      &::after {
        border-width: 0;
      }
      .van-picker__cancel {
        color: #606266;
      }
    }
  }
  p {
    margin-block-start: 5px;
    margin-block-end: 5px;
  }
  .success {
    color: #0082ef;
  }
  .close {
    color: #ec5f50;
  }
  .aprove {
    background: #9b9b9b;
    border-radius: 8px;
    height: 8px;
    width: 8px;
    display: inline-block;
  }
  .van-tag {
    font-size: 12px;
    height: 24px;
    line-height: 22px;
    box-sizing: border-box;
    transform: scale(0.8);
    transform-origin: 0% 0%;
    position: relative;
    top: 3px;
  }
  .van-empty {
    color: @blue-light;
  }
  .overdue-box {
    height: auto;
    width: 80%;
    border-radius: 4px;
    padding: 32px 15px;
    font-size: 14px;
    overflow: unset;
    .icon-time {
      text-align: center;
      img {
        width: 64px;
      }
    }
    .time {
      font-size: 18px;
      line-height: 40px;
      margin: 10px 0 24px;
      text-align: center;
      color: #2d3034;
      font-weight: bold;
      span {
        color: #ec5f50;
      }
    }
    .box {
      position: relative;
      height: 94px;
      border-radius: 4px 4px 0px 0px;
      overflow: hidden;
      padding: 0 12px;
      box-sizing: border-box;
      &.tel-box {
        background: #f5f7fa;
        border-top: 2px solid rgba(0, 102, 255, 0.1);
        padding-top: 14px;
        margin-top: 8px;
      }
      &.wx-box {
        margin-top: 10px;
        background: rgba(81, 195, 0, 0.1);
        border-top: 2px solid rgba(81, 195, 0, 0.1);
        padding-top: 7px;
        display: flex;
        align-items: center;
      }
      .tel {
        font-size: 20px;
      }
      .bg-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: 0;
      }
      .text {
        color: #979797;
        font-size: 12px;
      }
      .qr-code {
        width: 76px;
      }
    }
    .close {
      position: absolute;
      bottom: -20%;
      left: 50%;
      font-size: 20px;
      color: #fff;
      transform: translateX(-50%);
    }
  }
}
.popup {
  top: 0 !important;
  left: 0 !important;
  background-color: @white-light !important;
  height: 100%;
  overflow: auto;
  width: 100%;
  z-index: 8;
  transform: none !important;
}
.van-dropdown-item__content {
  max-height: 100% !important;
  overflow: hidden !important;
}
footer {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #fff;
}
</style>

<template>
  <a-config-provider :locale="zh_CN">
    <div class="LoadingGroup spin-content">
      <div class="LoadingGroup_s" v-if="lodingOnOff_s"></div>
      <a-spin :spinning="lodingOnOff" :tip="lodingText">
        <div id="app">
          <!-- <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
          </keep-alive>-->
          <!-- v-if="!$route.meta.keepAlive" -->
          <router-view />
        </div>
      </a-spin>
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
// import moment from "moment";
// import "moment/locale/zh-cn";
// moment.locale("zh-cn");
export default {
  name: "App",
  data() {
    return {
      zh_CN,
    };
  },
  components: {},
  computed: {
    lodingOnOff() {
      return this.$store.state.lodingOnOff;
    },
    lodingOnOff_s() {
      return this.$store.state.lodingOnOff_s;
    },
    lodingText() {
      return this.$store.state.lodingText;
    },
  },
};
</script>

<style lang="less" scoped>
#app {
  background: #f7f7f7;
  min-height: 100%;
}
.ant-upload-list {
  display: none;
}
.LoadingGroup {
  width: 100%;
  height: 100%;
  /deep/.ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
    width: 100%;
  }
  .LoadingGroup_s {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0.5;
    z-index: 111000;
  }
}
/deep/ .ant-spin-nested-loading > div > .ant-spin {
  position: fixed !important;
  z-index: 1001;
}
/deep/ .ant-spin-container::after{
  z-index: 1001;
}
.LoadingGroup /deep/ .ant-spin-nested-loading,
.LoadingGroup .ant-spin-container {
  width: auto;
  height: auto;
}
</style>

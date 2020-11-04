<template>
  <div id="app" v-if="isRouterAlive">
    <van-overlay z-index="11" class-name="overlay" :show="overlay_vuex" />
    <keep-alive :exclude="keepdata">
      <router-view :key="$route.fullPath" v-if="isRouterAlive"></router-view>
    </keep-alive>
    <van-overlay class="overlyIndex" :show="showAuthNotice">
      <JurisDiction></JurisDiction>
    </van-overlay>
    <!--    <van-overlay :show="showAuthNotice">-->
    <!--      <Operations></Operations>-->
    <!--    </van-overlay>-->
  </div>
</template>
<script>
import jurisdiction from "@/components/jurisdiction";
import operations from "@/components/operations";
import { getScrollParent } from "@/js/public";
import { CellGroup } from "vant";
export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  // created() {
  //   //在页面加载时读取sessionStorage里的状态信息
  //   if (sessionStorage.getItem("vuex")) {
  //     this.$store.replaceState(
  //       Object.assign(
  //         {},
  //         this.$store.state,
  //         JSON.parse(sessionStorage.getItem("vuex"))
  //       )
  //     );
  //     sessionStorage.removeItem("vuex");
  //   }
  // },
  components: {
    JurisDiction: jurisdiction,
    Operations: operations,
  },
  computed: {
    overlay_vuex() {
      return this.$store.state.overlay;
    },
    tabRoutes() {
      return ["list", "personchoose", "fatherindex"];
    },
    showAuthNotice() {
      return this.$store.state.auth_notice;
    },
    // 不需要keep的地方
    keepdata() {
      return [
        "home",
        "agency",
        "officialtep",
        "prepareFile",
        "processed",
        "dispatchBank",
        "filingBox",
        "temporary",
        "signature",
        "sendingDetails",
        "fileExchange",
        "officialOut",
        "fileManage",
        "personchoose",
        "showFun",
      ];
    },
    states() {
      return this.$store.state;
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        location.reload();
        this.isRouterAlive = true;
      });
    },
    start(item) {
      // console.log(item);
      let that = this;
      this.longClick = 0;
      this.timeOutEvent = setTimeout(function () {
        //长按
        // console.log('长按~~~~')
      }, 1000);
    },
    move(e) {
      // console.log(e);
      clearTimeout(this.timeOutEvent);
      this.timeOutEvent = 0;
      //   e.preventDefault();
      // console.log("这是滑动~~~~~~~~");
    },
    end(item) {
      clearTimeout(this.timeOutEvent);
      if (this.timeOutEvent != 0 && this.longClick == 0) {
        //点击
        // console.log('点击啦啦啦啦啦~~~~~')
      }
      return false;
    },
    appSource() {
      const u = navigator.userAgent,
        app = navigator.appVersion;
      //const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        this.$store.commit("set_andriod_ios", false);
      } else {
        this.$store.commit("set_andriod_ios", true);
      }
      // console.log(this.$store.state.andriod_ios);
    },
  },
  // updated(){
  //   let dom = document.getElementById("#app");
  //   dom.scrollTo(0,0);
  // },
  mounted() {
    // const element = getScrollParent(document.querySelector("body"))
    // element.scrollTop = 0
    // let _this = this;
    // // console.log(_this.states);
    // window.onbeforeunload = function (event) {
    //   // console.log(_this.states);
    //   sessionStorage.setItem("vuex", JSON.stringify(_this.states));
    // };
    this.appSource();
  },
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    sessionStorage.removeItem("store");
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
    window.addEventListener("pagehide", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
  /*overflow-y: scroll; //该属性随着手指离开立即停止*/
  /*-webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动*/
}
#app {
  background: #f5f6f7;
  height: 100%;
  width: 100%;
  /*overflow: scroll; //该属性随着手指离开立即停止*/
  /*-webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动*/
}
.van-search .van-cell {
  background-color: #f7f8fa !important;
}
// 取消搜索图标
.van-search__content {
  /deep/.van-cell {
    /deep/.van-field__left-icon {
      display: none;
    }
  }
}
input:focus::-webkit-input-placeholder {
  color: transparent;
  /* transparent是全透明黑色(black)的速记法，即一个类似rgba(0,0,0,0)这样的值 */
}
/*无操作权限增加层级*/
.overlyIndex {
  z-index: 700;
}
</style>

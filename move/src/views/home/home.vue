<template>
  <div id="home-warp">
    <home-header :user="res" :total="allTotal" />
    <home-box
      :title="item.title"
      v-for="item in Banner"
      :key="item.title"
      :box-list="item.boxList"
    />
    <home-footer />
    <van-popup v-model="remindShow.show" style="height:100%;width:100%">
      <Remind :remindShow="remindShow" />
    </van-popup>
  </div>
</template>
<script>
import HomeHeader from "./components/homeHeader";
import HomeBox from "./components/homeBox";
import HomeFooter from "./components/homeFooter";
import Remind from "@/components/remind";
import Operations from "@/components/operations";
import Jurisdiction from "@/components/jurisdiction";
import axios from "axios";
// import { power } from "../../assets/js/up";

import {
  memberDetail,
  msgCount,
  qiniuToken,
  documentAuth,
  wait_document,
} from "@/api/home"; //接口
import { mapState, mapMutations } from "vuex";
export default {
  name: "home",
  components: {
    HomeFooter,
    HomeBox,
    HomeHeader,
    Remind,
    Operations,
    Jurisdiction,
  },
  data() {
    return {
      remindShow: {
        show: false,
      },
      token: "",
      allTotal: {
        toBeRead: null,
        pendingFile: null,
      }, //待审审阅数量
      power: "",
      Banner: [
        {
          title: "常用工具",
          boxList: [
            {
              name: "post_is",
              icon: require("@/assets/img/home/quick.png"),
              text: "快速发文",
              url: "/quick",
              status: "",
            },
            {
              name: "post_is",
              icon: require("@/assets/img/home/dfa.png"),
              text: "发文拟稿",
              url: "/officialtep?type=1",
              status: "",
            },
            {
              name: "get_is",
              icon: require("@/assets/img/home/swen.png"),
              text: "收文登记",
              url: "/officialtep?type=2",
              status: "",
            },
            {
              name: "sign_is",
              icon: require("@/assets/img/home/qbao.png"),
              text: "签报拟稿",
              url: "/officialtep?type=3",
              status: "",
            },
            {
              icon: require("@/assets/img/home/dwen.png"),
              text: "待审发文",
              url: "/processed?id=1&title=待审发文",
              status: true,
            },

            {
              icon: require("@/assets/img/home/dshou.png"),
              text: "待审收文",
              url: "/processed?id=2&title=待审收文",
              status: true,
            },

            {
              icon: require("@/assets/img/home/dqian.png"),
              text: "待审签报",
              url: "/processed?id=3&title=待审签报",
              status: true,
            },
          ],
        },
        {
          title: "公文管理",
          boxList: [
            {
              name: "pre_post",
              icon: require("@/assets/img/home/pre-post-bg.png"),
              text: "预发文",
              url: "/prepareFile",
              status: "",
            },
            {
              name: "post_see",
              icon: require("@/assets/img/home/fguan.png"),
              text: "发文库",
              url: "/dispatchBank/1",
              status: "",
            },
            {
              name: "get_see",
              icon: require("@/assets/img/home/sguan.png"),
              text: "收文库",
              url: "/dispatchBank/2",
              status: "",
            },
            {
              name: "sign_see",
              icon: require("@/assets/img/home/qguan.png"),
              text: "签报库",
              url: "/dispatchBank/3",
              status: "",
            },
            {
              name: "area_mobile",
              icon: require("@/assets/img/home/wguan.png"),
              text: "文件管理区",
              url: "/fileManage",
              status: true,
            },
            {
              name: "document_exchange_mobile",
              icon: require("@/assets/img/home/ghuan.png"),
              text: "公文交换",
              url: "/fileExchange",
              status: "",
            },
            {
              icon: require("@/assets/img/home/temporary.png"),
              text: "草稿箱",
              url: "/temporary",
              status: true,
            },
          ],
        },
        {
          title: "基础管理",
          boxList: [
            {
              name: "organization_mobile",
              icon: require("@/assets/img/home/organ.png"),
              text: "组织架构",
              url: "/organization",
              status: "",
            },
            {
              name: "set_ele_chapter",
              icon: require("@/assets/img/home/signature.png"),
              text: "电子签章",
              url: "/signature",
              status: "",
            },
          ],
        },
      ],

      res: {},
      auths: [],
    };
  },
  methods: {
    //  七牛云token
    getQiniuToken() {
      qiniuToken().then((res) => {
        this.getToken(res.token);
        this.getUrl(res.url);
      });
    },
    homeInitApi() {
      let data = new URLSearchParams();
      memberDetail(data).then((res) => {
        if (res.code == 1) {
          this.res = res.data;
          sessionStorage.setItem("userInfo", JSON.stringify(res.data)); //用户信息
          //登录设置权限提示
          if (
            (sessionStorage.getItem("remindShow") == null ||
              sessionStorage.getItem("remindShow") == undefined) &&
            res.data.auth_user == "1"
          ) {
            sessionStorage.setItem("remindShow", true);
            this.remindShow.show = true;
          } else {
            this.remindShow.show = false;
          }
          // console.log("remindShow", sessionStorage.getItem("remindShow"));
        }
      });
    },
    async get_wait_document() {
      let { data, code, other } = await wait_document();
      if (data.toBeRead) {
        this.allTotal.toBeRead = other.waitRead;
      }
      if (data.pendingFile) {
        this.allTotal.pendingFile = other.allCount;
      }
    },
  },
  mounted() {
    let auth = JSON.parse(sessionStorage.getItem("SET_AUTH"));
    for (let key in auth) {
      this.auths.push(...auth[key]);
    }
    // console.log(this.auths);
    // 权限
    // this.Banner.forEach((item) => {
    //   item.boxList.forEach((items) => {
    //     items.status =
    //       items.name == "pre_post" ? (auth[1] ? true : false) : items.status;
    //     if (this.auths.indexOf(items.name) !== -1) {
    //       items.status = true;
    //     }
    //   });
    // });

    let banners = this.Banner.filter((v, i) => {
      let box = v.boxList.filter((vs, is) => {
        vs.status =
          vs.name == "pre_post" ? (auth[1] ? true : false) : vs.status;
        if (this.auths.indexOf(vs.name) !== -1) {
          vs.status = true;
        }
        return vs.status == true;
      });
      v.boxList = box;
      return box.length > 0;
    });
    this.Banner == banners;
  },
  created() {
    this.homeInitApi();
    this.get_wait_document();
    sessionStorage.removeItem("content");
    sessionStorage.removeItem("document_arr");
    sessionStorage.removeItem("enclosure_file");
    sessionStorage.removeItem("approval_file");
    sessionStorage.removeItem("currentDoc");
    sessionStorage.removeItem("document_arrs");
    sessionStorage.removeItem("gercontentFile");
    sessionStorage.removeItem("red");
    sessionStorage.removeItem("ele");
    sessionStorage.removeItem("fieldss");
    sessionStorage.removeItem("button");
    sessionStorage.removeItem("iss");
    sessionStorage.removeItem("ele_url");
  },
};
</script>

<style scoped lang="scss">
// #home-warp {
//   height: 100vh;
// }
.content {
  width: 384px;
  height: 290px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.06);
  background: red;
}
</style>
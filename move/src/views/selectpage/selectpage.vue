<template>
  <div class="pickclass">
    <div class="pickclass-top" :class="navlist.length > 1 ? 'hpx' : 'dpx'">
      <van-search
        v-model="keyword"
        input-align="center"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @clear="onClear"
      />
      <van-tabs v-model="active" @click="tabsclick">
        <van-tab title="组织架构" v-if="pel.ckt.zzjg" name="zzjg"></van-tab>
        <van-tab title="标签" v-if="pel.ckt.tag" name="tag"></van-tab>
        <van-tab title="收发文单位" v-if="pel.ckt.dw" name="dw"></van-tab>
        <van-tab title="互联单位" v-if="pel.ckt.hl" name="hl"></van-tab>
      </van-tabs>
      <div class="nav-cell" v-if="navlist.length > 1">
        <template v-for="(v, i) in navlist">
          <template v-if="i == navlist.length - 1">
            <span :key="i">{{ v.dep_name }}</span>
          </template>
          <template v-else>
            <span :key="i" @click="onclick(v, i)" class="nav-cell-hui"
              >{{ v.dep_name }} ></span
            >
          </template>
        </template>
      </div>
    </div>
    <div
      class="pickclass-content"
      :class="navlist.length > 1 ? 'phpx' : 'pdpx'"
    >
      <van-checkbox-group v-model="pel.result" ref="checkboxGroup">
        <van-cell-group>
          <template v-if="list.length > 0">
            <van-cell v-for="item in list" clickable :key="item.w_id">
              <div class="pickclass-content-left" @click="onclick(item)">
                <img class="fileimg" :src="item.img" alt />
                <span class="pickclass-content-left-text">{{
                  item.title
                }}</span>
              </div>
              <template #right-icon v-if="!(!pel.ckt.bm && item.type == 1)">
                <div class="pickclass-content-right" @click="toggle(item)">
                  <van-checkbox
                    :name="item.w_id"
                    ref="checkboxes"
                    :item="item"
                  />
                </div>
              </template>
            </van-cell>
          </template>
          <template v-else>
            <div class="no-data">
              <noData></noData>
            </div>
          </template>
        </van-cell-group>
      </van-checkbox-group>
    </div>
    <div class="pickclass-buttom">
      <div class="pickclass-buttom-top flex-ac-jsb">
        <div class="pickclass-buttom-top-font">
          <span class="font-left" v-show="bmNum > 0"
            >当前{{
              this.active == "zzjg"
                ? "部门"
                : this.active == "tag"
                ? "标签"
                : "单位"
            }}：{{ bmNum }}</span
          >
          <span v-show="renNum > 0">总人数：{{ renNum }}</span>
        </div>
        <div v-show="this.active == 'zzjg'">
          <span @click="checkAll(zzjg_quck)">{{
            zzjg_quck == 1 ? "全选" : "取消全选"
          }}</span>
        </div>
        <div v-show="this.active == 'tag'">
          <span @click="checkAll(tag_quck)">{{
            tag_quck == 1 ? "全选" : "取消全选"
          }}</span>
        </div>
        <div v-show="this.active == 'dw'">
          <span @click="checkAll(dw_quck)">{{
            dw_quck == 1 ? "全选" : "取消全选"
          }}</span>
        </div>
        <div v-show="this.active == 'hl'">
          <span @click="checkAll(hl_quck)">{{
            hl_quck == 1 ? "全选" : "取消全选"
          }}</span>
        </div>
      </div>
      <div class="pickclass-buttom-bum flex-ac-jsb">
        <div class="pickclass-buttom-top-font" @click="selFun">
          <span v-show="pel.result.length > 0">
            已选 单位/人员：
            <span style="color: #0082ef">{{ pel.result.length }}</span>
          </span>
        </div>
        <div class="flex-ac">
          <div
            class="bumbtn qubtn flex-ac-jc"
            v-show="pel.result.length > 0"
            @click="choiseUserqx"
          >
            取消
          </div>
          <div
            class="bumbtn okbtn flex-ac-jc"
            :style="pel.result.length > 0 ? { opacity: 1 } : ''"
            @click="choiseUsercg"
          >
            确认
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let as = 1;
import { getDeptList, getTagsList, getListCompant } from "@/api/home";
import { inter_list } from "@/api/interconnection.js";
import { addRoles } from "@/api/organization";
import { HttpUrl } from "@/js/public.js";
import noData from "@/components/common/noData";
export default {
  components: {
    noData,
  },
  name: "selectpage",
  data() {
    return {
      navlist: [],
      topT: "",
      HttpUrl,
      delicon: require("@/assets/img/pickclass/delicon.png"),
      bmimg: require("@/assets/img/home/zuzhifile.png"),
      tagsimg: require("@/assets/img/home/tagsimg.png"),
      dwimg: require("@/assets/img/home/company.png"),
      active: "zzjg",
      list: [],
      selet_id: "", // 选中的部门id
      // datalist: [], // 数组集合 记录加载过的列表
      keyword: "", // 搜索关键字
      // num: 0,
      // checkedAll: false, // 是否全选
      // depUserss: false,
      // lists: [],
      bmNum: 0,
      renNum: 0,
      zzjg_quck: 1,
      tag_quck: 1,
      dw_quck: 1,
      hl_quck: 1,
      keys: "",
    };
  },
  computed: {
    fields_data() {
      return this.$store.state.edittext.document_arrs;
    },
    item() {
      return this.$route.query.type == 1
        ? this.$store.state.processNew[this.keys]
        : this.$route.query.type == 2
        ? ""
        : this.$store.state.edittext.document_arrs[this.keys];
    },
    pel() {
      return this.$store.state.edittext.pel;
    },
    turnUser() {
      return this.$store.state.processNew.turnUser;
    },
    navcell() {
      return 12345;
    },
  },
  methods: {
    init_data() {
      this.navlist = [];
      this.topT = "";
      // this.active = "zzjg";
      this.list = [];
      this.selet_id = "";
      this.keyword = "";
      this.bmNum = 0;
      this.renNum = 0;
      this.zzjg_quck = 1;
      this.tag_quck = 1;
      this.dw_quck = 1;
      this.keys = "";
    },
    // 深拷贝
    StoP(a) {
      return JSON.parse(JSON.stringify(a));
    },
    // 图片路径处理
    imgTo(urls) {
      let text = String(urls).startsWith("http");
      let imgurl = "";
      if (text) {
        imgurl = urls;
      } else {
        imgurl = this.HttpUrl + urls;
      }
      return imgurl;
    },
    // 搜索接口
    async kwd_data() {
      let type;
      if (this.active == "zzjg") {
        type = 4;
        if (this.pel.ckt.bm && !this.pel.ckt.ren) {
          type = 1;
        }
        if (!this.pel.ckt.bm && this.pel.ckt.ren) {
          type = 2;
        }
      } else if (this.active == "tag") {
        type = 3;
      } else if (this.active == "dw") {
        type = 5;
      } else if (this.active == "hl") {
        type = 7;
      }
      // console.log(type);
      this.list = [];
      let _this = this;
      let a;
      if (type == 5) {
        // 请求标签的信息
        a = await getListCompant({
          keyword: this.keyword,
          page: 1,
          limit: 10000,
          sort: "ASC",
        });
        if (a.code == 1) {
          a.data.data.forEach((e) => {
            this.list.push({
              id: e.id,
              title: e.title,
              type: 4, // 收发文单位
              img: this.dwimg,
              onc: false, // 是否可以点击获取下级内容
              w_id: "dw" + e.id, // 防止 部门、标签、单位 有重复id 好区分
              doc_receiver: e.doc_receiver,
              receiver_name: e.receiver_name,
            });
          });
        }
      } else {
        a = await addRoles({ type, kwd: this.keyword });
        if (a.code == 1) {
          if (type == 1) {
            a.data.forEach((e) => {
              this.list.push({
                id: e.id,
                title: e.title,
                type: 1, // 部门
                img: this.bmimg,
                onc: e.subordinate == 1 ? true : false, // 没有下级就不能点
                w_id: "bm" + e.id, // 防止 部门、标签、单位 有重复id 好区分
              });
            });
          }
          if (type == 2) {
            a.data.forEach((e) => {
              this.list.push({
                id: e.userid,
                title: e.title,
                type: 2, // 人
                img: e.avatar,
                onc: false,
                w_id: "ren" + e.userid, // 防止 部门、标签、单位 有重复id 好区分
              });
            });
          }
          if (type == 3) {
            a.data.forEach((e) => {
              this.list.push({
                id: e.id,
                title: e.title,
                type: 3, // 人
                img: this.tagsimg,
                onc: false,
                w_id: "tag" + e.id, // 防止 部门、标签、单位 有重复id 好区分
              });
            });
          }
          if (type == 4) {
            a.data.forEach((e) => {
              let ass = e.slots.icon == "FolderFilled" ? 1 : 2; // 1 是部门 2 是人员
              this.list.push({
                id: ass == 1 ? e.id : e.userid,
                title: e.title,
                type: ass, // 人
                img: ass == 1 ? this.bmimg : _this.imgTo(e.avatar),
                onc: ass == 1 ? (e.subordinate == 1 ? true : false) : false,
                w_id: ass == 1 ? "bm" + e.id : "ren" + e.userid, // 防止 部门、标签、单位 有重复id 好区分
              });
            });
          }
        }
      }
    },
    onClear() {
      this.keyword = "";
      this.topT = "";
      this.navlist = [];
      this.selet_id = "";
      this.init();
    },
    // 搜索功能
    onSearch() {
      // if (this.keyword.trim() != "") {
      this.navlist = [];
      this.kwd_data();
      // }
    },
    // 全选
    checkAll(a) {
      if (a == 1) {
        this.active == "zzjg"
          ? (this.zzjg_quck = 2)
          : this.active == "tag"
          ? (this.tag_quck = 2)
          : this.active == "dw"
          ? (this.dw_quck = 2)
          : "";
        this.$refs.checkboxes.forEach((v) => {
          v.toggle(true);
          if (!this.pel.result.includes(v.name)) {
            this.pel.result.push(v.name);
            let items = JSON.parse(JSON.stringify(v.$attrs.item));
            if (items.type == 1) {
              items.title = this.topT + items.title;
            }
            this.pel.results.push(items);
          }
        });
      } else {
        this.zzjg_quck = 1;
        this.tag_quck = 1;
        this.dw_quck = 1;
        // this.active == "zzjg"
        //   ? (this.zzjg_quck = 1)
        //   : this.active == "tag"
        //   ? (this.tag_quck = 1)
        //   : this.active == "dw"
        //   ? (this.dw_quck = 1)
        //   : "";
        this.pel.result = [];
        this.pel.results = [];
      }
      // this.checkedAll = !this.checkedAll;
    },
    // 进行勾选操作
    toggle(item) {
      if (this.pel.ckt.radio) {
        this.pel.result = [];
        this.pel.results = [];
      }
      let index;
      this.$refs.checkboxes.forEach((e, i) => {
        if (e.name == item.w_id) {
          index = i;
        }
        return;
      });
      this.$refs.checkboxes[index].toggle();
      if (!this.$refs.checkboxes[index].checked) {
        let items = JSON.parse(JSON.stringify(item));
        if (items.type == 1) {
          items.title = this.topT + " - " + items.title;
        }
        this.pel.results.push(items);
      } else {
        var i = this.pel.results.map((v) => v.w_id).indexOf(item.w_id);
        this.pel.results.splice(i, 1);
      }
      // console.log(this.pel);
    },

    // 点击部门时加载子集
    async onclick(item, n) {
      // console.log(n);
      if (n != undefined) {
        this.navlist = this.navlist.slice(0, n);
        this.selet_id = item.id;
        this.init();
      } else if (item.onc) {
        // console.log(this.active);
        this.selet_id = item.id;
        // console.log("选中的部门id", this.selet_id);
        this.init();
      }
    },
    // tabs卡点击事件
    tabsclick(e) {
      // 清空历史请求
      this.keyword = "";
      this.topT = "";
      this.navlist = [];
      this.selet_id = "";
      // this.datalist = [];
      this.init();
    },
    // 初始获取组织结构的数据列表
    async init() {
      let aa = await getDeptList({ dept_id: "", type: 1 });
      this.topT = aa.data.tree.title;
      // // console.log(active);
      this.list = []; // 初始化列表数据
      let a;
      if (this.active == "zzjg") {
        let oncs = 1;
        if (this.pel.ckt.ren) {
          oncs = 2;
        }
        // 请求组织结构的信息
        a = await getDeptList({ dept_id: this.selet_id, type: 2 });
        if (a.code == 1) {
          // console.log(a);
          this.navlist.push(a.data.dept[0]);
          a.data.child_dept.forEach((e) => {
            this.list.push({
              id: e.id,
              title: e.dep_name,
              type: 1, // 部门
              img: this.bmimg,
              onc:
                oncs == 1
                  ? e.subordinate == 1
                    ? true
                    : false
                  : e?.userids?.length != 0
                  ? true
                  : false, // 是否可以点击获取下级内容
              w_id: "bm" + e.id, // 防止 部门、标签、单位 有重复id 好区分
            });
          });
          // 需要选人的时候才加载
          if (this.pel.ckt.ren) {
            a.data.members.forEach((e) => {
              this.list.push({
                id: e.userid,
                title: e.name,
                type: 2, // 人员
                img: e.avatar,
                onc: false, // 是否可以点击获取下级内容
                w_id: "ren" + e.userid, // 防止 部门、标签、单位 有重复id 好区分
              });
            });
          }
          this.bmNum = a.data.child_dept.length;
          this.renNum = a.data.members.length;
        }
      } else if (this.active == "tag") {
        // 请求标签的信息
        a = await getTagsList();
        if (a.code == 1) {
          a.data.tags.forEach((e) => {
            this.list.push({
              id: e.id,
              title: e.title,
              type: 3, // 标签
              img: this.tagsimg,
              onc: false, // 是否可以点击获取下级内容
              w_id: "tag" + e.id, // 防止 部门、标签、单位 有重复id 好区分
            });
          });
          this.bmNum = a.data.tags.length;
          this.renNum = 0;
        }
      } else if (this.active == "dw") {
        // 请求标签的信息
        a = await getListCompant({
          keyword: this.keyword,
          page: 1,
          limit: 10000,
          sort: "ASC",
        });
        // console.log(a);
        if (a.code == 1) {
          a.data.data.forEach((e) => {
            this.list.push({
              id: e.id,
              title: e.title,
              type: 4, // 收发文单位
              img: this.dwimg,
              onc: false, // 是否可以点击获取下级内容
              w_id: "dw" + e.id, // 防止 部门、标签、单位 有重复id 好区分
              doc_receiver: e.doc_receiver,
              receiver_name: e.receiver_name,
            });
          });
        }
        this.bmNum = a.data.data.length;
        this.renNum = 0;
      } else if (this.active == "hl") {
        // 请求标签的信息
        a = await inter_list();
        if (a.code == 1) {
          a.data.forEach((e) => {
            this.list.push({
              id: e.id,
              title: e.corp_name,
              type: 7, // 互联
              img: this.tagsimg,
              onc: false, // 是否可以点击获取下级内容
              w_id: "hl" + e.id, // 防止 部门、标签、单位、互联单位 有重复id 好区分
              receiver: e.receiver && e.receiver.length > 0 ? e.receiver : [],
            });
          });
          this.bmNum = a.data.length;
          this.renNum = 0;
        }
      }
      console.log(this.list);
      // this.datalist.push(this.list);
    },
    // 完成按钮
    choiseUsercg() {
      if (this.pel.result.length == 0) {
        this.$toast("请选择人员或单位！");
      } else {
        // console.log(444, this.pel.result, this.pel.results);
        if (this.$route.query.type == 2) {
        } else if (
          this.$route.query.type == 1 &&
          this.$route.query.key == "cs"
        ) {
          this.item.value = this.StoP(this.pel.result);
          this.item.values = this.StoP(this.pel.results);
        } else {
          this.item.value = this.StoP(this.pel.result);
          this.item.values = this.StoP(this.pel.results);
          if (this.keys == "main_delivery" || this.keys == "receiving_unit") {
            let revi =
              this.keys == "main_delivery" ? "reviewer" : "receiving_user";
            this.fields_data[revi].values = [];
            for (
              let i = this.fields_data[revi].values.length - 1;
              i >= 0;
              i--
            ) {
              if (this.fields_data[revi].values[i].type == 500) {
                this.fields_data[revi].values.splice(i, 1);
              }
            }
            this.item.values.forEach((e) => {
              if (e.type == 4) {
                this.fields_data[revi].values.push({
                  receiver_name: e.receiver_name,
                  title: e.receiver_name,
                  w_id: e.doc_receiver,
                  type: 500,
                  id: e.id,
                  wid: e.w_id,
                });
              }
              if (e.type == 7) {
                e?.receiver.length > 0 &&
                  e?.receiver.forEach((_e) => {
                    this.fields_data[revi].values.push({
                      receiver_name: _e.name,
                      title: e.title + "-" + _e.name,
                      w_id: _e.id,
                      type: 500,
                      id: e.id,
                      wid: e.w_id,
                    });
                  });
              }
            });
          }
        }
        this.$router.go(-1);
      }
    },
    // 取消按钮
    choiseUserqx() {
      this.$router.go(-1);
    },
    selFun() {
      this.$router.push({
        path: "/selcheck",
      });
    },
  },
  created() {},
  activated() {
    this.init_data();
    this.keys = this.$route.query.key;
    if (this.$route.query.type == 1 && this.$route.query.key == "auditor") {
      this.pel.result = [];
      this.pel.results = [];
    } else if (this.$route.query.type == 2) {
    } else {
      if (as) {
        this.pel.result = this.StoP(this.item.value);
        this.pel.results = this.StoP(this.item.values);
        // console.log(2222, this.pel.results, this.pel.result);
        // console.log(
        //   this.pel,
        //   this.pel.ckt.bm,
        //   this.item,
        //   !(!this.pel.ckt.bm && this.item.type == 1)
        // );
      }
    }
    this.init();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "selcheck") {
      as = 0;
    } else {
      as = 1;
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
/deep/ .van-tabs__line {
  background-color: #0082ef;
}

.pickclass {
  // padding: 15px;
  height: 100%;
  background-color: #ffffff;
  .pickclass-top {
    height: 137px;
    .checked-data {
      height: 30px;
      display: flex;
      align-items: center;
      text-align: center;
      font-size: 16px;
      .checked-data-text {
        color: #0082ef;
        width: 60px;
      }
      .checked-data-texts {
        flex: 1;
      }
    }
    .nav-cell {
      height: 40px;
      background-color: #f9f9f9;
      font-size: 14px;
      line-height: 40px;
      white-space: nowrap;
      padding: 0 15px;
      .nav-cell-hui {
        color: #909399;
      }
      width: 100%;
      overflow-x: auto;
    }
  }
  .hpx {
    height: 137px;
  }
  .dpx {
    height: 97px;
  }
  .sync {
    font-size: 14px;
    height: 41px;
    line-height: 41px;
    background-color: #ebebeb;
    text-align: center;

    .van-icon {
      vertical-align: text-top;
      padding-top: 2px;
      padding-right: 5px;
    }
  }
  .pickclass-content {
    overflow-y: auto;
  }
  .phpx {
    height: calc(100% - 137px - 96px);
  }
  .pdpx {
    height: calc(100% - 97px - 96px);
  }
  .pickclass-content-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 50px;
    .delicon {
      width: 16px;
    }
  }
  .pickclass-content-left {
    display: flex;
    align-items: center;
    .fileimg {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }
    .pickclass-content-left-text {
      font-size: 15px;
      margin-left: 15px;
    }
  }
  .pickclass-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 15px;
    box-shadow: 0px -1px 0px rgba(230, 230, 230, 1);
    .btn {
      width: 187px;
      /deep/ .van-button__text {
        display: flex;
        justify-content: center;
        align-items: center;
        .btnback {
          color: #0082ef;
          font-size: 18px;
          transform: rotateY(180deg);
          margin-right: 10px;
        }
      }
    }
  }
  .checked-box {
    height: 100%;
    .checked-box-top {
      height: 53px;
    }
    .checked-box-content {
      height: calc(100% - 53px - 60px);
      overflow-y: auto;
      .no-data {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  // 底部
  .pickclass-buttom {
    height: 96px;
    .pickclass-buttom-top {
      height: 40px;
      box-shadow: 0px -1px 4px rgba(0, 0, 0, 0.06);
      padding: 0 15px;
    }
    .pickclass-buttom-bum {
      padding: 0 15px;
      height: 56px;
      box-shadow: 0px -1px 0px rgba(0, 0, 0, 0.06);
      .bumbtn {
        width: 106px;
        height: 40px;
        border-radius: 21px;
        font-size: 16px;
      }
      .okbtn {
        color: #ffffff;
        background: linear-gradient(128deg, #0082ef 0%, #04a9fe 100%);
        opacity: 0.41;
      }
      .qubtn {
        color: #000000;
        border: 1px solid #c8c8c8;
        margin-right: 10px;
      }
    }
    .pickclass-buttom-top-font {
      font-size: 14px;
      .font-left {
        display: inline-block;
        margin-right: 24px;
      }
    }
  }
}
</style> 
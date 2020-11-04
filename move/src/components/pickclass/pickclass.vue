<template>
  <div class="pickclass">
    <div class="pickclass-top">
      <van-search
        v-model="keyword"
        input-align="center"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @clear="onClear"
      />
      <div class="checked-data">
        <div class="checked-data-text" @click="checkAll(2)">取消</div>
        <div class="checked-data-texts" @click="goTocheck">
          已勾选：
          <span style="color:#0082ef">{{pel.result.length}}</span>
        </div>
        <div class="checked-data-text" @click="checkAll(1)">全选</div>
      </div>
      <van-tabs v-model="active" @click="tabsclick">
        <van-tab title="组织架构" v-if="pel.ckt.zzjg" name="zzjg"></van-tab>
        <van-tab title="标签" v-if="pel.ckt.tag" name="tag"></van-tab>
        <van-tab title="收发文单位" v-if="pel.ckt.dw" name="dw"></van-tab>
      </van-tabs>
    </div>
    <div class="pickclass-content">
      <van-checkbox-group v-model="pel.result" ref="checkboxGroup">
        <van-cell-group>
          <template v-if="list.length>0">
            <van-cell v-for="item in list" clickable :key="item.w_id">
              <div class="pickclass-content-left" @click="onclick(item)">
                <img class="fileimg" :src="item.img" alt />
                <span class="pickclass-content-left-text">{{item.title}}</span>
              </div>
              <template #right-icon v-if="!(!pel.ckt.bm && item.type==1)">
                <div class="pickclass-content-right" @click="toggle(item)">
                  <van-checkbox :name="item.w_id" ref="checkboxes" :item="item" />
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
    <div class="pickclass-btn">
      <van-button type="default" class="btn" @click="onCancel">
        <van-icon v-show="datalist.length>1" class="btnback" name="share" />
        <span>{{btntext}}</span>
      </van-button>
      <van-button type="info" class="btn" @click="onOk">确认</van-button>
    </div>
    <van-popup v-model="depUserss" position="left" :style="{ height: '100%',width:'100%' }">
      <div class="checked-box">
        <div class="checked-box-top">
          <van-search
            v-model="keywords"
            input-align="center"
            placeholder="请输入搜索关键词"
            @search="onSearchs"
            @clear="onClears"
          />
        </div>
        <div class="checked-box-content">
          <template v-if="lists.length>0">
            <van-cell v-for="item in lists" :key="item.w_id">
              <div class="pickclass-content-left">
                <img class="fileimg" :src="item.img" alt />
                <span class="pickclass-content-left-text">{{item.title}}</span>
              </div>
              <template #right-icon>
                <div class="pickclass-content-right" @click="delclick(item)">
                  <img class="delicon" :src="delicon" alt />
                </div>
              </template>
            </van-cell>
          </template>
          <template v-else>
            <div class="no-data">
              <noData></noData>
            </div>
          </template>
        </div>
        <div class="pickclass-btn checked-box-btn">
          <van-button type="default" class="btn" @click="onCancelck">
            <span>返回</span>
          </van-button>
          <van-button type="info" class="btn" @click="onOkck">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { getDeptList, getTagsList, getListCompant } from "@/api/home";
import { addRoles } from "@/api/organization";
import { HttpUrl } from "@/js/public.js";
import noData from "@/components/common/noData";
export default {
  name: "Pickclass",
  props: {
    pel: {
      type: Object,
    },
  },
  components: {
    noData,
  },
  data() {
    return {
      topT: "",
      HttpUrl,
      delicon: require("@/assets/img/pickclass/delicon.png"),
      bmimg: require("@/assets/img/home/zuzhifile.png"),
      tagsimg: require("@/assets/img/home/tagsimg.png"),
      dwimg: require("@/assets/img/home/company.png"),
      active: "zzjg",
      list: [],
      // result: [], // 打勾选中的人员部门deman
      // results: [],
      cells: [
        {
          title: "组织架构",
          icon: require("@/assets/img/pickclass/organ.png"),
          url: "",
        },
        {
          title: "标签",
          icon: require("@/assets/img/pickclass/tags.png"),
          url: "",
        },
        {
          title: "收发文单位",
          icon: require("@/assets/img/pickclass/company.png"),
          url: "",
        },
      ],
      selet_id: "", // 选中的部门id
      datalist: [], // 数组集合 记录加载过的列表
      keyword: "", // 搜索关键字
      keywords: "", // 搜索关键字
      num: 0,
      checkedAll: false, // 是否全选
      depUserss: false,
      lists: [],
    };
  },
  watch: {
    pel: {
      //监听的对象
      deep: true, //深度监听设置为 true
      immediate: true,
      handler: function (newV, oldV) {
        // console.log(newV, oldV, this.num);
        if (newV.depUserss && this.num == 0) {
          this.num = 1;
          this.datalist = [];
          if (newV.ckt.zzjg) {
            this.active = "zzjg";
          } else if (newV.ckt.tag) {
            this.active = "tag";
          } else if (newV.ckt.dw) {
            this.active = "dw";
          }
          this.init();
        }
      },
    },
  },
  computed: {
    btntext() {
      return this.datalist.length > 1 ? "上一级" : "取消";
    },
  },
  created() {
    // console.log("shita", this.pel);
    // console.log(this.list);
    // this.init();
    // this.result = this.pel.result;
    // this.results = this.pel.results;
  },
  methods: {
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
        }
      } else if (this.active == "tag") {
        // 请求标签的信息
        a = await getTagsList({ tagid: this.selet_id });
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
      }
      this.datalist.push(this.list);
    },
    onSearchs() {
      this.lists = [];
      this.pel.results.forEach((v, i) => {
        let reg = RegExp(this.keywords);
        if (reg.test(v.title)) {
          this.lists.push(v);
        }
      });
      // console.log(this.lists);
    },
    // 搜索功能
    onSearch() {
      // console.log(this.keyword);
      if (this.keyword.trim() != "") {
        this.kwd_data();
      }
    },
    onClears() {
      this.lists = this.pel.results;
      // console.log(this.keywords);
    },
    // 搜s索框清空按钮
    onClear() {
      // console.log(this.keyword);
      this.init();
    },
    // 取消按钮
    onCancel() {
      // 这个是返回上一层
      // console.log(this.pel.depUserss);
      if (this.datalist.length > 1) {
        this.datalist.splice(this.datalist.length - 1, 1);
        this.list = this.datalist[this.datalist.length - 1];
      } else {
        this.pel.depUserss = false;
        this.selet_id = "";
        this.num = 0;
        this.datalist = [];
        // if (this.pel.ckt.zzjg) {
        //   this.active = "zzjg";
        // } else if (this.pel.ckt.tag) {
        //   this.active = "tag";
        // } else if (this.pel.ckt.dw) {
        //   this.active = "dw";
        // }
        // this.init();
        // console.log("返回了");
      }
    },
    // 确认按钮
    onOk() {
      this.pel.depUserss = false;
      // console.log(this.pel);
      this.num = 0;
      this.$emit("choiseUsercg");
    },
    // 已选人员列表他弹窗
    onCancelck() {
      // console.log("不是吧");
      this.depUserss = false;
    },
    // 已选人员列表他弹窗
    onOkck() {
      this.depUserss = false;
    },
    // 点击部门时加载子集
    async onclick(item) {
      if (item.onc) {
        // console.log(this.active);
        this.selet_id = item.id;
        // console.log("选中的部门id", this.selet_id);
        this.init();
      }
    },
    //查看已勾选的人员
    goTocheck() {
      this.depUserss = true;
      this.lists = JSON.parse(JSON.stringify(this.pel.results));
      // console.log(this.pel.result);
      // console.log(this.pel.results);
    },
    // 全选
    checkAll(a) {
      if (a == 1) {
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
        // // console.log(this.$refs.checkboxGroup.children);
        // this.$refs.checkboxGroup.children.forEach((v) => {
        //   // console.log(v.name);
        //   v.toggle(true);
        //   this.pel.result.push(v.name);
        // });
        // this.$refs.checkboxGroup.toggleAll(true);
        // // console.log(this.pel);
        // this.list.forEach((v) => {
        //   this.pel.result.includes(v.w_id) ? this.pel.results.push(v) : "";
        // });
      } else {
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
      });
      this.$refs.checkboxes[index].toggle();
      if (!this.$refs.checkboxes[index].checked) {
        let items = JSON.parse(JSON.stringify(item));
        if (items.type == 1) {
          items.title = this.topT + items.title;
        }
        this.pel.results.push(items);
      } else {
        var i = this.pel.results.map((v) => v.w_id).indexOf(item.w_id);
        this.pel.results.splice(i, 1);
      }
    },
    // tabs卡点击事件
    tabsclick(e) {
      // 清空历史请求
      this.datalist = [];
      this.init();
    },
    // 删除选中的
    delclick(item) {
      var _i = this.lists.map((v) => v.w_id).indexOf(item.w_id);
      this.lists.splice(_i, 1);
      var i = this.pel.results.map((v) => v.w_id).indexOf(item.w_id);
      this.pel.results.splice(i, 1);
      this.pel.result.splice(i, 1);
    },
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
  .pickclass-top {
    height: 130px;
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
    height: calc(100% - 130px - 60px);
    overflow-y: auto;
    .no-data {
      height: 50px;
      line-height: 50px;
      margin: 0 auto;
      text-align: center;
    }
  }
  .pickclass-content-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 30px;
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
}
</style> 
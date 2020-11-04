<template>
  <div style="background-color: #ffffff">
    <!-- 搜索栏 -->
    <div class="header">
      <van-search
        placeholder="搜索姓名"
        background="#FFFFFF"
        class="searchBox"
        input-align="center"
        v-model="kwd"
        @search="onSearch"
        @clear="onCancel"
        @blur="addBlur"
      />
    </div>
    <div v-if="record.ids.length == 0" class="sync" @click="getsyncOrgan">
      <van-icon name="cluster-o" size="15" />
      同步组织架构
    </div>
    <div v-else class="sync" @click="goBack">
      <van-icon name="upgrade" size="15" />
      返回上一级
    </div>
    <div calss="content">
      <!--        列表内容-->
      <van-tabs
        @change="switchTabs"
        title-active-color="#0082EF"
        color="#0082EF"
        swipeable
        line-width="20px"
        v-model="active"
      >
        <!--        组织架构内容列表-->
        <van-tab title="组织架构" name="1">
          <Organize
            :no_data="no_data"
            @stratum="stratum"
            :keys="record.keys"
            :adddatas="record.adddatas"
            :active="active"
          />
        </van-tab>
        <!--        标签内容列表-->
        <van-tab title="标签" name="2">
          <Countermark
            ref="countermark"
            :active="active"
            @stratum="stratum"
            :keys="record.keys"
          />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import Organize from "@/views/organization/components/organize.vue";
import Countermark from "@/views/organization/components/countermark.vue";
import { syncOrgan } from "../../api/home";
import { addRoles } from "@/api/organization.js";
import { debounce } from "@/js/public.js";

export default {
  name: "list",
  data() {
    return {
      active: "1", //菜单tab状态
      record: {
        ids: [],
        // 每一层的id
        organize: [],
        countermark: [],
        // 返回上一补返回的key
        keys: "",
        num: 0,
        // 搜索后获取的数据
        adddatas: "",
      },
      // 搜索框内容
      kwd: "",
      // 判断是否是搜索框的搜索引发的数据变化 1不是 2是
      datatype: 1,
      no_data: true,
    };
  },
  components: {
    Organize,
    Countermark,
  },
  methods: {
    //同步组织架构
    getsyncOrgan() {
      this.$dialog
        .confirm({
          title: "即将同步组织架构",
          message:
            "请确定公文管理系统应用可见范围包含你本人，否则同步后你可能会被禁止登录，确认同步吗？",
        })
        .then(() => {
          this.$toast.loading({
            message: "加载中...",
            duration: 0,
            forbidClick: true,
          });
          syncOrgan().then((res) => {
            if (res.code == 1) {
              this.$toast.success("同步成功");
            }
          });
        })
        .catch(() => {
          // on cancel
        });
      this.record.ids = this.record.organize;
    },
    // 返回上一层
    goBack(onoff) {
      if (this.datatype == 2) {
        this.datatype = 1;
      } else {
        if (onoff != 1) {
          this.record.ids.pop();
        }
        if (this.record.ids.length == 0) {
          if (onoff == 1) {
            this.record.keys = `空${this.record.num++}`;
          } else {
            this.record.keys = `无${this.record.num++}`;
          }
        } else {
          if (onoff == 1) {
            this.record.keys = `空${this.record.num++}`;
          } else {
            this.record.keys = this.record.ids[this.record.ids.length - 1];
          }
        }
      }
    },
    switchTabs(value) {
      if (value == 1) {
        this.record.ids = this.record.organize;
      } else {
        this.record.ids = this.record.countermark;
      }
      sessionStorage.setItem("num", 2);
      this.kwd = "";
      this.datatype = 1;
      this.goBack(1);
    },
    // 取消按钮
    onCancel() {
      if (this.active == "2") {
        this.$refs.countermark.onShuju("");
      } else {
        this.record.adddatas = "";
      }
    },
    // 搜索确定事件
    onSearch() {
      this.datatype = 2;
      this.getaddRoles();
    },
    // input失去焦点
    addBlur() {
      this.datatype = 2;
      this.getaddRoles();
    },
    // 每点击一次文件push一次id，返回的时候使用
    stratum(key) {
      if (this.active == "1") {
        this.record.organize.push(key);
        this.record.ids = this.record.organize;
      } else {
        this.record.countermark.push(key);
        this.record.ids = this.record.countermark;
      }
    },
    // 根据关键词搜索人员角色信息
    getaddRoles() {
      let _this = this;
      addRoles({ kwd: this.kwd, type: 2 }).then((data) => {
        if (this.active == "1") {
          _this.record.adddatas = {
            dep_name: "",
            members: data.data,
          };
          this.no_data = data.data.length == 0 ? false : true;
        } else {
          if (this.kwd == "") {
            this.$refs.countermark.onShuju("");
          } else {
            this.$refs.countermark.onShuju(data.data);
          }
        }
      });
    },
  },
  created() {},
  inject: ["reload"],
  activated() {
    this.active = "1";
    this.kwd = "";
  },
  beforeRouteEnter(to, from, next) {
    console.log(to, from);
    next((vm) => {
      if (from.name == "home") {
        vm.reload();
      }
      if (from.name == "personchoose" && to.query.cx == 1) {
        vm.$router.push("/organization/list");
        vm.reload();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #ffffff;

  .searchBox {
    background-color: #ffffff;
    width: 100%;
    height: 48px;
    box-shadow: 0px 1px 0px rgba(230, 237, 245, 1);
  }
}

.content {
  padding-bottom: 60px;
  background-color: #ffffff;
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
</style>
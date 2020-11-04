<template>
  <div class="ListBox init">
    <header class="ListBox-header">
      <van-tabs :line-width="20" title-active-color="#0082ef" v-model="data.lab" @change="lebFun">
        <template v-for="v in ListBoxC">
          <van-tab :title="v.title" :name="v.name" :key="v.name"></van-tab>
        </template>
      </van-tabs>
      <div class="ListBox-search flex-ac">
        <!-- <div class="ListBox-search-cell">
          <van-dropdown-menu active-color="#0082ef">
            <van-dropdown-item
              disabled
              v-model="data.type"
              :options="typeDropdown.option"
              @change="typeFun"
            />
          </van-dropdown-menu>
        </div>-->
        <div class="ListBox-search-div">
          <van-search
            v-model="data.kwd"
            :placeholder="'搜索公文'"
            input-align="center"
            @input="kwdFun"
            @clear="onClear"
          />
        </div>
      </div>
    </header>
    <div class="ListBox-center">
      <template v-if="list.length>0">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
          v-if="list"
        >
          <template v-for="(v,i) in list">
            <list-cards :item="v" :key="i" :lab="data.lab" />
          </template>
        </van-list>
      </template>
      <template v-else>
        <noData></noData>
      </template>
    </div>
  </div>
</template>
<script>
let ListBoxC = [
  {
    name: 1,
    title: "待我审的",
  },
  {
    name: 2,
    title: "待别人审的",
  },
];
let typeDropdown = {
  option: [
    { text: "发文", value: 1 },
    { text: "收文", value: 2 },
    { text: "签报", value: 3 },
  ],
};
import ListCards from "@/components/lists/ListCards";
import { document_wait_approval_list } from "@/api/home";
import turnAuditVue from "../common/turnAudit.vue";
import { debounce } from "@/js/public.js";
import noData from "@/components/common/noData";
export default {
  components: {
    ListCards,
    noData,
  },
  name: "ListBox",
  data() {
    return {
      loading: false,
      finished: false,
      ListBoxC,
      typeDropdown,
      list: [],
      data: {
        type: 1, // 1发文 2收文3签报
        lab: 1, // 1待我审核的 2待别人审核的
        page: 0, // 页数
        limit: 10, // 每页条数
        sort: "desc", // 排序方式 asc顺序 desc倒序
        kwd: "",
      },
    };
  },
  created() {},
  activated() {
    this.init();
    this.data.type = Number(this.$route.query.id);
    this.onLoad();
  },
  methods: {
    init() {
      this.loading = false;
      this.finished = false;
      this.list = [];
      this.data = {
        type: 1, // 1发文 2收文3签报
        lab: 1, // 1待我审核的 2待别人审核的
        page: 0, // 页数
        limit: 10, // 每页条数
        sort: "desc", // 排序方式 asc顺序 desc倒序
        kwd: "",
      };
    },
    onLoad() {
      this.data.page++;
      this.approval_list();
    },

    async approval_list() {
      this.loading = true;
      this.finished = false;
      let _res = await document_wait_approval_list(this.data);
      if (_res.code == 1) {
        this.list.push.apply(this.list, _res.data);
        this.loading = false;
        if (_res.data.length < this.data.limit) {
          this.finished = true;
        }
      }
      // console.log("_res", _res);
    },
    // tab切换
    lebFun() {
      this.data.page = 0;
      this.kwd = "";
      this.list = [];
      this.onLoad();
      // console.log(this.data);
    },
    // typeFun切换
    typeFun() {
      this.data.page = 0;
      this.kwd = "";
      this.list = [];
      this.onLoad();
    },
    onClear() {
      // this.data.page = 0;
      // this.list = [];
      // this.onLoad();
      this.data.kwd = "";
    },
    // 搜索框
    kwdFun: debounce(function () {
      this.data.page = 0;
      this.list = [];
      this.onLoad();
      // console.log(this.data);
    }, 800),
  },
};
</script>
<style lang="scss" scoped>
.ListBox {
  height: 100%;
  .ListBox-header {
    height: 110px;
    /deep/.van-tabs {
      height: 44px;
      font-size: 16px;
      font-weight: 500;
      .van-tabs__line {
        background-color: #0082ef;
        bottom: 0;
      }
    }
    .ListBox-search {
      padding: 15px;
      /deep/ .van-dropdown-menu__bar,
      .van-dropdown-menu__item {
        border-radius: 2px;
        height: 36px;
        width: 90px;
        .van-dropdown-menu__title {
          padding: 0 12px;
          left: -10px;
          .van-ellipsis {
            padding-right: 12px;
          }
        }
      }
      /deep/ .van-cell {
        padding: 10px 15px;
      }
      //   /deep/.van-dropdown-item {
      //     margin-left: 15px;
      //     top: 95px !important;
      //     width: 90px;
      //     .van-overlay {
      //       display: none;
      //     }
      //   }
      .ListBox-search-cell {
        margin-right: 12px;
      }
      .ListBox-search-div {
        flex: 1;
        height: 36px;
        background: #fff;
        /deep/.van-search {
          height: 36px;
          padding: 0;
          background: #fff;
          border-radius: 2px;
          .van-search__content {
            height: 36px;
            background: #fff;
            .van-cell {
              display: flex;
              align-items: center;
              padding: 0 12px;
              background: #fff !important;
            }
          }
        }
      }
    }
  }
  .ListBox-center {
    height: calc(100% - 110px);
    overflow-y: auto;
    padding: 0 15px;
  }
}
</style>
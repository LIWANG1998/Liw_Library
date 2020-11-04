<template>
  <div class="ListBox init">
    <header class="ListBox-header">
      <van-tabs
        :line-width="20"
        title-active-color="#0082ef"
        @click="optionFun"
        v-model="data.type"
      >
        <template v-for="v in ListBoxC">
          <van-tab :title="v.title" :name="v.name" :key="v.name"></van-tab>
        </template>
      </van-tabs>
      <div class="ListBox-search flex-ac">
        <div class="ListBox-search-cell">
          <van-dropdown-menu active-color="#0082ef">
            <van-dropdown-item
              v-model="data.b_type"
              :options="typeDropdown.option"
              @change="optionFun"
            />
          </van-dropdown-menu>
        </div>
        <div class="ListBox-search-div">
          <van-search
            v-model="data.kwd"
            :placeholder="'搜索公文'"
            @input="kwdFun"
            input-align="center"
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
            <list-card :item="v" :lab="data.type" :key="i" :type="data.b_type" />
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
    title: "待办公文",
  },
  {
    name: 2,
    title: "待阅公文",
  },
];
let typeDropdown = {
  option: [
    { text: "发文", value: 1 },
    { text: "收文", value: 2 },
    { text: "签报", value: 3 },
  ],
};
import ListCard from "@/components/lists/ListCard";
import { wait_document } from "@/api/home";
import { debounce } from "@/js/public.js";
import noData from "@/components/common/noData";
export default {
  components: {
    ListCard,
    noData,
  },
  name: "ListBoxs",
  data() {
    return {
      loading: false,
      finished: false,
      active: 1,
      ListBoxC,
      typeDropdown,
      list: [],
      data: {
        b_type: 1, // 1发文 2收文3签报
        page: 0, // 页数
        limit: 10, // 每页条数
        kwd: "",
        type: 1,
      },
    };
  },
  created() {},
  activated() {
    // console.log(this.$route.query);
    this.init();
    this.onLoad();
  },
  methods: {
    init() {
      this.loading = false;
      this.finished = false;
      this.active = 1;
      this.list = [];
      this.data = {
        b_type: 1, // 1发文 2收文3签报
        page: 0, // 页数
        limit: 10, // 每页条数
        kwd: "",
        type: 1,
      };
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
    }, 800),
    onLoad() {
      this.data.page++;
      this.approval_list();
    },
    async approval_list() {
      this.loading = true;
      this.finished = false;
      let _res = await wait_document(this.data);
      if (_res.code == 1) {
        // console.log(this.data.type, _res.data);
        this.list.push.apply(
          this.list,
          this.data.type == 1 ? _res.data.pendingFile : _res.data.toBeRead
        );
        // console.log(this.list);
        this.loading = false;
        if (this.data.type == 1) {
          if (_res.data.pendingFile.length < this.data.limit) {
            this.finished = true;
          }
        } else {
          if (_res.data.toBeRead.length < this.data.limit) {
            this.finished = true;
          }
        }
      }
    },
    optionFun(e) {
      this.data.page = 0;
      this.list = [];
      this.onLoad();
    },
    activeFun() {
      this.data.page = 0;
      this.list = [];
      this.onLoad();
    },
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
<template>
  <div class="overdueList-template">
    <van-sticky>
      <DropdownMenu>
        <DropdownItem
          v-model="time"
          title="时间范围"
          :options="timeData"
        />
        <DropdownItem
          v-model="level"
          :title="level==-1?'级别':''"
          :options="levelData"
        />
      </DropdownMenu>
    </van-sticky>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        class="list"
        @load="onLoad"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          @click="handleToItem(item.id, item.ex_type)"
        >
          <overdue-item-card :item-data="item" />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem } from "vant";
import { statistics } from "@/api";
import OverdueItemCard from "./components/overdueItemCard";
let moment = require("moment");
moment.locale("zh-cn"); //汉化
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    OverdueItemCard,
  },
  data() {
    return {
      time: 12,
      level: -1,
      timeData: [
        { text: "一个月内", value: 1 },
        { text: "一年内", value: 12 },
      ],

      levelData: [
        { text: "全部", value: -1 },
        { text: "普通", value: 0 },
        { text: "紧急", value: 1 },
        { text: "非常紧急", value: 2 },
      ],
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: {
        page: 0,
        num: 6,
      },
    };
  },
  computed: {
    query() {
      return { time: this.time, level: this.level };
    },
  },
  watch: {
    query() {
      this.loadData();
    },
  },
  created() {
    const { type } = this.$route.query;
    this.$route.meta.title =
      Number(type) === 0 ? "逾期公司详情" : "逾期个人详情";
  },
  methods: {
    handleToItem(id, type) {
      this.$router.push({ path: "/info", query: { id: id, type: type,name:"" } });
    },
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
        this.page.page = 1;
      } else {
        this.page.page++;
      }
      this.loadData();
    },
    async loadData() {
      let that = this;
      const { id, type } = this.$route.query;
      try {
        let result = "";
        if (type == 0) {
          const params = { ...this.query, id };
          result = await statistics.getCompanyTaskItem(params);
        } else {
          const params = { ...this.query, userid: id };
          result = await statistics.getPersonalTaskItem(params);
        }
        const {
          data: { data, total },
          code,
          msg,
        } = result;
        if (code === 1) {
          this.total = total;
          this.skeShow = false;
          this.loading = false;
          this.list = data;
          this.finished = true;
          if (this.page.page === 1) {
            this.list = data;
          } else {
            this.list = [...this.list, ...data];
          }
          if (this.list.length >= this.total) {
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
      } catch (e) {
        this.finished = true;
      }
    },
    //下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
};
</script>
<style lang="less" scope>
.overdueList-template {
  height: 100vh;
  width: 100%;
  overflow-y: scroll;
}
.list {
  min-height: 400px;
  padding-top: 15px;
}
.no-data {
  text-align: center;
  color: #a4cef4;
  img {
    width: 300px;
  }
}
</style>

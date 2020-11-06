<template>
  <div class="course-log">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="60"
        finished-text="没有更多了"
        class="list"
        @load="onLoad"
      >
        <div class="item" v-for="(item,index) in list" :key="index">
          <div class="flex">
            <div>
              <div class="title">如何发布任务</div>
            </div>
            <van-icon name="arrow" size="20" color="#C0C4CC" />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
//引入日期格式工具
let moment = require("moment");
moment.locale("zh-cn"); //汉化
import { task } from "@/api";
import { mapGetters } from "vuex";
export default {
  props: {
    type: {
      type: String,
      default: "executing",
    },
    query: {
      type: Object,
      default: {},
    },
    isFull: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      total: 0,
      page: {
        page: 0,
        num: 6,
      },
      params: {},
    };
  },
  watch: {
    type(val) {
      this.refreshing = true;
      this.onRefresh();
    },
  },

  created() {
    this.routerType = this.$route.query.type;
  },
  methods: {
    // 加载数据
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
        this.page.page = 1;
      } else {
        this.page.page++;
      }
      this.getDataList();
    },
    // 请求数据
    async getDataList() {
      try {
        this.params = Object.assign(this.params, this.page);
        const {
          code,
          data: { data, total },
        } = await task.list(this.params);
        if (code === 1) {
          this.total = total;
          this.skeShow = false;
          this.loading = false;
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
      } catch {
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
<style lang="less" scoped>
.course-log {
  height: 100%;
  overflow: hidden;
  .list {
    min-height: 400px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    align-items: center;
  }
  .item {
    padding: 10px 16px;
    padding-bottom: 0;
    background: #fff;
    border-bottom: 1px solid @white-light;
    .title {
      font-size: 18px;
    }
    .time {
      color: #909399;
    }
  }
}
</style>
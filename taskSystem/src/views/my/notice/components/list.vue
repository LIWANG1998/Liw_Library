<template>
  <div class="notice-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="160"
        finished-text="没有更多了"
        class="list"
        @load="onLoad"
      >
        <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="handleInfo(item)"
        >
          <div class="content">
            <van-tag type="danger" v-if="item.state == 0">NEW</van-tag>
            <span>
              {{ item.content }}
            </span>
          </div>
          <div class="time flex">
            <template v-if="item.task_id&&item.type!=5&&item.type!=6">
                <span>开始时间：{{item.task_start_time}}</span>
                <span>结束时间：{{item.task_end_time}}</span>
            </template>
            <span v-else>发送时间：{{item.send_time}}</span>
          </div>
          <div class="flex" v-if="item.type != 8">
            <span>查看详情</span>
            <van-icon name="arrow" />
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
import { common } from "@/api";
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
        limit: 10,
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
        } = await common.getNotice(this.params);
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
    //查看详情
    handleInfo(item) {
        if(item.type==5||item.type==6) {
             this.$router.push({
              path: "/report",
              query: { year: item.year, month: item.month,week:item.week,rang:item.type==5?1:2},
            });
        } else {
          if(item.type==8){
            return false;
          }
          this.$router.push({
            path: "/info",
            query: { id: item.task_id, look: 1,pageType:"executing",status:1 },
          });
        }
    },
  },
};
</script>
<style lang="less" scoped>
.notice-list {
  height: 100%;
  overflow: auto;
  .list {
    min-height: 400px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
  .item {
    padding: 10px;
    padding-bottom: 0;
    background: #fff;
    border-radius: 4px;
    margin: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: 0px 2px 4px rgba(48, 49, 51, 0.08);
    .content {
      background: #f8f8f8;
      padding: 10px;
      border-radius: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 34px;
    }
    .time {
      border-bottom: 1px solid #f2f2f2;
    }
  }
}
</style>

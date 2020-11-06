<template>
  <div class="chart-info">
    <van-sticky>
      <DropdownMenu>
        <DropdownItem
          @open="showMenu = 'start'"
          ref="start"
          title="发起时间"
        >
          <drop-item-new
            type="5"
            :data="query"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
        <DropdownItem
          @open="showMenu = 'end'"
          ref="end"
          title="结束时间"
        >
          <drop-item-new
            type="6"
            :data="query"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
        <DropdownItem
          title="筛选"
          ref="item"
          @open="showMenu = 'item'"
          icon="filter-o">
          <drop-item-new
            page="info"
            :data="query"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
      </DropdownMenu>
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="100"
        finished-text="没有更多了"
        class="list"
        @load="onLoad"
      >
        <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="handleInfo(item.userid, item.user_name)"
        >
          <van-row
            type="flex"
            justify="space-between"
            align="center"
            class="name"
          >
            <van-col>{{ item.name }}</van-col>
            <van-col class="icon">
              <van-icon name="arrow" />
            </van-col>
          </van-row>
          <div class="task">
            <van-row type="flex" justify="space-around">
              <van-col :span="12">
                任务总数<span class="number">{{ item.all_total_count }}</span>
              </van-col>
              <van-col :span="12">
                待处理<span class="number">{{ item.untreated_count }}</span>
              </van-col>
            </van-row>
            <van-row type="flex">
              <van-col :span="12">
                完成数量<span class="number">{{ item.finish_count }}</span>
              </van-col>
              <van-col :span="12">
                完成率<span class="number">{{ item.finish_rate }}%</span>
              </van-col>
            </van-row>
            <van-row type="flex" justify="space-around">
              <van-col :span="12">
                逾期数量<span class="number">{{ item.overdue_num }}</span>
              </van-col>
              <van-col :span="12">
                逾期次数<span class="number">{{ item.overdue_count }}</span>
              </van-col>
            </van-row>
            <van-row type="flex" justify="space-around">
              <van-col :span="12">
                逾期率<span class="number">{{ item.overdue_rate }}%</span>
              </van-col>
              <van-col :span="12">
                按时完成率<span class="number">{{ item.ontime_finish_rate }}%</span>
              </van-col>
            </van-row>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
import dropItemNew from "../components/dropItemNew";
import { statistics } from "@/api";
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    dropItemNew,
  },
  data() {
    return {
      showMenu:'',
      show:false,
      query: {
        task_role:[0, 1, 2, 3],
        initiator_type: 1,
        initiator_userid: "",
        participant_type: 1,
        participant_userid: "",
        level: [-1, 0, 1, 2],
        create_time_type: 1,
        create_time_start: "",
        create_time_end: "",
        end_time_type: 1,
        end_time_start: "",
        end_time_end: "",
      },
      timeData: [
        { text: "不限", value: 1 },
        { text: "一周内", value: 2 },
        { text: "一个月内", value: 3 },
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
      total: 0,
      page: {
        page: 0,
        limit: 8,
      },
    };
  },
  watch: {
    query: {
      handler() {
        this.refreshing = true;
        this.onRefresh();
      },
      deep: true,
    },
  },
  methods: {
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
        let params = Object.assign(this.query, this.page)
        params.task_role = params.task_role instanceof Array ? params.task_role.join(',') : params.task_role
        params.level = params.level instanceof Array ? params.level.join(',') : params.level
        const {
          code,
          data: { total, data },
        } = await statistics.getRankInfo(params);
        if (code === 1) {
          this.total = total;
          this.skeShow = false;
          this.loading = false;
          let listData = [];
          data.forEach((item, index) => {
            if (
              !(
                item.status == 0 &&
                item.remarks == "" &&
                item.file_url.length == 0
              )
            ) {
              listData.push(item);
            }
          });
          if (this.page.page === 1) {
            this.list = listData;
          } else {
            this.list = [...this.list, ...listData];
          }
          if (this.list.length >= this.total) {
            this.finished = true;
          }
          if (data.length == 0) {
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
    handleDorpItemCancel() {
      this.show = false
      this.$refs[this.showMenu].toggle();
    },
    handleDorpItemConfirm(val) {
      this.show = false
      this.query = Object.assign(this.query, val);
      this.$refs[this.showMenu].toggle();
      this.getDataList()
    },
    handleInfo(userid, name) {
      this.$router.push({
        path: `/taskUserList?ui=${userid}`,
        query: { userid: userid, name: name},
      });
    },
  },
};
</script>
<style lang="less" scoped>
.chart-info {
  font-size: 14px;
  .item {
    background: @white;
    box-shadow: 0px 2px 4px rgba(48, 49, 51, 0.08);
    border-radius: 4px;
    margin: 20px 15px 0;
    padding: 10px 15px 12px;
    line-height: 30px;
    .name {
      margin-bottom: 10px;
      .icon i {
        color: #c0c4cc;
        font-weight: bold;
      }
    }
    .task {
      background: #f8f8f9;
      color: #909399;
      padding: 10px 20px;
      .number {
        color: #1f305b;
        margin-left: 10px;
      }
    }
  }
}
</style>

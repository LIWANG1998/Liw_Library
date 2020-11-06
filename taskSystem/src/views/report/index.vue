<template>
  <div class="report-box">
    <van-sticky>
      <DropdownMenu>
        <DropdownItem v-model="query.type" :options="typeOptions" />
        <DropdownItem disabled title-class="time-box"></DropdownItem>
        <DropdownItem
          v-model="query.range"
          :title="query.range == 1 ? '报表范围' : ''"
          :options="rangeOptionNew"
        />
      </DropdownMenu>
      <div class="time" @click="timePickerShow = true">{{ time }}</div>
    </van-sticky>
    <van-skeleton title :row="10" :loading="loading">
      <div class="data-box">
        <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="handleInfo(item)"
        >
          <van-row class="header" type="flex" justify="space-between">
            <val-col class="gary">{{
              `${item.year}年${item.month}月 ${week[5 - parseInt(item.week)]}`
            }}</val-col>
            <val-col class="blue">查看详情</val-col>
          </van-row>
          <van-row type="flex">
            <van-col
              :class="[
                'tag',
                query.range == 2 ? 'depart' : query.range == 3 ? 'company' : '',
              ]"
              span="6"
            >
              {{
                query.range == 1 ? "个人" : query.range == 2 ? "部门" : "全员"
              }}
            </van-col>
            <van-col>
              <div class="summary">
                {{
                info.summary_type == 1
                ? "本周的任务执行情况非常优秀 再接再厉！"
                :info.summary_type == 2 ?  "本周的任务执行情况不是很理想，继续努力呦！" : "目前还没有相关任务，快来体验吧！"
                }}
              </div>
              <div class="task">
                <p>
                  相关任务总数
                  <span class="number">{{ item.total_count }}</span>
                </p>
                <p>
                  我发起的任务数
                  <span class="number">{{ item.launch_count }}</span>
                </p>
                <p>
                  逾期任务数 <span class="number">{{ item.overdue_num }}</span>
                </p>
                <p>
                  逾期率 <span class="number">{{ item.overdue_rate }} %</span>
                </p>
              </div>
              <div class="excitation">{{ item.excitation }}</div>
            </van-col>
          </van-row>
        </div>
      </div>
    </van-skeleton>
    <van-popup
      v-model="timePickerShow"
      position="bottom"
      safe-area-inset-bottom
      round
    >
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @change="dateChange"
        @cancel="timePickerShow = false"
      />
    </van-popup>
    <van-dialog
      v-model="infoShow"
      confirmButtonText="查看数据"
      show-cancel-button
      class="info-box"
      @confirm="handleLookData"
    >
      <div class="content">
        <div class="summary">
          {{
            info.summary_type == 1
              ? "本周的任务执行情况非常优秀 再接再厉！"
              :info.summary_type == 2 ?  "本周的任务执行情况不是很理想，继续努力呦！" : "目前还没有相关任务，快来体验吧！"
          }}
        </div>
        <div class="task">
          <van-row type="flex" justify="space-between">
            <van-col class="gary">相关任务总数</van-col>
            <van-col class="number">{{ info.total_count }}</van-col>
          </van-row>
          <van-row type="flex" justify="space-between">
            <van-col class="gary">我发起的任务数</van-col>
            <van-col class="number">{{ info.launch_count }}</van-col>
          </van-row>
          <van-row type="flex" justify="space-between">
            <van-col class="gary">逾期任务数</van-col>
            <van-col class="number">{{ info.overdue_num }}</van-col>
          </van-row>
          <van-row type="flex" justify="space-between">
            <van-col class="gary">逾期率</van-col>
            <van-col class="number">{{ info.overdue_rate }} %</van-col>
          </van-row>
        </div>
        <div class="excitation">
          <p>当前没有逾期任务</p>
          <p>本周任务按时完成率＞{{ info.ontime_finish_rate }}%</p>
          <p class="gary">
            (结束时间在本周的任务≥1:当前没有逾期任务，
            本周完成任务按时完成率＞{{ info.ontime_finish_rate }}%）
          </p>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
import { getYears, getMonths } from "@/utils/date";
import { statistics } from "@/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      query: {
        type: 2,
        range: 1,
        year: "",
        month: "",
        week: "",
      },
      info: {},
      typeOptions: [
        { text: "月报表", value: 2 },
        { text: "周报表", value: 1 },
      ],
      rangeOptions: [
        { text: "个人", value: 1 },
        { text: "部门 ", value: 2 },
        { text: "全员 ", value: 3 },
      ],
      rangeOptionNew: [],
      currentDate: new Date(),
      timePickerShow: false,
      week: ["第五周", "第四周", "第三周", "第二周", "第一周"],
      list: [1],
      infoShow: false,
      loading: true,
      userType: "", //0个人 1部门2公司3集团
    };
  },
  components: {
    DropdownMenu,
    DropdownItem,
  },
  watch: {
    query: {
      handler() {
        this.getData();
      },
      deep: true,
    },
  },
  created() {
    let nowDate = new Date();
    const { year, month, week, rang } = this.$route.query;
    if (year && month && rang) {
      this.query.type = parseInt(rang);
      this.query.year = year;
      this.query.month = month;
      this.query.week = week ? parseInt(week) : 4;
    } else {
      this.query.year = nowDate.getFullYear();
      this.query.month = nowDate.getMonth() + 1;
      this.query.week = 4;
    }
    this.rangeOptionNew = this.rangeOptions.filter((item) => {
      if (this.userInfo.type == 0) {
        return item.value == 1;
      } else if (this.userInfo.type == 1) {
        return item.value < 3;
      } else if (this.userInfo.type == 2) {
        return item.value == 1 || item.value == 2 || item.value == 3;
      }
    });
  },
  computed: {
    ...mapGetters(["userInfo"]),
    time() {
      if (this.query.type == 1) {
        // console.log(4 - this.query.week)
        return `${this.query.year}年${this.query.month}月 ${
          this.week[4 - this.query.week]
        }`;
      } else {
        return `${this.query.year}年${this.query.month}月`;
      }
    },
    columns() {
      if (this.query.type == 1) {
        return [
          {
            values: getYears(),
            defaultIndex: 0,
          },
          // 第二列
          {
            values: getMonths(this.query.year),
            defaultIndex: 0,
          },
          {
            values: this.week,
            defaultIndex: 0,
          },
        ];
      } else {
        return [
          {
            values: getYears(),
            defaultIndex: 0,
          },
          // 第二列
          {
            values: getMonths(this.query.year),
            defaultIndex: 0,
          },
        ];
      }
    },
  },
  methods: {
    async getData() {
      const { code, data } = await statistics.getReportData(this.query);
      this.loading = false;
      if (code) {
        this.list = data;
      }
    },
    onConfirm(val) {
      this.query.year = parseInt(val[0]);
      this.query.month = parseInt(val[1]);
      if (this.query.type == 1) {
        this.query.week = 4 - this.week.findIndex((item) => item == val[2]);
      }
      this.timePickerShow = false;
    },
    dateChange(e, val) {
      this.query.year = parseInt(val[0]);
    },
    handleInfo(val) {
      this.info = val;
      this.infoShow = true;
    },
    handleLookData() {
      this.$router.push("/statistics");
    },
  },
};
</script>
<style lang="less" scoped>
.report-box {
  /deep/.time-box {
    &::after {
      display: none;
    }
    background: #fff;
    width: 100%;
    color: #303133;
    height: 32px;
    line-height: 32px;
    border-radius: 2px;
  }
  /deep/.van-dropdown-menu__item--disabled {
    flex: 1.5;
  }
  .time {
    position: absolute;
    width: 46%;
    top: 9px;
    background: #f5f7fa;
    height: 32px;
    line-height: 32px;
    left: 27%;
    padding-left: 10px;
  }
  .gary {
    color: #909399;
  }
  .data-box {
    .item {
      background: @white;
      margin: 30px 20px 0;
      box-shadow: 0px 2px 12px rgba(48, 49, 51, 0.1);
      border-radius: 4px;
      color: #3f434e;
      padding: 0 21px 38px;
      font-size: 14px;
    }
    .blue {
      color: @blue;
    }
    .header {
      padding: 10px 0;
      border-bottom: 1px solid #e8e8e8;
      margin-bottom: 10px;
    }
    .tag {
      background: #fff6e8;
      color: #fca822;
      width: 72px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-right: 10px;
      font-size: 14px;
      &.depart {
        background: #dff0ff;
        color: @blue;
      }
      &.company {
        background: #edfcea;
        color: #39d513;
      }
    }
    .summary {
      font-size: 18px;
      font-weight: 600;
    }
    .task {
      color: #909399;
      margin-top: 18px;
      .number {
        color: #1f305b;
        font-size: 16px;
        margin-left: 10px;
      }
    }
    .excitation {
      color: #c8af87;
      margin-top: 15px;
    }
  }
  .info-box {
    border-radius: 4px;
    .content {
      padding: 20px;
      font-size: 14px;
      .summary {
        font-size: 18px;
        font-weight: 600;
      }
      .number {
        color: #1f305b;
      }
      .task {
        background: #f5f6fb;
        padding: 10px;
        margin: 15px 0;
        line-height: 30px;
        .gary {
          color: #a2a8c5;
        }
      }
    }
  }
  .info-box{
    padding-bottom: 0;
  }
}
</style>

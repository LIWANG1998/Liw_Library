<template>
  <div>
    <van-skeleton title :row="10" :loading="loading">
      <div class="chart-card first-card">
        <div class="rank-title">
          <p>任务总数</p>
          <a v-if="userInfo.type == 2" @click="handleToList('all_num', '任务总数')">查看详情</a>
        </div>
          <ve-bar
            v-if="total_count_list.rows.length > 0"
            :data="total_count_list"
            :settings="totalSettings"
            :extend="chartExtend"
            height="310px"
          />
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
        </div>
      </div>
      <div class="chart-card first-card">
        <div class="rank-title">
          <p>待处理</p>
          <a v-if="userInfo.type == 2" @click="handleToList('process_num', '待处理')">查看详情</a>
        </div>
        <ve-bar
          v-if="untreated_count_list.rows.length > 0"
          :data="untreated_count_list"
          :settings="nohandleSettings"
          :extend="chartExtend"
          height="310px"
        />
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
        </div>
      </div>
      <div class="chart-card first-card">
        <div class="rank-title">
          <p>逾期次数</p>
          <a v-if="userInfo.type == 2" @click="handleToList('out_time', '逾期次数')">查看详情</a>
        </div>
        <ve-bar
          v-if="overdue_num_list.rows.length > 0"
          :data="overdue_num_list"
          :settings="overCountSettings"
          :extend="chartExtend"
          height="310px"
        />
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
        </div>
      </div>
      <div class="chart-card first-card">
        <div class="rank-title">
          <p>逾期数量</p>
          <a v-if="userInfo.type == 2" @click="handleToList('out_time_num', '逾期数量')">查看详情</a>
        </div>
        <ve-bar
          v-if="overdue_count_list.rows.length > 0"
          :data="overdue_count_list"
          :settings="overNumSettings"
          :extend="chartExtend"
          height="310px"
        />
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
        </div>
      </div>
      <div class="chart-card first-card">
        <div class="rank-title">
          <p>逾期率</p>
          <a v-if="userInfo.type == 2" @click="handleToList('out_time_rate', '逾期率')">查看详情</a>
        </div>
        <ve-bar
          v-if="overdue_count_rate.rows.length > 0"
          :data="overdue_count_rate"
          :settings="overRateSettings"
          :extend="chartExtend"
          height="310px"
        />
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
        </div>
      </div>
      <div class="chart-card first-card">
        <div class="rank-title">
          <p>完成数量</p>
          <a v-if="userInfo.type == 2" @click="handleToList('run_num', '完成数量')">查看详情</a>
        </div>
        <ve-bar
          v-if="finish_count_list.rows.length > 0"
          :data="finish_count_list"
          :settings="finishNUmSettings"
          :extend="chartExtend"
          height="310px"
        />
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
        </div>
      </div>
      <div class="chart-card first-card">
        <div class="rank-title">
          <p>完成率</p>
          <a v-if="userInfo.type == 2" @click="handleToList('run_rate', '完成率')">查看详情</a>
        </div>
        <ve-bar
          v-if="finish_count_rate.rows.length > 0"
          :data="finish_count_rate"
          :settings="finishRateSettings"
          :extend="chartExtend"
          height="310px"
        />
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
        </div>
      </div>
      <div class="chart-card first-card">
        <div class="rank-title">
          <p>个人排行</p>
          <a v-if="userInfo.type == 2" @click="handleToList('run_time_rate', '按时完成率')">查看详情</a>
        </div>
        <ve-bar
          v-if="finish_time_rate.rows.length > 0"
          :data="finish_time_rate"
          :settings="ontimeFinishRateSettings"
          :extend="chartExtend"
          height="310px"
        />
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
        </div>
      </div>
    </van-skeleton>
  </div>
</template>
<script>
import VeBar from "v-charts/lib/bar.common";
import { mapGetters } from "vuex";
import { statistics } from "@/api";

const colorBlue = [
  "#104A7B",
  "#185B94",
  "#177ACE",
  "#3495E5",
  "#4C8FC7",
  "#60AEF2",
  "#88BBE8",
  "#AFD2F1",
  "#C5DBEF",
  "#D4E9FB",
];
const colorRed = [
  "#CF3131",
  "#C44646",
  "#EB5151",
  "#F37A7A",
  "#F5A0A0",
  "#ECAC3E",
  "#EFBC64",
  "#F3CD8B",
  "#F7DEB1",
  "#FBEED8",
];
export default {
  components: {
    VeBar,
  },
  props: {
    query: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      chartExtend: {
        series: {
          barMaxWidth: 20,
        },
        legend: {
          show: false,
        },
        xAxis: {},
        grid: {
          top: "5%",
          left: "5%",
          right: "8%",
          bottom: "5%",
          containLabel: true,
        },
      },
      //个人排行(任务总数)
      totalSettings: {
        labelMap: {
          num: '数量',
          overdue_rate:'逾期率（%）',
          finish_rate:'完成率（%）',
          ontime_finish_rate:'按时完成率（%）',
        },
        itemStyle: {
          normal: {
            //每个柱子的颜色即为personalColor数组里的每一项，如果柱子数目多于personalColor的长度，则柱子颜色循环使用该数组
            color: function (params) {
              return colorBlue[params.dataIndex];
            },
          },
        },
      },
      //个人排行(待处理)
      nohandleSettings: {
        labelMap: {
          num: '数量',
          overdue_rate:'逾期率（%）',
          finish_rate:'完成率（%）',
          ontime_finish_rate:'按时完成率（%）',
        },
        itemStyle: {
          normal: {
            //每个柱子的颜色即为personalColor数组里的每一项，如果柱子数目多于personalColor的长度，则柱子颜色循环使用该数组
            color: function (params) {
              return colorRed[params.dataIndex];
            },
          },
        },
      },
      //个人排行(逾期次数)
      overCountSettings: {
        labelMap: {
          num: '次数',
          overdue_rate:'逾期率（%）',
          finish_rate:'完成率（%）',
          ontime_finish_rate:'按时完成率（%）',
        },
        itemStyle: {
          normal: {
            //每个柱子的颜色即为personalColor数组里的每一项，如果柱子数目多于personalColor的长度，则柱子颜色循环使用该数组
            color: function (params) {
              return colorBlue[params.dataIndex];
            },
          },
        },
      },
      //个人排行(逾期数量)
      overNumSettings: {
        labelMap: {
          num: '数量',
          overdue_rate:'逾期率（%）',
          finish_rate:'完成率（%）',
          ontime_finish_rate:'按时完成率（%）',
        },
        itemStyle: {
          normal: {
            //每个柱子的颜色即为personalColor数组里的每一项，如果柱子数目多于personalColor的长度，则柱子颜色循环使用该数组
            color: function (params) {
              return colorRed[params.dataIndex];
            },
          },
        },
      },
      //个人排行(逾期率)
      overRateSettings: {
        labelMap: {
          num: '逾期率',
          overdue_rate:'逾期率',
          finish_rate:'完成率',
          ontime_finish_rate:'按时完成率',
        },
        digit: 2,
        xAxisType: ['percent'],
        itemStyle: {
          normal: {
            //每个柱子的颜色即为personalColor数组里的每一项，如果柱子数目多于personalColor的长度，则柱子颜色循环使用该数组
            color: function (params) {
              return colorBlue[params.dataIndex];
            },
          },
        },
      },
      //个人排行(完成数量)
      finishNUmSettings: {
        labelMap: {
          num: '数量',
          overdue_rate:'逾期率（%）',
          finish_rate:'完成率（%）',
          ontime_finish_rate:'按时完成率（%）',
        },
        itemStyle: {
          normal: {
            //每个柱子的颜色即为personalColor数组里的每一项，如果柱子数目多于personalColor的长度，则柱子颜色循环使用该数组
            color: function (params) {
              return colorRed[params.dataIndex];
            },
          },
        },
      },
      //个人排行(完成率)
      finishRateSettings: {
        labelMap: {
          num: '次数',
          overdue_rate:'逾期率',
          finish_rate:'完成率',
          ontime_finish_rate:'按时完成率',
        },
        digit: 2,
        xAxisType: ['percent'],
        itemStyle: {
          normal: {
            //每个柱子的颜色即为personalColor数组里的每一项，如果柱子数目多于personalColor的长度，则柱子颜色循环使用该数组
            color: function (params) {
              return colorBlue[params.dataIndex];
            },
          },
        },
      },
      //个人排行(按时完成率)
      ontimeFinishRateSettings: {
        labelMap: {
          num: '次数',
          overdue_rate:'逾期率',
          finish_rate:'完成率',
          ontime_finish_rate:'按时完成率',
        },
        digit: 2,
        xAxisType: ['percent'],
        itemStyle: {
          normal: {
            //每个柱子的颜色即为personalColor数组里的每一项，如果柱子数目多于personalColor的长度，则柱子颜色循环使用该数组
            color: function (params) {
              return colorRed[params.dataIndex];
            },
          },
        },
      },
      total_count_list: {
        columns: ["name", "num"],
        rows: [],
      },
      untreated_count_list: {
        columns: ["name", "num"],
        rows: [],
      },
      overdue_num_list: {
        columns: ["name", "num"],
        rows: [],
      },
      overdue_count_list: {
        columns: ["name", "num"],
        rows: [],
      },
      overdue_count_rate: {
        columns: ["name", "overdue_rate"],
        rows: [],
      },
      finish_count_list: {
        columns: ["name", "num"],
        rows: [],
      },
      finish_count_rate: {
        columns: ["name", "finish_rate"],
        rows: [],
      },
      finish_time_rate: {
        columns: ["name", "ontime_finish_rate"],
        rows: [],
      },
      aythorityType: 1,
      loading: true,
      title: {
        2: "部门排行(逾期次数)",
        3: "公司排行(逾期次数)",
      },
    };
  },
  watch: {
    query: {
      handler(val) {
        this.loadChartData(val);
      },
      immediate: true,
      deep:true,
    },
  },
  computed:{
  ...mapGetters(["userInfo"]),
  },

  created() {
    const { type } = this.$route.query;
    this.aythorityType = Number(type);
  },
  methods: {
    handleToList(pageType, name) {
      this.$router.push({
        path: "/statistics/chart/info",
        query: { pageType: pageType, name: name },
      });
    },

    async loadChartData(val) {
      let that = this;
      try {
        const { data, msg, code } = await statistics.getRankData(val);
        if (code === 1) {
          this.total_count_list.rows = data.total_count_list;
          this.untreated_count_list.rows = data.untreated_count_list;
          this.overdue_count_list.rows = data.overdue_count_list;
          this.finish_count_list.rows = data.finish_count_list;
          data.overdue_num_list.forEach(item =>{
            item.overdue_rate = item.overdue_rate == 0 ? 0.00 : item.overdue_rate * 0.01
          })
          this.overdue_num_list.rows = data.overdue_num_list;
          this.overdue_count_rate.rows = data.overdue_num_list;
          data.finish_count_list.forEach(item =>{
            // item.ontime_finish_rate = item.ontime_finish_rate * 0.01
            item.ontime_finish_rate = item.ontime_finish_rate == 0 ? 0.00 : item.ontime_finish_rate * 0.01
            item.finish_rate = item.finish_rate == 0 ? 0.00 : item.finish_rate * 0.01
          })
          // console.log(data.finish_count_list)
          this.finish_count_rate.rows = data.finish_count_list;
          this.finish_time_rate.rows = data.finish_count_list;
        } else {
          return this.$notify({ type: "danger", message: msg });
        }
        setTimeout(() => {
          that.loading = false;
        }, 500);
      } catch (e) {
        setTimeout(() => {
          that.loading = false;
        }, 500);
        throw e;
      }
    },
  },
};
</script>

<style scoped lang="less">
.chart-card {
  background-color: #ffffff;
  box-shadow: 0px 3px 6px rgba(48, 49, 51, 0.08);
  margin: 0 16px 15px;
  .rank-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    padding: 10px 10px 0;
    p {
      color: #303133;
    }
    a {
      color: #0082ef;
    }
  }
}
/deep/.noselect {
  width: 100% !important;
}
.first-card {
  margin-top: 25px;
}
.no-data {
  height: 310px;
  text-align: center;
  color: #a4cef4;
  img {
    width: 300px;
  }
}
</style>

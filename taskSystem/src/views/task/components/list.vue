<template>
  <div class="task-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="60"
        finished-text="没有更多了"
        class="list"
        @load="onLoad"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="['item', role[item.role], getStatus(item).class]"
          @click="handleInfo(item.id, item.status, item.look)"
        >
          <div class="title">
            {{ item.title }}
            <span v-if="item.look != 0 && item.role != 0" class="new"
              >New !</span
            >
          </div>

          <div class="level-box">
            <template v-if="item.role == 0">
              <span class>发起</span>
            </template>
            <template v-if="item.role == 1">
              <span>接收</span>
            </template>
            <template v-if="item.role == 2">
              <span>抄送</span>
            </template>
            <span class="level">
              <svg-icon
                icon-class="fire"
                class="nav-icon"
                v-for="(lItem, lIndex) in getLevel(item.level)"
                :key="lIndex"
              />
            </span>
          </div>
          <div :class="['time']">{{ getStatus(item).time }}</div>
          <div class="rate status">
            {{ getStatus(item).text }}
            <van-icon name="arrow" />
          </div>
          <div v-if="type == 'drafts'" class="creat-time">
            创建时间 {{ item.creat_time | timeFormat("MM月DD日 HH:mm") }}
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
import { task, statistics } from "@/api";
import { mapGetters } from "vuex";
export default {
  props: {
    type: {
      type: String,
      default: "executing",
    },
    query: {
      type: Object,
      default:()=> {},
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
      role: {
        0: "start",
        1: "receive",
        2: "cc",
      },
      status: {
        0: "to-begin",
        1: "execute",
        2: "overdue",
        3: "finish",
      },
      params: {},
      routerType: 0,
    };
  },
  watch: {
    type(val) {
      this.refreshing = true;
      this.onRefresh();
    },
    query: {
      handler(val) {
        console.log(45454, val)
        this.params = Object.assign({}, val);
        this.refreshing = true;
        this.onRefresh();
        this.$store.commit(
          "SET_TASK_LIST_QUERY",
          Object.assign({}, { path: this.$route.path }, this.query)
        );
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["taskListQuery"]),
  },
  created() {
    this.routerType = this.$route.query.type;
  },
  methods: {
    // 获取任务状态
    getStatus(item) {
      let start = moment(item.start_time);
      let end = moment(item.end_time);
      let finish = item.finish_time; //整体任务完成时间
      let receiveFinish = item.new_end_time; //接收人完成任务时间
      let now = moment(new Date());
      let totalDay = this.calcDiffDay(start, end);
      let finshDay = this.calcDiffDay(moment(receiveFinish), now); //接送者完成任务剩余天数
      let format = "MM月DD日 HH:mm";
      let time = `${start.format(format)}-${end.format(format)}`;
      let overdueDay =
        receiveFinish == 0
          ? this.calcDiffDay(end, now)
          : this.calcDiffDay(moment(receiveFinish), end);
      if (this.type == "drafts") {
        return {
          class: this.status[1],
          text: "",
          time: `${time} 共${totalDay}天`,
        };
      }
      if (Number(this.routerType) === 7) {
        if ((item.role = 0 || item.role) == 2) {
          overdueDay = finish
            ? this.calcDiffDay(moment(finish), now)
            : this.calcDiffDay(end, now);
        } else {
          overdueDay =
            receiveFinish && item.completion > 0
              ? this.calcDiffDay(moment(receiveFinish), end)
              : this.calcDiffDay(end, now);
        }
        return {
          class: this.status[2],
          text: "逾期",
          time: `${time} 逾期${overdueDay}天`,
        };
      }
      if (item.role == 0 || item.role == 2) {
        if (item.status == 1) {
          if (moment(start).isAfter(moment(now))) {
            return {
              class: this.status[0],
              text: "待开始",
              time: `${time} 共${totalDay}天`,
            };
          } else {
            if (item.finish_time == 0 || item.finish_time == "") {
              if (moment(now).isAfter(moment(end))) {
                return {
                  class: this.status[2],
                  text: "逾期" + item.completion + "%",
                  time: `${time} 逾期${this.calcDiffDay(end, now)}天`,
                };
              } else {
                return {
                  class: this.status[1],
                  text: item.completion + "%",
                  time: `${time} 共${totalDay}天`,
                };
              }
            }

            if (item.completion < 100 && moment(finish).isAfter(moment(end))) {
              return {
                class: this.status[2],
                text: "逾期" + item.completion + "%",
                time: `${time} 逾期${this.calcDiffDay(end, moment(finish))}天`,
              };
            }
            if (item.completion == 100) {
              if (moment(item.finish_time).isAfter(end)) {
                return {
                  class: this.status[2],
                  text: "逾期完成" + item.completion + "%",
                  time: `${time} 逾期${this.calcDiffDay(
                    end,
                    moment(finish)
                  )}天`,
                };
              }
              return {
                class: this.status[3],
                text: "完成",
                time: `${time} 共${totalDay}天`,
              };
            }
            return {
              class: this.status[1],
              text: item.completion + "%",
              time: `${time} 共${totalDay}天`,
            };
          }
        } else {
          if (
            item.completion < 100 &&
            moment(item.finish_time).isAfter(moment(end))
          ) {
            return {
              class: this.status[2],
              text: "逾期" + item.completion + "%",
              time: `${time} 逾期${this.calcDiffDay(end, moment(finish))}天`,
            };
          }
          if (item.completion == 100) {
            if (moment(item.finish_time).isAfter(end)) {
              return {
                class: this.status[2],
                text: "逾期完成" + item.completion + "%",
                time: `${time} 逾期${this.calcDiffDay(end, moment(finish))}天`,
              };
            }
            return {
              class: this.status[3],
              text: "完成",
              time: `${time} 共${totalDay}天`,
            };
          }
          return {
            class: this.status[3],
            text: "完成",
            time: `${time} 共${totalDay}天`,
          };
        }
      }
      if (item.role == 1) {
        if (item.status == 1) {
          if (moment(start).isAfter(moment(now))) {
            return {
              class: this.status[0],
              text: "待开始",
              time: `${time} 共${totalDay}天`,
            };
          } else {
            if (receiveFinish == 0 && moment(now).isAfter(end)) {
              return {
                class: this.status[2],
                text: "逾期",
                time: `${time} 逾期${overdueDay}天`,
              };
            } else {
              if (item.completion == 0) {
                if (moment(now).isAfter(end)) {
                  return {
                    class: this.status[2],
                    text: "逾期",
                    time: `${time} 逾期${this.calcDiffDay(end, now)}天`,
                  };
                }
                return {
                  class: this.status[1],
                  text: "进行中",
                  time: `${time} 剩余${overdueDay}天`,
                };
              }
              else if (item.completion == 100) {
                if (moment(receiveFinish).isBefore(end)) {
                  return {
                    class: this.status[3],
                    text: "已完成",
                    time: `${time} 剩余${overdueDay}天`,
                  };
                } else {
                  return {
                    class: this.status[2],
                    text: "已逾期完成",
                    time: `${time} 逾期${overdueDay}天`,
                  };
                }
              }
              else {
                return {
                  class: this.status[3],
                  text: "已完成"+item.completion+"%"
                };
              }
            }
          }
        } else {
          if (receiveFinish == 0) {
            return {
              class: this.status[0],
              text: "未完成",
              time: `${time} 共${overdueDay}天`,
            };
          }
          if (moment(receiveFinish).isBefore(now)) {
            return {
              class: this.status[3],
              text: "已完成",
              time: `${time} 剩余${overdueDay}天`,
            };
          } else {
            return {
              class: this.status[2],
              text: "已逾期完成",
              time: `${time} 逾期${overdueDay}天`,
            };
          }
        }
      }
    },
    calcDiffDay(date1, date2) {
      let diffday = date2.diff(date1, "days");
      return Math.abs(Math.floor(diffday * 10) / 10);
    },
    // 获取任务级别
    getLevel(level) {
      if (level != null && level != undefined) {
        const levelImg = require(`@/assets/images/level2.png`);
        let imgs = [];
        for (let i = 0; i < Number(level) + 1; i++) {
          imgs.push(levelImg);
        }
        return imgs;
      }
    },
    //查看任务详情
    handleInfo(id, status, look) {
      this.$store.commit(
        "SET_TASK_LIST_QUERY",
        Object.assign({}, { path: this.$route.path }, this.query)
      );
      this.$router.push({
        path: "/info",
        query: { id: id, pageType: this.type, status: status, look: look },
      });
    },
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
        let result = {};
        if (this.type == "allTask") {
          result = await statistics.getStatisTask(this.params);
        } else if(this.type == "taskUserList"){//从统计任务进入的任务list
          result = await statistics.getCountUserDetails(this.params);
        } else {
          result = await task.list(this.params);
        }
        const {
          code,
          data: { data, total },
        } = result;
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
.task-list {
  height: 100%;
  overflow: hidden;
  .list {
    min-height: 400px;
  }
  .item {
    padding: 10px 10px 10px 16px;
    background: #fff;
    border-radius: 4px;
    margin: 16px;
    position: relative;
    overflow: hidden;
    .green {
      color: @green-light;
    }
    .blue {
      color: @blue;
    }
    &::before {
      content: "";
      display: block;
      width: 6px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: #7086b3;
    }
    &.start {
      &::before {
        background: @start-color;
      }
      .level-box {
        color: @start-color;
      }
    }
    &.receive {
      &::before {
        background: @receive-color;
      }
      .level-box {
        color: @receive-color;
      }
    }
    &.cc {
      &::before {
        background: @cc-color;
      }
      .level-box {
        color: @cc-color;
      }
    }
    &.to-begin {
      .time {
        background: linear-gradient(
          84deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(230, 230, 230, 1) 100%
        );
        font-size: 13px;
        border-radius: 4px;
        padding: 4px 14px 4px 0;
        display: inline-block;
        color: #909399;
      }
      .status {
        color: #909399;
        font-weight: 400;
      }
    }
    &.execute {
      .time {
        background: linear-gradient(
          84deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(223, 238, 255, 1) 100%
        );
        font-size: 13px;
        border-radius: 4px;
        padding: 4px 14px 4px 0;
        display: inline-block;
        color: #0082ef;
      }
      .status {
        color: #0082ef;
        font-weight: 400;
      }
    }
    &.overdue {
      .time {
        background: linear-gradient(
          276deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 235, 235, 1) 100%
        );
        font-size: 13px;
        border-radius: 4px;
        padding: 4px 14px 4px 0;
        display: inline-block;
        color: #f56c6c;
      }
      .status {
        color: #f56c6c;
        font-weight: 400;
      }
    }
    &.finish {
      .time {
        background: linear-gradient(
          276deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(230, 249, 222, 1) 100%
        );
        font-size: 13px;
        border-radius: 4px;
        padding: 4px 14px 4px 0;
        display: inline-block;
        color: #67c23a;
      }
      .status {
        color: #67c23a;
        font-weight: 400;
      }
    }
    .title {
      font-size: 16px;
      color: @black-medium;
      .new {
        color: @red-medium;
        font-size: 14px;
        margin-left: 5px;
      }
    }
    .level-box {
      margin: 8px 0;
      font-size: 14px;
      .level {
        margin-left: 10px;
        img {
          width: 12px;
          margin-right: 3px;
          position: relative;
          top: 2px;
        }
      }
    }
    .creat-time {
      color: @gray;
      margin-top: 14px;
      font-size: 12px;
    }
    .gray {
      color: @gray-dark-txt;
    }
    .rate {
      position: absolute;
      top: 40%;
      right: 10px;
      transform: translateY(-50%);
      font-size: 18px;
      display: flex;
      align-items: center;
      color: @gray-dark-txt;
      i {
        color: @gray-icon;
      }
    }
  }
}
</style>

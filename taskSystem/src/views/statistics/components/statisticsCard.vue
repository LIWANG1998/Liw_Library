<template>
  <div class="card">
    <div
      v-for="(item, index) in getImgList"
      :key="item.id"
      class="task-img"
      :style="{ color: item.color }"
    >
      <div
        v-if="(index < 3) || (true)"
        @click="handleChart(item.id,item)"
      >
        <img :src="item.img">
        <p
          v-if="index < 3"
          class="task-number"
        >
          {{ taskNumber[index] }}
        </p>
        <img
          v-else
          class="task-icon"
          src="@/assets/images/statistics/icon-chart.png"
        >
        <p class="task-name">
          {{ item.title }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { statistics } from "@/api";
import { mapGetters } from "vuex";
export default {
  props: {
    query: {
      time: 999,
      level: 999,
    },
  },
  data() {
    return {
      imgList: [
        {
          id: "1",
          img: require("@/assets/images/statistics/ownTask.png"),
          title: "我参与的任务",
          color: "#4DBA4A",
          type: 4,
          href: "/my/taskList",
        },
        {
          id: "2",
          img: require("@/assets/images/statistics/overdueTask.png"),
          title: "已逾期任务",
          color: "#F56C6C",
          type: 7,
          href: "/my/taskList",
        },
        {
          id: "3",
          img: require("@/assets/images/statistics/timingTask.png"),
          title: "按时完成任务",
          color: "#0082EF",
          type: 8,
          href: "/my/taskList",
        },
        {
          id: "4",
          img: require("@/assets/images/statistics/overdueRank.png"),
          title: "逾期排行榜",
          color: "#DFD0A6",
        },
      ],
      taskNumber: [0, 0, 0],
      aythority: {},
    };
  },
  watch: {
    query: {
      handler(val) {
        this.onLoadCount(val);
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    getImgList() {
      if (this.power.type == 0||this.power.type == null) {
        return this.imgList.filter((item, index) => index != 3);
      }
      return this.imgList;
    },
  },
  methods: {
    // 跳转排行图表页
    handleChart(id, item) {
      if (id === "4") {
        this.$router.push({
          path: `/statistics/overdueRank`,
          query: { type: this.power.type },
        });
        return;
      } else {
        this.$router.push({
          path: item.href,
          query: { type: item.type },
        });
      }
    },

    async onLoadCount(val) {
      try {
        const { code, data, msg } = await statistics.getStatisticsCount(val);
        if (code === 1) {
          this.formatTaskNumber(data);
          return;
        } else {
          return this.$notify({ type: "danger", message: msg });
        }
      } catch (e) {
        throw e;
      }
    },

    formatTaskNumber(data) {
      let taskNumber = [];
      taskNumber.push(
        data.partake || 0,
        data.overtime || 0,
        data.punctual || 0
      );
      this.taskNumber = taskNumber;
    },
  },
};
</script>
<style scoped lang="less">
.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 10px;
  .task-img {
    height: 85px;
    width: 172px;
    margin: 10px 0px;
    position: relative;
    img {
      width: 100%;
    }
    .task-number {
      position: absolute;
      width: 84px;
      font-size: 40px;
      text-align: center;
      top: 0px;
      right: 20px;
    }
    .task-icon {
      position: absolute;

      font-size: 40px;
      top: 10px;
      right: 40px;
      width: 37px;
    }
    .task-name {
      position: absolute;
      right: 20px;
      bottom: 10px;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style
>>

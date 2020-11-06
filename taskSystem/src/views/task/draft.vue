<template>
  <div class="task">
    <van-sticky>
      <DropdownMenu>
        <DropdownItem
          v-model="time"
          :title="time==0?'创建时间':''"
          :options="timeData"
        />
        <DropdownItem
          v-model="level"
          :title="level==-1?'级别':''"
          :options="levelData"
        />
      </DropdownMenu>
    </van-sticky>
    <list
      type="drafts"
      :query="query"
    />
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
import list from "./components/list";
import { task } from "@/api";
import { mapGetters } from "vuex";
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    list
  },
  data() {
    return {
      type: 2,
      time: 0,
      level: -1,
      timeData: [
        { text: "全部", value: 0 },
        { text: "3日内", value: 3 },
        { text: "7日内", value: 7 },
        { text: "15日内", value: 15 },
        { text: "30日内", value: 30 }
      ],
      levelData: [
        { text: "全部", value: -1 },
        { text: "普通", value: 0 },
        { text: "紧急", value: 1 },
        { text: "非常紧急", value: 2 }
      ]
    };
  },
  created() {
    if (this.$route.path !== this.taskListQuery.path) {
      this.$store.commit("SET_TASK_LIST_QUERY", {});
    } else {
      const { time, level } = this.taskListQuery;
      this.time = time;
      this.level = level;
    }
  },
  computed: {
    ...mapGetters(["taskListQuery"]),
    query() {
      return {
        type: this.type,
        time: this.time,
        level: this.level
      };
    }
  }
};
</script>
<style lang="less">
</style>
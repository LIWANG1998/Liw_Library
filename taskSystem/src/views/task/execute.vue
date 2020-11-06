<template>
  <div class="task">
    <van-sticky>
      <DropdownMenu>
        <DropdownItem v-model="state" :title="state==0?'状态':''" :options="stateData" />
        <DropdownItem
          v-model="sort"
          :title="sort===''?'排序':''"
          :options="sortData"
        />
        <DropdownItem
          v-model="role"
          :title="role==0?'类型':''"
          :options="roleData"
        />
        <DropdownItem
          v-model="level"
          :title="level==-1?'级别':''"
          :options="levelData"
        />
      </DropdownMenu>
    </van-sticky>
    <list
      type="executing"
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
    list,
  },
  data() {
    return {
      state: 0,
      ex_type: 0,
      level: -1,
      sort: "",
      role: 0,
      type: 0,
      stateData: [
        { text: "全部", value: 0 },
        { text: "待开始", value: 3 },
        { text: "逾期", value: 1 },
        { text: "正常", value: 2 },
      ],
      sortData: [
        { text: "开始时间", value: 1 },
        { text: "截至时间", value: 0 },
      ],
      roleData: [
        { text: "全部", value: 0 },
        { text: "发起", value: 1 },
        { text: "接收", value: 2 },
        { text: "抄送", value: 3 },
      ],
      levelData: [
        { text: "全部", value: -1 },
        { text: "普通", value: 0 },
        { text: "紧急", value: 1 },
        { text: "非常紧急", value: 2 },
      ],
    };
  },
  created() {
    if (this.$route.path !== this.taskListQuery.path) {
      this.$store.commit("SET_TASK_LIST_QUERY", {});
    } else {
      const { state, role, level, sort } = this.taskListQuery;
      this.state = state;
      this.role = role;
      this.level = level;
      this.sort = sort;
    }
  },
  computed: {
    ...mapGetters(["taskListQuery"]),
    query() {
      return {
        type: this.type,
        state: this.state,
        role: this.role,
        level: this.level,
        sort: this.sort,
      };
    },
  },
};
</script>
<style lang="less">
</style>
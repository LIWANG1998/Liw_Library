<template>
  <div class="task my-task">
    <van-sticky>
      <DropdownMenu>
        <DropdownItem
          v-model="query.create_time_type"
          :title="query.create_time_type == 1 ? '时间范围' : ''"
          :options="timeData"
        />
        <DropdownItem
          v-model="query.level"
          :title="query.level == -1 ? '任务级别' : ''"
          :options="levelData"
        />
        <DropdownItem title="筛选" ref="item" icon="filter-o">
          <dropItem
            @cancel="handleDorpItemCancel"
            @confirm="handleDorpItemConfirm"
          ></dropItem>
        </DropdownItem>
      </DropdownMenu>
    </van-sticky>
    <list type="allTask" :isFull="true" :query="query" />
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
import dropItem from "../components/dropItem";
import list from "@/views/task/components/list";
import { task } from "@/api";
import { mapGetters } from "vuex";
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    list,
    dropItem
  },
  data() {
    return {
      query: {
        initiator_type: 1,
        initiator_userid: "",
        participant_type: 1,
        participant_userid: "",
        level: -1,
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
    };
  },
  methods: {
    handleDorpItemCancel() {
      this.$refs.item.toggle();
    },
    handleDorpItemConfirm(val) {
      this.query = Object.assign(this.query, val);
      this.$refs.item.toggle();
    },
  },
};
</script>
<style lang="less" scope>
.my-task {
  .task-list {
    // height: 600px;
    height: auto;
  }
}
</style>
<template>
  <div class="chart-template">
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
            :type="1"
            :data="query"
            page="chart"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
      </DropdownMenu>
    </van-sticky>
    <div>
      <rank-chart :query="query_" />
    </div>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem } from "vant";
import { task } from "@/api";
import dropItemNew from "../components/dropItemNew";
import RankChart from "../components/rankChart";
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    RankChart,
    dropItemNew,
  },
  data() {
    return {
      showMenu:'',
      query_:{
        people_type: 1,
        role_type:0,
        people_userid: "",
        level: "-1, 0, 1, 2",
        status: "0, 1, 2, 3, 4",//任务状态 0全部 1待开始 2执行中 3已逾期 4已完成
        launch_time:0,
        l_start_time:'',
        l_end_time:'',
        end_time:0,
        e_start_time:'',
        e_end_time:'',},
      query: {
        people_type: 1,
        role_type:0,
        people_userid: "",
        level: [-1, 0, 1, 2],
        status: [0, 1, 2, 3, 4],//任务状态 0全部 1待开始 2执行中 3已逾期 4已完成
        launch_time:0,
        l_start_time:'',
        l_end_time:'',
        end_time:0,
        e_start_time:'',
        e_end_time:'',
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
      this.$refs[this.showMenu].toggle();
    },
    handleDorpItemConfirm(val) {
      this.query = Object.assign(this.query, val);
      this.query_ = Object.assign({}, this.query)
      this.query_.status = this.query_.status instanceof Array ? this.query_.status.join(',') : this.query_.status
      this.query_.level = this.query_.level instanceof Array ? this.query_.level.join(',') : this.query_.level
      this.$refs[this.showMenu].toggle();
    },
  },
};
</script>
<style lang="less">
.chart-template {
  height: 100vh;
  overflow-y: scroll;
}
</style>

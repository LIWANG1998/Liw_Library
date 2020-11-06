<template>
  <div class="task my-task">
    <van-sticky>
      <DropdownMenu>
        <DropdownItem
          @open="showMenu = 'start',show = true"
          ref="start"
          title="发起时间"
        >
          <drop-item-new
            type="5"
            :show="show"
            :data="query_"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
        <DropdownItem
          @open="showMenu = 'end',show = true"
          ref="end"
          title="结束时间"
        >
          <drop-item-new
            type="6"
            :show="show"
            :data="query_"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
        <DropdownItem
          title="筛选"
          ref="item"
          @open="showMenu = 'item',show = true"
          icon="filter-o">
          <drop-item-new
            type="1"
            :show="show"
            :data="query_"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
      </DropdownMenu>
    </van-sticky>
    <list type="taskUserList" :isFull="true" :query="query" />
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
import dropItemNew from "../components/dropItemNew";
import list from "@/views/task/components/list";
import { getStore, setStore } from "@/utils/store";
import { task } from "@/api";
import { mapGetters } from "vuex";
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    list,
    dropItemNew
  },
  data() {
    return {
      showMenu:'',
      show:false,
      query_:{},
      query: {
        userid:'',
        people_type: 3,
        role_type:[0],
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
      statusOption: [
        {
          text: "全部",
          value: 1,
        },
        {
          text: "待开始",
          value: 2,
        },
        {
          text: "执行中",
          value: 3,
        },
        {
          text: "已逾期",
          value: 4,
        },
        {
          text: "已完成",
          value: 5,
        },
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
      this.show = false
      this.$refs[this.showMenu].toggle();
    },
    handleDorpItemConfirm(val) {
      this.show = false
      this.query = Object.assign(this.query, val);
      this.$refs[this.showMenu].toggle();
      this.query_ = getStore({name: 'selectData'})
    },
  },
  created() {
    this.query_ = getStore({name: 'selectData'})
    console.log(this.query_)
    let _params =JSON.parse(JSON.stringify(this.query_))
    console.log(_params)
    // _params.people_type = 3
    // _params.people_userid = this.$route.query.ui
    _params.userid = this.$route.query.ui
    // setStore({
    //   name: "selectData",
    //   content: _params,
    // });
    _params.status = _params.status instanceof Array ? _params.status.join(',') : _params.status
    _params.level = _params.level instanceof Array ? _params.level.join(',') : _params.level
    _params.role_type = _params.role_type instanceof Array ? _params.role_type.join(',') : _params.level
    this.query = _params
  }
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

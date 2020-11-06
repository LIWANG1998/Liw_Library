<template>
  <div class="statistics-template">
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
            :data="query"
            page="stati"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
      </DropdownMenu>
    </van-sticky>
    <div>
      <!-- <statistics-card :query="query" /> -->
      <van-row class="row">
        <van-col
          class="col"
          :span="12"
          v-for="(item, index) in statiData"
          :key="index"
        >
          <div @click="handleInfo(item)" :class="['item',item.bgClass]">
            <div class="flex">
              <i :class="['sprite-icon', item.icon]"></i>
              <div class="info">
                <div class="number">
                  <animate-number
                    v-if="item.number > -1"
                    duration="1000"
                    easing="easeOutQuad"
                    from="0"
                    :to="item.number"
                    :key="item.number"
                  ></animate-number>
                </div>
                <div class="title">{{ item.text }}</div>
              </div>
            </div>
            <div :class="['label', item.labelColor, item.label_1 ? 'label_' : '']">
              <label>{{ item.label }}</label>
              <label v-if="item.label_1">{{ item.label_1 }}</label>
            </div>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem } from "vant";
import dropItemNew from "./components/dropItemNew";
import StatisticsCard from "./components/statisticsCard";
import { statistics } from "@/api";
import {mapGetters} from "vuex";
import { removeStore, setStore } from "@/utils/store";
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    StatisticsCard,
    dropItemNew,
  },
  computed:{
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      time: 12,
      level: -1,
      showMenu:'',
      query: {
        people_type: 1,
        role_type:[0,1,2,3],//任务角色：0全部1发起2接收3抄送
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
      timeOption: [
        {
          name: "近一周",
          value: 1,
        },
        {
          name: "近一个月",
          value: 2,
        },
        {
          name: "近一年",
          value: 3,
        },
        {
          name: "自定义",
          value: 4,
        },
      ],
      // 统计数据
      statiData:  [
        {
          bgClass: "orange",
          icon: "stati3-icon",
          text: "我发起的",
          number: 0,
          path: `/taskUserList?ui=${this.$store.state.user.userInfo.userid}`,
          type: 3,
          role_type:[1],
          status: [0, 1, 2, 3, 4]
        },
        {
          bgClass: "green",
          icon: "stati4-icon",
          text: "我参与的",
          number: 0,
          path: `/taskUserList?ui=${this.$store.state.user.userInfo.userid}`,
          type: 4,
          role_type:[2,3],
          status: [0, 1, 2, 3, 4]
        },
        {
          bgClass: "blue",
          icon: "stati1-icon",
          text: "任务总数",
          number: 0,
          path: "/countList?type=1",
          type: 1,
          role_type:[0,1,2,3],
          status: [0, 1, 2, 3, 4]
        },
        {
          bgClass: "orange",
          icon: "stati2-icon",
          text: "待处理",
          number: 0,
          path: "/countList?type=2",
          type: 2,
          role_type:[1,2],
          status: [1, 2, 3, ]
        },
        {
          bgClass: "blue",
          icon: "stati5-icon",
          text: "完成数量",
          number: 0,
          label: "完成率20%",
          label_1: "按时完成率20%",
          path: "/countList?type=5",
          type: 5,
          role_type:[1,2],
          status: [4]
        },
        {
          bgClass: "red",
          icon: "stati7-icon",
          text: "逾期数量",
          number: 0,
          label: "逾期率20%",
          labelColor: "text-red",
          path: "/countList?type=7",
          type: 7,
          role_type:[1,2],
          status: [3]
        },
        {
          bgClass: "purple",
          icon: "stati6-icon",
          text: "逾期次数",
          number: 0,
          // label: "按时完成率20%",
          // labelColor: "text-purple",
          // path: "/countList?type=6",
          path: "",
          type: 6,
        },
        {
          bgClass: "yellow",
          icon: "stati8-icon",
          text: "排行榜",
          number: -1,
          path: "/statistics/chart",
          type: 8,
        },
      ],
    };
  },
  watch: {
    query: {
      handler() {
        this.getData();
      },
      deep:true
    },
  },
  created() {
    removeStore({name: 'selectData'})
    // this.statiData[0].path = `/taskUserList?ui=${this.userInfo.userid}`
    // this.statiData[1].path = `/taskUserList?ui=${this.userInfo.userid}`
    this.getData();
  },
  beforeRouteLeave(to,from,next){
    let _params = Object.assign({}, this.query)
    _params.status = (typeof _params.status) == 'string' ? _params.status.split(',') : _params.status
    _params.level = (typeof _params.level) == 'string' ? _params.level.split(',') : _params.level
    _params.role_type = (typeof _params.role_type) == 'string' ? _params.role_type.split(',') : _params.role_type
    if (to.path == '/taskUserList'){
      _params.people_type = 3
      _params.people_userid = this.userInfo.userid
    }
    setStore({
      name: "selectData",
      content: _params,
    });
    next()
  },
  methods: {
    async getData() {
      let _params =JSON.parse(JSON.stringify(this.query))
      _params.status = _params.status instanceof Array ? _params.status.join(',') : _params.status
      _params.level = _params.level instanceof Array ? _params.level.join(',') : _params.level
      _params.role_type = _params.role_type instanceof Array ? _params.role_type.join(',') : _params.role_type
      const { code, data } = await statistics.getStatis(_params);
      if (code) {
        this.statiData[0].number = data.launch_count;
        this.statiData[1].number = data.partake_count;
        this.statiData[2].number = data.all_total_count;
        this.statiData[3].number = data.untreated_count;
        this.statiData[4].number = data.finish_count;
        this.statiData[4].label = `完成率${data.finish_rate}%  `;
        this.statiData[4].label_1 = `按时完成率${data.ontime_finish_rate}%`;
        // this.statiData[4].label = `按时完成率${data.ontime_finish_rate}%`;
        this.statiData[5].number = data.overdue_num;
        this.statiData[5].label = `逾期率${data.overdue_rate}%`;
        this.statiData[6].number = data.overdue_count;
        this.$forceUpdate();
      }
    },
    handleDorpItemCancel() {
      this.$refs[this.showMenu].toggle();
    },
    handleDorpItemConfirm(val) {
      this.query = Object.assign(this.query,val);
      this.$refs[this.showMenu].toggle();
      this.getData()
    },
    handleInfo(item){
     if(item.path) {
        this.query.role_type = item.role_type;
        this.query.status = item.status;
        this.$router.push(item.path);
     }
    }
  },
};
</script>
<style lang="less">
.statistics-template {
  height: calc(100vh - 60px);
  background-color: #fff;
  width: 100%;
  i {
    margin: 0;
  }
  .row {
    border-top: 10px solid @white-light;
    padding: 8px 4px;
    .col {
      position: relative;
      box-sizing: border-box;
      padding: 10px;
      .red {
        background: @gradient-red-orange;
      }
      .green {
        background: @gradient-green;
      }
      .orange {
        background: @gradient-orange-light;
      }
      .blue {
        background: @gradient-blue;
      }
      .purple {
        background: @gradient-purple;
      }
      .yellow {
        background: @gradient-yellow-light;
      }
      .item {
        text-align: center;
        width: 100%;
        display: block;
        padding: 10px 15px;
        box-sizing: border-box;
        border-radius: 4px;
        .flex {
          display: flex;
          justify-content: space-between;
        }
        .info {
          color: @white;
          text-align: right;
          .number {
            font-size: 30px;
          }
          .title {
            font-size: 14px;
          }
        }
        .label {
          margin-top: 10px;
          height: 40px;
          line-height: 21px;
          color: #396ae9;
          display: block;
          &.text-purple {
            color: #6e55eb;
          }
          &.text-red {
            color: #eb6060;
          }
          label {
            background: rgba(244, 244, 245, 0.31);
            border-radius: 2px;
            display: inline-block;
            padding: 0 10px;
            float: right;
          }
        }
        .label_{
          label {
            width: 90%;
            background: rgba(244, 244, 245, 0.31);
            border-radius: 2px;
            display: inline-block;
            padding: 0 10px;
            float: right;
          }
        }
      }
      &:last-child {
        .title {
          font-size: 22px !important;
          line-height: 60px;
        }
      }
    }
  }
}
</style>

<template>
  <div class="overdueList-template">
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
    <van-skeleton title :row="10" :loading="loading">
      <div style="margin-top: 25px">
        <template v-if="listData.length > 0">
          <div
            v-for="(item, index) in listData"
            :key="index"
            @click="handleToItem(Number(urlType) === 0 ? item.id : item.userid)"
          >
            <overdue-list-card :url-type="urlType" :card-data="item" />
          </div>
        </template>
        <div v-else class="no-data">
          <img src="@/assets/images/nodata.png" />
          <p>暂无数据</p>
        </div>
      </div>
    </van-skeleton>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem } from "vant";
import dropItem from "./components/dropItem";
import OverdueListCard from "./components/overdueListCard";
import { statistics } from "@/api";
let moment = require("moment");
moment.locale("zh-cn"); //汉化
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    OverdueListCard,
    dropItem,
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
      loading: true,
      listData: [],
      urlType: 0, // 0公司排行 1个人排行
    };
  },
  watch: {
    query: {
      handler() {
        this.loadData(this.urlType);
      },
      deep:true
    }
  },

  created() {
    const { type } = this.$route.query;
    this.urlType = type;
    this.loadData(type);
    this.$route.meta.title = "个人排行";
  },
  methods: {
    handleToItem(id) {
      this.$router.push({
        path: "/statistics/overdueItem",
        query: { id: id, type: this.urlType },
      });
    },
    // 请求数据
    async loadData(type) {
      let that = this;
      try {
        const { code, data, msg } = await statistics.getCompanyList(this.query);
        if (code === 1) {
          // 计算出逾期总数
          let totalArr = data && data.map((item) => Number(item.num));
          if(totalArr.length>0) {
            let total = totalArr.reduce((prev, curre) => {
              return prev + curre;
            });
            // 组装任务列表卡片所需要的数据
            this.listData =
              data &&
              data.map((item) => ({
                name: item.dep,
                number: Number(item.num),
                time:
                  item.endtime != 0
                    ? moment(item.endtime).format("YYYY-MM-DD")
                    : 0,
                id: `${item.corpid}_${item.depid}`,
                total,
              }));
          }
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
<style lang="less">
.overdueList-template {
  height: 100vh;
  width: 100%;
  overflow-y: scroll;
}
.no-data {
  text-align: center;
  color: #a4cef4;
  img {
    width: 300px;
  }
}
</style>

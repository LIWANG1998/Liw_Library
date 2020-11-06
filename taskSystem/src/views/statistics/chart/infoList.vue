<template>
  <div class="chart-info">
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
            :data="query"
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
            :data="query"
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
            page="info"
            :show="show"
            :data="query"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
      </DropdownMenu>
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="100"
        finished-text="没有更多了"
        class="list"
        @load="onLoad"
      >
        <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="handleInfo(item.id,item.status)"
        >
          <van-row type="flex" justify="space-between" align="center">
            <van-col>
              <div class="title">
                {{ item.title }}
                <span class="level">
                  <svg-icon
                    icon-class="fire"
                    class="nav-icon"
                    v-for="(lItem, lIndex) in getLevel(item.level)"
                    :key="lIndex"
                  />
                </span>
              </div>
              <div class="name">
                {{ item.department_name }} - {{ item.name }}
              </div>
            </van-col>
            <van-col>
              <van-icon name="arrow" color="#C0C4CC" size="18" />
            </van-col>
          </van-row>
          <div class="time">{{ item.start_time }} - {{ item.end_time }}</div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
import dropItemNew from "../components/dropItemNew";
import { statistics } from "@/api";
import { getStore, setStore } from "@/utils/store";

export default {
  components: {
    DropdownMenu,
    DropdownItem,
    dropItemNew,
  },
  data() {
    return {
      showMenu:'',
      show:false,
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
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      total: 0,
      page: {
        page: 0,
        limit: 8,
      },
    };
  },
  watch: {
    query: {
      handler() {
        this.refreshing = true;
        this.onRefresh();
      },
      deep: true,
    },
  },
  created() {
    this.query = getStore({name: 'selectData'})
    // document.title = this.$route.query.name + "排行详情";
    document.title =  "排行详情";
    // this.query.userid = this.$route.query.userid;
  },
  methods: {
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
    // 请求数据
    async getDataList() {
      try {
        let _data = JSON.parse(JSON.stringify(this.query))
        _data.status = _data.status instanceof Array ? _data.status.join(',') : _data.status
        _data.level = _data.level instanceof Array ? _data.level.join(',') : _data.level
        _data.role_type = _data.role_type instanceof Array ? _data.role_type.join(',') : _data.role_type
        let params = Object.assign(_data, this.page);
        const {
          code,
          data: { total, data },
        } = await statistics.getRankInfoList(params);
        if (code === 1) {
          this.total = total;
          this.skeShow = false;
          this.loading = false;
          let listData = [];
          data.forEach((item, index) => {
            if (
              !(
                item.status == 0 &&
                item.remarks == "" &&
                item.file_url.length == 0
              )
            ) {
              listData.push(item);
            }
          });
          if (this.page.page === 1) {
            this.list = listData;
          } else {
            this.list = [...this.list, ...listData];
          }
          if (this.list.length >= this.total) {
            this.finished = true;
          }
          if (data.length == 0) {
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
    handleDorpItemCancel() {
      this.show = false
      this.$refs[this.showMenu].toggle();
    },
    handleDorpItemConfirm(val) {
      this.show = false
      this.query = Object.assign(this.query, val);
      this.$refs[this.showMenu].toggle();
    },
    handleInfo(id,status) {
      this.$router.push({
        path: "/info",
        query: { id: id, status: status, look: 1 },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.chart-info {
  font-size: 14px;
  .item {
    padding: 10px 10px 10px 16px;
    background: #fff;
    border-radius: 4px;
    margin: 16px;
    position: relative;
    overflow: hidden;
    .title {
      line-height: 30px;
      font-weight: bold;
      margin-top: 10px;
    }
    .name {
      color: #909399;
      margin: 10px 0;
    }
    .level {
      margin-left: 10px;
    }
    .time {
      background: linear-gradient(-276deg, #ffffff 0%, #e8e8e8 100%);
      line-height: 26px;
      border-radius: 4px;
      color: #303133;
    }
  }
}
</style>

<template>
  <div class="statistics">
    <van-tabs v-model="tab" @change="tab_change" type="card">
      <van-tab
        v-for="(item) in statistics.tabs"
        :key="item.key"
        :name="item.key"
        :title="item.title"
      >
        <div class="selection" v-show="!showSearch">
          <div class="date">
            <van-dropdown-menu>
              <van-dropdown-item
                @change="OnChangeDate"
                v-model="selection.date"
                :options="selection.dateList"
              />
            </van-dropdown-menu>
          </div>
          <div class="search" @click="showSearch=true">
            <div class="border">
              <van-icon name="search" />
              <span>搜索</span>
            </div>
          </div>
        </div>
        <div class="head-search" v-show="showSearch">
          <van-search
            v-model="selection.keyword"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onCancel"
          />
        </div>
        <van-list
          v-if="list.record_data!=''"
          v-model="list.loading"
          :finished="list.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="list-item" v-for="(item2 ,index2) in  list.record_data" :key="index2">
            <div class="info">
              <div class="flex">
                <div class="head-img">
                  <img :src="item2.avatar" alt />
                </div>
                <div class="name">{{item2.name}}</div>
                <div class="position">{{item2.dep_name.split()[0]}}{{item2position(item2.position)}}</div>
              </div>
              <div class="date">{{item2.create_time}}</div>
            </div>
            <div class="stage stages">
              <div class="stage">{{item.stage}}阶段：{{item2.type}}</div>
              <div class="look-person" v-if="[4,5].includes(tab)" @click="toGivePerson(item2)">
                <span>查看{{item.stage}}对象</span>
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </van-list>
        <NoData v-if="list.record_data==''" />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { file_count } from "../../../api/statistics";
import NoData from "../../../components/common/noData.vue";
export default {
  data() {
    return {
      tab: 1,
      showSearch: false,
      //行为统计
      statistics: {
        tabs: [
          {
            title: "阅读记录",
            key: 1,
            stage: "阅读",
          },
          {
            title: "打印记录",
            key: 2,
            stage: "打印",
          },
          {
            title: "下载记录",
            key: 3,
            stage: "下载",
          },
          {
            title: "分发记录",
            key: 4,
            stage: "分发",
          },
          {
            title: "传阅记录",
            key: 5,
            stage: "传阅",
          },
        ],
      },
      //数据筛选条件
      selection: {
        date: 0,
        keyword: "",
        dateList: [
          { text: "全部", value: 0 },
          { text: "近一周", value: 1 },
          { text: "近一个月", value: 2 },
        ],
        page: 1,
      },

      //列表属性
      list: { record_data: [], loading: false, finished: false, count: null },
    };
  },
  components: {
    NoData,
  },
  created() {
    this.get_file_count();
  },
  methods: {
    //tab切换
    tab_change() {
      this.selection.page = 1;
      this.selection.keyword = "";
      this.selection.date = 0;
      this.get_file_count();
    },
    //搜索
    onSearch() {
      this.get_file_count();
    },
    //时间切换
    OnChangeDate() {
      this.get_file_count();
    },
    // 取消
    onCancel() {
      this.showSearch = false;
      this.selection.keyword = "";
      this.get_file_count();
    },
    //页面跳转
    toGivePerson(item) {
      let type = {
        4: 2,
        5: 1,
      };
      this.$router.push({
        path: "/givePerson",
        query: {
          userid: item.userid,
          docuemnt_id: this.$route.query.fid,
          type: type[this.tab],
        },
      });
    },
    // 下拉刷新
    onLoad() {
      if (this.list.count > this.list.record_data.length) {
        this.selection.page++;
        this.get_file_count();
        this.list.loading = false;
      } else {
        this.list.finished = true;
      }
    },
    //获取数据
    async get_file_count() {
      let { data } = await file_count({
        id: this.$route.query.fid,
        type: this.tab,
        keyword: this.selection.keyword,
        month: this.selection.date,
        page: this.selection.page,
        mobile: 1,
      });
      this.list.record_data = data.res;
      this.list.count = data.count;
    },
  },
  computed: {
    item2position() {
      return (v) => {
        return v ? `-${v}` : "";
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.statistics {
  .flex {
    display: flex;
    align-items: center;
  }
  /deep/.van-tabs {
    .van-tabs__wrap {
      display: flex;
      align-items: center;
      height: 58px;
      border: none;
      background: rgb(250, 250, 250);
    }
    .van-tabs__nav {
      border: none;
      background: rgb(250, 250, 250);
    }
    .van-tab {
      border: none;
      box-shadow: none;
      color: #909399;
      background: #fff;
      border-radius: 30px;
      margin-right: 20px;
    }
    .van-tab--active {
      color: #fff;
      background: #0082ef;
    }
  }
  .selection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    background: #fff;
    border-bottom: 1px solid #dcdfe6;
    .date {
      flex: 1;
      height: 100%;
      /deep/.van-dropdown-menu__bar {
        box-shadow: none;
      }
      /deep/ .van-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        height: 45px;
      }
    }
    .search {
      flex: 1;
      display: flex;
      align-items: center;
      height: 100%;
      .border {
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #dcdfe6;
        width: 100%;
        i {
          margin-right: 5px;
        }
      }
    }
  }
  .head-search {
    /deep/.van-search {
      height: 50px;
      .van-search__content {
        display: flex;
        align-items: center;
        height: 100%;
      }
    }
  }
  .van-list {
    background: rgb(250, 250, 250);
    .list-item {
      padding: 0 20px;
      margin-bottom: 5px;
      background: #fff;
      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        .head-img {
          width: 28px;
          height: 28px;
          margin-right: 10px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          color: #606266;
          font-size: 14px;
          margin-right: 10px;
        }
        .position {
          max-width: 120px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          color: #909399;
          font-size: 13px;
          border: 1px solid #a8a9ad;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 10px;
          border-radius: 2px;
        }
        .date {
          color: #aaaaaa;
          font-size: 12px;
        }
      }
      .stages {
        border-top: 1px solid #f1f1f1;
      }
      .stage {
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .look-person {
          display: flex;
          align-items: center;
          font-size: 14px;
          span {
            color: #0082ef;
          }
        }
      }
    }
  }
}
</style>
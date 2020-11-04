<template>
  <div class="givePerson">
    <div class="search">
      <van-search
        v-model="keyword"
        placeholder="搜索名字"
        input-align="center"
        @search="onSearch"
        @cancel="onCancel"
      />
    </div>
    <div class="data-list">
      <van-list v-model="list.loading" :finished="list.finished" @load="onLoad">
        <div class="data-item" v-for="(item,index) in list.data_list" :key="index">
          <div class="head-img">
            <img :src="item.avatar" alt />
          </div>
          <div class="user-info">
            <div class="name">{{item.name}}</div>
            <div class="position">{{item.position}}</div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import { circulation_somebady } from "../../../api/statistics";
export default {
  data() {
    return {
      keyword: "",
      all_query: null,
      page: 1,

      list: { data_list: [], loading: false, finished: false, count: null },
    };
  },
  created() {
    this.all_query = this.$route.query;
    this.get_circulation_somebady();
  },
  methods: {
    onSearch() {
      this.get_circulation_somebady();
    },
    onCancel() {
      this.keyword = "";
      this.get_circulation_somebady();
    },
    onLoad() {
      if (this.list.count > this.list.data_list.length) {
        this.page++;
        this.get_file_count();
        this.list.loading = false;
      } else {
        this.list.finished = true;
      }
    },
    async get_circulation_somebady() {
      let { data } = await circulation_somebady({
        userid: this.all_query.userid,
        docuemnt_id: this.all_query.docuemnt_id,
        type: this.all_query.type,
        kwd: this.keyword,
        page: this.page,
      });
      this.list.data_list = data.data;
      this.list.count = data.count;
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.givePerson {
  height: 100vh;
  background: #fff;
  .search {
    padding: 0 15px;
    border-bottom: 1px solid rgb(231, 231, 231);
  }
  /deep/ .van-search {
    height: 48px;
    border-radius: 2px;
    .van-cell {
      padding: 5px;
    }
  }
  .data-list {
    .data-item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 50px;
      padding: 5px 15px 5px 0px;
      margin-left: 15px;
      border-bottom: 1px solid rgb(231, 231, 231);
      .head-img {
        width: 40px;
        height: 40px;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .user-info {
        display: flex;
        flex-direction: column;
        .name {
          color: #2d3034;
          font-size: 15px;
        }
        .position {
          color: #909399;
          font-size: 11px;
        }
      }
    }
  }
}
</style>
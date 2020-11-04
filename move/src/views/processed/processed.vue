<template>
  <div class="box">
    <list-box />
    <!-- <div class="tabs">
      <van-tabs
        @change="onTabsChange"
        v-model="active"
        color="#0082EF"
        line-width="25px"
        title-active-color="#0082EF"
      >
        <van-tab :name="1" title="待办公文">
          <div class="screen">
            <div class="state">
              <van-dropdown-menu :overlay="false">
                <van-dropdown-item
                  @change="onStateChange"
                  v-model="screen.state"
                  :options="screen.option"
                />
              </van-dropdown-menu>
            </div>
            <div class="search">
              <van-search
                v-model="screen.search"
                placeholder="搜索公文"
                input-align="center"
                @search="onSearch"
                @input="onSearchChange"
              />
            </div>
          </div>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            v-if="data_list"
          >
            <div v-if="data_list.length==0">
              <noData></noData>
            </div>

            <div v-else class="content" v-for="(item,index) in data_list" :key="index">
              <div
                class="line"
                :style="{'background-color':{2:'#5DB5FF',1:'#5DB5FF',3:'#5DB5FF'}[item.process_urgent_level]}"
              ></div>
              <div class="detail" @click="toexamine(item)">
                <div class="msg">
                  <div class="top">
                    <div class="title">{{item.title}}</div>
                    <div class="word-no">{{item.word_no}}</div>
                  </div>
                  <div class="bottom">
                    <div class="flex">
                      <div class="state">{{item.type==1?"发":item.type==2?"收":"签"}}</div>
                      <div class="user">{{item.creater}}/{{item.dep_name}}</div>
                    </div>
                    <div class="to-examine flex-ac-jc">
                      <div>去审核</div>
                    </div>
                  </div>
                </div>
                <div
                  class="proStatus"
                  :class="'proStatus'+item.process_urgent_level"
                >{{item.process_urgent_level==1?"普通":item.process_urgent_level==2?"紧急":"加急"}}</div>
              </div>
            </div>
          </van-list>
        </van-tab>
        <van-tab :name="2" title="待阅公文">
          <div class="screen">
            <div class="state">
              <van-dropdown-menu :overlay="false">
                <van-dropdown-item
                  @change="onStateChange2"
                  v-model="screen.state2"
                  :options="screen.option2"
                />
              </van-dropdown-menu>
            </div>
            <div class="search">
              <van-search
                v-model="screen.search"
                placeholder="搜索公文"
                input-align="center"
                @search="onSearch"
                @input="onSearchChange"
              />
            </div>
          </div>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            v-if="data_list"
          >
            <div v-if="data_list.length==0">
              <noData></noData>
            </div>
            <template v-else>
              <template v-for="(item,index) in data_list">
                <list-card :key="index" :item="item" :pageType="active" />
              </template>
            </template>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>-->
  </div>
</template>

<script>
import {
  documentType,
  documentList,
  document_waitme_list,
  index_wait_read,
} from "../../api/home"; //接口
import noData from "../../components/common/noData";
import listCard from "@/components/ListCard";
import ListBox from "@/components/lists/ListBox";

export default {
  components: {
    noData,
    listCard,
    ListBox,
  },
  data() {
    return {
      // active: 1, //当前显示内容
      // type: "",
      // loading: false,
      // finished: false,
      // page: 1, //分页数
      // limit: 10, //每页显示的条数
      // count: null, //总数据条数
      // dataList: [],
      // flag: true,
      // screen: {
      //   state: 1,
      //   state2: 1,
      //   search: "",
      //   option: [
      //     { text: "发文", value: 1 },
      //     { text: "收文", value: 2 },
      //     { text: "签报", value: 3 },
      //   ],
      //   option2: [
      //     { text: "发文", value: 1 },
      //     { text: "收文", value: 2 },
      //     { text: "签报", value: 3 },
      //   ],
      // },
      // tabs: [
      //   { title: "待办公文", key: 1 },
      //   { title: "待阅公文", key: 2 },
      // ],
      // //显示数据
      // data_list: null,
      // throttle: null,
    };
  },
  // computed: {},
  // methods: {
  //   //搜索
  //   onSearch() {
  //     this.reset();
  //     if (this.active == 1) {
  //       this.get_document_waitme_list();
  //     } else if (this.active == 2) {
  //       this.get_index_wait_read();
  //     }
  //   },
  //   //搜索内容改变自动搜索
  //   onSearchChange() {
  //     if (this.throttle) {
  //       return;
  //     }
  //     this.throttle = setTimeout(() => {
  //       this.reset();
  //       if (this.active == 1) {
  //         this.get_document_waitme_list();
  //       } else if (this.active == 2) {
  //         this.get_index_wait_read();
  //       }
  //       this.throttle = null;
  //     }, 2000);
  //   },

  //   //tab改变
  //   onTabsChange() {
  //     this.reset();
  //     if (this.active == 1) {
  //       this.get_document_waitme_list();
  //     } else if (this.active == 2) {
  //       this.get_index_wait_read();
  //     }
  //   },
  //   //状态改变（发文、收文、签报）
  //   onStateChange() {
  //     this.reset();
  //     if (this.active == 1) {
  //       this.get_document_waitme_list();
  //     } else if (this.active == 2) {
  //       this.get_index_wait_read();
  //     }
  //   },
  //   //状态改变（发文、收文、签报）
  //   onStateChange2() {
  //     this.reset();
  //     if (this.active == 1) {
  //       this.get_document_waitme_list();
  //     } else if (this.active == 2) {
  //       this.get_index_wait_read();
  //     }
  //   },

  //   //下拉刷新
  //   onLoad() {
  //     if (!this.finished) {
  //       this.loading = true;
  //       this.page++;
  //       // console.log("第" + this.page + "页");
  //       if (this.active == 1) {
  //         this.get_document_waitme_list(false);
  //       } else if (this.active == 2) {
  //         this.get_index_wait_read(false);
  //       }
  //     }
  //   },

  //   //去审核
  //   toexamine(item) {
  //     this.$router.push({
  //       path: "/sendingDetails",
  //       query: {
  //         fid: item.id,
  //         type: item.type,
  //       },
  //     });
  //   },
  //   //获取数据待办
  //   async get_document_waitme_list(state = true) {
  //     let { data, count } = await document_waitme_list({
  //       type: this.screen.state,
  //       kwd: this.screen.search,
  //       page: this.page,
  //     });
  //     if (state) {
  //       this.data_list = [];
  //       this.data_list = data;
  //     } else {
  //       this.data_list = [...this.data_list, ...data];
  //     }

  //     this.count = count;
  //     this.loading = false;
  //     if (this.data_list.length == this.count || data.length <= 0) {
  //       this.finished = true;
  //     }
  //   },
  //   //获取数据待阅
  //   async get_index_wait_read(state = true) {
  //     let { data, count } = await index_wait_read({
  //       type: this.screen.state2,
  //       kwd: this.screen.search,
  //       page: this.page,
  //     });
  //     if (state) {
  //       this.data_list = [];
  //       this.data_list = data.data;
  //     } else {
  //       this.data_list = [...this.data_list, ...data.data];
  //     }
  //     this.count = count;
  //     this.loading = false;
  //     if (this.data_list.length == this.count || data.data.length <= 0) {
  //       this.finished = true;
  //     }
  //   },

  //   goExamine(type, id) {
  //     this.$router.push({
  //       path: "/sendingDetails",
  //       query: {
  //         fid: id,
  //         type: type,
  //       },
  //     });
  //   },

  //   //数据刷新
  //   reset() {
  //     this.page = 1;
  //     this.finished = false;
  //     this.count = 0;
  //   },
  // },
  // created() {
  //   this.type = Number(this.$route.query.id);
  // },
  beforeRouteEnter(to, from, next) {
    document.title = to.query.title;
    next();
  },
};
</script>

<style lang="scss" scoped>
/deep/.van-tab__text--ellipsis {
  font-size: 16px !important;
}
.flex {
  display: flex;
  align-items: center;
}
.box {
  min-height: 100vh;
  background-color: #f5f6f7;
}
.screen {
  display: flex;
  padding: 0 15px;
  height: 36px;
  margin: 15px 0;
  .state {
    position: relative;
    width: 90px;
    height: 100%;
    border-radius: 2px;
    margin-right: 10px;
    /deep/.van-ellipsis {
      position: relative;
      right: 16px;
    }
    /deep/.van-dropdown-menu__bar {
      height: 36px;
    }
    /deep/.van-dropdown-item {
      margin-left: 15px;
      top: 95px !important;
      width: 90px;

      .van-overlay {
        display: none;
      }
    }
  }
  .search {
    width: 284px;
    background: #fff;
    /deep/.van-search {
      height: 36px;
      width: 284px;
      padding: 0;
      background: #fff;
      .van-search__content {
        width: 100%;
        background: #fff;
        .van-cell {
          background: #fff !important;
        }
      }
    }
  }
}
.content {
  display: flex;
  flex-wrap: wrap;
  width: 384px;
  height: 137px;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 15px;
  border-radius: 4px;
  position: relative;

  .line {
    height: 100%;
    width: 4px;
    border-radius: 4px 0px 0px 4px;
    background-color: #909399;
  }
  .msg {
    .top {
      height: 82px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid rgba(230, 238, 245, 1);
      color: #303133;
      font-size: 14px;
      .title {
        color: #303133;
        font-size: 16px;
        width: 317px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 500;
        font-size: 16px;
      }
      .word-no {
        margin-top: 10px;
      }
    }
    .bottom {
      display: flex;
      height: 55px;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      .state {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 27px;
        height: 27px;
        background: rgba(144, 147, 153, 0.1);
        border-radius: 50%;
        font-size: 12px;
        color: #909399;
      }
      .user {
        margin-left: 10px;
      }
      .to-examine {
        width: 50px;
        height: 28px;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
      }
    }
  }

  .detail {
    width: 348px;
    padding: 0 16px 0px 15px;
  }
}

.proStatus {
  position: absolute;
  top: 0;
  right: 10px;
  width: 34px;
  height: 40px;
  text-align: center;
  color: #fff;
  font-size: 11px;
  box-sizing: border-box;
  padding-top: 4px;
}
//普通
.proStatus1 {
  background: url("../../assets/img/document/normal.png") no-repeat;
  background-size: 34px 40px;
}
//紧急
.proStatus2 {
  background: url("../../assets/img/document/so-urgent.png") no-repeat;
  background-size: 34px 40px;
}
//加急
.proStatus3 {
  background: url("../../assets/img/document/urgent.png") no-repeat;
  background-size: 34px 40px;
}

.van-icon {
  position: absolute;
  top: 34px;
  right: 20px;
}
</style>
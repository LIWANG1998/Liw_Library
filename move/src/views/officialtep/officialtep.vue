<template>
  <div class="box">
    <van-search
      v-model="searchValue"
      placeholder="请输入模板名称"
      input-align="center"
      @input="search(searchValue)"
      @cancel="cancel"
    />
    <div class="tepList" v-if="searchContent">
      <div class="lists">
        <div v-for="(item,index) in searchData" :key="index" class="list" @click="sentOut(item.id)">
          <div>
            <img src="@/assets/img/home/tepIcon.png" alt />
            <div class="temTitle" style="font-size:14px">{{item.temp_name}}</div>
          </div>
        </div>
      </div>
      <noData v-if="noDataSearch"></noData>
    </div>
    <van-tabs
      v-else
      v-model="active"
      color="#0082EF"
      line-width="25px"
      title-active-color="#000"
      @click="getAll(active)"
    >
      <van-tab title="常用模板" name="0">
        <!-- 常用模板 -->
        <div class="tepList" v-if="templateList.length>0">
          <div class="lists">
            <div
              v-for="(item,index) in templateList"
              :key="index"
              class="list"
              @click="sentOut(item.id)"
            >
              <div>
                <img src="@/assets/img/home/tepIcon.png" alt />
                <div class="temTitle" style="font-size:14px">{{item.temp_name}}</div>
              </div>
            </div>
          </div>
        </div>
        <noData v-else></noData>
      </van-tab>
      <van-tab title="所有分类" name="1">
        <noData v-if="allNodata"></noData>

        <van-tree-select
          v-else
          :items="items"
          :active-id.sync="activeId"
          :main-active-index.sync="activeIndex"
          @click-nav="onNavClick"
        >
          <template #content>
            <noData v-if="noAlldata"></noData>
            <div class="type">
              <div class="listType">
                <div
                  class="iconLIst"
                  v-for="(item,index) in allList"
                  :key="index"
                  @click="sentOut(item.id)"
                >
                  <img src="@/assets/img/home/tepIcon.png" alt />
                  <div class="text">{{item.temp_name}}</div>
                </div>
              </div>
            </div>
          </template>
        </van-tree-select>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { templeteList } from "../../api/home"; //接口
import noData from "../../components/common/noData";

export default {
  components: {
    noData,
  },
  data() {
    return {
      noDataSearch: "", //没搜索到数据
      searchData: [], //搜索内容
      searchContent: false, //搜索的状态
      searchValue: "", //搜索内容
      active: "0", //默认是经常使用
      all: "", //所有分类
      templateList: [],
      temType: "", //模板的类型
      temList: {},
      templatetype: [],
      items: [{ text: "所有模板" }],
      activeId: 1,
      activeIndex: 0,
      allTemp: [], //所有分类
      allList: [], //展示分类
      flag: true,
      noDataStatus: false,
      allNodata: false, //all无数据的时候
      noAlldata: false,
      status: true,
      thisIndex: 0,
    };
  },
  methods: {
    init() {
      this.noDataSearch = ""; //没搜索到数据
      this.searchData = []; //搜索内容
      this.searchContent = false; //搜索的状态
      this.searchValue = ""; //搜索内容
      this.active = "0"; //默认是经常使用
      this.all = ""; //所有分类
      this.templateList = [];
      this.temType = ""; //模板的类型
      this.temList = {};
      this.templatetype = [];
      this.items = [{ text: "所有模板" }];
      this.activeId = 1;
      this.activeIndex = 0;
      this.allTemp = []; //所有分类
      this.allList = []; //展示分类
      this.flag = true;
      this.noDataStatus = false;
      this.allNodata = false; //all无数据的时候
      this.noAlldata = false;
      this.status = true;
      this.thisIndex = 0;
    },
    // 清空按钮
    cancel() {
      this.searchContent = false;
      this.searchValue = "";
    },
    sentOut(id) {
      if (this.fid) {
        //草稿，驳回
        this.$router.push({
          path: "/draft",
          query: {
            tid: id,
            type: this.temType,
            fid: this.fid,
          },
        });
      } else if (this.distributeId) {
        //转收文时选模板
        this.$router.push({
          path: "/draft",
          query: {
            tid: id, //模板id
            distributeId: this.distributeId,
            type: this.temType,
            cut: this.$route.query.cut,
          },
        });
      } else {
        this.$router.push({
          path: "/draft",
          query: {
            tid: id, //模板id
            type: this.temType,
          },
        });
      }
    },

    //获取模板列表
    getTempleteList() {
      let data = new URLSearchParams();
      data.append("all", this.all);
      data.append("kwd", this.searchValue);
      data.append("type", this.temType);
      templeteList(data).then((res) => {
        if (res.code == 1) {
          if (this.all == 1 && this.searchValue == "") {
            // this.activeIndex = 0;
            if (this.flag) {
              this.allTemp = res.data;
              let all = res.data;
              if (all.length == 0) {
                this.allNodata = true;
              }
              all.forEach((item) => {
                if (this.status) {
                  var list = {};
                  list["text"] = item.type;
                  this.items.push(list);
                }
                item.list.forEach((i) => {
                  this.allList.push(i);
                });
              });
              this.status = false;
              this.flag = false;
            }
            this.thisIndex == 1;
          } else if (this.searchValue != "") {
            this.allList = res.data;
            this.thisIndex == 1;
          } else if (res.data.collection !== undefined) {
            if (
              !(res.data.collection.resource.length > 0) &&
              this.active == "0" &&
              this.thisIndex == 0
            ) {
              this.active = "1";
              this.getAll(1);
            } else {
              this.templateList = res.data.collection.resource;
              if (res.data.collection.length == 0) {
                this.noDataStatus = true;
              }
            }
            this.thisIndex = 1;
          }
          // } else {
          //   this.noDataStatus = true;
          // }
        }
      });
    },
    //切换数据
    getAll(index) {
      this.all = index;
      if (index == 0) {
        this.all = "";
      }
      this.getTempleteList();
    },

    onNavClick(i) {
      if (i == 0) {
        let all = this.allTemp;
        this.allList = [];
        all.forEach((item) => {
          item.list.forEach((i) => {
            this.allList.push(i);
          });
        });
      } else {
        this.allList = this.allTemp[i - 1].list;
      }
    },
    //搜索
    search(value) {
      templeteList({
        kwd: this.searchValue,
        type: this.temType,
        flag: this.active == "0" ? 1 : 3,
      }).then((res) => {
        if (res.code == 1) {
          this.searchData = res.data;
          if (res.data.length == 0) {
            this.noDataSearch = true;
          } else {
            this.noDataSearch = false;
          }
          this.searchContent = true;
          if (value == "") {
            this.searchContent = false;
          }
        }
      });
      // this.allList = [];
      // this.searchValue = value;
      // this.flag = true;
      // this.getTempleteList();
    },
  },
  watch: {
    all(newValue, oldValue) {
      if (newValue == 1) {
      }
    },
  },
  mounted() {},
  activated() {
    // // console.log(this.$store.state.processNew)
    // this.$store.commit('setProcess', {})
    // // console.log(this.$store.state.processNew)
    this.init();
    this.temType = this.$route.query.type;
    this.fid = this.$route.query.fid;
    this.distributeId = this.$route.query.distributeId;
    this.getTempleteList();
  },
  created() {
    sessionStorage.removeItem("content");
    sessionStorage.removeItem("document_arr");
    sessionStorage.removeItem("enclosure_file");
    sessionStorage.removeItem("approval_file");
    sessionStorage.removeItem("currentDoc");
    sessionStorage.removeItem("document_arrs");
    sessionStorage.removeItem("gercontentFile");
    sessionStorage.removeItem("red");
    sessionStorage.removeItem("ele");
    sessionStorage.removeItem("fieldss");
    sessionStorage.removeItem("iss");
  },
};
</script>
<style lang="scss" scoped>
/deep/ .van-sidebar-item--select {
  color: #0082ef;
}

/deep/ .van-tabs--line .van-tabs__wrap {
  border: 1px solid #e6edf5;
  border-left: none;
  border-right: none;
}

/deep/ .van-sidebar-item--select::before {
  background-color: #0082ef;
}

/deep/ .van-tab__text--ellipsis {
  font-size: 17px !important;
}

/deep/ .van-sidebar-item--select::before {
  height: 46.79px;
}

/deep/ .van-tree-select {
  height: 86.5vh !important;
}

.van-sidebar {
  flex: 0.64;
}

.van-button--default {
  border: none;
}

.box {
  position: relative;
  height: 100vh;
  /* background-color: #fff; */
}

.tepList {
  width: 384px;
  margin: 0 auto;
  background: #fff;
  margin-top: 15px;

  .title {
    height: 48px;
    line-height: 48px;
    font-size: 15px;
    color: rgba(144, 147, 153, 1);
    flex-wrap: 500;
    margin-left: 15px;
  }

  .lists {
    display: flex;
    flex-wrap: wrap;

    .list:nth-child(n + 4) {
      border-top: none;
    }

    .list {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 127.9px;
      height: 128px;
      background-color: #ffffff;
      border: 1px solid rgba(240, 240, 240, 1);
      border-left: none;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 28px;
      }

      .temTitle {
        margin-top: 14px;
        width: 122px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.type {
  box-sizing: border-box;
  padding: 0 10px;
  .title {
    font-size: 12px;
    color: rgba(144, 148, 153, 1);
    margin-bottom: 15px;
  }

  .listType {
    display: flex;
    flex-wrap: wrap;

    .iconLIst {
      width: 33.33%;
      height: 67px;
      text-align: center;
      margin-top: 30px;

      .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 5px;
      }

      img {
        width: 24px;
        height: 28px;
      }
    }
  }
}
</style>
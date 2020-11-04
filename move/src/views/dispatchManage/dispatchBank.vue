<template>
  <div class="container">
    <!-- 搜索栏和菜单 -->
    <div class="header">
      <van-search
        v-model="data.kwd"
        placeholder="标题/字号/拟稿人"
        @input="search"
        @clear="clearData"
        background="#FFFFFF"
        class="searchBox"
        input-align="center"
      />
      <div class="menu">
        <div :class="{active:show==0}" @click="clickMenu(0)">全部</div>
        <div :class="{active:show==1}" @click="clickMenu(1)">待审</div>
        <div :class="{active:show==2}" @click="clickMenu(2)">驳回</div>
        <div :class="{active:show==3}" @click="clickMenu(3)">完成</div>
        <div :class="{active:show==4}" @click="clickMenu(4)">发布</div>
        <div :class="{active:show==5}" @click="clickMenu(5)">草稿</div>
      </div>
    </div>
    <!--        公文列表-->
    <div class="list">
      <template v-if="list.length>0">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <template v-for="(item,index) in list">
            <list-cards :item="item" :key="index" :lab="2" />
          </template>
        </van-list>
      </template>
      <no-data v-else></no-data>
    </div>
  </div>
</template>

<script>
import noData from "@/components/common/noData";
import { getDocumentList, delDocument } from "@/api/audit";
import ListCards from "@/components/lists/ListCards";
import { debounce } from "@/js/public";
export default {
  name: "dispatchBank",
  components: {
    ListCards,
    noData,
  },
  data() {
    return {
      show: 0,
      type: "", //页面类型----1：发文，2：收文，3：签发
      loading: false, //加载过程中是否触发loading事件
      finished: false, //是否加载完成
      status: "", //1待审 2驳回 3完成 4发布 5草稿
      page: 1,
      kwd: "", //搜索关键字
      list: [], //公文列表
      titleList: [
        { id: 0, title: "全部" },
        { id: 1, title: "待审" },
        { id: 2, title: "驳回" },
        { id: 3, title: "完成" },
        { id: 4, title: "发布" },
        { id: 5, title: "草稿" },
      ],
      data: {
        type: "", //页面类型----1：发文，2：收文，3：签发
        status: 10, //1待审 2驳回 3完成 4发布 5草稿
        page: 0,
        limit: 10,
        kwd: "", //搜索关键字
      },
      isShowNoData: false,
    };
  },
  methods: {
    //跳转公文详情页
    goDocPage(item) {
      // console.log(item);
      if (this.show == 5 || item.status == "草稿") {
        if (item.is_fast == 1) {
          // console.log(11, {
          //   fid: item.id,
          //   cut: 11,
          // });
          this.$router.push({
            path: "/quick",
            query: {
              fid: item.id,
              cut: 11,
            },
          });
        } else {
          this.$router.push({
            path: "/draft",
            query: {
              tid: item.templete_id,
              type: this.type,
              fid: item.id,
              lid: item.approval_id,
              cut: 11,
            },
          });
        }
      } else {
        this.$router
          .push({
            path: `/sendingDetails`,
            query: {
              fid: item.id,
              type: this.type,
              lid: item.approval_id,
            },
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    },
    // 输入搜索
    search: debounce(function () {
      this.list = [];
      this.data.page = 1;
      this.getDocumentList();
    }, 850),

    //清空搜索框
    clearData() {
      this.data.page = 0;
      this.data.kwd = "";
      this.getDocumentList();
    },
    //菜单选择
    clickMenu(type) {
      // console.log("菜单", type);
      this.list = [];
      // this.status = type == 0 ? "" : type;
      this.data.status = type == 0 ? "" : type;
      this.show = type;
      this.data.page = 0;
      this.getDocumentList();
    },
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.getDocumentList();
    },
    //    获取公文列表
    async getDocumentList() {
      this.data.page++;
      this.loading = true;
      this.finished = false;
      let _res = await getDocumentList(this.data);
      // console.log(_res);
      setTimeout(() => {
        // console.log(_res);
        if (_res.code == 1) {
          this.list.push.apply(this.list, _res.data);
          // 加载状态结束
          this.loading = false;
          if (this.list.length == _res.count) {
            this.finished = true;
          }
          // console.log(this.list, "规则字号");
        }
      }, 100);
    },
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (oldVal) {
          if (oldVal.path == "/success") {
            this.$router.go(0);
          }
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  created() {
    this.type = this.$route.params.type;
    this.data.type = this.$route.params.type;
    this.getDocumentList();
  },
  computed: {
    fDepts() {
      return (v) => {
        let _a = "";
        v.forEach((e) => {
          _a = _a + e.dep_name;
        });
        // console.log(_a);
        _a = _a.substring(0, _a.length - 1);
        return _a;
      };
    },
  },
  beforeCreate() {
    this.type = this.$route.params.type;
    if (this.type == "1") {
      document.title = "发文库";
    } else if (this.type == "2") {
      document.title = "收文库";
    } else if (this.type == "3") {
      document.title = "签发库";
    }
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.container {
  width: 414px;
  height: 100vh;
  background-color: #f5f6f7;
  box-sizing: border-box;
  .list {
    height: calc(100% - 48px - 44px - 15px);
    overflow-y: auto;
    padding: 0 15px;
  }
}

/*搜素栏和菜单*/
.header {
  background-color: #ffffff;

  .searchBox {
    background-color: #ffffff;
    width: 100%;
    height: 48px;
  }

  .menu {
    color: #303133;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    height: 44px;
    line-height: 44px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .active {
    color: #0082ef;
    border-bottom: 1px solid #0082ef;
  }
}

/*内容列表*/
.contentList {
  background-color: #f5f6f7;
  margin: 15px;
  box-sizing: border-box;

  .contenItem {
    width: 100%;
    height: 137px;
    box-sizing: border-box;
    background-color: #ffffff;
    opacity: 1;
    border-radius: 4px;
    border-left: 4px solid #f56c6c;
    padding: 15px 15px 20px;
    position: relative;

    .contentTop {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e6eef5;
      /*padding-bottom: 15px;*/
      .left {
        width: 90%;
        p:nth-child(1) {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
          height: 22px;
          line-height: 24px;
        }

        p:nth-child(2) {
          height: 38px;
          line-height: 38px;
          font-size: 14px;
          font-weight: 400;
          color: #303133;
        }
      }

      .right {
        width: 10%;
        height: 46px;
        line-height: 46px;
        position: relative;

        .goicon {
          position: absolute;
          right: 0;
        }
      }
    }

    .contentBottom {
      display: flex;
      justify-content: space-between;
      padding-top: 15px;

      div:nth-child(1) {
        height: 30px;
        line-height: 30px;
      }

      .radiusbox {
        display: inline-block;
        width: 27px;
        height: 27px;
        background: rgba(0, 130, 239, 0.1);
        border-radius: 50%;
        margin-right: 3px;

        span {
          display: inline-block;
          color: #0082ef;
          font-weight: 500;
          font-size: 10px;
          opacity: 1;
        }
      }

      div:nth-child(2) {
        width: 69px;
        height: 30px;
        line-height: 30px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 237, 245, 1);
        opacity: 1;
        border-radius: 2px;
        text-align: center;
      }
    }

    .icon {
      width: 40px;
      color: #f56c6c;
      font-size: 12px;
      position: absolute;
      top: 0;
      right: 0;
      background: linear-gradient(91deg, #ffff 0%, #fde2e2 100%);
      border-radius: 0px 4px 0px 10px;
      text-align: center;
      font-weight: 400;
    }
  }
}

/*循环公文列表样式*/
.content {
  display: flex;
  flex-wrap: wrap;
  width: 384px;
  height: 145px;
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

  .detail {
    width: 348px;
    padding: 15px 16px 19px 15px;

    div:nth-child(1) {
      font-size: 16px;
    }

    div:nth-child(2) {
      font-size: 14px;
      padding: 10px 0 0px;
      // border-bottom: 1px solid #e6eef5;
      margin-bottom: 15px;
    }

    div:nth-child(3) {
      display: flex;
      justify-content: space-between;
      height: 28px;
      line-height: 28px;
      padding-top: 15px;
      border-top: 1px solid #e6eef5;

      div {
        display: flex;
        align-items: center;
        width: 80%;
        font-size: 14px;
      }

      .iconText {
        display: inline-block;
        text-align: center;
        font-size: 12px;
        width: 34px;
        height: 34px;
        padding: 0 2px;
        line-height: 34px;
        background: rgba(144, 147, 153, 0.1);
        border-radius: 50%;
        color: #909399;
        margin-right: 6px;
        box-sizing: border-box;
      }

      .van-button {
        min-width: 69px;
        height: 28px;
        font-size: 12px;
      }
    }
  }
}

.proStatus {
  position: absolute;
  top: 0;
  right: 10px;
  width: 34px;
  height: 40px;
  text-align: center;
  color: white;
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
  top: 30px;
  right: 20px;
}

/*标题*/
.itemTitle {
  width: 85%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/*提交人*/
.subple {
  width: 80%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/*    状态*/
.zhuangtai {
  display: flex;
  align-items: center;
  height: 28px;
  line-height: 28px;
  padding-left: 10px;
  color: #62c232;
  .dian {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
    color: #62c232;
  }

  .span1 {
    color: #34a2ff;
  }
  .span2 {
    color: #34a2ff;
  }
  .span3 {
    color: #62c232;
  }
  .span4 {
    color: #f56c6c;
  }
  .span5 {
    color: #f56c6c;
  }
  .span6 {
    color: #f56c6c;
  }
  .span8 {
    color: #909399;
  }
}
.dian1 {
  background-color: #34a2ff !important;
}
.dian2 {
  background-color: #34a2ff !important;
}
.dian3 {
  background-color: #62c232 !important;
}
.dian4 {
  background-color: #f56c6c !important;
}
.dian5 {
  background-color: #f56c6c !important;
}
.dian6 {
  background-color: #f56c6c !important;
}
.dian8 {
  background-color: #909399 !important;
}
.van-tabs {
  width: 100%;
}
</style>
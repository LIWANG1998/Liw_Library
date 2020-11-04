<template>
  <div>
    <div v-if="dataList.length>0">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div
          class="content"
          v-for="(item,index) in dataList"
          :key="index"
          @click="lookDetail(item)"
        >
          <div class="line" :class="'dian'+item.status"></div>
          <div class="detail">
            <div class="title">{{item.title}}</div>
            <div class="num">
              <span>{{item.word_no}}</span>
            </div>
            <div class="status">
              <div class="userDate">
                <div class="circle">
                  <div class="circleText">{{ {1:'发',2:'收'}[doctype] }}</div>
                </div>
                <div class="userDep">
                  <span>
                    {{item.js_user}}/
                    <span>{{item.com_unit}}</span>
                  </span>
                </div>
              </div>
              <div :class="'state'+item.status">
                <span v-if="lab == 1">{{ {1:'处理中',2:'已签收',3:'被退回'}[item.status] }}</span>
                <span v-else-if="lab == 2">{{ {0:'待查阅',1:'待签收',2:'已签收',3:'已退回'}[item.status] }}</span>
              </div>
            </div>
            <div
              class="proStatus"
              :class="'proStatus'+item.process_urgent_level"
            >{{item.process_urgent_level==1?"普通":item.process_urgent_level==2?"紧急":"加急"}}</div>
          </div>
        </div>
      </van-list>
    </div>
    <noData v-else></noData>
  </div>
</template>

<script>
import { distribute } from "@/api/home";
import noData from "@/components/common/noData";
import { debouce } from "@/utils/utils"; //接口
export default {
  components: {
    noData,
  },
  data() {
    return {
      auth: "", //权限
      page: 1,
      loading: false, //加载过程中是否触发loading事件
      finished: false, //是否加载完成
      isShowNodata: false, //是否展示无数据组件
      dataList: [],
    };
  },
  props: {
    doctype: {
      //1发文，2收文，3签报
      type: [String, Number],
      default: "",
    },
    lab: {
      //1---我的发文，2---我的收文
      type: String,
      default: "",
    },
    selectVal: {
      //筛选条件
      type: [String, Number],
      default: "1",
    },
    searchVal: {
      //搜索条件
      type: [String, Number],
      default: "",
    },
  },
  watch: {
    doctype: {
      immediate: true,
      handler: function (val, oldVal) {
        // console.log("watch", val, oldVal);
        this.page = 1;
        if (val && oldVal) {
          this.getDistributeList();
        }
      },
    },
    selectVal: {
      immediate: true,
      handler: function (val, oldVal) {
        // console.log("watchselectVal", val, oldVal);
        this.page = 1;
        if (val !== undefined && oldVal !== undefined) {
          this.getDistributeList();
        }
      },
    },
    searchVal: {
      immediate: true,
      handler: function (val, oldVal) {
        // // console.log("watchsearchVal", val, oldVal);
        this.page = 1;
        if (val !== undefined && oldVal !== undefined) {
          this.getDistributeList();
        }
      },
    },
  },
  methods: {
    //获取列表
    getDistributeList() {
      let that = this;
      // console.log(this.type);
      let status = "";
      if (
        (this.lab == 1 && this.selectVal == 0) ||
        (this.lab == 2 && this.selectVal == 4)
      ) {
        status = "";
      } else {
        status = this.selectVal;
      }
      let data = new URLSearchParams();
      data.append("type", this.doctype);
      data.append("lab", this.lab);
      data.append("page", this.page);
      data.append("status", status);
      data.append("kwd", this.searchVal);
      distribute(data).then((res) => {
        if (res.code == 1) {
          if (res.data.length !== 0) {
            this.isShowNodata = false;
            if (that.page == 1) {
              that.dataList = [];
            }
            that.dataList = that.dataList.concat(res.data);
            if (res.data.length < 10) {
              that.finished = true;
            }
          } else {
            this.dataList = [];
            this.isShowNodata = true;
          }
        }
      });
    },
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      // console.log("更新");
      let that = this;
      if (!that.finished) {
        setTimeout(() => {
          that.page++;
          that.getDistributeList();
          // 加载状态结束
          that.loading = false;
        }, 2000);
      }
    },
    // 查看详情
    lookDetail(item) {
      // console.log(item);
      // 公文交换记录id, 公文id;
      if (this.lab == 2) {
        //我接收的公文
        this.$router.push({
          path: "sendingDetails",
          query: {
            distributeId: item.id,
            type: this.doctype,
            lab: 2,
            fid: item.document_id,
          },
        });
      } else {
        //我分发的公文
        this.$router.push({
          path: "sendingDetails",
          query: {
            fid: item.document_id,
            type: this.doctype,
            lab: this.lab,
            auth: this.auth,
          },
        });
      }
    },
  },
  created() {},
  activated() {
    this.getDistributeList();
    // console.log("TYPE", this.doctype, "LAB", this.lab);
  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: 384px;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 15px;
  border-radius: 4px;
  box-sizing: border-box;

  .line {
    width: 4px;
    border-radius: 2px 0 0 2px;
  }

  .detail {
    width: 350px;
    padding: 15px 0px 0px 15px;

    .title {
      width: 90%;
      font-size: 16px;
      margin-bottom: 10px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .num {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e6eef5;
      /* margin-bottom: 15px; */
      .handle {
        font-size: 12px;
      }
      .handle1 {
        color: #34a2ff;
      }
      .handle2 {
        color: #62c232;
      }
      .handle3 {
        color: #f56c6c;
      }
      .dian1 {
        background: #34a2ff;
      }
      .dian1 {
        background: #62c232;
      }
      .dian1 {
        background: #f56c6c;
      }
    }

    .status {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      height: 55px;
      line-height: 55px;

      .userDate {
        display: flex;
        width: 85%;
      }

      .circle {
        width: 28px;
        height: 28px;
        margin-top: 12px;
        padding-left: 3px;
        padding-top: 1px;
        border-radius: 50%;
        background: rgba(144, 147, 153, 0.1);

        .circleText {
          width: 25px;
          height: 14px;
          line-height: 28px;
          text-align: center;
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .userDep {
      width: 65%;
      margin: 0 10px 0 6px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .time {
      width: 31%;
      box-sizing: border-box;
      margin-right: 4px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      /*text-overflow: ellipsis;*/
    }
  }
}
.proStatus {
  position: absolute;
  top: 0;
  right: 9px;
  width: 28px;
  height: 34px;
  text-align: center;
  color: white;
  font-size: 11px;
  box-sizing: border-box;
  padding-top: 4px;
}
//普通
.proStatus1 {
  background: url("../../../assets/img/document/normal.png") no-repeat;
  background-size: 28px 34px;
  color: #303133;
}
//紧急
.proStatus2 {
  background: url("../../../assets/img/document/so-urgent.png") no-repeat;
  background-size: 28px 34px;
}
//加急
.proStatus3 {
  background: url("../../../assets/img/document/urgent.png") no-repeat;
  background-size: 28px 34px;
}
.dian0 {
  background: #999999;
}
.dian1 {
  background-color: #34a2ff;
}
.dian2 {
  background-color: #62c232;
}
.dian3 {
  background-color: #f56c6c;
}
.state1 {
  color: #34a2ff;
}
.state2 {
  color: #62c232;
}
.state3 {
  color: #f56c6c;
}
</style>
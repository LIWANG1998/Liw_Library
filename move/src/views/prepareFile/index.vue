<template>
  <div class="box">
    <div>
      <van-search
        v-model="keyword"
        @input="inputSearchInfo"
        @clear="clearData()"
        placeholder="请输入关键字"
        input-align="center"
      />
      <template v-if="list.length>0">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div class="fileBox content" v-for="(item, index) in list" :key="index">
            <div class="line dian2"></div>
            <div class="detail" @click="goDocumentPage(item.id)">
              <div class="title">{{item.title}}</div>
              <div class="num">
                <span>{{item.word_no}}</span>
              </div>
              <div class="status">
                <div class="userDate">
                  <div class="userDep">
                    <span class="type">发文</span>
                    <span class="dept">{{item.creater}}/{{(item.dep_name).split(",")[0]}}</span>
                  </div>
                </div>
              </div>
              <div
                class="proStatus"
                :class="'proStatus'+item.process_urgent_level"
              >{{item.process_urgent_level_cn}}</div>
            </div>
          </div>
        </van-list>
      </template>
      <no-data v-else></no-data>
    </div>
  </div>
</template>

<script>
import noData from "@/components/common/noData";
import { getDocumentList } from "@/api/audit";
import { debounce } from "@/js/public.js";
export default {
  name: "index",
  components: {
    noData,
  },
  data() {
    return {
      loading: false, //加载过程中是否触发loading事件
      finished: false, //是否加载完成
      isShowNodata: false, //是否显示无数据
      list: [],
      keyword: "", //搜索关键字
      page: 1,
    };
  },
  methods: {
    init() {
      this.loading = false; //加载过程中是否触发loading事件
      this.finished = false; //是否加载完成
      this.isShowNodata = false; //是否显示无数据
      this.list = [];
      this.keyword = ""; //搜索关键字
      this.page = 1;
    },
    //输入搜索内容
    inputSearchInfo: debounce(function () {
      this.list = [];
      this.page = 1;
      this.getFileList();
    }, 500),

    clearData() {
      // console.log(22);
    },
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      // console.log("更新");
      let that = this;
      if (!this.finished) {
        setTimeout(() => {
          that.page++;
          that.getFileList();
          // 加载状态结束
          that.loading = false;
        }, 2000);
      }
    },
    //去详情页
    goDocumentPage(val) {
      // console.log(val);
      this.$router.push({
        path: "sendingDetails",
        query: {
          fid: val,
          type: 0,
          status:20
        },
      });
    },
    //获取内容列表
    getFileList() {
      //归档或者废弃箱
      let datas = {
        type: 1,
        status: 6,
        page: this.page,
        kwd: this.keyword,
      };
      getDocumentList(datas).then((res) => {
        if (res.code == 1) {
          this.isShowNodata = false;
          if (this.page == 1) {
            this.list = [];
          }
          this.list = this.list.concat(res.data);
          if (res.data.length < 10) {
            this.finished = true;
          }
        } else {
          this.isShowNodata = true; //显示暂无数据
          this.list = [];
        }
      });
    },
  },
  created() {
    // this.getFileList();
  },
  activated() {
    this.init();
    this.getFileList();
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
    .type {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      background: rgba(144, 147, 153, 0.1);
      border-radius: 50%;
      color: #909399;
      font-size: 12px;
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
      .dian2 {
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
      display: flex;
      align-items: center;
      .dept {
        display: inline-block;
        width: 70%;
        margin: 0 10px 0 6px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
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
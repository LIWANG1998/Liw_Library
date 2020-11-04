<template>
  <div class="box">
    <van-tabs
      @change="onTabChange"
      v-model="data.type"
      color="#0082EF"
      line-width="25px"
      title-active-color="#0082EF"
    >
      <van-search
        v-model="data.kwd"
        @input.native="inputSearchInfo"
        @clear="clearData"
        placeholder="请输入搜索关键词"
        input-align="center"
      />

      <van-tab v-for="(item, index) in titleList" :title="item.title" :key="index" :name="item.key">
        <div v-if="list.length>0">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
          >
            <div
              class="fileBox content"
              v-for="(item, index) in list"
              :key="index"
              @click="goDocumentPage(item)"
            >
              <div class="line dian1"></div>
              <div class="detail">
                <div class="title">{{item.title}}</div>
                <div class="num">
                  <span>{{item.word_no}}</span>
                </div>
                <div class="status">
                  <div class="userDate">
                    <div class="userDep">
                      <span class="type">{{item.type=="发文"?"发":item.type=="收文"?"收":"签"}}</span>
                      <span
                        class="shenglue"
                        style="margin-left:10px"
                      >{{item.creater}}/{{item.dep_name}}</span>
                      <span style="margin-left:10px"></span>
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
        </div>
        <noData v-else></noData>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { document_library } from "@/api/temporary";
import noData from "@/components/common/noData";
import { debounce } from "@/js/public.js";
export default {
  components: {
    noData,
  },
  data() {
    return {
      //菜单标题数组
      titleList: [
        { title: "发文草稿", key: 1 },
        { title: "收文草稿", key: 2 },
        { title: "签报草稿", key: 3 },
      ],
      classId: "", //0---归档，1---抄送公文，2---传阅公文，3---废弃箱
      active: 1,
      keyword: "", //搜索关键字
      page: 1,
      type: 1, //1---发文,2---收文，3----签报
      circulaType: "", //类型（0传阅，1抄送）
      status: 5, //文件状态（7报废，9归档）
      loading: false, //加载过程中是否触发loading事件
      finished: false, //是否加载完成
      isShowNodata: false, //是否显示无数据
      list: [],
      count: null,
      auth: "", //权限设置
      autoSearch: null,
      data: {
        type: 1,
        kwd: "",
        page: 0,
        limit: 10,
        status: 5,
      },
    };
  },
  created() {
    this.onLoad();
    this.clearSession();
  },
  activated() {
    this.list = [];
    this.data = {
      type: 1,
      kwd: "",
      page: 0,
      limit: 10,
      status: 5,
    };
    this.onLoad();
    this.clearSession();
  },
  methods: {
    // 清理session
    clearSession() {
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
    //tab页改变click事件
    onTabChange() {
      this.data.page = 0;
      this.data.kwd = "";
      this.list = [];
      this.onLoad();
    },
    //  获取内容列表
    async get_document_library() {
      this.data.page++;
      this.loading = true;
      this.finished = false;
      let _res = await document_library(this.data);
      // console.log(_res);
      this.list.push.apply(this.list, _res.data);
      // console.log(this.list);
      // 加载状态结束
      this.loading = false;
      // 数据全部加载完成
      if (_res.data.length < this.data.limit + 1) {
        this.finished = true;
      }
    },
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.get_document_library();
    },
    // 输入搜索
    inputSearchInfo: debounce(function () {
      this.data.page = 0;
      this.list = [];
      this.onLoad();
    }, 850),
    //清空搜索框
    clearData() {
      this.data.page = 0;
      this.data.kwd = "";
      this.list = [];
      this.onLoad();
    },
    //去详情页
    goDocumentPage(val) {
      // console.log(val);
      if (val.is_fast && val.is_fast == 1) {
        this.$router.push(`/quick?fid=${val.id}&cut=11`);
      } else {
        this.$router.push(
          `/draft?fid=${val.id}&tid=${val.templete_id}&type=${val.type}&cut=11`
        );
      }
    },
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
      display: flex;
      align-items: center;
      width: 65%;
      margin: 0 10px 0 0px;
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
.shenglue {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
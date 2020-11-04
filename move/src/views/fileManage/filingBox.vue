<template>
  <div class="box">
    <van-tabs
      @click="onClick"
      v-model="active"
      color="#0082EF"
      line-width="25px"
      title-active-color="#0082EF"
    >
      <van-search
        v-model="keyword"
        @input.native="inputSearchInfo(keyword)"
        @clear="clearData()"
        placeholder="请输入搜索关键词"
        input-align="center"
      />
      <van-tab v-for="(item, index) in titleList" :name="index" :title="item" :key="index">
        <div v-if="list.length>0">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
          >
            <div class="fileBox content" v-for="(item, index) in list" :key="index">
              <div class="line dian1"></div>
              <div class="detail" @click="goDocumentPage(item.id)">
                <div class="title">{{item.title}}</div>
                <div class="num">
                  <span>{{item.word_no}}</span>
                </div>
                <div class="status">
                  <div class="userDate">
                    <div class="userDep">
                      <span class="type">{{item.type=="发文"?"发":item.type=="收文"?"收":"签"}}</span>
                      <span style="margin-left:10px">{{item.name}}/{{(item.dep_name).split(",")[0]}}</span>
                    </div>
                  </div>
                </div>
                <div class="proStatus" :class="'proStatus'+item.jjcd">{{item.process_urgent_level}}</div>
              </div>
            </div>
          </van-list>
        </div>
        <no-data v-else></no-data>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getCirculationList, getFileManagerList } from "@/api/audit";
import noData from "@/components/common/noData";
export default {
  components: {
    noData,
  },
  data() {
    return {
      titleList: ["发文归档", "收文归档", "签报归档"], //菜单标题数组
      classId: "", //0---归档，1---抄送公文，2---传阅公文，3---废弃箱
      active: 0,
      keyword: "", //搜索关键字
      page: 1,
      type: 1, //1---发文,2---收文，3----签报
      circulaType: "", //类型（0传阅，1抄送）
      status: 5, //文件状态（7报废，9归档）
      loading: false, //加载过程中是否触发loading事件
      finished: false, //是否加载完成
      isShowNodata: false, //是否显示无数据
      list: [],
      auth: "", //权限设置
    };
  },
  methods: {
    init_data() {
      this.active = 0;
      this.keyword = ""; //搜索关键字
      this.page = 1;
      this.type = 1; //1---发文,2---收文，3----签报
      this.circulaType = ""; //类型（0传阅，1抄送）
      this.status = 5; //文件状态（7报废，9归档）
      this.loading = false; //加载过程中是否触发loading事件
      this.finished = false; //是否加载完成
      this.isShowNodata = false; //是否显示无数据
      this.list = [];
      this.auth = ""; //权限设置
    },
    init() {
      this.active = Number(this.$route.query.ac);
      this.type = this.active + 1;
      // console.log(this.active, this.type);
      this.auth = this.$route.query.auth;
      // console.log("清缓存");
      this.classId = this.$route.query.id ? this.$route.query.id : 0;
      // console.log("classId", this.classId);
      if (this.classId == 0) {
        //状态为归档
        this.titleList = ["发文归档", "收文归档", "签报归档"];
        this.status = 9;
      } else if (this.classId == 1) {
        //抄送
        this.titleList = ["发文抄送", "收文抄送", "签报抄送"];
        this.circulaType = 1;
      } else if (this.classId == 2) {
        //传阅
        this.titleList = ["发文传阅", "收文传阅", "签报传阅"];
        this.circulaType = 0;
      } else if (this.classId == 3) {
        //废弃
        this.titleList = ["发文废弃", "收文废弃", "签报废弃"];
        this.status = 7; // 状态为废弃
      }
      this.status =
        this.classId == 0 ? 9 : this.classId == 3 ? 7 : this.classId;
      // console.log(this.status);
      // this.active = this.$route.query.type
      //   ? parseInt(this.$route.query.type) - 1
      //   : this.active;
      this.getFileList();
      let auth = JSON.parse(sessionStorage.getItem("SET_AUTH"));
      // console.log(auth[40]);
      Object.keys(auth).forEach(function (key) {
        // // console.log(key,auth[key]);
      });
    },
    //tab页改变click事件
    onClick(name, title) {
      this.type = name + 1;
      this.getFileList();
    },
    //  获取内容列表
    getFileList() {
      if (this.classId == 0 || this.classId == 3) {
        //归档或者废弃箱
        let datas = new URLSearchParams();
        datas.append("type", this.type);
        datas.append("status", this.status);
        datas.append("page", this.page);
        datas.append("keyword", this.keyword);
        getFileManagerList(datas).then((res) => {
          if (res.code == 1) {
            this.isShowNodata = false;
            // console.log(res);
            if (this.page == 1) {
              this.list = [];
            }
            this.list = this.list.concat(res.data.data);
            if (res.data.data.length < 10) {
              this.finished = true;
            }
          } else if (res.code == 0) {
            this.isShowNodata = true; //显示暂无数据
            this.list = [
              {
                id: "",
                title: "",
                word_no: "",
                userid: "",
                create_time: "",
                status: "",
                process_urgent_level: "",
                name: "",
                department: "",
                dep_name: "",
              },
            ];
          }
        });
      } else if (this.classId == 1 || this.classId == 2) {
        //传阅或者抄送
        let datas = new URLSearchParams();
        datas.append("type", this.circulaType);
        datas.append("status", this.type);
        datas.append("page", this.page);
        datas.append("keyword", this.keyword);
        getCirculationList(datas).then((res) => {
          this.isShowNodata = false;
          if (res.code == 1) {
            // console.log(res);
            if (this.page == 1) {
              this.list = [];
            }
            this.list = this.list.concat(res.data.data);
            if (res.data.data.length < 10) {
              this.finished = true;
            }
          } else if (res.code == 0) {
            this.isShowNodata = true;
            this.list = [
              {
                document_id: "",
                id: "",
                title: "",
                word_no: "",
                userid: "",
                create_time: "",
                process_urgent_level: "",
                status: "",
                name: "",
                department: "",
                dep_name: "",
              },
            ];
          }
        });
      }
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
    // 输入搜索
    inputSearchInfo(val) {
      // console.log("搜索", val);
      this.page = 1;
      this.keyword = val;
      // if (val) {
      setTimeout(() => {
        this.getFileList();
      }, 100);

      // }
    },
    //清空搜索框
    clearData() {
      this.page = 1;
      this.keyword = "";
      this.getFileList();
    },
    //去详情页
    goDocumentPage(val) {
      // console.log(val);
      if (this.circulaType === 0) {
        this.$router.push(
          `/sendingDetails?fid=${val}&type=${this.type}&auth=6&page=cy`
        );
      } else {
        this.$router.push(
          `/sendingDetails?fid=${val}&type=${this.type}&auth=6`
        );
      }
    },
  },
  created() {},
  activated() {
    this.init_data();
    this.init();
  },
  beforeRouteEnter(to, from, next) {
    document.title = to.query.title;
    next();
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
      margin: 0 10px 0 6px;
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
  background: url("../../assets/img/document/normal.png") no-repeat;
  background-size: 28px 34px;
  color: #303133;
}
//紧急
.proStatus2 {
  background: url("../../assets/img/document/so-urgent.png") no-repeat;
  background-size: 28px 34px;
}
//加急
.proStatus3 {
  background: url("../../assets/img/document/urgent.png") no-repeat;
  background-size: 28px 34px;
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
<template>
  <div class="contentbox">
    <!--        头部菜单tab-->
    <div class="header">
      <div class="left">
        <div v-if="currentDoc.status != 20" :class="{active:show ===1 }" @click="show =1">审批意见</div>
        <div :class="{active:show ===2 }" @click="show = 2">传阅意见（{{circulationList.length}}）</div>
      </div>
      <!--            <div class="right" @click="goDocPage">-->
      <!--                <van-icon name="orders-o"/>-->
      <!--                <div style="display: inline-block;text-indent: 3px">公文详情</div>-->
      <!--            </div>-->
    </div>
    <!--        审批意见内容-->
    <div class="lineHeight" v-if="show === 1 && currentDoc.status != 20">
      <div v-if="!isNodeNoData">
        <template v-if="nodeList && nodeList.length > 0">
          <div style="padding-top:5px" v-for="(item, index) in nodeList" :key="index">
            <div class="titleBox">
              <div class="dottod" :class="index + 1 == nodeList.length ? 'gray' : 'blue'"></div>
              <div v-if="item.where_id ==0" style="font-size: 14px;font-weight: 500">提交人</div>
              <div v-else class="jiedian">
                {{item.name}}
                <span v-if="!(item.name == '申请人' || item.name == '单个成员')" class="flag">{{ item.approver_type == 1? '会签' :  '或签' }}</span>
                <van-icon
                  v-if="item.show"
                  @click="item.show = false"
                  color="#909499"
                  style="margin-left: 5px"
                  name="arrow-down"
                />
                <van-icon
                  v-if="!item.show"
                  @click="item.show = true"
                  color="#909499"
                  style="margin-left: 5px"
                  name="arrow-up"
                />
                <!--                                <div @click="changeShowSign(index)" v-if="item.userinfo && item.userinfo.length > 1 "-->
                <!--                                     class="sign">会签-->
                <!--                                    <van-icon name="arrow-down" color="#55ABF4"/>-->
                <!--                                </div>-->
              </div>
              <!--                            <div class="time">{{item.create_time}}</div>-->
            </div>
            <div v-if="item.show">
              <div style="margin-left: 5px" v-for="(items, num) in item.userinfo" :key="num">
                <div class="conBorder" :class="index == nodeList.length - 1 ? 'noLeftBorder' : ''">
                  <div class="user">
                    <img :src="items.avatar" alt />
                    <div style="color: #606266;font-size: 14px">{{items.name}}</div>
                    <div class="subDept" v-if="items.dname">{{items.dname.join('-')}}</div>
                    <!--                                    <div v-if="items.rstatus !== 8 && (items.create_time || item.create_time)" style="" class="time">{{item.where_id == 0 ? item.create_time.slice(5) : items.create_time}}-->
                    <!--                                    </div>-->
                    <div v-if="item.where_id == 0" class="time">{{item.create_time}}</div>
                    <div
                      v-else-if="item.where_id !== 0 && items.rstatus !== 8 && items.create_time"
                      class="time"
                    >{{items.create_time}}</div>
                    <div
                      v-else
                      style="margin-left: auto;display: flex;align-items: center"
                      class="time"
                    >
                      <span
                        v-if="items.rstatus && items.rstatus == 8"
                        class="dotto"
                        :class="items.rstatus == 1? 'statDot_2' : items.handle == 2 ? 'statDot_2' : items.handle == 3?'statDot_3' : items.handle == 4 && items.rstatus && items.rstatus == 8 ? 'statDot_5' : items.handle == 4 ? 'statDot_4' : 'statDot_3'"
                      ></span>
                      <span v-if="items.rstatus && items.rstatus == 8" class="statSpan_5">已转审</span>
                      <!--                                            <span v-else-if="items.rstatus && (items.rstatus == 2 || items.rstatus == 1)" class="statSpan_3">审核中</span>-->
                    </div>
                  </div>
                  <div v-if="item.where_id == 0 && item.explain" class="optionbox">
                    <!--                                                    <span style="color: #0082EF;padding-right: 10px">-->
                    <!--                                                        {{ {'1':'等待中', '2':'审核中','3':'审核通过','4':'审核驳回', '5':'已撤销','6':'暂放','7':'报废','8':'已转审'}[items.rstatus]}}-->
                    <!--                                                    </span>-->
                    {{item.explain}}
                  </div>
                  <div v-else-if="items.rstatus && items.explain" class="optionbox">
                    <span
                      style="color: #0082EF;padding-right: 10px"
                    >{{ {'1':'等待中', '2':'审核中','3':'已同意','4':'审核驳回', '5':'已撤销','6':'暂放','7':'报废','8':'已转审'}[items.rstatus]}}</span>
                    {{items.explain}}
                  </div>
                  <div class="fileLoad" v-if="items.file && items.file.length">
                    <div>
                      <img
                        style="height: 14px;width: 14px;margin-right: 5px"
                        src="@/assets/img/newImg/gFile.png"
                        alt
                      />
                      <span style="color: #909399">附件</span>
                    </div>
                    <img
                      @click="goFilePage"
                      style="width: 14px;height: 16px"
                      src="@/assets/img/newImg/fileLoad.png"
                      alt
                    />
                  </div>
                  <!--                           转审后的人-->
                  <div v-if="items.transfer && items.transfer.length > 0" class="deptItem turnUser">
                    <div class="transfer" v-for="(it, ind) in items.transfer" :key="ind">
                      <div class="transfer_box">
                        <div class="transfer_info">
                          <img
                            style="width: 16px;height: 12px;margin-right: 3px"
                            src="@/assets/img/newImg/turnIcon.png"
                            alt
                          />
                          <img class="subUserImg" :src="it.avatar" alt />
                          <span class="subUserName">{{it.name}}</span>
                          <div class="subDept transfer_info_dep_width">
                            <span v-if="it.dname">{{it.dname.join('-')}}</span>
                            <span v-if="it.position">-{{it.position}}</span>
                          </div>
                        </div>
                        <div
                          style="display: flex;justify-content: space-between;align-items: center;"
                        >
                          <span
                            class="dotto"
                            :class="it.handle == 1? 'statDot_2' : it.handle == 2 ? 'statDot_2' : it.handle == 3?'statDot_3' : it.handle == 4 && it.status == 8 ? 'statDot_5' : it.handle == 4 ? 'statDot_4' : 'statDot_3'"
                          ></span>
                          <span v-if="it.handle == 1" class="statSpan_1">未查看</span>
                          <span v-else-if="it.handle == 2" class="statSpan_2">已查看</span>
                          <span v-else-if="it.handle == 3" class="statSpan_3">未提交</span>
                          <span v-else-if="it.handle == 4 && it.status == 8" class="statSpan_5">已转审</span>
                          <span v-else-if="it.handle == 4" class="statSpan_4">已提交</span>
                        </div>
                      </div>
                      <div v-if="it.handle ==4 && it.explain" class="optionbox">
                        <span
                          style="color: #0082EF;padding-right: 10px"
                        >{{ {'1':'等待中', '2':'审核中','3':'已同意','4':'审核驳回', '5':'已撤销','6':'暂放','7':'报废','8':'已转审'}[it.rstatus]}}</span>
                        {{it.explain}}
                      </div>
<!--                      //附件-->
                      <div class="fileLoad" v-if="it.file && it.file.length > 0">
                        <div>
                          <img
                                  style="height: 14px;width: 14px;margin-right: 5px"
                                  src="@/assets/img/newImg/gFile.png"
                                  alt
                          />
                          <span style="color: #909399">附件</span>
                        </div>
                        <img
                                @click="goFilePage"
                                style="width: 14px;height: 16px"
                                src="@/assets/img/newImg/fileLoad.png"
                                alt
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-else>
        <no-data></no-data>
      </div>
    </div>
    <div
      v-if="show === 1 && currentDoc.status == 4 && userInfo.userid == currentDoc.userid"
      @click="onReSubmit"
      class="reSub"
    >
      <div class="reSubItem">重新拟稿</div>
    </div>
    <!--        传阅意见内容-->
    <div class="chuanyue" v-if="show === 2">
      <div v-if="!isShowNoData">
        <template v-if="circulationList && circulationList.length > 0">
          <div v-for="(item, index) in circulationList" :key="index">
            <div class="titleBox">
              <div class="dottod gray"></div>
              <div
                style="display: flex; font-size: 14px;font-weight: 500;align-items: center;color: #909499"
              >{{item.comment_time}}</div>
              <!--                            <div class="time">{{item.create_time}}</div>-->
            </div>
            <div style="margin-left: 5px" class="conBorder">
              <div class="user">
                <img :src="item.avatar" alt />
                <div style="color: #606266;font-size: 14px">{{item.name}}</div>
                <div
                  style="border-radius: 2px;color: #909399"
                  v-if="item.dep_name"
                >{{item.dep_name}}</div>
                <div
                  style="border-radius: 2px;color: #909399"
                  v-if="item.position"
                >- {{item.position}}</div>
              </div>
              <div class="optionbox">{{item.remark}}</div>
            </div>
          </div>
        </template>
      </div>
      <div v-else>
        <no-data></no-data>
      </div>
    </div>
    <!--            输入意见框-->
    <div v-if="show === 2 && button && button.yijian == 1" class="inputOpinon">
      <van-cell-group>
        <van-field
          v-model="msg"
          left-icon="edit"
          type="textarea"
          center
          rows="1"
          autosize
          clearable
          placeholder="请输入意见"
          use-button-slot
        >
          <van-button @click="submitOption()" slot="button" size="small" type="info">提交</van-button>
        </van-field>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import {
  getApprovalOpinion,
  getRemarkList,
  submitCirculationComment,
} from "../../../api/audit";
import file from "./file";
import noData from "../../../components/common/noData";

export default {
  name: "opinion",
  components: {
    noData,
  },
  data() {
    return {
      type: "1", //页面类型----1：发文，2：收文，3：签发
      role: "self", //角色-----提交人：self,审核人：auditor
      show: 1, //1---显示审批意见内容，2---显示传阅意见内容
      tep: 1,
      isfile: "1", //是否有附件
      contentList: [],
      msg: "", //输入传阅内容值
      tepAction: 2, //当前流程进行到哪一步
      nodeList: "",
      isShowSign: false, //是否显示会签全部人员
      circulationList: [], //传阅意见列表
      isShowNoData: false,
      isNodeNoData: false, //审批意见没有数据提醒
      isShowOption: false, //是否显示提交意见按钮
      userInfo: {},
      currentDoc: {}, //当前公文信息
      turnIcon: "require('@/assets/img/newImg/turnIcon.png')",
    };
  },
  props: {
    docId: {
      type: [Number, String],
      default: undefined,
    },
    approvalId: {
      type: [Number, String],
      default: undefined,
    },
    dataList: {
      type: [String, Array],
      default: "",
    },
  },
  watch: {
    // dataList: {
    //     handler: function (val) {
    //         this.nodeList = val
    //         this.isNodeNoData = val && val.length > 0 ? true : false
    //         // console.log('从附件列表页传来的dataList', val)
    //     }
    // },
    isShowNoData: {
      immediate: true,
      handler: function (val) {
        // console.log("isShowNoData", val);
      },
    },
    docId: {
      immediate: true,
      handler: function (val) {
        // console.log("is", val);
      },
    },
  },
  methods: {
    //获取流程走向流程日志
    getApprovalOpinion() {
      let _this = this;
      let datas = new URLSearchParams();
      datas.append("data_id", this.docId);
      getApprovalOpinion(datas).then((res) => {
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            _this.$set(item, "show", true);
          });
          _this.nodeList = res.data;
          _this.tepAction = _this.nodeList.length - 1; //设置执行到哪一节点
        } else {
          _this.isNodeNoData = true;
        }
      });
    },
    //    到公文详情页
    goDocPage() {
      this.$router.push({
        path: "/sendingDetails",
        query: {
          fid: this.docId,
        },
      });
    },
    //    获取传阅意见
    getRemarkList() {
      let that = this;
      let datas = new URLSearchParams();
      datas.append("id", this.docId);
      // datas.append("id", 37);
      getRemarkList(datas).then((res) => {
        // console.log(res);
        if (res.data.record && res.data.record.length < 1) {
          //无传阅人
          that.isShowNoData = true;
        } else {
          //有传阅人
          let remarkList = [];
          if (res.data.record && res.data.record.length > 0) {
            res.data.record.forEach((item, index) => {
              that.isShowOption =
                item.user_id == that.userInfo.userid ? true : that.isShowOption;
            });
          }
        }
        if (res.data.remark && res.data.remark.length > 0) {
          that.isShowNoData = false;
          this.circulationList = res.data.remark;
        } else {
          //无传阅人评论
          that.isShowNoData = true;
        }
      });
    },
    //提交传阅意见
    submitOption() {
      let datas = new URLSearchParams();
      datas.append("id", this.docId);
      // datas.append("id", 37);
      datas.append("remark", this.msg);
      submitCirculationComment(datas).then((res) => {
        this.$toast.loading({
          message: "提交中...",
          forbidClick: false,
          loadingType: "spinner",
          overlay: true,
          duration: 0,
        });
        if (res) {
          this.$toast.clear();
          if (res.code == 1) {
            this.getRemarkList();
            this.$toast.success("评论成功");
            this.show = 2;
          } else {
            this.$toast.success("评论失败");
          }
        }
        this.msg = "";
      });
    },
    //  显示会签
    changeShowSign(val) {
      // console.log(val);
    },
    //到附件列表页下载
    goFilePage() {
      this.$emit("goFilePage", true);
    },
    //重新提交
    onReSubmit() {
      if (this.currentDoc.is_fast == 1) {
        this.$router.push({
          path: `/quick`,
          query: {
            fid: this.currentDoc.docId,
            type: 7,
            cut: 7,
          },
        });
      } else {
        this.$router.push({
          path: `/draft`,
          query: {
            tid: this.currentDoc.temId,
            type: this.currentDoc.type,
            fid: this.currentDoc.docId,
            cut: 7,
            // lid: this.$route.query.lid
          },
        });
      }
    },
  },
  computed: {
    button() {
      return JSON.parse(window.sessionStorage.getItem("button"));
    },
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
    this.currentDoc = JSON.parse(window.sessionStorage.getItem("currentDoc"));
    if (this.currentDoc.status == 20){
      this.show = 2
    }
    // console.log(this.docId, this.approvalId);
    this.getApprovalOpinion();
    this.getRemarkList();
  },
};
</script>

<style lang="scss" scoped>
.contentbox {
  width: 100%;
  height: calc(100vh - 34px - 20px);
  background-color: #ffffff;
  padding: 20px 15px 10px;
  box-sizing: border-box;
}

.header {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;

  .left {
    display: flex;
    color: #ffffff;
    font-size: 16px;

    div {
      border-radius: 0px 16px 0px 0px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      margin-right: 10px;
    }

    div:nth-child(1) {
      width: 89px;
      background: #d8dfe6;
    }

    div:nth-child(2) {
      width: 120px;
      background: #d8dfe6;
    }

    .active {
      background: #0082ef !important;
    }
  }

  .right {
    height: 32px;
    line-height: 32px;
    color: #004580;
    display: flex;
    align-items: center;

    .van-icon {
      height: 32px;
      line-height: 32px;
    }
  }
}

/*    审批意见内容*/
.user {
  display: flex;
  align-items: center;
  padding: 10px 0;
  height: 30px;
  line-height: 30px;

  img {
    width: 28px;
    /*height: 28px;*/
    /*line-height: 28px;*/
    margin-right: 10px;
    border-radius: 50%;
  }

  div:nth-child(2) {
    display: inline-block;
    /*height: 28px;*/
    /*line-height: 28px;*/
    color: #303133;
    font-size: 16px;
    margin-right: 10px;
  }

  div:nth-child(3) {
    max-width: 22%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    /*height: 28px;*/
    /*line-height: 28px;*/
    height: 22px;
    line-height: 22px;
    color: #c0c4cc;
    font-size: 13px;
    margin-right: 10px;
    font-weight: 400;
    border: 1px solid #cfd2d8;
    padding: 0 5px;
  }
}
.turnUser {
  border-top: 1px dashed #dcdfe6;
  margin-top: 10px;
  padding-top: 10px;
  .subUserImg {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-left: 5px;
  }
  .subUserName {
    display: inline-block;
    margin: 0 10px;
  }
}

.optionbox {
  color: #303133;
  min-height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: #f3f3f3;
  padding: 0 10px;
}

/*    附件*/
.van-radio--horizontal {
  margin-right: 0.28986rem;
}

/*    传阅意见部分*/
.contentList {
  padding: 20px 0;
}

.person {
  display: flex;
  height: 32px;
  align-items: center;
  padding-bottom: 10px;

  img {
    height: 32px;
    width: 32px;
    margin-right: 10px;
  }

  div {
    font-size: 16px;
  }

  .depName {
    font-size: 13px;
    margin-left: 10px;
    color: #c0c4cc;
    font-size: 13px;
    margin-right: 10px;
    font-weight: 400;
    border: 1px solid #cfd2d8;
    padding: 0 5px;
    max-width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.describe {
  display: inline-block;
  margin-left: 42px;
  background-color: rgba(0, 130, 239, 0.1);
  padding: 12px 16px;
  border-radius: 0px 4px 4px 4px;
}

/*    时间流转*/
.time {
  margin-left: auto;
  /*margin-left: 42px;*/
  font-size: 14px;
  color: #909499;
}

.liuzhuan {
  margin-left: 10px;
  font-size: 14px;
  color: #004580;
}

/*    输入意见框*/
.inputOpinon {
  width: 100%;
  min-height: 46px;
  box-sizing: border-box;
}

.titleBox {
  display: flex;
  /*justify-content: space-between;*/
  align-items: center;

  .time {
    color: #909499;
    font-size: 14px;
  }

  .sign {
    display: flex;
    align-items: center;
    height: 22px;
    line-height: 22px;
    color: #55abf4;
    font-size: 13px;
    margin-left: 10px;
    margin-right: 10px;
    font-weight: 400;
    border: 1px solid #55abf4;
    padding: 0 5px;
  }
  .jiedian {
    display: flex;
    font-size: 14px;
    font-weight: 500;
    align-items: center;
  }
}

.van-step--vertical {
  padding-right: 0;
}

/*    有附件*/
.haveFile {
  width: 74%;
  display: flex;
  justify-content: space-between;

  .have {
    color: #62c232;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: rgba(98, 194, 50, 0.2);
  }
}

.noFile {
  color: #909399;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: rgba(144, 147, 153, 0.2);
}
.reSub {
  position: fixed;
  bottom: 10px;
  height: 44px;
  width: 90%;
  background: #ffffff;
  padding: 0 10px;
  .reSubItem {
    text-align: center;
    width: 100%;
    height: 100%;
    line-height: 44px;
    color: #ffffff;
    background: #0082ef;
    border-radius: 5px;
  }
}
.lineHeight {
  height: calc(100% - 32px - 54px - 10px);
  overflow-y: auto;
}
.chuanyue {
  height: calc(100% - 32px - 64px);
  overflow-y: auto;
}
.statSpan_1 {
  font-size: 12px;
  color: #41aaff;
}

.statSpan_2 {
  font-size: 12px;
  color: #f56c6c;
}

.statSpan_3 {
  font-size: 12px;
  color: #f5ac40;
}

.statSpan_4 {
  font-size: 12px;
  color: #909399;
}
.dottod {
  height: 12px;
  width: 12px;
  background: #0082ef;
  border-radius: 50%;
  margin-right: 10px;
}
.blue {
  background: #0082ef;
}
.gray {
  background: #dcdfe6;
}
.dotto {
  display: inline-block;
  height: 4px;
  width: 4px;
  background: #909399;
  border-radius: 50%;
  margin-right: 5px;
}
.statSpan_1,
.statSpan_2 {
  font-size: 12px !important;
  color: #f56c6c;
}

.statSpan_3 {
  font-size: 12px !important;
  color: #f5ac40;
}

.statSpan_4 {
  font-size: 12px !important;
  color: #41aaff;
}
.statSpan_5 {
  font-size: 12px !important;
  color: #909399;
}
.statDot_1,
.statDot_2 {
  font-size: 12px !important;
  background: #f56c6c;
}

.statDot_3 {
  font-size: 12px !important;
  background: #f5ac40;
}

.statDot_4 {
  font-size: 12px !important;
  background: #41aaff;
}
.statDot_5 {
  font-size: 12px !important;
  background: #909399;
}
.conBorder {
  border-left: 1px solid #d8dfe6;
  padding: 0 0 10px 15px;
  .fileLoad {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    width: 100%;
    padding: 10px 0;
  }
  .transfer {
    padding: 5px 0;
    .transfer_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .transfer_info {
        display: flex;
        align-items: center;
        max-width: 80%;
        .transfer_info_dep_width {
          max-width: 50%;
        }
      }
    }
  }
}
.noLeftBorder {
  border-left: 0px solid #ffffff;
}
.subDept {
  border-radius: 2px;
  max-width: 35%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  height: 22px;
  line-height: 22px;
  color: #909399;
  font-size: 13px;
  /*margin-right: 10px;*/
  font-weight: 400;
  border: 1px solid #cfd2d8;
  padding: 0 5px;
}
/*    会签或签*/
.flag {
  display: inline-block;
  margin-left: 5px;
  width: 35px;
  text-align: center;
  color: #41aaff;
  font-size: 12px;
  border: 1px solid #41aaff;
}
</style>
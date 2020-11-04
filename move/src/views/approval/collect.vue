<template>
  <div class="content">
    <div class="vantab-box flex-ac">
      <div
        v-if="!isFinishAduit"
        class="vantab-box-cell"
        :class="active==1?'vantab-box-cell-act':''"
        @click="activeFun(1)"
      >
        <span>{{currentDoc.status == 20 ? '提交审批' : '当前审批'}}</span>
        <div v-show="active==1" class="vantab-box-cell-actvbox"></div>
      </div>
      <div
        class="vantab-box-cell"
        :class="active==2?'vantab-box-cell-act':''"
        @click="activeFun(2)"
      >
        <span>意见汇总</span>
        <div v-show="active==2" class="vantab-box-cell-actvbox"></div>
      </div>
      <div
        class="vantab-box-cell"
        :class="active==3?'vantab-box-cell-act':''"
        @click="activeFun(3)"
      >
        <span>附件列表</span>
        <div v-show="active==3" class="vantab-box-cell-actvbox"></div>
      </div>
    </div>
    <div class="vantab-box-content">
      <div v-if="!isFinishAduit" v-show="active==1">
        <div>
          <div v-if="isViewApproval == 0">
            <div v-if="currentDoc.status == 20">
              <Approval></Approval>
            </div>
            <!--                    正常发文审核-->
            <div v-else-if="currentDoc.is_fast == 0">
              <audit-approval
                :active="active"
                :isShowPage="isShowPage"
                :approvalInfo="approvalInfo"
              ></audit-approval>
            </div>
            <!--                                快速发文审核-->
            <div v-else-if="currentDoc.is_fast ==1">
              <quick-approval
                :active="active"
                :isShowPage="isShowPage"
                :approvalInfo="approvalInfo"
              ></quick-approval>
            </div>
          </div>
          <div v-if="isViewApproval == 1">
            <view-approval
              @goFilePage="goFilePage($event)"
              :active="active"
              :approvalInfo="approvalInfo"
            ></view-approval>
          </div>
        </div>
      </div>
      <div v-show="active==2">
        <div>
          <Opinion
            v-if="iscurr"
            :active="active"
            :docId="fid"
            :approvalId="where_id"
            @goFilePage="goFilePage($event)"
          ></Opinion>
        </div>
      </div>
      <div v-show="active==3">
        <div>
          <File :active="active" :docId="fid" :approvalId="where_id" :isFin="isFinishAduit"></File>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let activebox = [
  {
    title: "当前审批",
    name: 1,
    atv: false,
    isshow: false,
  },
  {
    title: "意见汇总",
    name: 2,
    atv: false,
    isshow: false,
  },
  {
    title: "附件列表",
    name: 3,
    atv: false,
    isshow: false,
  },
];
import Approval from "./approval.vue";
import Opinion from "./components/opinion";
import File from "./components/file";
import ViewApproval from "./components/viewApproval";
import AuditApproval from "./components/auditApproval";
import quickApproval from "./components/quickApproval";
import officialDetails from "../../components/common/officialDetails";
import documentDetail from "../../components/common/documentDetail";
import showFun from "../../components/common/showFun";
import { getApprovalInfo } from "../../api/audit";
import { documentInfo } from "../../api/home";
import noData from "../../components/common/noData";

export default {
  name: "collect",
  components: {
    File,
    Opinion,
    Approval,
    documentDetail,
    officialDetails,
    ViewApproval,
    AuditApproval,
    showFun,
    noData,
    quickApproval,
  },
  data() {
    return {
      iscurr: false,
      activebox,
      userInfo: {}, //登录人信息
      isFinishAduit: false, //是否审核完,审核完不显示‘当前审核’tab
      isViewApproval: 1, //0---显示audit-approval组件，1---view-approval组件
      approvalInfo: {}, //当前节点，上下节点信息
      fid: "", //公文id
      // type: "",//页面类型----发文：1,收文：2,签报：3
      // where_id: '',//审核流程id
      active: 1, //菜单选中状态
      commomType: 2, //1--提交审核时，2--提交后查看，3--审核时，4--审核后查看,5--审核完成后查看，6--归档查看，7--传阅查看，8--废弃查看，9--抄送查看，10.草稿箱查看，11--收文时，12--收文完成后,13--驳回后查看重新提交按钮,14--查看预发文按钮，15--转审后查看
      handle: "", //当前节点提交情况，1--未查看，2--已查看，3--未提交，4--已提交
      role: "", //self:提交人，auditor：审核人
      revoke: "", //审核人有无权限撤销
      currentDoc: {}, //当前公文对象status:1、等待中 2、审核进行中 3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，9归档，10发布
      page: false,
    };
  },
  props: {
    where_id: {
      default: () => "",
    }, //流程id
    isShowPage: {
      //显示审核详情
      default: () => "",
    },
  },
  watch: {
    // where_id: {
    //     immediate: true,
    //     handler: function (val) {
    //         // console.log('collect-where_id', val)
    //     }
    // },
    // fid: {
    //     immediate: true,
    //     handler: function (val) {
    //         // console.log('collect-fid', val)
    //     }
    // },
    active: {
      deep: true,
      immediate: true,
      handler: function (val) {
        // console.log("799797", val);
      },
    },
  },
  methods: {
    // tab切换
    activeFun(v) {
      this.active = v;
      // console.log(this.active);
    },
    //获取流程id
    getWhereId(id) {
      // console.log("111", id);
    },
    //意见列表到附件列表页
    goFilePage(val) {
      if (val) {
        this.active = 3;
      }
    },

    ////获取当前节点审批人姓名，部门
    getApprovalInfo() {
      let that = this;
      // this.currentDoc = JSON.parse(window.sessionStorage.getItem("currentDoc"));
      let datas = new URLSearchParams();
      // datas.append("data_id", 264);
      datas.append("data_id", this.fid);
      datas.append("details", 2);
      getApprovalInfo(datas).then((res) => {
        if (res.code != 0) {
          let resData = res.data;
          that.approvalInfo = res;
          that.role =
            resData.current.applicant.userid == that.userInfo.userid
              ? "self"
              : "auditor";
        } else if (res.code == 0) {
          this.isFinishAduit = true;
        }

      });
    },
    //获取当前公文信息
    documentInfo() {
      let that = this;
      documentInfo({ id: this.fid }).then((res) => {
        if (res.code == 1) {
          let _main_delivery = {};
          if (res.data.fields) {
            res.data.fields.forEach((item) => {
              if (item.e_name == "main_delivery") {
                _main_delivery = item.value;
              }
            });
          }
          that.currentDoc.deptid = res.data.dept_id;
          that.currentDoc.docId = res.data.id;
          that.currentDoc.is_fast = res.data.is_fast;
          that.currentDoc.process_id = res.data.process_id;
          that.currentDoc.is_fast = res.data.is_fast;
          that.currentDoc.red_templete = res.data.red_templete;
          that.currentDoc.status = res.data.status;
          that.currentDoc.temId = res.data.templete_id;
          that.currentDoc.type = res.data.type;
          that.currentDoc.where_id = res.data.where_id;
          that.currentDoc.userid = res.data.userid;
          that.currentDoc.can_approval = res.data.auth.can_approval;//0不可查看 1.可以审核 2.可查看
          that.currentDoc.main_delivery = _main_delivery;
          sessionStorage.setItem("currentDoc", JSON.stringify(that.currentDoc));
          this.iscurr = true;
          if (res.data.status == 20){
            this.commomType = 14
          }
          // if (
          //   res.data.status == 3 ||
          //   res.data.status == 4 ||
          //   res.data.status == 7 ||
          //   res.data.status == 20 ||
          //   res.data.status == 9  ||
          //         res.data.status == 10
          // ) {
          //   this.isFinishAduit = true;
          // }
          that.getApprovalInfo();
          // if (that.currentDoc.status == 20 && that.currentDoc.can_approval == 2) {
          //   that.isFinishAduit = false
          //   that.isViewApproval = 0
          // } else
          if (that.currentDoc.can_approval == 2){
            that.isFinishAduit = false
            that.isViewApproval = 1
          } else if (that.currentDoc.can_approval == 1) {
            that.isFinishAduit = false
            that.isViewApproval = 0
          } else {
            that.isFinishAduit = true
          }
        } else {
          that.isFinishAduit = true;
        }
        this.active = this.isFinishAduit == true ? 2 : 1;
        this.page = true;
      });
    },
  },
  mounted() {
    this.documentInfo();
    // this.page = false;
    // this.page = true;
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
    //获取路由上的参数
    this.fid = this.$route.query.fid;
  },
};
</script>

<style lang="scss" scoped>
.vantab-box {
  height: 44px;
  background-color: #f7f8fa;
  .vantab-box-cell {
    height: 100%;
    text-align: center;
    flex: 1;
    line-height: 44px;
    font-size: 16px;
    color: #303133;
    position: relative;
    .vantab-box-cell-actvbox {
      position: absolute;
      bottom: 0;
      height: 2px;
      width: 20px;
      background-color: #0082ef;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .vantab-box-cell-act {
    color: #0082ef;
  }
}
/deep/ .van-tab__text--ellipsis {
  font-size: 17px !important;
}

/deep/ .van-tabs__nav {
  background-color: #f7f8fa;
}

.content {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.content[data-v-5c297dc5] {
  padding: 0;
}

.toptab {
  height: 44px;
  line-height: 44px;
  display: flex;
  justify-content: space-around;
  font-size: 16px;
  color: #303133;

  .checked {
    color: #0082ef !important;
    border-bottom: 2px solid #0082ef !important;
  }
}
  .vantab-box-content{
    height:calc(100vh - 50px) ;
    overflow: auto;
  }
  .h100{
    height: 100%;
  }
</style>
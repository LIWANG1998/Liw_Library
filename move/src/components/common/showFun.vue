<template>
  <van-action-sheet v-model="show" :round="false">
    <div v-if="show">
      <div class="content">
        <div
          v-if="
            authButton.circulated &&
            ((commomType == 1 && type == 0) || (button && button.chuanyue == 1))
          "
          @click="choiseFun(1)"
          class="funList"
        >
          <div>
            <img src="@/assets/img/fileManage/chuan.png" alt />
            <div>传阅</div>
          </div>
        </div>
        <!--      <div v-if="commomType == 2 || commomType == 3 || commomType == 4 || commomType == 5 || commomType == 6  || commomType == 7 || commomType == 9" @click="choiseFun(2)" class="funList">-->
        <!--      <div-->
        <!--        @click="choiseFun(2)"-->
        <!--        v-if="authButton.delete && ((button && button.xiazai == 1) || (commomType == 1 && type == 0))"-->
        <!--        class="funList"-->
        <!--      >-->
        <!--        <div>-->
        <!--          <img src="@/assets/img/newImg/iconDownload.png" alt />-->
        <!--          <div>下载</div>-->
        <!--        </div>-->
        <!--      </div>-->
        <div
          v-if="button && button.chehui == 1"
          @click="choiseFun(3)"
          class="funList"
        >
          <!--            <div class="funList" @click="choiseFun(3)">-->
          <div>
            <img src="@/assets/img/fileManage/revoke.png" alt />
            <div>撤回</div>
          </div>
        </div>
        <div
          v-if="
            (button && button.caogao == 1) ||
            commomType == 1 ||
            commomType == 10
          "
          class="funList"
        >
          <div @click="choiseFun(5)">
            <img src="@/assets/img/newImg/caogaoxiang.png" alt />
            <div>存为草稿</div>
          </div>
        </div>
        <div
          v-if="
            authButton.scrap &&
            ((button && button.baofei == 1) || commomType == 1)
          "
          @click="choiseFun(4)"
          class="funList"
        >
          <div>
            <img src="@/assets/img/fileManage/fbox.png" alt />
            <div>报废</div>
          </div>
        </div>
        <div v-if="button && button.guidang == 1" class="funList">
          <div @click="choiseFun(6)">
            <img src="@/assets/img/fileManage/box.png" alt />
            <div>归档</div>
          </div>
        </div>
        <div
          v-if="
            authButton.distribution &&
            ((commomType == 1 && type == 0) ||
              (authButton.distribution && button && button.fenfa == 1))
          "
          class="funList"
        >
          <div @click="choiseFun(7)">
            <img src="@/assets/img/fileManage/fenfa.png" alt />
            <div>分发</div>
          </div>
        </div>
        <div
          v-if="
            authButton.release &&
            ((commomType == 1 && type == 0) ||
              (authButton.release && button && button.fabu == 1))
          "
          class="funList"
        >
          <div @click="choiseFun(8)">
            <img src="@/assets/img/fileManage/release.png" alt />
            <div>发布</div>
          </div>
        </div>
        <div v-if="button && button.zhuanfawen == 1" class="funList">
          <div @click="choiseFun(9)">
            <img src="@/assets/img/newImg/zhuanfawen.png" alt />
            <div>转发文</div>
          </div>
        </div>
        <div v-if="button && button.zhuanshouwen == 1" class="funList">
          <div @click="choiseFun(10)">
            <img src="@/assets/img/newImg/zhuanshouwen.png" alt />
            <div>转收文</div>
          </div>
        </div>
        <div
          v-if="authButton.delete && button && button.shanchu == 1"
          class="funList"
        >
          <!--            <div class="funList">-->
          <div @click="choiseFun(11)">
            <img src="@/assets/img/fileManage/delect.png" alt />
            <div>删除</div>
          </div>
        </div>
        <!--      预发文呈送-->
        <template v-if="commomType == 14">
          <div
            v-if="
              authButton.presented &&
              button &&
              button.chengsong == 1 &&
              processNew.process.processType == 1
            "
            class="funList"
          >
            <!--            <div class="funList">-->
            <div @click="choiseFun(13)">
              <img src="@/assets/img/newImg/chengsong.png" alt />
              <div>呈送</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-if="
              authButton.presented &&
              ((commomType == 1 &&
                type == 0 &&
                pageType != 'doc' &&
                (process == 2 || process == 3)) ||
                (commomType == 1 && type == 0 && pageType == 'doc') ||
                (button && button.chengsong == 1))
            "
            class="funList"
          >
            <!--            <div class="funList">-->
            <div @click="choiseFun(13)">
              <img src="@/assets/img/newImg/chengsong.png" alt />
              <div>呈送</div>
            </div>
          </div>
        </template>
        <div v-if="commomType == 13 && role == 'self'" class="funList">
          <!--            <div class="funList">-->
          <div @click="choiseFun(12)">
            <img src="@/assets/img/newImg/chongxintijiao.png" alt />
            <div>重新拟稿</div>
          </div>
        </div>
        <div v-if="button && button.tuihui == 1" class="funList">
          <!--            <div class="funList">-->
          <div @click="choiseFun(14)">
            <img src="@/assets/img/newImg/tuihui.png" alt />
            <div>退回</div>
          </div>
        </div>
      </div>
      <div>
        <!--      &lt;!&ndash;          选择人员 &ndash;&gt;-->
        <!--      <van-popup v-model="pel.depUserss" position="left" :style="{ height: '100%',width:'100%' }">-->
        <!--        <pickclass v-if="pel.depUserss" :pel="pel" @choiseUsercg="choiseUsercg($event)" />-->
        <!--      </van-popup>-->
        <!-- 退回理由 -->
        <van-popup
          v-model="returnFile.show"
          position="left"
          :style="{ height: '100%', width: '100%' }"
        >
          <div class="returnFile">
            <div class="returnFile-top">
              <div class="returnFile-title">消息内容</div>
              <div class="returnFile-content">
                <van-field
                  v-model="returnFile.text"
                  rows="8"
                  autosize
                  type="textarea"
                  maxlength="200"
                  placeholder="请输入退回理由"
                  show-word-limit
                />
              </div>
            </div>
            <div class="returnFile-bottom flex-ac-jsb">
              <van-button type="default" class="btn" @click="cencleFun"
                >取消</van-button
              >
              <van-button type="info" class="btn" @click="okFun"
                >确认</van-button
              >
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
import bus from "../../assets/js/eventBus.js";
import {
  changeDocumentStatus,
  submitApprovalHandle,
  delDocument,
  submitApprovalRevoke,
  submitFileCirculation,
  submitForwardSend,
  submitRelease,
  distribute_return,
} from "../../api/audit";
import { documentAdd, documentAddFast } from "../../api/home";
import pickclass from "../pickclass/pickclass";
import { set_vuex_data } from "@/js/public.js";
export default {
  components: {
    pickclass,
  },
  data() {
    return {
      returnFile: {
        show: false,
        text: "",
      },

      show: false,
      userInfo: {}, //登录人信息
      // content: "",
      authList: [], //对应类型的按钮权限
      authButton: {
        is: false,
        circulated: false, //传阅
        scrap: false, //报废
        distribution: false, //分发
        release: false, //发布
        turn_addressee: false, //转收文
        delete: false, //删除
        presented: false, //呈送
        download: false, //下载
        see: false, //查看
        delete: false, //删除
      }, //根据权限判断按钮的显示隐藏
      pelType: 0, //0传阅，1抄送，2分发
      // currentDoc:{},//当前公文信息
      lab: "", //1.我分发的 2.我接收的公文
      subButton: 1, //1保存/审核 2发布，3分发，4呈送，5传阅
      status: 2, //状态 1、等待中 2、审核进行中 3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，9归档
      readUser: [],
      // tid:'',//模板id
    };
  },
  props: {
    where_id: {
      type: [String, Number],
      default: () => "",
    },
    docId: {
      type: [String, Number],
      default: () => "",
    },
    commomType: {
      //公文总状态//1--提交审核时，2--提交后查看，3--审核时，4--审核后查看,5--审核完成后查看，6--归档查看，7--传阅查看，8--废弃查看，9--抄送查看，10.草稿箱查看，11--收文时，12--收文完成后,13--驳回后查看重新提交按钮,14--查看预发文按钮，15--转审后查看
      type: [String, Number],
      default: () => "",
    },
    type: {
      //页面类型----0,快速 1发文， 2,收文：3,签报：
      type: [String, Number],
      default: () => "",
    },
    handle: {
      //当前节点提交情况，1--未查看，2--已查看，3--未提交，4--已提交
      type: [String, Number],
      default: "",
    },
    role: {
      //self:提交人，auditor:审核人
      type: String,
      default: "",
    },
    revoke: {
      //有无权限撤回
      type: [String, Number],
      default: "",
    },
    tid: {
      //模板id
      type: [String, Number],
      default: () => "",
    },
    auth: {
      //权限类型 1发文管理,2收文管理,3签报管理,4公文交换,5公文应用设置,6文件管理区,7电子签章,8系统管理,9组织建构
      type: [String, Number],
      default: () => "",
    },
    process: {
      //快速发文时审核类型 1不需要审核流程 2指定下一节点,3流程
      type: [String, Number],
      default: () => "",
    },
    did: {
      //公文分发id
      type: [String, Number],
      default: () => "",
    },
    pageType: {
      type: [String, Number],
      default: () => "",
    },
    button: {
      type: [String, Object],
      default: () => {},
    },
    ff_id: {
      type: [String, Number],
      default: () => "",
    },
  },
  watch: {
    ff_id: {
      immediate: true,
      deep: true,
      handler: function (val, oldVal) {
        // console.log("watch中ff_id", val);
      },
    },
    commomType: {
      immediate: true,
      handler: function (val, oldVal) {
        // console.log("watch中commomType", val);
      },
    },
    docId: {
      immediate: true,
      handler: function (val, oldVal) {
        // console.log("watch中docId", val);
      },
    },
    // handle: {
    //   immediate: true,
    //   handler: function (val, oldVal) {
    //     // console.log("watch中handle", val);
    //   },
    // },
    // role: {
    //   immediate: true,
    //   handler: function (val, oldVal) {
    //     // console.log("watch中role", val);
    //   },
    // },
    // revoke: {
    //   immediate: true,
    //   handler: function (val, oldVal) {
    //     // console.log("watch中revoke", val);
    //   },
    // },
    // auth: {
    //     immediate: true,
    //     handler: function (val, oldVal) {
    //         // console.log('权限类型', val)
    //     }
    // },
    // tid: {
    //     immediate: true,
    //     handler: function (val, oldVal) {
    //         // console.log('tid类型', val)
    //     }
    // },
    button: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        // console.log("button类型", val);
      },
    },
    page: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        // console.log("page类型", val);
      },
    },
    type: {
      immediate: true,
      deep: true,
      handler: function (val, oldVal) {
        if (val !== undefined) {
          let _this = this;
          let _num = val == 0 ? 1 : val;
          _this.authList = JSON.parse(sessionStorage.getItem("SET_AUTH"))[_num];
          _this.authList.forEach((item, index) => {
            let param = "";
            if (val == 0 || val == 1 || val == 3) {
              //发文或者签发时权限code
              param = item.slice(5);
            } else if (val == 2) {
              //收文权限code
              param = item.slice(4);
            }
            if (_this.authButton[param] != undefined) {
              _this.authButton[param] = true;
            }
          });
        }
        // console.log("authButton", this.authButton);
        // console.log("watchshowfun----type", val);
      },
    },
    process: {
      immediate: true,
      handler: function (val, oldVal) {
        //快速发文时审核类型 1不需要审核流程 2指定下一节点,3选择流程流程
        // console.log(' 1不需要审核流程 2指定下一节点,3选择流程流程', val);
      },
    },
    $route(to, from) {
      if (this.$route.name != "viewDocument") {
        if (from.name == "selectpage" && from.query.key == "cyVal") {
          if (this.processNew.cyVal.values.length > 0) {
            this.choiseUsercg("cy");
          }
        } else if (from.name == "selectpage" && from.query.key == "ffVal") {
          if (this.processNew.ffVal.values.length > 0) {
            this.choiseUsercg("ff");
          }
        } else if (this.$store.state.processNew.submitType) {
          //预览中确定操作
          if (
            from.name == "viewDocument" &&
            from.query.htype == "cy" &&
            from.query.sta == 1
          ) {
            //正常流程传阅
            this.subCyFf(0); //0传阅，1抄送，2分发
          } else if (from.name == "viewDocument" && from.query.htype == "cy") {
            //快速发文传阅
            // console.log('viewDocument', this.$store.state.processNew.submitType)
            let _data = {
              type: 2, //1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
              user: this.processNew.cyVal.values,
            };
            this.turnStatus(_data);
          } else if (
            from.name == "viewDocument" &&
            from.query.htype == "ff" &&
            from.query.sta == 1
          ) {
            this.subCyFf(2); //0传阅，1抄送，2分发
          } else if (from.name == "viewDocument" && from.query.htype == "ff") {
            // console.log('viewDocument', this.$store.state.processNew.submitType)
            let _data = {
              type: 5, //1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
              user: this.processNew.ffVal.values,
            };
            this.turnStatus(_data);
          } else if (
            from.name == "viewDocument" &&
            from.query.htype == "cs" &&
            from.query.sta == 1
          ) {
            this.subCs();
          } else if (from.name == "viewDocument" && from.query.htype == "cs") {
            //呈送
            // console.log('viewDocument', this.$store.state.processNew.submitType)
            let _data = {
              type: 4, //1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
              user: [],
            };
            this.turnStatus(_data);
          } else if (
            from.name == "viewDocument" &&
            from.query.htype == "fb" &&
            from.query.sta == 1
          ) {
            this.subFb();
          } else if (from.name == "viewDocument" && from.query.htype == "fb") {
            //发布
            let _data = {
              type: 6, //1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
              user: [],
            };
            this.turnStatus(_data);
          }
        }
      }
      this.$store.state.processNew.submitType = 0;
    },
  },
  methods: {
    set_view_document_data() {
      let fls = JSON.parse(JSON.stringify(this.fields_data));
      fls.word_no.value =
        this.iss.value.length > 0 ? this.iss.value[0].word_no : "";
      // 字号
      this.datas.fields = fls;
      this.datas.process = this.red.value[0];
      this.datas.content = this.content;
    },
    //修改状态（报废、草稿、归档）
    changeDocumentStatus(status) {
      let datas = new URLSearchParams();
      datas.append("id", this.docId); //公文id
      datas.append("status", status); //7报废，8草稿，9归档
      changeDocumentStatus(datas).then((res) => {
        if (res.code == 1) {
          if (status && status == 7) {
            this.$toast.success("已报废");
            this.$router.push({
              path: `/filingBox?id=3&title=报废箱&ac=${
                this.type == 2 ? 1 : this.type == 3 ? 2 : 0
              }`,
            });
          } else if (status && status == 8) {
            this.$toast.success("已存为草稿");
          } else if (status && status == 9) {
            this.$toast.success("已归档");
            this.$router.push({
              path: `/filingBox?id=0&title=归档箱&ac=${
                this.type == 2 ? 1 : this.type == 3 ? 2 : 0
              }`,
            });
            return;
          }
          this.show = false;
          this.$router.push({ path: "/home" });
        } else {
          this.$toast.fail({
            message: res.data,
          });
        }
      });
    },
    //撤回
    submitApprovalRevoke() {
      let datas = new URLSearchParams();
      datas.append("where_id", this.where_id); //流程id
      submitApprovalRevoke(datas).then((res) => {
        if (res.code == 1) {
          this.$toast.success("成功撤回");
          this.show = false;
          this.$router.push("/home");
        } else {
          this.$toast({
            message: res.data,
          });
        }
        // this.$router.push(`/success?data_id=${this.docId}`);
      });
    },
    //点击操作按钮
    choiseFun(val) {
      let _this = this;
      //val值： 1传阅，2下载，3撤回，4报废，5存为草稿，6归档，7分发，8发布，9转发文，10转收文，11删除，12重新提交,13呈送
      //传阅
      if (val == 1) {
        this.show = false;
        if (
          this.commomType == 1 &&
          (this.type == 0 || this.$route.name == "quick")
        ) {
          //快速发文拟稿传阅
          if (this.required()) {
            // this.pel.depUserss = true
            this.pelType = 0;
            this.pel.ckt = {
              zzjg: true, // 显示 组织架构
              bm: true, // 可以选部门
              ren: true, // 可以选人
              tag: false, // 显示 标签
              dw: true, // 显示 单位
              radio: false, // 是否为单选
            };
            this.processNew.cyVal = {
              value: [],
              values: [],
            };
            this.$router.push({
              path: "/selectpage",
              query: {
                key: "cyVal",
                type: "1", //审核流程里面所有选人数据
              },
            });
          }
        } else {
          //正常发文传阅
          // this.pel.depUserss = true
          this.pelType = 0;
          this.pel.ckt = {
            zzjg: true, // 显示 组织架构
            bm: true, // 可以选部门
            ren: true, // 可以选人
            tag: false, // 显示 标签
            dw: true, // 显示 单位
            radio: false, // 是否为单选
          };
          this.processNew.cyVal = {
            value: [],
            values: [],
          };
          this.$router.push({
            path: "/selectpage",
            query: {
              key: "cyVal",
              type: "1", //审核流程里面所有选人数据
            },
          });
        }
      }
      //下載
      if (val == 2) {
        if ((this.commomType == 1 || this.commomType == 14) && this.type == 0) {
          if (this.required()) {
            this.$router.push({
              name: "viewDocument",
              query: {
                is_p: true,
              },
            });
          }
        } else {
          this.$router.push({
            name: "viewDocument",
            query: {
              is_p: true,
            },
          });
        }
      }
      //撤回
      if (val == 3) {
        this.submitApprovalRevoke();
      }
      //报废，归档
      if (val && (val == 4 || val == 6)) {
        if (this.commomType == 1 && val == 4) {
          //拟稿时报废
          let _data = {
            type: 3, //1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
            user: [],
          };
          // this.$emit("saveDraft", _data);
          this.cancel(_data);
        } else {
          //流程中归档或报废
          let status = val == 4 ? 7 : val == 6 ? 9 : val;
          this.$dialog
            .confirm({
              title: "提示",
              message: `确定${val == 4 ? "报废" : "归档"}?`,
            })
            .then(() => {
              this.changeDocumentStatus(status);
            });
        }
      }
      //存为草稿
      if (val && val == 5) {
        let _data = {
          type: 1, //1.草稿，2.提交预发文3.报废
          user: [],
        };
        // this.$emit("saveDraft", _data);
        this.cancel(_data);
        this.show = false;
      }
      //分发
      if (val && val == 7) {
        this.show = false;
        if ((this.commomType == 1 || this.commomType == 14) && this.type == 0) {
          if (this.required()) {
            this.pelType = 2;
            this.pel.ckt = {
              zzjg: true, // 显示 组织架构
              bm: true, // 可以选部门
              ren: true, // 可以选人
              tag: false, // 显示 标签
              dw: true, // 显示 单位
              radio: false, // 是否为单选
            };
            this.processNew.ffVal = {
              value: [],
              values: [],
            };
            this.$router.push({
              path: "/selectpage",
              query: {
                key: "ffVal",
                type: "1", //审核流程里面所有选人数据
              },
            });
          }
        } else {
          // this.pel.depUserss = true
          // this.pel.type = 2
          //  jldkj
          // this.pel.depUserss = true
          this.pelType = 2;
          this.pel.ckt = {
            zzjg: true, // 显示 组织架构
            bm: true, // 可以选部门
            ren: true, // 可以选人
            tag: false, // 显示 标签
            dw: true, // 显示 单位
            radio: false, // 是否为单选
          };
          this.processNew.ffVal = {
            value: [],
            values: [],
          };
          this.$router.push({
            path: "/selectpage",
            query: {
              key: "ffVal",
              type: "1", //审核流程里面所有选人数据
            },
          });
        }
      }
      //发布
      if (val && val == 8) {
        if ((this.commomType == 1 || this.commomType == 14) && this.type == 0) {
          if (this.required()) {
            let _data = {
              type: 6, //1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
              user: [],
            };
            // this.$emit("saveDraft", _data);
            this.cancel(_data);
          }
        } else {
          set_vuex_data(this.type);
          this.$router.push({
            path: "/viewDocument",
            query: { htype: "fb", sta: 1 },
          });
        }
      }
      //转收文
      if (val && val == 10) {
        this.show = false;
        this.$router.push(
          `/officialtep?type=2&distributeId=${
            this.ff_id ? this.ff_id : this.$route.query.distributeId
          }&cut=15`
        );
      }
      //转发文
      if (val && val == 9) {
        this.show = false;
        this.$router.push(
          `/officialtep?type=1&distributeId=${this.docId}&cut=16`
        );
      }
      //删除
      if (val && val == 11) {
        this.$dialog
          .confirm({
            title: "提示",
            message: `确定删除公文`,
          })
          .then(() => {
            let datas = new URLSearchParams();
            datas.append("id", this.docId); //公文id
            delDocument(datas).then((res) => {
              if (res.code == 1) {
                this.$toast.success("已删除");
                this.show = false;
                this.$router.push({ path: "/home" });
              } else {
                this.$toast({
                  message: res.data,
                });
              }
            });
          });
      }
      //重新提交
      if (val && val == 12) {
        //tid=12&type=1&fid=460&lid
        this.show = false;
        if (this.currentDoc.is_fast == 1) {
          this.$router.push({
            path: `/quick`,
            query: {
              fid: this.docId,
              type: 7,
              cut: 7,
            },
          });
        } else {
          this.$router.push({
            path: `/draft`,
            query: {
              tid: this.tid,
              type: this.type,
              fid: this.docId,
              cut: 7,
            },
          });
        }
      }
      //呈送
      if (val && val == 13) {
        set_vuex_data(this.type);
        this.$router.push({
          path: "/viewDocument",
          query: { htype: "cs", sta: this.commomType == 1 ? 0 : 1 },
        });
      }
      if (val && val == 14) {
        this.returnFile.show = true;
      }
    },
    //选择人后按确定按钮
    choiseUsercg(val) {
      let _this = this;
      // console.log(222, this.pel);
      // console.log("processNew", this.processNew);
      let _pageType = this.$route.name == "quick" ? 0 : this.$route.query.type;
      //pel.type: 0传阅，1抄送，2分发
      if (
        (this.commomType == 1 || this.commomType == 14) &&
        _pageType == 0 &&
        this.pelType == 0
      ) {
        //预发文
        let _data = {
          type: 2, //1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
          user: this.processNew.cyVal.values,
        };
        // this.$emit("saveDraft", _data);
        this.cancel(_data);
        // this.show = false;
      } else if (
        (this.commomType == 1 || this.commomType == 14) &&
        this.pelType == 2
      ) {
        //分发
        let _data = {
          type: 5, //1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
          user: this.processNew.ffVal.values,
        };
        // this.$emit("saveDraft", _data);
        this.cancel(_data);
      } else {
        //pelType：0传阅，1抄送，2分发，正常流程中传阅分发
        let _userId = [];
        //0传阅，1抄送，2分发
        if (this.pelType == 0) {
          set_vuex_data(this.type);
          this.$router
            .push({
              path: "/viewDocument",
              query: { htype: "cy", sta: 1 },
            })
            .catch((err) => {
              // console.log(err)
            });
        } else if (this.pelType == 2) {
          set_vuex_data(this.type);
          this.$router
            .push({
              path: "/viewDocument",
              query: { htype: "ff", sta: 1 },
            })
            .catch((err) => {
              // console.log(err)
            });
        }
      }
    },
    //正常流程传阅，分发
    subCyFf(type) {
      //pelType：0传阅，1抄送，2分发
      this.$toast.loading({
        message: "提交中,请稍等...",
        forbidClick: false,
        loadingType: "spinner",
        overlay: true,
        duration: 0,
      });
      let _this = this;
      let _userId = [];
      if (type == 0) {
        this.processNew.cyVal.values.forEach((item, index) => {
          let _data = {
            //flag:1部门 2标签 3角色 4人员userid
            //pel:1.部门，2，单个成员 3.标签
            flag: item.type == 2 ? 4 : item.type == 3 ? 2 : item.type,
            id: item.id,
            title: item.title,
          };
          _userId.push(_data);
        });
      } else if (type == 2) {
        this.processNew.ffVal.values.forEach((item, index) => {
          let _data = {
            //flag:1部门 2标签 3角色 4人员userid
            //pel:1.部门，2，单个成员 3.标签
            flag: item.type == 2 ? 4 : item.type == 3 ? 2 : item.type,
            id: item.id,
            title: item.title,
          };
          _userId.push(_data);
        });
      }
      let params = {
        document_id: this.$route.query.fid,
        type: type,
        arr: _userId,
      };
      submitFileCirculation(params).then((res) => {
        if (res.code == 1) {
          this.$router.push({
            path: "/success",
            query: {
              text:
                type == 0
                  ? "传阅"
                  : type == 1
                  ? "抄送"
                  : type == 2
                  ? "分发"
                  : "提交",
              id: this.$route.query.fid,
              type: this.type,
              status: res.status,
              page: type == 0 ? "cy" : type == 1 ? "cs" : type == 2 ? "ff" : "",
            },
          });
          // _this.$toast.success("发送成功");
          // _this.$router.go(0);
        } else {
          _this.$toast.fail(res.msg);
        }
        // this.pel.results = []
        // this.pel.result = []
        console.log(this.processNew);
        this.processNew.cyVal.values = [];
        this.processNew.cyVal.value = [];
        this.processNew?.ffVal?.values
          ? (this.processNew.ffVal.values = [])
          : "";
        this.processNew?.ffVal?.value ? (this.processNew.ffVal.value = []) : "";
        _this.$toast.clear();
      });
    },
    //正常流程呈送
    subCs() {
      let _this = this;
      this.$toast.loading({
        message: "提交中,请稍等...",
        forbidClick: false,
        loadingType: "spinner",
        overlay: true,
        duration: 0,
      });
      let _data = {
        id: this.$route.query.fid ? this.$route.query.fid : "",
      };
      submitForwardSend(_data).then((res) => {
        if (res && res.code == 1) {
          this.$router.push({
            path: "/success",
            query: {
              id: this.$route.query.fid,
              type: _this.type,
              status: 2,
              text: "呈送",
            },
          });
        } else if (res && res.code == 0) {
          _this.$toast.fail(res.msg);
        }
        _this.$toast.clear();
      });
    },
    //正常流程发布
    subFb() {
      let _this = this;
      this.$toast.loading({
        message: "提交中,请稍等...",
        forbidClick: false,
        loadingType: "spinner",
        overlay: true,
        duration: 0,
      });
      submitRelease({ id: _this.docId }).then((res) => {
        if (res && res.code == 1) {
          this.$router.push({
            path: "/success",
            query: {
              id: this.fid,
              type: _this.type,
              status: 2,
              text: "发布",
            },
          });
        } else if (res && res.code == 0) {
          _this.$toast.fail(res.msg);
        }
        _this.$toast.clear();
      });
    },
    // 取消退回
    cencleFun() {
      this.returnFile.show = false;
    },
    // 确认退回
    okFun() {
      this.distribute_returnFun();
      this.returnFile.show = false;
    },
    // 退回接口
    async distribute_returnFun() {
      let _res = await distribute_return({
        id: this.did,
        remark: this.returnFile.text,
      });
      this.$toast(_res.msg);
      if (_res.code == 1) {
        this.$router.push({
          name: "officialOut",
          query: {
            lab: 2,
          },
        });
      }
    },
    //非空判断
    required() {
      let is_pass = true;
      let document_arrs = this.fields_data;
      // if (!sessionStorage.getItem("content")) {
      //   this.$toast(`请填写正文内容`);
      //   return false;
      // }
      for (const key in document_arrs) {
        if (document_arrs[key].is_must == 1) {
          if (
            (document_arrs[key].value == [] ||
              document_arrs[key].value == "") &&
            (document_arrs[key].values == [] || document_arrs[key].values == "")
          ) {
            is_pass = false;
            this.$toast(`请填写${document_arrs[key].c_name}`);
            break;
          }
        }
      }
      return is_pass;
    },
    //    // 提交按钮提示
    cancel(val) {
      //val.type--//1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
      let _this = this;
      //jskdf
      //kds
      if (val) {
        if (val.type == 4) {
          //呈送时提示
          let _main_delivery = [];
          let _delivery_notice = "";
          if (
            this.document_arr &&
            this.document_arr.main_delivery &&
            (this.document_arr.main_delivery.select ||
              this.document_arr.main_delivery.inter)
              // ----------------------------
          ) {
            _main_delivery = this.document_arr.main_delivery.select.map(
              (item) => {
                return item.name;
              }
            );
            // ----------------------------
            this.document_arr.main_delivery.inter &&
              this.document_arr.main_delivery.inter.forEach((el) => {
                _main_delivery.push(el.name);
              });
              // ----------------------------
          }
          _delivery_notice = _main_delivery
            ? `确定呈送到${_main_delivery.join(",")}${
                this.document_arr.main_delivery.text
                  ? "," + this.document_arr.main_delivery.text
                  : ""
              }，呈送后不可撤回`
            : "请选择主送单位";
          this.$dialog
            .confirm({
              message: _delivery_notice,
            })
            .then(() => {
              _this.turnStatus(val);
            })
            .catch(() => {});
        } else if (val.type == 6) {
          set_vuex_data(this.type);
          this.$router.push({
            path: "/viewDocument",
            query: { htype: "fb" },
          });
        } else if (val.type == 2 || val.type == 5) {
          //2传阅，5.分发
          // console.log("readUser", this.readUser);
          let _readUser = val.user.map((item) => item.title);
          set_vuex_data(this.type);
          this.$router
            .push({
              path: "/viewDocument",
              query: { htype: val.type == 2 ? "cy" : "ff" },
            })
            .catch((err) => {
              // console.log(err)
            });
        } else if (val.type == 1) {
          this.$dialog
            .confirm({
              title: "提示",
              message: "当前已有发文信息，是否存入草稿?",
            })
            .then(() => {
              _this.turnStatus(val);
            })
            .catch(() => {});
        } else if (val.type == 3) {
          this.$dialog
            .confirm({
              title: "提示",
              message: "报废后数据不可恢复，是否继续",
            })
            .then(() => {
              this.turnStatus(val);
            })
            .catch(() => {});
        }
      } else {
        this.$dialog
          .confirm({
            title: "提示",
            message: "取消后将不会保存已编辑数据，确定取消",
          })
          .then(() => {
            this.$router.push("/home");
          })
          .catch(() => {});
      }
      //;sldf
    },
    //转换状态
    turnStatus(val) {
      let _this = this;
      //公文提交：状态 1、等待中 2、审核进行中 3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，9归档
      //快速发文提交  2发文，3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，10发布，11分发，12呈送
      //buuton:1保存/审核 2发布，3分发，4呈送，5传阅
      //val.type://1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
      _this.status =
        val.type == 1
          ? 8
          : val.type == 3
          ? 7
          : val.type == 4
          ? 12
          : val.type == 5
          ? 11
          : val.type == 6
          ? 10
          : 2;
      _this.subButton =
        val.type == 2
          ? 5
          : val.type == 4
          ? 4
          : val.type == 5
          ? 3
          : val.type == 6
          ? 2
          : 1;
      if (val.user) {
        let _arr = [];
        val.user.forEach((item, index) => {
          _arr.push({
            //flag:1部门 2标签 3角色 4人员userid
            //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
            flag:
              item.type == 1
                ? 1
                : item.type == 2
                ? 4
                : item.type == 3
                ? 2
                : item.type,
            id: item.id,
            title: item.title,
          });
        });
        _this.readUser = _arr;
      }
      // console.log(val);
      // console.log(_this.status, _this.subButton)
      _this.submitBtn();
    },
    //提交
    submitBtn() {
      if (this.type == 0) {
        this.submitQuick();
      } else {
        this.submitNormal();
      }
      // console.log('提交提交')
    },
    //提交快速发文
    submitQuick() {
      let _this = this;
      this.$toast.loading({
        message: "提交中,请稍等...",
        forbidClick: false,
        loadingType: "spinner",
        overlay: true,
        duration: 0,
      });
      // this.handles.signature = this.signature_ele.signature;
      // this.handles.signature_img = this.signature_ele.signature_img;
      let params = {
        id: _this.fid ? _this.fid : "",
        content: _this.content,
        enclosure_file: _this.enclosure_file,
        status: _this.status,
        button: _this.subButton,
        handles: _this.handles,
        deptid:
          _this.userInfo.dept.length > 1
            ? _this.deptid
            : _this.userInfo.department,
        process_id:
          _this.processNew.process.processType &&
          _this.processNew.process.processType == 3
            ? _this.processNew.process.checked.id
            : 0,
        approval_copy: _this.processNew.checkedCopy
          ? _this.processNew.checkedCopy
          : [],
        document_arr: _this.document_arr,
        red_templete_id: _this.red_templete_id,
        arr: _this.readUser,
        signature_arr: _this.signature_ele,
        word_no: _this.word_no,
      };
      let approval_copy = [];
      if (_this.processNew.process.checkedCopy) {
        //抄送人
        //flag:1部门、2标签、3人员、4上级、5申请人
        //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
        _this.processNew.process.checkedCopy.forEach((item) => {
          let _copyArray = [];
          _copyArray.push({
            flag:
              item.type == 1
                ? 1
                : item.type == 2
                ? 3
                : item.type == 3
                ? 2
                : item.type,
            id: item.id,
          });
          approval_copy.push({
            users: _copyArray,
          });
        });
        this.$set(params, "approval_copy", approval_copy);
      }
      if (_this.processNew.process.processType == 2) {
        //指定下一节点shpr
        //添加审批人
        let approval_where = [];
        //flag:1部门、2标签、3人员、4上级、5申请人
        //item.type = 1部门，2、人员 3、标签,4、上级，5、申请人
        let usersArray = [];
        if (
          _this.processNew.process.processNUm.results &&
          _this.processNew.process.processNUm.results.length > 0
        ) {
          _this.processNew.process.processNUm.results.forEach((item) => {
            usersArray.push({
              flag:
                item.type == 1
                  ? 1
                  : item.type == 2
                  ? 3
                  : item.type == 3
                  ? 2
                  : item.type,
              id: item.id,
            });
          });
        } else {
          _this.$toast("请选择下一节点审批人");
          return;
        }
        approval_where.push({
          users: usersArray,
          approver_type: _this.processNew.process.processNUm.approver_type,
          id: 0,
          // title: item.type == 2 ? '单个成员' : item.title,
        });
        _this.$set(params, "approval_where", approval_where);
      } else if (_this.processNew.process.processType == 3) {
        //选择流程的审批人
        //添加审批人
        let approval_where = [];
        //flag:1部门、2标签、3人员、4上级、5申请人
        //item.type = 1部门，2、人员 3、标签
        _this.processNew.process.checkedAuditor.forEach((item) => {
          let usersArray = [];
          usersArray.push({
            flag:
              item.type == 1
                ? 1
                : item.type == 2
                ? 3
                : item.type == 3
                ? 2
                : item.type,
            id: item.id,
          });
          approval_where.push({
            users: usersArray,
            approver_type: item.approver_type,
            id: 0,
            title: item.type == 2 ? "单个成员" : item.title,
          });
        });
        _this.$set(params, "approval_where", approval_where);
      }
      // console.log('结果', params)
      documentAddFast(params).then((res) => {
        if (res) {
          _this.$toast.clear();
          if (res.code == 1) {
            let data_id = res.data_id;
            _this.$router.push({
              path: "/success",
              query: {
                text: "提交",
                id: data_id,
                type: _this.type,
                status: this.commomType == 14 ? 20 : res.status, //预发文this.commomType == 14
                page:
                  _this.subButton == 3
                    ? "ff"
                    : _this.subButton == 5 || this.commomType == 14
                    ? "yfw"
                    : "",
              },
            });
            _this.$toast.success(res.msg);
          } else {
            if (res.msg == "请选择主送单位") {
              _this.$toast("系统中未检测到呈送单位，请重新选择呈送单位");
            } else {
              _this.$toast(res.msg);
            }
          }
        } else {
          _this.$toast.clear();
        }
      });
    },
    //正常发文
    submitNormal(val) {
      let _this = this;
      this.$toast.loading({
        message: val ? "提交中..." : "正在存为草稿...",
        forbidClick: false,
        loadingType: "spinner",
        overlay: true,
        duration: 0,
      });
      let timeD = 86400 * Number(this.dTime);
      let timeT = 3600 * Number(this.tTime);
      let timeS = 60 * Number(this.sTime);
      let _msg_time = timeD + timeT + timeS;
      let params = {
        deptid:
          this.userInfo.dept.length > 1
            ? this.deptid
            : this.userInfo.department,
        templete_id: Number(_this.tid),
        status: _this.status,
        id: _this.fid ? _this.fid : "",
        type: Number(_this.type),
        content: _this.content,
        process_urgent_level: Number(_this.handles.process_urgent_level),
        document_arr: _this.document_arr,
        way: _this.way.join(),
        enclosure_file: _this.enclosure_file,
        approval_file: _this.handles.files,
        msg_time: _msg_time,
        opinion: _this.handles.opinion,
        approval_where: [],
        approval_copy: [],
        // signature: this.signature_ele.signature,
        // signature_img: this.signature_ele.signature_img,
        red_templete_id: this.red_templete_id,
        distribute_id: this.$route.query.did
          ? Number(this.$route.query.did)
          : "",
        process_id: _this.processNew.process.checked
          ? _this.processNew.process.checked.id
          : 0,
        signature_arr: this.signature_ele,
        word_no: this.word_no,
      };
      // console.log(params)
      //抄送人
      let approval_copy = [];
      if (_this.processNew.process.checkedCopy) {
        //flag:1部门、2标签、3人员、4上级、5申请人
        _this.processNew.process.checkedCopy.forEach((item) => {
          let _copyArray = [];
          _copyArray.push({
            flag:
              item.type == 1
                ? 1
                : item.type == 2
                ? 3
                : item.type == 3
                ? 2
                : item.type,
            id: item.id,
          });
          approval_copy.push({
            users: _copyArray,
          });
        });
        this.$set(params, "approval_copy", approval_copy);
      }
      if (_this.processNew.process.checkedAuditor) {
        //选择流程的审批人
        let approval_where = [];
        //flag:1部门、2标签、3人员、4上级、5申请人
        //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
        _this.processNew.process.checkedAuditor.forEach((item) => {
          let usersArray = [];
          usersArray.push({
            flag:
              item.type == 1
                ? 1
                : item.type == 2
                ? 3
                : item.type == 3
                ? 2
                : item.type,
            id: item.id,
          });
          approval_where.push({
            users: usersArray,
            approver_type: item.approver_type,
            id: 0,
            title: item.type == 2 ? "单个成员" : item.title,
          });
        });
        this.$set(params, "approval_where", approval_where);
      }
      // console.log(params);
      documentAdd(params).then((res) => {
        // console.log(res);
        _this.$toast.clear();
        if (res.code == 1) {
          if (_this.status !== 2 && !val) {
            _this.$router.push({
              path: "/success",
              query: {
                type: _this.type,
                status: _this.status,
                text: "提交",
              },
            });
          } else {
            let data_id = res.data_id;
            `/success?data_id=${data_id}`;
            this.$router.push({
              path: "/success",
              query: {
                id: data_id,
                type: _this.type,
                status: 2,
                text: "提交",
              },
            });
            _this.$toast.clear();
          }
        } else {
          _this.$toast.clear();
          _this.$toast.fail(res.msg);
        }
      });
    },
  },
  computed: {
    currentDoc() {
      return JSON.parse(sessionStorage.getItem("currentDoc"));
    },
    page() {
      return JSON.parse(sessionStorage.getItem("page"));
    },
    pel() {
      return this.$store.state.edittext.pel;
    },
    processNew() {
      // console.log("下一审批节点nextAuditor", this.$store.state.processNew);
      return this.$store.state.processNew;
    },
    fields_data() {
      return this.$store.state.edittext.document_arrs;
    },
    datas() {
      return this.$store.state.edittext.datas;
    },
    iss() {
      return this.$store.state.edittext.iss;
    },
    red() {
      return this.$store.state.edittext.red;
    },
    content: {
      get() {
        return this.$store.state.edittext.content;
      },
      set(value) {
        this.$store.state.edittext.content = value;
      },
    },
    enclosure_file() {
      return this.$store.state.edittext.enclosure_file;
    },
    document_arr() {
      return this.$store.state.edittext.document_arr;
    },
    red_templete_id() {
      return this.$store.state.edittext.red.value &&
        this.$store.state.edittext.red.value.length > 0
        ? this.$store.state.edittext.red.value[0].id
        : "";
    },
    signature_ele() {
      return this.$store.state.edittext.eles;
    },
    word_no() {
      return this.$store.state.edittext.iss.value &&
        this.$store.state.edittext.iss.value.length > 0
        ? this.$store.state.edittext.iss.value[0]
        : "";
    },
    handles() {
      // console.log('handles', this.$store.state.processNew.handles)
      return this.$store.state.processNew.handles;
    },
    deptid: {
      get() {
        return this.$store.state.processNew.deptid;
      },
      set(value) {
        this.$store.state.processNew.deptid = value;
      },
    },
    dTime: {
      get() {
        return this.$store.state.processNew.dTime;
      },
      set(value) {
        this.$store.state.processNew.dTime = value;
      },
    },
    tTime: {
      get() {
        return this.$store.state.processNew.tTime;
      },
      set(value) {
        this.$store.state.processNew.tTime = value;
      },
    },
    sTime: {
      get() {
        return this.$store.state.processNew.sTime;
      },
      set(value) {
        this.$store.state.processNew.sTime = value;
      },
    },
    way: {
      get() {
        return this.$store.state.processNew.way;
      },
      set(value) {
        this.$store.state.processNew.way = value;
      },
    },
  },
  activated() {
    // bus.$on("show", (show, data) => {
    //   if (show == 1) {
    //     this.show = true;
    //   } else {
    //     this.show = false;
    //   }
    // });
    this.show = false;
  },
  created() {
    this.fid = this.$route.query.fid ? this.$route.query.fid : "";
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    // this.tid =  this.$route.query.tid ? this.$route.query.tid : ''
    this.lab = this.$route.query.lab ? this.$route.query.lab : "";
    bus.$on("show", (show, data) => {
      if (show == 1) {
        this.show = true;
      } else {
        this.show = false;
      }
    });
  },
};
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;

  img {
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
  }
}

.funList {
  width: 33.33%;
  height: 138px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.returnFile {
  * {
    box-sizing: border-box;
  }
  height: 100%;
  position: relative;
  .returnFile-top {
    padding: 15px;
    .returnFile-title {
      font-size: 16px;
      font-weight: 500;
    }
    .returnFile-content {
      margin-top: 15px;
      /deep/.van-cell {
        background: rgba(241, 247, 250, 1);
        border-radius: 4px;
      }
    }
  }
  .returnFile-bottom {
    box-shadow: 0px -1px 0px rgba(230, 230, 230, 1);
    width: 100%;
    padding: 0 15px;
    position: absolute;
    height: 60px;
    bottom: 0;
    .btn {
      width: 187px;
    }
  }
}
</style>
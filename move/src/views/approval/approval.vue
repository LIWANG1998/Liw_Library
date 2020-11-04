<template>
  <div class="box">
    <div>
      <!-- 紧急程度 -->
      <div class="degree">
        <div class="chiose">
          <img style="width: 11px;height: 14px" src="@/assets/img/newImg/fire.png" alt />
          <div class="title">紧急程度</div>
        </div>
        <div class="contentbox">
          <div class="radios-box flex-ac">
            <template v-for="(item,index) in radioslist">
              <div class="radios-box-cl flex-ac" :key="index" @click="radiosFun(item.name)">
                <div
                  class="radios-cell flex-ac-jc"
                  :style="handles.process_urgent_level == item.name?{borderColor:item.color}:''"
                >
                  <template v-if="handles.process_urgent_level == item.name">
                    <div
                      class="radios-cell-nei"
                      :style="handles.process_urgent_level == item.name?{backgroundColor:item.color}:''"
                    ></div>
                  </template>
                </div>
                <div
                  class="radios-box-cl-font flex-ac-jc"
                  :style="handles.process_urgent_level == item.name?{color:item.color}:''"
                >{{item.text}}</div>
              </div>
            </template>
          </div>
          <!--                    <div class="radios">-->
          <!--                        <van-radio-group v-model="handles.process_urgent_level" direction="horizontal">-->
          <!--                            <van-radio class="mr-20" name="1"><span :class="handles.process_urgent_level == 1 ? 'blue' : ''">普通</span></van-radio>-->
          <!--                            <van-radio class="mr-20" name="2" checked-color="#F5AC40"><span :class="handles.process_urgent_level == 2 ? 'orange' : ''">紧急</span></van-radio>-->
          <!--                            <van-radio class="mr-20" name="3" checked-color="#F56C6C"><span :class="handles.process_urgent_level == 3 ? 'red' : ''">加急</span></van-radio>-->
          <!--                        </van-radio-group>-->
          <!--                    </div>-->
        </div>
      </div>
      <!-- 处理意见 -->
      <div class="degree opinion">
        <div class="chiose">
          <van-icon color="#C8D8E5" name="edit" />
          <div class="title">处理意见</div>
        </div>
        <!-- 输入留言-->
        <div class="inputValue">
          <van-field
            maxlength="400"
            show-word-limit
            v-model="handles.opinion"
            rows="7"
            type="textarea"
            placeholder="请输入处理意见"
          />
        </div>
        <div class="quick" @click="showReplychange">
          <div class="quickbox">
            <img
              style="width: 16px;height: 12px;margin-right: 5px"
              src="@/assets/img/newImg/info.png"
              alt
            />
            快捷回复
          </div>
        </div>
      </div>

      <!-- 附件 -->
      <div class="degree enclosure">
        <div class="chiose">
          <img style="width: 15px;height: 15px" src="@/assets/img/newImg/file.png" alt />
          <div class="title">附件(非正文附件)</div>
        </div>
        <div class="enclosureList">
          <!-- 上传附件 -->
          <van-uploader :after-read="afterRead">
            <div class="upbtn">
              <img style="width: 18px;height: 18px;" src="@/assets/img/newImg/wenjianjia.png" alt />
            </div>
          </van-uploader>
          <div v-for="(item,index) in handles.files" :key="index">
            <load-file :file="item" @delFile="delFile"></load-file>
          </div>
        </div>
      </div>
      <!-- 流程设置 -->
      <div class="degree">
        <div class="chiose">
          <img style="width: 13px;height: 13px" src="@/assets/img/newImg/liucheng.png" alt />
          <div class="title">流程设置</div>
        </div>
        <!--              有审核流程-->
        <div v-if="process.processType == 2" class="contentbox" @click="goProcessPage">
          <div class="contentItem">
            <div>
              <span style="font-size: 16px;margin-right: 8px">下一审批节点</span>
              <span class="typeIcon">{{process.processNUm.approver_type == 1? '会签' : '或签'}}</span>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>
        <div v-if="process.processType == 2" style="padding: 0px 20px;">
          <div
            class="nextBox"
            v-if="process.processNUm.results && process.processNUm.results.length > 0"
          >
            <div class="nextItem">
              <div
                v-for="(item,index) in process.processNUm.results"
                :key="index"
                style="margin: 0 5px"
              >
                <template v-if="index < 6">
                  <div style="height: 100%">
                    <img style="height:36px;width:36px;border-radius:18px;" :src="item.img" />
                    <p class="nextName" style="color: #303133">{{item.title}}</p>
                  </div>
                </template>
              </div>
            </div>
            <div v-if="process.processNUm.results.length > 6">
              <van-icon name="ellipsis" />
            </div>
          </div>
        </div>
        <!--              没有指定审核流程-->
        <div v-if="process.processType == 1" class="contentbox" @click="goProcessPage">
          <div class="process">
            <div class="ellipsis">
              <span style="font-size: 16px;margin-right: 8px">不需要审批流程</span>
            </div>
            <van-icon color="#C7C7CC" name="arrow" />
          </div>
        </div>
        <!--              指定审核流程-->
        <div v-if="process.processType == 3" class="contentbox" @click="goProcessPage">
          <div class="process">
            <div class="ellipsis">
              <span style="font-size: 16px;margin-right: 8px">{{process.checked.name}}</span>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <!-- 提交人 -->
      <div class="degree">
        <div class="chiose">
          <img style="width: 13px;height: 13px" src="@/assets/img/newImg/subUser.png" alt />
          <div class="title">提交人</div>
        </div>
        <div class="contentbox">
          <div style="display: flex;align-items: center">
            <img
              style="width: 32px;height: 32px;margin-right: 5px;border-radius: 50%"
              :src="userInfo.avatar"
              alt
            />
            <span class="userName">{{userInfo.name}}</span>
            <span v-if="userInfo.dept.length == 1" class="userDept">（{{userInfo.dept[0].dep_name}}）</span>
          </div>
        </div>
        <div v-if="userInfo.dept.length > 1" class style="border-top: 1px solid #F5F6F7">
          <div class="usercheck">
            <van-field
              readonly
              clickable
              label="提交人部门"
              :value="depsName"
              placeholder="请选择"
              @click="urgentPicker = true"
              input-align="right"
              :border="false"
            />
            <van-popup v-model="urgentPicker" round position="bottom">
              <van-picker
                show-toolbar
                :columns="urgentcolumns"
                @cancel="urgentPicker = false"
                @confirm="onConfirmDegree"
              />
            </van-popup>
            <van-icon color="#C7C7CC" name="arrow" />
          </div>
        </div>
      </div>
      <!--        显示更多-->
      <div v-if="type == 1 || type == 2 || type == 3" @click="show = !show" class="showmore">
        <div>更多信息</div>
        <div style="color: #909399">
          <div v-if="show">
            <span class="toatst">收起</span>
            <van-icon name="arrow-up" />
          </div>
          <div v-if="!show">
            <span class="toatst">展开</span>
            <van-icon name="arrow-down" />
          </div>
        </div>
      </div>
      <div v-if="show && (type == 1 || type == 2 || type == 3)">
        <!-- 通知选项 -->
        <div class="degree">
          <div class="chiose">
            <img style="width: 15px;height: 15px" src="@/assets/img/newImg/message.png" alt />
            <div class="title">通知选项</div>
          </div>
          <div class="start">
            <div style="color: #303133;padding: 5px 0 0">流程启动</div>
            <div>
              <input
                placeholder="0"
                v-model="dTime"
                :onkeyup="dTime=dTime.replace(/[^\d]/g, '')"
                :onafterpaste="dTime=dTime.replace(/[^\d]/g, '')"
                class="timeNum"
                type="tel"
                maxlength="2"
                @change="changDime(dTime,tTime,sTime)"
              />天
              <input
                placeholder="0"
                :onkeyup="dTime=dTime.replace(/[^\d]/g, '')"
                :onafterpaste="dTime=dTime.replace(/[^\d]/g, '')"
                v-model="tTime"
                class="timeNum"
                type="tel"
                maxlength="2"
                @change="changDime(dTime,tTime,sTime)"
              />时
              <input
                placeholder="0"
                :onkeyup="dTime=dTime.replace(/[^\d]/g, '')"
                :onafterpaste="dTime=dTime.replace(/[^\d]/g, '')"
                v-model="sTime"
                class="timeNum"
                type="tel"
                maxlength="2"
                @change="changDime(dTime,tTime,sTime)"
              />分，仍未结束，通知我
            </div>
            <van-checkbox
              style="padding-bottom: 15px"
              v-model="checked"
              shape="square"
              @change="goWay()"
            >流程结束后通知我</van-checkbox>
          </div>
          <!-- 流程通知 -->
          <div v-if="checked" class="notice">
            <div class="title">通知方式</div>
            <div style="padding:5px 15px">
              <van-checkbox-group v-model="way" direction="horizontal">
                <van-checkbox :name="1">待办</van-checkbox>
                <van-checkbox :name="4" disabled>企业微信</van-checkbox>
                <van-checkbox
                  :disabled="!(userInfo.system &&  userInfo.system.youxiang == 1)"
                  :name="2"
                >邮箱</van-checkbox>
                <van-checkbox
                  :disabled="!(userInfo.system && userInfo.system.duanxin == 1)"
                  :name="3"
                >短消息</van-checkbox>
              </van-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <!--        取消/确定按钮-->
      <div class="buttonbox">
        <van-button type="default" class="cancel" @click="cancel()">取消</van-button>
        <van-button
          v-if="process.processType == 1 && type == 0 && setPresented"
          color="#0082EF"
          class="ensure"
          @click="submitBtn(2)"
        >呈送</van-button>
        <van-button v-else color="#0082EF" class="ensure" @click="submitBtn(1)">提交</van-button>
      </div>
      <div v-if="status != 20">
        <showFun
                :commomType="commomType"
                role="self"
                :type="type"
                :docId="fid"
                :process="process.processType"
                :button="auth"
                :tid = "templete_id"
                @saveDraft="cancel($event)"
        ></showFun>
        <documentDetail></documentDetail>
      </div>
      <!--            快捷回復-->
      <van-popup v-model="showReply" position="bottom" :style="{ height: '60%' }">
        <quick-reply @getmessage="getmessage($event)" :showReply="showReply"></quick-reply>
      </van-popup>
      <!--            流程設置-->
      <van-popup
        v-model="showSetProcess"
        position="right"
        closeable
        :style="{ height: '100%',width:'100%' }"
      >
        <set-process :process="process" @changeProcess="changeProcess($event)"></set-process>
      </van-popup>
    </div>
  </div>
</template>
<script>
let radioslist = [
  {
    name: "1",
    text: "普通",
    color: "#999898",
  },
  {
    name: "2",
    text: "紧急",
    color: "#FF5B5B",
  },
  {
    name: "3",
    text: "加急",
    color: "#D12D2D",
  },
];
import showFun from "../../components/common/showFun";
import documentDetail from "../../components/common/documentDetail";
import {
  documentAdd,
  qiniuToken,
  approvalBefore,
  documentAddFast,
} from "../../api/home"; //接口
import { getDate } from "@/assets/js/up";
import { saveFile } from "@/assets/js/public";
import loadFile from "@/components/common/loadFile";
import quickReply from "@/components/common/quickReply";
import updataReply from "@/components/common/updataReply";
import setProcess from "@/components/common/setProcess";
import { set_vuex_data } from "@/js/public.js";
import bus from "@/assets/js/eventBus.js";

export default {
  name: "approval",
  components: {
    showFun,
    documentDetail,
    loadFile,
    quickReply,
    updataReply,
    setProcess,
  },
  props: {
    role: {
      type: String,
      default: "self", //
    },
  },
  data() {
    return {
      radioslist,
      // -----------------------
      // handles: {
      //   opinion: "", //处理意见
      //   files: [], //审核附件
      //   way: "", //通知方式 1待办 2邮箱 3短消息
      //   notice: "", //是否通知 1不通知 2 通知
      //   process_urgent_level: "1", //紧急程度 1普通 2紧急 3加急
      //   signature: "", //电子签章的id
      //   where_id: "0", //	审批流程 新增发文时传入0
      // },
      process_id: "0", // 不需要流程的时候 流程的id 0
      // deptid: "", //提交人的部门id
      depList: [], //提交人所属的部门
      // depsName: "", // 显示提交人部门
      urgentPicker: false,
      urgentcolumns: [], //提交人数组

      // ======================
      commomType: 1, //公共按钮状态提交拟稿
      approval_where: [], //审核流程
      opinion: "", //处理意见
      // dTime: "", //天
      // tTime: "", //时
      // sTime: "", //分
      approval_file: [], //审核的附件
      process_urgent_level: 1, //紧急程度1普通2紧急3加急 ,
      msg_time: 0, //通知时间
      // way: [1, 4], //
      radio: "",
      message: "", //留言的信息
      checked: false, //复选框状态
      type: "", //页面类型----发文：dispatch,收文：receive,签发：sign
      templete_id: "",
      tongyi: "", //1为确定提交
      // chioseNotification: -1, //选择按钮
      oneFun: false,
      twofun: false,
      threefun: false,
      show: false, //是否显示更多
      path: "", //七牛云文件地址
      fid: "", //公文id
      showReply: false, //显示快捷回复
      qiniuYun: {
        key: "", //图片名字
        token: "", //token
      },
      nextTo: [], //下一节点
      status: 2, //是否存为草稿8
      currentDoc: {},
      nextPeo: [], //下一审批节点人
      userInfo: {}, //提交人
      showSetProcess: false,
      // process: {
      //   processType: 1, //1:，没有审批节点，2：指定下一节点，3：指定流程
      //   checked: {}, //选择流程信息
      // },
      processOld: [], //正常发文选中的模板中审核节点
      checkedCopyOld: [], //正常发文选中的模板中抄送人
      button: 1, //1保存/审核 2发布，3分发，4呈送，5传阅
      readUser: [], //预发文时的传阅人
      title: "", //页面biaot
      auth: [], //按钮权限
      setPresented: false, //判断是否有呈送
      headImg: require("@/assets/img/newImg/headImg.png"),
    };
  },
  methods: {
    radiosFun(name) {
      this.handles.process_urgent_level = name;
    },
    //选择提交人部门
    onConfirmDegree(value, index) {
      this.deptid = value.id;
      this.depsName = value.text;
      // this.urgent_level_name = value.text;
      // this.document_arr.urgent_level = value.id;
      this.urgentPicker = false;
    },
    showReplychange() {
      this.showReply = true;
    },
    //获取快捷回复message
    getmessage(val) {
      this.showReply = false;
      // console.log("app", val);
      if (val.type == "sure") {
        this.handles.opinion = this.handles.opinion + "\n" + val.message;
      }
    },
    //显示设置流程
    goProcessPage(val) {
      // this.showSetProcess = true
      // console.log(this.process);
      // process = {
      //     checked: {
      //         collect: 2,
      //         id: 2,
      //         name: "哈哈哈",
      //     },
      //     processType: 3,
      //     type: "1",
      // }
      this.$router.push({
        path: "/setProcess",
        query: {
          type: this.type,
          status:this.$route.query.status ? this.$route.query.status : ''
        },
      });
    },

    // 上传附件
    afterRead(files) {
      saveFile(files, this.callFile);
    },
    //七牛云上传返回来的文件数据
    callFile(val) {
      this.handles.files.push(val);
      this.approval_file.push(val);
    },
    //流程启动时间
    changDime(d, t, s) {
      if (t != "") {
        t = parseInt(t);
      }
      if (s != "") {
        s = parseInt(s);
      }
      if (t > 24) {
        this.tTime = 24;
      } else {
        this.tTime = t;
      }
      if (s > 59) {
        this.sTime = 59;
      } else {
        this.sTime = s;
      }
      let timeD = 86400 * Number(d);
      let timeT = 3600 * Number(this.tTime);
      let timeS = 60 * Number(this.sTime);
      this.msg_time = timeD + timeT + timeS;
    },
    //获取当前时间的时间戳
    timest() {
      var tmp = Date.parse(new Date()).toString();
      tmp = tmp.substr(0, 10);
      return tmp;
    },
    // 流程初始化
    getdocumentNext() {
        let _this = this;
        let data = {};
        data.approval_id = this.$route.query.status == 8 ? this.caogao_process.process.id : this.$route.query.lid
        approvalBefore(data).then((res) => {
          if (res.code == 1) {
            if (res.data.data) {
              if (res.data.data.length) {
                _this.nextTo = res.data.data[0].info;
              }
              //给流程设置参数
              _this.process.processType = 3;
            }
            _this.process.checked.name = res.data.explain.name;
            _this.process.checked.collect = res.data.collect;
            _this.process.checked.id = this.$route.query.status == 8 ? this.caogao_process.process.id : this.$route.query.lid;
            if (_this.$route.query.status == 8){//草稿回显
              //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
              //flag:1部门、2标签、3人员、4上级、5申请人
              let _lists = []//选人组件中results
              let _list = []//选人组件中result
              let _copy = []
              if (_this.caogao_process && _this.caogao_process.process){
                _this.caogao_process.process.info.forEach((item, index) =>{
                  let _params = {}
                  if (item.flag == 1 || item.flag == 2){
                    _this.$set(_params, 'id', item.flag_id)
                    _this.$set(_params, 'type', item.flag == 2 ? 3 : 1)
                    _this.$set(_params, 'img', item.flag == 1 ? _this.headImg : item.flag == 2 ? _this.headImg : '')
                    _this.$set(_params, 'title', item.name)
                    _this.$set(_params, 'w_id', (item.flag == 1 ? 'bm' : item.flag == 2 ? 'tag' : '') + item.flag_id)
                    _this.$set(_params, 'approver_type', item.approver_type)
                      _list.push(_params.w_id)
                    } else if (item.flag == 3 || item.flag == 5){
                      item.cc_info.forEach((items, index) =>{
                        _this.$set(_params, 'id', items.userid)
                        _this.$set(_params, 'type', item.flag == 3 ? 2 : 5)
                        _this.$set(_params, 'img', items.avatar ? items.avatar : _this.headImg)
                        _this.$set(_params, 'title', items.name)
                        _this.$set(_params, 'w_id', `${item.flag == 3? 'ren' : 'sq' }` + items.userid)
                        _this.$set(_params, 'approver_type', item.approver_type)
                        _list.push(_params.w_id)
                      })
                    } else if (item.flag == 4) {//直接上级
                    _this.$set(_params, 'id', item.flag_id)
                    _this.$set(_params, 'type', 4)
                    _this.$set(_params, 'img', _this.headImg)
                    _this.$set(_params, 'title', item.name)
                    _this.$set(_params, 'w_id', 'top' + item.flag_id)
                    _this.$set(_params, 'approver_type', item.approver_type)
                        _list.push(_params.w_id)
                    }
                  _lists.push(_params)
                })
                if (_this.caogao_process.process.info && _this.caogao_process.process.info[0].cc_list){
                  _this.caogao_process.process.info[0].cc_list.forEach((item, index) =>{
                    let _item = {}
                    _this.$set(_item, 'id', item.userid)
                    _this.$set(_item, 'type', 2)
                    _this.$set(_item, 'img', item.avatar ? item.avatar : _this.headImg)
                    _this.$set(_item, 'title', item.title)
                    _this.$set(_item, 'w_id', 'ren' + item.userid)
                    _copy.push(_item)
                  })
                }
              }
              // _this.processOld = _lists;
              // _this.checkedCopyOld = _lists;
              _this.process.checkedAuditor = _lists
              _this.process.checkedCopy  = _copy
            } else {//正常拟稿
              // _this.processOld = res.data.data;
              // _this.checkedCopyOld = res.data.approval_copy;
            //正常发文拟稿指定流程抄送人回填
                let _approval_copy = [];
                if (res.data.approval_copy) {
                    //itme.type：1.上级，2：标签，3：单个成员，4：申请人，5：部门
                    //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
                    res.data.approval_copy.forEach((item, index) => {
                        //初始化抄送人
                        let _data = {
                            id: item.value,
                            img: item.avatar ? item.avatar : _this.headImg,
                            title: item.title,
                            w_id:'ren' + item.value,
                          type:
                                item.type == 1
                                    ? 4
                                    : item.type == 2
                                    ? 3
                                    : item.type == 3
                                        ? 2
                                        : item.type == 4
                                            ? 5
                                            : 1,
                        };
                        _approval_copy.push(_data);
                    });
                }
              _this.process.checkedCopy = _approval_copy
            //    审核人回填数据
              _this.initAuditor(res.data.data)

            }
            // console.log('approval_processNew', _this.$store.state.processNew)
            //  是否允许编辑
            _this.process.edit_approval = res.data.explain?.root_setting ? res.data.explain.root_setting.edit_approval : 2;
            _this.process.edit_cclist = res.data.explain.root_setting.edit_cclist;
            // _this.vuex_process.checked = _this.process.checked;
            // _this.vuex_process.processType = _this.process.processType;
          }
        });
    },
      //初始化审核人
      initAuditor(val) {
          let _lists = []//选人组件中results
          let _list = []//选人组件中result
          val.forEach((item, index) => {
              let _params = {}
              //itme.type：1.上级，2：标签，3：单个成员，4：申请人，5：部门
              //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
              this.$set(_params, 'type', item.type == 3 ? 2 : item.type == 5 ? 1 : item.type == 2 ? 3 : item.type == 1 ? 4 : 5)
              if (_params.type == 1 || _params.type == 3) {
                  this.$set(_params, 'id', item.value)
                  this.$set(_params, 'img', _params.type == 1 ? require('@/assets/img/newImg/headImg.png') : _params.type == 3 ? require('@/assets/img/newImg/headImg.png') : '')
                  this.$set(_params, 'title', item.title)
                  this.$set(_params, 'w_id', (_params.type == 1 ? 'bm' : _params.type == 3 ? 'tag' : '') + item.id)
                  this.$set(_params, 'approver_type', item.approver_type)
                  _list.push(_params.w_id)
              } else if (_params.type == 2) {
                  item.info.forEach((items, index) => {
                      this.$set(_params, 'id', items.userid)
                      this.$set(_params, 'img', items.avatar ? items.avatar : this.headImg)
                      this.$set(_params, 'title', items.name)
                      this.$set(_params, 'w_id', 'ren' + items.userid)
                      this.$set(_params, 'approver_type', item.approver_type)
                      _list.push(_params.w_id)
                  })
              } else if (_params.type == 4) {
                  this.$set(_params, 'id', item.value)
                  this.$set(_params, 'img', item.avatar ? item.avatar : this.headImg)
                  this.$set(_params, 'title', item.title)
                  this.$set(_params, 'w_id', 'top' + item.value)
                  this.$set(_params, 'approver_type', item.approver_type)
                  _list.push(_params.w_id)
              } else if (_params.type == 5) {
                  this.$set(_params, 'id', JSON.parse(sessionStorage.getItem('userInfo')).userid)
                  this.$set(_params, 'img', JSON.parse(sessionStorage.getItem('userInfo')).avatar)
                  this.$set(_params, 'title', item.title)
                  this.$set(_params, 'w_id', 'sq' + JSON.parse(sessionStorage.getItem('userInfo')).id)
                  this.$set(_params, 'approver_type', item.approver_type)
                  _list.push(_params.w_id)
              }
              _lists.push(_params)
          })
          // this.auditorList = _lists
              this.process.checkedAuditor = _lists
      },
    //删除文件
    delFile(info) {
      this.handles.files.forEach((item, index ) => {
        if (info.oldname == item.oldname && info.path == item.path) {
          this.handles.files.splice(index, 1);
          this.approval_file.splice(index, 1);
        }
      });
    },
    // 提交按钮提示
    cancel(val) {
      //val.type--//1.草稿，2.提交预发文3.报废4.呈送，5.分发，6.发布
      let _this = this;
      //jskdf
      //kds
      if (val){
        if (val.type == 4) {
          //呈送时提示
          let _main_delivery = [];
          let _delivery_notice = "";
          if (
                  this.document_arr &&
                  this.document_arr.main_delivery &&
                  this.document_arr.main_delivery.select
          ) {
            _main_delivery = this.document_arr.main_delivery.select.map(
                    (item) => {
                      return item.name;
                    }
            );
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
          //发布提示
          this.$dialog
                  .confirm({
                    message: "发布后全员将可见公文，确定发布？",
                  })
                  .then(() => {
                    _this.turnStatus(val);
                  })
                  .catch(() => {});
        } else if (val.type == 2 || val.type == 5) {
          //2传阅，3.分发
          // console.log("readUser", this.readUser);
          let _readUser = val.user.map((item) => item.title);
          this.$dialog
                  .confirm({
                    message: `确定${val.type == 2 ? "传阅" : "分发"}给${_readUser.join(
                            ","
                    )}`,
                  })
                  .then(() => {
                    _this.turnStatus(val);
                  })
                  .catch(() => {});
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
                  this.$router.push('/home')
                })
                .catch(() => {});
      }
      //;sldf
    },
    //转换状态
    turnStatus(val) {
      let _this = this;
      // console.log(val.user);
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
      _this.button =
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
      _this.submitBtn();
    },
    //提交
    submitBtn(val) {
      //val:1.提交，2.呈送
      let _this = this;
      if (this.required()) {
        // 必填项判断
        if (this.type == 0) {
          //快速发文
          if (val){
            this.button = val && val == 2 ? 4 : 1;
            this.status = val && val == 2 ? 12 : 2;
          }
          if (this.button == 4) {
            // //呈送时提示
            // let _main_delivery = [];
            // let _delivery_notice = "";
            // if (
            //   this.document_arr &&
            //   this.document_arr.main_delivery &&
            //   this.document_arr.main_delivery.select
            // ) {
            //   _main_delivery = this.document_arr.main_delivery.select.map(
            //     (item) => {
            //       return item.name;
            //     }
            //   );
            // }
            // _delivery_notice = _main_delivery
            //   ? `确定呈送到${_main_delivery.join(",")}${
            //       this.document_arr.main_delivery.text
            //         ? "," + this.document_arr.main_delivery.text
            //         : ""
            //     }，呈送后不可撤回`
            //   : "请选择主送单位";
            // this.$dialog
            //   .confirm({
            //     message: _delivery_notice,
            //   })
            //   .then(() => {
            //     _this.submitQuick();
            //   })
            //   .catch(() => {});
            set_vuex_data(this.type);
            this.$router.push({
              path:'/viewDocument',
              query:{htype:'cs'}
            })
          } else {
            _this.submitQuick();
          }
        } else if (this.type) {
          this.submitNormal(val);
        }
      }
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
        id: this.$route.query.status == 20 ?  "" :  _this.fid ? _this.fid : "",
        content: _this.content,
        enclosure_file: _this.enclosure_file,
        status: _this.status,
        button: _this.button,
        handles: _this.handles,
        deptid:
                _this.userInfo.dept.length > 1
            ? _this.deptid
            : _this.userInfo.department,
        process_id: _this.process.processType && _this.process.processType == 3 ? _this.process.checked.id : 0,
        approval_copy: _this.process.checkedCopy ? _this.process.checkedCopy : [],
        document_arr: _this.document_arr,
        red_templete_id: _this.red_templete_id,
        arr: _this.readUser,
        signature_arr: _this.signature_ele,
        word_no: _this.word_no,
      };
      let approval_copy = [];
      if (this.process.checkedCopy) {
        //抄送人
        //flag:1部门、2标签、3人员、4上级、5申请人
        //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
        this.process.checkedCopy.forEach((item) => {
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
      if (_this.process.processType == 2) {
        //指定下一节点shpr
        //添加审批人
        let approval_where = [];
        //flag:1部门、2标签、3人员、4上级、5申请人
        //item.type = 1部门，2、人员 3、标签,4、上级，5、申请人
        let usersArray = [];
        if (_this.process.processNUm.results && _this.process.processNUm.results.length > 0){
          _this.process.processNUm.results.forEach((item) => {
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
          _this.$toast('请选择下一节点审批人')
          return
        }
        approval_where.push({
          users: usersArray,
          approver_type: _this.process.processNUm.approver_type,
          id: 0,
          // title: item.type == 2 ? '单个成员' : item.title,
        });
        _this.$set(params, "approval_where", approval_where);
      } else if (_this.process.processType == 3) {
        //选择流程的审批人
        //添加审批人
        let approval_where = [];
        //flag:1部门、2标签、3人员、4上级、5申请人
        //item.type = 1部门，2、人员 3、标签
        _this.process.checkedAuditor.forEach((item) => {
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
                text:"提交",
                id: data_id,
                type: _this.type,
                status: res.status,
                page: _this.button == 5 ? "yfw" : _this.button == 3 ? "ff" : "",
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
      let time = Number(_this.msg_time);
      let params = {
        deptid:
          this.userInfo.dept.length > 1
            ? this.deptid
            : this.userInfo.department,
        templete_id: parseInt(_this.templete_id),
        status: val ? 2 : _this.status,
        id: _this.fid ? _this.fid : "",
        type: parseInt(_this.type),
        content: _this.content,
        process_urgent_level: parseInt(_this.handles.process_urgent_level),
        document_arr: _this.document_arr,
        way: _this.way.join(),
        enclosure_file: _this.enclosure_file,
        approval_file: _this.approval_file,
        msg_time: time,
        opinion: _this.handles.opinion,
        approval_where: [],
        approval_copy: [],
        // signature: this.signature_ele.signature,
        // signature_img: this.signature_ele.signature_img,
        red_templete_id: this.red_templete_id,
        distribute_id: this.$route.query.did
          ? parseInt(this.$route.query.did)
          : "",
        process_id: this.process.checked ? this.process.checked.id : 0,
        signature_arr: this.signature_ele,
        word_no: this.word_no,
      };
      //抄送人
      let approval_copy = [];
      if (this.process.checkedCopy) {
        //flag:1部门、2标签、3人员、4上级、5申请人
        this.process.checkedCopy.forEach((item) => {
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
      if (this.process.checkedAuditor) {
        //选择流程的审批人
        let approval_where = [];
        //flag:1部门、2标签、3人员、4上级、5申请人
        //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
        this.process.checkedAuditor.forEach((item) => {
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
                text:"提交",
                type: _this.type,
                status: _this.status,
              },
            });
          } else {
            let data_id = res.data_id;
            `/success?data_id=${data_id}`;
            this.$router.push({
              path: "/success",
              query: {
                text:"提交",
                id: data_id,
                type: _this.type,
                status: 2,
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
    select(id) {
      this.process_urgent_level = id;
    },
    //设置流程人员
    changeProcess(val) {
      this.showSetProcess = false;
      this.process = val;
      // console.log("process", val);
    },
    required() {
      let is_pass = true;
      let document_arrs = JSON.parse(sessionStorage.getItem("document_arrs"));
      // if (!sessionStorage.getItem("content")) {
      //     this.$toast(`请填写正文内容`);
      //     return false;
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
    //是否通知
    goWay() {
      // if (!this.checked) {
      //     this.notice = 1
      //     this.$set(this, "way", ['4'])
      // } else {
      //     this.notice = 2
      // }
    },
    //初始化数据
    init() {
      // console.log(this.$store.state.processNew)
      // ---------提交人部门选择列表--------------------
      this.urgentcolumns = []
      let deps = JSON.parse(sessionStorage.getItem("userInfo")).dept;
      deps.forEach((item) => {
        var obj = {};
        obj["id"] = item.id;
        obj["text"] = item.dep_name;
        this.urgentcolumns.push(obj);
      });
      this.deptid = this.deptid ? this.deptid : this.urgentcolumns[0].id;
      this.depsName = this.depsName ? this.depsName : this.urgentcolumns[0].text;
      // --------------------------------
      this.status = this.$route.query.status;
      if (this.status == 8) {
        //草稿
        this.commomType = 10;
      }
      window.onpopstate = () => {
        this.$toast.clear();
      };
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      this.auth = JSON.parse(sessionStorage.getItem("button"));
      let _set_auth = JSON.parse(sessionStorage.getItem("SET_AUTH"));
      if (_set_auth && _set_auth[1]) {
        _set_auth[1].forEach((item, index) => {
          if (item == "post_presented") {
            this.setPresented = true;
          }
        });
      }
      if (sessionStorage.getItem("currentDoc") != null) {
        this.currentDoc = JSON.parse(sessionStorage.getItem("currentDoc"));
      }
      this.type = this.$route.query.type;
      this.$set(this.process, "type", this.$route.query.type);
      this.templete_id = this.$route.query.tid;
      this.fid = this.$route.query.fid;
      // console.log("this.$store.status", this.$store.state);
    },
    initCaoGao() {
      //草稿初始化
      if (this.caogao_process && this.caogao_process.process.id){//指定流程
        this.getdocumentNext()
      } else if (!this.caogao_process.process.id && this.$route.query.type == 0 && this.caogao_process.process.info && this.caogao_process.process.info.length > 0){//指定下一节点
        let _copy = []
        this.process.processType = 2
        let _results = []
        if (this.caogao_process.process.info){
          let _approver_type = '2'
          this.caogao_process.process.info.forEach((item, index) =>{
            _approver_type = typeof item.approver_type == 'number' ? item.approver_type.toString() : item.approver_type
            item.cc_info.forEach((items, num) =>{
              let _params = {}
              this.$set(_params, 'id', items.userid)
              this.$set(_params, 'type', 2)
              this.$set(_params, 'img', items.avatar ? items.avatar : _this.headImg)
              this.$set(_params, 'title', items.name)
              this.$set(_params, 'w_id', 'ren' + items.userid)
              _results.push(_params)
            })
          })
          if (this.caogao_process.process.info && this.caogao_process.process.info[0].cc_list){
            this.caogao_process.process.info[0].cc_list.forEach((item, index) =>{
              let _item = {}
              this.$set(_item, 'id', item.userid)
              this.$set(_params, 'type', 2)
              this.$set(_item, 'img', item.avatar ? item.avatar : _this.headImg)
              this.$set(_item, 'title', item.title)
              this.$set(_item, 'w_id', 'ren' + item.userid)
              _copy.push(_item)
            })
          }
          this.process.processNUm.results = _results
          this.process.processNUm.approver_type = _approver_type
          this.process.checkedCopy = _copy
        }
      } else {
        this.process.processType = 1
      }
    }
  },

  computed: {
    content() {
      // console.log("state", this.$store.state);
      return this.$store.state.edittext.content;
    },
    enclosure_file() {
      return this.$store.state.edittext.enclosure_file;
    },
    document_arr() {
      return this.$store.state.edittext.document_arr;
    },
    red_templete_id() {
      return this.$store.state.edittext.red.value && this.$store.state.edittext.red.value.length > 0 ?this.$store.state.edittext.red.value[0].id : '';
    },
    signature_ele() {
      return this.$store.state.edittext.eles;
    },
    word_no() {
      return this.$store.state.edittext.iss.value && this.$store.state.edittext.iss.value.length > 0 ? this.$store.state.edittext.iss.value[0] : "";
    },
    caogao_process() {
      return sessionStorage.getItem("caogao_process")
        ? JSON.parse(sessionStorage.getItem("caogao_process"))
        : "";
    },
    process: {
      get() {
        return this.$store.state.processNew &&
        this.$store.state.processNew.process
                ? this.$store.state.processNew.process
                : {};
      },
      set(value) {
        this.$store.state.processNew.process = value;
      },
    },
    handles() {
      // console.log('handles', this.$store.state.processNew.handles)
      return this.$store.state.processNew.handles
    },
    deptid: {
      get() {
        return this.$store.state.processNew.deptid
      },
      set(value) {
       this.$store.state.processNew.deptid = value;
      },
    },
    depsName: {
      get() {
        return this.$store.state.processNew.depsName
      },
      set(value) {
        this.$store.state.processNew.depsName = value;
      },
    },
    dTime: {
      get() {
        return this.$store.state.processNew.dTime
      },
      set(value) {
        this.$store.state.processNew.dTime = value;
      },
    },
    tTime: {
      get() {
        return this.$store.state.processNew.tTime
      },
      set(value) {
        this.$store.state.processNew.tTime = value;
      },
    },
    sTime: {
      get() {
        return this.$store.state.processNew.sTime
      },
      set(value) {
        this.$store.state.processNew.sTime = value;
      },
    },
    way: {
      get() {
        return this.$store.state.processNew.way
      },
      set(value) {
        this.$store.state.processNew.way = value;
      },
    },
      process_updata:{
          get() {
              return this.$store.state.processNew.process_updata
          },
          set(value) {
              this.$store.state.processNew.process_updata = value;
          },
      },
    flagApp:{
      get() {
        return this.$store.state.processNew.flagApp
      },
      set(value) {
        this.$store.state.processNew.flagApp = value;
      },
    }
  },
  watch: {
    showSetProcess: {
      handler: function (val) {
        if (val) {
          document.title = "设置流程";
        } else {
          document.title = this.title;
        }
      },
    },
    caogao_process: {
      deep: true,
      immediate: true,
      handler: function (val) {
        if (val && this.$route.query.status && this.$route.query.status == 8) {
          (this.handles.opinion = val.opinion ? val.opinion : ""),
            (this.handles.process_urgent_level = val.process_urgent_level
              ? val.process_urgent_level
              : ""),
            (this.handles.files = val.approval_file ? val.approval_file : []);
          if (val.process) {
            if (val.process.id) {//草稿箱指定流程
              this.process.processType = 3;
              this.process.checked.id = val.process.id;
              this.process.checked.name = val.process.name;
            } else if (!val.process.id && val.process.info && val.process.info.length > 0) {//指定下一节点

            }
          } else {
          }
        }
      },
    },
    $route(to, from) {
      // console.log("processNew.process", this.$store.state.processNew.process);
      if (from.name == "setProcess") {
        if (this.$store.state.processNew.process.processType){
          this.process = this.$store.state.processNew.process;
        }else if (from.name == "viewDocument" && from.query.htype == "cs"){
          if (this.$store.state.processNew.submitType) {
            this.submitQuick()
          }
        }
      }
    },
  },
  activated() {
    this.templete_id = this.$route.query.tid ? this.$route.query.tid : ''
    if (this.flagApp){
      this.init()
      if (this.$route.query.status == 8){//草稿初始化
        this.initCaoGao();
      } else if (this.$route.query.lid){
        this.getdocumentNext();
      }
      this.flagApp = 0
    }
  },
  created() {
    this.init()
    if (this.$route.query.status == 8){//草稿初始化
      this.initCaoGao();
    } else if (this.$route.query.lid){
      this.getdocumentNext();
    }
  },
  beforeMount() {
    this.title = document.title;
  },
  beforeRouteEnter(to,from, next){
    if (from.name == 'draft' || from.name == 'quick'){
      bus.$emit("show", 0);
    }
    next();
  }
};
</script>
<style lang="scss" scoped>
/*.van-cell {*/
/*    padding: 16px 20px 5px;*/
/*}*/

.box {
  background-color: #f7f8fa;
  min-height: 100vh;
  font-size: 14px;
  padding-bottom: 50px;
  margin-bottom: 10px;
}

.enclosure {
  width: 100%;
  height: auto;

  .enclosureList {
    box-sizing: border-box;
    padding: 10px 15px 15px;

    .van-uploader {
      width: 100%;
    }

    /deep/ .van-uploader__input-wrapper {
      width: 100%;
    }
  }
}

/deep/ .opinion .inputValue[data-v-17ed2f27] .van-field__value {
  position: relative;
  width: 379px;
  height: 120px;
  border-radius: 4px;
  padding: 10px;
}

/deep/ .van-field__word-limit {
  position: absolute;
  bottom: 0;
  right: 10px;
  color: #c0c4cc;
}

.opinion {
  width: 100%;
  height: 200px !important;
  box-sizing: border-box;

  .radios {
    display: flex;
    justify-content: flex-start;
    padding: 21px 15px 15px;

    .van-radio {
      margin-right: 40px;
    }
  }

  .inputValue {
    box-sizing: border-box;

    /deep/ .van-field__value {
      overflow: hidden;
    }

    .van-cell {
      height: 200px;
    }
  }
}

.degree {
  width: 100%;
  height: auto !important;
  background-color: #fff;
  margin-bottom: 10px;
  .notice {
    padding: 17px 10px 0;
    .title {
      font-size: 16px;
      padding: 5px 15px;
      background: #ffffff;
      color: #303133;
    }
  }

  .chiose {
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 7px 0 10px 15px;
    border: 1px solid #f5f6f7;

    .title {
      margin-left: 10px;
      color: #909399;
    }
  }

  .contentbox {
    background: #ffffff;
    padding: 0px 20px;
    height: 60px;
    line-height: 60px;
    .radios-box {
      line-height: 60px;
      vertical-align: middle;
      .radios-box-cl {
        margin-right: 50px;
        .radios-cell {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid;
          border-color: #d8dfe6;
          line-height: 8px;
          vertical-align: middle;
          .radios-cell-nei {
            width: 8px;
            height: 8px;
            background-color: #f5ac40;
            border-radius: 50%;
          }
        }
        .radios-box-cl-font {
          height: 60px;
          font-size: 16px;
          padding-left: 8px;
          line-height: 1rem;
        }
      }
    }
    .radios {
      height: 60px;
      display: flex;
      align-items: center;
    }

    .contentItem {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .typeIcon {
        display: inline-block;
        text-align: center;
        width: 38px;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        color: #0082ef;
        border: 1px solid #0082ef;
      }
    }

    .userName {
      display: inline-block;
      max-width: 20%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .userDept {
      display: inline-block;
      color: #adafb3;
      max-width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .nextBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    .nextItem {
      display: flex;
    }
    .nextName {
      max-width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  /*.nextItem {*/
  /*    height: 88px;*/
  /*    max-width: 60px;*/
  /*    display: flex;*/
  /*    justify-content: center;*/
  /*    align-items: center;*/
  /*    margin-right: 20px*/
  /*}*/

  .btn {
    width: 112px;
    height: 48px;
    background: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #606266;
  }

  .opinionSpan {
    color: #d5d5d5;
  }

  .opinionSpan_1 {
    color: #41aaff;
  }

  .opinionSpan_2 {
    color: #f56c6c;
  }

  .opinionSpan_3 {
    color: #41aaff;
  }
}

.start {
  padding: 17px 30px 0;
  background-color: #ffffff;
  color: #303133;
  border: 1px solid #f9f9f9;

  .van-checkbox {
    padding-top: 20px;
    font-size: 14px;
  }

  div:nth-child(2) {
    margin-top: 8px;
    height: 32px;
    line-height: 32px;

    span {
      display: inline-block;
      width: 48px;
      height: 32px;
      background: #f2f3f5;
      color: #000;
      font-size: 16px;
      font-weight: 500;
      margin: 0 auto;
      text-align: center;
    }
  }
}

.choisNotice {
  color: #ffffff !important;
  background: rgba(255, 202, 58, 1) !important;
}

.choisEmail {
  color: #ffffff !important;
  background: #386bfc !important;
}

.choisInfoo {
  color: #ffffff !important;
  background: #7cdb00 !important;
}

/*上下处理节点*/
.upnode {
  margin-top: 5px;
  padding: 20px 15px;
  border-radius: 4px;
  border-right: 5px solid #0082ef;
}

/*    最后取消/提交按钮*/
.buttonbox {
  width: 100%;
  background-color: #ffffff;
  height: 57px;
  line-height: 57px;
  color: #303133;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #e6e6e6;

  .cancel {
    width: 187px;
    height: 44px;
    margin-right: 10px;
  }

  .ensure {
    width: 187px;
    height: 44px;
    color: #303133;
  }
}

.upbtn {
  height: 40px;
  width: 40px;
  margin-bottom: 10px;
  background: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.showmore {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  margin: 5px 0 10px;
  background-color: #ffffff;
  text-align: center;
}

.timeNum {
  background-color: #f2f3f5;
  width: 48px;
  height: 32px;
  line-height: 32px;
  border: none;
  text-align: center;
  margin-right: 5px;
}

.van-checkbox-group--horizontal {
  justify-content: space-between;
}

.quick {
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-top: 1px solid #f5f6f7;

  .quickbox {
    color: #41aaff;
    display: flex;
    align-items: center;
    padding-left: 25px;
  }
}

.process {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.usercheck {
  display: flex;
  font-size: 15px;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 20px;
  .van-cell {
    padding: 0;
  }
}
.mr-20 {
  margin-right: 40px;
}
.orange {
  color: #f5ac40;
}
.red {
  color: #f56c6c;
}
.blue {
  color: #1989fa;
}
</style>


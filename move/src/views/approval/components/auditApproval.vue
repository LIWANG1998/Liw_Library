<template>
  <div class="box">
    <div class="contentBox box_content">
      <!-- 紧急程度 -->
      <div class="degree">
        <div class="chiose">
          <img style="width: 11px;height: 14px" src="@/assets/img/newImg/fire.png" alt/>
          <div class="title">紧急程度</div>
        </div>
        <div class="contentbox">
          <div class="radios-box flex-ac">
            <template v-for="(item,index) in radioslist">
              <div
                  class="radios-box-cl flex-ac"
                  v-if="current.process_urgent_level == item.name"
                  :key="index"
              >
                <div
                    class="radios-cell flex-ac-jc"
                    :style="current.process_urgent_level == item.name?{borderColor:item.color}:''"
                >
                  <template v-if="current.process_urgent_level == item.name">
                    <div
                        class="radios-cell-nei"
                        :style="current.process_urgent_level == item.name?{backgroundColor:item.color}:''"
                    ></div>
                  </template>
                </div>
                <div
                    class="radios-box-cl-font flex-ac-jc"
                    :style="current.process_urgent_level == item.name?{color:item.color}:''"
                >{{ item.text }}
                </div>
              </div>
            </template>
          </div>
          <!--                    <div class="radios">-->
          <!--                        <van-radio-group v-model="process_urgent_level" direction="horizontal">-->
          <!--                            <van-radio v-if="process_urgent_level == 1" name="1">普通</van-radio>-->
          <!--                            <van-radio v-if="process_urgent_level == 2" name="2" checked-color="#F5AC40">紧急</van-radio>-->
          <!--                            <van-radio v-if="process_urgent_level == 3" name="3" checked-color="#F56C6C">加急</van-radio>-->
          <!--                        </van-radio-group>-->
          <!--                    </div>-->
        </div>
      </div>
      <!-- 处理意见 -->
      <div class="degree opinion">
        <div class="chiose">
          <van-icon color="#C8D8E5" name="edit"/>
          <div class="title">处理意见</div>
        </div>
        <div class="contentbox">
          <div class="opinionBox">
            <div class="btn" @click="changeOpinon(3)">
              <van-icon size="16" :color="status == 3 ? '#41AAFF' : '#909090'" name="checked"/>
              <span class="Ospan" :class="status == 3 ? 'opinionSpan_1' : 'opinionSpan'">同意</span>
            </div>
            <div class="btn" @click="changeOpinon(4)">
              <van-icon size="16" :color="status == 4 ? '#F56C6C' : '#909090'" name="clear"/>
              <span class="Ospan" :class="status == 4 ? 'opinionSpan_2' : 'opinionSpan'">驳回</span>
            </div>
            <div class="btn" @click="changeOpinon(6)">
              <van-icon size="16" :color="status == 6 ? '#41AAFF' : '#909090'" name="clock"/>
              <span class="Ospan" :class="status == 6 ? 'opinionSpan_3' : 'opinionSpan'">暂放</span>
            </div>
            <div class="btn" @click="changeOpinon(100)">
              <van-icon style="transform: rotateX(180deg)" size="16" :color="isTurn ? '#41AAFF' : '#909090'"
                        name="share"/>
              <!--                            <van-icon size="16" :color="status == 6 ? '#41AAFF' : '#D5D5D5'" name="clock"/>-->
              <!--              <img style="width: 16px;height: 12px" :src="isTurn ? isTurnUrl : noTurnUrl" alt/>-->
              <span class="Ospan" :class="isTurn ? 'opinionSpan_3' : 'opinionSpan'">转审</span>
            </div>
          </div>
        </div>
        <div class="inputValue">
          <van-field maxlength="400" show-word-limit v-model="message" rows="7" type="textarea"
                     placeholder="请输入处理意见"/>
          <div class="replybox">
            <div @click="showReplychange" class="showReply">
              <img style="width: 16px;height: 12px;margin-right: 5px"
                   src="@/assets/img/newImg/info.png" alt/>
              快捷回复
            </div>
            <!--                        <span style="color: #E6E6E6">|</span>-->
            <!--        转审-->
            <!--                        <div @click="showTurn = !showTurn" class="return">-->
            <!--                            <img src="@/assets/img/home/zhuanshen.png" alt/>-->
            <!--                            转审-->
            <!--                        </div>-->
          </div>
          <!--                   转审人-->
          <div v-if="turnUser && turnUser.length > 0" class="returnPeo">
            <div>
              <img :src="turnUser[0].img" alt/>
              <p style="color: #303133">{{ turnUser[0].title }}</p>
            </div>
            <div class="btn">
              <span @click="updataTurUser('updata')">修改</span>
              <span @click="updataTurUser('cancal')" class="cancle">取消</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 附件 -->
      <div class="degree enclosure">
        <div class="chiose">
          <img style="width: 15px;height: 15px" src="@/assets/img/newImg/file.png" alt/>
          <div class="title">附件（非正文附件）</div>
        </div>
        <div class="enclosureList">
          <!-- 上传附件 -->
          <van-uploader :after-read="afterRead">
            <div class="upbtn">
              <img src="@/assets/img/newImg/wenjianjia.png" alt/>
            </div>
          </van-uploader>
          <div v-for="(item,index) in approval_file" :key="index">
            <load-file :file="item" @delFile="delFile"></load-file>
          </div>
        </div>
      </div>
      <!-- 提交人 -->
      <div class="degree">
        <div class="chiose">
          <img style="width: 13px;height: 13px" src="@/assets/img/newImg/subUser.png" alt/>
          <div class="title">提交人</div>
        </div>
        <div class="contentbox">
          <div style="display: flex;align-items: center">
            <img class="subUserImg" :src="current.applicant.avatar" alt/>
            <span class="subName" style="">{{ current.applicant.name }}</span>
            <div class="subDept">
              <span>（{{ current.applicant.dname.join('/') }}</span>
              <span v-if="current.applicant.position">-{{ current.applicant.position }}</span>）
            </div>
          </div>
        </div>
      </div>
      <!--        显示更多-->
      <div @click="show = !show" class="showmore">
        <div>更多信息</div>
        <div style="color: #909399">
          <div v-if="show">
            <span class="toatst">收起</span>
            <van-icon name="arrow-up"/>
          </div>
          <div v-if="!show">
            <span class="toatst">展开</span>
            <van-icon name="arrow-down"/>
          </div>
        </div>
      </div>
      <div v-if="show">
        <!-- 通知选项 -->
        <div class="degree">
          <div class="chiose">
            <img style="width: 15px;height: 15px" src="@/assets/img/newImg/message.png" alt/>
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
            <van-checkbox style="padding-bottom: 15px" v-model="checked" shape="square" @change="goWay()">
              流程结束后通知我
            </van-checkbox>
          </div>
          <!-- 流程通知 -->
          <div v-if="checked" class="notice">
            <div class="title">通知方式</div>
            <div style="padding:5px 15px">
              <van-checkbox-group v-model="way" direction="horizontal">
                <van-checkbox name="1">待办</van-checkbox>
                <van-checkbox name="4" disabled>企业微信</van-checkbox>
                <van-checkbox :disabled="button.youxiang == 0" name="2">邮箱</van-checkbox>
                <van-checkbox :disabled="button.duanxin == 0" name="3">短消息</van-checkbox>
              </van-checkbox-group>
            </div>
          </div>
        </div>
        <!--    上下处理节点-->
        <div class="degree">
          <div class="chiose">
            <img style="width: 16px;height: 7px" src="@/assets/img/newImg/node.png" alt/>
            <div class="title">上下处理节点</div>
          </div>
          <div class="contentbox">
            <div>
              <div class="upnode">
                <div class="title">上一节点:</div>
                <span v-if="prv.name" class="nodeAuditorType" style="">{{ prv.name }}</span>
                <span v-if="prv.flag == 1 || prv.flag == 2 || prv.flag == 3 || prv.flag == 4"
                      class="flag">{{ prv.approver_type == 1 ? '会签' : '或签' }}</span>
              </div>
              <div style="display: flex;flex-wrap: wrap" v-if="prv.username && prv.username.length > 0">
                <div style="width: 60px;padding-bottom: 30px" v-for="(item, index) in prv.username" :key="index">
                  <div class="nodeItem">
                    <img :src="item.avatar" alt/>
                  </div>
                  <div class="TitName">{{ item.name }}</div>
                </div>
              </div>
              <div style="display: flex;flex-wrap: wrap" v-else>
                <div style="width: 60px;padding-bottom: 30px" v-for="(item, index) in prv" :key="index">
                  <div class="nodeItem">
                    <img :src="item.username.avatar" alt/>
                  </div>
                  <div class="TitName">{{ item.username.name }}</div>
                </div>
              </div>

            </div>
            <div v-if="!(next instanceof Array)">
              <div class="upnode">
                <div class="title">即将流向:</div>
                <span v-if="next.name" class="nodeAuditorType" style="">{{ next.name }}</span>
                <span v-if="next.flag == 1 || next.flag == 2 || next.flag == 3 || next.flag == 4"
                      class="flag">{{ next.approver_type == 1 ? '会签' : '或签' }}</span>
              </div>
              <div style="display: flex;flex-wrap: wrap">
                <div style="width: 60px;" v-for="(item, index) in next.username" :key="index + 1 ">
                  <div class="nodeItem">
                    <img :src="item.avatar" alt/>
                  </div>
                  <div class="TitName">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--        取消/确定按钮-->
    <div class="buttonbox">
      <van-button type="default" class="cancel" @click="goFilePage()">取消</van-button>
      <van-button color="#0082EF" class="ensure" @click="submitBtn()">提交</van-button>
    </div>
    <!--        快捷回复-->
    <van-popup
        v-model="showReply"
        position="bottom"
        :style="{ height: '60%' }"
    >
      <quick-reply @getmessage="getmessage($event)" :showReply="showReply"></quick-reply>
    </van-popup>
    <!--            转审-->
    <!--            <van-popup-->
    <!--                    v-model="showTurn"-->
    <!--                    position="right"-->
    <!--                    :style="{ height: '100%',width:'100%' }" >-->
    <!--                <turn-audit :files="approval_file" :turnUser="turnUser"  @changTurnUser="changTurnUser($event)"></turn-audit>-->
    <!--            </van-popup>-->
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
import {documentAdd, documentNext} from "../../../api/home";
import {saveFile} from "../../../assets/js/public";
import loadFile from "../../../components/common/loadFile";
import quickReply from "../../../components/common/quickReply";
import updataReply from "../../../components/common/updataReply";
import replyBus from "@/assets/js/replyBus";
import turnAudit from "../../../components/common/turnAudit";
import {approval_my_shift} from "@/api/audit"

export default {
  name: "approval",
  components: {
    loadFile,
    quickReply,
    updataReply,
    turnAudit
  },
  data() {
    return {
      radioslist,
      dTime: "", //天
      tTime: "", //时
      sTime: "", //分
      content: "", //正文内容
      enclosure_file: [], //正文附件
      // approval_file: [], //审核的附件
      document_arr: {},
      process_urgent_level: "1", //紧急程度1普通2紧急3加急 ,
      msg_time: 0, //通知时间
      way: ['1', '4'], // 1待办 2邮箱 3短消息
      radio: "",
      message: "", //留言的信息
      checked: false, //复选框状态
      type: "", //页面类型----发文：dispatch,收文：receive,签发：sign
      tongyi: "", //1为确定提交
      chioseNotification: '1', //选择按钮
      show: false, //是否显示更多
      docId: '',//公文id
      where_id: '',//流程id
      nextTo: {}, //下一节点
      current: {applicant: {dname: []}},//当前审核节点
      prv: [],//上一节点
      next: [],//下一节点
      chioseBtnStatus: undefined, //紧急程度按钮
      notice: 1,
      audit_file: [],
      oneFun: false,
      twofun: false,
      threefun: false,
      showReply: false,//显示快速回复
      showUpdataReply: false,//显示编辑快捷回复,
      status: 3,    //审批意见选项
      turnUser: [],//转审人
      userInfo: {},
      deptid: "", //提交人的部门id
      depList: [], //提交人所属的部门
      depsName: "", // 显示提交人部门
      urgentPicker: false,
      urgentcolumns: [], //提交人数组
      showTurn: false,//显示转审编辑页
      currentDoc: {},//当前公文信息
      button: {},//按钮权限
      noTurnUrl: require('@/assets/img/newImg/zhuanshen.png'),//未选中转审时
      isTurnUrl: require('@/assets/img/home/zhuanshen.png'),//选中转审时
      isTurn: false,//是否转审
    };
  },
  props: {
    role: {
      type: String,
      default: "self"
    },
    approvalInfo: {
      type: Object,
      default: () => {
      }
    },
    isShowPage: {
      type: [String, Number],
      default: ''
    },
    active: {//collect审批组件内选中tab状态1.当前审批2.意见汇总，3.附件列表
      type: [String, Number],
      default: ''
    }
  },
  watch: {
    approvalInfo: {
      immediate: true,
      handler: function (val) {
        if (val && val.data) {
          // console.log(123,val)
          this.current = val.data.current
          this.prv = val.data.prv
          this.next = val.data.next
          this.process_urgent_level = this.current.process_urgent_level ? this.current.process_urgent_level.toString() : ''
        }
      }
    },
    isShowPage: {//显示时获取公文修改信息
      handler: function (val) {
        if (val && val == 2) {
          this.content = this.$store.state.edittext.content
          this.document_arr = this.$store.state.edittext.document_arr;
          this.enclosure_file = this.$store.state.edittext.enclosure_file;
          this.audit_file = sessionStorage.getItem("audit_file");
        }
      }
    },
    active: {//collect审批组件内选中tab状态1.当前审批2.意见汇总，3.附件列表
      immediate: true,
      handler: function (val) {
        if (val == 1) {
          this.audit_file = sessionStorage.getItem("audit_file");
        }
      }
    },
    $route(to, from) {
      if (from.name == 'turnAudit') {
        // console.log('quick', this.$store.state.processNew.turnUser)
        let _turn = this.$store.state.processNew.turnUser
        if (_turn.files) {
          this.approval_file = _turn.files
          this.$set(this, 'approval_file', this.approval_file)
        }

        this.$set(this, 'turnUser', _turn.results)
        // console.log('quick111',this.approval_file)
      } else if (from.name == 'nextAuditor') {
        this.nextPeo = this.processNew.nextPeo
      }
    }
  },
  methods: {
    //审核意见
    changeOpinon(val) {
      if (val !== 100) {
        this.status = val
        this.isTurn = false
        this.turnUser = []
      } else if (val == 100) {
        this.status = ''
        this.isTurn = true
        // this.showTurn = !this.showTurn
        this.$router.push('/turnAudit')
      }
    },
    showReplychange() {
      this.showReply = true
      // console.log(this.showReply)
    },
    //获取快捷回复message
    getmessage(val) {
      this.showReply = false
      if (val.type == 'sure') {
        this.message = this.message + '\n' + val.message
      }
    },
    //流程启动时间
    //天
    changDime(d, t, s) {
      let timeD = 86400 * Number(d);
      let timeT = 3600 * Number(t);
      let timeS = 60 * Number(s);
      this.msg_time = timeD + timeT + timeS
    },

    //获取当前时间的时间戳
    timest() {
      var tmp = Date.parse(new Date()).toString();
      tmp = tmp.substr(0, 10);
      return tmp;
    },
    // 下一节点的流向
    getdocumentNext() {
      let data = new URLSearchParams();
      documentNext(data).then(res => {
        if (res.code == 1) {
          this.nextTo = res.data;

        }
      });
    },
    //删除文件
    delFile(info) {
      this.approval_file.forEach((item, index) => {
        if (info.oldname == item.oldname && info.path == item.path) {
          this.approval_file.splice(index, 1);
        }
      });
    },
    // 上传附件
    afterRead(files) {
      saveFile(files, this.callFile)
    },
    //七牛云上传返回来的文件数据
    callFile(val) {
      this.approval_file.push(val);
    },
    // 提交按钮
    submitBtn() {
      if (this.isTurn) {//提交转审
        if (this.turnUser.length > 0) {
          if (this.required()) {
            this.subTurnApproval()
          }
        } else {
          this.$toast('请选择转审人')
        }
      } else {//提交审核
        if (this.required()) {
          this.submitApproval()
        }
      }
    },
    //提交审核
    submitApproval() {
      let time = undefined
      if (this.msg_time) {
        time = this.msg_time + Number(this.timest())
      } else {
        time = ''
      }
      this.approval_file = this.approval_file.length > 0 ? this.approval_file : ''
      this.approval_file = sessionStorage.getItem("audit_file") ? this.approval_file.concat(JSON.parse(sessionStorage.getItem("audit_file"))) : this.approval_file
      let approval_data = {
        where_id: this.where_id,
        explain: this.message,
        status: this.status,
        files: this.approval_file && this.approval_file.length > 0 ? this.approval_file : [],
        way: this.way ? this.way.join(',') : '',
        time: time,
        notice: this.checked ? 2 : 1,
        process_urgent_level: this.process_urgent_level

      }
      let Loading = this.$toast.loading({
        forbidClick: true,
        message: '提交中'
      })
      let data = {
        id: this.docId,
        templete_id: this.templete_id,
        type: parseInt(this.type),
        content: this.content,
        enclosure_file: this.enclosure_file,
        document_arr: this.document_arr,
        approval_data: approval_data,
        msg_time: this.time,
        process_urgent_level: this.process_urgent_level,
        way: this.way ? this.way.join(',') : '',
        signature_arr: this.signature_ele,
      }
      // console.log('state', this.$store.state)
      documentAdd(data).then(res => {
        if (res) {
          Loading.clear()
          if (res.code == 1) {
            // this.$toast(res.msg)
            this.$router.push(`/success?id=${this.docId}&type=${this.type}&status=2&text=提交`);
            let data_id = res.data_id;
            sessionStorage.removeItem("content");
            sessionStorage.removeItem("document_arr");
            sessionStorage.removeItem("enclosure_file");
            sessionStorage.removeItem("approval_file");
            sessionStorage.removeItem("audit_file");
            sessionStorage.removeItem("currentDoc");
          } else {
            this.$toast(res.msg)
          }
        }
      });
    },
    //转审
    subTurnApproval() {
      let time = undefined
      if (this.msg_time) {
        time = this.msg_time
      } else {
        time = ''
      }
      // console.log(this.turnUser)
      // console.log(this.document_arrs)
      let arr = this.document_arrs
      let document = {
        dept_id: this.currentDoc.deptid,
        secret: arr.secret_level.value,
        title: arr.title.value,
        urgent: arr.urgent_level.value,
        word_no: this.isss.word_no
      }
      let handle = {
        explain: this.message,
        files: this.approval_file && this.approval_file.length > 0 ? this.approval_file : [],
        notice: this.checked ? 2 : 1,
        process_urgent_level: this.process_urgent_level,
        time: time,
        way: this.way ? this.way.join(',') : '',
      }
      let user = {
        avatar: this.turnUser[0].img,
        userid: this.turnUser[0].id,
        username: this.turnUser[0].title
      }
      // console.log('user', user)
      // console.log('handle', handle)
      // console.log('document', document)
      approval_my_shift({
        document: document,
        handle: handle,
        user: user,
        where_id: this.where_id
      }).then(res => {
        if (res) {
          if (res.code == 1) {
            this.$store.commit("edittextinit");
            // this.$toast.success('转审成功')
            // this.$router.go(0)
            this.$router.push(`/success?id=${this.docId}&type=${this.type}&status=2&text=提交`);
          } else {
            this.$toast.fail(res.msg)
          }
        }
        // console.log('转审', res)
      })
    },
    //通知方式按钮
    choiseInfo(id) {
      if (id == 1) {
        this.oneFun = !this.oneFun;
      }
      if (id == 2) {
        this.twofun = !this.twofun;
      }
      if (id == 3) {
        this.threefun = !this.threefun;
      }
      if (this.way.indexOf(id) == -1) {
        this.way.push(id);
      } else {
        if (this.way !== "") {
          for (let i = 0; i < this.way.length; i++) {
            if (this.way[i] == id) {
              this.way.splice(i, 1);
            }
          }
        }
      }
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
    //取消
    goFilePage() {
      // this.$router.push({
      //     path: '/sendingDetails',
      //     query: {
      //         fid: this.docId,
      //         type: this.type
      //     }
      // })
      this.$router.go(-1)
    },
    //选择提交人部门
    onConfirmDegree(value, index) {
      this.deptid = value.id
      this.depsName = value.text
      this.urgentPicker = false;
    },
    //转审
    changTurnUser(val) {
      this.showTurn = false
      if (val && val.type == 'submit') {
        this.approval_file.concat(val.files)
        this.$set(this, 'turnUser', val.results)
        this.$set(this, 'approval_file', this.approval_file)
      }
    },
    //修改
    updataTurUser(type) {
      // console.log(this.approval_file, this.turnUser)
      if (type == 'updata') {
        // this.showTurn = true
        this.$router.push({
          path: '/turnAudit',
        })
      } else {
        this.turnUser = []
        this.$store.commit('setTurnUser', {})
      }
    },
    required() {
      let is_pass = true;
      let document_arrs = this.$store.state.edittext.document_arrs;
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

  },
  computed: {
    signature_ele() {
      return this.$store.state.edittext.eles
    },
    document_arrs() {
      return this.$store.state.edittext.document_arrs
    },
    // 字号
    isss() {
      return this.$store.state.edittext.isss
    },
    approval_file: {//审核附件
      get() {
        return this.$store.state.processNew.app_files;
      },
      set(value) {
        this.$store.state.processNew.app_files = value;
      },
    },
    // button() {
    //         return JSON.parse(sessionStorage.getItem("button"));
    // }
  },
  created() {
    this.currentDoc = JSON.parse(sessionStorage.getItem("currentDoc"));
    this.type = this.currentDoc.type;
    this.templete_id = this.currentDoc.temId;
    this.docId = this.currentDoc.docId;
    this.where_id = this.currentDoc.where_id;
    this.content = this.$store.state.edittext.content;
    this.document_arr = this.$store.state.edittext.document_arr;
    this.enclosure_file = this.$store.state.edittext.enclosure_file;
    this.audit_file = sessionStorage.getItem("audit_file");
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.button = JSON.parse(sessionStorage.getItem("button"));
    // replyBus.$on("handleChangePage", (show, type, content) => {
    //     this.showReply = true
    // });
    //提交人部门列表
    let deps = JSON.parse(sessionStorage.getItem("userInfo")).dept;
    deps.forEach((item) => {
      var obj = {};
      obj["id"] = item.id;
      obj["text"] = item.dep_name;
      this.urgentcolumns.push(obj);
    });
  }
};
</script>

<style lang="scss" scoped>
.box {
  background-color: #F7F8FA;
  height: 100%;
  font-size: 14px;
}

/*.box_content {*/
/*    height: calc(100% - 60px);*/
/*    overflow-y: auto;*/
/*}*/
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
  height: 170px;
  border-radius: 4px;
  padding: 10px;
}

/deep/ .van-field__word-limit {
  position: absolute;
  bottom: 0;
  right: 10px;
  color: #C0C4CC;
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
    padding: 0 15px 10px;

    /deep/ .van-field__value {
      overflow: hidden;
    }

    .replybox {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      border-top: 1px solid #E6E6E6;
      border-bottom: 1px solid #E6E6E6;

      .showReply {
        width: 50%;
        color: #41AAFF;
        display: flex;
        align-items: center;
        justify-content: center
      }

      .return {
        width: 50%;
        color: #41AAFF;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 16px;
          height: 12px;
          padding-left: 5px
        }
      }
    }
  }

  .returnPeo {
    padding: 0 5px;
    height: 88px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      height: 36px;
      width: 36px;
      border-radius: 18px;
    }

    .btn {
      background: #ffffff;
      display: flex;
      justify-content: space-between;

      .cancel {
        display: inline-block;
        margin-left: 20px;
        color: #909399
      }
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
      background: #FFFFFF;
      color: #303133;
    }
  }

  .chiose {
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 10px 0 10px 15px;
    border: 1px solid #F5F6F7;

    .title {
      margin-left: 10px;
      color: #909399;
      font-size: 13px;
    }
  }

  .contentbox {
    /*padding: 20px 10px;*/
    background: #FFFFFF;
    padding: 10px 20px;

    .radios-box {
      .radios-box-cl {
        margin-right: 50px;

        .radios-cell {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid;
          border-color: #d8dfe6;

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

    .opinionBox {
      display: flex;
      justify-content: space-between
    }

    .subUserImg {
      width: 32px;
      height: 32px;
      margin-right: 5px
    }

    .subName {
      display: inline-block;
      max-width: 20%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }

    .subDept {
      display: flex;
      align-items: center;
      display: inline-block;
      color: #ADAFB3;
      max-width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }

    .subDeptName {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 28px
    }

    .upnode {
      display: flex;
      margin-bottom: 10px;

      .title {
        color: #909399;
        margin-right: 10px;
        font-size: 13px;
      }
    }

    .nodeItem {
      display: flex;
      justify-content: center;
      margin-bottom: 5px;

      img {
        height: 36px;
        width: 36px;
        border-radius: 18px;
      }
    }

    .userBox {
      display: flex;
      align-items: center;

      img {
        width: 32px;
        height: 32px;
        margin-right: 5px
      }
    }
  }

  .btn {
    width: 22%;
    height: 48px;
    background: #F8F8F8;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #606266;

    .Ospan {
      display: inline-block;
      margin-left: 5px
    }
  }

  .opinionSpan {
    color: #909090;
  }

  .opinionSpan_1 {
    color: #41AAFF;
  }

  .opinionSpan_2 {
    color: #F56C6C;
  }

  .opinionSpan_3 {
    color: #41AAFF;
  }
}

.start {
  padding: 17px 30px 0;
  background-color: #ffffff;
  color: #303133;
  border: 1px solid #F9F9F9;

  .van-checkbox {
    padding-top: 20px;
    font-size: 14px;
  }

  div:nth-child(2) {
    margin-top: 8px;
    /*height: 32px;*/
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
  border-top: 1px solid #e6e6e6;

  .cancel {
    border: 1px solid #0082EF;
    color: #0082EF;
    width: 187px;
    height: 44px;
    margin-right: 10px;
  }

  .ensure {
    width: 187px;
    height: 44px;
    color: #303133;
  }

  img {
    height: 18px;
    line-height: 18px;
    width: 18px;
  }

  .van-radio-group--horizontal {
    width: 50%;
    margin: 0 auto;
    height: 48px;
  }
}

.upbtn {
  height: 40px;
  width: 40px;
  margin-bottom: 10px;
  background: #F6F6F6;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 18px;
    height: 18px;
  }
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

  .toatst {
    display: inline-block;
    margin-right: 5px;
    color: #909399

  }
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

.usercheck {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 20px;
}

.nodeAuditorType {
  display: inline-block;
  size: 15px;
  color: #303133;
  margin-left: 10px;
}

.TitName {
  text-align: center;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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


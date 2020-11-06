<template>
  <div class="info-box">
    <van-skeleton title :row="10" :loading="loading">
      <div class="box">
        <div class="level">
          <!-- <i :class="[`level-info${info.level}-icon`,'sprite-icon']"></i> -->
          <svg-icon icon-class="level" :class="`level${info.level}`" />
          {{ info.level==0?"普通":info.level==1?"紧急":"非常紧急" }}
        </div>
        <div class="title">{{ info.title }}</div>
        <div class="content" v-html="info.content"></div>
        <div v-if="(info.role==0||info.role==2)&&type!='drafts'" class="progress-box">
          <div>整体进度</div>
          <div :class="['progress',info.status==2?'finish':'']">
            <div class="line-box" :style="`width:calc(${info.completion}% - 2px)`">
              <div class="line" />
            </div>
          </div>
          <div :class="['rate',info.status==2?'finish':''] ">{{ info.completion }}%</div>
        </div>
      </div>
      <div class="box cell">
        <van-cell
          center
          title-class="start-color"
          value-class="value"
          title="发起人"
          is-link
          @click="openUser"
        >
          <template #icon>
            <i class="originator-icon sprite-icon"></i>
          </template>
          <template #default>{{ getName(info.username) }}</template>
        </van-cell>
        <van-cell
          center
          title-class="receive-color"
          value-class="value"
          :title="`接收人(${info.receive_username.length})`"
          is-link
          @click="isSelect=false;remindShow=true;remindType=1;"
        >
          <template #icon>
            <i class="reciver-icon sprite-icon"></i>
          </template>
          <template #default>{{ getName(info.receive_username) }}</template>
        </van-cell>
        <van-cell
          center
          title-class="cc-color"
          value-class="value"
          :title="`抄送人(${info.cc_username.length})`"
          is-link
          @click="isSelect=false;remindShow=true;remindType=2;"
        >
          <template #icon>
            <i class="ccer-icon sprite-icon"></i>
          </template>
          <template #default>{{ getName(info.cc_username) }}</template>
        </van-cell>
        <van-cell
          center
          title-class="lable"
          value-class="value"
          title="开始时间"
          :value="info.start_time"
        />
        <van-cell
          center
          title-class="lable"
          value-class="value"
          title="结束时间"
          :value="info.end_time"
        />
      </div>
      <div class="box">
        <van-cell
          v-for="(item,index) in info.file_url"
          :key="index"
          center
          title-class="lable"
          value-class="value"
          :title="`${index +1}.${item.name}`"
        >
          <template #default>
            <van-button
              v-if="info.role==0||info.role==1"
              class="btn-text"
              @click="handleDownload(item.name,item.save_path)"
            >下载</van-button>
            <van-button class="btn-text" @click="handlePreview(item.save_path,item.type)">预览</van-button>
          </template>
        </van-cell>
      </div>
      <div v-if="subList.length > 0 " class="box">
        <van-cell center title-class="sub-title" value-class="value" title="子任务" />
        <div class="sub-task_list">
          <van-row
            v-for="(item,index) in subList"
            :key="index"
            class="item"
            @click="handleSubInfo(item)"
          >
            <van-col span="24" class="pdl-10">
              <span class="sub-task_title">{{ item.title }}</span>
              <template v-if="info.role==1">
                <span v-if="item.completion==1" class="green">(已完成)</span>
                <span v-else class="blue">(未完成)</span>
              </template>
            </van-col>
            <van-col class="action" span="1">
              <van-icon name="arrow" />
            </van-col>
            <van-col :span="24" class="pdl-10">
              <span>
                <van-icon name="description" />
                {{ item.file_url.length }}
              </span>
            </van-col>
          </van-row>
        </div>
      </div>
      <div v-if="progressList.length > 0 " class="box">
        <van-cell
          center
          title-class="sub-title"
          :title="`进度(${progressList.length})`"
          is-link
          value="查看更多"
          @click="progressListShow = true"
        />
        <div class="progress-task_list">
          <van-row v-for="(item,index) in progressList" :key="index" class="item">
            <div v-if="item.username.length > 0 " class="user-info">
              <van-col span="3">
                <van-image round width="32px" height="32px" :src="item.username[0].avatar" />
              </van-col>
              <van-col span="21">
                {{ item.username[0].name }}
                <div
                  :class="['pdl-10 ft12 til',item.status==1?'success':'blue']"
                >{{ item.status==1?"完成":"未完成" }}-{{ item.pid==0?`主任务-${item.title}`:`子任务-${item.title}` }}</div>
              </van-col>
            </div>
            <div v-if="item.remarks" class="remarks">备注：{{ item.remarks }}</div>
            <div v-for="(fItem,fIndex) in item.file_url" :key="fIndex" class="file">
              <div class="info">
                <div>
                  <van-image width="32px" height="32px" :src="getIcon(fItem.type,fItem.save_path)" />
                </div>
                <div class="name van-ellipsis">{{ fItem.name }}</div>
                <van-button
                  v-if="info.role==0||info.role==1"
                  class="btn-text"
                  @click="handleDownload(fItem.name,fItem.save_path)"
                >下载</van-button>
                <van-button class="btn-text" @click="handlePreview(fItem.save_path,fItem.type)">预览</van-button>
              </div>
              <div class="status">
                {{ fItem.username }} 上传日期 {{ fItem.time }}
                <span class="success">完成</span>
              </div>
            </div>
          </van-row>
        </div>
      </div>
      <footer>
        <!-- 当前为发起任务 同时任务状态为待开始 -->
        <template v-if="(info.role==0&&info.status==0)||type=='drafts'">
          <van-button @click="handleStartTask">开始任务</van-button>
          <van-button @click="$router.push({path:'/edit',query:{id:id}})">修改</van-button>
          <van-button @click="handledDelTask">删除</van-button>
        </template>
        <!-- 当前为发起任务同时任务状态为执行中 -->
        <template v-if="info.role==0&&info.status==1&&type=='executing'">
          <van-button @click="$router.push({path:'/edit',query:{id:id}})">编辑</van-button>
          <van-button v-if="getIsStart" @click="endShow = true">结束</van-button>
          <van-button v-if="getIsStart" @click="handledRemindTask">催办</van-button>
          <van-button v-else @click="handledDelTask">删除</van-button>
        </template>
        <!-- 当前为接收任务 同时任务状态为执行中 -->
        <template v-if="info.role==1&&info.status==1&&type!=='taskUserList'">
          <van-button
            v-if="info.is_allow_transfer && getIsStart"
            :disabled="button.loading"
            :loading="button.loading"
            :loading-text="button.text"
            @click="handledTransferTask"
          >任务转办</van-button>
          <van-button v-if="getIsStart" @click="updateTaskShow = true">更新进度</van-button>
        </template>
      </footer>
      <!-- 子任务信息 -->
      <sub-task-info
        :id="id"
        :show.sync="subTaskInfoShow"
        :info-id="info.id"
        :role="info.role"
        :data="subTaskInfo"
        :is-start="getIsStart"
        :filter="filterUser"
        @showSonUser="showSonUser"
      />
      <!-- 更新子任务进度 -->
      <update-task
        v-if="info.role==1&&info.status==1&&type=='executing'"
        :id="id"
        :show.sync="updateTaskShow"
        :pid="0"
        :filter="filterUser"
        type="main"
        @load="getInfo"
      />
      <start-task
        v-if="type=='drafts'"
        :id="id"
        :show.sync="startTaskShow"
        :start-time="info.start_time"
        :end-time="info.end_time"
      />
      <!-- 一件催办 -->
      <remind :id="id" :show.sync="remindShow" :is-select="isSelect" :type="remindType" />
      <!-- 任务转办 -->
      <picker-user
        v-if="info.role==1&&info.status==1"
        :show.sync="pickerUserShow"
        :single="true"
        :obj="pickerUserObj"
        :filter-data="receive_userId"
        @confirm="pickerUserSubmit"
      />
      <!-- 结束任务 -->
      <progress-list :id="id" :show.sync="progressListShow" :role="info.role" />
      <van-dialog
        v-if="info.role==0&&info.status==1"
        v-model="endShow"
        title="结束任务"
        show-cancel-button
        class="end-way"
        :before-close="((action, done)=>{beforeClose(action, done,endWay==1?'end':'del')})"
      >
        <van-radio-group v-model="endWay" direction="horizontal">
          <van-radio :name="1">任务完成</van-radio>
          <van-radio :name="2">任务取消</van-radio>
        </van-radio-group>
      </van-dialog>
      <pdf :show.sync="pdfShow" :url="pdfUrl" />
    </van-skeleton>
  </div>
</template>
<script>
let moment = require("moment");
moment.locale("zh-cn"); //汉化

import { task, common } from "@/api";
import subTaskInfo from "./components/subTaskInfo";
import updateTask from "./components/updateTask";
import startTask from "./components/startTask";
import remind from "./components/remind";
import progressList from "./components/progressList";
import { pickerUser } from "@/components";
import { isImageUrl, previewImg } from "@/utils";
import { mapGetters } from "vuex";
import { Icon } from "vant";
import { pdf } from "@/components";
import { ImagePreview } from "vant";
import { now } from "moment";
export default {
  components: {
    subTaskInfo,
    updateTask,
    startTask,
    remind,
    pickerUser,
    progressList,
    pdf,
    ImagePreview,
  },
  data() {
    return {
      info: {
        title: "",
        content: "",
        level: 1,
        completion: "0",
        username: [],
        receive_username: [],
        cc_username: [],
        start_time: "2020-05-10 09:00",
        end_time: "2020-05-10 09:00",
        file_url: [],
        is_allow_transfer: 0,
        is_includ_cc: 0,
        is_pull_group: 0,
        remind_model_id: 0,
        type: 0,
        role: 0,
        status: 0,
        id: 0,
        userid: "",
      },
      receive_userId: [], //过滤转办人
      subList: [],
      progressList: [], //任务进度
      id: 0,
      look: 0,
      type: "", //任务是类型
      status: 0, //任务状态
      subTaskInfoShow: false, //展示子任务弹窗
      subTaskInfo: {}, //子任务信息
      updateTaskShow: false, //展示更新进度弹窗
      progressListShow: false, //展示更多进度弹窗
      loading: true,
      endShow: false, //结束任务弹窗,
      endWay: 1, //结束任务方式1:完成任务 2:取消任务,
      remindShow: false, //催办弹窗展示
      pickerUserShow: false, //转办弹窗展示
      isSelect: true, //选择提醒人弹窗是否可选择
      pickerUserObj: {
        user: [],
        dep: [],
      }, //选择人员对象
      filterUser: [],
      remindType: 1, //提醒弹窗类型 1：接收人2：抄送人,
      startTaskShow: false, //开始任务弹窗,
      pdfShow: false, //文件预览
      pdfUrl: "",
      button: {
        loading: false,
        text: "保存中...",
      },
    };
  },
  created() {
    const { id, pageType, status, look } = this.$route.query;
    this.id = id;
    this.type = pageType;
    this.status = status;
    this.look = look;
    this.getInfo();
    this.$bus.on("load", (data) => {
      this.getInfo();
    });
    this.$bus.on('showSonUser', (data) =>{
      this.remindShow = true;
      this.isSelect = false;
      this.remindType = 1;
      // console.log(222, data)
    })
  },
  computed: {
    ...mapGetters(["userInfo", "signature"]),
    getIsStart() {
      let start = moment(this.info.start_time);
      let now = moment(new Date());
      if (start.isBefore(now)) {
        return true;
      }
      return false;
    },
  },
  methods: {
    // 获取任务详情
    async getInfo() {
      try {
        const { code, data } = await task.getInfo({
          id: this.id,
          look: this.look,
        });
        if (!data.title) {
          this.$router.go(-1);
          if (window.history.length > 1) {
            this.$router.go(-1);
          } else {
            this.$router.push("/");
          }
          return this.$notify({ type: "danger", message: "当前任务不存在" });
        }
        const subList = await task.getSubList({ pid: this.id });
        const progressList = await task.getProgressList({ id: this.id });

        Object.keys(this.info).forEach((key) => {
          this.info[key] = data[key];
        });
        this.info.start_time = moment(this.info.start_time).format(
          "YYYY-MM-DD HH:mm"
        );
        this.info.end_time = moment(this.info.end_time).format(
          "YYYY-MM-DD HH:mm"
        );
        this.info.completion =
          this.info.completion > 100 ? 100 : this.info.completion;
        subList.data.forEach((item) => {
          item.file_url = Array.isArray(item.file_url)
            ? item.file_url
            : new Array();
        });
        progressList.data.data.forEach((item) => {
          item.file_url = Array.isArray(item.file_url)
            ? item.file_url
            : new Array();
        });
        this.subList = subList.data;
        let proList = [];
        progressList.data.data.forEach((item, index) => {
          if (
            !(
              item.status == 0 &&
              item.remarks == "" &&
              item.file_url.length == 0
            )
          ) {
            proList.push(item);
          }
        });
        this.progressList = proList;
        this.loading = false;
        this.filterUser.push(
          data.userid,
          ...data.receive_username.map((item) => item.userid)
        );
      } catch {
        this.$router.push("/");
      }
    },
    // 获取姓名
    getName(item) {
      let name = item.map((item) => item.name);
      if (name.length > 1) {
        return `${name.slice(0, 1).join("、")}...`;
      } else {
        return name.length > 0 ? `${name.join("、")}` : "无";
      }
    },
    getIcon(type, fileUrl) {
      if (type == "7z" || type == "zip") {
        type = "rar";
      }
      let typeList = ["doc", "xls", "ppt", "pdf", "zip", "7z", "rar"];
      let icon = require("@/assets/images/file.png");
      const { host } = this.userInfo;
      if (isImageUrl(fileUrl)) {
        if (fileUrl.includes("https") || fileUrl.includes("http")) {
          icon = fileUrl;
        } else {
          icon = `${host}${fileUrl}`;
        }
      } else {
        let iconType = typeList.find((item) => type.includes(item));
        if (iconType) {
          icon = require(`@/assets/images/${iconType}.png`);
        }
      }
      return icon;
    },
    //预览
    async handlePreview(url, type) {
      const { host, watermark } = this.userInfo;
      let fileUrl = url || "";
      let typeList = ["doc", "xls", "ppt", "docx", "xlsx", "pptx", "pdf"];
      let isCloud = true;
      if (!fileUrl.includes("https://") && !fileUrl.includes("http://")) {
        fileUrl = `${host}${url}`;
        isCloud = false;
      }
      if (isImageUrl(fileUrl)) {
        let imgs = [];
        try {
          imgs.push(await previewImg(fileUrl, watermark, isCloud, host));
          ImagePreview(imgs);
        } catch {
          this.$toast("预览图生成失败");
        }
      } else {
        let iconType = typeList.find((item) => type.includes(item));
        if (typeList.indexOf(type) > -1) {
          this.pdfShow = true;
          this.pdfUrl = url;
        } else {
          this.$toast("当前文件不支持预览");
        }
      }
    },
    // 查看子任务详情
    handleSubInfo(item) {
      this.subTaskInfoShow = true;
      this.subTaskInfo = item;
    },
    // 开始任务
    handleStartTask() {
      this.startTaskShow = true;
    },
    // 删除任务
    handledDelTask() {
      this.confirm("是否删除当前任务", "del");
    },
    // 催办
    handledRemindTask() {
      this.remindShow = true;
      this.isSelect = true;
      this.remindType = 1;
    },
    // 任务转办
    handledTransferTask() {
      if (this.progressList.length > 0) {
        this.$dialog
          .confirm({
            message: "当前有更新任务记录，转办将删除记录，是否转办?",
            className: "no-title",
          })
          .then(() => {
            this.pickerUserShow = true;
            this.receive_userId = this.info.receive_username.map(
              (item) => item.userid
            );
            this.receive_userId.push(this.info.userid);
            this.$store.commit("SET_PICKER_USER", {
              filter: this.receive_userId,
            });
          });
      } else {
        this.pickerUserShow = true;
        this.receive_userId = this.info.receive_username.map(
          (item) => item.userid
        );
        this.receive_userId.push(this.info.userid);
        this.$store.commit("SET_PICKER_USER", { filter: this.info.userid });
      }
    },
    // 转办任务确定
    pickerUserSubmit(val, obj) {
      this.transfer(obj.user.label, obj.user.id, obj.dep);
    },
    // 下载到云盘
    async handleDownload(name,path) {
      try{
        let fileName = name;
        let first = fileName.lastIndexOf(".");//取到文件名开始到最后一个点的长度
        let namelength = fileName.length;//取到文件名长度
        let filesuffix = fileName.substring(first + 1, namelength );//截取获得后缀名
        if (filesuffix == 'zip'|| filesuffix == 'ZIP' || filesuffix == 'rar' || filesuffix == 'RAR') {
          let _params = {
            file_url: path,
            file_name:name,
            send_user: this.userInfo.userid
          }
          const {code, data} =  await common.downloadFile(_params)
          // console.log(data)
          if (code == 1 ){
            this.$notify({ type: "success", message: '下载成功，请至企业微信查看' });
          } else if (code == -1) {
            this.$notify({ type: "danger", message: '文件大小超出限制' });
          } else {
            this.$notify({ type: "danger", message: '文件下载失败' });
          }
        } else {
          // console.log(encodeURIComponent(name))
          window.open(`${path}?attname=${encodeURIComponent(name)}`)
        }
      } catch {
        this.$notify({ type: "danger", message: '文件下载失败' });
      }
      // this.downloadFile("cancel", file);
      // this.$download({
      //   title: `下载文件${name}`,
      //   cancelText: "下载到本地",
      //   confirmText: "下载到云盘",
      // }).then((action, done) => {
      //   this.downloadFile(action, file);
      // });
    },
    // 查看发起人信息
    async openUser() {
      let info = this.info;
      let that = this;
      if (info.role == 0) {
        return false;
      }
      wx.ready(function () {
        let userId = info.userid;
        if (userId) {
         let user = userId;
          wx.invoke(
            "openUserProfile",
            {
              type: 1, //1表示该userid是企业成员，2表示该userid是外部联系人
              userid: user, //可以是企业成员，也可以是外部联系人
            },
            function (res) {
              if (res.err_msg != "openUserProfile:ok") {
                that.$toast("该成员不是当前企业成员");
              }
            }
          );
        }
      });
    },
    // 下载文件
    // async downloadFile(action, file) {
    //   let that = this;
    //   if (action == "confirm") {
    //     if (!file.save_path) {
    //       return this.$notify({ type: "danger", message: "文件地址不正确" });
    //     }
    //     this.$toast.loading({
    //       message: "保存中...",
    //       forbidClick: true,
    //     });
    //     try {
    //       console.log(file.save_path)
    //       const { code, data } = await common.cloudFileUpload({
    //         url: file.save_path,
    //         disk: file.disk,
    //         filename: file.name,
    //       });
    //       if (code) {
    //         this.$toast("文件已保存到云盘");
    //         setTimeout(function () {
    //           that.$toast.clear();
    //         }, 500);
    //       } else {
    //         that.$toast("文件保存失败");
    //       }
    //     } catch {
    //       this.$toast("文件保存失败");
    //     }
    //   } else if (action == "cancel") {
    //     let a = document.createElement("a");
    //     a.href = file;
    //     a.download = file.name;
    //     a.click();
        // var request = new XMLHttpRequest();
        // request.open("GET", file.save_path, true);
        // request.responseType = "blob";
        // request.onload = function (e) {
        //   var url = window.URL.createObjectURL(request.response);
        //   var a = document.createElement("a");
        //   a.href = url;
        //   a.download = file.name;
        //   a.click();
        // };
        // request.send();
    //   }
    // },
    // 确认弹窗
    confirm(title, type) {
      this.$dialog
        .confirm({
          message: title,
          className: "no-title",
          beforeClose: (action, done) => {
            this.beforeClose(action, done, type);
          },
        })
        .catch(() => {});
    },
    // 关闭回调
    beforeClose(action, done, type) {
      if (action === "confirm") {
        switch (type) {
          case "start":
            this.startTask(done);
            break;
          case "del":
            this.deleteTask(done);
            break;
          case "end":
            this.completeTask(done);
            break;
          default:
            break;
        }
      } else {
        done();
      }
    },
    // 删除任务接口
    async deleteTask(done) {
      try {
        let { code, msg } = await task.del({ id: this.id });
        if (code) {
          done();
          this.$router.go(-1);
          msg = this.endWay == 2 ? "任务取消成功" : msg;
          return this.$notify({ type: "success", message: msg });
        } else {
          done(false);
          msg = this.endWay == 2 ? "任务取消失败" : msg;
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        done(false);
        let messge = this.endWay == 2 ? "任务取消失败" : "删除失败";
        return this.$notify({ type: "danger", message: messge });
      }
    },
    // 完成任务接口
    async completeTask(done) {
      try {
        const { code, msg } = await task.complete({
          id: this.id,
          type: 1,
          status: 2,
        });
        if (code) {
          done();
          this.$router.go(-1);
          this.getInfo();
        } else {
          done(false);
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        done(false);
        return this.$notify({ type: "danger", message: "更新失败" });
      }
    },
    async remindTask(userid) {
      try {
        const { code, msg } = await task.remind({
          id: this.id,
          userid: userid,
        });
        if (code) {
          this.getInfo();
        } else {
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        return this.$notify({ type: "danger", message: "提醒失败" });
      }
    },
    async transfer(name, userid, dep) {
      this.button.loading = true;
      try {
        const { code, msg } = await task.transfer({
          id: this.id,
          name: name,
          userid: userid,
          dep: dep,
        });
        this.button.loading = false;
        if (code) {
          this.getInfo();
        } else {
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        this.button.loading = false;
        done(false);
        return this.$notify({ type: "danger", message: "转办失败" });
      }
    },
  },
};
</script>
<style lang="less">
.info-box {
  font-size: 14px;
  padding-bottom: 70px;
  .pdl-10 {
    padding-left: 10px;
  }
  .success {
    color: @green-light !important;
  }
  .blue {
    color: @blue;
  }
  .green {
    color: @green;
  }
  .gray {
    color: @gray;
    font-size: 12px;
  }
  .ft12 {
    font-size: 12px;
  }
  .level0 {
    fill: #5ea9e8 !important;
  }
  .level1 {
    fill: #ff9c2b !important;
  }
  .level2 {
    fill: #f56c6c !important;
  }
  .box {
    background: @white;
    margin-bottom: 15px;
    .level {
      font-size: 17px;
      padding: 12px 16px;
      img {
        width: 16px;
        margin-right: 4px;
        vertical-align: middle;
      }
    }
    .title {
      font-size: 16px;
      margin: 13px 0 10px;
      font-size: 17px;
      color: #303133;
      padding: 0 16px;
    }
    .content {
      text-align: justify;
      word-break: break-all;
      color: #606266;
      font-size: 15px;
      padding: 0 16px;
      padding-bottom: 15px;
      white-space: pre-wrap;
    }
    .progress-box {
      padding: 17px 16px;
      border: @border-width-base solid #f5f7fa;
      display: flex;
      color: #606266;
      align-items: center;
      .progress {
        flex: 2;
        height: 24px;
        margin: 0 10px;
        border: @border-width-base solid #97cfff;
        border-radius: 3px;
        position: relative;
        .line,
        .line-box {
          position: absolute;
          top: 0px;
          left: 0px;
          border-radius: 3px;
          height: 22px;
          width: 100%;
          background: repeating-linear-gradient(
            -45deg,
            #97cfff,
            #97cfff 15px,
            #269cff 0,
            #269cff 30px
          );
        }
        .line-box {
          background: #fff;
          overflow: hidden;
          top: 1px;
          left: 1px;
        }
      }
      .finish {
        border: @border-width-base solid #83d66c;
        .line,
        .line-box {
          background: repeating-linear-gradient(
            -45deg,
            #a2ec90,
            #a2ec90 15px,
            #83d66c 0,
            #83d66c 30px
          );
        }
      }
      .rate {
        color: #0082ef;
        &.finish {
          border: none;
          color: #83d66c;
        }
      }
    }
    &.cell {
      padding: 0;
      .icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .start-color {
        color: @start-color;
      }
      .receive-color {
        color: @receive-color;
      }
      .cc-color {
        color: @cc-color;
      }
      .value {
        color: #303133;
        font-size: 14px;
        font-weight: 400;
      }
    }
    .sub-title {
      color: #303133;
      font-size: 16px;
      font-weight: 400;
    }
    .lable {
      color: #606266;
      font-size: 15px;
      font-weight: 400;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 70%;
    }
    .btn-text {
      color: @blue;
      border: none;
      line-height: 20px;
      height: 20px;
    }
    .sub-task_list {
      font-size: 14px;
      .item {
        padding: 10px 16px;
        position: relative;
        &::before {
          content: "";
          width: 4px;
          background-color: @red;
          height: calc(100% - 20px);
          display: block;
          position: absolute;
          top: 10px;
        }
        &:nth-child(1n)::before {
          background-color: @red;
        }
        &:nth-child(2n)::before {
          background-color: @blue;
        }
        &:nth-child(3n)::before {
          background-color: @orange;
        }
        &:not(:last-child) {
          border-bottom: 1px solid @border-color;
        }
        .sub-task_title {
          display: inline-block;
          vertical-align: middle;
          max-width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 10px;
        }
        .van-icon {
          vertical-align: middle;
        }
        .status {
          padding: 10px;
        }
        .action {
          color: @gray-icon;
          float: right;
          display: flex;
          justify-content: space-between;
          font-size: 18px;
        }
      }
    }
    .progress-task_list {
      .item {
        padding: 10px 16px;
        .user-info {
          display: flex;
          align-content: center;
          line-height: 32px;
          font-size: 15px;
          font-weight: 500;
        }
        .til {
          line-height: 20px;
          padding: 0;
          margin: 0;
        }
        .remarks {
          padding-left: 12.5%;
          margin-bottom: 5px;
        }
        .file {
          padding: 9px 0 9px 12.5%;
          .van-image {
            border-radius: 2px;
            overflow: hidden;
          }
          .info {
            display: flex;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 2px;
            align-items: center;
            .name {
              margin-right: 10px;
              width: 40%;
              overflow: hidden;
              margin-left: 10px;
            }
          }
          .status {
            color: @gray-dark-txt;
            font-size: 12px;
          }
        }
      }
    }
  }
  .end-way {
    .van-dialog__content {
      padding: 24px 15px;
      margin: 10px 0;
      text-align: center;
      .van-radio-group {
        justify-content: space-around;
      }
    }
  }
  footer {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 2px 0 4px 0px rgba(207, 207, 207, 0.8);
    button {
      border-radius: 0;
      display: block;
      border: 0;
      flex: 1;
      &:nth-child(2) {
        background: @blue;
        color: @white;
      }
    }
  }
}
</style>

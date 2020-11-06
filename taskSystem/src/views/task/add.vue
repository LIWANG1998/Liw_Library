<template>
  <div class="task-add">
    <van-form
      ref="addForm"
      submit-on-enter
      scroll-to-error
      :show-error-message="false"
    >
      <div class="box">
        <van-field name="level">
          <template #input>
            <van-radio-group v-model="form.level" direction="horizontal">
              <van-radio
                v-for="(item, index) in level"
                :key="index"
                :name="item.id"
                checked-color="#0082EF"
              >
                {{ item.value }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </div>
      <div class="box">
        <van-field
          v-model="form.title"
          required
          name="title"
          label="任务标题"
          placeholder="请添加标题限制20个字符"
          maxlength="20"
          autocomplete="false"
          clearable
          :rules="[{ required: true, message: '请添加标题限制20个字符' }]"
        />
        <van-field
          :value="form.content"
          required
          name="content"
          rows="1"
          label="任务内容"
          type="text"
          class="border-none"
          :rules="[{ required: true, message: '请添加内容限制500个字符' }]"
        >
          <template #input>
            <input type="hidden" />
<!--            <div v-if="isEditorErr" style="color: #ee0a24">-->
<!--              请添加内容限制500个字符-->
<!--            </div>-->
          </template>
        </van-field>
        <editor
          :empty="isEditorErr"
          :content="form.content"
          @change="editorChange"
          placeholder="请添加内容限制500个字符"
        ></editor>
      </div>
      <div class="box">
        <van-field
          v-model="formShow.username"
          required
          name="userid"
          label="发起人"
          input-align="right"
          autocomplete="false"
          readonly
        />
        <van-field
          v-model="formShow.receive_userid"
          required
          name="receive_userid"
          label="接收人"
          input-align="right"
          autocomplete="false"
          right-icon="arrow"
          label-class="label-user"
          readonly
          placeholder="请选择接收人"
          :rules="[{ required: true, message: '请选择接收人' }]"
          @click="handlePickerUser('receive_userid')"
        >
          <template #label>
            <span class="label">接收人</span>
            <span class="gray">（{{ pickerUserNum.receive_userid }}）</span>
          </template>
        </van-field>
        <van-field
          v-model="formShow.cc_userid"
          name="cc_userid"
          label="抄送人"
          input-align="right"
          autocomplete="false"
          right-icon="arrow"
          label-class="label-user"
          readonly
          placeholder="请选择抄送人"
          @click="handlePickerUser('cc_userid')"
        >
          <template #label>
            <span class="label">抄送人</span>
            <span class="gray">（{{ pickerUserNum.cc_userid }}）</span>
          </template>
        </van-field>
      </div>
      <div class="box">
        <van-field
          :value="form.is_allow_transfer"
          name="is_allow_transfer"
          label="允许转办"
          input-align="right"
          autocomplete="false"
          placeholder="允许接收人把任务转交他人办理"
          label-class="label-info"
        >
          <template #label>
            <span class="label">允许转办</span>
            <span class="gray">（允许接收人把任务转交他人办理）</span>
          </template>
          <template #input>
            <van-switch
              v-model="form.is_allow_transfer"
              active-color="#67C23A"
              :active-value="1"
              :inactive-value="0"
              size="30"
            />
          </template>
        </van-field>
        <van-field
          :value="form.is_pull_group"
          name="is_pull_group"
          label="一键拉群"
          input-align="right"
          autocomplete="false"
          placeholder="任务发起后建立任务群"
          label-class="label-info"

        >
          <template #label>
            <span class="label">一键拉群</span>
            <span class="gray">（仅能拉取同组织架构建立新群聊）</span>
          </template>
          <template #input>
            <van-switch
              @click="changeSwitch('group')"
              v-model="form.is_pull_group"
              active-color="#67C23A"
              :active-value="1"
              :inactive-value="0"
              size="30"
              :disabled="chatid || pickerUserNum.receive_userid + pickerUserNum.cc_userid  < 2? true : false"
            ></van-switch>
          </template>
        </van-field>
<!--        <van-cell-->
<!--          title="仅新建任务可以发起新群聊"-->
<!--          icon="warning-o"-->
<!--          class="warning-value"-->
<!--          center-->
<!--        />-->
        <van-field
          :value="form.is_includ_cc"
          name="is_includ_cc"
          label="包含抄送人"
          input-align="right"
          autocomplete="false"
          placeholder="拉传阅人员进任务群"
          v-if="form.is_pull_group == 1"
          label-class="label-info"
        >
          <template #label>
            <span class="label">包含抄送人</span>
            <span class="gray">（仅能拉取同组织架构建立群聊）</span>
          </template>
          <template #input>
            <van-switch
              v-model="form.is_includ_cc"
              active-color="#67C23A"
              :active-value="1"
              :inactive-value="0"
              size="30"
              @change="changeSwitch('cc')"
              :disabled="chatid ? true : false"
            ></van-switch>
          </template>
        </van-field>
      </div>
      <div class="box">
        <van-field
          v-model="form.start_time"
          required
          name="start_time"
          label="开始时间"
          placeholder="点击选择时间"
          input-align="right"
          right-icon="arrow"
          readonly
          clickable
          @click="handleChangeDate('start_time')"
        />
        <van-field
          v-model="form.end_time"
          name="end_time"
          required
          label="结束时间"
          placeholder="点击选择时间"
          input-align="right"
          right-icon="arrow"
          readonly
          clickable
          @click="handleChangeDate('end_time')"
        />
        <van-cell
          title-style="flex:2;"
          value-class="blue"
          value="更改模式"
          @click="remindModeShow = true"
        >
          <template #title>
            <label>提醒模式</label>
            <span class="gray">（{{ `当前为${remindModeData.name}` }}）</span>
          </template>
        </van-cell>
<!--        <van-cell-->
<!--          :title="remindModeData.content"-->
<!--          icon="volume-o"-->
<!--          value-class="time-value"-->
<!--          center-->
<!--        />-->
      </div>
      <div class="box">
        <div class="title border-none">
          上传附件
          <label class="gray" />
        </div>
        <van-field name="file_url">
          <template #input>
            <upload :file="fileUrl" @change="handleFile" />
          </template>
        </van-field>
      </div>
      <div class="box sub-task">
        <div class="title" @click="handleAddSubTask">
          <div>子任务</div>
          <van-icon name="plus" />
        </div>
        <div class="sub-task_list">
          <van-row v-for="(item, index) in form.son" :key="index" class="item">
            <van-col span="16" class="pdl-10">
              {{ item.title }}
            </van-col>
            <van-col class="action" span="3">
              <van-icon name="edit" @click="handleSubEdit(item, index)" />
              <van-icon name="delete" @click="handleSubDel(item, index)" />
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
      <footer>
        <van-button type="default" native-type="button" @click="handleBack">
          取消
        </van-button>
        <van-button
          type="info"
          native-type="button"
          :disabled="button[0] || button[1]"
          :loading="button[1]"
          :loading-text="button.text"
          @click="onSubmit(1)"
        >
          提交
        </van-button>
        <van-button
          v-if="!form.id||(form.id&&form.type==0)"
          type="default"
          native-type="button"
          :disabled="button[0] || button[1]"
          :loading="button[0]"
          :loading-text="button.text"
          @click="onSubmit(0)"
        >
          暂存草稿
        </van-button>
      </footer>
    </van-form>
    <van-popup
      v-model="showPopup"
      position="bottom"
      round
      :safe-area-inset-bottom="true"
      :lazy-render="true"
    >
      <div  v-if="popupData.type == 'datetime'">
        <div class="popup_btn">
          <span @click="showPopup = false">取消</span>
          <span @click="popupConfirm(pickerDate)">确定</span>
        </div>
        <div class="time_title">
          <span>年</span>
          <span>月</span>
          <span>日</span>
          <span>时</span>
          <span>分</span>
        </div>
        <van-datetime-picker
          :min-date="minDate"
          class="time_picker"
          :show-toolbar="false"
          v-model="pickerDate"
          type="datetime"
          title=""
        />
      </div>
<!--      <date-time-->
<!--        v-if="popupData.type == 'datetime'"-->
<!--        v-model="pickerDate"-->
<!--        :min-date="minDate"-->
<!--        type="datetime"-->
<!--        @confirm="popupConfirm"-->
<!--        @cancel="showPopup = false"-->
<!--      />-->
      <van-picker
        v-if="popupData.type == 'picker'"
        show-toolbar
        :columns="pickerCol"
        @confirm="popupConfirm"
        @cancel="showPopup = false"
      />
    </van-popup>
    <van-popup
      round
      v-model="showGroup"
    >
      <div class="showGroup">
        <template v-if="!chatid">
          <img src="@/assets/images/notice.png" />
          <div>当前任务相关人员不足三人无法拉群！</div>
        </template>
        <template v-else-if="chatid">
          <img src="@/assets/images/notice.png" />
          <div>已建立群聊‘{{form.title}}’,不可编辑群聊设置</div>
          <div class="showGroup_btn">
<!--            <van-button size="small" type="default">取消</van-button>-->
<!--            <van-button size="small" type="primary">复制群名称</van-button>-->
          </div>
        </template>
      </div>
    </van-popup>
    <sub-task
      :show.sync="subTaskShow"
      :data="subTaskData"
      :userData="userData"
      @confirm="subTaskSubmit"
    />
    <remind-mode
      :show.sync="remindModeShow"
      :type="form.remind_type"
      :data="form.remind_data"
      @confirm="remindModeSubmit"
    />
    <picker-user
      :show.sync="pickerUserShow"
      :data="pickerUserData"
      :obj="pickerUserObj[pickerUserType]"
      :type="pickerUserType"
      @confirm="pickerUserSubmit"
    />
  </div>
</template>
<script>
const currentDate = new Date();
//引入日期格式工具
let moment = require("moment");
//汉化
moment.locale("zh-cn");

//引入添加子任务组件
import subTask from "./components/subTask";
import remindMode from "./components/remindMode";
// 导入公共组件
import { dateTime, pickerUser, upload, pdf, editor } from "@/components";

import { mapGetters } from "vuex";
import { common, task } from "@/api";
import { on, off } from "@/utils/event";

export default {
  components: {
    dateTime,
    subTask,
    remindMode,
    pickerUser,
    upload,
    pdf,
    editor,
  },
  data() {
    return {
      id: 0,
      form: {
        title: "",
        content: "",
        level: 0,
        is_allow_transfer: 0,
        is_pull_group: 0,
        is_includ_cc: 0,
        start_time: "",
        end_time: "",
        file_url: [],
        receive_userid: "",
        cc_userid: "",
        son: [],
        type: 1,
        dep_list: [],
        chatid: "",
        remind_data: [{
          default_type:'1,2,3,4,5',
          is_re_reminder:2,
        }],
        remind_type: 1,
      },
      editInfo: {
        //编辑任务时如果为一键群聊开启则不能编辑
        is_pull_group: 0,
        is_includ_cc: 0,
      },
      receiveData: [],
      formShow: {
        //弹窗组件选择表单展示内容
        level: "",
        username: "",
        receive_userid: "",
        cc_userid: "",
      },
      pickerUserNum: {
        receive_userid: 0,
        cc_userid: 0,
      },
      popupData: {
        type: "datetime", //弹窗类型
        value: "start_time", //弹窗赋值字段
      },
      pickerCol: [], //弹窗选择内容列表
      level: [
        //等级
        { id: 0, value: "普通" },
        { id: 1, value: "紧急" },
        { id: 2, value: "非常紧急" },
      ],
      diffDay: 3, //开始时间与结束时间差
      showPopup: false, //弹窗状态
      fileUrl: [], //上传文件列表
      subTaskShow: false, //子任务弹窗
      subTaskData: {}, //子任务内容
      subTaskIndex: "", //当前编辑子任务索引
      remindModeShow: false, //提醒模式弹窗
      remindModeData: {
        name: "默认提醒",
        content: "默认提醒模式",
      }, //提醒设置信息
      minDate: currentDate,
      pickerDate: currentDate,
      pickerUserData: [], //已选择人员
      pickerUserType: "", //已选择人员弹窗类型
      pickerUserObj: {
        receive_userid: {
          user: [],
          dep: [],
        },
        cc_userid: {
          user: [],
          dep: [],
        },
      },
      pickerUserShow: false, //显示选择人员弹窗,
      isSubmit: false, //是否为提交操作,
      button: {
        0: false,
        1: false,
        text: "保存中",
      },
      isEditorErr: false,
      userData: {},
      userArr:[],
      userccArr:[],
      showGroup:false,//不足三人显示拉群提示
      chatid:'',//群id

    };
  },
  watch: {
    "popupData.type"(val) {
      let formVal = this.popupData.value;
      if (val == "picker") {
        this.pickerCol = this[formVal].map((item) => item.value);
      }
    },
    "form.level"(val) {
      this.form.remind_model_id = val;
    },
    "formShow.receive_userid"(val, oldVal) {
      if (val && oldVal){
        // console.log(this.userArr)
        if (!this.chatid){
          this.userArr = val.split('、')
          let _is_pull_group = this.form.is_pull_group
          this.form.is_pull_group = this.userArr.length + this.userccArr.length < 2 ? 0 : this.form.is_pull_group
          this.showGroup = _is_pull_group == 1 && this.form.is_pull_group == 0 ? true : false
        }
      }
    },
    "formShow.cc_userid"(val, oldval) {
      // console.log('formShow.cc_userid', val)
      if (val && oldval){
        console.log('formShow.cc_userid', this.chatid, oldval)
        this.userccArr = val.split('、')
        let _is_pull_group = this.form.is_pull_group
        this.form.is_pull_group = this.userArr.length + this.userccArr.length < 2 ? 0 : this.form.is_pull_group
        this.showGroup = _is_pull_group == 1 && this.form.is_pull_group == 0 ? true : false

      }
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.formShow.username = this.userInfo.name;
    if (this.id) {
      this.getInfo();
      this.getSubInfo();
    } else {
      let startDate = moment(this.minDate),
        endDate = moment(this.minDate).add(3, "days");
      this.form.start_time = startDate.format("YYYY-MM-DD HH:mm");
      this.form.end_time = endDate.format("YYYY-MM-DD HH:mm");
    }
     //判断有无操作类型操作类型1新增2修改3删除
     let pageType = this.id ? 2 : 1
    this.form.remind_data?.forEach(item =>{
       item.operate_type = pageType
     })
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 获取信息
    async getInfo() {
      const { code, data } = await task.getInfo({ id: this.id });
      if (code && data.title) {
        this.chatid = data.chatid
        this.editInfo.is_pull_group = data.is_pull_group;
        this.editInfo.is_includ_cc = data.is_includ_cc;
        data.file_url = data.file_url ? data.file_url : [];
        Object.keys(this.form).forEach((key) => {
          this.form[key] = data[key];
        });
        this.receiveData = data.receive_username.map((item) => ({
          id: item.userid,
          label: item.name,
        }));
        this.formShow.username = data.username
          .map((item) => item.name)
          .join(",");
        this.formShow.receive_userid = data.receive_username
          .map((item) => item.name)
          .join(",");
        this.formShow.cc_userid = data.cc_username
          .map((item) => item.name)
          .join(",");
        this.fileUrl = Object.assign([], data.file_url);
        this.diffDay = moment(data.end_time).diff(
          moment(data.start_time),
          "days"
        );
        this.form.start_time = moment(this.form.start_time).format(
          "YYYY-MM-DD HH:mm"
        );
        this.form.end_time = moment(this.form.end_time).format(
          "YYYY-MM-DD HH:mm"
        );
        this.userData.user = data.receive_username;
        this.userData.dep =
          data.dep_list != ((null && "") || undefined)
            ? data.dep_list.split(",")
            : new Array();
        this.pickerUserNum.receive_userid = data.receive_username.length;
        this.pickerUserNum.cc_userid = data.cc_username.length;
        this.pickerUserObj.dep =
          data.dep_list != ((null && "") || undefined)
            ? data.dep_list.split(",")
            : new Array();
        this.pickerUserObj.user =
          data.receive_username != ((null && "") || undefined)
            ? data.receive_username.map((item) => {
                return {
                  id: item.userid,
                  label: item.name,
                  isuser: 1,
                  avatar: item.avatar,
                };
              })
            : new Array();
        this.form.is_pull_group = this.chatid ? 1 : 0
        this.form.remind_type = data.remind_type
        this.form.remind_data = data.remind_model;
        // console.log(this.form.remind_data);
        //判断有无操作类型操作类型1新增2修改3删除
        let pageType = this.id ? 2 : 1
        this.form.remind_data?.forEach(item =>{
          item.operate_type = pageType
        })
        console.log(this.form.remind_type)
        if (this.form.remind_type == 3) {
          let _hourArr = this.form.remind_data[0].default_hour.split(':')
          let _default_hour = (_hourArr[0] > 9 ? _hourArr[0] : '0' + _hourArr[0]) + ':' + _hourArr[1]
          this.form.remind_data[0].default_hour = _default_hour
          console.log(this.form.remind_data[0].default_hour)
        }
      } else {
        this.$router.go(-1);
        this.isSubmit = true;
        return this.$notify({ type: "danger", message: "当前任务不存在" });
      }
      // console.log(this.form)
    },
    // 获取子任务信息
    async getSubInfo() {
      const { code, data } = await task.getSubList({ pid: this.id });
      if (code) {
        data.forEach((item) => {
          if (item.file_url) {
            item.file_url = Array.isArray(item.file_url)
              ? item.file_url
              : JSON.parse(item.file_url);
          } else {
            item.file_url = new Array();
          }
        });
        this.form.son = data;
      }
    },
    // 弹窗确定事件
    popupConfirm(value) {
      // console.log(value)
      let type = this.popupData.type;
      let formVal = this.popupData.value;
      this.form[formVal] = moment(value).format("YYYY-MM-DD HH:mm");
      if (
        formVal == "start_time" &&
        moment(value).isSameOrAfter(moment(this.form.end_time))
      ) {
        this.form.end_time = moment(value)
          .add(1, "days")
          .format("YYYY-MM-DD HH:mm");
      }
      if (
        formVal == "end_time" &&
        moment(value).isSameOrBefore(moment(this.form.start_time))
      ) {
        this.form.end_time = "";
        return this.$notify({
          type: "danger",
          message: "结束时间必须大于开始时间",
        });
      }
      this.showPopup = false;
    },
    handleBack() {
      this.$router.go(-1);
    },
    // 时间选择
    handleChangeDate(type) {
      this.pickerDate = this.transformDate(this.form[type]);
      this.popupData = { type: "datetime", value: type };
      this.showPopup = true;
      if (type === 'start_time') {
        this.minDate = this.transformDate(moment().format("YYYY-MM-DD HH:mm"));
      }else if (type === "end_time") {
        this.minDate = this.transformDate(this.form.start_time);
      }
    },
    // 选择人员
    handlePickerUser(type) {
      this.pickerUserType = type;
      this.pickerUserData =
        this.form[type].length > 0 ? this.form[type].split(",") : new Array();
      this.pickerUserShow = true;
      this.$store.commit("SET_PICKER_USER_TYPE", type);
      let storeType = "",
        user = "";
      if (type == "receive_userid") {
        storeType = "cc_userid";
        user = this.receiveData;
      } else {
        storeType = "receive_userid";
      }
      this.$store.commit("SET_PICKER_USER", {
        type: storeType,
        obj: {
          user: user,
          dep:
            this.form.dep_list && this.form.dep_list.length > 0
              ? this.form.dep_list.split(",")
              : new Array(),
        },
        data:
          this.form[storeType].length > 0
            ? this.form[storeType].split(",")
            : new Array(),
      });
    },
    //字符串转成为日期
    transformDate(date) {
      return date ? new Date(date.replace(/-/g, "/")) : new Date();
    },
    // 上传图片事件
    handleFile(val) {
      this.form.file_url = val;
    },
    // 打开子任务弹窗
    handleAddSubTask() {
      this.subTaskShow = true;
      // document.title = '发起子任务'
      this.subTaskData = {};
      this.subTaskIndex = "";
    },
    //子任务添加
    subTaskSubmit(val) {
      if (this.id) {
        if (val.id) {
          this.editSubTask(val);
        } else {
          this.addSubTask(val);
        }
      } else {
        if (this.subTaskIndex === "") {
          let sonData = Object.assign({}, val);
          this.form.son.push(sonData);
        } else {
          this.form.son[this.subTaskIndex] = Object.assign({}, val);
        }
      }
    },
    // 编辑子任务
    handleSubEdit(item, index) {
      this.subTaskData = item;
      this.subTaskIndex = index;
      this.subTaskShow = true;
    },
    // 删除子任务
    handleSubDel(item, index) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否删除当前子任务",
        })
        .then(() => {
          this.form.son.splice(index, 1);
          if (item.id) {
            this.delSubTask(item.id);
          }
        })
        .catch(() => {});
    },
    // 设置提醒模式
    remindModeSubmit(val, type) {
      console.log('add', val, type)
      this.form.remind_data = val;
      // this.form.remind_type = type ? 2 : 1;
      this.form.remind_type = type
      this.remindModeData.name = type == 1 ||  type == 3? "自定义提醒" : "默认提醒";
      this.remindModeData.content = type == 1 ||  type == 3 ? "自定义提醒模式" : "默认提醒模式";
    },
    // 选择人员确定操作
    pickerUserSubmit(val, obj) {
      // console.log(val)
      // console.log(obj)
      let type = this.pickerUserType;
      this.form[type] = val.join(",");
      this.pickerUserObj[type] = obj;
      if (type == "receive_userid") {
        this.form.dep_list = obj.dep.join(",");
        this.receiveData = obj.user;
          this.userData = obj;
      }
      this.pickerUserNum[type] = val.length;
      if (val.length > 3) {
        this.formShow[type] =
          obj.user
            .map((item) => item.label)
            .slice(0, 2)
            .join("、") + "...";
      } else {
        this.formShow[type] = obj.user.map((item) => item.label).join("、");
      }
      // console.log(this.formShow)
      // 将选择的人员存到vuex中，接受人不能与抄送人相同
    },
    //提交数据
    onSubmit(type) {
      this.$refs.addForm
        .validateAll()
        .then(() => {
          this.button[type] = true;
          this.saveTask(type);
        })
        .catch((err) => {
          let index = err.findIndex((item) => item.name == "content");
          if (index > -1) {
            this.isEditorErr = true;
          }
        });
    },
    editorChange(val, length) {
      this.form.content = val;
      if (length > 0) {
        this.isEditorErr = false;
      }
    },
    async addSubTask(item) {
      const { code, msg } = await task.addSub({ pid: this.id, ...item });
      if (code) {
        this.getSubInfo();
        return this.$notify({ type: "success", message: msg });
      } else {
        return this.$notify({ type: "danger", message: msg });
      }
      try {
      } catch {
        return this.$notify({ type: "danger", message: "添加失败" });
      }
    },
    async editSubTask(item) {
      try {
        const { code, msg } = await task.editSub({
          pid: this.id,
          ...item,
        });
        if (code) {
          this.getSubInfo();
          return this.$notify({ type: "success", message: msg });
        } else {
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        return this.$notify({ type: "danger", message: "编辑失败" });
      }
    },
    async delSubTask(id) {
      try {
        const { code, msg } = await task.delSub({ id: id });
        if (code) {
          return this.$notify({ type: "success", message: msg });
          this.getSubInfo();
        } else {
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        return this.$notify({ type: "danger", message: "删除失败" });
      }
    },
    async saveTask(type) {
      this.isSubmit = true;
      let that = this;
      let postData = Object.assign({}, this.form);
      if (!this.id) {
        postData.son.forEach((item, index) => {
          item.no = index;
          item.file_url = item.file_url.length > 0 ? item.file_url : "";
          if (item.subtask_lead_username){
            delete item.subtask_lead_username
          }
        });
        postData.son = postData.son.length > 0 ? postData.son : "";
        postData.type = type;
        postData.status = type == 0 ? 0 : 1;

      }
      if (this.chatid != ''){
        postData.chatid = this.chatid
      }
      postData.file_url = postData.file_url.length > 0 ? postData.file_url : "";
      // postData.sub_task = sub_task;
      //判断有无操作类型操作类型1新增2修改3删除
      postData.remind_data?.forEach(item =>{
        item.operate_type = item.operate_type ? item.operate_type : 1
      })
      console.log(postData)
      let res = "";
      try {
        if (this.id) {
          postData.id = this.id;
          delete postData.son;
          res = await task.edit(postData);
        } else {
          res = await task.add(postData);
        }
        const { code, msg, data} = res;
        if (code == 200 || code == 1) {
          this.$notify({ type: "success", message: msg });
          this.button[type] = false;
          if (data.is_pull_group==1&&data.type==1) {
            wx.ready(function () {
              wx.openEnterpriseChat({
                // 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
                userIds: data.group_member, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
                externalUserIds:"",
                groupName: data.group_name, // 必填，会话名称。单聊时该参数传入空字符串""即可。
                success: function (res) {
                  // 回调
                },
                fail: function (res) {
                  if (res.errMsg.indexOf("function not exist") > -1) {
                    return that.$notify({
                      type: "danger",
                      message: "版本过低请升级",
                    });
                  }
                },
              });
            });
          }
          if (postData.type) {
            this.$router.push("/execute");
          } else {
            this.$router.push("/draft");
          }
        } else {
          this.button[type] = false;
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        this.button[type] = false;
      }
    },
    //点击一键拉群
    changeSwitch(type){
      if (!this.chatid) {
        if (type == 'group'){//点击一键拉群
          // this.showGroup = this.userArr.length + this.userccArr.length  < 2 ? true : false
          this.showGroup = parseInt(this.pickerUserNum.receive_userid) + parseInt(this.pickerUserNum.cc_userid)  < 2 ? true : false
          // console.log(this.form.is_includ_cc)
          this.form.is_includ_cc = 1
        } else {//点击包含抄送人
          // this.showGroup = this.userArr.length < 2 ? true : false
          this.showGroup = parseInt(this.pickerUserNum.receive_userid) < 2 ? true : false
          this.form.is_pull_group = this.userArr.length < 2 ? 0 : this.form.is_pull_group
        }
      } else {
        this.showGroup = true
      }
    }
  },

  // 离开提醒
  beforeRouteLeave(to, from, next) {
    //this.submit用来判断是点击提交以后的后退 还是点击了后退按钮
    if (this.isSubmit) {
      next();
    } else {
      //弹出提示框
      this.$dialog
        .confirm({
          title: "提示",
          message: "退出后内容将不会保存，您是否要继续?",
          cancelButtonText: "退出",
          confirmButtonColor: "#467db9",
          confirmButtonText: "继续填写",
        })
        .then(() => {
          next(false);
        })
        .catch(() => {
          next();
          let diglog = document.body.getElementsByClassName("van-dialog");
          let overlay = document.body.getElementsByClassName("van-overlay");
          document.body.removeChild(diglog[0]);
          document.body.removeChild(overlay[0]);
        });
    }
  },
};
</script>
<style lang="less">
.task-add {
  padding-bottom: 70px;
  height: auto !important;
  .box:not(:first-child) {
    margin-top: 15px;
    background: @white;
    .title {
      padding: 10px 16px;
      font-size: 14px;
      border-bottom: 1px solid @border-color;
      display: flex;
      align-content: center;
    }
  }
  .warning-value {
    color: red;
    i {
      color: red;
    }
  }
  .time-value {
    flex: 1.5;
  }
  footer {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 6;
    box-shadow: 2px 0 4px 0px rgba(207, 207, 207, 0.8);
    background: @white;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
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
  .sub-task {
    .title {
      justify-content: space-between;
    }
  }
  .van-radio-group {
    width: 100%;
    justify-content: space-around;
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
      .van-icon {
        vertical-align: middle;
      }
      .action {
        margin-top: 20px;
        float: right;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .label-info {
    width: 75%;
    line-height: 32px;
    .gray {
      font-size: 12px;
    }
  }
  .label-user {
    width: 40%;
    .gray {
      font-size: 12px;
    }
  }
  /deep/.van-uploader__upload {
    border: 1px dashed @gray-medium;
    background-color: @white-min;
    i {
      font-size: 20px;
    }
  }
  .gray {
    color: @gray;
  }
  .blue {
    color: @blue;
  }
  .pdl-10 {
    padding-left: 10px;
  }
  .border-none,
  .border-none::after {
    border: 0 !important;
  }
}
.time_title{
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  color: #303133;
  font-size: 15px;
}
.time_picker{
  padding: 0 10px;
}
.popup_btn {
  padding: 15px 10px 30px;
  font-size: 16px;
  color: #606266;
  display: flex;
  justify-content: space-between;

  span:nth-child(2) {
    color: #0082EF;
  }
}
  .showGroup{
   box-sizing: border-box;
    width: 256px;
    height: 174px;
    padding: 30px 30px;
    font-size: 15px;
    font-weight: 500;
    line-height: 30px;
    text-align: center;
    img{
      padding-bottom: 10px;
      width: 44px;
      height: 38px;
    }
    .showGroup_btn{
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
    }
  }
</style>

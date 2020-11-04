<template>
  <div class="box" id="box">
    <!--公文详情页面-->
    <div class="box-x" v-show="isShowPage == 1" v-if="showBtn">
      <van-tabs
        v-show="!editState"
        v-model="active"
        color="#0082EF"
        line-width="25px"
        title-active-color="#0082EF"
      >
        <van-tab
          :title="
            type == 1
              ? '发文信息'
              : type == 2
              ? '收文信息'
              : type == 3
              ? '签报信息'
              : '公文信息'
          "
        >
          <!-- 公文字段 -->
          <div class="show_div"></div>
          <div class="choise-box" v-if="isss.isshow">
            <template v-for="(item, index) in fields_data">
              <input-type :key="index" :keys="index" :item="item" />
            </template>
          </div>
        </van-tab>
        <van-tab title="正文内容" class="content-box">
          <template v-if="can_approval == 1 ? true : false">
            <div class="lookEye" v-if="!(lab && lab == 2)" @click="goDetail()">
              <svg-icon iconClass="ed-cont"></svg-icon>
              <span class="preview">编辑正文</span>
            </div>
          </template>
          <div
            class="content-div"
            :class="can_approval == 1 ? classH : 'can_app'"
          >
            <div class="content" v-html="content"></div>
          </div>
          <template v-if="can_approval == 1 ? true : false">
            <ele-sign :ele="ele" />
          </template>
        </van-tab>
        <van-tab
          :title="
            type == 1
              ? '发文附件'
              : type == 2
              ? '收文附件'
              : type == 3
              ? '签报附件'
              : '公文附件'
          "
        >
          <enclosure
            :files_all="files_all"
            :can_approval="can_approval"
          ></enclosure>
        </van-tab>
        <template v-if="is_show">
          <van-tab v-if="!lab && _data.status != 20" title="流程信息">
            <div
              class="process"
              :style="{
                'background-color': actives == 2 ? '#FAFAFA' : '#FFFFFF',
              }"
            >
              <div class="processStatus">
                <div
                  v-for="(item, index) in processList"
                  :key="index"
                  @click="addClass(index)"
                >
                  <div :class="actives === item.id ? 'addblur' : ''">
                    <img :src="item.icon" alt />
                    {{ item.text }}
                  </div>
                </div>
              </div>
              <!-- 统计图 -->
              <tableInfo
                v-if="actives == 0"
                :topdata="topdata"
                :where="where_id"
                :fid="fid"
              ></tableInfo>
              <!-- 流程走向 -->
              <trend v-if="actives == 1" :trendList="trendList"></trend>
              <!-- 流程日志 -->
              <log
                v-if="actives == 2"
                :logList="logList"
                :userid="userid"
                :fid="fid"
                :wid="where_id"
              ></log>
            </div>
          </van-tab>
          <van-tab v-if="!lab" title="行为统计">
            <behavior-statistics />
          </van-tab>
        </template>
        <van-tab v-if="lab" title="退回理由">
          <div class="rea-ret">{{ remark }}</div>
        </van-tab>
      </van-tabs>
      <!-- 预览文件 -->
    </div>
    <template v-if="is_show">
      <!-- 审批详情页面 -->
      <div v-show="isShowPage == 2">
        <collect
          v-if="userinfo_is"
          :isShowPage="isShowPage"
          :where_id="where_id"
          :fid="fid"
        ></collect>
      </div>
      <div v-if="!(lab && lab == 2) && showBtn" @click="saveDoc()">
        <examineDetail
          :can_approval="can_approval"
          :isShowPage="isShowPage"
          @saveeleid="saveeleid"
        ></examineDetail>
      </div>
    </template>
    <!-- 更多公用按钮-->
    <div v-if="!(lab && lab == 1) && set_auth">
      <documentDetail></documentDetail>
    </div>
    <showFun
      v-if="set_auth && showBtn"
      :role="role"
      :handle="handle"
      :docId="fid"
      :commomType="commomType"
      :type="type"
      :where_id="where_id"
      :tid="temId"
      :auth="auth"
      :revoke="revoke"
      :did="did"
      :page="page"
      :button="button"
      :ff_id="ff_id"
    ></showFun>
    <div
      class="lookwen"
      v-show="(active == 1 || active == 0) && edta && isShowPage != 2"
      @click="goLookConetent()"
    >
      <van-icon name="eye-o" style="margin-right: 5px" size="18" />预览公文
    </div>
  </div>
</template>

<script>
let loc = true;
import log from "./components/log";
import trend from "./components/trend";
import tableInfo from "./components/tableInfo";
import enclosure from "./components/enclosure";
import documentDetail from "../../components/common/documentDetail";
import examineDetail from "../../components/common/examineDetail";
import showFun from "../../components/common/showFun";
import choiseQbao from "../draft/components/choiseQbao";
import choiseSwen from "../draft/components/choiseSwen";
import choise from "../draft/components/choise";
import edits from "../draft/components/edits";
import {
  documentInfo,
  procedureJournal,
  recordList,
  memberDetail,
  del_signature_record,
} from "@/api/home";
import {
  getApprovalInfo,
  getDistributeDetail,
  document_wordno_manager,
} from "@/api/audit";
import collect from "../approval/collect";
import distributeBus from "@/assets/js/distributeId.js";
import BehaviorStatistics from "./components/BehaviorStatistics.vue";
import InputType from "@/components/InputType";
import eleSign from "@/components/EleSign";
import { HttpUrl, enlarge, set_vuex_data } from "@/js/public.js";
import { url } from "@/utils/utils.js";
import axios from "axios";
import SuSpend from "@/components/SuSpend"; //new
import SuSpenddown from "@/components/SuSpenddown"; //new
import viewDocument from "@/components/viewDocument"; //new
export default {
  components: {
    log,
    trend,
    enclosure,
    tableInfo,
    documentDetail,
    examineDetail,
    showFun,
    choise,
    edits,
    collect,
    choiseQbao,
    choiseSwen,
    BehaviorStatistics,
    InputType,
    eleSign,
    SuSpend,
    SuSpenddown,
    viewDocument,
  },
  data() {
    return {
      show_isf: false, // 控制浮动but
      red_templete_content: "",
      yulan: "预览公文",
      remark: "",
      // 退回需要的id
      did: "",
      // 审批权限
      can_approval: 0,
      HttpUrl,
      messages: "",
      editState: false,
      // 表格的信息
      document_arr: {},
      // 显示密级程度和紧急程度
      urgent_level_name: "",
      secret_level_name: "",
      show: false, //查看预览
      // id: "",
      active: 0,
      actives: 0,
      receiveStatus: true,
      fid: "", //传过来的文件id
      fields: [], //发文的信息
      // fields_data: {}, // 用来装发文头部字段的信息
      degree: [], //密级程度列表
      urgen_level: [], //紧急程度列表
      // content: "", //正文内容
      files_all: {}, //附件内容
      addList: [], //增加的内容
      type: "", // 发文类型
      lab: "", //1-我的发文，2-我的收文
      topdata: {}, //图像统计
      logList: [], //日志
      trendList: [], //流程走向
      processList: [
        {
          id: 0,
          icon: require("@/assets/img/detail/status.png"),
          text: "流程状态",
        },
        {
          id: 1,
          icon: require("@/assets/img/detail/trend.png"),
          text: "流程走向",
        },
        {
          id: 2,
          icon: require("@/assets/img/detail/journal.png"),
          text: "流程日志",
        },
      ],
      where_id: "", //流程id
      userid: "", //审核的id
      create_time: "",
      temId: "", //模板id
      isShowPage: 1, //1-显示公文详情页,2-审批详情页
      commomType: 2, //1--提交审核时，2--提交后查看，3--审核时，4--审核后查看,5--审核完成后查看，6--归档查看，7--传阅查看，8--废弃查看，9--抄送查看，10.草稿箱查看，11--收文时，12--收文完成后
      handle: "", //当前节点提交情况，1--未查看，2--已查看，3--未提交，4--已提交
      role: "", //self:提交人，auditor：审核人
      revoke: "", //审核人有无权限撤销
      currentDoc: {}, //当前公文对象status:1、等待中 2、审核进行中 3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，9归档，10发布
      status: "",
      auth: "", //从哪个页面跳转过来 1发文管理,2收文管理,3签报管理,4公文交换,5公文应用设置,6文件管理区,7电子签章,8系统管理,9组织建构

      //预览需要的数据
      //紧急程度、密级程度数据
      view_data: {
        fir: [],
        sec: [],
        thr: [],
      },
      radio_data: null,
      //字号
      all_word_no: null,
      showBtn: false, //数据加载完后显示按钮
      edta: true, // 点击编辑公文的时候隐藏掉
      page: "", //cy:传阅，从哪个页面跳转详情
      button: "", //按钮权限
      title: "", //页面当前标题
      userinfo_is: false,
      is_show: 1,
      set_auth: false,
      // isss: { id: "", name: "", word_no: "" },
      ff_id: "", //公文详情里的分发记录id，从推送消息进入详情可使
    };
  },
  computed: {
    eleitemlh() {
      return this.ele.item.length > 0;
    },
    img() {
      return (v) => {
        let text = String(v).startsWith("http");
        let imgurl = "";
        if (text) {
          imgurl = v;
        } else {
          imgurl = HttpUrl + v;
        }
        return imgurl;
      };
    },
    fields_data() {
      return this.$store.state.edittext.document_arrs;
    },
    isss() {
      return this.$store.state.edittext.isss;
    },
    iss() {
      return this.$store.state.edittext.iss;
    },
    datas() {
      return this.$store.state.edittext.datas;
    },
    ele() {
      return this.$store.state.edittext.ele;
    },
    content: {
      get() {
        return this.$store.state.edittext.content;
      },
      set(value) {
        this.$store.state.edittext.content = value;
      },
    },
    enclosure_file: {
      get() {
        return this.$store.state.edittext.enclosure_file;
      },
      set(value) {
        this.$store.state.edittext.enclosure_file = value;
      },
    },
    classH() {
      return this.ele.item.length > 0 || this.ele.zhiqian.length > 0
        ? "no_can_app"
        : "no_data_can_app";
    },
  },
  methods: {
    set_auth_fun() {
      let _auth = !!sessionStorage.getItem("SET_AUTH");
      let _flag = false;
      let _String = [
        "fanhui",
        "dayin",
        "xiazai",
        "tijiao",
        "yijian",
        "cuiban",
        "duanxin",
        "next",
        "youxiang",
      ];
      for (const authKey in this.button) {
        if (!_String.includes(authKey)) {
          if (this.button[authKey]) {
            _flag = true;
            break;
          }
        }
      }
      this.set_auth = _flag && _auth;
    },
    // 移除电子签章
    closeEleFun(n) {
      // console.log(this.ele.item[n]);
      if (this.ele.item[n].signature_id != undefined) {
        del_signature_record({ id: this.ele.item[n].id }).then((_res) => {
          // console.log(_res);
        });
      }
      this.ele.item.splice(n, 1);
      this.saveeleid();
    },
    saveDoc() {
      set_vuex_data(this.type);
      this.saveeleid();
      // console.log(this.$store.state.edittext);
      this.isShowPage = this.isShowPage && this.isShowPage == 1 ? 2 : 1;
    },
    // 排序
    sortData(a, b) {
      return a.position.zindex - b.position.zindex;
    },
    // 修改签章
    saveeleid() {
      let _ele = this.ele.item.map((v) => {
        if (v.type != 100) {
          return {
            id: v?.id ? v?.id : "",
            signature_id: v.signature_id,
            signature_img: this.img(v.img),
            position: v.position,
            signature_base: v.signature_base,
          };
        } else {
          return {
            id: v?.id ? v?.id : "",
            signature_id: "",
            signature_img: this.img(v.img),
            position: v.position,
            signature_base: v.signature_base,
          };
        }
      });
      _ele.sort(this.sortData);
      let _eles = _ele.map((v, i) => {
        v.position.zindex = 500 + i;
        return v;
      });
      // console.log(_ele);
      this.$store.state.edittext.eles = _ele;
      // console.log(this.$store.state.edittext);
    },
    submit() {
      this.editState = false;
      this.edta = true;
      this.saveeleid();
      // console.log(this.content);
      sessionStorage.setItem("content", this.content);
      this.$store.commit("getContent", this.content);
    },
    //点击立即审核按钮修改
    getDoc() {},
    // 查看详情
    // goLookDetail(a, doc) {
    //   this.document_arr = doc;
    //   //   this.getDegreeName()
    //   //   this.getUrgen()
    //   this.show = true;
    //   this.set_view_document_data();
    // },
    goLookConetent() {
      //   this.getDegreeName()
      //   this.getUrgen()
      // this.show = !this.show;
      // if (this.show == true) {
      //   this.yulan = "返回详情页面";
      // } else {
      //   this.yulan = "预览公文";
      // }
      set_vuex_data(this.type);
      this.set_view_document_data();
      this.$router.push({
        path: "/viewDocument",
      });
    },
    //调整预览的数据格式
    set_view_document_data() {
      let fls = JSON.parse(JSON.stringify(this.fields_data));
      fls.word_no.value =
        this.iss.value.length > 0 ? this.iss.value[0].word_no : "";
      // 字号
      // console.log(fls);
      // console.log(this.datas);
      this.datas.fields = fls;
      this.datas.process = this.red_templete_content
        ? {
            content: this.red_templete_content,
          }
        : undefined;
      this.datas.content = this.content;
    },
    //获取全部字号
    async get_document_wordno_manager() {
      let { data } = await document_wordno_manager({
        type: this.$route.query.type,
      });
      this.all_word_no = data;
    },
    //在线编辑
    goDetail() {
      this.$router.push({
        path: "/editor",
        query: {
          content: 11,
        },
      });
    },
    addClass(e) {
      this.actives = e;
    },
    //根据id获取详细信息
    async getDocumentInfo(a) {
      let _this = this;
      let _cut = "";
      if (sessionStorage.getItem("page")) {
        let _page = JSON.parse(sessionStorage.getItem("page"));
        _cut = _page.type == "cy" ? 1 : _page.type == "cs" ? 4 : "";
      }
      let res =
        a == 1
          ? await documentInfo({ id: this.fid, cut: _cut })
          : await getDistributeDetail({ id: this.distributeId });
      // console.log(res);
      let _data = a == 1 ? res.data : res.data.data;
      if (res.code == 1) {
        //预览需要的数据
        this.radio_data = {
          urgent_level: _data.urgen_level,
          secret_level: _data.degree,
        };
        this.can_approval = _data.auth.can_approval;
        this.is_show = _data.auth.is_show;
        //给公文详情赋值
        this.did = _data.distribute_id;
        this.temId = _data.templete_id;
        this.create_time = _data.create_time;
        this.userid = _data.userid;
        this.where_id = _data.where_id;
        this.fields = _data.fields; //公文字段
        this.degree = _data.degree; //密级程度
        this.urgen_level = _data.urgen_level; //紧急程度
        this.remark = _data?.remark ? _data.remark : ""; // 退回理由
        this.ff_id = _data?.ff_id ? _data.ff_id : ""; //分发记录id
        // console.log('ff_id111111', this.ff_id)
        this.red_templete_content = _data?.red_templete_content
          ? _data.red_templete_content
          : "";
        // console.log(this.red_templete_content);

        //按钮权限信息
        this.$store.commit(
          "getButton",
          a == 1 ? _data.button : res.data.button
        );
        sessionStorage.setItem(
          "button",
          JSON.stringify(a == 1 ? _data.button : res.data.button)
        );
        this.button = a == 1 ? _data.button : res.data.button;
        // console.log("this.$$store.state.button", this.$store.state.button);
        //发文标题内容
        this.$store.commit("getDocument", this.document_arr);
        sessionStorage.setItem(
          "document_arr",
          JSON.stringify(this.document_arr)
        );
        // console.log("_data.status", _data.status);
        this.is_fast = _data.is_fast; //紧急程度
        // let _word_no_id = _data._word_no_id; // 字号
        // let _process_list = _data.process_list; // 字号列表
        this.role = _data.userid == this.userInfo.userid ? "self" : "auditor";
        // 可编辑的数据
        if (loc) {
          // 签章回显
          this.ele.item = [];
          this.ele.zhiqian = [];
          _data.signature.forEach((e, i) => {
            // this.ele.item = [];
            // this.ele.zhiqian = [];
            if (e.handle == 1 && res.data.auth.can_approval == 1)
              this.ele.item.push(e);
            else this.ele.zhiqian.push(e);
          });
          _data.fields.forEach((item, index) => {
            if (item.is_system == 0) {
              this.addList.push(item);
            }
            this.document_arr[item.e_name] = item.value;
          });
          // 数据回显的时候会用到
          _data.fields.forEach((v, i) => {
            let _key = v.e_name;
            _this.$set(v, "values", "");
            _this.$set(v, "value_id", "");

            v.is_d =
              _data.auth.can_approval == 1 || _data.status == 20 ? false : true; // 显示输入框
            v.is_c =
              _data.auth.can_approval == 1 || _data.status == 20 ? false : true; //
            v.showpup =
              _data.auth.can_approval == 1 || _data.status == 20 ? false : true;
            // console.log(typeof v.value);
            if (v.e_name == "word_no") {
              v.showpup = true;
              if (_data.status == 20) {
                v.showpup = false;
              }
              v.value_id = _data.word_no_id;
              if (_data.word_no_id != null) {
                v.value = _data.word_name;
                _this.isss.id = _data.word_no_id;
                _this.isss.word_no = _data.word_no;
                _this.isss.name = _data.word_name;
                _this.isss.isshow = true;
              }
            }
            if (typeof v.value == "number") {
              v.value_id = v.value;
              if (v.e_name == "secret_level") {
                _this.degree.forEach((vv) => {
                  if (vv.id == v.value) {
                    v.value = vv.name;
                  }
                });
              }
              if (v.e_name == "urgent_level") {
                _this.urgen_level.forEach((vv) => {
                  if (vv.id == v.value) {
                    v.value = vv.name;
                  }
                });
              }
            }
            if (
              (v.value != null && typeof v.value == "object") ||
              (v.e_name == "received_delivery" && v.input_type_new != 1) ||
              (v.e_name == "issuer" && v.input_type_new != 1)
            ) {
              let _textq =
                v.input_type_new == 5
                  ? "ren"
                  : v.input_type_new == 6
                  ? "bm"
                  : v.input_type_new == 7
                  ? "dw"
                  : "";
              let _value = [];
              // console.log(v);
              if (v.e_name == "reviewer") {
                v.values = v.value.select.map((e) => {
                  return {
                    receiver_name: e.name,
                    title: e.name,
                    w_id: e.id,
                    type: 500,
                    id: e.id,
                    wid: e.wid,
                  };
                });
              } else if (
                v.e_name == "main_delivery" ||
                v.e_name == "receiving_unit"
              ) {
                v.values = v.value.select.map((e) => {
                  _value.push(_textq + e.id);
                  return {
                    doc_receiver: e.name,
                    id: e.id,
                    title: e.name,
                    w_id: _textq + e.id,
                    img: "",
                    onc: false,
                    type: 1,
                  };
                });
                v.value.inter &&
                  v.value.inter.forEach((el) => {
                    _value.push("hl" + el.id);
                    v.values.push({
                      doc_receiver: el.name,
                      id: el.id,
                      title: el.name,
                      w_id: "hl" + el.id,
                      img: "",
                      onc: false,
                      type: 1,
                    });
                  });
              } else {
                v.values = v.value.select.map((e) => {
                  _value.push(_textq + e.id);
                  return {
                    id: e.id,
                    title: e.name,
                    w_id: _textq + e.id,
                    img: "",
                    onc: false,
                    type: 1,
                  };
                });
              }
              // 判断有没有自己输入的东西
              if (v.value.text) {
                let a_s = v.value.text.split(",");
                a_s.forEach((e) => {
                  v.values.push({
                    w_id: "lw_" + new Date().getTime(),
                    title: e,
                    type: 100,
                  });
                });
              }
              v.value = _value;
            }
            if (
              (v.e_name == "received_delivery" && v.input_type_new == 1) ||
              (v.e_name == "issuer" && v.input_type_new == 1)
            ) {
              v.values = [];
              let a_s = v.value.split(",");
              a_s.forEach((e) => {
                v.values.push({
                  w_id: "lw_" + new Date().getTime(),
                  title: e,
                  type: 100,
                });
              });
              v.value = v.values;
            }
            _this.$set(_this.fields_data, _key, v);
          });
          this.files_all = _data.files_all;
          this.content = _data.content;
          //发文标题内容
          sessionStorage.setItem("content", _data.content);
          // this.$store.commit("getContent", _data.content);
          // 把附件数据存在vuex和session里面
          sessionStorage.setItem(
            "enclosure_file",
            JSON.stringify(_data.files_all.enclosure_file)
          );
          this.$store.commit("gercontentFile", _data.files_all.enclosure_file);
        }

        // console.log("dsadadsa", this.fields_data);
        this.status = _data.status ? _data.status : "";
        let current = {
          type: this.type,
          temId: this.temId,
          where_id: this.where_id,
          docId: this.fid,
          status: _data.status ? _data.status : "",
          is_fast: _data.is_fast,
          deptid: _data.dept_id,
          process_id: _data.process_id,
          red_templete_id: _data.red_templete,
        };

        //显示密级程度和紧急程度
        this.getDegreeName();
        this.getUrgen();
        //给公用按钮赋值
        if (this.lab && this.lab == 2) {
          //转收文时：，2--lab我接收的公文
          this.commomType = 11;
        } else {
          //拟稿时
          if (_data.status) {
            //状态 1、等待中 2、审核进行中 3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，9归档，10发布
            if (_data.status == 1 || _data.status == 2) {
              //审核中
              this.getApprovalInfo();
            } else if (_data.status == 3) {
              // commomType：1--提交审核时，2--提交后查看，3--审核时，4--审核后查看,5--审核完成后查看，6--归档查看，7--传阅查看，8--废弃查看，9--抄送查看，10.草稿箱查看，11--收文时，12--收文完成后，13--驳回后查看重新提交按钮
              this.commomType = 5;
            } else if (_data.status == 4) {
              //驳回
              this.commomType = 13;
            } else if (_data.status == 6) {
              this.commomType = 3;
            } else if (_data.status == 7) {
              this.commomType = 8;
            } else if (_data.status == 8) {
              this.commomType = 10;
            } else if (_data.status == 9) {
              this.commomType = 6;
            } else if (res.data.status == 20) {
              this.commomType = 14;
            }
          }
        }
      }
      this.set_auth_fun();
      this.showBtn = true;
    },
    //公文审核进行中获取当前节点审批信息
    getApprovalInfo() {
      let that = this;
      let datas = new URLSearchParams();
      datas.append("data_id", this.fid);
      datas.append("details", 2);
      getApprovalInfo(datas).then((res) => {
        // console.log(res);
        if (res) {
          if (res.code == 1) {
            let resData = res.data.current;
            this.handle = resData.handle;
            //是否是当前节点审核人
            if (
              resData.should_admin_ids &&
              resData.should_admin_ids.indexOf(that.userInfo.userid) != -1
            ) {
              if (
                resData.have_admin_ids &&
                resData.have_admin_ids.indexOf(that.userInfo.userid) != -1
              ) {
                //已经审核
                //已经审核有四种情况1.同意或者驳回 2.暂办,3.转审，4.会签时审核后该节点还未结束可撤回
                // commomType：1--提交审核时，2--提交后查看，3--审核时，4--审核后查看,5--审核完成后查看，6--归档查看，7--传阅查看，8--废弃查看，9--抄送查看，10.草稿箱查看，11--收文时，12--收文完成后
                resData.username.forEach((item, index) => {
                  if (item.userid == that.userInfo.userid) {
                    that.commomType =
                      item.status == 6 ? 3 : item.status == 8 ? 15 : 4;
                  }
                });
                if (res.other && res.other.revoke) {
                  //是否有权限撤销
                  this.revoke = res.other.revoke;
                }
                if (
                  resData.applicant &&
                  resData.applicant.userid == that.userInfo.userid
                ) {
                  this.role = "all";
                }
              } else {
                that.commomType = 3;
              }
            } else {
              //不是当前审核人有3种情况1.即是提交人又是上一节点审核人查看审核 2.上一节点审核人查看 3.提交人查看审核情况 7.审核人/传阅人查看
              // try {
              if (
                res.data.prv.have_admin_ids &&
                res.data.prv.have_admin_ids.indexOf(that.userInfo.userid) !=
                  -1 &&
                resData.applicant.userid == this.userInfo.userid &&
                resData.handle < 3
              ) {
                //1.即是提交人又是上一节点审核人查看审核
                this.role = "all";
                that.commomType = 4;
                if (res.other && res.other.revoke) {
                  //是否有权限撤销
                  this.revoke = res.other.revoke;
                }
              } else if (
                res.data.prv.have_admin_ids &&
                res.data.prv.have_admin_ids.indexOf(that.userInfo.userid) !=
                  -1 &&
                resData.handle < 3
              ) {
                //上一节点审核人查看
                this.role = "auditor";
                that.commomType = 4;
                if (res.other && res.other.revoke) {
                  //是否有权限撤销
                  this.revoke = res.other.revoke;
                }
              } else if (
                resData.applicant.userid == this.userInfo.userid &&
                resData.handle < 3
              ) {
                //提交人查看
                that.commomType = 2;
              } else {
                that.commomType = 7;
              }
              // } catch (err) {
              //   // console.log(err)
              // }
            }
          }
        }
      });
    },
    //密级
    getDegreeName() {
      let degree = this.degree;
      degree.forEach((item, index) => {
        if (this.document_arr.secret_level == item.id) {
          this.urgent_level_name = item.name;
        }
      });
    },
    //紧急
    getUrgen() {
      let urgen_level = this.urgen_level;
      urgen_level.forEach((item, index) => {
        if (this.document_arr.urgent_level == item.id) {
          this.secret_level_name = item.name;
        }
      });
    },
    // 流程信息
    getProcedureJournal() {
      let data = new URLSearchParams();
      data.append("data_id", this.fid);
      procedureJournal(data).then((res) => {
        if (res.code == 1) {
          this.topdata = res.data.topdata;
        }
      });
    },
    //流程日志journal
    getJournal() {
      let data = new URLSearchParams();
      data.append("data_id", this.fid);
      data.append("way", 2);
      procedureJournal(data).then((res) => {
        if (res.code == 1) {
          this.logList = res.data;
          // console.log("this.logList 日志", res);
        }
      });
    },
    //流程走向
    getrecordList() {
      let data = new URLSearchParams();
      data.append("data_id", this.fid);
      recordList(data).then((res) => {
        if (res.code == 1) {
          this.trendList = res.data;
        }
      });
    },
    // 设置token
    setToken(_token) {
      let _this = this;
      sessionStorage.setItem("token", _token);
      axios
        .get(`${url}/power_setting_menu`, {
          headers: {
            token: _token,
          },
        })
        .then(function (response) {
          if (response.data.code == 1) {
            sessionStorage.setItem(
              "SET_AUTH",
              JSON.stringify(response.data.data)
            );
            _this.homeInitApi();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },
    // 设置用户信息
    homeInitApi() {
      let _this = this;
      let data = new URLSearchParams();
      memberDetail(data).then((res) => {
        if (res.code == 1) {
          _this.res = res.data;
          sessionStorage.setItem("userInfo", JSON.stringify(res.data)); //用户信息
          this.userinfo_is = true;
          _this.sheinit();
        }
      });
    },
    // 没带token的页面请求
    sheinit() {
      this.userinfo_is = true;
      this.get_document_wordno_manager();
      this.editState = false;
      if (this.$route.query.handleType && this.$route.query.handleType == 1) {
        this.isShowPage = 2;
      }
      this.lab = this.$route.query.lab;
      // let current = {
      //   type: this.type,
      //   temId: this.temId,
      //   where_id: this.where_id,
      //   docId: this.fid,
      //   status: this.status,
      //   is_fast: this.is_fast,
      //   can_approval: this.can_approval,
      // };
      // // console.log(current);
      // sessionStorage.setItem("currentDoc", JSON.stringify(current));
      window.onpopstate = () => {
        this.$toast.clear();
      };
      this.type = this.$route.query.type;
      this.fid = this.$route.query.fid;
      this.distributeId = this.$route.query.distributeId; //分发记录id
      this.lab = this.$route.query.lab; //1--我分发的文件，2--我接收的公文
      this.auth = this.$route.query.auth;
      if (this.lab && this.lab == 2) {
        // distributeBus.$emit("distributeId", this.distributeId);
        this.getDocumentInfo(2);
      } else {
        this.getDocumentInfo(1);
      }
      sessionStorage.setItem("content", "");
      this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      // console.log("sending", 123);
      // 加水印
      this.$setWatermark("box");
    },
    //下载公文
    // loadingFile() {
    //   this.show = true;
    //   this.getPdf("#print");
    //   // this.getPdf('#print')
    // },
    // 移动签章事件
    suSpendFun(item) {
      let _max = this.ele.item.reduce((a, b) => {
        return b.position.zindex > a?.position?.zindex ? b : a;
      });
      // console.log(_max.position.zindex);
      item.position.zindex = _max.position.zindex + 1;
    },
  },
  watch: {
    isShowPage: {
      deep: true,
      handler: function (val) {
        // console.log("isShowPage", this.title);
        if (val && val == 1) {
          document.title = this.title;
        } else if (val && val == 2) {
          document.title = "公文审核";
        }
      },
    },
    $route: {
      immediate: true,
      handler: function (to, from) {
        // console.log("val", to, from);
        if (from) {
          if (from.path == "/success") {
            this.$router.go(0);
          }
        }
      },
      // 深度观察监听
      deep: true,
    },
    active(n, o) {
      // console.log("dasgsdajkgllllllll", n, o);
      if (n == 3) {
        this.getJournal();
        this.getrecordList();
        this.getProcedureJournal();
      }
    },
  },
  //进入页面
  beforeRouteEnter(to, from, next) {
    if (
      !from.name ||
      from.name == "home" ||
      from.name == "filingBox" ||
      from.name == "dispatchBank" ||
      from.name == "agency" ||
      from.name == "prepareFile" ||
      from.name == "temporary" ||
      from.name == "success" ||
      from.name == "officialOut" ||
      from.name == "processed" ||
      from.name == "draft" ||
      from.name == "quick" ||
      from.name == "officialtep"
    ) {
      loc = true;
    } else {
      loc = false;
    }
    //判断是从哪个页面进入的
    if (from.name == "filingBox" && from.query.id == 2) {
      //‘’,归档箱1,抄送 2。传阅 3.废弃箱
      sessionStorage.setItem(
        "page",
        JSON.stringify({ path: "filingBox", type: "cy" })
      );
    } else if (from.name == "filingBox" && from.query.id == 1) {
      sessionStorage.setItem(
        "page",
        JSON.stringify({ path: "filingBox", type: "cs" })
      );
    } else if (from.name == "prepareFile") {
      sessionStorage.setItem(
        "page",
        JSON.stringify({ path: "prepareFile", type: "yfw" })
      );
    }
    let arrey = [
      "dispatchBank",
      "home",
      "filingBox",
      "agency",
      "prepareFile",
      "temporary",
      "success",
      "officialOut",
      "processed",
      "draft",
      "quick",
      "officialtep",
    ];
    next((vm) => {
      if (arrey.includes(from.name)) {
        vm.reload();
      }
    });
  },
  inject: ["reload"],
  //离开路由
  beforeRouteLeave(to, from, next) {
    sessionStorage.removeItem("page");
    next();
  },
  mounted() {},
  created() {
    // let _token = this.$route.query.token;
    // if (!!_token) {
    //   this.setToken(_token);
    // } else {
    //   if () {
    //     this.sheinit();
    //   }
    // }
  },
  activated() {
    let _token = this.$route.query.back_url;
    if (!!_token) {
      _token = _token.substr(0, _token.length - 1);
      this.setToken(atob(_token));
    } else {
      // if (loc) {
      this.sheinit();
      // }
    }
  },
  beforeMount() {
    let type = this.$route.query.type;
    if (type == 1) {
      document.title = "发文详情";
    } else if (type == 2) {
      document.title = "收文详情";
    } else if (type == 3) {
      document.title = "签报详情";
    } else {
      document.title = "公文详情";
    }
    this.title = document.title;
  },
};
</script>
<style lang="scss" scoped>
.viewDocuments {
  width: 793px;
  padding: 24px;
  .close-box {
    position: fixed;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    z-index: 500;
    .cross {
      font-size: 24px;
    }
  }
}
/deep/ .van-tab__text--ellipsis {
  font-size: 17px !important;
}
/deep/ .van-tabs__nav {
  background-color: #f7f8fa;
}
.box {
  .box-x {
    margin-bottom: 49px;
  }
  width: 100%;
  min-height: 100vh;
  background-color: white;
  position: relative;
  font-size: 14px;
  .lookwen {
    height: 48px;
    background: rgba(255, 255, 255, 1);
    border-top: 1px solid #e6e6e6;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    z-index: 21;
  }
}
.choiseBox {
  .infoTitle {
    padding: 10px 15px 0;
    height: 130px;
    background-color: #fff;

    .tit {
      display: flex;
      justify-content: space-between;
      height: 27px;
      line-height: 27px;
      font-size: 14px;
      margin-bottom: 5px;

      .van-icon {
        vertical-align: text-top;
        padding-right: 3px;
      }
    }
  }
}

.infoBox {
  position: relative;
  padding: 19px;
  font-size: 12px;
  margin-bottom: 60px;
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .big-title {
    border: 1px solid #ff0000;
    color: #ff0000;
    text-align: center;
    min-height: 44px;
    line-height: 44px;
  }
  .line {
    display: flex;
    align-items: center;
    border: 1px solid #ff0000;
    border-top: none;
    .head {
      text-align: center;
      width: 86px;
    }
    .body {
      padding-left: 20px;
      border-left: 1px solid #ff0000;
    }
  }
  .fir {
    .head {
      min-height: 44px;
      line-height: 44px;
    }
    .body {
      // width: 298px;
      min-height: 44px;
      line-height: 44px;
    }
  }
  .sec {
    width: 100%;
    .item {
      display: flex;
      align-items: center;
      // width: 50%;
      max-width: 188px;
      flex: 1;
      &:first-child {
        .body {
          border-right: 1px solid #ff0000;
        }
      }
      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 86px;
        min-height: 44px;
      }
      .body {
        padding-left: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 44px;
        flex: 1;
        border-left: 1px solid #ff0000;
      }
    }
  }
  .thr {
    display: flex;
    position: relative;
    overflow: hidden;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    .item {
      display: flex;
      flex: 1;
      max-width: 188px;
      height: 100%;
      &:first-child {
        .body {
          border-right: 1px solid #ff0000;
        }
      }
      .head {
        display: flex;
        justify-content: center;
        padding-top: 20px;
        width: 86px;
        min-height: 86px;
      }
      .body {
        flex: 1;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: 20px 0 0 0;
        min-height: 86px;
        // width: 104px;
      }
    }
  }
  .file-text {
    margin-top: 20px;
    .head {
      text-align: center;
      h3 {
        color: #fa5555;
        padding: 10px 0;
        font-size: 20px;
        font-weight: 600;
        border-bottom: 1px solid #f56c6c;
      }
    }
    .body {
      position: relative;
    }
    .body pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

.content-box {
  .content-div {
    position: relative;
    height: calc(100vh - 50px - 44px - 20px);
    padding: 10px 15px;
    overflow: auto;
    /deep/ * {
      max-width: 100vw;
      white-space: pre-wrap !important;
    }
  }
  .can_app {
    height: calc(100vh - 50px - 44px - 20px);
  }
  .no_data_can_app {
    height: calc(100vh - 50px - 44px - 20px - 94px);
  }
  .no_can_app {
    height: calc(100vh - 50px - 44px - 20px - 194px);
  }
  .content {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
}
// tab2

// 上下 左右 剧中
.flex-ac-jc {
  display: flex;
  align-items: center;
  justify-content: center;
}
.elesign-top {
  padding-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  height: 200px;
  overflow-y: auto;
  .elesign-top-box {
    width: 96px;
    height: 96px;
    margin: 20px 20px 0;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(230, 230, 230, 1);
    position: relative;
    img {
      max-width: 90px;
      max-height: 90px;
    }
    .close-icons {
      top: -10px;
      right: -10px;
      position: absolute;
      height: 20px;
      width: 20px;
      color: white;
      background-color: #e6e6e6;
      border-radius: 50%;
    }
  }
}
.btns {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: #303133;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
  z-index: 1;

  div {
    width: 100%;
    text-align: center;
  }

  .van-icon {
    vertical-align: text-bottom;
    padding-right: 5px;
  }
}

// 流程信息
.process {
  height: calc(100vh - 44px);

  .processStatus {
    padding: 19px 15px 0;

    display: flex;
    color: rgba(255, 255, 255, 1);

    div {
      width: 96px;
      height: 32px;
      line-height: 32px;
      background: #d8dfe6;
      opacity: 1;
      border-radius: 0px 16px 0px 0px;
      margin-right: 5px;
    }

    img:nth-child(1) {
      width: 14px;
      height: 13.5px;
      vertical-align: text-top;
      padding: 3px 0px 0 10px;
    }

    :nth-child(2) {
      img {
        width: 16px;
        height: 7px;
        vertical-align: middle;
        padding: 0px 0px 0 10px;
        padding-bottom: 3px;
      }
    }
  }
}

.addblur {
  background-color: #0082ef !important;
}

.lookEye {
  text-align: right;
  margin: 0 auto;
  height: 30px;
  line-height: 30px;
  margin-right: 15px;
  margin-top: 8px;

  .van-icon {
    vertical-align: text-top;
    padding-right: 3px;
  }
}

// .preview {
//   color: #66b5ff;
//   margin-left: 10px;
// }

.quill {
  height: 100vh;
  background-color: #fff;
  position: relative;
  .qui-ll {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    background-color: pink;
    z-index: 11;
  }
  .quill-top {
    height: calc(100% - 44px - 57px - 40px);
    overflow-y: auto;
    position: relative;
    top: 40px;
    .elesign-top {
      position: relative;
      // min-height: 100px;
      // background-color: violet;
      padding: 0 20px 20px;
      display: flex;
      flex-wrap: wrap;
      .elesign-top-box {
        width: 96px;
        height: 96px;
        margin: 20px 13px 0;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 230, 230, 1);
        position: relative;
        img {
          max-width: 90px;
          max-height: 90px;
        }
        .close-icons {
          top: -10px;
          right: -10px;
          position: absolute;
          height: 20px;
          width: 20px;
          color: white;
          background-color: #e6e6e6;
          border-radius: 50%;
        }
      }
    }
  }
  .quill-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

/deep/ .quill-editor {
  position: relative;
  left: 0;
  right: 0;
  .ql-toolbar {
    z-index: 1;
    border: none;
    background-color: #f4f5f6;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .ql-container {
    border: none;
  }
  .ql-editor {
    overflow-y: visible;
    min-height: calc(100vh - 57px - 44px - 43px);
    height: auto;
  }
}
.choise-box {
  margin-top: 10px;
}

// 退回理由
.rea-ret {
  box-sizing: border-box;
  height: calc(100vh - 44px);
  overflow-y: auto;
  word-wrap: break-word;
  padding: 20px;
}
</style>
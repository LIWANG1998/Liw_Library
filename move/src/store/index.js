import Vue from "vue";
import Vuex from "vuex";
import { state, mutations, actions, getters } from "./modules/app";
// import  {edittext,edittext_mutations} from "./modules/edittext";
import  edittext from "./modules/edittext";
import processNew from "./modules/process";
// import VueXAlong from "vuex-along";
// import createPersistedState from "vuex-persistedstate"
// import saveData from 'vue-savedata'
import {
  getsomePeople,
  setsomePeople,
  getsurePeople,
  setsurePeople,
} from "@/utils/auth";

function get_ss_open(){
  return sessionStorage.getItem("openpage")?JSON.parse(sessionStorage.getItem("openpage")):""
}

Vue.use(Vuex);
// let ses = sessionStorage.getItem("vuex");
// // console.log(ses)
const store = new Vuex.Store({
  // strict: true, //开启严格模式
  state:{
    openpage:get_ss_open() || "", //预览信息
    andriod_ios:false,
    overlay: false, //遮罩层
    // ----------------------
    button: "", // 审批按钮权限
    content: "", //正文内容
    enclosure_file: [], //附件
    document_arr: {}, //公文标题等可编辑内容
    red_templete_id: "", // 套红模板的id
    signature_ele: "", // 套红模板的id
    // process: {
    //   processType: 1,
    // }, //流程设置
    auth_notice: false, //显示无权限提示
    // edittext:{
    //   content: "", // 正文内容
    //   enclosure_file: [], // 附件内容
    //   document_arrs: {},
    //   document_arr: {},
    //   isss: { id: "", name: "", word_no: "", isshow: false }, // 字号
    //   iss: {
    //     numStatus: false,
    //     value: [],
    //   }, // 字号
    //   pel: {
    //     depUserss: false, //选人的弹框
    //     ckt: {
    //       zzjg: true, // 显示 组织架构
    //       bm: true, // 可以选部门
    //       ren: true, // 可以选人
    //       tag: true, // 显示 标签
    //       dw: true, // 显示 单位
    //       radio: false, // 是否为单选
    //     },
    //     result: [], // 打勾选中的
    //     results: [], // 打勾选中的所有信息
    //   },
    //    // 套红模版
    //   red: {
    //     showtf: false,
    //     value: [],
    //     is_default: 0, // 是不是常用
    //     type: 1,
    //   },
    //   // 预览时候的data
    //   datas: {
    //     fields: {},
    //     process: {},
    //     content: "",
    //   },
    //   // 电子签章
    //   ele: {
    //     type_ele: false, //电子签章弹窗
    //     item: [],
    //     zhiqian: [],
    //   },
    // }
    // ——————————————
  },
  mutations: {
    set_openpage:(state, openpage)=>{
      state.openpage = openpage;
      sessionStorage.setItem("openpage",JSON.stringify(openpage));
    },
    set_andriod_ios: (state, andriod_ios) => {
      state.andriod_ios = andriod_ios;
    },
    // ==========================
    getButton(state, button) {
      state.button = button;
    },
    getContent(state, content) {
      state.content = content;
    },
    gercontentFile(state, file) {
      state.enclosure_file = file;
    },
    getDocument(state, document_arr) {
      state.document_arr = document_arr;
    },
    getredtempleteid(state, red_templete_id) {
      state.red_templete_id = red_templete_id;
    },
    getsignature(state, signature_ele) {
      state.signature_ele = signature_ele;
    },
    // ---------------------
    set_somePeople: (state, somePeople) => {
      state.somePeople = somePeople;
      setsomePeople(somePeople);
    },
    set_surePeople: (state, surePeople) => {
      state.surePeople = surePeople;
      setsurePeople(surePeople);
    },
    // //设置流程
    // set_process(state, process) {
    //   state.process = process;
    // },
    set_red_templete_id(state, res) {
      state.red_templete_id = res;
    },
    //遮罩设置
    SET_OVERLAY(state, content) {
      state.overlay = content;
    },
    //显示无权限提示
    set_show_auth(state, show) {
      state.auth_notice = show;
    },
  },
  actions: {
  },
  modules: {
    edittext,
    processNew
  },
  // plugins: [createPersistedState({storage:window.sessionStorage})]
  // plugins: [
  //   VueXAlong({
  //     name: "along", //存放在localStroage或者sessionStroage 中的名字
  //     local: false, //是否存放在local中  false 不存放 如果存放按照下面session的配置配
  //     session: { list: [], isFilter: true }, //如果值不为false 那么可以传递对象 其中 当isFilter设置为true时， list 数组中的值就会被过滤调,这些值不会存放在seesion或者local中
  //   }),
  // ],
});
export default store;

import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
// import axios from 'axios'
import store from '../store'

// import setChildren from './children/set'
// import payChildren from './children/pay'
// import repairChildren from './children/repair'
// import complaintChildren from './children/complaint'
import { stringifyQuery, parseQuery } from "@/utils/query/query.js"; //路由加密
const home = () => import("views/home/home.vue"); //主页
const approval = () => import("views/approval/approval.vue"); //快速公关审批
const normalApproval = () => import("views/approval/normalApproval.vue"); //普通公关审批
const officialtep = () => import("views/officialtep/officialtep.vue"); //选择模板
const draft = () => import("views/draft/drafts.vue"); //发文
const agency = () => import("views/agency/agency.vue"); //待处理公文
const processed = () => import("views/processed/processed"); //待处理公文
const dispatchBank = () => import("views/dispatchManage/dispatchBank.vue"); //公文管理
const success = () => import("views/success/success.vue"); //提交成功
const sendingDetails = () => import("views/sendingDetails/sendingDetails.vue"); //发文详情
const distributeDetails = () =>
  import("views/sendingDetails/distributeDetails.vue"); //我接收的公文详情
const detail = () => import("views/sendingDetails/detail.vue"); //详情
const statusDetail = () => import("views/sendingDetails/statusDetail.vue"); //流程状态详情
const collect = () => import("views/approval/collect.vue"); //审核详情
const fileManage = () => import("views/fileManage/fileManage.vue"); //公文管理区
const fileExchange = () => import("views/fileManage/fileExchange.vue"); //公文管理区
const officialOut = () => import("views/fileManage/officialOut.vue"); //公文
const finishaduit = () => import("views/approval/finishaduit.vue"); //完成审核详情
const organization = () => import("views/organization"); //组织架构
const personchoose = () => import("views/organization/choose"); //技术人员选择
const fatherindex = () => import("views/organization/fatherindex"); //组织架构父级首页
// const selectednum = () => import('views/organization/selectednum') //已选人数
const edit = () => import("views/draft/edit.vue"); //组织架构
const filingBox = () => import("views/fileManage/filingBox.vue"); //归档箱
const contact = () => import("views/home/footerFun/contact"); //联系客户
const optimization = () => import("views/home/footerFun/optimization"); //意见反馈
const setToken = () => import("views/setToken/setToken"); //获取token
const statistics = () => import("views/statistics/statistics"); //数据统计
const signature = () => import("views/signature/signature"); //电子签章
const temporary = () => import("views/temporary/temporary"); //草稿箱
const quick = () => import("views/quick/quick"); //草稿箱
const addSignature = () => import("views/signature/addSignature"); //添加签章
const prepareFile = () => import("views/prepareFile"); //预发文
const operations = () => import("@/components/operations"); //预发文
const lookred = () => import("views/redpage/lookred"); // 查看桃红模板
const selectpage = () => import("views/selectpage/selectpage"); //预发文

const editor = () => import("views/editor/editor"); //编辑正文
const choicenum = () => import("views/choicenum/choicenum"); //选择字号
const redtemplete = () => import("views/redtemplete/redtemplete"); //选择套红模板
const viewDocument = () => import("views/viewDocument/viewDocument"); //预览公文
const checkelesign = () => import("views/signature/checkelesign"); //选择电子签章
const selcheck = () => import("views/selectpage/selcheck"); //查看已近勾选的人员
const setnum = () => import("views/choicenum/setnum"); // 修改字号
const updataReply = () => import("@/components/common/updataReply"); //新增编辑跨界回复
const setProcess = () => import("@/components/common/setProcess"); //设置流程
const turnAudit = () => import("@/components/common/turnAudit"); //转审
const nextAuditor = () => import("@/components/common/nextAuditor"); //下一审批节点
const openpage = () => import("views/viewDocument/openpage"); //


Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/setToken",
  },
  {
    name: "home",
    path: "/home",
    component: home,
    meta: {
      title: "名冠天下公文管理系统",
    },
  },
  {
    name: "setToken",
    path: "/setToken",
    component: setToken,
    meta: {
      title: "名冠天下公文管理系统",
    },
  },
  //待处理公文
  {
    name: "agency",
    path: "/agency",
    component: agency,
    meta: {
      title: "待处理公文",
    },
  },
  //待处理公文
  {
    name: "processed",
    path: "/processed",
    component: processed,
    meta: {
      title: "待处理公文",
    },
  },
  //公文管理
  {
    name: "dispatchBank",
    path: "/dispatchBank/:type",
    component: dispatchBank,
    meta: {
      title: "公文库",
    },
  },
  //快速公关审批
  {
    name: "approval",
    path: "/approval",
    component: approval,
    meta: {
      title: "公文提交",
    },
  },
  //普通公文审批
  // {
  //   name: "normalApproval",
  //   path: "/normalApproval",
  //   component: normalApproval,
  //   meta: {
  //     title: "公文审核",
  //   },
  // },
  //公关审批详情
  {
    name: "collect",
    path: "/collect/:type",
    component: collect,
    meta: {
      title: "公文审批",
    },
  },
  //完成公关审批详情
  {
    name: "finishaduit",
    path: "/finishaduit/:type",
    component: finishaduit,
    meta: {
      title: "公文审批",
    },
  },
  //公文模板officialtep
  {
    name: "officialtep",
    path: "/officialtep",
    component: officialtep,
    meta: {
      title: "公文模板",
    },
  },
  // 发文拟稿
  {
    name: "draft",
    path: "/draft",
    component: draft,
    meta: {
      title: "发文拟稿",
      keepAlive: false, //该字段表示该页面需要缓存
      isBack: false, //用于判断上一个页面是哪个
    },
  },
  //提交发文
  {
    name: "success",
    path: "/success",
    component: success,
    meta: {
      title: "提交成功",
    },
  },
  //发文详情
  {
    name: "sendingDetails",
    path: "/sendingDetails",
    component: sendingDetails,
    meta: {
      title: "详情",
    },
  },
  //传阅分发对象
  {
    name: "givePerson",
    path: "/givePerson",
    component: () =>
      import("../views/sendingDetails/components/givePerson.vue"),
    meta: {
      title: "传阅分发对象",
    },
  },
  //我接收的公文详情
  {
    name: "distributeDetails",
    path: "/distributeDetails",
    component: distributeDetails,
    meta: {
      title: "公文详情",
    },
  },
  {
    name: "detail",
    path: "/detail",
    component: detail,
    meta: {
      title: "详情",
    },
  },
  // 流程状态详情
  {
    name: "statusDetail",
    path: "/statusDetail",
    component: statusDetail,
    meta: {
      title: "详情",
    },
  },
  // 组织架构
  {
    name: "organization",
    path: "/organization",
    component: fatherindex,
    // meta: {
    //     title: "人员选择"
    // },
    redirect: "/organization/list",
    children: [
      {
        path: "/organization/list",
        name: "list",
        component: organization,
        meta: {
          title: "人员选择",
        },
      }, //人员选择
      {
        name: "personchoose",
        path: "/personchoose",
        component: personchoose,
        meta: {
          title: "人员选择",
        },
      },
    ],
  },

  //已选人数
  // {
  //     name: 'selectednum',
  //     path: '/selectednum',
  //     component: selectednum,
  //     meta: {
  //         title: "人员选择"
  //     },
  // },
  // 公文管理区
  {
    name: "fileManage",
    path: "/fileManage",
    component: fileManage,
    meta: {
      title: "公文管理区",
    },
  },
  //公文交换fileExchange
  {
    name: "fileExchange",
    path: "/fileExchange",
    component: fileExchange,
    meta: {
      title: "公文分发",
    },
  },
  //公文分发
  {
    name: "officialOut",
    path: "/officialOut",
    component: officialOut,
    meta: {
      title: "分发列表",
    },
  },
  {
    name: "edit",
    path: "/edit",
    component: edit,
    meta: {
      title: "编辑",
    },
  },
  {
    name: "filingBox",
    path: "/filingBox",
    component: filingBox,
    meta: {
      title: "归档箱",
    },
  },
  {
    name: "contact",
    path: "/contact",
    component: contact,
    meta: {
      title: "联系客户",
    },
  },
  {
    name: "optimization",
    path: "/optimization",
    component: optimization,
    meta: {
      title: "意见反馈",
    },
  },
  //数据统计
  {
    name: "statistics",
    path: "/statistics",
    component: statistics,
    meta: {
      title: "数据统计",
    },
  },
  //电子签章
  {
    name: "signature",
    path: "/signature",
    component: signature,
    meta: {
      title: "电子签章",
    },
  },
  //电子设置
  {
    name: "sealdetails",
    path: "/sealdetails",
    component: () => import("../views/signature/sealDetails.vue"),
    meta: {
      title: "新增签章",
    },
  },
  {
    name: "temporary",
    path: "/temporary",
    component: temporary,
    meta: {
      title: "草稿箱",
    },
  },
  {
    name: "quick",
    path: "/quick",
    component: quick,
    meta: {
      title: "快速发文",
      keepAlive: false, //该字段表示该页面需要缓存
      isBack: false, //用于判断上一个页面是哪个
    },
  },
  {
    name: "addSignature",
    path: "/addSignature",
    component: addSignature,
    meta: {
      title: "添加印章",
    },
  },
  {
    name: "prepareFile",
    path: "/prepareFile",
    component: prepareFile,
    meta: {
      title: "预发文",
    },
  },
  {
    name: "operations",
    path: "/operations",
    component: operations,
    meta: {
      title: "无可见范围",
    },
  },
  {
    name: "selectpage",
    path: "/selectpage",
    component: selectpage,
    meta: {
      title: "人员选择",
    },
  },
  {
    name: "lookred",
    path: "/lookred",
    component: lookred,
    meta: {
      title: "套红模板",
    },
  },
  {
    name: "editor",
    path: "/editor",
    component: editor,
    meta: {
      title: "编辑正文",
    },
  },
  {
    name: "choicenum",
    path: "/choicenum",
    component: choicenum,
    meta: {
      title: "选择字号",
    },
  },
  {
    name: "redtemplete",
    path: "/redtemplete",
    component: redtemplete,
    meta: {
      title: "选择套红模版",
    },
  },
  {
    name: "viewDocument",
    path: "/viewDocument",
    component: viewDocument,
    meta: {
      title: "预览公文",
    },
  },
  {
    name: "checkelesign",
    path: "/checkelesign",
    component: checkelesign,
    meta: {
      title: "预览公文",
    },
  },
  {
    name: "setnum",
    path: "/setnum",
    component: setnum,
    meta: {
      title: "编辑字号",
    },
  },
  {
    name: "updataReply",
    path: "/updataReply",
    component: updataReply,
    meta: {
      title: "快捷回复",
    },
  },
  {
    name: "setProcess",
    path: "/setProcess",
    component: setProcess,
    meta: {
      title: "设置流程",
    },
    children: [
      {
        path: '/user',
        name: 'user',
        component: home,
      }
    ]
  },
  {
    name: "turnAudit",
    path: "/turnAudit",
    component: turnAudit,
    meta: {
      title: "转审",
    },
  },
  {
    name: "nextAuditor",
    path: "/nextAuditor",
    component: nextAuditor,
    meta: {
      title: "下一审批节点",
    },
  },
  {
    name: "selcheck",
    path: "/selcheck",
    component: selcheck,
    meta: {
      title: "查看人员",
    },
  },
  {
    name: "openpage",
    path: "/openpage",
    component: openpage,
    meta: {
      title: "公文详情",
    },
  },
];



const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  scrollBehavior (to,from,saveTop){
    if(saveTop){
      return saveTop
    }
    else{
      return { x: 0, y: 0 }
    }
  },
  // stringifyQuery: stringifyQuery,//路由参数加密
  // parseQuery: parseQuery,//路由参数加密
  routes,
});
router.afterEach((to, from, next) =>{
  window.scrollTo(0,0);
  // chrome
    document.body.scrollTop = 0
    document.body.scrollTo(0,0)
    // firefox
    document.documentElement.scrollTop = 0
    // safari
    window.pageYOffset = 0
})
// 改变缩放效果
let metaEl = document.querySelector("#viewportMeta");
// 全局路由守卫
router.beforeEach((to, from, next) => {
  let list=["home","officialtep","dispatchBank","agency","prepareFile","temporary","filingBox","success",'processed',"signature"];
  if(list.includes(to.name)){
    store.commit("edittextinit")
  }

  if(to.name=="viewDocument"){
    let a = metaEl.content.replace('no','yes');
    metaEl.setAttribute("content",a);
    // console.log(metaEl.content);
  }
  else{
    let a = metaEl.content.replace('yes','no');
    metaEl.setAttribute("content",a);
    // console.log(metaEl.content);
  }

  let lists=["draft","quick","sendingDetails"];
  if(lists.includes(to.name) && lists.includes(from.name)){
    store.commit("edittextinit")
  }
  if(list.includes(to.name)){
    sessionStorage.setItem('flash',0)//是否刷新提交审核页面
    sessionStorage.removeItem('caogao_process')
    sessionStorage.removeItem('button')
    store.commit("processinit")
  }
  next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
})
export default router;

const processNew = {
  state: {
    process:{//设置真实流程信息
      checked:{
        processType: 1,//流程设置页流程类型1.不需要审核流程 2.指定下一节点 3.选择流程
        collect: 1,
        id: 0,
        line: 1,
        name: "",
        num:"",
      },//选中流程信息
      processType:'1',//approval页面流程类型
      checkedAuditor:[],//选择流程后审核人
      checkedCopy:[],//抄送人
      processNUm: {
        approver_type: 2,//1.会签，2.或签
        results: [],//下一节点审批人
      },//拟稿时快速发文approval指定下一节点审批人信息
      edit_approval:0,//是否可修改流程里的审核人
      edit_cclist:0,//是否允许申请修改抄送人
    },
    process_updata:{//设置流程临时数据
      checked:{
        processType: 1,//流程设置页流程类型1.不需要审核流程 2.指定下一节点 3.选择流程
        collect: 1,
        id: 0,
        line: 1,
        name: "",
        num:"",
      },//选中流程信息
      popupChecked:{
        processType: 1,//流程设置页流程类型1.不需要审核流程 2.指定下一节点 3.选择流程
        collect: 1,
        id: 0,
        line: 1,
        name: "",
        num:"",
      },//更多流程选中值
      processType:1,//approval页面流程类型
      nodeList:[],//选择流程后审核人
      updataAuditor:[],//选中审批流程后修改审批人临时值
      approval_copy:[],//选择流程后抄送人
      auditType: "2",//1.会签，2.或签
      auditorList: [],//下一节点审批人
      edit_approval: 2,//是否可修改流程里的审核人1代表允许，2代表不允许
      edit_cclist:2,//是否允许申请修改抄送人1代表允许，2代表不允许
    },
    deptid: '',//拟稿人部门id
    depsName:'',//拟稿人部门名称
    handles: {//拟稿时审核信息
      opinion: "", //处理意见
      files: [], //审核附件
      // way: "", //通知方式 1待办 2邮箱 3短消息
      // notice: "", //是否通知 1不通知 2 通知
      process_urgent_level: "1", //紧急程度 1普通 2紧急 3加急
      where_id: "0", //	审批流程 新增发文时传入0
    },
    dTime: "", //天
    tTime: "", //时
    sTime: "", //分
    way:[1,4],//1待办 2邮箱 3短消息 4企业微信
    type:0,//0快速发文，1正常发文
    turnUser: {
        results:[],
        result:[],
        files:[]
    },//转审
    next:{},//临时储存下一节点审批人
    zs:{},
    cy:{},
    ff:{},
    cs:{},
    flash:1,//0.不刷新设置流程页面
      nextPeo: {//审核时指定下一节点
          auditorType: "2",
          result: [],
          results: []
      },
      app_files:[],
    submitType:0,//传阅，分发，呈送时预览页面是否确定,0取消，1确定
      index:'',//设置流程时添加审核人下标
      flagApp:1,//0不刷新流程页面
  },
  actions: {},
  mutations: {
    //流程设置
    setProcess(state, process) {
      state.process = process;
    },
    //设置转审
    setTurnUser(state, turnUser) {
      state.turnUser = turnUser
    },
    // 初始化数据
    processinit(state) {
      state.process = {
        checked: {
          processType: 1,//流程设置页流程类型1.不需要审核流程 2.指定下一节点 3.选择流程
          collect: 1,
          id: 0,
          line: 1,
          name: "",
          num: "",
        },//选中流程信息
        processType: 1,//approval页面流程类型
        checkedAuditor: [],//选择流程后审核人
        checkedCopy: [],//选择流程后抄送人
        processNUm: {
          approver_type: '2',//1.会签，2.或签
          results: [],//下一节点审批人
        },//拟稿时快速发文approval指定下一节点审批人信息
        edit_approval:2,//是否可修改流程里的审核人
        edit_cclist:2,//是否允许申请修改抄送人
      },
          state.process_updata = {
            checked:{
              processType: 1,//流程设置页流程类型1.不需要审核流程 2.指定下一节点 3.选择流程
              collect: 1,
              id: 0,
              line: 1,
              name: "",
              num:"",
            },//选中流程信息
            popupChecked:{
              processType: 1,//流程设置页流程类型1.不需要审核流程 2.指定下一节点 3.选择流程
              collect: 1,
              id: "",
              line: 1,
              name: "",
              num:"",
            },//更多流程选中值
            processType:1,//approval页面流程类型
            nodeList:[],//选择流程后审核人
            updataAuditor:[],//选中审批流程后修改审批人临时值
            approval_copy:[],//选择流程后抄送人
            auditType: "2",//1.会签，2.或签
            auditorList: [],//下一节点审批人
            edit_approval:2,//是否可修改流程里的审核人
            edit_cclist:2,//是否允许申请修改抄送人
          },
          state.deptid = '',//拟稿人部门id
          state.depsName = '',//拟稿人部门名称
          state.handles = {
            opinion: "", //处理意见
            files: [], //审核附件
            // way: "", //通知方式 1待办 2邮箱 3短消息
            // notice: "", //是否通知 1不通知 2 通知
            process_urgent_level: "1", //紧急程度 1普通 2紧急 3加急
            where_id: "0", //	审批流程 新增发文时传入0
          }
          state.dTime = '',
          state.tTime = '',
          state.sTime = '',
          state.way = [1.4],
          state.type = '',
          state.turnUser = {//转审
                  results:[],
                  result:[],
                  files:[]
          },
          state.next = {},
          state.zs = {},
          state.cy = {},
          state.ff = {},
          state.cs = {},
          state.flash = 1,
          state.nextPeo = {
              auditorType: "2",
              result: [],
              results: []
          },
          state.app_files = []
          state.submitType = 0
          state.index = ''
        state.flagApp = 1
    },
  },
  getters: {},
};
export default processNew;

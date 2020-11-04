// export const edittext={
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
// };
// export const edittext_mutations= {
//   //正文内容
//   setContent(state, content) {
//     state.edittext.content = content;
//   },
//   // 添加附件
//   setEnclosure_file(state, content) {
//     state.edittext.enclosure_file = content;
//   },
//   // 设置公文字段
//   setdocument_arrs(state, content) {
//     state.edittext.document_arrs = content;
//   },
//    // 设置公文字段
//    setdocument_arr_one(state, content) {
//     state.edittext.document_arrs[content.key] = content.data;
//   },
//   // 初始化数据
//   edittextinit(state){
//     state.edittext.content="";
//     state.edittext.enclosure_file=[];
//     state.edittext.document_arrs={};
//     state.isss={ id: "", name: "", word_no: "", isshow: false }; // 字号
//     state.iss={
//       numStatus: false,
//       value: [],
//     };// 字号
//     state.pel={
//       depUserss: false, //选人的弹框
//       ckt: {
//         zzjg: true, // 显示 组织架构
//         bm: true, // 可以选部门
//         ren: true, // 可以选人
//         tag: true, // 显示 标签
//         dw: true, // 显示 单位
//         radio: false, // 是否为单选
//       },
//       result: [], // 打勾选中的
//       results: [], // 打勾选中的所有信息
//     };
//     state.red={
//       showtf: false,
//       value: [],
//       is_default: 0, // 是不是常用
//       type: 1,
//     };
//     state.datas={
//       fields: {},
//       process: {},
//       content: "",
//     };
//     state.ele={
//       type_ele: false, //电子签章弹窗
//       item: [],
//       zhiqian: [],
//     };
//   }
// };

const edittext = {
  state: {
    fujian: false, // 是否可以上传附件
    uptrue: false, // 是否可以上传正文
    uptrues: false, // 是否可以编辑正文
    content: "", // 正文内容
    fields:[],
    enclosure_file: [], // 附件内容
    document_arrs: {},
    document_arr: {},
    isss: { id: "", name: "", word_no: "", isshow: false }, // 字号
    iss: {
      numStatus: false,
      value: [],
    }, // 字号
    pel: {
      depUserss: false, //选人的弹框
      ckt: {
        zzjg: true, // 显示 组织架构
        bm: true, // 可以选部门
        ren: true, // 可以选人
        tag: true, // 显示 标签
        dw: true, // 显示 单位
        radio: false, // 是否为单选
      },
      result: [], // 打勾选中的
      results: [], // 打勾选中的所有信息
    },
     // 套红模版
    red: {
      showtf: false,
      value: [],
      is_default: 0, // 是不是常用
      type: 1,
    },
    // 预览时候的data
    datas: {
      fields: {},
      process: {},
      content: "",
    },
    // 电子签章
    ele: {
      type_ele: false, //电子签章弹窗
      item: [],
      zhiqian: [],
    },
    eles:[], // 提交的时候需要的签章
  },
  actions: {},
  mutations: {
    //正文内容
    setContent(state, content) {
      state.content = content;
    },
    // 添加附件
    setEnclosure_file(state, content) {
      state.enclosure_file = content;
    },
    // 设置公文字段
    setdocument_arr(state, content) {
      state.document_arr = content;
    },
    // 设置公文字段
    setdocument_arrs(state, content) {
      state.document_arrs = content;
    },
     // 设置公文字段
     setdocument_arr_one(state, content) {
      state.document_arrs[content.key] = content.data;
    },
    // 初始化数据
    edittextinit(state){
      state.content="";
      state.enclosure_file=[];
      state.isss={ id: "", name: "", word_no: "", isshow: false }; // 字号
      state.document_arrs= {},
      state.fields=[];
      state.fujian= false; // 是否可以上传附件
      state.uptrue= false; // 是否可以上传正文
      state.uptrues= false; // 是否可以编辑正文
      state.iss={
        numStatus: false,
        value: [],
      };// 字号
      state.pel={
        depUserss: false, //选人的弹框
        ckt: {
          zzjg: true, // 显示 组织架构
          bm: true, // 可以选部门
          ren: true, // 可以选人
          tag: true, // 显示 标签
          dw: true, // 显示 单位
          radio: false, // 是否为单选
        },
        result: [], // 打勾选中的
        results: [], // 打勾选中的所有信息
      };
      state.red={
        showtf: false,
        value: [],
        is_default: 0, // 是不是常用
        type: 1,
      };
      state.datas={
        fields: {},
        process: {},
        content: "",
      };
      state.ele={
        type_ele: false, //电子签章弹窗
        item: [],
        zhiqian: [],
      };
    }
  },
  getters: {},
};
export default edittext;

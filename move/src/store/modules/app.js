export const state = {

    userInfo: {},//用户信息
    role: '',
    url: '',
    token: '',
    urgentLevel: '',
    way: '',
    approval_file: [],//审批附件
    doc_content: '',//公文内容
    enclosure_file: '',//公文附件
    auth: [],//权限设置
    result: [],//人员选的数组
    process:{},



}
export const actions = {
    setUserInfo({ commit }, platform) {
        commit('SET_USER_INFO', platform);
    },
}
export const mutations = {
    // ————————————————————————————————————————
    //正文内容
    getContent(state, content) {
        state.content = content
    },
    //正文附件
    gercontentFile(state, file) {
        state.content_file = file
    },
    //公文签发人拟稿人标题等公文字段
    getDocument(state, document_arr) {
        state.document_arr = document_arr
    },
    //_____________________________________________
    SET_USER_INFO(state, platform) {
        state.userInfo = platform;
    },
    SET_AUTH(state, auth) {
        state.auth = auth;


    },
    getToken(state, token) {
        state.token = token
    },
    getUrl(state, url) {
        state.url = url
    },

    getProcess_urgent_level(state, urgentLevel) {
        state.urgentLevel = urgentLevel
    },
    getWay(state, way) {
        state.way = way
    },
    getApproval_file(state, approval_file) {
        state.approval_file = approval_file
    },

    //公文内容
    getDocContent(state, doc_content) {
        state.doc_content = doc_content
    },
    //    发文附件
    getEnclosureFile(state, enclosure_file) {
        state.enclosure_file = enclosure_file
    },
    setResult(state, result) {
        state.state = result
    },
    //设置流程
    setProcess(state, process){
        state.process = process
    }
}
export const getters = {

    getUserInfo: (state) => state.userInfo,
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
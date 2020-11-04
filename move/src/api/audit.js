import server from "../utils/requests";
//发文收文提交审核
export function submitApproval(data) {
  return server.request({
    url: "/submitApproval",
    method: "post",
    data,
  });
}
//获取发文/收文/签报列表
export function getDocumentList(data) {
  return server.request({
    url: "document_library",
    method: "post",
    data,
  });
}
//删除草稿箱
export function deleteFileManage(data) {
  return server.request({
    url: "/file_manager_delete",
    method: "post",
    data,
  });
}
//获取归档废弃箱列表
export function getFileManagerList(data) {
  return server.request({
    url: "file_manager_list",
    method: "post",
    data,
  });
}
//获取传阅抄送列表
export function getCirculationList(data) {
  return server.request({
    url: "circulation_list",
    method: "post",
    data,
  });
}
//************************审核流程api*******************************//
////
//获取当前节点审批人姓名，部门
export function getApprovalInfo(data) {
  return server.request({
    url: "get_approval_info",
    method: "GET",
    params: data,
  });
}
//获取流程走向流程日志接口
export function getRecordList(data) {
  return server.request({
    url: "/recordList",
    method: "GET",
    params: data,
  });
}
//获取审批意见附件列表
export function getApprovalOpinion(data) {
  return server.request({
    url: "/approval_opinion",
    method: "POST",
    data,
  });
}
//催办approval_urge
export function subApprovalUrge(data) {
  return server.request({
    url: "/approval_urge",
    method: "POST",
    data,
  });
}
//查看传阅意见
export function getRemarkList(data) {
  return server.request({
    url: "/circulation_remark_list",
    method: "POST",
    data,
  });
}
//提交传阅意见
export function submitCirculationComment(data) {
  return server.request({
    url: "/circulation_comment",
    method: "POST",
    data,
  });
}
//审批处理
export function submitApprovalHandle(data) {
  return server.request({
    url: "/approval_handle",
    method: "POST",
    data,
  });
}
//修改状态（报废、草稿、归档）
export function changeDocumentStatus(data) {
  return server.request({
    url: "/document_status",
    method: "POST",
    data,
  });
}
//传阅抄送

export function submitFileCirculation(data) {
  return server.request({
    url: "/file_manager_circulation",
    method: "POST",
    data,
  });
}
//分发
export function submitDocumentDistribute(data) {
  return server.request({
    url: "/document_distribute",
    method: "POST",
    data,
  });
}
//删除
export function delDocument(data) {
  return server.request({
    url: "/document_del_document",
    method: "POST",
    data,
  });
}
//我的收文详情
export function getDistributeDetail(data) {
  return server.request({
    url: "/distribute_file_detail",
    method: "POST",
    data,
  });
}
//撤回
export function submitApprovalRevoke(data) {
  return server.request({
    url: "/approval_revoke",
    method: "POST",
    data,
  });
}
//
export function getMyTemplate(data) {
  return server.request({
    url: "/approval_my_template",
    method: "POST",
    data,
  });
}
//获取全部字号
export function document_wordno_manager(data) {
  return server.request({
    url: "/document_wordno_manager",
    method: "POST",
    data,
  });
}
//转审
export function approval_my_shift(data) {
  return server.request({
    url: "/approval_my_shift",
    method: "POST",
    data,
  });
}

//呈送
export function submitForwardSend(data) {
  return server.request({
    url: "/document_forward_Send",
    method: "POST",
    data,
  });
}
//发布
export function submitRelease(data) {
  return server.request({
    url: "/document_release",
    method: "POST",
    data,
  });
}

// 退回
export function distribute_return(data) {
  return server.request({
    url: "/distribute_return",
    method: "POST",
    data,
  });
}
// 缺省页返回超级管理
export function getuserMange(data) {
  return server.request({
    url: "/get_user_manage",
    method: "POST",
    data,
  });
}

// 设置为常用流程模版
export function approval_collection(data) {
  return server.request({
    url: "/approval_collection",
    method: "POST",
    data,
  });
}


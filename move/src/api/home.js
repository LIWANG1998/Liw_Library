import server from "../utils/requests";
//首页初始化
export function login(data) {
  return server.request({
    method: "post",
    url: "/structure/Login/do_login",
    data,
  });
}
export function memberDetail(data) {
  return server.request({
    method: "post",
    url: "/member_detail",
    data,
  });
}
export function templeteList(data) {
  //获取公文模板
  return server.request({
    url: "/templete_select",
    method: "post",
    data,
  });
}
export function documentAdd(data) {
  //公文拟稿
  return server.request({
    url: "/document_add",
    method: "post",
    data,
  });
}
export function documentType(data) {
  //发文分类管理（全部）
  return server.request({
    url: "/document_library",
    method: "post",
    data,
  });
}
export function distribute(data) {
  //公文分发和接收列表
  return server.request({
    url: "/distribute_mine",
    method: "post",
    data,
  });
}
export function documentInfo(data) {
  //公文详情
  return server.request({
    url: "/document_information",
    method: "post",
    data,
  });
}
export function qiniuToken(data) {
  //获取七牛token
  return server.request({
    url: "/qiniu_token",
    method: "get",
    data,
  });
}
export function bug(data) {
  //Bug反馈
  return server.request({
    url: "/document_bug_feedback",
    method: "post",
    data,
  });
}
export function temInfo(data) {
  //获取模板详情
  return server.request({
    url: "/templete_information",
    method: "post",
    data,
  });
}
export function syncOrgan(data) {
  //同步组织架构
  return server.request({
    url: "/sync_organizational_structure",
    method: "get",
    data,
  });
}
export function getDeptList(data) {
  //获取部门和成员
  return server.request({
    url: "/get_dept_and_members",
    method: "post",
    data,
  });
}
export function getTagsList(data) {
  //获取标签以及下级部门d
  return server.request({
    url: "/get_tags_and_members",
    method: "post",
    data,
  });
}
export function documentNext(data) {
  //新增公文获取即将流向的节点
  return server.request({
    url: "/document_next_approval",
    method: "post",
    data,
  });
}
export function approvalBefore(data) {
  //发文的即将流向
  return server.request({
    url: "/approval_before_process",
    method: "post",
    data,
  });
}
export function templateDownload(data) {
  //发文附件下载
  return server.request({
    url: "/red_template_download",
    method: "get",
    data,
  });
}

export function procedureJournal(data) {
  //流程处理和流程日志
  return server.request({
    url: "/procedure_journal",
    method: "post",
    data,
  });
}
export function approvalHandle(data) {
  //审批处理接口
  return server.request({
    url: "/approval_handle",
    method: "post",
    data,
  });
}
export function readFile(data) {
  //获取正文的文字
  return server.request({
    url: "/document_read_file",
    method: "post",
    data,
  });
}
export function recordList(data) {
  //流程走向和日志接口
  return server.request({
    url: "/recordList",
    method: "post",
    data,
  });
}
export function approvalUrge(data) {
  //催办
  return server.request({
    url: "/approval_urge",
    method: "post",
    data,
  });
}
export function documentRecord(data) {
  //比较差异
  return server.request({
    url: "/document_record_log",
    method: "post",
    data,
  });
}
export function getWord(data) {
  //获取文档内容
  return server.request({
    url: "/get_word",
    method: "post",
    data,
  });
}
export function msgCount(data) {
  //消息提醒数量
  return server.request({
    url: "/document_waitme_list",
    method: "post",
    data,
  });
}
export function documentList(data) {
  //消息提醒数量
  return server.request({
    url: "/document_waitme_list",
    method: "post",
    data,
  });
}
export function documentAuth(data) {
  //权限设置
  return server.request({
    url: "/document_auth",
    method: "get",
    data,
  });
}
//获取待办待阅公文
export function wait_document(data) {
  //权限设置
  return server.request({
    url: "/wait_document",
    method: "POST",
    data,
  });
}
// 快速发文--------------------------------------
export function getDocWordManager(data) {
  //编号列表
  return server.request({
    url: "/document_wordno_manager",
    method: "post",
    data,
  });
}
export function delDocmentWord(data) {
  //删除编号
  return server.request({
    url: "/document_wordno_del",
    method: "post",
    data,
  });
}
export function secretTypeList(data) {
  //密级列表
  return server.request({
    url: "/secret_type_list",
    method: "post",
    data,
  });
}
export function urgentTypeList(data) {
  //密级列表
  return server.request({
    url: "/urgent_type_list",
    method: "post",
    data,
  });
}
export function redTemplateList(data) {
  //套红模板列表
  return server.request({
    url: "/red_template_list",
    method: "post",
    data,
  });
}
//设置为常用套红模板
export function red_set_commonly(data) {
  return server.request({
    url: "/red_set_commonly",
    method: "post",
    data,
  });
}
//设置为常用字号模板
export function document_wordno_setcomm(data) {
  return server.request({
    url: "/document_wordno_setcomm",
    method: "post",
    data,
  });
}
// 快速发文--------------------------------------
export function ele_check(data) {
  //签章
  return server.request({
    url: "/ele_check",
    method: "post",
    data,
  });
}

export function getEleIndex(data) {
  //签章
  return server.request({
    url: "/ele_index",
    method: "post",
    data,
  });
}
export function ele_me_list(data) {
  //签章2
  return server.request({
    url: "/ele_me_list",
    method: "post",
    data,
  });
}
export function delEleIndex(data) {
  //删除签章
  return server.request({
    url: "/ele_delete",
    method: "post",
    data,
  });
}
export function addEle(data) {
  //新增签章
  return server.request({
    url: "/ele_add",
    method: "post",
    data,
  });
}
export function ele_update(data) {
  //更新签章
  return server.request({
    url: "/ele_update",
    method: "post",
    data,
  });
}
export function ele_detail(data) {
  //签章详情
  return server.request({
    url: "/ele_detail",
    method: "post",
    data,
  });
}
export function getListCompant(data) {
  // 获取收发文
  return server.request({
    url: "/list_company",
    method: "post",
    data,
  });
}
export function documentAddFast(data) {
  //快速发文
  return server.request({
    url: "/document_add_fast",
    method: "post",
    data,
  });
}
export function document_waitme_list(data) {
  //快速发文
  return server.request({
    url: "/document_waitme_list",
    method: "post",
    data,
  });
}
export function index_wait_read(data) {
  //快速发文
  return server.request({
    url: "/index_wait_read",
    method: "post",
    data,
  });
}

// 获取水印
export function get_watermark(data) {
  return server({
    url: "get_watermark",
    method: "post",
    data,
  });
}

// 下载文件
export function file_manager_download(data) {
  return server({
    url: "get_watermark",
    method: "post",
    data,
  });
}

// 修改字号
export function check_word_wo_re(data) {
  return server.request({
    url: "/check_word_wo_re",
    method: "POST",
    data,
  });
}

// 删除公文中的签章记录
export function del_signature_record(data) {
  return server.request({
    url: "/del_signature_record",
    method: "POST",
    data,
  });
}

// 待我审核的和待别人审核的
export function document_wait_approval_list(data) {
  return server.request({
    url: "/document_wait_approval_list",
    method: "POST",
    data,
  });
}

// 待我审核的和待别人审核的
export function red_template_one(data) {
  return server.request({
    url: "/red_template_one",
    method: "POST",
    data,
  });
}

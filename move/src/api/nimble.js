import server from "../utils/requests";
//新增快捷回复
export function addNimble(data) {
    return server.request({
        url: '/approval_nimble_add',
        method: 'post',
        data
    })
}
//获取快捷回复列表
export function getNimbleList(data) {
    return server.request({
        url: '/approval_get_nimble',
        method: 'post',
        data
    })
}
//获取快捷回复列表
export function delNimbleList(data) {
    return server.request({
        url: '/approval_nimble_delete',
        method: 'post',
        data
    })
}
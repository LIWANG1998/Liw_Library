import server from "../utils/requests.js";

export function getRole(data) {// 获取角色信息
    return server.request({
        url: '/document_role_index',
        method: 'post',
        data
    })
}
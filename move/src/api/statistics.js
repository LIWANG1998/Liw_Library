import server from "../utils/requests.js";

//行为统计
export function file_count(data) {
    return server.request({
        url: '/file_count',
        method: 'post',
        data
    })
}
//获取传阅分发列表
export function circulation_somebady(data) {// 获取角色信息
    return server.request({
        url: '/circulation_somebady',
        method: 'post',
        data
    })
}
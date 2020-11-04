import server from "../utils/requests.js";

//获取草稿
export function document_library(data) {
    return server.request({
        url: '/document_library',
        method: 'post',
        data
    })
}


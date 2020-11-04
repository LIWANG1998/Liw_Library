import server from "../utils/requests";

export function organization(data) {// 组织架构，多个用户id以字符串发送，获取用户信息
    return server.request({
        url: '/get_users_by_userids',
        method: 'post',
        data
    })
}

export function organSetRoles(data) {// 组织架构，多个用户id以字符串发送，获取用户信息
    return server.request({
        url: '/document_user_set_roles',
        method: 'post',
        data
    })
}

export function addRoles(data) {// 组织架构，多个用户id以字符串发送，获取用户信息
    return server.request({
        url: '/get_organizational_data',
        method: 'post',
        data
    })
}


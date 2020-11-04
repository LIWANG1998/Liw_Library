// 互联单位接口
import server from "@/utils/request";

// 互联单位列表
export function inter_list(data) {
    return server({
        url: "interconnection_list",
        method: "post",
        data,
    })
}

// 取消关联
export function unbind_comapny(data) {
    return server({
        url: "unbind_comapny",
        method: "post",
        data,
    })
}

// 关联
export function check_code(data) {
    return server({
        url: "check_code",
        method: "post",
        data,
    })
}

// 获取密钥
export function get_secret(params) {
    return server({
        url: "get_myself_secret",
        method: "get",
        params,
    })
}

// 获取默认接收人
export function receiver_user(params) {
    return server({
        url: "receiver_user",
        method: "get",
        params,
    })
}

// 设置默认接收人
export function set_receiver(data) {
    return server({
        url: "set_receiver",
        method: "post",
        data,
    })
}
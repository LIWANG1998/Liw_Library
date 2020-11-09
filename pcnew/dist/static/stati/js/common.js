var userInfo = sessionStorage.getItem("userInfo");
var host = JSON.parse(userInfo).host || "";
// var host = "http://192.168.8.37:9090";
var common = {
    baseUrl: host + '/api',
    loginUrl: sessionStorage.getItem("loginUrl")
};

//post请求
function postAjax(url, data, callback, scope) {
    $.ajax({
        type: "post",
        url: common.baseUrl + url,
        dataType: 'json',
        data: data, //$.extend(data, {isAjax: 1}), get params post data
        timeout: 30000, // 30秒超时
        success: function (result, textStatus) {
            // console.log(result);
            if (result.code == 401) {
                // window.location.href = result.data;
            } else {
                callback.call(scope, result);
            }
        },
        error: function (result) {
            // console.log(result);
            if (result.status === (500 || 504)) {
                index.msgDialog(2, '请求错误，请稍后再试！')
            } else if (result.status === 405) {
                index.msgDialog(2, '很抱歉，您还没有权限哦')
            }
        }
    });
}
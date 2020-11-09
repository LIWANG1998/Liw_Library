import { message } from 'ant-design-vue';
/**
 *企业微信jsdk调用
 */

export function isWxWork() {
    const ua = window.navigator.userAgent.toLowerCase();
    if( (ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork') ){
        return true;
    } else {
        return false;
    }

}
/**
* 发起群聊
* @param {config} 配置信息
* @param {agent_config} 企业微信配置
*/
export function wxConfig({ config, agent_config }) {
    if(isWxWork())
    wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: false,
        appId: config.corpid, // 必填，企业微信的corpID
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.noncestr, // 必填，生成签名的随机串
        signature: config.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: [
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareWechat",
            "openUserProfile",
            "openEnterpriseChat"
        ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    });
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                "onMenuShareAppMessage",
                "onMenuShareTimeline",
                "onMenuShareWechat",
                "openUserProfile",
                "openEnterpriseChat"
            ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
                console.log(res);
            },
        });
        if (agent_config) {
            wx.agentConfig({
                corpid: agent_config.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
                agentid: agent_config.agent_id, // 必填，企业微信的应用id （e.g. 1000247）
                timestamp: agent_config.timestamp, // 必填，生成签名的时间戳
                nonceStr: agent_config.noncestr, // 必填，生成签名的随机串
                signature: agent_config.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
                jsApiList: ["openUserProfile","openEnterpriseChat"], //必填
                success: function (res) {
                    console.log("agent", res);
                },
            });
        }

    })
}

/**
 * 发起群聊
 * @param {group_member} 群成员
 * @param {group_name} 群名称
 */
export function createGroup({ group_member, group_name }) {
    if(isWxWork())
    wx.ready(function () {
        wx.openEnterpriseChat({
            // 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
            userIds: group_member, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
            externalUserIds:"",
            groupName: group_name, // 必填，会话名称。单聊时该参数传入空字符串""即可。
            success: function (res) {
                // 回调
                console.log(res);
            },
            fail: function (res) {
                if (res.errMsg.indexOf("function not exist") > -1) {
                    message.error({
                        maxCount: 1,
                        content: "版本过低请升级"
                    });
                }
            },
        });
    });
}

/**
 * 打开个人信息
 * @param {userid} 成员
 */
export function openUserInfo(userid) {
    if(isWxWork())
    wx.ready(function () {
        let userId = userid;
        if (userId) {
            let user = userId;
            wx.invoke(
                "openUserProfile",
                {
                    type: 1, //1表示该userid是企业成员，2表示该userid是外部联系人
                    userid: user //可以是企业成员，也可以是外部联系人
                },
                function (res) {
                    if (res.err_msg != "openUserProfile:ok") {
                        message.error({
                            maxCount: 1,
                            content: "该成员不是当前企业成员"
                        });
                    }
                }
            );
        }
    });
}
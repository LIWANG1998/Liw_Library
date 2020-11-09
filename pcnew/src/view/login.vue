<template>
    <div id="main">
        <!-- logo -->
        <div class="logo">
            <div class="left-logo">
                <img src="@/assets/images/login/logo.png" alt/>
                <div class="logo-text">名冠天下轻松任务系统</div>
            </div>
        </div>
        <!-- 右侧背景图 -->
        <div class="right-background"></div>
        <!-- 左下背景图 -->
        <div class="left-bottom"></div>
        <!-- 右下背景图 -->
        <div class="right-bottom"></div>
        <!-- 登录页面 -->
        <div class="login">
            <!-- 左侧内容 -->
            <div class="login-left-content">
                <!-- 图标 -->
                <div class="left-icon">
                    <img src="@/assets/images/login/logo3.png" alt width="71" height="85"/>
                </div>
                <div>名冠天下轻松任务系统</div>
                <!-- 左边图片 -->
                <div>
                    <img src="@/assets/images/login/login1.png" alt width="270" height="265"/>
                </div>
            </div>
            <!-- 右侧登录表单 -->
            <div class="login-right-content">
                <!-- 账号密码登录 -->
                <div v-show="visible">
                    <h1 style="margin-bottom: 36px">账号登录</h1>
                    <a-form-model ref="form" :model="form" :rules="rules" v-bind="layout">
                        <a-form-model-item prop="account">
                            <div class="input-title">账号</div>
                            <a-input
                                    v-model="form.account"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入您的用户名"
                                    @keyup.enter="submitForm('form')"
                            />
                        </a-form-model-item>
                        <a-form-model-item prop="password">
                            <div class="input-title">密码</div>
                            <a-input
                                    v-model="form.password"
                                    type="password"
                                    autocomplete="off"
                                    placeholder="请输入您的密码"
                                    @keyup.enter="submitForm('form')"
                            />
                        </a-form-model-item>
                        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                            <a-button class="submit" type="primary" @click="submitForm('form')" :loading="loading">登录
                            </a-button>
                        </a-form-model-item>
                    </a-form-model>
                    <!-- 企业微信扫码登录 -->
                    <div class="login-way" @click="changeLoginWay">
            <span>
              <img src="@/assets/images/login/wx.png" alt width="17" height="14"/>
              企业微信扫码登录
            </span>
                        <div class="line"></div>
                    </div>
                </div>
                <!-- 扫码 -->
                <div class="login-code" v-show="!visible">
                    <img src="@/assets/images/login/wx2.png" alt="" style="width: 103px">
                    <!-- 二维码 -->
                    <div class="code-img" id="wx_reg">
                        <div style="margin-top: 30px">
                            <img src="@/assets/images/login/qrcode.png" style="width: 240px;margin-bottom: 20px">
                            <div class="txt">扫码登陆前，请先选择登录企业</div>
                        </div>
                        <button type="button" class="select-company" @click="checkCompany">
                            选择登录企业
                        </button>
                    </div>
                    <!-- 切换账号密码登录 -->
                    <div @click="changeLoginWay" class="login-way">
                        <span>账号密码登录</span>
                        <div class="line"></div>
                    </div>
                </div>
            </div>
        </div>
        <a-modal v-model="companyListShow" title="选择登录企业" centered footer="">
            <div class="company-content">
                <div class="search" style="width: 50%">
                    <a-input-search placeholder="请输入企业名称" enter-button="查询" v-model="searchVal"
                                    @search="getCompany(searchVal)">
                        <a-tooltip slot="suffix" title="搜索">
                            <a-icon type="search" style="font-size:14px;color: #C0C4CC;"/>
                        </a-tooltip>
                    </a-input-search>
                </div>
                <ul class="company-list" v-if="companyArr.length > 0">
                    <li class="company-item" v-for="(item,index) in  companyArr" :key="index"
                        :class="{active:index === companyIndex}" @click="companyIndex = index">
                        <span>{{item.corp_name}}</span>
                        <a-icon type="check" class="check-icon" v-show="companyIndex === index"/>
                    </li>
                </ul>
                <div class="no-data" v-else>
                    <img src="../assets/images/nodata.png" alt="暂无数据" class="no-data-img">
                </div>
                <div style="text-align:center">
                    <a-button type="primary" @click="sureCompany"> 确定</a-button>
                </div>
            </div>
        </a-modal>

        <!-- 页脚 -->
        <footer>
            <p>企业微信服务专家: 名冠天下 客服电话:4000282880</p>
        </footer>

    </div>
</template>
<script>
    import {common} from "@/api";
    import md5 from 'js-md5';

    export default {
        name: 'login',
        data() {
            return {
                form: {
                    account: '',
                    password: '',
                },
                rules: {
                    account: [
                        {required: true, message: '请输入您的账号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入您的密码', trigger: 'blur'},
                    ],
                },
                layout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 14},
                },
                // 登录页面切换
                visible: true,
                imgSrc: ``,
                companyListShow: false,//登陆企业面板
                companyArr: [],//登陆企业数组
                companyIndex:null,//选择的登陆企业下标
                searchVal:'',
                loading: false,//加载
            }
        },
        created(){
            this.$loading.hide()
        },
        methods: {
            //密码登录方法
            async loginIn() {
                this.loading = true;
                const {code, msg} = await common.loginIn({
                    username: this.form.account,
                    password: md5(this.form.password)
                });
                if (code) {
                    this.$message.success(msg + '即将跳转到首页...', 2);
                    setTimeout(() => {
                        this.loading = false;
                        this.$router.push('/home');
                    }, 2000);
                } else {
                    this.$message.error(msg);
                    this.loading = false;
                }
            },
            //密码登录校验
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        //实现登录逻辑
                        this.loginIn();
                    } else {
                        return false
                    }
                })
            },
            // 切换二维码或者账号密码登录
            changeLoginWay() {
                this.visible = !this.visible
            },
            //选择登陆企业
            checkCompany() {
                this.companyListShow = !this.companyListShow;
                this.getCompany();
            },
            //获取公司
            async getCompany(name) {
                const {code, data, msg} = await common.getCompany({corp_name: name});
                if (code) {
                  this.companyArr = [].concat(data);
                } else {
                    this.$message.error(msg,2);
                }
            },
            //确定选择企业
            sureCompany(){
                this.companyListShow = false;
                let id = this.companyIndex !== null ? this.companyArr[this.companyIndex].corpid : null;
                this.getWxLoginCode(id)
            },
            //获取企业微信登陆二维码
            async getWxLoginCode(id) {
                const {code, data, msg} = await common.getLoginErCode({corpid: id});
                if (code) {
                    let goto_url = encodeURIComponent('http://103.204.75.17/wwopen/sso/qrConnect?appid=' + data[
                            'corpid'] + '&agentid=' + data['app_id'] + '&redirect_uri=' + location
                            .protocol +
                        "//" + location.host + '/structure/login/wx_login&state=web_login@gyoss9');
                    let obj = window.WwLogin({
                        "id": "wx_reg",
                        "appid": data.corpid,
                        "agentid": data['app_id'],
                        "redirect_uri": location.protocol + "//" + location.host +
                            "/structure/login/wx_login?corpid=" + data[
                                'corpid'],
                        "state": "",
                        "href": "",
                    });
                    console.log(obj);
                    console.log(goto_url)
                } else {
                    this.$message.error(msg,2);
                }
            },
        },
    }
</script>

<style lang="less" scoped>
    body,
    html {
        height: 100%;
    }

    #main {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 100vh;
        min-width: 1280px;
        min-height: 750px;
        background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 1) 0%,
                rgba(248, 248, 248, 1) 100%
        );

        .logo {
            display: flex;
            width: 100%;
            padding: 24px 40px;
            justify-content: space-between;

            .left-logo {
                display: flex;
                align-items: center;

                img {
                    width: 130px;
                    height: 29px;
                    margin-right: 14px;
                    cursor: pointer;
                }

                .logo-text {
                    height: 22px;
                    padding-left: 8px;
                    font-size: 16px;
                    font-weight: 400;
                    color: #0078ef;
                    border-left: 1px solid #b2b2b2;
                }
            }
        }

        .right-background {
            position: absolute;
            top: 0;
            right: 0;
            width: 800px;
            height: 400px;
            background-image: url('../assets/images/login/bg3.png');
            background-position: 254px -500px;
            background-repeat: no-repeat;
            background-size: cover;
        }

        .left-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 470px;
            height: 760px;
            background-image: url('../assets/images/login/bg1.png');
            background-position: -300px 50px;
            background-repeat: no-repeat;
            background-size: cover;
        }

        .right-bottom {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 527px;
            height: 630px;
            background-image: url('../assets/images/login/bg2.png');
            background-position: 50px 50px;
            background-repeat: no-repeat;
            background-size: cover;
        }

        .login {
            position: absolute;
            top: 50%;
            left: 50%;
            display: flex;
            width: 800px;
            height: 450px;
            overflow: hidden;
            border-radius: 10px;
            transform: translate(-50%, -50%);
            box-shadow: 0px 0px 10px rgba(0, 130, 239, 0.1);

            .login-left-content {
                display: flex;
                width: 343px;
                height: 100%;
                padding: 0px 40px;
                color: #fff;
                background: #008bff;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .left-icon {
                    margin-top: 58px;
                    margin-bottom: 14px;
                }
            }

            .login-right-content {
                position: relative;
                display: flex;
                width: 457px;
                height: 100%;
                padding: 40px 0px 10px;
                background: #fff;
                flex-direction: column;
                align-items: center;

                h1 {
                    width: 100%;
                    font-size: 24px;
                    font-weight: bold;
                    line-height: 1em;
                    text-align: center;
                }

                .ant-input {
                    width: 265px;
                    height: 40px;
                    padding: 0px;
                    border: none;
                    border-bottom: 1px solid #b2b2b2;
                    border-radius: 0px;
                }

                .ant-input:focus {
                    box-shadow: none;
                }

                /deep/ .ant-row.ant-form-item {
                    margin-bottom: 20px;
                }

                .input-title {
                    line-height: 20px;
                }

                .input-area {
                    width: 125px;
                }

                .code {
                    position: absolute;
                    right: -140px;
                    bottom: -10px;
                    width: 134px;
                    height: 41px;
                    background: #fff;
                }

                .scan-code {
                    position: absolute;
                    bottom: 22px;
                    width: 265px;
                    width: 260px;
                    margin-left: 2px;

                    .code-bor-left {
                        display: inline-block;
                        width: 54px;
                        height: 0px;
                        border: 1px solid #b2b2b2;
                    }
                }

                .login-way {
                    text-align: center;
                    position: absolute;
                    bottom: 20px;
                    width: 260px;
                    margin: 0 auto;
                    line-height: 20px;
                    cursor: pointer;

                    span {
                        padding: 0 10px;
                        background: #fff;
                        position: relative;
                        z-index: 2;
                    }

                    .line {
                        content: ' ';
                        position: absolute;
                        height: 1px;
                        width: 100%;
                        background: #b2b2b2;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                        z-index: 1;
                    }
                }

                .submit {
                    width: 265px;
                    height: 40px;
                    margin-left: -46px;
                }

                // 微信扫码
                .login-code {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    flex-direction: column;
                    align-items: center;

                    .code-logo {
                        margin-bottom: 20px;
                    }

                    .code-img {
                        height: 330px;
                        overflow: hidden;
                    }
                }

                .center {
                    text-align: center;
                }
            }
        }

        #wx_reg {
            .txt {
                position: absolute;
                color: #303133;
                z-index: 2;
                font-size: 16px;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                height: 30px;
                line-height: 30px;
                width: 90%;
            }

            .select-company {
                margin-top: 20px;
                width: 132px;
                margin-left: 65px;
                height: 32px;
                background: #1989FA;
                opacity: 1;
                border-radius: 3px;
                color: #fff;
                font-size: 14px;
                border: none;
                outline: none;
                cursor: pointer;
            }
        }

        #wx_reg > div {
            position: relative;
            border: 1px solid #707070;
            height: 240px;
            width: 240px;
            z-index: 1;
            overflow: hidden;
        }

        #wx_reg > div:before {
            position: absolute;
            background-color: white;
            opacity: 0.94;
            content: " ";
            width: 100%;
            height: 100%;
            top: 0;
            right: 0;

        }


        footer {
            position: absolute;
            bottom: 40px;
            text-align: center;
            width: 100%;
            color: #B3B3B3;
        }
    }

    .company-list {
        max-height: 492px;
        min-height: 250px;
        overflow-y: auto;
        margin-top: 20px;
        display: flex;
        padding-left: 0;

        .company-item {
            list-style: none;
            width: 48%;
            margin-right: 2%;
            height: 60px;
            opacity: 1;
            border-radius: 2px;
            background: #E6E6E6;
            color: #303133;
            position: relative;
            text-align: center;
            box-sizing: border-box;
            padding: 10px 32px;

            .check-icon {
                font-size: 14px;
                position: absolute;
                top: 5px;
                right: 5px;
            }

            span {
                display: flex;
                height: 100%;
                width: 100%;
                text-align: center;
                vertical-align: middle;
                align-items: center;
                justify-content: center;
            }
        }

        .company-item:nth-child(2n) {
            margin-right: 0;
        }

        .active {
            background: #0082EF;
            color: #fff;
        }
    }


    /deep/ .status.status_browser.js_status {
        display: none;
    }

    /deep/ .ant-row.ant-form-item {
        height: 90px;
        margin-bottom: 0px !important;
    }
</style>

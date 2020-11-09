<template>
    <div class="home-frame">
        <div class="home-frame-left" :style="{width:collapsed ? '50px' : '200px'}">
            <div class="logo-box">
                <span class="logo-name" v-if="!collapsed">{{showLogoName.name}}</span>
                <img :src="showLogoName.logo" v-else/>
            </div>
            <MenuList :collapsed="collapsed" :role="userInfo.is_system" :can-add="userInfo.is_initiate"></MenuList>
        </div>
        <div class="home-frame-right"
             :style="{width:collapsed ? 'calc(100% - 50px)' : 'calc(100% - 200px)',left:collapsed ? '51px' : '201px'}">
            <!--            头部-->
            <div class="home-frame-right-top">
                <div>
                    <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="collapsed = !collapsed"
                            :title="collapsed ? '展开菜单' : '收起菜单'"/>
                    <span v-show="!welcomeShow">欢迎进入<b>{{showLogoName.name}}</b>轻松任务管理系统</span>
                </div>
                <ul style="position: relative">
                    <li>
                        <img src="../assets/images/url.png" alt="">
                        <span @click="copyUrl">复制链接</span>
                    </li>
                    <li v-if="parseInt(userInfo.is_system) ==4" >
                    <a-icon type="setting"/>
                    <span @click="setLogoClick">设置logo</span>
                </li>
                    <li>
                        <a-dropdown>
                            <div>
                                <span class="line"></span>
                                <img :src="userInfo.avatar ? userInfo.avatar : require('../assets/images/userDefault.png')"
                                     alt="" class="user-avatar">
                                <span>{{userInfo.name}}</span>
                            </div>
                            <a-menu slot="overlay" placement="bottomRight">
                                <a-menu-item class="menuItem">
                                    <div>
                                        <a-icon type="sound"/>
                                        <span @click="noticeClick">消息通知</span>
                                    </div>
                                </a-menu-item>
                                <a-menu-item class="menuItem">
                                    <div>
                                        <a-icon type="customer-service"/>
                                        <span @click="serviceWindow = true">联系客服</span>
                                    </div>
                                </a-menu-item>
                                <a-menu-item class="menuItem">
                                    <div>
                                        <a-icon type="user"/>
                                        <span @click="aboutUs">关于我们</span>
                                    </div>
                                </a-menu-item>
                                <a-menu-item class="menuItem">
                                    <div>
                                        <!--                                        <img src="../assets/images/login-out.png" alt="">-->
                                        <a-icon type="export"/>
                                        <span @click="exitLogin">退出登录</span>
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </li>
                </ul>
            </div>
            <!--            面包屑-->
            <div class="top-nav">
                <div class="back">
                    <a-icon type="left" @click="$router.go(-1)" title="后退"/>
                    <a-icon type="right" @click="$router.go(1)" title="前进"/>
                </div>
                <div class=" nav-tabs">
                    <ul>
                        <li v-for="(v,i) in routesArr" :key="i"
                            :class="(v.path==currentRoute && v.isNow )? 'active' : ''">
                            <router-link :to="v.path">
                                {{v.breadcrumbName}}
                            </router-link>
                            <a-icon type="close-circle" theme="filled" v-show="v.isNow && v.path !== '/homePage'"
                                    @click="closeBreadcrumb(i)"/>
                        </li>
                    </ul>
                </div>
                <div class="close-all" @click="closeAll">
                    关闭全部
                </div>
            </div>
            <div class="home-content">
                <div class="home-content-view">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <!--联系客服弹窗-->
        <a-modal v-model="serviceWindow" title="联系客服" :footer="null" width="300px" :centered="true">
            <img src="../assets/images/erCode.jpg" alt="客服二维码" style="width: 200px;margin-left: 30px">
        </a-modal>
        <!--设置logo弹窗-->
        <a-modal v-model="logoWindow" title="设置Logo" :centered="true" @ok="setLogo">
            <div class="form-set">
                <!--          logo尺寸建议200*200-->
                <div class="form-set-item clear-f">
                    <div class="left required">logo</div>
                    <div class="right">
                        <div class="upload">
                            <a-upload
                                    name="file"
                                    list-type="picture-card"
                                    class="avatar-uploader"
                                    :show-upload-list="false"
                                    :action="qiNiuUrl"
                                    :before-upload="beforeUpload"
                                    :data="{token: qNParams.token,key: qNParams.key,}"
                                    @change="uploadLogo"
                            >
                                <img v-if="logoUrl" :src="logoUrl" alt="avatar"/>
                                <div v-else>
                                    <img class="layui-upload-img" id="img" src="../assets/images/uploadLogo.png">
                                </div>
                            </a-upload>
                        </div>
                    </div>
                </div>
                <div class="form-set-item clear-fix">
                    <div class="left required">名称</div>
                    <div class="right">
                        <a-input placeholder="请输入企业名称（限制6个字内）" v-model="companyName" :maxLength="6"/>
                    </div>
                </div>
            </div>
        </a-modal>
        <!--         <div>-->
        <!--             <div class="cutImg clear-fix">-->
        <!--                 <div class="cut-img-box">-->
        <!--                     <img id="cutImg" src="" alt="">-->
        <!--                 </div>-->
        <!--                 <div class="cut-show-img">-->
        <!--                     <p>预览</p>-->
        <!--                     <p>-->
        <!--                         <img src="" alt="" id="showCutImg">-->
        <!--                     </p>-->
        <!--                 </div>-->
        <!--             </div>-->
        <!--         </div>-->
        <!--消息通知弹窗-->
        <a-modal style="top: 10px;" v-model="noticeModel" title="消息通知" :footer="null" width="600px" :centered="true">
            <a-list :data-source="noticeList" :split="false" v-if="noticeList.length > 0">
                <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
                    <div class="noti_item">
                        <div class="noti_top">
                            <div class="noti_top_title">
                                <img v-if="!item.state" class="noti_top_img" src="../assets/images/new.png">
                                <span class="noti_top_content">{{item.content}}</span>
                            </div>
                            <div class="noti_top_time">
                                <template v-if="item.task_id&&item.type!=5&&item.type!=6">
                                    <span>开始时间：{{item.task_start_time}}</span>
                                    <span>结束时间：{{item.task_end_time}}</span>
                                </template>
                                <span v-else>发送时间：{{item.send_time}}</span>
                            </div>
                        </div>
                        <div class="noti_bottom" @click="goDetail(item)" v-if="item.type !=8">
                            <span>查看详情</span>
                            <a-icon type="right" :style="{ color: '#C0C4CC', fontWeight: 'bold', fontSize: '16px' }"/>
                        </div>
                    </div>
                </a-list-item>
            </a-list>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
            <a-pagination
                    @change="changePage($event)"
                    id="notiPagin"
                    size="small"
                    :total="total"
                    :show-total="total => `总条数： ${total}`"
                    :current="page"
                    :defaultCurrent="1"
                    :defaultPageSize="10"
                    :page-size="limit"
                    :hideOnSinglePage="true"
            />

        </a-modal>
        <!--   逾期提示     -->
        <a-modal v-model="showOverTime" title="提醒" :footer="null" width="600px" :centered="true">
            <div v-if="overTimeType == 1" class="overTime">
                <a-icon class="overTime_top" type="exclamation-circle" theme="filled"
                        :style="{ fontSize: '90px', color:'#EE4000'}"/>
                <div class="overTime_top overTime_text">系統已到期</div>
            </div>
            <div v-if="overTimeType == 2" class="overTime">
                <a-icon class="overTime_top" type="clock-circle" theme="filled"
                        :style="{ fontSize: '90px', color:'#FF8C00'}"/>
                <div class="overTime_top overTime_text">系统还剩<span style="color: #EE4000">{{overTimeDay}}</span>天到期</div>
            </div>
            <div class="ti">请联系商务或客服进行续费：</div>
            <div style="display: flex;justify-content: space-between">
                <div class="nummberbox bgtit">
                    <div>
                        <div class="nummber">4000-2828-80</div>
                        <div class="tit">请致电客服人员</div>
                    </div>
                    <img class="img_pos" src="@/assets/images/system/tel.png">
                </div>
                <div class="nummberbox bger">
                    <div>
                        <img class="er_img" src="../assets/images/system/custrom_service.png">
                    </div>
                    <div>
                        <div style="font-size: 18px;font-weight: bold;">
                            微信扫描
                        </div>
                        <div style="font-size: 14px;font-weight: bold">
                            添加客服微信
                        </div>
                    </div>
                    <img class="img_pos" src="@/assets/images/system/wx.png">
                </div>
            </div>
        </a-modal>
        <a-modal v-model="systemUpdate" title="系统更新通知" :footer="null" width="600px" :centered="true" :closable="false">
           <div class="system-notice">
                <div class="title">1.1.0【更新内容】</div>
                <p> 1. 更改提醒模式，新增默认模式，新增自定义，删除当前所拥有的模式</p>
                <p> 2. 修改统计报表，让统计更完善，搜索条件支持更多维度检索</p>
                <p> 3. 新增个人中心，消息提醒、任务报表、关于轻松任务、联系客户</p>
                <p> 4. 新增周报和月报，每周1，9:00和每月1号9:00推送任务周报和任务月报给员工</p>
                <p> 5. 一键拉群功能，可对新任务中通组织人员进行拉群</p>
                <p> 6. 首页优化，使得打开速度更快</p>
                <p> 7. 子任务新增负责人</p>
                <div class="known"><a-button type="primary" class="known" @click="known">我知道了</a-button></div>
           </div>
        </a-modal>

    </div>

</template>

<script>
    import {common} from "@/api";
    import MenuList from '../components/menu'
    import {wxConfig} from "@/assets/js/wx";
    // const time = new Date();

    export default {
        name: "home",
        components: {MenuList},
        data() {
            return {
                routesArr: [
                    {path: '/homePage', breadcrumbName: '首页', isNow: true},
                ],
                collapsed: false,//收起展开菜单
                userInfo: {
                    // avatar: null,
                    // corpid: "wwa0b0b8a275ac94b8",
                    // host: "http://www.task.com",
                    // is_initiate: 1,
                    // is_query: 1,
                    // is_super_admin: 1,
                    // is_system: 3,
                    // login_url: "http://www.task.com/structure/login/index",
                    // name: "超级管理员",
                    // type: 3,
                    // u_roles: "1",
                    // upload_path: "http://www.task.com/upload/",
                    // user_login: "admin",
                },//用户信息
                serviceWindow: false,//客服二维码弹窗
                logoWindow: false,//设置logo弹窗
                logoUrl: '',
                qiNiuUrl: 'https://upload-z2.qiniup.com/',
                qNParams: {},//上传到七牛云的参数
                companyName: '',//公司名称
                showLogoName: {
                    logo: '',
                    name: ''
                },
                noticeModel: false,//消息通知
                noticeList: [],//消息通知lsit
                page: 1,
                limit: 10,
                total: 0,
                showOverTime: false,
                overTimeType: '1',//1过期；2.提示
                overTimeDay: '0',
                currentRoute: '/homePage',
                filterRoutes: [
                    '/taskDetail/editTask',
                    '/taskDetail/taskDetail',
                    '/dataSta/rankDetail',
                    '/dataSta/rankTaskDetail',
                    '/taskDetail/subTaskDetail',
                    '/backManage/setRole',
                    '/dataSta/taskCountTask',
                    '/taskDetail/seeTaskFile'
                ],
                screenWidth:null,//屏幕宽度
                welcomeShow:true,//欢迎语展示
                systemUpdate:false,
            }
        },
        watch: {
            $route(to) {
                //判断路由变化添加面包屑
                this.routesArr.forEach((val, index) => {
                    this.routesArr[index].isNow = to.path === val.path;
                });
                const routerIndex = this.routesArr.findIndex(item => item.path === to.path);
                const str = to.meta.title ? to.meta.title.split('-')[1] : '';
                if (routerIndex === -1 && to.path !== '/home') {
                    //判断任务详情、排行详情等页面不被记录
                    if (this.filterRoutes.indexOf(to.path) < 0) {
                        this.routesArr.push({path: to.path, breadcrumbName: str, isNow: true});
                    } else {
                        this.routesArr.forEach(item => {
                            item.isNow = false
                        })
                    }
                }
                if (this.filterRoutes.indexOf(to.path) < 0) {
                    this.currentRoute = to.path;
                }
                sessionStorage.setItem('routesArr', JSON.stringify(this.routesArr));
                sessionStorage.setItem('currrentPath', this.currentRoute);
            },
            // 监听浏览器窗口宽度,当浏览器窗口小于1250时,隐藏系统时间
            screenWidth(val) {
                this.collapsed = val < 1250;
                this.welcomeShow = val < 1250;
            }
        },
        created() {
            // console.log(time);
            window.screenWidth = window.innerWidth;
            this.screenWidth = window.screenWidth;
            //窗口大小改变时
            window.onresize = () => {
                return (() => {
                    window.screenWidth = window.innerWidth;
                    this.screenWidth = window.screenWidth;
                    this.collapsed = this.screenWidth < 1250;
                    this.welcomeShow = this.screenWidth < 1250;
                })()
            };
            //刷新时
            window.addEventListener('beforeunload', () => {
                window.screenWidth = window.innerWidth;
                this.screenWidth = window.screenWidth;
                this.collapsed = this.screenWidth < 1250;
                this.welcomeShow = this.screenWidth < 1250;
            });
            if (sessionStorage.getItem('routesArr')) {
                this.routesArr = [].concat(JSON.parse(sessionStorage.getItem('routesArr')));
                this.currrentPath = sessionStorage.getItem('currentRoute');
            }
            //判断路由是否已存在或者不被记录
            let isExistRoute = this.routesArr.findIndex(item => item.path == this.$route.path);
            if (isExistRoute > -1) {
                if (this.filterRoutes.indexOf(this.$route.path) < 0) {
                    this.currentRoute = this.$route.path;
                    sessionStorage.setItem('currrentPath', this.currentRoute);
                }
            } else {
                if (this.$route.path !== '/home') {
                    //判断任务详情、排行详情等页面不被记录
                    const str = this.$route.meta.title ? this.$route.meta.title.split('-')[1] : '';
                    if (this.filterRoutes.indexOf(this.$route.path) < 0) {
                        this.routesArr.push({path: this.$route.path, breadcrumbName: str, isNow: true});
                    } else {
                        this.routesArr.forEach(item => {
                            item.isNow = false
                        })
                    }

                }
                if (this.filterRoutes.indexOf(this.$route.path) < 0) {
                    this.currentRoute = this.$route.path;
                    sessionStorage.setItem('currrentPath', this.currentRoute);
                }
            }
            // 获取配置信息
            let signature = sessionStorage.getItem("signature");
            if (signature) {
                wxConfig(JSON.parse(signature));
            } else {
                this.getSignature();
            }

            this.getUserInfo();
            this.getLogo();
            this.getOverdue();
            this.getTaskmsgList();

            // 判断是否查看更新日志
            let updateLog = localStorage.getItem("updateLogLook");
            if(!updateLog) {
                this.systemUpdate = true;
            }
        },
        methods: {
            //关闭当前路由
            closeBreadcrumb(index) {
                this.routesArr.splice(index, 1);
                this.routesArr[index - 1].isNow = true;
                this.$router.push(this.routesArr[index - 1].path);
                return false
            },
            //关闭全部
            closeAll() {
                this.routesArr = [{path: '/homePage', breadcrumbName: '首页', isNow: true}];
                this.$router.push('/homePage')
            },
            /*-------------*/
            //获取用户信息
            async getUserInfo() {
                const {code, data, msg} = await common.getUserInfo();
                if (code) {
                    this.$loading.hide()
                    this.userInfo = data;
                    sessionStorage.setItem('userInfo', JSON.stringify(data));
                    this.resetSetItem('watchStorage', data.name);
                    this.renderWaterMark(data.watermark);//页面加水印
                } else {
                    this.$loading.hide()
                    this.$message.error(msg, 2);
                }
            },

            async getSignature() {
                let url = location.href.split("#")[0];
                const {code, data, msg} = await common.getSignature({url: url});
                if (code) {
                    wxConfig(data);
                    sessionStorage.setItem('signature', JSON.stringify(data))
                } else {
                    this.$message.error(msg, 2);
                }
            },
            //复制链接
            copyUrl() {
                // let url = this.userInfo.host + '/#/home'
                let url = window.location;
                let oInput = document.createElement("input");
                oInput.value = url;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象;
                document.execCommand("Copy"); // 执行浏览器复制命令
                this.$message.success('复制链接成功')
                oInput.remove();
            },
            //设置logo--点击
            setLogoClick() {
                this.logoWindow = !this.logoWindow;
            },
            //获取logo
            async getLogo() {
                const {code, data} = await common.getLogo();
                if (code) {
                    this.logoUrl = data.logo;
                    this.companyName = data.name;
                    this.showLogoName.name = data.name;
                    this.showLogoName.logo = data.logo
                }
                return false;
            },
            //设置logo --表单提交
            async setLogo() {
                if (this.companyName === '') {
                    this.$message.error('公司名称 不能为空');
                } else if (this.logoUrl == '') {
                    this.$message.error('logo 不能为空');
                } else {
                    var params = {
                        name: this.companyName,
                        logo: this.logoUrl,
                        disk: null,
                    };
                    const {code, msg} = await common.setLogo(params);
                    if (code) {
                        this.showLogoName.name = this.companyName;
                        this.showLogoName.logo = this.logoUrl;
                        this.$message.success(msg, 2);
                        this.logoWindow = false
                    } else {
                        this.$message.error(msg, 2)
                    }
                    return false;
                }
            },
            //上传前 请求获取七牛云token
            async beforeUpload(file) {
                const isJPEG = file.type === 'image/jpeg';
                const isJPG = file.type === 'image/jpg';
                const isPNG = file.type === 'image/png';
                const isBMP = file.type === 'image/bmp';
                const isGIF = file.type === 'image/gif';
                const isWEBP = file.type === 'image/webp';
                const isPic = isJPEG || isJPG || isPNG || isBMP || isGIF || isWEBP;
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isPic) {
                    this.$message.error('只能选择jpeg、jpg、png、bmp、gif、webp格式的图片');
                }
                if (!isLt5M) {
                    this.$message.error('图片大小不能超过5M');
                }
                if (isPic && isLt5M) {
                    const data = await common.getQNToken();
                    if (data) {
                        this.qNParams = data
                    }
                }
                return isPic && isLt5M
            },
            //选择文件后
            uploadLogo(info) {
                if (info.file.status === 'uploading') {
                    return;
                }
                if (info.file.status === 'error') {
                    this.$message.error('上传失败', 2)
                }
                if (info.file.status === 'done') {

                    let name = info.file.name.split('.')[1];
                    if (name === 'jpeg' || name === 'jpg' || name === 'png' || name === 'gif' || name === 'bmp' || name === 'webp') {
                        this.logoUrl = this.qNParams.url + '/' + info.file.response.key;
                    }
                }
            },

            //退出登陆
            exitLogin() {
                let _this = this;
                this.$confirm({
                    title: '是否确定退出登陆',
                    content: '',
                    centered: true,
                    async onOk() {
                        const {code, msg, data} = await common.exitLogin();
                        if (code) {
                            _this.$message.success(msg + ' 即将跳转到登陆页面...', 2);
                            sessionStorage.removeItem('userInfo');
                            _this.routesArr = [{path: '/homePage', breadcrumbName: '首页', isNow: true}];
                            sessionStorage.setItem('routesArr', JSON.stringify(_this.routesArr))
                            setTimeout(() => {
                                location.href = data.url;
                            }, 2000)
                        } else {
                            _this.$message.error(msg, 2)
                        }
                    },
                });

            },
            //页面加水印
            renderWaterMark(name) {
                //整个页面加水印
                function textBecomeImg(text, fontsize, fontcolor) {
                    var canvas = document.createElement('canvas');
                    var $buHeight = 0;
                    if (fontsize <= 32) {
                        $buHeight = 99;
                    } else if (fontsize > 32 && fontsize <= 60) {
                        $buHeight = 2;
                    } else if (fontsize > 60 && fontsize <= 80) {
                        $buHeight = 4;
                    } else if (fontsize > 80 && fontsize <= 100) {
                        $buHeight = 6;
                    } else if (fontsize > 100) {
                        $buHeight = 10;
                    }
                    canvas.height = fontsize + $buHeight;
                    canvas.padding = 30;
                    var context = canvas.getContext('2d');
                    context.clearRect(0, 0, canvas.width * 2, canvas.height);
                    context.textAlign = "center";
                    canvas.width = 450;
                    canvas.height = 200;
                    context.fillStyle = fontcolor;
                    context.font = fontsize + "px Arial";
                    context.textBaseline = 'middle';
                    context.fillText(text, 0, fontsize / 2);
                    // var canvasWidth = canvas.width / 99;
                    // canvasWidth = context.measureText(text).width;
                    var dataUrl = canvas.toDataURL('image/png');
                    return dataUrl;
                }

                var text = name ? name : '';
                var shuiyinDiv = document.createElement('div');
                var style = shuiyinDiv.style;
                style.position = 'fixed';
                style.left = 0;
                style.top = '0%';
                style.width = '120%';
                style.height = '230%';
                style.opacity = '0.2';
                style.background = "url(" + textBecomeImg(text, 14, "gray") + ")";
                style.zIndex = 19891000;//
                style.transform = "rotate(-30deg)";
                style.pointerEvents = "none";
                document.body.appendChild(shuiyinDiv);
            },
            //获取消息通知列表
            async getTaskmsgList() {
                let res = await common.getTaskmsgList({page: this.page, limit: this.limit})
                if (res) {
                    this.total = res.data.total
                    this.noticeList = res.data.data
                }
            },
            //消息通知
            noticeClick() {
                this.noticeModel = true
                this.getTaskmsgList()
            },
            //去任务详情
            goDetail(item) {
                if(item.type==5||item.type==6) {
                    this.$router.push(`/dataSta/monthlyReport?year=${item.year}&month=${item.month}&week=${item.week}&rang=${item.type==5?1:2}`); 
                } else {
                    this.$router.push(`/taskDetail/taskDetail?id=${item.task_id}&pageType=executing`);
                }
                this.noticeModel = false
            },
            //关于轻松任务
            aboutUs() {
                this.$router.push('/homePage/taskUs')
            },
            //请求系统过期时间
            async getOverdue() {
                let res = await common.getOverdue
                if (res.data) {
                    if (res.data.overdue_day && 0 <= parseInt(res.data.overdue_day) <= 7) {
                        this.showOverTime = true
                        this.overTimeType = parseInt(res.data.overdue_day) <= 0 ? 1 : 2
                        this.overTimeDay = res.data.overdue_day
                    }
                }

            },
            //页码改变
            changePage(page) {
                this.page = page
                this.getTaskmsgList()
            },
            known(){
                this.systemUpdate = false;
                localStorage.setItem("updateLogLook",true);
            }
        },

    }
</script>
<style lang="less" scoped>
    /deep/ .ant-upload.ant-upload-drag .ant-upload {
        padding: 0;
    }

    /deep/ .ant-upload.ant-upload-drag {
        width: 202px;
        height: 202px;
    }

    /deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
        padding: 0;
    }

    .home-frame {
        width: 100%;
        height: 100vh;
        display: flex;

        .home-frame-left {
            width: 201px;
            z-index: 99;
            position: fixed;
            top: 0;
            left: 0;
            /*overflow: hidden;*/

            .logo-box {
                width: 100%;
                /*width: 201px;*/
                height: 60px;
                background-color: #0073D4;
                display: flex;
                text-align: center;
                align-items: center;
                justify-content: center;

                img {
                    max-width: 40px;
                    height: 30px;
                }

                .logo-name {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 500;
                    letter-spacing: 3px;
                }
            }
        }

        .home-frame-right {
            width: calc(100% - 202px);
            height: 100vh;
            background-color: #F5F7FA;
            position: fixed;
            top: 0;
            left: 201px;


            .home-frame-right-top {
                position: relative;
                width: 100%;
                min-width: 430px;
                overflow-x: auto;
                overflow-y: hidden;
                height: 60px;
                line-height: 60px;
                background: #F0F2F5;
                box-shadow: 0 1px 0 #E6EDF5;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;

                div {
                    color: #909499;
                    font-size: 18px;
                    margin-left: 16px;
                    line-height: 60px;

                    span {
                        font-size: 14px;
                        font-weight: 500;
                        color: #303233;
                        margin-left: 5px;
                    }
                }

                ul {
                    display: flex;
                    align-items: center;
                    height: 60px;
                    margin-bottom: 0;
                    margin-right: 20px;

                    li {
                        list-style: none;
                        margin-left: 20px;
                        /*height: 16px;*/
                        cursor: pointer;
                        line-height: 60px;

                        i {
                            margin-right: 5px;
                        }
                    }

                    /*li:nth-child(2) {*/
                    /*    span {*/
                    /*        height: 16px;*/
                    /*        border-right: 1px solid #C0C4CC;*/
                    /*        padding-right: 20px;*/
                    /*    }*/
                    /*}*/

                    /*li:nth-child(3) {*/
                    /*    div {*/
                    /*        margin-left: 0;*/
                    /*    }*/
                    /*}*/
                    li:last-child{
                        div{
                            margin-left: 0;
                            position: relative;
                        }
                        .line{
                            height: 14px;
                            border-left: 1px solid #c0c4cc;
                            margin-right: 20px;
                        }
                    }

                    .user-avatar {
                        width: 28px;
                        height: 28px;
                    }

                    img {
                        width: 16px;
                        height: 16px;
                        margin-top: -3px;
                        margin-right: 5px;
                        vertical-align: middle;
                    }
                }
            }

            /*面包屑*/

            .top-nav {
                background-color: #F0F2F5;
                height: 40px;
                line-height: 40px;
                border-top: 1px solid #e6edf5;
                box-sizing: border-box;
                box-shadow: 0 1px 0 #D7DEE6;

                .back {
                    color: #909499;
                    width: 70px;
                    text-align: center;

                    i:hover {
                        color: #333333;
                    }

                    span {
                        cursor: pointer;
                        vertical-align: middle;
                    }
                }


                .close-all {
                    float: right;
                    width: 78px;
                    box-shadow: -1px 0 2px rgba(0, 0, 0, 0.06);
                    color: #6B8FB3;
                    text-align: center;
                    cursor: pointer;
                }

                .nav-tabs {
                    width: calc(100% - 150px);
                    overflow: hidden;

                    ul {
                        display: flex;
                        margin: 0;
                        height: 40px;

                        li {
                            margin-top: 7px;
                            margin-right: 4px;
                            height: 32px;
                            line-height: 32px;
                            padding: 0 20px;
                            background: #D8DFE6;
                            opacity: 0.6;
                            border-radius: 4px 4px 0 0;

                            a {
                                font-size: 12px;
                                font-weight: 400;
                                color: #909499;
                                line-height: normal;
                            }
                        }

                        .active {
                            a {
                                color: #fff;
                            }

                            i {
                                color: #fff;
                                margin-left: 10px;
                            }

                            opacity: 1;
                            background: linear-gradient(180deg, #0082EF 0%, #04A9FE 100%);
                        }
                    }
                }
            }

            .top-nav > div {
                float: left;
            }

            .top-nav:after {
                content: "";
                display: block;
                height: 100%;
                width: 100%;
                clear: both;
            }

            .home-content {
                width: 100%;
                background: #F5F7FA;
                height: calc(100vh - 120px);
                overflow-y: scroll;
                padding: 16px 20px;
                overflow-x: scroll;
                box-sizing: border-box;

                .home-content-view {
                    width: 100%;
                    min-width: 1000px;
                    /*margin: 16px auto;*/
                    background-color: #fff;
                    min-height: calc(100vh - 160px);
                }
            }
        }
    }

    .menuList {
        background: #FFFFFF;
        width: 110px;
        position: absolute;
        right: 0;
        bottom: -370px;
        z-index: 100;

        div {

        }

        .menuItem {
            .user-avatar {
                width: 28px;
                height: 28px;
            }

            img {
                width: 16px;
                height: 16px;
                margin-top: -3px;
                margin-right: 10px;
                vertical-align: middle;
            }
        }
    }

    .menuItem {
        .user-avatar {
            width: 28px;
            height: 28px;
        }

        img {
            width: 16px;
            height: 16px;
            margin-top: -3px;
            margin-right: 5px;
            vertical-align: middle;
        }

        div {
            margin-right: 0 !important;
        }
    }

    .noti_item {
        background: #F5F7FA;
        width: 528px;
        /*height: 140px;*/
        padding: 10px 10px 0;
        cursor: pointer;

        .noti_top {
            padding-bottom: 10px;
            border-bottom: 1px solid #E2E7F1;

            .noti_top_title {
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .noti_top_img {
                width: 24px;
                height: 16px;
                margin-right: 5px;
            }

            .noti_top_content {
                /*text-overflow: -o-ellipsis-lastline;*/
                /*overflow: hidden;*/
                /*text-overflow: ellipsis;*/
                /*display: -webkit-box;*/
                /*-webkit-line-clamp: 2;*/
                /*line-clamp: 2;*/
                /*-webkit-box-orient: vertical;*/
                color: #303133;
                font-size: 16px;
                font-weight: bold;
                line-height: 24px;
            }

            .noti_top_time {
                padding-top: 10px;
                display: flex;
                color: #909399;

                span:nth-child(2) {
                    margin-left: 30px;
                }
            }
        }

        .noti_bottom {
            color: #303133;
            height: 46px;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .overTime {
        padding: 20px 0;

        .overTime_top {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .overTime_text {
            font-weight: bold;
            font-size: 16px;
            padding-top: 10px;
        }
    }

    .ti {
        font-size: 16px;
        padding-bottom: 10px;
    }

    .nummberbox {
        position: relative;
        width: 270px;
        height: 140px;
        padding: 20px 10px;
        display: flex;
        align-items: center;

        .nummber {
            font-size: 24px;
            font-weight: bold;
        }

        .tit {
            color: #ccc;
        }

        .er_img {
            width: 100px;
            height: 100px;
            margin-right: 15px;
        }

        .img_pos {
            position: absolute;
            height: 75px;
            width: 75px;
            right: 0;
            bottom: 0;
        }
    }

    .bgtit {
        background: #F0F8FF;
    }

    .bger {
        background: #FFFFE0;
    }

    .ant-list {
        height: 600px;
        overflow: auto;
    }

    //分页
    #notiPagin {
        padding: 10px 0 0;
        text-align: right;
        li {
            margin: 0 4px;
        }
    }
    /deep/ .ant-pagination-total-text{
        background:#fff;
    }
    .system-notice {
        .title {
            line-height: 40px;
            font-size: 16px;
        }
        line-height: 30px;
        p {
            padding-left: 10px;
            color: #666;
        }
        .known {
            margin-top: 10px;
            text-align: center;
        }
    }
</style>
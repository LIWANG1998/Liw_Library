<template>
    <div class="box">
        <!--    公文详情页面-->
        <div v-show="isShowPage == 1">
            <!-- <edits v-if="editState"></edits> -->
            <div class="quill" v-show="editState">
                <quill-editor class="editor" v-model="content" :options="editorOption"
                              ref="myQuillEditor"></quill-editor>
                <van-button color="#0082EF" @click="submit()" block>确定</van-button>
            </div>

            <van-tabs
                    v-show="!editState"
                    v-model="active"
                    color="#0082EF"
                    line-width="25px"
                    title-active-color="#0082EF"
            >
                <van-tab title="公文信息">
                    <choise
                            v-if="type==1"
                            :fields="fields"
                            :degree="degree"
                            :urgen_level="urgen_level"
                            info="showFont"
                            @listenShow="goLookDetail"
                            :type="type"
                            @listenDoc="getDoc"
                    ></choise>
                    <choiseSwen
                            v-if="type==2"
                            :fields="fields"
                            :degree="degree"
                            :urgen_level="urgen_level"
                            info="showFont"
                            @listenShow="goLookDetail"
                            :type="type"
                            @listenDoc="getDoc"
                    ></choiseSwen>
                    <choiseQbao
                            v-if="type==3"
                            :fields="fields"
                            :degree="degree"
                            :urgen_level="urgen_level"
                            info="showFont"
                            @listenShow="goLookDetail"
                            :type="type"
                            @listenDoc="getDoc"
                    ></choiseQbao>
                </van-tab>
                <van-tab title="正文内容">
                    <div class="lookEye" @click="goLookConetent()">
                        <van-icon name="eye-o" size="18" color="#66B5FF"/>
                        <span class="preview">公文预览</span>
                    </div>
                    <div class="content" v-html="content"></div>
                </van-tab>
                <van-tab title="公文附件">
                    <enclosure :files_all="files_all"></enclosure>
                </van-tab>
            </van-tabs>
            <!-- 预览文件 -->
            <van-popup v-model="show">
                <div class="infoBox" @click="show=false">
                    <div class="titleTable">
                        <div>{{type==1?'发文单':type==2?'收文单':'签报单'}}</div>
                        <div class="time">时间 : {{create_time.substr(0,10)}}</div>
                    </div>
                    <table align="center" cellspacing="0" cellpadding="6" border="1">
                        <tbody>
                        <tr align="center">
                            <td height="44px">{{type==1?'发文标题':type==2?'收文标题':'签报标题'}}</td>
                            <td colspan="3">{{document_arr.title}}</td>
                        </tr>
                        <tr align="center">
                            <td height="44px">{{type==1?'发文字号':type==2?'收文字号':'签报字号'}}</td>
                            <td colspan="3">{{document_arr.word_no}}</td>
                        </tr>
                        <tr align="center" v-if="type==2">
                            <td height="44px">来文字号</td>
                            <td colspan="3">{{document_arr.received_wordno}}</td>
                        </tr>
                        <tr align="center" v-if="type==2">
                            <td height="44px">接收时间</td>
                            <td colspan="3">{{document_arr.receiving_time}}</td>
                        </tr>
                        <tr align="center">
                            <td height="44px">公文密级程度</td>
                            <td width="25%">{{urgent_level_name}}</td>
                            <td width="25%">公文紧急程度</td>
                            <td width="25%">{{secret_level_name}}</td>
                        </tr>

                        <tr align="center" v-if="type==1||type==3">
                            <td height="80px">抄送人/单位</td>
                            <td>{{document_arr.copy_users}}</td>
                            <td>核稿人</td>
                            <td>{{document_arr.reviewer}}</td>
                        </tr>
                        <tr align="center" v-if="type==2">
                            <td height="80px">来文单位</td>
                            <td>{{document_arr.received_delivery}}</td>
                            <td>签发人</td>
                            <td>{{document_arr.issuer}}</td>
                        </tr>
                        <tr align="center" v-if="type==2">
                            <td height="80px">接收单位</td>
                            <td>{{document_arr.receiving_unit}}</td>
                            <td>接收人</td>
                            <td>{{document_arr.receiving_user}}</td>
                        </tr>

                        <tr align="center" v-if="type==1||type==3">
                            <td height="80px">主送单位</td>
                            <td>{{document_arr.main_delivery}}</td>
                            <td>签发人</td>
                            <td>{{document_arr.issuer}}</td>
                        </tr>

                        <tr align="center" v-for="(item,index) in addList" :key="index">
                            <td height="44px">{{item.c_name}}</td>
                            <td colspan="3">{{item.value}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div style="margin-top:5px" v-html="content"></div>
                </div>
            </van-popup>
        </div>
        <documentDetail></documentDetail>
        <showFun
                :role="role"
                :handle="handle"
                :docId="fid"
                :commomType="commomType"
                type="type"
                :where_id="where_id"
        ></showFun>
    </div>
</template>

<script>
    import log from "./components/log";
    import trend from "./components/trend";
    import tableInfo from "./components/tableInfo";
    import enclosure from "./components/enclosure";
    import documentDetail from "../../components/common/documentDetail";
    import examineDetail from "../../components/common/examineDetail";
    import showFun from "../../components/common/showFun";
    import choiseQbao from "../draft/components/choiseQbao";
    import choiseSwen from "../draft/components/choiseSwen";
    import choise from "../draft/components/choise";
    import edits from "../draft/components/edits";
    import {documentInfo, procedureJournal, recordList} from "../../api/home";
    import {getApprovalInfo, getDistributeDetail} from "../../api/audit";
    import collect from "../approval/collect";

    export default {
        components: {
            log,
            trend,
            enclosure,
            tableInfo,
            documentDetail,
            examineDetail,
            showFun,
            choise,
            edits,
            collect,
            choiseQbao,
            choiseSwen
        },
        data() {
            return {
                editorOption: {
                    modules: {
                        // syntax: {
                        //     highlight: text => hljs.highlightAuto(text).value
                        // },
                        toolbar: [
                            ["bold", "italic", "underline", "strike"], // toggled buttons
                            ["blockquote", "code-block"],

                            [{header: 1}, {header: 2}], // custom button values
                            [{list: "ordered"}, {list: "bullet"}]
                        ]
                    },
                    placeholder: "请输入文字内容..."
                },
                messages: "",
                editState: false,
                // 表格的信息
                document_arr: {},
                // 显示密级程度和紧急程度
                urgent_level_name: "",
                secret_level_name: "",
                show: false, //查看预览
                // id: "",
                active: 0,
                actives: 0,
                receiveStatus: true,
                fid: "", //传过来的文件id
                fields: [], //发文的信息
                degree: [], //密级程度列表
                urgen_level: [], //紧急程度列表
                content: "", //正文内容
                files_all: {}, //附件内容
                addList: [], //增加的内容
                type: "", // 发文类型
                lab:'',//1-我的发文，2-我的收文
                topdata: {}, //图像统计
                logList: [], //日志
                where_id: "", //流程id
                userid: "", //审核的id
                create_time: "",
                temId: "", //模板id
                isShowPage: 1, //1-显示公文详情页,2-审批详情页
                commomType: 2, //1--提交审核时，2--提交后查看，3--审核时，4--审核后查看,5--审核完成后查看，6--归档查看，7--传阅查看，8--废弃查看，9--抄送查看，10.草稿箱查看，11--收文时，12--收文完成后
                handle: "", //当前节点提交情况，1--未查看，2--已查看，3--未提交，4--已提交
                role: "", //self:提交人，auditor：审核人
                revoke: "", //审核人有无权限撤销
                currentDoc: {}, //当前公文对象status:1、等待中 2、审核进行中 3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，9归档，10发布
                status:'',
                auth:'',//从哪个页面跳转过来
            };
        },
        methods: {
            seaveDoc() {
                // console.log(this.isShowPage);
                this.isShowPage = this.isShowPage && this.isShowPage == 1 ? 2 : 1;
                sessionStorage.setItem("content", this.content);
            },
            submit() {
                this.editState = false;
            },
            //点击立即审核按钮修改
            getDoc() {
            },
            // 查看详情
            goLookDetail(a, doc) {
                this.document_arr = doc;
                this.getDegreeName();
                this.getUrgen();
                this.show = true;
            },
            goLookConetent() {
                this.getDegreeName();
                this.getUrgen();
                this.show = true;
            },
            //在线编辑
            goDetail() {
                this.editState = true;
            },
            addClass(e) {
                this.actives = e;
            },
            getContent() {
                let data = new URLSearchParams();
                data.append("id", this.fid);
                documentInfo(data).then(res => {
                    if (res.code == 1) {
                        this.content = res.data.content;
                    }
                });
            },
            //根据id获取详细信息
            getDocumentInfo() {
                this.$toast.loading({
                    message: "拼命加载中...",
                    forbidClick: false,
                    loadingType: "spinner",
                    overlay: true,
                    duration: 0
                });
                if (this.auth && this.auth == 57){//我的收文
                   this.getDistributeDetail()
                } else {
                    let data = new URLSearchParams();
                    data.append("id", this.fid);
                    documentInfo(data).then(res => {
                        if (res) {
                            this.$toast.clear();
                            if (res.code == 1) {
                                //给公文详情赋值
                                this.temId = res.data.templete_id;
                                this.create_time = res.data.create_time;
                                this.userid = res.data.userid;
                                this.where_id = res.data.where_id;
                                this.fields = res.data.fields; //公文字段
                                this.degree = res.data.degree; //密级程度
                                this.urgen_level = res.data.urgen_level; //紧急程度
                                this.role = res.data.userid == this.userInfo.userid ? 'self' : 'auditor'
                                res.data.fields.forEach((item, index) => {
                                    if (item.is_system == 0) {
                                        this.addList.push(item);
                                    }
                                    this.document_arr[item.e_name] = item.value;
                                });
                                this.status = res.data.status ? res.data.status : ""
                                let current = {
                                    type: this.type,
                                    temId: this.temId,
                                    where_id: this.where_id,
                                    docId: this.fid,
                                    status: res.data.status ? res.data.status : ""
                                };
                                sessionStorage.setItem("currentDoc", JSON.stringify(current));
                                this.files_all = res.data.files_all;
                                this.content = res.data.content;
                                this.$store.commit("getContent", res.data.content);
                                // sessionStorage.setItem("content", this.$store.state.content);

                                // sessionStorage.setItem("content", res.data.content); //发文标题内容
                                //显示密级程度和紧急程度
                                this.getDegreeName();
                                this.getUrgen();
                                //给公用按钮赋值
                                if (this.auth && this.auth == 57){//转收文时：，57-我的收文
                                    this.commomType = 11
                                } else {//拟稿时
                                    if (res.data.status) {
                                        //状态 1、等待中 2、审核进行中 3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，9归档，10发布
                                        if (res.data.status == 1 || res.data.status == 2) {
                                            //审核中
                                            this.getApprovalInfo();
                                        } else if (res.data.status == 3) {
                                            // commomType：1--提交审核时，2--提交后查看，3--审核时，4--审核后查看,5--审核完成后查看，6--归档查看，7--传阅查看，8--废弃查看，9--抄送查看，10.草稿箱查看，11--收文时，12--收文完成后
                                            this.commomType = 5;
                                        } else if (res.data.status == 4) {
                                            this.commomType = 1;
                                        } else if (res.data.status == 6) {
                                            this.commomType = 3;
                                        } else if (res.data.status == 7) {
                                            this.commomType = 8;
                                        } else if (res.data.status == 8) {
                                            this.commomType = 10;
                                        } else if (res.data.status == 9) {
                                            this.commomType = 6;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            },
            //公文审核进行中获取当前节点审批信息
            getApprovalInfo() {
                let that = this;
                let datas = new URLSearchParams();
                datas.append("data_id", this.fid);
                datas.append("details", 1);
                getApprovalInfo(datas).then(res => {
                    if (res) {
                        if (res.code == 1) {
                            let resData = res.data;
                            res.data.applicant.userid == that.userInfo.userid
                                ? "self"
                                : "auditor";
                            this.handle = resData.handle;
                            if (
                                resData.should_admin_ids &&
                                resData.should_admin_ids.indexOf(that.userInfo.userid) != -1
                            ) {
                                //是否是当前节点审核人
                                if (
                                    resData.have_admin_ids &&
                                    resData.have_admin_ids.indexOf(that.userInfo.userid) != -1
                                ) {
                                    //是否已经审核
                                    // commomType：1--提交审核时，2--提交后查看，3--审核时，4--审核后查看,5--审核完成后查看，6--归档查看，7--传阅查看，8--废弃查看，9--抄送查看，10.草稿箱查看，11--收文时，12--收文完成后
                                    that.commomType = 4;
                                    if (resData.other && resData.other.revoke) {
                                        //是否有权限撤销
                                        this.revoke = resData.other.revoke;
                                    }
                                } else {
                                    that.commomType = 3;
                                }
                            } else {
                                //不是当前节点审核人分两种情况：1--提交人查看当前审核详情，2--传阅的人查看审核详情
                                if (
                                    resData.applicant.userid == this.userInfo.userid &&
                                    resData.handle != 4
                                ) {
                                    //提交人查看审核
                                    that.commomType = 2;
                                } else {
                                    that.commomType = 7;
                                }
                            }
                        }
                    }
                });
            },
            //密级
            getDegreeName() {
                let degree = this.degree;
                degree.forEach((item, index) => {
                    if (this.document_arr.secret_level == item.id) {
                        this.urgent_level_name = item.name;
                    }
                });
            },
            //紧急
            getUrgen() {
                let urgen_level = this.urgen_level;
                urgen_level.forEach((item, index) => {
                    if (this.document_arr.urgent_level == item.id) {
                        this.secret_level_name = item.name;
                    }
                });
            },
            // 流程信息
            getProcedureJournal() {
                let data = new URLSearchParams();
                data.append("data_id", this.fid);
                procedureJournal(data).then(res => {
                    if (res.code == 1) {
                        this.topdata = res.data.topdata;
                    }
                });
            },
            //流程日志journal
            getJournal() {
                let data = new URLSearchParams();
                data.append("data_id", this.fid);
                data.append("way", 2);
                procedureJournal(data).then(res => {
                    if (res.code == 1) {
                        this.logList = res.data;
                    }
                });
            },
            //分发的收文信息
            getDistributeDetail(){
                let data = new URLSearchParams();
                data.append("id", this.distributeId ? parseInt(this.distributeId) : '');
                getDistributeDetail(data).then(res => {
                    if (res.code == 1) {
                       // console.log(res)
                    }
                });
            }
        },
        watch: {
            where_id(newValue, oldValue) {
                if (newValue) {
                    this.getProcedureJournal();
                }
            },
            $route: {
                handler:function(val, oldVal){
                if (oldVal) {
                    if (oldVal.path == '/success'){
                        this.$router.go(0)
                    }
                }
                },
                // 深度观察监听
                deep: true
            }
        },
        mounted() {
            window.onpopstate = () => {
                this.$toast.clear();
            };
            this.isShowPage = 1
            this.type = this.$route.query.type;
            this.fid = this.$route.query.fid;
            this.auth = this.$route.query.auth;//57我接收的
            this.distributeId = this.$route.query.distributeId;//分发记录id
            this.getDistributeDetail()
            // this.getJournal();
            sessionStorage.setItem("content", "");
            this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            //查看文件审批是传的token
            let token =this.$route.query.token
            sessionStorage.setItem('token',token)
        },
        created() {

        },
        activated() {
            this.editState = false;
            if (this.$route.query.handleType && this.$route.query.handleType == 1){
               this.isShowPage = '2'
            }
            this.lab = this.$route.query.lab
            let current = {
                type: this.type,
                temId: this.temId,
                where_id: this.where_id,
                docId: this.fid,
                status: this.status
            };
            sessionStorage.setItem("currentDoc", JSON.stringify(current));
        },
        beforeCreate() {
            let type = this.$route.query.type;
            if (type == 1) {
                document.title = "发文详情";
            } else if (type == 2) {
                document.title = "收文详情";
            } else if (type == 3){
                document.title = "签报详情";
            } else {
                document.title = "公文详情";
            }
        },
        beforeRouteLeave(to, form, next) {
            sessionStorage.removeItem("currentDoc");
            next()
        }
    };
</script>
<style lang="scss" scoped>
    /deep/ .van-tab__text--ellipsis {
        font-size: 17px !important;
    }

    /deep/ .van-cell {
        padding: 0;
    }

    /deep/ .van-tabs__nav {
        background-color: #f7f8fa;
    }

    .box {
        width: 100%;
        min-height: 100vh;
        background-color: #fff;
        position: relative;
        font-size: 14px;
    }

    .choiseBox {
        .infoTitle {
            padding: 10px 15px 0;
            height: 130px;
            background-color: #fff;

            .tit {
                display: flex;
                justify-content: space-between;
                height: 27px;
                line-height: 27px;
                font-size: 14px;
                margin-bottom: 5px;

                .van-icon {
                    vertical-align: text-top;
                    padding-right: 3px;
                }
            }
        }
    }

    .infoBox {
        width: 360px;
        padding: 19px;
        font-size: 14px;

        .time {
            position: absolute;
            right: 5px;
            top: 5px;
            color: #a7a8aa;
            font-size: 12px;
        }

        .titleTable {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
            color: #f00;

            div:nth-child(1) {
                font-size: 16px;
            }
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        .title {
            font-size: 16px;
            font-weight: 600;
        }

        table td {
            border: 2px solid #f00;
            word-wrap: break-word;
            word-break: break-all;
            white-space: normal;
        }

        table td:nth-child(1) {
            color: #f00;
        }

        table td:nth-child(3) {
            color: #f00;
        }
    }

    // tab2
    // .content {
    //     padding: 0px 15px;
    //     padding-bottom: 90px;
    // }

    .btns {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #303133;
        border-top: 1px solid #f0f0f0;
        background-color: #fff;
        z-index: 1;

        div {
            width: 100%;
            text-align: center;
        }

        .van-icon {
            vertical-align: text-bottom;
            padding-right: 5px;
        }
    }

    // 流程信息
    .process {
        .processStatus {
            padding: 19px 15px 0;

            display: flex;
            color: rgba(255, 255, 255, 1);

            div {
                width: 96px;
                height: 32px;
                line-height: 32px;
                background: #d8dfe6;
                opacity: 1;
                border-radius: 0px 16px 0px 0px;
                margin-right: 5px;
            }

            img:nth-child(1) {
                width: 14px;
                height: 13.5px;
                vertical-align: text-top;
                padding: 3px 0px 0 10px;
            }

            :nth-child(2) {
                img {
                    width: 16px;
                    height: 7px;
                    vertical-align: middle;
                    padding: 0px 0px 0 10px;
                    padding-bottom: 3px;
                }
            }
        }
    }

    .addblur {
        background-color: #0082ef !important;
    }

    .lookEye {
        text-align: right;
        margin: 0 auto;
        height: 30px;
        line-height: 30px;
        margin-right: 15px;
        margin-top: 8px;

        .van-icon {
            vertical-align: text-top;
            padding-right: 3px;
        }
    }

    .preview {
        color: #66b5ff;
    }

    .quill {
        margin-top: 2px;

        background-color: #fff;
    }

    /deep/ .ql-editor {
        height: 87vh;
    }
</style>
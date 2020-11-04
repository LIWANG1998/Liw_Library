<template>
    <div class="box">
        <div>
            <!-- 紧急程度 -->
            <div class="degree">
                <div class="chiose">
                    <van-icon color="#C8D8E5" name="fire"/>
                    <div class="title">紧急程度</div>
                </div>
                <div class="contentbox">
                    <div class="radios">
                        <van-radio-group v-model="handles.process_urgent_level" direction="horizontal">
                            <van-radio name="1">普通</van-radio>
                            <van-radio name="2" checked-color="#F5AC40">紧急</van-radio>
                            <van-radio name="3" checked-color="#F56C6C">加急</van-radio>
                        </van-radio-group>
                    </div>
                </div>
            </div>
            <!-- 处理意见 -->
            <div class="degree opinion">
                <div class="chiose">
                    <van-icon color="#C8D8E5" name="edit"/>
                    <div class="title">处理意见</div>
                </div>
                <!-- 输入留言-->
                <div class="inputValue">
                    <van-field
                            maxlength="400"
                            show-word-limit
                            v-model="handles.opinion"
                            rows="2"
                            type="textarea"
                            placeholder="请输入处理意见"
                    />
                </div>
                <div class="quick">
                    <div
                            @click="showReplychange"
                            class="quickbox"
                    >
                        <img
                                style="width: 16px;height: 12px;margin-right: 5px"
                                src="@/assets/img/newImg/info.png"
                                alt
                        />
                        快捷回复
                    </div>
                </div>
            </div>

            <!-- 附件 -->
            <div class="degree enclosure">
                <div class="chiose">
                    <img style="width: 15px;height: 15px" src="@/assets/img/newImg/file.png" alt/>
                    <div class="title">附件</div>
                </div>
                <div class="enclosureList">
                    <!-- 上传附件 -->
                    <van-uploader :after-read="afterRead">
                        <div class="upbtn">
                            <img style="width: 18px;height: 18px;" src="@/assets/img/newImg/wenjianjia.png" alt/>
                        </div>
                    </van-uploader>
                    <div v-for="(item,index) in handles.files" :key="index">
                        <load-file :file="item" @delFile="delFile"></load-file>
                    </div>
                </div>
            </div>
            <!-- 流程设置 -->
            <div class="degree">
                <div class="chiose">
                    <img style="width: 13px;height: 13px" src="@/assets/img/newImg/liucheng.png" alt/>
                    <div class="title">流程设置</div>
                </div>
                <!--              有审核流程-->
                <div v-if="process.processType == 2" class="contentbox" @click="goProcessPage">
                    <div class="contentItem">
                        <div>
                            <span style="font-size: 16px;margin-right: 8px">下一审批节点</span>
                            <span class="typeIcon">{{process.processNUm.approver_type == 1? '会签' : '或签'}}</span>
                        </div>
                        <van-icon name="arrow"/>
                    </div>
                </div>
                <div v-if="process.processType == 2" style="padding: 0px 20px;">
                    <div class="nextBox" v-if="process.processNUm.results.length < 6">
                        <div
                                v-for="(item,index) in process.processNUm.results "
                                :key="index"
                                class="nextItem"
                        >
                            <div style="height: 100%">
                                <img
                                        style="height:36px;width:36px;border-radius:18px;"
                                        :src="item.img"
                                />
                                <p style="color: #303133">{{item.title}}</p>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex;align-items: center" v-if="process.processNUm.results.length > 5">
                        <div
                                v-for="(item,index) in process.processNUm.results"
                                :key="index"
                                v-if="index < 5"
                                class="nextItem"
                        >
                            <div>
                                <img
                                        style="height:36px;width:36px;border-radius:18px;"
                                        :src="item.img"
                                />
                                <p style="color: #303133">{{item.title}}</p>
                            </div>
                        </div>
                        <van-icon name="ellipsis"/>
                    </div>
                </div>
                <!--              没有指定审核流程-->
                <div v-if="process.processType == 1" class="contentbox" @click="goProcessPage">
                    <div class="process">
                        <div>
                            <span style="font-size: 16px;margin-right: 8px">不需要审批流程</span>
                        </div>
                        <van-icon name="arrow"/>
                    </div>
                </div>
                <!--              指定审核流程-->
                <div v-if="process.processType == 3" class="contentbox" @click="goProcessPage">
                    <div class="process">
                        <div>
                            <span style="font-size: 16px;margin-right: 8px">{{process.checked.name}}</span>
                        </div>
                        <van-icon name="arrow"/>
                    </div>
                </div>
            </div>
            <!-- 提交人 -->
            <div class="degree">
                <div class="chiose">
                    <img style="width: 13px;height: 13px" src="@/assets/img/newImg/subUser.png" alt/>
                    <div class="title">提交人</div>
                </div>
                <div class="contentbox">
                    <div style="display: flex;align-items: center">
                        <img
                                style="width: 32px;height: 32px;margin-right: 5px"
                                src="@/assets/img/home/tit.png"
                                alt
                        />
                        <span class="userName">{{userInfo.name}}</span>
                        <span v-if="userInfo.dept.length == 1" class="userDept">（{{userInfo.dept[0].dep_name}}）</span>
                    </div>
                </div>
                <div v-if="userInfo.dept.length > 1" class style="border-top: 1px solid #F5F6F7">
                    <div class="usercheck">
                        <van-field
                                readonly
                                clickable
                                label="部门选择"
                                :value="depsName"
                                placeholder="请选择"
                                @click="urgentPicker = true"
                                input-align="right"
                                :border="false"
                        />
                        <van-popup v-model="urgentPicker" round position="bottom">
                            <van-picker
                                    show-toolbar
                                    :columns="urgentcolumns"
                                    @cancel="urgentPicker = false"
                                    @confirm="onConfirmDegree"
                            />
                        </van-popup>
                        <van-icon name="arrow"/>
                    </div>
                </div>
            </div>
<!--            &lt;!&ndash;        显示更多&ndash;&gt;-->
<!--            <div @click="show = !show" class="showmore">-->
<!--                <div>更多信息</div>-->
<!--                <div>-->
<!--                    <span style="display:inline-block;margin-right:5px;color: #909399">展开</span>-->
<!--                    <van-icon v-if="!show" name="arrow-down"/>-->
<!--                    <van-icon v-if="show" name="arrow-up"/>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div v-if="show">-->
<!--            </div>-->
            <!--        取消/确定按钮-->
            <div class="buttonbox">
                <van-button type="default" class="cancel" @click="cancel()">取消</van-button>
                <van-button color="#0082EF" class="ensure" @click="submitBtn(1)">提交</van-button>
                <!-- <div
                  v-if="currentDoc.status && currentDoc.status == 4"
                  class="ensure"
                  @click="submitBtn(1)"
                >重新提交</div>
                <div v-else class="ensure" @click="submitBtn(1)">提交</div>-->
            </div>
            <showFun
                    :commomType="commomType"
                    role="self"
                    type="type"
                    :docId="fid"
                    @saveDraft="cancel($event)"
            ></showFun>
            <documentDetail></documentDetail>
<!--            快捷回復-->
            <van-popup v-model="showReply" position="bottom" closeable :style="{ height: '60%' }">
                <quick-reply @getmessage="getmessage($event)" :showReply="showReply"></quick-reply>
            </van-popup>
<!--            流程設置-->
            <van-popup v-model="showSetProcess" position="right" closeable :style="{ height: '100%',width:'100%' }">
                <set-process :process="process" @changeProcess="changeProcess($event)"></set-process>
            </van-popup>
        </div>
    </div>
</template>
<script>
    import showFun from "../../components/common/showFun";
    import documentDetail from "../../components/common/documentDetail";
    import {
        documentAdd,
        qiniuToken,
        approvalBefore,
        documentAddFast,
    } from "../../api/home"; //接口
    import {getDate} from "@/assets/js/up";
    import {saveFile} from "@/assets/js/public";
    import loadFile from "@/components/common/loadFile";
    import quickReply from "@/components/common/quickReply";
    import updataReply from "@/components/common/updataReply";
    import setProcess from "@/components/common/setProcess";

    export default {
        name: "approval",
        components: {
            showFun,
            documentDetail,
            loadFile,
            quickReply,
            updataReply,
            setProcess,
        },
        props: {
            role: {
                type: String,
                default: "self", //
            },
        },
        data() {
            return {
                // -----------------------
                handles:
                    {
                        opinion: "", //处理意见
                        files: [], //审核附件
                        // way: "", //通知方式 1待办 2邮箱 3短消息
                        // notice: "", //是否通知 1不通知 2 通知
                        process_urgent_level: "", //紧急程度 1普通 2紧急 3加急
                        signature: "", //电子签章的id
                        where_id: "0", //	审批流程 新增发文时传入0
                    },
                process_id: "0", // 不需要流程的时候 流程的id 0
                deptid: "", //提交人的部门id
                depList: [], //提交人所属的部门
                depsName: "", // 显示提交人部门
                urgentPicker: false,
                urgentcolumns: [], //提交人数组

                // ======================
                commomType: 1, //公共按钮状态提交拟稿
                approval_where: [], //审核流程
                opinion: "", //处理意见
                dTime: "", //天
                tTime: "", //时
                sTime: "", //分
                // content: "", //正文内容
                // document_arr: {},
                // enclosure_file: [], //正文附件
                approval_file: [], //审核的附件
                process_urgent_level: 1, //紧急程度1普通2紧急3加急 ,
                msg_time: 0, //通知时间
                way: [], // 1待办 2邮箱 3短消息
                radio: "",
                message: "", //留言的信息
                checked: false, //复选框状态
                type: "", //页面类型----发文：dispatch,收文：receive,签发：sign
                templete_id: "",
                tongyi: "", //1为确定提交
                // chioseNotification: -1, //选择按钮
                oneFun: false,
                twofun: false,
                threefun: false,
                show: false, //是否显示更多
                path: "", //七牛云文件地址
                fid: "", //公文id
                showReply: false, //显示快捷回复
                qiniuYun: {
                    key: "", //图片名字
                    token: "", //token
                },
                nextTo: [], //下一节点
                status: 2, //是否存为草稿8
                currentDoc: {},
                nextPeo: [
                    {
                        name: "王明珂",
                    },
                    {
                        name: "王明珂1",
                    },
                    {
                        name: "王明珂1",
                    },
                    {
                        name: "王明珂1",
                    },
                    {
                        name: "王明珂1",
                    },
                    {
                        name: "王明珂1",
                    },
                ], //下一审批节点人
                userInfo: {}, //提交人
                showSetProcess:false,
                process: {
                    processType: 1,//1:，没有审批节点，2：指定下一节点，3：指定流程
                    checked: {},//选择流程信息
                },
            };
        },
        methods: {
            //选择提交人部门
            onConfirmDegree(value, index) {
                this.deptid = value.id
                this.depsName = value.text
                // this.urgent_level_name = value.text;
                // this.document_arr.urgent_level = value.id;
                this.urgentPicker = false;
            },
            //审核意见
            changeOpinon(val) {
                this.status = val;
            },
            showReplychange() {
                this.showReply = true;
                // console.log(this.showReply);
            },
            //获取快捷回复message
            getmessage(val) {
                this.handles.opinion = val
            },
            //从流程页面传回来的值
            goProcessPage(val) {
                this.showSetProcess = true
            },

            // 上传附件
            afterRead(files) {
                saveFile(files, this.callFile);
            },
            //七牛云上传返回来的文件数据
            callFile(val) {
                this.handles.files.push(val);
                // this.approval_file.push(val);
                // console.log(this.approval_file, "this.approval_file");
            },
            //流程启动时间
            changDime(d, t, s) {
                if (t != "") {
                    t = parseInt(t);
                }
                if (s != "") {
                    s = parseInt(s);
                }
                // console.log(t, s);
                if (t > 24) {
                    this.tTime = 24;
                } else {
                    this.tTime = t;
                }
                if (s > 59) {
                    this.sTime = 59;
                } else {
                    this.sTime = s;
                }
                let timeD = 86400 * Number(d);
                let timeT = 3600 * Number(this.tTime);
                let timeS = 60 * Number(this.sTime);
                this.msg_time = timeD + this.tTime + this.sTime;
            },
            //获取当前时间的时间戳
            timest() {
                var tmp = Date.parse(new Date()).toString();
                tmp = tmp.substr(0, 10);
                return tmp;
            },
            // 下一节点的流向
            getdocumentNext() {
                let data = new URLSearchParams();
                data.append("approval_id", this.$route.query.lid);
                approvalBefore(data).then((res) => {
                    if (res.code == 1) {
                        if (res.data.data){
                            let approval_where = res.data.data;
                            approval_where.forEach((item, index) => {
                                let cardNumObj = {
                                    id: item.id,
                                    approver_type: item.approver_type,
                                };
                                item.info.forEach((item, index) => {
                                    cardNumObj["should_admin_ids"] = item.userid;
                                    cardNumObj["admin_name"] = item.name;
                                });
                                this.approval_where.push(cardNumObj);
                            });
                            // console.log(this.approval_where, "123rwssdad");
                            if (res.data.data.length) {
                                this.nextTo = res.data.data[0].info;
                            }
                        }
                    }
                });
            },
            //删除文件
            delFile(info) {
                this.handles.files.forEach((item) => {
                    if (info.oldname == item.oldname && info.path == item.path) {
                        this.handles.files.splice(item, 1);
                    }
                });
            },
            // 提交按钮
            cancel(val) {
                this.$dialog
                    .confirm({
                        title: "提示",
                        message: "当前已有发文信息，是否存入草稿?",
                    })
                    .then(() => {
                        this.status = 8;
                        this.submitBtn();
                    })
                    .catch(() => {
                        this.$router.push({
                            path: "/home",
                        });
                    });
            },
            submitBtn(val) {
                // -----------------------------------------
                // console.log('handle', this.handles);
                // let content = this.$store.state.content;
                // let content_file = this.$store.state.content_file;
                // let document_arr = this.$store.state.document_arr;
                // console.log(111,this.content);
                // console.log(this.enclosure_file);
                // console.log(this.document_arr);
                let params = {
                    content: this.content,
                    enclosure_file: this.enclosure_file,
                    status: 2,
                    button: 1,
                    handles: this.handles,
                    deptid:this.userInfo.dept.length > 1? this.deptid : this.userInfo.department,
                    process_id: this.process.checked? this.process.checked.id : 0,
                    approval_copy:'',
                    document_arr: this.document_arr,
                    red_templete_id:this.red_templete_id
                }
                if (this.process.processNUm){
                    //添加审批人
                    let approval_where = []
                    //flag:1部门、2标签、3人员、4上级、5申请人
                    this.process.processNUm.results.forEach(item =>{
                        let usersArray = []
                        usersArray.push({
                            flag:item.type == 1? 1 :item.type == 2? 3: 0,
                            id:item.id
                        })
                        approval_where.push({
                            users:usersArray,
                            approver_type: this.process.processNUm.approver_type
                        })
                    })
                    this.$set(params, 'approval_where', approval_where)
                }
                // console.log('params111', params)
                documentAddFast(params).then((res) => {
                    // console.log('res', res)
                    if (res.code == 1){
                        this.$toast.success(res.msg)
                    }
                });
                // -----------------------------------------

                return;
                let _this = this;

                this.$toast.loading({
                    message: val ? "提交中..." : "正在存为草稿...",
                    forbidClick: false,
                    loadingType: "spinner",
                    overlay: true,
                    duration: 0,
                });
                // let content = sessionStorage.getItem("content");
                // let document_arr = sessionStorage.getItem("document_arr");
                let time = Number(_this.msg_time) + Number(_this.timest());
                let data = new URLSearchParams();
                data.append("templete_id", _this.templete_id); //模板的id
                if (val) {
                    //拟稿提交
                    data.append("status", 2);
                } else {
                    data.append("status", _this.status); //文件的类型
                }
                if (_this.fid) {
                    data.append("id", _this.fid);
                }
                data.append("type", _this.type); //文件的类型
                data.append("content", content); //正文的内容
                data.append("process_urgent_level", _this.process_urgent_level); //紧急程度
                data.append("document_arr", document_arr); //模板设置的发文项(数组形式)
                data.append("way", _this.way.join()); //通知方式
                data.append("enclosure_file", _this.enclosure_file); //正文附件
                data.append("approval_file", JSON.stringify(_this.approval_file)); //通知方式
                data.append("msg_time", time); //通知时间
                data.append("opinion", _this.opinion); //通知时间
                data.append("approval_where", JSON.stringify(_this.approval_where)); //流程信息
                // documentAdd(data).then((res) => {
                //     if (res.code == 1) {
                //         if (_this.status !== 2 && !val) {
                //             _this.$router.push({
                //                 path: "/success",
                //                 query: {
                //                     type: _this.type,
                //                     status: _this.status,
                //                 },
                //             });
                //             _this.$toast.clear();
                //         } else {
                //             let data_id = res.data_id;
                //             `/success?data_id=${data_id}`;
                //             this.$router.push({
                //                 path: "/success",
                //                 query: {
                //                     id: data_id,
                //                     type: _this.type,
                //                     status: 2,
                //                 },
                //             });
                //             _this.$toast.clear();
                //         }
                //     } else {
                //         _this.$toast.clear();
                //         _this.$toast.fail(res.msg);
                //     }
                // });
            },
            select(id) {
                this.process_urgent_level = id;
            },
            //通知方式按钮2
            choiseInfo(id) {
                if (id == 1) {
                    this.oneFun = !this.oneFun;
                }
                if (id == 2) {
                    this.twofun = !this.twofun;
                }
                if (id == 3) {
                    this.threefun = !this.threefun;
                }
                if (this.way.indexOf(id) == -1) {
                    this.way.push(id);
                } else {
                    if (this.way !== "") {
                        for (let i = 0; i < this.way.length; i++) {
                            if (this.way[i] == id) {
                                this.way.splice(i, 1);
                            }
                        }
                    }
                }
            },
            //设置流程人员
            changeProcess(val){
                this.showSetProcess = false
                this.process = val
                // console.log('process', val)
            }
        },
        activated() {
            // console.log(this.$store.state.process)
            this.process = this.$store.state.process
        },

        computed:{
            content(){
                return this.$store.state.content
            },
            enclosure_file(){
                return this.$store.state.enclosure_file
            },
            document_arr(){
                return this.$store.state.document_arr
            },
            red_templete_id(){
                return this.$store.state.red_templete_id
            },
        },
        created() {
            // -----------------------------
            let deps = JSON.parse(sessionStorage.getItem("userInfo")).dept;
            deps.forEach((item) => {
                var obj = {};
                obj["id"] = item.id;
                obj["text"] = item.dep_name;
                this.urgentcolumns.push(obj);
            });
            // --------------------------------

            this.status = this.$route.query.status;
            if (this.status == 8) {
                this.commomType = 10;
            }
            window.onpopstate = () => {
                this.$toast.clear();
            };
            this.approval_file = [];
            // this.content = sessionStorage.getItem("content");
            // this.document_arr = sessionStorage.getItem("document_arr");
            // this.enclosure_file = sessionStorage.getItem("enclosure_file");
            this.opinion = sessionStorage.getItem("opinion");
            this.process_urgent_level = sessionStorage.getItem("process_urgent_level");
            let approval_file = JSON.parse(sessionStorage.getItem("approval_file"));
            this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            // console.log(approval_file, "approval_file");
            if (approval_file) {
                approval_file.forEach((item, index) => {
                    let cardNumObj = {
                        oldname: item.old_name,
                        path: item.path,
                        size: item.size,
                    };
                    this.approval_file.push(cardNumObj);
                });
            }
            if (sessionStorage.getItem("way") != null) {
                this.way = sessionStorage.getItem("way").split(",");
            }
            if (sessionStorage.getItem("currentDoc") != null) {
                this.currentDoc = JSON.parse(sessionStorage.getItem("currentDoc"));
            }

            if (this.way) {
                let way = this.way;
                // console.log(way, " this.way");

                if (way.indexOf("1") !== -1) {
                    this.oneFun = true;
                }
                if (way.indexOf("2") !== -1) {
                    this.twofun = true;
                }
                if (way.indexOf("3") !== -1) {
                    this.threefun = true;
                }
                if (way !== null && way.length > 0) {
                    this.checked = true;
                }
            }
            this.type = this.$route.query.type;
            this.templete_id = this.$route.query.id;
            this.fid = this.$route.query.fid;

            this.getdocumentNext();
        },
    };
</script>
<style lang="scss" scoped>
    /deep/ .van-cell {
        padding: 16px 20px;
    }

    .box {
        background-color: #f7f8fa;
        min-height: 100vh;
        font-size: 14px;
        padding-bottom: 50px;
        margin-bottom: 10px;
    }

    .enclosure {
        width: 100%;
        height: auto;

        .enclosureList {
            box-sizing: border-box;
            padding: 10px 15px 15px;

            .van-uploader {
                width: 100%;
            }

            /deep/ .van-uploader__input-wrapper {
                width: 100%;
            }
        }
    }

    /deep/ .opinion .inputValue[data-v-17ed2f27] .van-field__value {
        position: relative;
        width: 379px;
        height: 120px;
        border-radius: 4px;
        padding: 10px;
    }

    /deep/ .van-field__word-limit {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .opinion {
        width: 100%;
        height: 200px !important;
        box-sizing: border-box;

        .radios {
            display: flex;
            justify-content: flex-start;
            padding: 21px 15px 15px;

            .van-radio {
                margin-right: 40px;
            }
        }

        .inputValue {
            box-sizing: border-box;
            padding: 0 15px 10px;

            /deep/ .van-field__value {
                overflow: hidden;
            }

            .van-cell {
                height: 200px;
            }
        }
    }

    .degree {
        width: 100%;
        height: auto !important;
        background-color: #fff;
        margin-bottom: 10px;

        .chiose {
            display: flex;
            align-items: center;
            font-size: 16px;
            padding: 7px 0 10px 15px;
            border: 1px solid #f5f6f7;

            .title {
                margin-left: 10px;
                color: #909399;
            }
        }

        .contentbox {
            background: #ffffff;
            padding: 0px 20px;
            height: 60px;
            line-height: 60px;

            .radios {
                height: 60px;
                display: flex;
                align-items: center;
            }

            .contentItem {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .typeIcon {
                    display: inline-block;
                    text-align: center;
                    width: 38px;
                    height: 25px;
                    line-height: 25px;
                    font-size: 12px;
                    color: #0082EF;
                    border: 1px solid #0082EF
                }
            }


            .userName {
                display: inline-block;
                max-width: 20%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis
            }

            .userDept {
                display: inline-block;
                color: #ADAFB3;
                max-width: 70%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis
            }
        }
        .nextBox{
            display: flex;
            background: #ffffff;
            div:nth-child(5){
                margin-right: 0;
            }
        }
        .nextItem {
            height: 88px;
            max-width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 20px
        }

        .btn {
          width: 112px;
          height: 48px;
          background: #F8F8F8;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #606266;
        }

        .opinionSpan {
            color: #d5d5d5;
        }

        .opinionSpan_1 {
            color: #41aaff;
        }

        .opinionSpan_2 {
            color: #f56c6c;
        }

        .opinionSpan_3 {
            color: #41aaff;
        }
    }

    .start {
        padding: 17px 30px 0;
        background-color: #ffffff;
        color: #303133;
        border: 1px solid #f9f9f9;

        .van-checkbox {
            padding-top: 20px;
            font-size: 14px;
        }

        div:nth-child(2) {
            margin-top: 8px;
            height: 32px;
            line-height: 32px;

            span {
                display: inline-block;
                width: 48px;
                height: 32px;
                background: #f2f3f5;
                color: #000;
                font-size: 16px;
                font-weight: 500;
                margin: 0 auto;
                text-align: center;
            }
        }
    }

    .choisNotice {
        color: #ffffff !important;
        background: rgba(255, 202, 58, 1) !important;
    }

    .choisEmail {
        color: #ffffff !important;
        background: #386bfc !important;
    }

    .choisInfoo {
        color: #ffffff !important;
        background: #7cdb00 !important;
    }

    /*上下处理节点*/
    .upnode {
        margin-top: 5px;
        padding: 20px 15px;
        border-radius: 4px;
        border-right: 5px solid #0082ef;
    }

    /*    最后取消/提交按钮*/
    .buttonbox {
        width: 100%;
        background-color: #ffffff;
        height: 57px;
        line-height: 57px;
        color: #303133;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        bottom: 0;
        border-top: 1px solid #e6e6e6;

        .cancel {
            width: 187px;
            height: 44px;
            margin-right: 10px;
        }

        .ensure {
            width: 187px;
            height: 44px;
            color: #303133;
        }
    }

    .upbtn {
        height: 40px;
        width: 40px;
        margin-bottom: 10px;
        background: #f6f6f6;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .showmore {
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        margin: 5px 0 10px;
        background-color: #ffffff;
        text-align: center;
    }

    .timeNum {
        background-color: #f2f3f5;
        width: 48px;
        height: 32px;
        line-height: 32px;
        border: none;
        text-align: center;
        margin-right: 5px;
    }

    .van-checkbox-group--horizontal {
        justify-content: space-between;
    }

    .quick {
        background: #ffffff;
        display: flex;
        align-items: center;
        height: 48px;
        border-top: 1px solid #F5F6F7;

        .quickbox {
            width: 50%;
            color: #41AAFF;
            display: flex;
            align-items: center;
            padding-left: 25px
        }
    }

    .process {
        display: flex;
        align-items: center;
        justify-content: space-between
    }

    .usercheck {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        padding: 0 20px;
    }
</style>


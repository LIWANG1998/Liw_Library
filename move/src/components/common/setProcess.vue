<template>
    <div class="content">
        <div class="processContent">
            <!-- 当前流程 -->
            <div class="degree">
                <div class="chiose">
                    <div class="title">当前流程</div>
                </div>
                <div class="contentbox current">
                    <div v-if="processType == 1">不需要审批流程</div>
                    <div v-if="processType == 2">指定下一个审批节点</div>
                    <div v-if="processType == 3" style="width:100%" class="flex-ac-jsb">
                        <span class="ellipsis width60">{{checked.name}}</span>
                        <div class="starSpan" @click="redSetCommonly">
                            <svg-icon
                                    :iconClass="checked.collect==2?'coll-ection':'coll-ection-act'"
                                    class="coll-ection-icon"
                            />
                            <span>设为我的常用流程</span>
                        </div>
                    </div>
                    <!--                    <van-icon v-if="processType == 3 && collected==1" color="#F5AC40" name="star"/>-->
                    <!--                    <van-icon v-else-if="processType == 3 && collected==2" name="star-o"/>-->
                    <!--                    <div @click="changeCollect">-->
                    <!--                        <svg-icon-->
                    <!--                                :iconClass="red.is_default==0?'coll-ection':'coll-ection-act'"-->
                    <!--                                class="coll-ection-icon"-->
                    <!--                        />-->
                    <!--                    </div>-->
                </div>
            </div>
            <!--        不需要审批流程-->
            <div v-if="type == 0" class="degree noProcess" @click="changeProcess(1)">
                <div style="font-size: 15px">不需要审批流程</div>
                <van-icon v-if="processType == 1" name="success" color="#0082EF"/>
            </div>
            <!--        指定下一节点流程-->
            <div v-if="type == 0" class="degree nextNode" style @click="changeProcess(2)">
                <div style="font-size: 15px">指定下一个审批节点</div>
                <van-icon v-if="processType == 2" name="success" color="#0082EF"/>
            </div>
            <!--        选择流程模板-->
            <div class="degree" style="margin-top:10px;">
                <div
                        class="contentItem"
                        v-for="(item,index) in templateList"
                        :key="index"
                        @click="changeProcess(3,item)"
                >
                    <div class="item">
                        <div style="font-size: 15px;display: flex;align-items: center">
                            {{item.name}}
                            <div v-if="item.line == 1" class="info">常用</div>
                        </div>
                        <van-icon
                                v-if="processType == 3 && checked.id == item.id"
                                name="success"
                                color="#0082EF"
                        />
                    </div>
                </div>
                <div @click="show=!show" class="contentbox more">更多流程</div>
            </div>
            <!--        审批流程-->
            <div v-if="processType == 2" class="degree">
                <div class="chiose">
                    <div class="title">审批流程</div>
                </div>
                <!--            指定下一节点审批人-->
                <div class="contentbox" v-if="processType == 2">
                    <div class="next">
                        <div class="nextItem" v-for="(item, index) in auditorList" :key="index">
                            <van-icon @click="onDelUser(index,1)" class="del" name="clear"/>
                            <div class="imgbox">
                                <img style="height:36px;width:36px;border-radius:18px;" :src="item.img" alt/>
                            </div>
                            <div class="nameTxt">{{item.title}}</div>
                        </div>
                        <div @click="changeNextAuditor(1)" style="width: 55px">
                            <div class="plus">
                                <van-icon color="#CCCCCC" name="plus"/>
                            </div>
                        </div>
                    </div>
                    <!--                    审批方式-->
                    <div>
                        <div class="type">审批方式</div>
                        <van-radio-group v-model="auditType" direction="horizontal">
                            <van-radio style="margin-right: 70px" name="2">或签</van-radio>
                            <van-radio name="1">会签</van-radio>
                        </van-radio-group>
                    </div>
                </div>
                <!--                审批流程-->
                <!--                <div class="contentbox" v-if="processType == 3">-->
                <!--                    <node-auditor :nodeList = nodeList></node-auditor>-->

                <!--                </div>-->
            </div>
            <!--            指定流程-->
            <template v-if="processType == 3">
                <!--                审批人-->
                <div class="degree">
                    <div class="chiose">
                        <div class="title auditor">审批人<span class="redStar">*</span></div>
                    </div>
                    <div class="contentbox">
                        <!--                            <node-auditor :nodeList = nodeList></node-auditor>-->

                        <!--                    审批方式-->
                        <!--                    <div>-->
                        <!--                        <div class="type">审批方式</div>-->
                        <!--                        <van-radio-group v-model="auditType" direction="horizontal">-->
                        <!--                            <van-radio name="2">或签</van-radio>-->
                        <!--                            <van-radio name="1">会签</van-radio>-->
                        <!--                        </van-radio-group>-->
                        <!--                    </div>-->
                        <updata-auditor
                                @ChangeAuditor="ChangeAuditor($event)"
                                :nodeList="nodeList"
                                :edit_approval="edit_approval"
                        ></updata-auditor>
                    </div>
                </div>
            </template>
            <!--                抄送人-->
            <div class="degree" v-if="processType == 2 || processType == 3">
                <div class="chiose">
                    <div class="title">抄送人</div>
                </div>
                <div class="contentbox">
                    <div class="next">
                        <div class="nextItem" v-for="(item, index) in approval_copy" :key="index">
                            <van-icon
                                    v-if="!(processType == 3 && edit_cclist == 2)"
                                    @click="onDelUser(index, 2)"
                                    class="del"
                                    name="clear"
                            />
                            <div class="imgbox">
                                <img style="height:36px;width:36px;border-radius:18px;" :src="item.img" alt/>
                            </div>
                            <div class="nameTxt" style>{{item.title}}</div>
                        </div>
                        <div
                                v-if="processType == 2 || (processType == 3 && edit_approval == 1)"
                                @click="changeNextAuditor(2)"
                                style="width: 55px"
                        >
                            <div class="plus">
                                <van-icon color="#CCCCCC" name="plus"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button" @click="submitSave">
            <div>完成</div>
        </div>
        <!--        选择流程-->
        <template v-if="show">
            <van-popup closeable v-model="show" position="bottom" :style="{ height: '80%' }">
                <div class="popup">
                    <div class="popup-top">
                        <div class="title">
                            <!--              <span class="btn" @click="submit(0)">取消</span>-->
                            <span style="font-size: 16px;padding:5px 0">更多流程</span>
                            <!--              <span class="btn" @click="submit(1)">确定</span>-->
                        </div>
                        <van-search
                                @input="changeSearch"
                                v-model="search"
                                placeholder="请输入流程名称"
                                input-align="center"
                        />
                    </div>
                    <div class="popup-btm">
                        <van-list v-model="loading" :finished="finished" @load="onLoad">
                            <van-cell v-for="(item,index) in moreTempleteList" :key="index">
                                <div @click="changePopup(3,item)" class="item">
                                    <div style="font-size: 15px;display: flex;align-items: center">
                                        {{item.name}}
                                        <div v-if="item.line == 1" class="info">常用</div>
                                    </div>
                                    <van-icon v-if="popupChecked.id == item.id" name="success" color="#0082EF"/>
                                </div>
                            </van-cell>
                        </van-list>
                    </div>
                </div>
            </van-popup>
        </template>

        <!--          选择人员 -->
        <van-popup v-model="pel.depUserss" position="left" :style="{ height: '100%',width:'100%' }">
            <pickclass v-if="pel.depUserss" :pel="pel" @choiseUsercg="choiseUsercg($event)"/>
        </van-popup>
    </div>
</template>

<script>
    import {getMyTemplate, approval_collection} from "@/api/audit";
    import {approvalBefore} from "@/api/home";
    import nodeAuditor from "./nodeAuditor";
    import pickclass from "../pickclass/pickclass";
    import Temporary from "../../views/temporary/temporary";
    import updataAuditor from "./updataAuditor";
    import {debounce} from "@/js/public.js";
    import store from "@/store";

    export default {
        name: "setProcess",
        components: {
            Temporary,
            nodeAuditor,
            pickclass,
            updataAuditor,
        },
        data() {
            return {
                collected: 1,
                templateList: [], //常用流程模板
                type: "",
                // processType: 1, //已选择流程
                // checked: {
                //     name: "流程1",
                //     collect: 1,//1.不常用2.常用
                // },
                // auditorList: [], //下一节点审批人列表
                // auditType: "2", //2:或签1：会签
                active: 1,
                nodeList: [], //审批节点
                show: false,
                page: 1, //更多流程页数
                search: "", //更多流程搜索
                finished: false,
                loading: false,
                moreTempleteList: [],
                // popupChecked: {}, //弹出框已选值
                // pel: {
                //   depUserss: false, //选人的弹框
                //   type: 1, //1、选择审批人；2、选择抄送人
                //   ckt: {
                //     zzjg: true, // 显示 组织架构
                //     bm: false, // 可以选部门
                //     ren: true, // 可以选人
                //     tag: false, // 显示 标签
                //     dw: true, // 显示 单位
                //     radio: false, // 是否为单选
                //   },
                //   result: [], // 打勾选中的
                //   results: [], // 打勾选中的所有信息
                // },
                auditorResult: [], //已选审核人回显选人用
                copyResult: [], //已选抄送人回显选人用
                // updataAuditor: [],
                // approval_copy: [],
                // edit_approval: "0", //1, 是否允许申请人修改审批流程
                // edit_cclist: "0", //1  是否允许申请修改抄送人
                headImg: require("@/assets/img/newImg/headImg.png"),
                // process:{},//上一页路程信息
                rePage: false,//是否是再次进入设置流程，判断回显已选人还是调流程接口获取审核和抄送人
                flash: false,//false.
            };
        },
        computed: {
            process() {
                return this.$store.state.processNew && this.$store.state.processNew.process ? this.$store.state.processNew.process : {};
            },
            process_updata() {
                return this.$store.state.processNew && this.$store.state.processNew.process_updata ? this.$store.state.processNew.process_updata : {};
            },
            checked: {
                get() {
                    return this.$store.state.processNew.process_updata && this.$store.state.processNew.process_updata.checked? this.$store.state.processNew.process_updata.checked : {};
                },
                set(value) {
                    this.$store.state.processNew.process_updata.checked = value;
                },
            },
            popupChecked: {
                get() {
                    return this.$store.state.processNew.process_updata && this.$store.state.processNew.process_updata.popupChecked? this.$store.state.processNew.process_updata.popupChecked : {};
                },
                set(value) {
                    this.$store.state.processNew.process_updata.popupChecked = value;
                },
            },
            processType: {
                get() {
                    return this.$store.state.processNew.process_updata && this.$store.state.processNew.process_updata.processType? this.$store.state.processNew.process_updata.processType : 1;
                },
                set(value) {
                    this.$store.state.processNew.process_updata.processType = value;
                },
            },
            updataAuditor: {
                get() {
                    return this.$store.state.processNew.process_updata && this.$store.state.processNew.process_updata.updataAuditor? this.$store.state.processNew.process_updata.updataAuditor : [];
                },
                set(value) {
                    this.$store.state.processNew.process_updata.updataAuditor = value;
                },
            },
            approval_copy: {
                get() {
                    return this.$store.state.processNew.process_updata && this.$store.state.processNew.process_updata.approval_copy? this.$store.state.processNew.process_updata.approval_copy : [];
                },
                set(value) {
                    this.$store.state.processNew.process_updata.approval_copy = value;
                },
            },
            auditType: {
                get() {
                    return this.$store.state.processNew.process_updata && this.$store.state.processNew.process_updata.auditType? this.$store.state.processNew.process_updata.auditType : '2';
                },
                set(value) {
                    this.$store.state.processNew.process_updata.auditType = value;
                },
            },
            auditorList: {
                // return  this.$store.state.processNew.process_updata.auditorList;

                get() {
                    return this.$store.state.processNew.process_updata.auditorList && this.$store.state.processNew.process_updata.auditorList? this.$store.state.processNew.process_updata.auditorList : [];
                },
                set(value) {
                    this.$store.state.processNew.process_updata.auditorList = value;
                },
            },
            edit_approval: {
                // return  this.$store.state.processNew.process_updata.auditorList;

                get() {
                    return this.$store.state.processNew.process_updata.edit_approval;
                },
                set(value) {
                    this.$store.state.processNew.process_updata.edit_approval = value;
                },
            },
            edit_cclist: {
                // return  this.$store.state.processNew.process_updata.auditorList;

                get() {
                    return this.$store.state.processNew.process_updata.edit_cclist;
                },
                set(value) {
                    this.$store.state.processNew.process_updata.edit_cclist = value;
                },
            },
            caogao_process() {
                return sessionStorage.getItem('caogao_process') ? JSON.parse(sessionStorage.getItem('caogao_process')) : ''
            },
            pel() {
                // console.log(this.$store.state.edittext.pel)
                return this.$store.state.edittext.pel;
            },
            document_arrs() {
                return this.$store.state.edittext.document_arrs;
            },
            processNew() {
                return this.$store.state.processNew;
            },
        },
        watch: {
            show: {
                deep: true,
                handler: function (val) {
                    if (val) {
                        this.page = 1
                        this.getMyTemplate(10, 2)
                    }
                }
            },
            processNew: {
                deep: true,
                handler: function (val) {
                    // console.log('watch___processNew', val)
                }
            },
            process_updata: {
                deep: true,
                handler: function (val) {
                    // console.log('watch___process_updata', val)
                }
            },
        },
        activated() {
            this.page = 1
            this.search = ''
            this.type = this.$route.query.type;
            this.getMyTemplate(3, 1);
            // this.getMyTemplate(10, 2);
            this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            this.dept_id = this.userInfo.dept[0].id;
            // if (this.$store.state.processNew.flash == 1){//从approval页面第一次进入审核页
            //     this.$store.state.processNew.flash = 0
            //     this.init()
            // } else {//再次进入流程设置页从vuex拿审核人数据
            // }
            // console.log('activated__setProcess', this.$store.state.processNew)
        },
        methods: {
            // 设置常用流程
            async redSetCommonly() {
                let _this = this
                let _notice = `是否将${this.checked.name}设为常用流程`
                this.$dialog.confirm({
                    message: `${this.checked.collect == 1 ? '取消设置为常用流程' : _notice}`
                }).then(() => {
                    let _data = {
                        approval_id: this.checked.id, // 流程的id
                        collect: this.checked.collect == 1 ? 2 : 1, //	1收藏 2取消
                    }; // 参数
                    // console.log(_data);
                    approval_collection(_data).then((_res => {
                        // console.log(_res);
                        if (_res.code == 1) {
                            _this.checked.collect = _this.checked.collect == 1 ? 2 : 1;
                            _this.$toast.success('设置成功');
                            this.getMyTemplate(3, 1)
                        }
                        // console.log()
                    }))
                }).catch(() => {
                })
            },

            async getMyTemplate(num, more) {
                let params = {
                    limit: num ? num : "",
                    type: this.type == 0 ? 1 : this.type,
                    more: more ? more : "",
                    page: this.page,
                    name: this.search,
                };
                let res = await getMyTemplate(params);
                if (res && res.code == 1) {
                    if (more == 1) {
                        //常用流程
                        this.templateList = res.data.data;
                    } else {
                        //更多流程
                        if (this.page == 1) {
                            this.moreTempleteList = res.data.data;
                        } else {
                            this.moreTempleteList = this.moreTempleteList.concat(res.data.data);
                        }
                        if (res.data.data && res.data.data.length < 10) {
                            this.finished = true;
                        } else {
                            this.finished = false;
                        }
                    }
                }
                this.loading = false;
                // console.log(this.templateList);
                // console.log(this.moreTempleteList);
            },
            //改变流程设置选项
            changeProcess(type, process) {
                // console.log('已选流程',type,  process)
                this.processType = type;
                if (process) {
                    this.checked = process;
                    this.popupChecked = process;
                    this.approvalBefore(process.id);
                } else {
                    this.checked = {};
                    this.popupChecked = {};
                    this.approval_copy = [];
                    this.copyResult = [];
                }
                //指定下一节点直接显示选人页面
                if (type == 2){
                    this.changeNextAuditor(1)
                }
            },
            //弹出框选值
            changePopup(type, val) {
                if (val) {
                    // console.log("changePopup", val);
                    this.popupChecked = val;
                    this.show = false;
                    this.processType = 3;
                    this.checked = this.popupChecked;
                    this.approvalBefore(this.popupChecked.id);
                    this.popupChecked = {};
                    // this.$set(this, 'popupChecked', val)
                }
            },
            //获取节点流程节点
            approvalBefore(id, auditor, copy,init='') {
                let _this = this;
                let params = {
                    approval_id: id,
                    dep_id: this.dept_id,
                };
                approvalBefore(params).then((res) => {
                    
                    // console.log("审批信息", res);
                    if (res && res.code == 1) {
                        //抄送人回显------------------------------------
                        let _copyResult = []//抄送人选人回填
                            let _approval_copy = [];
                            if (res.data.approval_copy) {
                                //itme.type：1.上级，2：标签，3：单个成员，4：申请人，5：部门
                                //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
                                res.data.approval_copy.forEach((item, index) => {
                                    //初始化抄送人
                                    let _data = {
                                        id: item.value,
                                        img: item.avatar ? item.avatar : _this.headImg,
                                        title: item.title,
                                        w_id:'ren' + item.value,
                                        type:
                                            item.type == 1
                                                ? 4
                                                : item.type == 2
                                                ? 3
                                                : item.type == 3
                                                    ? 2
                                                    : item.type == 4
                                                        ? 5
                                                        : 1,
                                    };
                                    _approval_copy.push(_data);
                                    _copyResult.push(item.type == 1 || item.type == 3 || item.type == 4 ? `ren${item.value}` : item.type == 2 ? `tag${item.value}` : item.type == 5 ? `bm${item.value}` : '')
                                });
                            }
                            this.approval_copy = _approval_copy;
                            this.copyResult = _copyResult
                            if (init){
                                this.process.checkedCopy = _approval_copy
                            }
                        //审核人回显---------------------------------------------------------------------
                        if (auditor && auditor.length > 0) {//设置流程回显审核人
                            _this.nodeList = JSON.parse(JSON.stringify(auditor));
                        } else {//显示流程里的审核人
                            this.initAuditor(res.data.data,init)
                            // _this.nodeList = res.data.data;
                        }
                        // this.rePage = this.nodeList.length > 0 && this.nodeList[0].info ? false : true
                        // console.log('this.approval_copy', _this.approval_copy)
                        // console.log('this.copyResult', _this.copyResult)
                        // console.log('this.nodeList', _this.nodeList)
                        _this.collected = res.data.data.collected;
                        _this.edit_approval = res.data.explain?.root_setting ? res.data.explain.root_setting.edit_approval : 2;
                        _this.edit_cclist = res.data.explain?.root_setting ? res.data.explain.root_setting.edit_cclist : 2;
                        _this.$set(_this.checked, 'collect', res.data.collect)
                        _this.$set(_this.popupChecked, 'id', id)
                    }
                });
            },
            //触发加载事件
            onLoad() {
                this.page = ++this.page;
                this.getMyTemplate(10, 2);
            },
            //弹出框确定
            submit(type) {
                this.show = false;
                if (type == 1) {
                    this.processType = 3;
                    this.checked = this.popupChecked;
                    this.approvalBefore(this.popupChecked.id);
                }
                this.popupChecked = {};
            },
            //完成提交
            submitSave() {
                let process_id =
                    this.processType == 1 || this.processType == 2 ? 0 : this.checked.id;
                let params = {};
                if (this.processType == 2) {
                    let processNUm = {
                        approver_type: parseInt(this.auditType), //1会签 2或签
                        results: this.auditorList,
                    };
                    this.$set(params, "processNUm", processNUm);
                    this.$set(params, "checkedCopy", this.approval_copy);
                } else if (this.processType == 3) {
                    let _updataAuditor = JSON.parse(JSON.stringify(this.updataAuditor))
                    this.$set(params, "checked", this.checked);
                    this.$set(params, "checkedAuditor", _updataAuditor);
                    this.$set(params, "checkedCopy", this.approval_copy);
                    this.$set(params, "edit_approval", this.edit_approval);
                    this.$set(params, "edit_cclist", this.edit_cclist);
                }
                this.$set(params, "processType", this.processType);
                // console.log(222, params);
                // this.$emit("changeProcess", params);
                // this.$store.commit('setProcess', params)
                this.processNew.process = params
                // console.log(5656565, this.$store.state.processNew.process)
                this.$router.go(-1)
            },
            //显示选下一节点选人和选择抄送人
            changeNextAuditor(type) {
                //type:1.选择下一节点审核人，2、选择抄送人
                // this.pel.depUserss = true;
                if (type && type == 1) {
                    // this.pel.result = this.auditorResult
                    // this.pel.results = this.auditorList
                    this.pel.ckt = {
                        zzjg: true, // 显示 组织架构
                        bm: false, // 可以选部门
                        ren: true, // 可以选人
                        tag: false, // 显示 标签
                        dw: false, // 显示 单位
                        radio: false, // 是否为单选
                    }
                    let _value = this.auditorList.map(item => item.w_id)
                    this.processNew.next = {
                        value: _value,
                        values: this.auditorList
                    }
                    this.$router.push({
                        path: "/selectpage",
                        query: {
                            key: 'next',
                            type: '1'//审核流程里面所有选人数据
                        },
                    });
                } else if (type && type == 2) {
                    // this.pel.result = this.copyResult
                    // this.pel.results = this.approval_copy
                    // console.log('显示', this.pel.result, this.pel.results)
                    this.pel.ckt = {
                        zzjg: true, // 显示 组织架构
                        bm: false, // 可以选部门
                        ren: true, // 可以选人
                        tag: false, // 显示 标签
                        dw: true, // 显示 单位
                        radio: false, // 是否为单选
                    }
                    //copyResult
                    let _value = this.approval_copy.map(item => item.w_id)
                    this.processNew.cs = {
                        value: _value,
                        values: this.approval_copy
                    }
                    this.$router.push({
                        path: "/selectpage",
                        query: {
                            key: 'cs',
                            type: '1'
                        },
                    });
                }
                this.pel.type = type;
            },
            //选择审核人数组
            ChangeAuditor(val) {
                // console.log("setProcess", val);
                // console.log(this.$store.state.processNew)
                this.updataAuditor = val;
            },
            //确定选择下一节点审核人和抄送人
            choiseUsercg(val) {
                if (this.pel.type == 1) {
                    this.auditorList = this.pel.results;
                    this.auditorResult = this.pel.result;
                } else if (this.pel.type == 2) {
                    this.approval_copy = this.pel.results;
                    this.copyResult = this.pel.result;
                }
            },
            //删除抄送人
            onDelUser(index, type) {
                //type:1.删除下一审批节点审核人，2.删除抄送人
                if (type == 1) {
                    this.auditorList.splice(index, 1);
                    this.auditorResult.splice(index, 1);
                } else if (type == 2) {
                    this.approval_copy.splice(index, 1);
                    this.copyResult.splice(index, 1);
                }
            },
            changeSearch: debounce(function () {
                this.page = 1;
                this.getMyTemplate(10, 2);
            }, 850),

            //拷贝
            jsonParams(val){
                return JSON.parse(JSON.stringify(val))
            },
            //初始化审核人
            initAuditor(val,init) {
                let _lists = []//选人组件中results
                let _list = []//选人组件中result
                val.forEach((item, index) => {
                    let _params = {}
                    //itme.type：1.上级，2：标签，3：单个成员，4：申请人，5：部门
                    //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
                    this.$set(_params, 'type', item.type == 3 ? 2 : item.type == 5 ? 1 : item.type == 2 ? 3 : item.type == 1 ? 4 : 5)
                    if (_params.type == 1 || _params.type == 3) {
                        this.$set(_params, 'id', item.value)
                        this.$set(_params, 'img', _params.type == 1 ? require('@/assets/img/newImg/headImg.png') : _params.type == 3 ? require('@/assets/img/newImg/headImg.png') : '')
                        this.$set(_params, 'title', item.title)
                        this.$set(_params, 'w_id', (_params.type == 1 ? 'bm' : _params.type == 3 ? 'tag' : '') + item.id)
                        this.$set(_params, 'approver_type', item.approver_type)
                        _list.push(_params.w_id)
                    } else if (_params.type == 2) {
                        item.info.forEach((items, index) => {
                            this.$set(_params, 'id', items.userid)
                            this.$set(_params, 'img', items.avatar ? items.avatar : this.headImg)
                            this.$set(_params, 'title', items.name)
                            this.$set(_params, 'w_id', 'ren' + items.userid)
                            this.$set(_params, 'approver_type', item.approver_type)
                            _list.push(_params.w_id)
                        })
                    } else if (_params.type == 4) {
                        this.$set(_params, 'id', item.value)
                        this.$set(_params, 'img', item.avatar ? item.avatar : this.headImg)
                        this.$set(_params, 'title', item.title)
                        this.$set(_params, 'w_id', 'top' + item.value)
                        this.$set(_params, 'approver_type', item.approver_type)
                        _list.push(_params.w_id)
                    } else if (_params.type == 5) {
                        this.$set(_params, 'id', JSON.parse(sessionStorage.getItem('userInfo')).userid)
                        this.$set(_params, 'img', JSON.parse(sessionStorage.getItem('userInfo')).avatar)
                        this.$set(_params, 'title', item.title)
                        this.$set(_params, 'w_id', 'sq' + JSON.parse(sessionStorage.getItem('userInfo')).id)
                        this.$set(_params, 'approver_type', item.approver_type)
                        _list.push(_params.w_id)
                    }
                    _lists.push(_params)
                })
                // this.auditorList = _lists
                if (init){
                    this.process.checkedAuditor = _lists
                }
                this.nodeList = JSON.parse(JSON.stringify(_lists))
                this.updataAuditor = JSON.parse(JSON.stringify(_lists))
            },
            init(val) {
                // console.log(this.type)
                this.processType = this.process.processType;
                if (this.$route.query.status != 8){
                    if (this.processType == 3) {
                        this.approvalBefore(this.process.checked.id,'','','init');//init正常拟稿时第一次进入设置页面需要将流程值保存到vuex
                    }
                }  else {//草稿箱第一次进入流程设置页面回显
                    // this.checked = this.process.checked
                    // this.popupChecked = this.process.checked
                    // this.approval_copy = this.process.checkedCopy
                    // if (this.process.processType == 3){
                    //     this.updataAuditor = this.process.checkedAuditor
                    //     this.nodeList = this.process.checkedAuditor
                    // } else if (this.process.processType == 2) {
                    //     this.auditorList = this.process.processNUm.results
                    //     this.auditType = this.process.processNUm.approver_type
                    // }
                }

                this.checked = this.process.checked ? JSON.parse(JSON.stringify(this.process.checked)) : {};
            }
        },
        beforeRouteEnter(to, from, next){
            let _processNew = store.state.processNew
            let _process_updata = store.state.processNew.process_updata
            let _process = store.state.processNew.process
            if (from.name == 'approval') {
                // console.log(store.state)
                _process_updata.checked = _process.checked ? JSON.parse(JSON.stringify(_process.checked)) : _process.checked
                _process_updata.popupChecked = _process.checked ? JSON.parse(JSON.stringify(_process.checked)) : _process.checked
                _process_updata.approval_copy = JSON.parse(JSON.stringify(_process.checkedCopy))
                _process_updata.edit_approval = _process.edit_approval
                _process_updata.edit_cclist = _process.edit_cclist
                _process_updata.processType = _process.processType
                if (_process.processType == 3){
                    _process_updata.updataAuditor = JSON.parse(JSON.stringify(_process.checkedAuditor))
                    _process_updata.nodeList = JSON.parse(JSON.stringify(_process.checkedAuditor))
                } else if (_process.processType == 2) {
                    _process_updata.auditorList = JSON.parse(JSON.stringify(_process.processNUm.results))
                    _process_updata.auditType = typeof _process.processNUm.approver_type == "number" ? _process.processNUm.approver_type.toString() : _process.processNUm.approver_type
                }
            } else if (from.name == 'selectpage' && from.query.key == 'cs') {
                _process_updata.approval_copy =JSON.parse(JSON.stringify(_processNew.cs.values)) ;
                // _process_updata.copyResult = _processNew.cs.value;
            } else if (from.name == 'selectpage' && from.query.key == 'next') {
                _process_updata.auditorList = JSON.parse(JSON.stringify(_processNew.next.values));
                // _process_updata.auditorResult = _processNew.next.value;
            }
            next()
        },
        created() {
        },
    };
</script>

<style lang="scss" scoped>
    .content {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background-color: #f7f8fa;
        font-size: 14px;

        .processContent {
            height: calc(100% - 55px);
            overflow-y: auto;
        }
    }

    .degree {
        width: 100%;
        box-sizing: border-box;
        height: auto;
        background-color: #fff;
        margin-bottom: 10px;

        .chiose {
            display: flex;
            align-items: center;
            font-size: 16px;
            padding: 10px 0 10px 15px;
            border: 1px solid #f5f6f7;

            .title {
                /*margin-left: 10px;*/
                color: #909399;
            }
        }

        .contentbox {
            /*padding: 20px 10px;*/
            background: #ffffff;
            padding: 10px 20px;

            .plus {
                margin: 0 auto;
                border: 1px solid #cccccc;
                width: 45px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .type {
                color: #303133;
                height: 48px;
                line-height: 48px;
            }

            .next {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                /*border-bottom: 1px solid #F5F6F7;*/

                .nextItem {
                    position: relative;
                    width: 60px;
                    margin-bottom: 10px;

                    .del {
                        position: absolute;
                        right: 0;
                    }

                    .nameTxt {
                        max-width: 60px;
                        text-align: center;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }

            .imgbox {
                display: flex;
                justify-content: center;
                margin-bottom: 5px;

                img {
                    width: 36px;
                    height: 36px;
                }
            }

            .copyUser {
                display: flex;
            }
        }

        .more {
            color: #0082ef;
            display: flex;
            flex-direction: row-reverse;
        }

        .current {
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            align-items: center;
            color: #6a8fce;
        }

        .contentItem {
            height: 48px;
            background: #ffffff;
            padding: 0 20px;

            .item {
                border-bottom: 1px solid #f2f2f2;
                height: 42px;
                line-height: 42px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .info {
                margin-left: 12px;
                text-align: center;
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                width: 34px;
                background: #eaf0fc;
                color: #839ccf;
            }
        }
    }

    .nextNode {
        padding: 0px 20px;
        margin-top: 10px;
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .noProcess {
        padding: 0px 20px;
        margin-top: 10px;
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nodeAudit {
        width: 55px;
    }

    /deep/ .van-popup {
        border-radius: 8px 8px 0px 0px;
        padding: 10px 15px;
        box-sizing: border-box;

        * {
            box-sizing: border-box;
        }
    }

    .popup {
        height: 100%;

        .popup-top {
            height: 90px;

            .title {
                color: #606266;
                font-size: 16px;
                display: flex;
                justify-content: center;
                margin-bottom: 10px;

                .btn {
                    padding: 5px 10px;
                    color: #0082ef;
                }
            }

            .van-search {
                padding: 0;
            }
        }

        .popup-btm {
            height: calc(100% - 90px);
            overflow: auto;

            /deep/ .van-cell {
                padding: 15px 0;
            }

            .item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .info {
                margin-left: 12px;
                text-align: center;
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                width: 34px;
                background: #eaf0fc;
                color: #839ccf;
            }
        }
    }

    .button {
        width: 100%;
        background: #ffffff;
        padding: 8px 15px;
        height: 55px;
        box-sizing: border-box;

        div {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            margin: 0 auto;
            background: #0082ef;
            color: #ffffff;
            font-size: 16px;
            text-align: center;
        }
    }

    .auditor {
        display: flex;
        align-items: center;
    }

    .redStar {
        margin-left: 4px;
        color: red;
        display: inline-block;
        height: 10px;
        line-height: 15px
    }

    .starSpan {
        width: 35%;
        display: flex;
        align-items: center;
        color: #ccc;
        font-size: 14px;
    }

    .width60 {
        width: 60%;
    }
</style>
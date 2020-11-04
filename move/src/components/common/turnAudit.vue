<template>
    <div class="content">
        <!-- 转审 -->
        <div class="degree">
            <div class="chiose">
                <div class="title">转审</div>
            </div>
            <div class="contentbox">
                <div class="next">
                    <div class="nextItem" v-for="(item, index) in auditor" :key="index">
                        <div class="imgbox">
                            <img style="height:36px;width:36px;border-radius:18px;"
                                 :src="item.img" alt/>
                        </div>
                        <div style="text-align: center">{{item.title}}</div>
                    </div>
                    <div @click="changeUser" style="width: 55px">
                        <div class="plus">
                            <van-icon size="20" color="#CCCCCC" name="plus"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--        附件-->
        <div class="degree">
            <div class="chiose">
                <div class="title">附件</div>
            </div>
            <div class="contentbox">
                <van-uploader :after-read="afterRead" class="upFile">
                    <img src="@/assets/img/newImg/hFile.png" />
                    <span>上传附件</span>
                </van-uploader>
                <div class="list">
                    <div v-for="(item,index) in filesList" :key="index">
                        <load-file :file="item" @delFile="delFile"></load-file>
                    </div>
                </div>
            </div>
        </div>
        <!--        取消确定-->
        <div class="btn">
            <van-button @click="changePage('cancel')" class="btnItem" type="default">取消</van-button>
            <van-button @click="changePage('submit')" class="btnItem" type="info">确定</van-button>
        </div>
        <!--          选择人员 -->
        <van-popup v-model="pel.depUserss" position="left" :style="{ height: '100%',width:'100%' }">
            <pickclass v-if="pel.depUserss" :pel="pel" />
        </van-popup>
    </div>
</template>

<script>
    import loadFile from "./loadFile";
    import {saveFile} from "@/assets/js/public";
    import pickclass from "../pickclass/pickclass";
    import store from "@/store";

    export default {
        name: "turnAudit",
        components:{
            loadFile,
            pickclass
        },
        data(){
            return{
                filesList:[],
                auditor:[],//转审人
                // pel: {
                //     depUserss: false, //选人的弹框
                //     type: 1,
                //     ckt: {
                //         zzjg: true, // 显示 组织架构
                //         bm: false, // 可以选部门
                //         ren: true, // 可以选人
                //         tag: false, // 显示 标签
                //         dw: true, // 显示 单位
                //         radio: true, // 是否为单选
                //     },
                //     result: [], // 打勾选中的
                //     results: [], // 打勾选中的所有信息
                // },
            }
        },
        props:{
            // files:{
            //     type:Array,
            //     default:() =>[]
            // },
            // turnUser:{
            //     type: Array,
            //     default:() =>[]
            // }
        },
            watch:{
          //   files:{
          //       deep:true,
          //     immediate:true,
          //     handler:function (val) {
          //         // console.log('file', val)
          //        this.filesList = val
          //     }
          // },
          //   $route(to, from) {
          //       if (from.name == 'sendingDetails'){
          //           this.auditor = this.$store.state.processNew && this.$store.state.processNew.turnUser.results ? this.$store.state.processNew.turnUser.results : []
          //           this.$store.state.processNew.turnUser.files = this.$store.state.processNew.app_files
          //           this.filesList = this.$store.state.processNew && this.$store.state.processNew.turnUser.files ? this.$store.state.processNew.turnUser.files : []
          //       } else if (from.name == 'selectpage' && from.query.key == 'zs'){
          //           this.auditor = this.processNew.zs.values
          //       }
          //   }
        },
        beforeRouteEnter(to, from, next){
            next(vm =>{
                if (from.name == 'sendingDetails'){
                    vm.auditor = store.state.processNew && store.state.processNew.turnUser.results ? store.state.processNew.turnUser.results : []
                    store.state.processNew.turnUser.files = store.state.processNew.app_files
                    vm.filesList = store.state.processNew && store.state.processNew.turnUser.files ? store.state.processNew.turnUser.files : []
                } else if (from.name == 'selectpage' && from.query.key == 'zs'){
                    vm.auditor = vm .processNew.zs.values
                }
            })
        },
        methods:{
            // 上传附件
            afterRead(files) {
                saveFile(files, this.callFile);
            },
            //七牛云上传返回来的文件数据
            callFile(val) {
                this.filesList.push(val);
                // console.log(1212, this.filesList)
            },
            //删除文件
            delFile(info) {
                this.filesList.forEach((item) => {
                    if (info.oldname == item.oldname && info.path == item.path) {
                        this.filesList.splice(item, 1);
                    }
                });
            },
            //按钮
            changePage(val){
                if (val == 'submit'){
                    let params = {
                        type: val,
                        results:this.pel.results,
                        result: this.pel.results.map(item =>item.w_id),
                        files:this.filesList
                    }
                    this.processNew.app_files = this.filesList
                    // this.$emit('changTurnUser',  params)
                    this.$store.commit('setTurnUser', params)
                    this.$router.go(-1)
                    // console.log('params', params)
                        // console.log('pel', this.pel)
                } else {
                    this.$emit('changTurnUser',  {type:val})
                    this.$router.go(-1)
                }
                // this.$set(this, 'filesList', [])
                // this.$set(this.pel, 'results', [])
            },
            changeUser(){
                this.pel.ckt = {
                            zzjg: true, // 显示 组织架构
                            bm: false, // 可以选部门
                            ren: true, // 可以选人
                            tag: false, // 显示 标签
                            dw: true, // 显示 单位
                            radio: true, // 是否为单选
                        }
                        this.processNew.zs = {
                            value: this.auditor.map(item =>item.w_id),
                            values: this.auditor,
                        }
                this.$router.push({
                    path: "/selectpage",
                    query: {
                        key: 'zs',
                        type:'1'
                    },
                });
            }
        },
        activated() {
            // console.log('turnUser', this.$store.state.processNew.turnUser)
            // this.turnUser = this.$store.state.processNew && this.$store.state.processNew.turnUser ? this.$store.state.processNew.turnUser : {}
            // this.pel.results = this.turnUser.results
            // this.filesList = this.turnUser.files
            // this.pel.result = this.turnUser.length > 0 ? this.pel.results : []
        },
        computed:{
            pel() {
                // console.log(this.$store.state.edittext.pel)
                return this.$store.state.edittext.pel;
            },
            document_arrs() {
                return this.$store.state.edittext.document_arrs;
            },
            turnUser () {
               return this.$store.state.processNew && this.$store.state.processNew.turnUser ? this.$store.state.processNew.turnUser : {}
            },
            processNew() {
                return this.$store.state.processNew
            }
        },
        created() {
            // console.log('turnUser', this.$store.state.processNew.turnUser)
        }

    }
</script>

<style lang="scss" scoped>
    .content {
        width: 100%;
        box-sizing: border-box;
        background-color: #F7F8FA;
        font-size: 14px;
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
            border: 1px solid #F5F6F7;

            .title {
                /*margin-left: 10px;*/
                color: #909399;
            }
        }

        .contentbox {
            /*padding: 20px 10px;*/
            background: #FFFFFF;
            padding: 20px 20px;

            .plus {
                margin: 0 auto;
                border: 1px solid #CCCCCC;
                width: 45px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center
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

                .nextItem {
                    width: 60px;

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
            .upFile{
                background: #F9F9F9;
                width: 100%;
                height: 48px;
                line-height: 48px;
                color: #606266;
                text-align: center;
                display: flex;
                justify-content: center;
                border: 1px dotted #CCCCCC;
                margin-bottom: 10px;
                img{
                    width: 11px;
                    height: 12px;
                }
            }
            .list{
                max-height: 40%;
                overflow: scroll;
            }
        }
    }
    .btn{
        /*height: 60px;*/
        width: 90%;
        background: #ffffff;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        position: fixed;
        bottom: 0;
        .btnItem{
            width: 49%;
            height: 44px;
        }
    }
</style>
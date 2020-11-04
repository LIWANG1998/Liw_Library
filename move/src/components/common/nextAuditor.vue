<template>
    <div class="box">
        <!--            指定下一节点审批人-->
        <div class="degree">
            <div class="chiose">
                <div class="title">指定下一审批节点</div>
            </div>
            <div class="contentbox">
                <div class="next">
                    <div class="nextItem" v-for="(item, index) in nextLists" :key="index">
                        <van-icon @click="onDelUser(index)" class="del" name="clear"/>
                        <div class="imgbox">
                            <img style="height:36px;width:36px;border-radius:18px;"
                                 :src="item.img" alt/>
                        </div>
                        <div class="name" style="text-align: center">{{item.title}}</div>
                    </div>
                    <div @click="changeNextAuditor" style="width: 55px">
                        <div class="plus">
                            <van-icon color="#CCCCCC" name="plus"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--                    审批方式-->
        <div class="degree">
            <div class="chiose">
                <div class="title">审批方式</div>
            </div>
            <div class="contentbox" >
                <van-radio-group v-model="auditorType" direction="horizontal">
                    <van-radio style="margin-right: 70px" name="2">或签</van-radio>
                    <van-radio name="1">会签</van-radio>
                </van-radio-group>
            </div>
        </div>
        <!--        取消确定-->
        <div class="btn">
            <van-button @click="changeTurn('cancel')" class="btnItem" type="default">取消</van-button>
            <van-button @click="changeTurn('submit')" class="btnItem" type="info">确定</van-button>
        </div>
<!--        &lt;!&ndash;          选择人员 &ndash;&gt;-->
<!--        <van-popup v-model="pel.depUserss" position="left" :style="{ height: '100%',width:'100%' }">-->
<!--            <pickclass v-if="pel.depUserss" :pel="pel" />-->
<!--        </van-popup>-->
    </div>
</template>

<script>
    import pickclass from "../pickclass/pickclass";
    export default {
        name: "nextAuditor",
        components:{
            pickclass
        },
        data(){
            return {
                auditorType:'2',
                // pel: {
                //     depUserss: false, //选人的弹框
                //     type: 1,
                //     ckt: {
                //         zzjg: true, // 显示 组织架构
                //         bm: false, // 可以选部门
                //         ren: true, // 可以选人
                //         tag: false, // 显示 标签
                //         dw: true, // 显示 单位
                //         radio: false, // 是否为单选
                //     },
                //     result: [], // 打勾选中的
                //     results: [], // 打勾选中的所有信息
                // },
                nextList:[],//下一节点审核列表
                nextLists:[],//下一节点审核详情列表
            }
        },
        props:{
            nextPeo:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            nextPeo:{
                handler:function (val) {
                    if (val){
                        this.pel.result = val.result
                        this.pel.results = val.results
                        this.auditorType = val.auditorType
                    }
                }
            },
            $route(to, from){
                if (from.name == 'sendingDetails') {
                   this.nextList = this.jsonParams(this.processNew.nextPeo.result)
                   this.nextLists =  this.jsonParams(this.processNew.nextPeo.results)
                    this.auditorType = this.processNew.nextPeo.auditorType
                } else if (from.name == 'selectpage' && from.query.key) {
                    this.nextList =  this.jsonParams(this.processNew.nextVal.value)
                    this.nextLists =  this.jsonParams(this.processNew.nextVal.values)
                }
            }
        },
        methods:{
            //拷贝
            jsonParams(val) {
                return JSON.parse(JSON.stringify(val))
            },
            //确定取消
            changeTurn(type){
              // console.log('type', type)
                if (type == 'submit') {
                    let params = {
                        result:this.nextList,
                        results:this.nextLists,
                        auditorType: this.auditorType
                    }
                    // this.$emit('changeNext', params)
                    this.processNew.nextPeo = params
                }
                this.$router.go(-1)
            },
            //跳转到选择人页面
            changeNextAuditor(){
                this.pel.ckt = {
                    zzjg: true, // 显示 组织架构
                    bm: false, // 可以选部门
                    ren: true, // 可以选人
                    tag: false, // 显示 标签
                    dw: false, // 显示 单位
                    radio: false, // 是否为单选
                }
                let _value = this.nextLists.map(item =>item.w_id)
                this.processNew.nextVal = {
                    value:_value,
                    values: this.nextLists
                }
                this.$router.push({
                    path: "/selectpage",
                    query: {
                        key: 'nextVal',
                        type:'1'//审核流程里面所有选人数据
                    },
                });
            },
            //删除下一审批人
            onDelUser(index) {
                    this.nextLists.splice(index, 1);
                    this.nextList.splice(index, 1);
            },
        },
        computed:{
            processNew(){
                // console.log('下一审批节点nextAuditor', this.$store.state.processNew)
                return this.$store.state.processNew
            },
            pel() {
                // console.log(this.$store.state.edittext.pel)
                return this.$store.state.edittext.pel;
            },
        },
        activated() {
            // this.nextLists = this.processNew.nextPeo.results
            // this.nextList = this.processNew.nextPeo.result
        }
    }
</script>

<style lang="scss" scoped>
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
                font-size: 16px;
                color:#303133;
            }
        }
        .contentbox {
            /*padding: 20px 10px;*/
            background: #FFFFFF;
            padding: 10px 20px;

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
                    position: relative;
                    width: 60px;
                    margin-bottom: 10px;
                    .del {
                        position: absolute;
                        right: 0;
                    }
                    .name {
                        text-align: center;
                        max-width: 70px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .imgbox {
                display: flex;
                justify-content: center;
                margin-bottom: 5px;
                img{
                    width: 36px;
                    height: 36px;
                }
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
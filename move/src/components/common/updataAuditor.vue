<template>
    <div>
        <div class="next">
            <div class="nextItem" v-for="(item, index) in updataAuditor" :key="index">
                <div class="userItem">
                    <van-icon v-if="edit_approval == 1" @click="onDelUser(index)" class="del" name="clear" />
                    <div class="imgbox">
                        <img style="height:36px;width:36px;border-radius:18px;"
                             :src="item.img" alt/>
                    </div>
                    <div class="name" style="text-align: center">{{item.title}}</div>
                </div>
                <van-icon v-if="updataAuditor.length !== index + 1 && edit_approval == 1" color="#CCCCCC" name="ellipsis" />
                <div v-if="updataAuditor.length !== index + 1 && edit_approval == 1" @click="changeAuditor(index)" class="plusMin">
                    <van-icon color="#CCCCCC" name="plus"/>
                </div>
<!--                <van-icon v-if="updataAuditor.length !== index + 1 && edit_approval == 1" color="#CCCCCC" name="ellipsis" />-->
                <van-icon v-if="updataAuditor.length !== index + 1" color="#CCCCCC" name="ellipsis" />
<!--                <van-icon v-if="auditorList.length == ++index" color="#CCCCCC" name="ellipsis" />-->
            </div>
            <div v-if="edit_approval == 1" @click="changeAuditor()" style="margin-left: 10px">
                <div class="plus">
                    <van-icon color="#CCCCCC" name="plus"/>
                </div>
            </div>
        </div>
<!--        &lt;!&ndash;          选择人员 &ndash;&gt;-->
<!--        <van-popup v-model="pel.depUserss" position="left" :style="{ height: '100%',width:'100%' }">-->
<!--            <pickclass @choiseUsercg="choiseUsercg($event)" v-if="pel.depUserss" :pel="pel" />-->
<!--        </van-popup>-->
    </div>
</template>

<script>
    import pickclass from "../pickclass/pickclass";
    export default {
        name: "updataAuditor",
        components:{pickclass},
        data() {
            return {
                auditorList: [],//审核人数组
               // pel: {
               //      depUserss: false, //选人的弹框
               //      ckt: {
               //          zzjg: true, // 显示 组织架构
               //          bm: true, // 可以选部门
               //          ren: true, // 可以选人
               //          tag: false, // 显示 标签
               //          dw: true, // 显示 单位
               //          radio: true, // 是否为单选
               //      },
               //      result: [], // 打勾选中的
               //      results: [], // 打勾选中的所有信息
               //  },
               //  index:undefined,//记录在哪个节点添加审核
                headImg: require("@/assets/img/newImg/headImg.png"),
            }
        },
        props:{
            nodeList:{//父组件初始化传的数据
                type:Array,
                default: ()=>[]
            },
            // edit_approval:{
            //     type: [String,Number],
            //     default: () =>[]
            // },
            rePage:{
                type: [String,Boolean],
                default: () =>false
            }
        },
        computed:{
            pel() {
                // console.log(this.$store.state.edittext.pel)
                return this.$store.state.edittext.pel;
            },
            document_arrs() {
                return this.$store.state.edittext.document_arrs;
            },
            process(){
                return this.$store.state.processNew && this.$store.state.processNew.process ? this.$store.state.processNew.process : {};
            },
            processNew(){
                return this.$store.state.processNew ? this.$store.state.processNew : {};
            },
            updataAuditor(){
                return this.$store.state.processNew.process_updata.updataAuditor ? this.$store.state.processNew.process_updata.updataAuditor : [];
            },
            edit_approval(){
                // console.log('edit_approval', this.$store.state.processNew.process_updata.edit_approval)
                return this.$store.state.processNew.process_updata.edit_approval ? this.$store.state.processNew.process_updata.edit_approval : 0;
            },
            index: {
                get() {
                    return  this.$store.state.processNew.index;
                },
                set(value) {
                    this.$store.state.processNew.index = value;
                },
            }
        },
        methods: {
            //添加审批人
            changeAuditor(index) {
                if (index !== undefined){
                    // console.log('index', index)
                    this.index = index//哪个节点操作
                }
               // this.pel.depUserss = true
                this.processNew.auditor = {
                    value: [],
                    values: [],
                }
                this.pel.ckt = {
                    zzjg: true, // 显示 组织架构
                    bm: true, // 可以选部门
                    ren: true, // 可以选人
                    tag: false, // 显示 标签
                    dw: true, // 显示 单位
                    radio: true, // 是否为单选
                }
                this.$router.push({
                    path: "/selectpage",
                    query: {
                        key: 'auditor',
                        type:'1'
                    },
                });
            },
            //确定选择审核人
            // choiseUsercg(val){
            //     // console.log('val', this.pel)
            //     if (this.index !==undefined && this.pel.results && this.pel.results.length > 0){
            //         this.pel.results[0].approver_type = 2
            //         this.auditorList.splice(this.index, 0,this.pel.results[0])
            //         // console.log(this.auditorList)
            //     } else if (this.index ==undefined && this.pel.results && this.pel.results.length > 0){
            //         this.pel.results[0].approver_type = 2
            //         this.auditorList.push(this.pel.results[0])
            //     }
            //     this.index = undefined
            //     this.pel.results = []
            //     this.pel.result = []
            //     // console.log(this.auditorList)
            // },
        //    删除审核人
            onDelUser(index){
                this.updataAuditor.splice(index, 1)
            }
        },
        watch:{
            $route(to, from) {
                if (from.name == 'selectpage' && from.query.key == 'auditor'){
                    if (this.processNew.auditor && this.processNew.auditor.values){
                        let _pel = this.processNew.auditor.values[0]
                        _pel.approver_type = 2
                        if (this.index !== ""){
                            let _index = this.index + 1
                            this.updataAuditor.splice(_index, 0, _pel)
                        } else {
                            this.updataAuditor.push(_pel)
                        }
                        this.index = ''
                    }
                }
            },
        },
    }
</script>

<style lang="scss" scoped>

    .next {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-bottom: 1px solid #F5F6F7;
        padding-bottom: 10px;

        .nextItem {
            max-width: 33%;
            /*margin-bottom: 10px;*/
            display: flex;
            align-items: center;
            .imgbox {
                display: flex;
                justify-content: center;

                img {
                    width: 36px;
                    height: 36px;
                }
            }
            /*.iconPlus{*/
                display: flex;
                .plusMin{
                    width: 20px;
                    height: 20px;
                    border: 1px solid #CCCCCC;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .van-icon{
                    display: flex;
                    align-items: center;
                    margin: 0 5px;
                }
            /*}*/
          .userItem{
              position: relative;
              width: 60px;
              .del{
                  position: absolute;
                  right:0;
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

        .plus {
            margin: 0 auto;
            border: 1px solid #CCCCCC;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center
        }
    }
</style>
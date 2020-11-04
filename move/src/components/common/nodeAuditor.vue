<template>
    <div class="content">
        <div class="node" v-for="(item, index) in list" :key="index">
            <div class="title">
                <img src="@/assets/img/newImg/checked.png" alt />
                <span v-if="item.title == '单个成员'">{{item.info[0].dname[0]}}</span>
                <span v-else-if="item.title == '申请人'">申请人</span>
                <span v-else>{{item.title}}</span>
    <!--                <san class="type" v-if="item.info.length > 1 && item.approver_type == 1">会签</san>-->
    <!--                <san class="type" v-if="item.info.length > 1 && item.approver_type == 2">或签</san>-->
            </div>
            <div class="auditContent">
                <div v-for="(items, num) in item.info" :key="num">
                        <div  class="nodeAudit">
                            <div class="imgbox">
                                <img :src="items.avatar" alt/>
                            </div>
                            <div style="text-align: center">{{items.name}}</div>
                        </div>
                </div>
                <div @click="changeAuditor(index)" style="width: 44px">
                    <div class="plus">
                        <van-icon color="#CCCCCC" name="plus"/>
                    </div>
                </div>
            </div>
        </div>
        <!--          选择人员 -->
        <van-popup v-model="pel.depUserss" position="left" :style="{ height: '100%',width:'100%' }">
            <pickclass v-if="pel.depUserss" :pel="pel" />
        </van-popup>
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
                list:[],
                pel: {
                    depUserss: false, //选人的弹框
                    ckt: {
                        zzjg: true, // 显示 组织架构
                        bm: true, // 可以选部门
                        ren: true, // 可以选人
                        tag: false, // 显示 标签
                        dw: true, // 显示 单位
                        radio: true, // 是否为单选
                    },
                    result: [], // 打勾选中的
                    results: [], // 打勾选中的所有信息
                },

            }
        },
        props:{
            nodeList:{
                default:undefined
            }
        },
        methods:{
            //选择审核人
            changeAuditor(){
                this.pel.depUserss = true
            }
        },
        watch: {
            nodeList: {
                handler: function (val) {
                    let _this = this
                    if (val){
                        let List = []
                        let Params = {}
                        val.forEach((item, index) =>{
                            item.info.forEach((item, index) =>{

                            })
                        })

                    }

                }
            },
            'pel.results':{
                deep:true,
                handler:function (val) {
                    if (val){
                        // let arr = JSON.parse(JSON.stringify(this.list)).concat(val)
                        // // console.log('arr', arr)
                        // val.forEach((item, index) =>{
                        //    arr.push({
                        //
                        //    })
                        // })
                        // // console.log(111,this.$store.state.document_arr)
                    }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
      .node{
          .title{
              display: flex;
              align-items: center;
              font-weight:500;
              img{
                  height: 16px;
                  width: 16px;
                  margin-right: 10px;
              }
              span{
                  font-size: 14px;
                  color: #303133;
              }
          }
          .auditContent{
              margin-left: 8px;
              border-left: 2px solid #E5E5E5;
              padding: 10px 0;
              display: flex;
              flex-wrap: wrap;
                  .nodeAudit {
                      width: 55px;
                      margin-left: 10px;
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
              .plus {
                  margin: 0 auto;
                  border: 1px solid #CCCCCC;
                  width:40px;
                  height: 40px;
                  display: flex;
                  justify-content: center;
                  align-items: center
              }
          }
      }
    }
</style>
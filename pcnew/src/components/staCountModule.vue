<template>
    <div class="sta-count">
        <ul>
            <li v-for="(item,index) in countArr" :key="index" @click="seeDetail(item.name,item.class,item.type)"
                :class="item.class ? item.class : ''">
                <div class="top">
                    <div class="left">
                        <img :src="item.path" alt="">
                    </div>
                    <div class="right">
                        <p class="num">{{item.num}}</p>
                        <p class="name">{{item.name}}</p>
                    </div>
                </div>
                <div class="bottom">
                    <p class="tips" v-show="item.tipsText">{{item.tipsText}}</p>
                    <p class="tips" v-show="item.tipsText2">{{item.tipsText2}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "staCountModule",
        props: {
            countArr: {
                type: Array,
                default: () => [{
                    path: require('@/assets/images/homePage/myTask1.png'),
                    num: 100,
                    name: '当前逾期数量',
                    tipsText: '',
                    tipsText2: '',
                    type:1,
                }]
            },
            countType: {type: String},
            countRole: {type: Number}, //1部门 2公司
            countTime: {type: Number},//发起时间类型
            countObj: {type: Object},//汇总排行榜的搜索
        },
        data() {
            return {
                dataArr: [],
            }
        },
        methods: {
            //isOverdueTime 逾期次数不能点进详情  汇总排行榜的详情只有最高权限-系统管理员能进
            // type 1待处理 2逾期数量  3逾期次数 4完成数量 5我/部门参与的 6我/部门发起的 7任务总数
            //     待处理：所属部门、发起+接收、执行中、全部、动态获取、全部
            //     逾期数量：所属部门、发起+接收、逾期、全部、动态获取、全部
            //     完成数量：所属部门、发起+接收、已完成、全部、动态获取、全部
            //     部门参与的：所属部门、接收+抄送、全部、全部、动态获取、全部
            //     部门发起的：所属部门、发起、全部、全部、动态获取、全部
            //     任务总数：所属部门、全部、全部、全部、动态获取、全部
            //     全员人员任务统计：
            //     待处理：全部、发起+接收、执行中、全部、动态获取、全部
            //     逾期数量：全部、发起+接收、逾期、全部、动态获取、全部
            //     完成数量：全部、发起+接收、已完成、全部、动态获取、全部
            //     任务总数：全部、全部、全部、全部、动态获取、全部
            seeDetail(name, isOverdueTime, type) {
                let staCountFilter = {
                    statUser: this.countRole,//人员范围或排行维度
                    strarUserId: '',//人员范围id或排行维度id
                    taskRole: '1,2,3',//任务角色
                    taskLevel: '0,1,2',//任务级别
                    taskStatus: '1,2,3,4,5',
                    startTimeType: this.countTime ? this.countTime : 0,
                    sStartTime: null,
                    sEndTime: null,
                    endTimeType: 0,
                    eStartTime: null,//结束时间-开始时间
                    eEndTime: null,//结束时间-结束时间
                };
                // staCountFilter.sStartTime = this.countTimeDiy ? this.countTimeDiy.split(',')[0] : null;
                // staCountFilter.sEndTime = this.countTimeDiy ? this.countTimeDiy.split(',')[1] : null;
                // if (this.countType === 'rankList') {
                //     switch(type) {
                //         case 1:
                //             this.countObj
                //     }
                //     staCountFilter = this.countObj;
                // } else {
                //     //部门
                    
                // }
                if (this.countRole === 2 || this.countRole === 1) {
                    switch (type) {
                        case 1:
                            staCountFilter.taskRole = '1,2';
                            staCountFilter.taskStatus = '1,2,5';
                            break;
                        case 2:
                            staCountFilter.taskRole = '1,2';
                            staCountFilter.taskStatus = '3,5';
                            break;
                        case 4:
                            staCountFilter.taskRole = '1,2';
                            staCountFilter.taskStatus = '4,3';
                            break;
                        case 5:
                            staCountFilter.taskRole = '2,3';
                            break;
                        case 6:
                            staCountFilter.taskRole = '1';
                            break;
                        case 7:
                            staCountFilter.taskRole = '1,2,3';
                            break;
                        default:
                            break;
                    }
                } else if (this.countRole === 0) {
                    switch (type) {
                        case 1:
                            staCountFilter.taskRole = '1,2';
                            staCountFilter.taskStatus = '1,2,5';
                            break;
                        case 2:
                            staCountFilter.taskRole = '1,2';
                            staCountFilter.taskStatus = '3,5';
                            break;
                        case 4:
                            staCountFilter.taskRole = '1,2';
                            staCountFilter.taskStatus = '4,3';
                            break;
                        case 7:
                            staCountFilter.taskRole = '1,2,3';
                            break;
                        default:
                            break;
                    }
                }
                if(this.countType === 'rankList') {
                    staCountFilter.taskLevel = this.countObj.taskLevel;
                }
                let obj = JSON.parse(sessionStorage.getItem('userInfo'));
                if (this.countType === 'myTaskCount' && !isOverdueTime) {
                    sessionStorage.setItem('staCountFilter', JSON.stringify(staCountFilter));
                    this.$router.push({
                        path: '/dataSta/taskCountTask',
                        query: {id: obj.userid, name: obj.name}
                    })
                } else if (parseInt(obj.is_system) === 4 && !isOverdueTime && this.countType == 'rankList') {
                    sessionStorage.setItem('staCountFilter', JSON.stringify(staCountFilter));
                    this.$router.push({
                        path: '/dataSta/taskCountPeople',
                        query: {name: name, role: this.countRole}
                    })
                } else {
                    if (!isOverdueTime) {
                        sessionStorage.setItem('staCountFilter', JSON.stringify(staCountFilter));
                        this.$router.push({
                            path: '/dataSta/taskCountPeople',
                            query: {name: name, role: this.countRole}
                        })
                    }

                }

            },

        },
    }
</script>

<style scoped lang="less">
    .sta-count {
        width: 100%;

        ul {
            display: flex;
            flex-wrap: wrap;

            li {
                width: 25%;
                margin-right: 28px;
                height: 116px;
                border-radius: 4px;
                box-sizing: border-box;
                padding: 10px 17px;
                margin-bottom: 30px;
                cursor: pointer;
                background: #FFFFFF;
                box-shadow: 0 2px 12px rgba(48, 49, 51, 0.1);

                .top {
                    height: 70px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;

                    .left {
                        flex: 1;

                        img {
                            width: 62px;
                            height: 62px;
                        }
                    }

                    .right {
                        flex: 1;

                        .num {
                            font-size: 26px;
                            font-weight: 500;
                            line-height: 37px;
                        }

                        .name {
                            font-size: 15px;
                            font-weight: 500;
                            line-height: 21px;
                        }
                    }
                }

                .bottom {
                    margin-top: 5px;
                    width: 100%;
                    height: 20px;
                    display: flex;
                    justify-content: space-between;

                    .tips {
                        line-height: normal;
                        padding: 2px 5px;
                        border-radius: 3px;
                        font-size: 12px;
                        color: #303133;
                        background-color: #F4F4F5;
                    }
                }


            }

            li:hover {
                background: linear-gradient(135deg, #53B2FF 0%, #5784FF 100%);

                .right {
                    .num {
                        color: #fff;
                    }

                    color: #fff;
                }

                .tips {
                    background-color: rgba(244, 244, 245, 0.31);
                    color: #396AE9;
                }
            }

            .isBan {
                cursor: not-allowed;
            }

            .count-active {

            }

            /*
                        .count-normal {
                            background: #FFFFFF;
                            box-shadow: 0 2px 12px rgba(48, 49, 51, 0.1);

                            .tips {
                                color: #303133;
                                background-color: #F4F4F5;
                            }
                        }*/

            li:nth-child(1) {
                .num {
                    color: #F49D39;
                }
            }

            li:nth-child(2) {
                .num {
                    color: #FF7968;
                }
            }

            li:nth-child(3) {
                .num {
                    color: #866FF8;
                }
            }

            li:nth-child(4) {
                .num {
                    color: #0082EF;
                }
            }

            li:nth-child(5) {
                .num {
                    color: #3FCD74;
                }
            }

            li:nth-child(6) {
                .num {
                    color: #F49D39;
                }
            }

            li:nth-child(7) {
                .num {
                    color: #0082EF;
                }
            }
        }

        /* 1920 */
        @media screen and (min-width: 1368px) {
            ul {
                li {
                    width: calc(25% - 28px);
                }

                li:nth-child(4n) {
                    margin-right: 0;
                }
            }
        }
        /*1280 1366*/
        @media screen and (min-width: 1026px) and (max-width: 1367px) {
            ul {
                li {
                    width: calc(33% - 28px);
                }

                li:nth-child(3n) {
                    margin-right: 0;
                }
            }
        }
    }
</style>
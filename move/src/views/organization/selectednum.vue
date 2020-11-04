<template>
    <div>
        <!-- 搜索栏 -->
        <div class="header">
            <van-search
                    v-model="searchInfo"
                    placeholder="搜索姓名"
                    @input.native="inputSearchInfo(searchInfo)"
                    @clear="clearData()"
                    background="#FFFFFF"
                    class="searchBox"
                    input-align="center"
            />
        </div>
        <!--        下拉列表-->
        <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad"
        >
            <van-cell v-for="(item,index) in list" :key="index">
                <div class="listTitle">
                    <div class="left">
                        <img class="fileimg" src="../../assets/img/home/zuzhifile.png" alt/>
                        <div>{{item.name}}</div>
                    </div>
                    <div class="right"><van-icon name="clear" /></div>
                </div>
                <div class="person" v-for="(person,col) in item.personList" :key="col">
                    <div class="left">
                        <img class="fileimg" src="../../assets/img/home/grsh.png" alt/>
                        <div>{{person.name}}</div>
                    </div>
                    <div @click="deletePerson(col,index)" class="right"><van-icon name="clear" /></div>
                </div>
            </van-cell>
        </van-list>
        <!--        底部已选人数总数-->
        <div class="bottommenu">
            <div class="left" ></div>
            <div class="right">
                <div class="total" style="margin-right: 20px;color:#303133">已选人员：<span
                        style="color: #0082EF">{{total}}人</span></div>
                <van-button round type="info">确定</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "selectednum",
        data() {
            return {
                searchInfo: "",
                loading: false,
                finished: true,
                list: [
                    {name: '党委办公室',
                     personList:[{name:' 张锦麟'}]
                    },
                    {name:'技术部',
                        personList:[{name:' 张三'}]
                    }
                ],
                total: '23',//总人数
            }
        },
        methods: {
            inputSearchInfo(val) {
                // console.log(val)
            },
            clearData() {

            },
            onLoad() {
                // 异步更新数据
                setTimeout(() => {


                    // 加载状态结束
                    this.loading = false;


                }, 500);
            },
            //删除
            deletePerson(col,index){
                // console.log(col, index)
                this.list[col].personList.splice(index,1)
                this.total = --this.total
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        background-color: #FFFFFF;

        .searchBox {
            background-color: #FFFFFF;
            width: 100%;
            height: 48px;
            box-shadow: 0px 1px 0px rgba(230, 237, 245, 1);

        }
    }
/*    列表title样式*/
    .van-cell{
        padding: 0 0.38647rem;
    }
    .listTitle, .person{
        display: flex;
        justify-content: space-between;
        height: 60px;
        line-height: 60px;
        color: #2D3034;
        .left{
            display: flex;
            align-items: center;
            img{
                height: 40px;
                width: 40px;
                vertical-align: middle;
                margin-right: 10px;
            }
        }
    }
    /*底部总数*/
    .bottommenu {
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        height: 60px;
        line-height: 60px;
        width: 100%;
        box-sizing: border-box;
        position: fixed;
        bottom: 0;
        background-color: #FFFFFF;

        .left {
            color: #4A77AC;
        }

        .right {
            display: flex;
            align-items: center;
        }
    }
</style>
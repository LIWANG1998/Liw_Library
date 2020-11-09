<template>
    <div>
        <header class="page-header">关于轻松任务</header>
        <div class="split-box"></div>
        <div class="content">
            <img class="content_img" src="@/assets/images/aboutUs.png">
            <div class="content_edit">轻松任务 {{surplus}}</div>
            <div class="surplus pt44px">剩余到期时间</div>
            <div class="surplus_time">{{overdue_day_time}}(剩余时间{{overdue_day}}天)</div>
<!--            <div class="surplus pt44px">迭代历史</div>-->
<!--            <div class="surplus_time">轻松任务{{surplus}}主要更新-->
<!--                <spna class="allCheck">查看所有</spna>-->
<!--            </div>-->
<!--            <div class="surplus pt44px">核心操作流程</div>-->
<!--            <a class="surplus_a">如何发布任务?</a><br>-->
<!--            <a class="surplus_a">如何催办?</a>-->
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import { common } from '@/api'
    export default {
        name: "index",
        data(){
            return {
                surplus: 'V1.0.1',
                overdue_day: "",
                overdue_day_time: ""
            }
        },
        methods:{
            async getOverdue(){
                let res = await common.getOverdue()
                if (res && res.data){
                    console.log(res)
                    this.overdue_day = res.data.overdue_day
                    this.overdue_day_time = moment().add('days',parseInt(res.data.overdue_day)).format('YYYY年MM月DD日');
                }
            },
        },
        created() {
             this.getOverdue()
        }
    }
</script>

<style scoped lang="less">
 .content {
     padding: 20px;
     .content_img{
         height: 123px;
         width: 123px;
     }
     .content_edit{
         padding-top: 10px;
         font-size: 16px;
         font-weight: 500;
         line-height: 17px;
         color: #303133;
     }
     .pt44px{
         padding-top: 44px;
     }
     .surplus{
         font-size: 24px;
         font-weight: 500;
         line-height: 33px;
         color: #303133;
     }
     .surplus_time{
         padding: 10px 0;
         font-size: 15px;
         font-weight: 500;
         line-height: 21px;
         color: #909399;
     }
     .allCheck{
         margin-left: 20px;
         font-weight: 500;
         line-height: 21px;
         color: #0082EF;
     }
         .surplus_a{
             display: inline-block;
             color: #0082EF;
             margin-top: 15px;
             font-size: 15px;
             text-decoration:underline;
         }
 }
</style>
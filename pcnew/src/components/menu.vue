<template>
    <div class="menu-list">
        <a-menu  :default-selected-keys="['homePage']" :open-keys.sync="openKeys"
                :inline-collapsed="collapsed"
                mode="inline"  :selectedKeys="[$route.path]">
            <a-sub-menu :key="index" v-for="(item,index) in menuNew" >
                <span slot="title">
                    <span class="anticon"><img :src="item.icon" alt="" style="width: 16px;height: 16px;margin:-3px 5px 0 0"></span>
                    <span>{{item.name}}</span>
                </span>
                <a-menu-item :key="v.path" v-for="v in item.children">
                    <router-link :to="v.path" v-if="v.path=='/dataSta/dataScreen'" tag="a" target="_blank">
                        <span class="menu-circle"></span>
                        <span>{{v.name}}</span>
                    </router-link>
                     <router-link :to="v.path" v-else>
                        <span class="menu-circle"></span>
                        <span>{{v.name}}</span>
                    </router-link>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>

</template>

<script>
    import  {deepClone} from "@/assets/js/common";
    export default {
        name: "menuList",
        props:['collapsed','role','canAdd'],
        data(){
            return{
                menuArr: [
                    {name:'任务管理',icon:require('@/assets/images/menu1.png'),role:'user',show:true,children:[
                            {name:'首页',path:'/homePage',role:'user'},
                            {name:'执行中',path:'/taskList/executing',role:'user',show:true},
                            {name:'已结束',path:'/taskList/finished',role:'user',show:true},
                            {name:'发起任务',path:'/taskDetail/addTask',role:'user',show:true},
                            {name:'草稿箱',path:'/taskList/drafts',role:'user',show:true},
                            {name:'标签管理',path:'/labelManage',role:'user',show:true},
                            {name:'回收站',path:'/taskList/recycleBin',role:'user',show:true},
                        ]},
                    {name:'数据统计',icon:require('@/assets/images/menu2.png'),role:'user',show:true,children:[
                            {name:'汇总排行榜',path:'/dataSta/rankingList',role:'user',show:true},
                            {name:'周/月报历史',path:'/dataSta/monthlyReport',role:'user',show:true},
                            {name:'全部任务',path:'/taskList/allTask',role:'user',show:true},
                            {name:'轻松任务数据大屏',path:'/dataSta/dataScreen',role:'admin',show:false},
                        ]},
                    {name:'后台管理',icon:require('@/assets/images/menu3.png'),role:'admin',show:false,children:[
                            {name:'通讯录',path:'/backManage/depart',role:'admin',show:false},
                            {name:'权限管理',path:'/backManage/role',role:'admin',show:false},
                            {name:'接口管理',path:'/backManage/interface',role:'admin',show:false},
                            {name:'激励语管理',path:'/backManage/encourageWords',role:'admin',show:false},
                        ]},
                ],//role:user/admin 判断是普通用户还是管理员
                current: ['mail'],
                openKeys: [0,1,2],
                // openKeys: [],
                menuNew:[],
                // selectedKeys:this.$route.path === '/home' ? '/homePage' : this.$route.path
            }
        },
        watch:{
            role:{
                handler(val){
                    this.getRole(val)
                },
                deep:true,
            },
            collapsed(val){
                // console.log(val)
                if (val){
                    this.openKeys = []
                } else {
                    this.openKeys = [0,1,2]
                }
            },
        },
        created(){
            this.getRole(0)
        },
        methods: {
            getRole(val){
                //  > 0管理员 == 0普通用户  3系统管理员
                this.menuNew = deepClone(this.menuArr);
                if (parseInt(val) === 0) {
                    this.menuNew.forEach(item => {
                        item.children = item.children.filter(item => item.role == "user");
                    });
                    this.menuNew = this.menuNew.filter(item => item.role == "user");
                }
                if (parseInt(this.canAdd) !== 1){
                    this.menuNew[0].children = this.menuNew[0].children.filter(item => item.name !== "发起任务");
                }
                if (parseInt(val) !== 4){
                    this.menuNew[1].children = this.menuNew[1].children.filter(item => item.name !== "轻松任务数据大屏");
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    /deep/ .ant-menu-submenu-title{
        font-size: 14px;
        font-weight: 500;
        color: #000E36;
    }
    /deep/ .ant-menu{
        border-right: 0;
    }
    /deep/ .ant-menu-item{
        margin: 0;
        border-right: 0;
        a{
            color: #303133;
            font-size: 14px;
            font-weight: 500;
        }
    }
    /deep/ .ant-menu-item-selected{
        color: #0082ef;
    }
    /deep/ .ant-menu-item-selected .menu-circle{
        background-color: #0082ef !important;
    }
    .router-link-active{
        color: #0082ef!important;
    }
    .menu-list{
        height: calc(100vh - 60px);
        /*box-shadow: 1px 0 0 #D7DEE6;*/
        box-sizing: border-box;
        border-right: 1px solid #D7DEE6;
        /*width: 200px;*/
        /*width: 100%;*/
        background-color: #fff;
        border-bottom: 1px solid #D7DEE6;
        overflow-y: auto;
        overflow-x: hidden;
        .menu-circle{
            display: inline-block;
            width: 4px;
            height: 4px;
            background-color: #CCCCCC;
            border-radius: 50%;
            line-height: 40px;
            margin-right: 8px;
            vertical-align: middle;
            margin-top: -3px;
        }
    }
    /deep/.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title{
        padding: 0 15px!important;
    }
    /deep/.ant-menu-inline-collapsed{
        width: 50px;
    }




</style>
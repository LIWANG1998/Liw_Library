<template>
    <div class="role">
        <header class="page-header">
            {{roleName}}角色权限
            <div style="float: right; position: relative;">
                <a-button @click="$router.go(-1)">返回</a-button>
                <a-button type="primary" @click="setData"  v-if="id !== 1 && id !== 2">确定</a-button>
            </div>
        </header>
        <div class="split-box"></div>
        <div class="role-content">
            <div class="role-type">
                功能权限
                <a-icon type="info-circle" class="tips-icon" :class="actionTipsShow ? 'tips-blue' : ''"
                        @mouseenter="actionTipsShow = true" @mouseleave="actionTipsShow = false"/>
                <!--                <i class="layui-icon tips-icon" id="iconAct">&#xe60b;</i>-->
                <div class="tips" v-show="actionTipsShow">
                    <p>勾选“发起”则给角色拥有发起任务</p>
                    <p>的权限</p>
                </div>
            </div>
            <div class="split-box split-box-thin"></div>
            <div class="role-bar typeAct">
                <a-checkbox-group v-model="actionVal">
                    <a-checkbox :value="1">发起</a-checkbox>
<!--                    <a-checkbox :value="2">抄送</a-checkbox>-->
<!--                    <a-checkbox :value="3">公司</a-checkbox>-->
                </a-checkbox-group>
            </div>
        </div>
        <div class="split-box"></div>

        <div class="role-content">
            <div class="role-type">协作权限
                <a-icon type="info-circle" class="tips-icon" :class="helpTipsShow ? 'tips-blue' : ''"
                        @mouseenter="helpTipsShow = true" @mouseleave="helpTipsShow = false"/>
                <div class="tips" v-show="helpTipsShow">
                    <p>发起任务时，任务接收人与抄送人的选择范围：</p>
                    <p>部门--所在部门的全部成员</p>
                    <p>公司--所在公司的全部成员</p>
                    <!--                    <p>所有企业&#45;&#45;整个集团的所有成员</p>-->
                    <!--                    <p>只有“所有企业”权限的才有跨企业协作的权限</p>-->
                </div>
            </div>
            <div class="split-box split-box-thin"></div>
            <div class="role-bar typeDem">
                <a-radio-group v-model="helpVal">
<!--                    <a-radio :value="0">个人</a-radio>-->
                    <a-radio :value="1">部门</a-radio>
                    <a-radio :value="2">公司</a-radio>
<!--                    <a-radio :value="3">所有企业</a-radio>-->
                </a-radio-group>
            </div>
        </div>
        <div class="split-box"></div>

        <div class="role-content">
            <div class="role-type">任务统计查看范围
                <a-icon type="info-circle" class="tips-icon" :class="areaTipsShow ? 'tips-blue' : ''"
                        @mouseenter="areaTipsShow = true" @mouseleave="areaTipsShow = false"/>
                <div class="tips" style="left: 190px;" v-show="areaTipsShow">
                    <p>个人--可查看与自己相关的任务统计</p>
                    <p>部门--可查看所在部门的任务统计</p>
                    <p>公司--查看所在公司的任务统计</p>
                    <!--                    <p>所有企业&#45;&#45;查看整个集团所有的任务统计；范围整个集团的的任务一览图；</p>-->
                    <p class="remark">*注：所有人均默认有“个人任务统计”的查看权限</p>
                </div>
            </div>
            <div class="split-box split-box-thin"></div>
            <div class="role-bar typeDem">
                <a-radio-group v-model="areaVal">
                    <a-radio :value="0">个人</a-radio>
                    <a-radio :value="1">部门</a-radio>
                    <a-radio :value="2">公司</a-radio>
                    <!--<a-radio :value="3">所有企业</a-radio>-->
                </a-radio-group>
            </div>
        </div>
        <div class="split-box"></div>

    </div>
</template>

<script>
    import {backManage} from "@/api";
    export default {
        name: "setRole",
        data() {
            return {
                actionTipsShow: false,
                helpTipsShow: false,
                areaTipsShow: false,
                actionVal: [1],
                helpVal: 1,
                areaVal: 1,
                id:parseInt(this.$route.query.id),
                is_system:0,
                roleName:''
            }
        },
        created(){
          this.getData();
        },
        methods: {
            async getData(){
                const {code,data} = await backManage.getPower({id:this.id});
                if (code){
                    this.actionVal[0] = data.is_initiate; //功能 多选
                    this.helpVal = data.cooperation; //协作权限
                    this.areaVal= data.type; //查看范围
                    this.roleName = data.name;
                }
            },
            async setData(){
                let param = {
                    id: this.id,
                    type: this.areaVal,
                    is_initiate:  this.actionVal[0] ? this.actionVal[0] : 0,
                    cooperation: this.helpVal,
                    name: this.roleName,
                    is_query: 0,
                    is_system: this.is_system,
                };
                const {code,msg} = await backManage.editRole(param);
                if (code){
                    this.$message.success(msg,2);
                    this.$router.push({
                        path:`/backManage/role`,
                    })
                }else {
                    this.$message.error(msg,2)
                }
            },
        },

    }
</script>

<style scoped>
    @import '../../assets/css/power.css';
</style>
<style scoped>

</style>
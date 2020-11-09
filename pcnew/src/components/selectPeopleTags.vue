<template>
    <div>
        <div>
            <a-button @click="pickUserShow = true" :disabled="canEdit">选择</a-button>
            <p class="people-num see-none">已选<span class="people-count">{{peopleList.length}}</span>人</p>
            <a-button type="link" class="clear-all" @click="closeAll" :disabled="canEdit">清空已选</a-button>
        </div>
        <div class="people-list">
            <a-tag  v-for="(item,index) in peopleList" :key="index" :closable="!canEdit"
                   @close="delPeople($event,index)">{{item.name}}</a-tag>
        </div>
        <pick-user :show.sync="pickUserShow" :selected-user="peopleList" :selecte-dep="depId" :filter-data="filterPeople"
                   @done="addUser"></pick-user>
    </div>
</template>

<script>
    import PickUser from "./pickUser";
    export default {
        name: "selectPeopleTags",
        components: {PickUser},
        //peopleArr 选人的数组,    canEdit  能否编辑
        props: ['peopleArr','canEdit','filterData'],
        data() {
            return {
                peopleList: [],//选人总体的数据
                peopleId:[],//userid
                depId:[],//部门id
                pickUserShow:false,
                filterPeople:this.filterData ? this.filterData : []
            }
        },
        watch:{
            peopleArr:{
                handler(val){
                    // console.log(val)
                    this.peopleList =  val.user ? val.user : val;
                    this.peopleList.forEach(item=>{
                        item.label = item.name
                    });
                    if (this.peopleList.length > 0){
                        this.peopleId = [];
                        this.depId = []
                        this.peopleList.forEach((item)=>{
                            this.peopleId.push(item.userid);
                            this.depId.push(item.dep_id)
                        })
                    }else {
                        this.peopleId = [];
                        this.depId = []
                    }
                },
                deep:true
            },
            filterData(val){
                if (val){
                    this.filterPeople = this.filterPeople.concat(val)
                }
            },
        },
        methods: {
            //删除人员
            delPeople(e,index) {
               this.peopleList.splice(index,1);
               this.peopleId.splice(index,1);
               this.depId.splice(index,1);

                e.preventDefault();
                return false;
            },
            //清除所有
            closeAll(){
                this.peopleList = [];
                this.peopleId = [];
                this.depId = [];
            },
            //子组件的数据
            addUser(data){
                // console.log(data)
                this.peopleList = [].concat(data.user);
                this.peopleId = [].concat(data.userId);
                this.depId = [].concat(data.dep)
            }
        }
    }
</script>

<style scoped>
    /deep/ .ant-tag{
        box-sizing: content-box;
        padding: 6px 10px;
        background: #F0F2F5;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 400;
        margin-right: 3px;
    }
    .people-list {
        margin-top: 5px;
        height: 150px;
        overflow-y: scroll;
    }
</style>
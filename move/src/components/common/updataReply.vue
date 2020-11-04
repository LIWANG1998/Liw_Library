<template>
    <div>
        <div class="content">
            <p style="color: #303133;size: 16px;line-height: 32px">消息内容</p>
            <van-field
                    maxlength="200"
                    show-word-limit
                    v-model="message"
                    rows="10"
                    type="textarea"
                    placeholder="请输入留言"/>
        </div>
        <div class="btn">
            <van-button @click="changPage('cancel')" style="width: 170px"  type="default">取消</van-button>
            <van-button @click="changPage('close')" style="width: 170px" type="info" >保存</van-button>
        </div>
    </div>
</template>

<script>
    import {addNimble} from '@/api/nimble'
    import bus from "../../assets/js/replyBus";
    export default {
        name: "updataReply",
        data(){
            return {
                message: '',
                type:'cancel',//cancel：关闭编辑页，add:新增，edit:编辑,close:新增或编辑后关闭
                id:''
            }
        },
        // props:{
        //    content:{
        //        type:Object,
        //        default:() =>{}
        //    },
        // },
        computed:{
            content(){
                let _content = {
                    type: 'add',
                    id:'',
                    message: '',
                }
                return this.$route.query.content ? this.$route.query.content : _content
            }
        },
        methods:{
            changPage(type){
                let _this =  this
                if (type == 'cancel'){
                    this.type = 'cancel'
                    this.$emit('handleChangePage','cancel')
                    this.$router.go(-1)
                } else if (type == 'close') {
                    let _data = {
                        content:this.message,
                        id: this.id ? this.id : 0
                    }
                    addNimble(_data).then(res =>{
                        if (res.code == 1){
                            _this.$toast.success(res.msg)
                            this.type = 'close'
                            this.$emit('handleChangePage','close')
                            this.$router.go(-1)
                        } else {
                            _this.$toast.fail(res.msg)
                        }
                    })
                }
                this.message = ''
            }
        },
        watch:{
            content:{
                deep:true,
                immediate:true,
                handler:function (val) {
                    if (val){
                        this.type = val.type
                        this.message = val.message
                        this.id= val.id
                    }
                }
            }
        },
        created() {
            // console.log(this.$route.query.content)
        },
    }
</script>

<style lang="scss" scoped>
.content{
    min-height: 100vh;
    padding: 0 15px;
    background: #FFFFFF !important;
}
/deep/.van-cell {
    background: #F1F7FA;
    .van-field__control {
        padding-left: 10px;
    }
    .van-field__word-limit {
        padding-right: 10px;
        line-height: 30px;
    }
}
    .btn{
        box-sizing: border-box;
        border-top: 1px solid #E6E6E6;
        width: 100%;
        padding: 10px 15px;
        position: fixed;
       bottom: 0;
       display: flex;
        justify-content: space-between;
    }
</style>
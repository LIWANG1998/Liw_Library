<template>
    <div class="add-task">
        <div id="fileList" class="plan-file">
            <div class="plan-file-list clear-fix" v-for="(v,i) in fileDataArr" :key="i">
                <img v-if="v && v.fileIcon" :src="v.fileIcon" alt="" class="file-icon" align="absmiddle">
                <span v-if="v && v.name" class="file-name">{{v.name}}</span>
                <a-button type="link" class="btn-text-underline file-status-icon  download" @click="viewFile(v)" v-show="textBtnShow">预览</a-button>
                <a-button type="link" class="btn-text-underline file-status-icon see" v-if="textBtnShow && !isCc"
                          @click="downLoadFile(v.name,v.save_path)">下载
                </a-button>
                <a-icon type="check-circle" class="greenFont file-status-icon" v-show="iconBtnShow"/> <!--√-->
                <a-icon type="close-circle" class="greyFont file-status-icon" @click="delFile(i)"
                        theme="filled" title="点击删除" v-show="iconBtnShow"/><!--x-->
            </div>
        </div>
        <view-file :viewData="viewData" @viewCancel="viewCancel($event)"></view-file>
    </div>
</template>

<script>
    import commonFn from '../assets/js/common'
    import viewFile from "./viewFile";
    export default {
        name: "fileListModule",
        components:{
            viewFile,
        },
        props: {
            optionType: {type: String, default: 'add'},
            fileArr: {type: Array},
            isCc:{type:Boolean,default: false}//抄送人不能下载

        },
        data() {
            return {
                textBtnShow: false,
                iconBtnShow: true,
                fileDataArr: [].concat(this.fileArr),
                viewData:{
                    showPdf: false,
                    show:false,//是否显示生成预览页提示
                    fileData:{},
                },//预览页组件data
                // isCcUser:false,
            }
        },
        watch: {
            fileArr: {
                immediate: true,
                handler(val) {
                    this.fileDataArr = [].concat(val);
                    this.fileDataArr.forEach(item => {
                        // console.log(item)
                        if (item !== undefined && !item.fileIcon) {
                            let fileType = item.name.split('.')[1];
                            //展示前面的icon
                            item.fileIcon = commonFn.judeFileType(fileType,item.save_path);
                        }
                    })
                },
                deep: true
            },
        },
        created() {
            //等于add 则显示操作删除成功icon 否则显示预览下载按钮
            if (this.optionType === 'add') {
                this.iconBtnShow = true;
                this.textBtnShow = false
            } else {
                this.iconBtnShow = false;
                this.textBtnShow = true
            }
        },
        methods: {
            //删除
            delFile(i) {
                this.fileDataArr.splice(i, 1);
                this.$emit('data', this.fileDataArr);
            },
            downLoadFile(name,url){
                commonFn.downLoadFile(name,url)
            },
            //预览
            viewFile(v){
                // console.log(v, this.viewData.show)
                this.viewData.fileData = JSON.parse(JSON.stringify(v));
                this.viewData.show = true
            },
            //取消预览
            viewCancel(val){
                this.viewData.show = val
            }
        }
    }
</script>

<style scoped lang="less">
    .upload-box-window {
        width: 90%;
        margin: 0 auto 40px auto;
    }

    .upload-progress {
        /*height: 4px;*/
        width: 100%;
        position: absolute;
        bottom: -15px;
        left: 0;
        z-index: 9999999;
    }
</style>
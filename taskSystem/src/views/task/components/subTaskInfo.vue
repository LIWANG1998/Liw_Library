<template>
  <van-popup
    v-model="_show"
    :class="['info-box','sub-task','popup']"
    :overlay="false"
    position="right"
  >
    <div class="box">
      <div class="title">
        {{ info.title }}
      </div>
      <div class="content" v-html="info.content"></div>
    </div>
    <div class="box">
      <van-cell
        v-for="(item,index) in info.file_url"
        :key="index"
        center
        title-class="lable"
        value-class="value"
        :title="`${index +1}.${item.name}`"
      >
        <template #default>
          <van-button
            class="btn-text"
            @click="handleDownload(item.name,item.save_path)"
          >
            下载
          </van-button>
          <van-button
            class="btn-text"
            @click="handlePreview(item.save_path,item.type)"
          >
            预览
          </van-button>
        </template>
      </van-cell>
    </div>
    <div class="box">
      <div class="box_charge">
        <span>负责人({{total}})</span>
        <div class="charge_right" @click="showSonUser">
          <span>{{nameTxt}}</span>
          <van-icon name="arrow" :size="16" />
        </div>
      </div>
    </div>
    <div
      v-if="progressList.length > 0 "
      class="box"
    >
      <div class="progress-task_list">
        <van-row
          v-for="(item,index) in progressList"
          :key="index"
          class="item"
        >
          <div class="user-info">
            <van-col span="3">
              <van-image
                round
                width="32px"
                height="32px"
                :src="item.username[0].avatar"
              />
            </van-col>
            <van-col span="21">
              {{ item.username[0].name }}
              <div
                :class="['pdl-10 ft12 til',item.status==1?'success':'blue']"
              >
                {{ item.status==1?"完成":"未完成" }}-{{ info.title }}
              </div>
            </van-col>
          </div>
          <div
            v-if="item.remarks"
            class="remarks"
          >
            备注：{{ item.remarks }}
          </div>
          <div
            v-for="(fItem,fIndex) in item.file_url"
            :key="fIndex"
            class="file"
          >
            <div class="info">
              <div>
                <van-image
                  width="32px"
                  height="32px"
                  :src="getIcon(fItem.type,fItem.save_path)"
                />
              </div>
              <div class="name van-ellipsis">
                {{ fItem.name }}
              </div>
              <van-button
                v-if="role==0||role==1"
                class="btn-text"
                @click="handleDownload(fItem.name,fItem.save_path)"
              >
                下载
              </van-button>
              <van-button
                class="btn-text"
                @click="handlePreview(fItem.save_path,fItem.type)"
              >
                预览
              </van-button>
            </div>
            <div class="status">
              {{ fItem.username }} 上传日期 {{ fItem.time }}
              <span class="success">完成</span>
            </div>
          </div>
        </van-row>
      </div>
    </div>
    <pdf
      :show.sync="pdfShow"
      :url="pdfUrl"
    />
    <footer>
      <!-- 当前为接收任务 同时任务状态为执行中 -->
      <van-button @click="handleCancel">
        取消
      </van-button>
      <template v-if="role==1&&isStart">
        <van-button @click="updateTaskShow=true">
          更新进度
        </van-button>
        <update-task
          :id="info.id"
          :show.sync="updateTaskShow"
          :pid="infoId"
          type="sub"
          :filter="filter"
        />
      </template>
    </footer>
  </van-popup>
</template>
<script>
import updateTask from "../components/updateTask";
import { task, common } from "@/api";
import { pdf } from "@/components";
import { ImagePreview } from "vant";
import { mapGetters } from "vuex";
import { isImageUrl, previewImg } from "@/utils";
export default {
  components: {
    updateTask,
    pdf,
    ImagePreview,
  },
  props: {
    id: {
      type: String | Number,
      default: 0,
    },
    infoId: {
      type: String | Number,
      default: 0,
    },
    role: {
      type: String | Number,
      default: 0,
    },
    show: {
      type: Boolean,
      required: true,
    },
    isStart: {
      type: Boolean,
      required: true,
    },
    filter: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      info: {
        id: 0,
        title: "",
        content: "",
        file_url: [],
      },
      updateTaskShow: false,
      progressList: [],
      pdfShow: false, //文件预览
      pdfUrl: "",
      total:0,
      nameTxt:'',
      subtask_lead_user:'',//子任务负责人id字符串集合
    };
  },
  watch: {
    data(val) {
      this.info = val;
      this.getInfo();
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    _show: {
      get: function () {
        return this.show;
      },
      set: function (val) {
        this.$emit("update:show", val);
      },
    },
  },
  created() {
    this.$bus.on("subLoad", (data) => {
      // this.getSonTask()
      this.getInfo();
      this._show = false;
    });
  },
  methods: {
    // 下载到云盘
    async handleDownload(name, path) {
	    // this.downloadFile("cancel", file);
      // this.$download({
      //   title: `下载文件${name}`,
      //   cancelText: "下载到本地",
      //   confirmText: "下载到云盘",
      // }).then((action, done) => {
      //   this.downloadFile(action, file);
      // });
      // console.log(this.downloadFile)
      try{
        let fileName = name;
        let first = fileName.lastIndexOf(".");//取到文件名开始到最后一个点的长度
        let namelength = fileName.length;//取到文件名长度
        let filesuffix = fileName.substring(first + 1, namelength );//截取获得后缀名
        if (filesuffix == 'zip'|| filesuffix == 'ZIP' || filesuffix == 'rar' || filesuffix == 'RAR') {
          let _params = {
            file_url: path,
            file_name:name,
            send_user: this.userInfo.userid
          }
          const {code, data} =  await common.downloadFile(_params)
          console.log(data)
          if (code == 1 ){
            this.$notify({ type: "success", message: '下载成功，请至企业微信查看' });
          } else if (code == -1) {
            this.$notify({ type: "danger", message: '文件大小超出限制' });
          } else {
            this.$notify({ type: "danger", message: '文件下载失败' });
          }
        } else {
          window.open(`${path}?attname=${name}`)
        }
      } catch {
        this.$notify({ type: "danger", message: '文件下载失败' });
      }
    },
    // 下载文件
    async downloadFile(action, file) {
      let that = this;
      if (action == "confirm") {
        if (!file.save_path) {
          return this.$notify({ type: "danger", message: "文件地址不正确" });
        }
        this.$toast.loading({
          message: "保存中...",
          forbidClick: true,
        });
        try {
          const { code, data } = await common.cloudFileUpload({
            url: file.save_path,
            disk: file.disk,
            filename:file.name
          });
          if (code) {
            this.$toast("文件已保存到云盘");
            setTimeout(function () {
              that.$toast.clear();
            }, 500);
          } else {
            that.$toast("文件保存失败");
          }
        } catch {
          this.$toast("文件保存失败");
        }
      } else if (action == "cancel") {
        var request = new XMLHttpRequest();
        request.open("GET", file.save_path, true);
        request.responseType = 'blob';
        request.onload=function(e) {
            var url = window.URL.createObjectURL(request.response)
            var a = document.createElement('a');
            a.href = url
            a.download = file.name;
            a.click()
        }
        request.send();
      }
    },
    getIcon(type, fileUrl) {
      if (type == "7z" || type == "zip") {
        type = "rar";
      }
      let typeList = ["doc", "xls", "ppt", "pdf", "zip", "7z", "rar"];
      let icon = require("@/assets/images/file.png");
      const { host } = this.userInfo;
      if (isImageUrl(fileUrl)) {
        if (fileUrl.includes("https") || fileUrl.includes("http")) {
          icon = fileUrl;
        } else {
          icon = `${host}${fileUrl}`;
        }
      } else {
        let iconType = typeList.find((item) => type.includes(item));
        if (iconType) {
          icon = require(`@/assets/images/${iconType}.png`);
        }
      }
      return icon;
    },
    // 预览
    async handlePreview(url, type) {
      const { host, watermark } = this.userInfo;
      let fileUrl = url || "";
      let typeList = ["doc", "xls", "ppt", "docx", "xlsx", "pptx", "pdf"];
      let isCloud = true;
      if (!fileUrl.includes("https://") && !fileUrl.includes("http://")) {
        fileUrl = `${host}${url}`;
        isCloud = false;
      }
      if (isImageUrl(fileUrl)) {
        let imgs = [];
        try {
          imgs.push(await previewImg(fileUrl, watermark, isCloud, host));
          ImagePreview(imgs);
        } catch {
          this.$toast("预览图生成失败");
        }
      } else {
        let iconType = typeList.find((item) => type.includes(item));
        if (typeList.indexOf(type) > -1) {
          this.pdfShow = true;
          this.pdfUrl = url;
        } else {
          this.$toast("当前文件不支持预览");
        }
      }
    },
    async getInfo() {
      const { code, data } = await task.getSonTask({ id: this.data.id });
      this.total = data.subtask_lead_username?.length
      let listData = [];
      data.finish_list?.forEach((item, index) => {
        if (
          !(item.status == 0 && item.remarks == "" && item.file_url.length == 0)
        ) {
          listData.push(item);
        }
      });
      this.subtask_lead_user = data.subtask_lead_user
      this.progressList = listData;
      this.nameTxt = data.subtask_lead_username?.map(item => item.name)?.join(',')
    },
    // 取消
    handleCancel() {
      this._show = false;
    },
    //显示父组件已选人员（催办组件）
    showSonUser() {
      console.log(111)
      this.$bus.emit('showSonUser',this.subtask_lead_user)
    }
  },
};
</script>
<style lang="less" scoped>
.sub-task {
  // transform: none;
  padding: 0;
  .box {
    .title {
      padding: 13px 16px 10px;
      margin: 0;
    }
    .content {
      padding-bottom: 15px;
      white-space: pre-wrap;
    }
  }
  .progress-task_list {
    .item {
      padding: 10px 16px;
      .user-info {
        display: flex;
        align-content: center;
        line-height: 32px;
        font-size: 15px;
        font-weight: 500;
      }
      .remarks {
        padding-left: 12.5%;
        margin-bottom: 5px;
      }
      .til {
        line-height: 20px;
        padding: 0;
        margin: 0;
      }
      .file {
        padding: 9px 0 9px 12.5%;
        .van-image {
          border-radius: 2px;
          overflow: hidden;
        }
        .info {
          display: flex;
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 2px;
          align-items: center;
          .name {
            margin-right: 10px;
            width: 40%;
            overflow: hidden;
            margin-left: 10px;
          }
        }
        .status {
          color: @gray-dark-txt;
          font-size: 12px;
        }
      }
    }
  }
  .box_charge{
    display: flex;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    padding:0 16px;
    .charge_right{
      max-width: 50%;
      color: #909399;
      display: flex;
      align-items: center;
      span{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
}
  .hideFont{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>>

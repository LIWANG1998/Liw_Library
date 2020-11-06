<template>
  <van-popup :class="['progress-list','popup']" v-model="_show" v-if="_show" :overlay="false">
    <van-sticky>
      <van-search
        v-model="params.name"
        show-action
        placeholder="请输入姓名"
        @search="onSearch"
        @cancel="handleCancel"
        background="#fff"
      />
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="100"
        finished-text="没有更多了"
        class="list"
        @load="onLoad"
      >
        <van-row class="item" v-for="(item,index) in list" :key="index">
          <div class="user-info">
            <van-col span="3">
              <van-image round width="32px" height="32px" :src="item.username[0].avatar" />
            </van-col>
            <van-col span="21">
              {{item.username[0].name}}
              <div
                :class="['pdl-10 ft12 til',item.status==1?'success':'blue']"
              >{{item.status==1?"完成":"未完成"}}-{{item.pid==0?`主任务-${item.title}`:`子任务-${item.title}`}}</div>
            </van-col>
          </div>
          <div class="remarks" v-if="item.remarks">备注：{{item.remarks}}</div>
          <div class="file" v-for="(fItem,fIndex) in item.file_url" :key="fIndex">
            <div class="info">
              <div>
                <van-image width="32px" height="32px" :src="getIcon(fItem.type,fItem.save_path)" />
              </div>
              <div class="name van-ellipsis">{{fItem.name}}</div>
              <van-button
                class="btn-text"
                v-if="role==0||role==1"
                @click="handleDownload(fItem,fItem.save_path)"
              >下载</van-button>
              <van-button class="btn-text" @click="handlePreview(fItem.save_path,fItem.type)">预览</van-button>
            </div>
            <div class="status">
              {{fItem.username}} 上传日期 {{fItem.time}}
              <span class="success">完成</span>
            </div>
          </div>
        </van-row>
      </van-list>
    </van-pull-refresh>
    <footer>
      <van-button type="default" native-type="button" @click="handleCancel">返回</van-button>
    </footer>
    <pdf :show.sync="pdfShow" :url="pdfUrl"></pdf>
  </van-popup>
</template>
<script>
//引入日期格式工具
let moment = require("moment");
moment.locale("zh-cn"); //汉化
import { task } from "@/api";
import { mapGetters } from "vuex";
import { isImageUrl, previewImg } from "@/utils";
import { pdf } from "@/components";
import { ImagePreview } from "vant";
export default {
  props: {
    id: {
      type: Number | String,
      default: 0,
    },
    role: {
      type: Number | String,
      default: 0,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      total: 0,
      keyword: "",
      pdfShow: false,
      pdfUrl: "",
      page: {
        page: 0,
        num: 8,
      },
      params: {
        name: "",
      },
    };
  },
  watch: {
    id(val) {
      this.refreshing = true;
      this.onRefresh();
    },
  },
  components: {
    pdf,
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
  methods: {
    // 加载数据
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
        this.page.page = 1;
      } else {
        this.page.page++;
      }
      this.getDataList();
    },
    // 请求数据
    async getDataList() {
      try {
        this.params = Object.assign({ id: this.id }, this.params, this.page);
        const {
          code,
          data: { total, data },
        } = await task.getProgressList(this.params);
        if (code === 1) {
          this.total = total;
          this.skeShow = false;
          this.loading = false;
          let listData = [];
          data.forEach((item, index) => {
            if (
              !(
                item.status == 0 &&
                item.remarks == "" &&
                item.file_url.length == 0
              )
            ) {
              listData.push(item);
            }
          });
          if (this.page.page === 1) {
            this.list = listData;
          } else {
            this.list = [...this.list, ...listData];
          }
          if (this.list.length >= this.total) {
            this.finished = true;
          }
          if (data.length == 0) {
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
      } catch {
        this.finished = true;
      }
    },
    // 下载到云盘
    handleDownload(file) {
      let name = file.name || "";
      this.$download({
        title: `下载文件${name}`,
        cancelText: "下载到本地",
        confirmText: "下载到云盘",
      }).then((action, done) => {
        this.downloadFile(action, file);
      });
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
            filename: file.name,
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
        const { host } = this.userInfo;
        let url = "";
        if (
          !file.save_path.includes("https://") &&
          !file.save_path.includes("http://")
        ) {
          url = host + file.save_path;
        } else {
          url = file.save_path;
        }
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
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
    //下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    // 搜索
    onSearch() {
      this.refreshing = true;
      this.onRefresh();
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
    // 取消
    handleCancel() {
      this._show = false;
    },
  },
};
</script>
<style lang="less" scoped>
.progress-list {
  height: 100%;
  font-size: 14px;
  .list {
    min-height: 400px;
  }
  .item {
    background-color: @white;
    .btn-text {
      color: #0082ef;
      border: none;
      line-height: 0.53333rem;
      height: 0.53333rem;
    }
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
</style>

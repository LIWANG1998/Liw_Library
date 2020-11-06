<template>
  <van-popup
    v-if="_show"
    v-model="_show"
    :class="['cloud','popup']"
    :overlay="false"
  >
    <van-tabs
      v-model="active"
      color="#0082EF"
      :line-width="40"
      :line-height="2"
    >
      <van-tab title="本地上传">
        <div class="upload-box">
          <van-uploader
            v-model="fileList"
            :after-read="onRead"
            :max-size="100 * 1024 * 1024"
            accept="*"
            upload-icon="plus"
            @delete="onDelete"
            @oversize="oversize"
          >
            <template #preview-cover="fileItem">
              <div
                v-if="fileItem.type && getIcon(fileItem)"
                class="preview-cover icon"
              >
                <img
                  :src="getIcon(fileItem)"
                  class="file-icon"
                >
              </div>
            </template>
          </van-uploader>
        </div>
      </van-tab>
      <!-- <van-tab title="云盘上传">
        <div class="head">
          <div
            v-for="(item,index) in head"
            :key="index"
            :class="index < head.length -1?'active':''"
            @click="index < head.length -1?handleHeadChange(item.id,index):''"
          >
            {{item.dir_name}}
            <van-icon name="arrow" v-if="index < head.length -1" />
          </div>
        </div>
        <van-skeleton :row="10" :loading="loading">
          <div class="list-box">
            <van-checkbox-group v-model="selectData">
              <div
                class="list"
                v-for="(item,index) in fileData"
                :key="index"
                v-show="item.id == head[head.length -1].id"
              >
                <template v-if="item.data.dir.length >0||item.data.files.length> 0">
                  <div
                    class="item"
                    v-for="(dItem,dIndex) in item.data.dir"
                    :key="dIndex"
                    @click="handleFile(dItem)"
                  >
                    <van-image width="32" height="32" :src="require(`@/assets/images/file.png`)" />
                    <label>{{dItem.dir_name}}</label>
                  </div>
                  <div class="item file" v-for="fItem in item.data.files" :key="fItem.id">
                    <div class="name">
                      <van-image width="32" height="32" :src="getIcon(fItem)" />
                      <label>{{fItem.f_name}}</label>
                    </div>
                    <van-checkbox shape="square" :name="fItem" />
                  </div>
                </template>
                <van-empty
                  v-else
                  class="custom-image"
                  :image="require('@/assets/images/nodata.png')"
                  description="暂无数据"
                />
              </div>
            </van-checkbox-group>
          </div>
        </van-skeleton>
      </van-tab>-->
    </van-tabs>
    <footer>
      <div class="left">
        <div class="select">
          已选择：{{ selectData.length }}个文件
        </div>
      </div>
      <div class="flex">
        <van-button
          type="info"
          native-type="button"
          @click="handleCanle"
        >
          取消
        </van-button>
        <van-button
          type="info"
          native-type="button"
          :loading="button.loading"
          :loading-text="button.text"
          @click="handleConfirm"
        >
          确定
        </van-button>
      </div>
    </footer>
  </van-popup>
</template>
<script>
import { common } from "@/api";
import { mapGetters } from "vuex";
import { isImageUrl } from "@/utils";
import { qiniudnUploader } from "@/utils/qiniu/qiniudnUploader";
const currentDate = new Date();
//引入日期格式工具
let moment = require("moment");
moment.locale("zh-cn"); //汉化
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      fileData: [],
      selectData: [],
      loading: true,
      head: [{ id: 0, dir_name: "全部" }],
      active: 0,
      fileList: [],
      button: {
        loading: false,
        text: "保存中",
      },
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.fileData = [];
        this.selectData = [];
        this.fileList = [];
        // this.getData(0);
      }
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
  methods: {
    async getData(id) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      this.loading = true;
      const { code, data } = await common.cloudFileList({ type: 3, pid: id });
      if (code) {
        this.fileData.push({ id: id, data: data });
      }
      setTimeout(() => {
        this.loading = false;
        this.$toast.clear();
      }, 200);
    },
    getIcon(file) {
      let type = file.ext || file.type;
      if (type == "7z" || type == "zip") {
        type = "rar";
      }
      file.save_path;
      let typeList = ["doc", "xls", "ppt", "pdf", "zip", "7z", "rar"];
      let icon = require("@/assets/images/file.png");
      const { host } = this.userInfo;
      let fileUrl = file.save_path;
      if (!(fileUrl.includes("https") || fileUrl.includes("http"))) {
        fileUrl = `${host}${fileUrl}`;
      }
      if (isImageUrl(fileUrl || file.url)) {
        return fileUrl;
      } else {
        let iconType = typeList.find((item) => type.includes(item));
        if (iconType) {
          icon = require(`@/assets/images/${iconType}.png`);
        } else {
          icon = require(`@/assets/images/default.png`);
        }
      }
      return icon;
    },
    oversize() {
      this.$notify({
        type: "danger",
        message: "请上传100M以内的文件",
        duration: 2000,
      });
    },
    handleHeadChange(id, index) {
      this.head = this.head.slice(0, index + 1);
    },
    handleFile(item) {
      this.head.push(item);
      if (!this.fileData.some((i) => i.id == item.id)) {
        this.getData(item.id);
      }
    },
    handleCanle() {
      this.button.loading = false;
      this._show = false;
    },
    async onDelete(file) {
      // const {code,msg} = await common.delFile({url:file.save_path});
      this.selectData = this.selectData.filter(
        (item) => !file.save_path.includes(item.save_path)
      );
      console.log(this.selectData);
    },
    async onRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      let formData = new FormData();
      formData.append("file", file.file);
      let index = file.file.name.lastIndexOf(".");
      let type = file.file.name.substr(index + 1);
      try {
        let data = await common.qiniuToken({ type: type });
        qiniudnUploader(data.token, file.file, data.key, (res) => {
          this.selectData.push({
            name: file.file.name,
            save_path: `${data.url}/${data.key}`,
            size: file.file.size,
            time: moment(currentDate).format("YYYY-MM-DD HH:mm"),
            type: type,
            disk: 0,
            dep: data.dep,
            username: data.username
          });
          file.message = "上传成功";
          file.status = "success";
          file.type = type;
          file.save_path = `${data.url}/${data.key}`;
        });
      } catch {
        this.fileList.pop();
        file.status = "failed";
        file.message = "上传失败";
      }
    },
    handleConfirm() {
      this.button.loading = true;
      let data = this.selectData.map((item) => {
        if (item.disk == 0) {
          return item;
        } else {
          return {
            name: item.f_name,
            save_path: item.save_path,
            size: item.f_size,
            time: moment(currentDate).format("YYYY-MM-DD"),
            type: item.ext,
            disk: 1,
          };
        }
      });
      setTimeout(() => {
        this._show = false;
        this.button.loading = false;
        this.$emit("change", data);
      }, 300);
    },
  },
};
</script>
<style lang="less" scoped>
.cloud {
  .head {
    line-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    background: @white;
    border-bottom-width: 1px;
    border-bottom-color: #ebedf0;
    border-bottom-style: solid;
    & > div {
      display: flex;
      align-items: center;
      color: @gray;
      &.active {
        color: @blue;
      }
    }
  }
  .list {
    background: @white;
    .item {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      label {
        margin-left: 10px;
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }
      .name {
        display: flex;
        align-items: center;
      }
      &.file {
        justify-content: space-between;
      }
    }
  }
  .custom-image {
    height: calc(100vh - 84px);
  }
  .flex {
    display: flex;
  }
  .upload-box {
    background: @white;
    padding: 15px;
  }
  .file-list {
    display: flex;
    .item {
      width: 80px;
      height: 80px;
      margin-right: 20px;
      position: relative;
      .img {
        width: 80px;
        height: 80px;
        border-radius: 2px;
        overflow: hidden;
        border: 1px dashed @gray-medium;
      }
      .del {
        width: 20px;
        height: 20px;
        background: #c0c4cc;
        color: #fff;
        position: absolute;
        right: -10px;
        top: -10px;
        border-radius: 50%;
        text-align: center;
      }
    }
  }
  .file-icon {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }
  footer {
    display: flex;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    width: calc(100% - 10px);
    background: @white;
    border-top: @gray-light solid @border-width-base;
    .left {
      display: flex;
      font-size: 12px;
      align-items: center;
      .select {
        margin-left: 10px;
      }
    }
    .van-button:first-child {
      background: @white;
      color: #333333;
    }
    .van-button {
      min-width: 60px;
      height: 40px;
      text-align: center;
      flex: unset;
    }
  }
}
</style>

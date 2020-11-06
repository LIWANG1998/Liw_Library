<template>
  <div class="upload-box">
    <div class="posting-uploader">
      <div class="file-list">
        <div
          v-for="(item,index) in fileData"
          :key="index"
          class="item"
        >
          <div class="img">
            <van-image
              width="80"
              height="80"
              :src="getIcon(item)"
            />
          </div>
          <div
            class="del"
            @click="onDelete(index)"
          >
            <van-icon name="cross" />
          </div>
        </div>
        <van-button
          class="upload-button"
          native-type="button"
          @click="upload"
        >
          <van-icon name="plus" />
        </van-button>
      </div>
      <cloud
        :show.sync="cloudShow"
        @change="cloudChange"
      />
    </div>
  </div>
</template>

<script>
import { common } from "@/api";
import { mapGetters } from "vuex";
import { isImageUrl } from "@/utils";
import cloud from "./cloud";

export default {
  name: "Upload",
  components: {
    cloud
  },
  props: {
    file: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: [],
      fileData: [],
      fileIndex: 0,
      cloudShow: false
    };
  },
  watch: {
    file: {
      handler(val) {
        if (val) {
          this.fileData = Object.assign([], val);
          this.fileList = this.formatImg(val);
        }
      },
      immediate: true
    }
  },
  computed: mapGetters(["userInfo"]),
  methods: {
    oversize() {
      this.$notify({
        type: "danger",
        message: "请上传10M以内的图片",
        duration: 2000
      });
    },
    getIcon(file) {
      if (file.type) {
        let type = file.type;
        if (type == "7z" || type == "zip") {
          type = "rar";
        }
        let typeList = ["doc", "xls", "ppt", "pdf", "zip", "7z", "rar"];
        let icon = require("@/assets/images/file.png");
        const { host } = this.userInfo;
        if (isImageUrl(file.save_path || file.fileUrl || file.url)) {
          if (
            file.save_path.includes("https") ||
            file.save_path.includes("http")
          ) {
            return file.save_path;
          } else {
            return `${this.userInfo.host}${file.save_path}`;
          }
        } else {
          let iconType = typeList.find(item => type.includes(item));
          if (iconType) {
            icon = require(`@/assets/images/${iconType}.png`);
          } else {
            icon = require(`@/assets/images/default.png`);
          }
        }
        return icon;
      }
    },
    // 判断文件是否有域名
    formatImg(data) {
      let files = [];
      for (let i in data) {
        let item = data[i];
        let url = item.save_path;
        if (url.includes("https") || url.includes("http")) {
          item.url = url;
        } else {
          item.url = `${this.userInfo.host}${url}`;
        }
        files.push(item);
      }
      return files;
    },
    onDelete(index) {
      // const {code,msg} = await common.delFile({url:file.save_path});
      this.fileData.splice(index,1);
    },
    cloudChange(data) {
      this.fileData = [...this.fileData, ...data];
      this.fileChage();
    },
    fileChage() {
      this.$emit("change", this.fileData);
    },
    upload() {
      this.cloudShow = true;
    },
  }
};
</script>

<style lang="less" scoped>
.upload-box {
  .file-list {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 80px;
      height: 80px;
      margin-right: 20px;
      position: relative;
      margin-bottom:10px;
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
  .upload-button {
    border: 1px dashed @gray-medium;
    background-color: @white-min;
    i {
      font-size: 20px;
    }
    height: 80px;
    width: 80px;
    i {
      color: #9e9e9e;
      position: relative;
      top: 5px;
    }
  }
  /deep/.van-uploader__upload {
    border: 1px dashed @gray-medium;
    background-color: @white-min;
    i {
      font-size: 20px;
    }
  }
  /deep/.van-uploader__preview-delete {
    background: rgba(0, 0, 0);
    i {
      font-size: 22px;
    }
  }
  .file-icon {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }
}
</style>

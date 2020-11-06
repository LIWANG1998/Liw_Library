<template>
  <van-popup
    v-if="_show"
    v-model="_show"
    :class="['pdf','popup']"
    :overlay="false"
  >
    <div
      id="pdf"
      ref="pdf"
    />
    <footer>
      <van-button
        type="default"
        native-type="button"
        @click="handleCancel"
      >
        返回
      </van-button>
    </footer>
  </van-popup>
</template>
<script>
import Pdfh5 from "pdfh5";
import { mapGetters } from "vuex";
import { common } from "@/api";
const currentDate = new Date();
//引入日期格式工具
let moment = require("moment");
moment.locale("zh-cn"); //汉化
export default {
  props: {
    url: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      src: "", //预览地址
      pdfh5: null,
      loading: true,
      path: "",
      text: "",
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
        this.preview();
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
    async preview() {
      this.text = this.userInfo.watermark;
      const _this = this;
      if (!this.url) {
        return this.$notify({ type: "danger", message: "当前文件地址不存在" });
        this._show = false;
      }
      if (this.url.includes(".pdf")) {
        setTimeout(() => {
          _this.pdfh5 = new Pdfh5("#pdf", {
            pdfurl: this.url,
          });
          _this.pdfh5.on("success", function () {
            _this.addWaterMarker(_this.text);
          });
        });
        return false;
      }
      this.$toast.loading({
        message: "生成中...",
        forbidClick: true,
      });
      try {
        const {
          code,
          data: { url },
        } = await common.previewPdf({ save_path: this.url });
        if (code) {
          const { host } = this.userInfo;
          this.path = url;
          let local = location.href;
          this.src = `api/${url}`;
          if (local.includes("localhost")) {
            this.src = `api/${url}`;
          } else {
            this.src = `${host}${url}`;
          }
          setTimeout(() => {
            _this.pdfh5 = new Pdfh5("#pdf", {
              pdfurl: this.src,
            });
            _this.pdfh5.on("success", function () {
              _this.addWaterMarker(_this.text);
            });
          });
          this.$toast.clear();
        } else {
          this._show = false;
          return this.$notify({ type: "danger", message: "预览文件生成失败" });
        }
      } catch {
        this._show = false;
        return this.$notify({ type: "danger", message: "预览文件生成失败" });
      }
    },
    async delPdf() {
      await common.delPdf({ file_url: this.path });
    },
    addWaterMarker(str, font, textColor) {
      // 水印文字，父元素，字体，文字颜色
      let can = document.createElement("canvas");
      let canBody = document.createElement("canvas");
      // parentNode.appendChild(can);
      document.body.appendChild(canBody);
      let time = moment(currentDate).format("YYYY年MM月DD日");
      this.$refs.pdf.appendChild(can);
      can.width = 200;
      can.height = 200;
      can.style.display = "none";
      let cans = can.getContext("2d");
      cans.rotate((-20 * Math.PI) / 180);
      cans.font = font || "12px Microsoft JhengHei";
      cans.fillStyle = textColor || "rgba(180, 180, 180, 0.3)";
      cans.textAlign = "left";
      cans.textBaseline = "Middle";
      cans.fillText(str, can.width / 6, can.height / 2);
      cans.rotate("20*Math.PI/180");
      let pageContainer = document.getElementsByClassName("pageContainer");
      pageContainer.forEach((item) => {
        let div = document.createElement("div");
        div.className = "water-mark_box";
        div.style.background = "url(" + can.toDataURL("image/png") + ") repeat";
        item.appendChild(div);
      });
    },
    getWater() {
      let div = document.createElement("div");
      div.className = "water-mark_box";
    },
    handleCancel() {
      if (this.path) {
        // this.delPdf();
      }
      this._show = false;
    },
  },
};
</script>
<style scoped lang="less">
@import "../../assets/theme/pdfh5.css";
.pdf {
  /deep/.water-mark_box {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  footer {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 6;
    box-shadow: 2px 0 4px 0px rgba(207, 207, 207, 0.8);
    button {
      border-radius: 0;
      display: block;
      border: 0;
      flex: 1;
      &:nth-child(2) {
        background: @blue;
        color: @white;
      }
    }
  }
}
</style>

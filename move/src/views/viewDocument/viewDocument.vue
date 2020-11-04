<template>
  <!-- 预览公文内容 -->
  <div class="init previews">
    <div class="preview_box">
      <div class="preview" id="print">
        <h2>{{ type == 2 ? "收文" : type == 3 ? "签报" : "发文" }}单</h2>
        <div class="content-text" ref="content_text">
          <div
            class="line fir"
            v-for="(item, index) in view_data.fir"
            :key="'fir' + index"
          >
            <div class="head">{{ item.c_name }}：</div>
            <div class="content">{{ item.value }}</div>
          </div>
          <div
            class="line sec"
            v-for="(item, index) in view_data.sec"
            :key="'sec' + index"
          >
            <div class="item" v-for="item2 in item" :key="item2.e_name">
              <div class="head">{{ item2.c_name }}：</div>
              <div class="content">{{ item2.value }}</div>
            </div>
          </div>
        </div>
        <div class="file-text" ref="file_text">
          <div class="head" v-if="Getredtemplat && Getredtemplat.content">
            <div class="red-head" v-html="Getredtemplat.content"></div>
          </div>
          <div class="body-title" v-if="view_data.fir[0]">
            {{ view_data.fir[0].value }}
          </div>
          <div class="body" v-if="datas">
            <template v-for="(item, index) in ele.zhiqian">
              <su-spenddown
                :item="item"
                :key="'z' + index"
                :i="index"
                :div="'.file-text > .body'"
              />
            </template>
            <template v-for="(item, index) in ele.item">
              <su-spend
                @suSpendFun="suSpendFun(item)"
                @closeEleFun="closeEleFun(index)"
                :item="item"
                :key="index"
                :i="index"
                :div="'.file-text > .body'"
              />
            </template>
            <pre v-html="datas.content"></pre>
          </div>
        </div>
      </div>
    </div>
    <div class="preview_bottom" v-if="tyxs">
      <div v-if="ty != 'fb'" class="preview_bottom_title">
        <span>{{ type_arr[ty].text }}人员:</span>
        <span
          v-if="ty == 'cy' || ty == 'ff'"
          class="preview_bottom_title_text"
          >{{ process_data }}</span
        >
        <span v-if="ty == 'cs'" class="preview_bottom_title_text">{{
          delivery_notice
        }}</span>
      </div>
      <div v-if="ty != 'fb'" class="preview_bottom_msg flex-ac">
        {{ type_arr[ty].text }}后不可撤回，确认{{ type_arr[ty].text }}？
      </div>
      <div v-else-if="ty == 'fb'" class="preview_bottom_msg flex-ac">
        发布后全员将可见公文且不可撤回，确定发布？
      </div>
      <div class="preview_bottom_btn flex-ac">
        <div class="flex-col-bd btn qx" @click="clickSubmit(0)">取消</div>
        <div class="flex-col-bd btn" @click="clickSubmit(1)">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
let type_arr = {
  cs: {
    text: "呈送",
    type: 1,
  },
  cy: {
    text: "传阅",
    type: 2,
  },
  ff: {
    text: "分发",
    type: 3,
  },
  fb: {
    text: "发布",
    type: 4,
  },
};
import { HttpUrl } from "@/js/public";
import SuSpend from "@/components/SuSpend"; //new
import SuSpenddown from "@/components/SuSpenddown"; //new
export default {
  components: {
    SuSpend,
    SuSpenddown,
  },
  data() {
    return {
      type: 1,
      HttpUrl,
      view_data: {
        fir: [],
        sec: [],
      },
      ty: "",
      type_arr,
      processNew_data: [],
    };
  },
  computed: {
    //套红模板
    Getredtemplat() {
      if (this.datas.process == undefined) {
        return {
          content: "",
          id: "",
          name: "",
        };
      } else {
        return this.datas.process;
      }
    },
    img() {
      return (v) => {
        let text = String(v).startsWith("http");
        let imgurl = "";
        if (text) {
          imgurl = v;
        } else {
          imgurl = HttpUrl + v;
        }
        return imgurl;
      };
    },
    datas() {
      return this.$store.state.edittext.datas;
    },
    fields_data() {
      return this.$store.state.edittext.document_arrs;
    },
    ele() {
      // console.log(this.$store.state.edittext.ele);
      return this.$store.state.edittext.ele;
    },
    tyxs() {
      return this.ty ? true : false;
    },
    // processNew_data() {
    //   return this.$store.state?.processNew[this.ty + "Val"]?.values;
    // },
    process_data() {
      if (this.tyxs) {
        let a_data = this.processNew_data.map((res) => {
          return res.title;
        });
        return a_data.join(" , ");
      } else {
        return "";
      }
    },
    submitType: {
      get() {
        return this.$store.state.processNew.submitType;
      },
      set(value) {
        this.$store.state.processNew.submitType = value;
      },
    },
    document_arr() {
      return this.$store.state.edittext.document_arr;
    },
    delivery_notice() {
      let _main_delivery = [];
      let _delivery_notice = "";
      if (
        this.document_arr &&
        this.document_arr.main_delivery &&
        (this.document_arr.main_delivery.select ||
          this.document_arr.main_delivery.inter)
        // ----------------------------
      ) {
        _main_delivery = this.document_arr.main_delivery.select.map((item) => {
          return item.name;
        });
        // ----------------------------
            this.document_arr.main_delivery.inter &&
              this.document_arr.main_delivery.inter.forEach((el) => {
                _main_delivery.push(el.name);
              });
              // ----------------------------
      }
      _delivery_notice =
        _main_delivery.join(",") +
        `${
          _main_delivery.length > 0 && this.document_arr.main_delivery.text
            ? ","
            : ""
        }` +
        `${
          this.document_arr.main_delivery.text
            ? this.document_arr.main_delivery.text
            : ""
        }`;
      return _delivery_notice;
    },
  },
  created() {},
  activated() {
    this.ty = this.$route.query.htype;
    this.type = this.datas.type;
    if (this.ty == "cy" || this.ty == "ff") {
      this.processNew_data = this.$store.state?.processNew[
        this.ty + "Val"
      ]?.values;
    }
    // console.log(this.ty, this.processNew_data);
    this.set_view_document_data();
    this.set_view_style();
    if (this.$route.query?.is_p) {
      // console.log("打印");
      this.getPdf("#print");
    }
  },
  mounted() {
    // 加水印
    this.$setWatermark("print");
  },
  methods: {
    clickSubmit(val) {
      this.submitType = val;
      this.$router.go(-1);
    },
    set_view_document_data() {
      let zanshi_fir = [];
      let zanshi_sec = [];
      let header_data = null;
      header_data = JSON.parse(JSON.stringify(this.datas.fields));
      for (let key in header_data) {
        if (["title", "word_no"].includes(key)) {
          zanshi_fir.push({
            c_name: header_data[key].c_name,
            e_name: header_data[key].e_name,
            value: header_data[key].value,
          });
        } else if (typeof header_data[key].value == "object") {
          let v = header_data[key].values.map((v) => {
            return v.title;
          });
          if (
            zanshi_sec.length > 0 &&
            zanshi_sec[zanshi_sec.length - 1].length < 2
          ) {
            zanshi_sec[zanshi_sec.length - 1].push({
              value: v.join(),
              c_name: header_data[key].c_name,
              e_name: header_data[key].e_name,
            });
          } else {
            zanshi_sec.push([
              {
                value: v.join(),
                c_name: header_data[key].c_name,
                e_name: header_data[key].e_name,
              },
            ]);
          }
        } else {
          if (
            zanshi_sec.length > 0 &&
            zanshi_sec[zanshi_sec.length - 1].length < 2
          ) {
            zanshi_sec[zanshi_sec.length - 1].push({
              value: header_data[key].value,
              c_name: header_data[key].c_name,
              e_name: header_data[key].e_name,
            });
          } else {
            zanshi_sec.push([
              {
                value: header_data[key].value,
                c_name: header_data[key].c_name,
                e_name: header_data[key].e_name,
              },
            ]);
          }
        }
      }
      this.view_data = { fir: zanshi_fir, sec: zanshi_sec };
    },
    // 移动签章事件
    set_view_style() {
      setTimeout(() => {
        let sec_style = document.querySelectorAll(".sec");
        for (let i = 0; i < sec_style.length; i++) {
          let sec_height = sec_style[i].clientHeight;
          for (let j = 0; j < sec_style[i].childNodes.length; j++) {
            sec_style[i].childNodes[j].setAttribute(
              "style",
              "min-height:" + sec_height + "px"
            );
          }
        }
      });
    },
    // 移动签章事件
    suSpendFun(item) {
      // console.log(this.ele);
      let ele_arr = [...this.ele.zhiqian, ...this.ele.item];
      let _max = ele_arr.reduce((a, b) => {
        return b.position.zindex > a?.position?.zindex ? b : a;
      });
      item.position.zindex = _max.position.zindex + 1;
    },
    // 移除电子签章
    closeEleFun(n) {
      this.ele.item.splice(n, 1);
      this.saveeleid();
    },
    // 修改签章
    saveeleid() {
      let _ele = this.ele.item.map((v) => {
        if (v.type != 100) {
          return {
            id: v?.id ? v?.id : "",
            signature_id: v.signature_id,
            signature_img: this.img(v.img),
            position: v.position,
            signature_base: v.signature_base,
          };
        } else {
          return {
            id: v?.id ? v?.id : "",
            signature_id: "",
            signature_img: this.img(v.img),
            position: v.position,
            signature_base: v.signature_base,
          };
        }
      });
      _ele.sort(this.sortData);
      let _eles = _ele.map((v, i) => {
        v.position.zindex = 500 + i;
        return v;
      });
      sessionStorage.setItem("signature_ele", JSON.stringify(_eles));
      this.$store.commit("getsignature", _eles);
    },
  },
};
</script>

<style lang="less" scoped>
.previews {
  padding-bottom: 200px;
}
.preview_box {
  width: 700px;
  transform: scale(414 / 700);
  transform-origin: top left;
}
.preview_bottom {
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 25px 0;
  font-weight: 500;
  box-shadow: 0px -1px 0px rgba(0, 0, 0, 0.16);
  .preview_bottom_title {
    font-size: 18px;
    .preview_bottom_title_text {
      padding-left: 5px;
      color: #0082ef;
    }
  }
  .preview_bottom_msg {
    margin: 17px 0;
    height: 46px;
    background-color: #f3f3f3;
    font-size: 14px;
    padding: 0 13px;
  }
  .preview_bottom_btn {
    font-size: 16px;
    color: #606266;
    position: relative;
    .btn {
      text-align: center;
      padding: 13px 0;
    }
    &::after {
      content: "";
      width: 1px;
      height: 18px;
      background-color: #dcdfe6;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
/deep/ img {
  display: block;
}
.preview-title-box {
  width: 793px;
  height: 50px;
  position: absolute;
  top: -60px;
  padding: 0 15px;
  display: flex;
  background: #ffffff;
  border-radius: 4px;
  transition: all 0.1s;
  left: 50%;
  transform: translateX(-50%);

  .preview-box-title {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.preview-title-boxs {
  right: 50.1%;
  width: 793px;
  height: 56px;
  transition: all 0.3s linear;
  padding: 0px 26px 0px 20px;
  opacity: 1;
}

//  预览公文内容
.zhang {
  position: absolute;
}
/deep/.red-head {
  * {
    position: relative !important;
    max-width: 558px !important;
    word-break: break-all !important;
    word-wrap: break-word !important;
    white-space: pre-wrap !important;
  }
}
.preview {
  width: 555px;
  margin: 0 auto;
  padding: 132px 0px;
  box-sizing: border-box;

  h2 {
    text-align: center;
    color: #ff0000;
    margin-bottom: 20px;
    font-size: 26px;
    font-family: FangSong;
    font-weight: bold;
  }

  .time {
    text-align: right;
    color: #000000;
    font-size: 12px;
    font-family: SimSun;
    margin-bottom: 16px;
  }

  .content-text {
    .line {
      display: flex;
      align-items: center;
      border-bottom: none;
      flex: 1;
      font-family: FangSong !important;
      color: #000000;
      font-size: 19px;

      &:last-child {
        border-bottom: 1px solid #ff0000;
      }

      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ff0000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 10px;
        font-weight: bold;
      }
    }

    // 第一种
    .fir {
      line-height: 32px;
      box-sizing: border-box;
      border: 1px solid #fa5555;
      border-bottom: none;

      .head {
        margin-top: -1px;
        color: #ff0000;
        height: 54px !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        max-width: 440px;
        height: 100%;
        padding-left: 10px;
        min-height: 48px;
        white-space: normal;
        word-break: break-all;
      }
    }

    .sec {
      display: flex;
      border: 1px solid #fa5555;
      border-bottom: none;
      position: relative;
      overflow: hidden;

      .item {
        display: flex;
        height: 100%;
        min-height: 48px;
        width: 50%;

        &:last-child {
          border-left: 1px solid #fa5555;
        }
      }

      .content {
        display: flex;
        align-items: center;
        min-height: 48px;
        max-width: 166px;
        flex-wrap: wrap;
        white-space: normal;
        word-break: break-all;
      }
    }
  }

  /deep/ .file-text {
    position: relative;
    .head {
      text-align: center;
      color: #ff0000;
      margin-top: 88px;
      :not(b) {
        position: relative !important;
        max-width: 555px !important;
        word-break: break-all !important;
        word-wrap: break-word !important;
        white-space: pre-wrap !important;
        overflow-x: hidden;
      }
      pre {
        white-space: normal;
      }
    }

    .body-title {
      height: 56px;
      font-size: 29px;
      font-family: SimSun !important;
      font-weight: 400;
      line-height: 42px;
      color: #000000;
      text-align: center;
      margin-top: 36px;
      margin-bottom: 40px;
    }

    .body {
      position: relative;
      font-family: FangSong !important;
      font-weight: 400;
      color: #000000;
      min-height: 605px;
      p,
      h1,
      h2,
      h3,
      h4,
      h5,
      table,
      pre {
        margin: 10px 0 !important;
        line-height: 1.5 !important;
      }
      table {
        border-collapse: collapse;
      }
      /deep/ p {
        word-wrap: break-word;
        word-break: break-all;
        margin: 0 !important;
      }
      pre {
        font-size: 19px;
        font-family: FangSong !important;
        white-space: pre-wrap !important; /*css-3*/
        white-space: -moz-pre-wrap !important; /*Mozilla,since1999*/
        white-space: -pre-wrap !important; /*Opera4-6*/
        white-space: -o-pre-wrap !important; /*Opera7*/
        word-wrap: break-word !important; /*InternetExplorer5.5+*/

        * {
          line-height: 1.5;
          font-family: FangSong !important;
          max-width: 555px;
        }
      }

      p {
        margin-bottom: 0;
      }
    }
  }
}
</style>
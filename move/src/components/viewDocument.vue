<template>
  <!-- 预览公文内容 -->
  <div class="preview init">
    <h2>发文单</h2>
    <div class="content-text" ref="content_text">
      <div class="line fir" v-for="(item,index) in view_data.fir" :key="'fir'+index">
        <div class="head">{{item.c_name}}</div>
        <div class="content">{{item.value}}</div>
      </div>
      <div class="line sec" v-for="(item,index) in view_data.sec" :key="'sec'+index">
        <div class="item" v-for="(item2) in item" :key="item2.e_name">
          <div class="head">{{item2.c_name}}</div>
          <div class="content">{{item2.value}}</div>
        </div>
      </div>
    </div>
    <div class="file-text" ref="file_text">
      <div class="head" v-if="Getredtemplat&&Getredtemplat.content">
        <h3 v-html="Getredtemplat.content"></h3>
      </div>
      <div class="body" v-if="datas">
        <template v-for="(item, index) in ele.zhiqian">
          <su-spenddown :item="item" :key="item.id+index" :i="index" :div="'.file-text > .body'" />
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
</template>

<script>
import { HttpUrl } from "@/js/public";
import SuSpend from "@/components/SuSpend"; //new
import SuSpenddown from "@/components/SuSpenddown"; //new
export default {
  props: ["datas", "ele"],
  components: {
    SuSpend,
    SuSpenddown,
  },
  data() {
    return {
      HttpUrl,
      view_data: {
        fir: [],
        sec: [],
      },
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
  },
  created() {
    // console.log(this.datas);
    this.set_view_document_data();
    this.set_view_style();
  },
  mounted() {},
  methods: {
    //数据预览
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
          // console.log(key);
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
      // console.log(this.view_data);
    },
    //设置预览的样式
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
      let _max = this.ele.item.reduce((a, b) => {
        return b.position.zindex > a?.position?.zindex ? b : a;
      });
      // console.log(_max.position.zindex);
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
//  预览公文内容
.zhang {
  position: absolute;
}
.preview {
  width: 750px;
  padding: 0 30px 30px 30px;
  box-sizing: border-box;
  h2 {
    text-align: center;
    color: #fa5555;
    margin-bottom: 20px;
    font-size: 30px;
    font-weight: bold;
  }
  .time {
    text-align: right;
    color: #909399;
    font-size: 12px;
  }
  .content-text {
    .line {
      display: flex;
      align-items: center;
      border-bottom: none;
      flex: 1;
      &:last-child {
        border-bottom: 1px solid #fa5555;
      }
      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        color: #fa5555;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .content {
        border-left: 1px solid #fa5555;
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
        padding-left: 10px;
        color: #fa5555;
        height: 48px !important;
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .content {
        display: flex;
        align-items: center;
        max-width: 443px;
        height: 100%;
        padding-left: 10px;
        min-height: 48px;
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
        border-right: 1px solid #fa5555;
        width: 50%;
        &:last-child {
          border-right: none;
        }
      }
      .content {
        min-height: 48px;
        max-width: 244px;
        padding: 15px;
      }
    }
  }
  /deep/ .file-text {
    .head {
      text-align: center;
      h3 {
        color: #fa5555;
        padding: 10px 0;
        font-size: 20px;
        font-weight: 600;
        width: 100%;
        border-bottom: 1px solid #f56c6c;
        #content {
          margin: 0px;
          p {
            margin: 0px;
          }
        }
      }
    }
    .body {
      min-height: 200px;
      position: relative;
      pre {
        white-space: pre-wrap; /*css-3*/
        white-space: -moz-pre-wrap; /*Mozilla,since1999*/
        white-space: -pre-wrap; /*Opera4-6*/
        white-space: -o-pre-wrap; /*Opera7*/
        word-wrap: break-word; /*InternetExplorer5.5+*/
      }
    }
  }
}
span {
  background: chartreuse;
}
</style>
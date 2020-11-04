<template>
  <div class="box">
    <div class="warning">* 注：此版为与上一修改版本比较做的修改</div>
    <div class="tips">
      <div>
        <div class="del"></div>
        <div>删除</div>
      </div>
      <div>
        <div class="modify"></div>
        <div>修改</div>
      </div>
      <div>
        <div class="add"></div>
        <div>新增</div>
      </div>
    </div>

    <div class="infoBox">
      <div class="titleTable">
        <div>发文单</div>
      </div>
      <table align="center" cellspacing="0" cellpadding="6" border="1">
        <tbody>
          <tr align="center">
            <td height="44px">发文标题</td>
            <td colspan="3"></td>
          </tr>
          <tr align="center">
            <td height="44px">发文字号</td>
            <td colspan="3"></td>
          </tr>
          <tr align="center">
            <td height="44px">密级程度</td>
            <td width="25%"></td>
            <td width="25%">紧急程度</td>
            <td width="25%"></td>
          </tr>
          <tr align="center">
            <td height="80px">抄送单位</td>
            <td></td>
            <td>核稿人</td>
            <td></td>
          </tr>
          <tr align="center">
            <td height="80px">主送单位</td>
            <td></td>
            <td>签发人</td>
            <td></td>
          </tr>
          <!-- <tr align="center">
              <td height="44px"></td>
              <td colspan="3"></td>
          </tr>-->
        </tbody>
      </table>
      <div style="margin-top:5px" class="content">
        <div class="centertext" ref="centertext"></div>
        <div class="centertext" v-if="last"></div>
        <div id="show"></div>
      </div>
    </div>
    <div id="aaa"></div>
  </div>
</template>

<script>
import { documentRecord } from "../../api/home";
import { initUI } from "../../assets/js/up";

export default {
  data() {
    return {
      last: false,
      userid: "", //审核人的id
      fid: "", //发文id
      lastData: "", //上次内容
      thisDate: "", //这次内容
      last: [],
      this: [],
      valThis: [],
      valLast: []
    };
  },
  methods: {
    // 数据对比函数，value上次内容 orig2本次内容 textone放入旧内容元素 texttwo放入新内容元素
    // temporary当前对比结果 CodeMirror存放内容的盒子 text放入新的元素
    getDocumentRecord() {
      let data = new URLSearchParams();
      data.append("userid", this.userid);
      data.append("id", this.fid);
      //  data.append('id',100)
      documentRecord(data).then(res => {
        this.lastData = res.data.diff.lastdata.content;
        this.thisDate = res.data.diff.thisdata.content;
        this.last = res.data.diff.lastdata.fields;
        this.this = res.data.diff.thisdata.fields;
        this.this.forEach(item => {
          this.valThis[item.c_name] = item.value;
        });
        // this.valThis = JSON.stringify(this.valThis);

        this.last.forEach(item => {
          this.valLast[item.c_name] = item.value;
        });
        // this.valLast = JSON.stringify(this.valLast);
        // console.log(this.valThis, "this.last");
        // console.log(this.valLast, "this.this");
        // return;
        // console.log(this.last, "this.last");
        // console.log(this.this, "this.this");
        // this.initUI(this.valThis, this.valLast);
        initUI(
          this,
          this.thisDate,
          this.lastData,
          "show",
          "centertext",
          document
        );
      });
    },
    // initUI(value, orig2) {
    //   // console.log(value);
    //   // console.log(orig2);
    //   if (value == null) return;
    //   let target = document.getElementById("aaa");
    //   target.innerHTML = "";
    //   this.$CodeMirror.MergeView(target, {
    //     value: value, //上次内容
    //     origLeft: null,
    //     orig: orig2, //本次内容
    //     lineNumbers: true, //显示行号
    //     mode: "text/html",
    //     highlightDifferences: true,
    //     connect: "align",
    //     readOnly: true //只读 不可修改
    //   });
    // }
  },
  created() {
    this.userid = this.$route.query.id;
    this.fid = this.$route.query.fid;
    this.getDocumentRecord();
    // console.log(this.userid);
  }
};
</script>
<style lang="scss" scoped>
.box {
  min-height: 100vh;
  background-color: #fff;
  overflow: hidden;
}
.warning {
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  color: #f56c6c;
  font-size: 12px;
  padding: 0 15px;
}
.tips {
  height: 44px;
  line-height: 44px;
  background-color: #f7f8fa;
  padding: 0 78px;
  display: flex;
  justify-content: space-around;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
}
.del {
  width: 24px;
  height: 24px;
  background: rgba(245, 108, 108, 1);
  opacity: 0.1;
  border-radius: 12px;
  margin-right: 6px;
}
.modify {
  width: 24px;
  height: 24px;
  background: rgba(98, 194, 50, 1);
  opacity: 0.1;
  border-radius: 12px;
  margin-right: 6px;
}
.add {
  width: 24px;
  height: 24px;
  background: rgba(0, 130, 239, 1);
  opacity: 0.1;
  border-radius: 12px;
  margin-right: 6px;
}

.infoBox {
  padding: 19px;
  font-size: 14px;
  .time {
    position: absolute;
    right: 5px;
    top: 5px;
    color: #a7a8aa;
    font-size: 12px;
  }
  .titleTable {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    color: #f00;
    div:nth-child(1) {
      font-size: 16px;
    }
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  table td {
    border: 2px solid #f00;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
  table td:nth-child(1) {
    color: #f00;
  }
  table td:nth-child(3) {
    color: #f00;
  }
}
// tab2
.content {
  padding: 0px 15px;
  padding-bottom: 90px;
}
/deep/ .CodeMirror-merge-r-inserted {
  background: #62c232;

  background-image: none !important;
  color: #ffffff;
}
/deep/ .CodeMirror-merge-r-deleted {
  color: #ffffff;
  background: #fa5555;

  background-image: none !important;
}
/deep/ .CodeMirror-merge-r-chunk-end {
  border: none;
}
/deep/.CodeMirror-merge-r-chunk-start {
  border: none;
}
/deep/.CodeMirror-merge-r-chunk {
  background: none;
}
/deep/pre {
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  word-break: break-all;
  overflow: hidden;
}
/deep/.CodeMirror-code {
  // width: calc(100% - 20px);
  position: relative;
  left: -5px;
}

#show {
  opacity: 0;
  // position: absolute;
}
</style>
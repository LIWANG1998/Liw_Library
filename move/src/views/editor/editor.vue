<template>
  <div class="editor init bg-color-3f">
    <vue-html5-editor
      :content="content"
      :class="
        ele.zhiqian.length > 0 || ele.item.length > 0
          ? 'wo-editor1'
          : 'wo-editor2'
      "
      @change="
        (e) => {
          onEditorBlur(e);
        }
      "
    ></vue-html5-editor>
    <!-- <quill-editor
      v-model="content"
      ref="myQuillEditor"
      @blur="onEditorBlur($event)"
      :options="editorOption"
      :class="ele.zhiqian.length>0 || ele.item.length>0?'wo-editor1':'wo-editor2'"
    ></quill-editor> -->
    <EleSign :ele="ele"></EleSign>
    <div class="btm-btn">
      <div class="btn-ok" @click="okback">完成</div>
    </div>
  </div>
</template>
<script>
import EleSign from "@/components/EleSign";
export default {
  components: {
    EleSign,
  },
  name: "editor", // 编辑正文内容
  data() {
    return {
      // content: "", // 富文本框内容
      // 配置字段
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }][
              ({ script: "sub" }, { script: "super" })
            ],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ align: [] }],
          ],
        },
        placeholder: "请输入文字内容...",
      },
      // 配置字段
    };
  },
  created() {},
  activated() {

    // console.log(this.ele);
    // this.content = this.contents;
  },
  computed: {
    ele() {
      return this.$store.state.edittext.ele;
    },
    content: {
      get() {
        return this.$store.state.edittext.content;
      },
      set(value) {
        this.$store.state.edittext.content = value;
      },
    },
  },
  methods: {
    
    // // 准备编辑器
    // onEditorReady(editor) {
    //   // console.log("准备编辑器");
    // },
    // 失去焦点事件
    onEditorBlur(e) {
      this.content = e;
    },
    // // 获得焦点事件
    // onEditorFocus() {
    //   // console.log("获得焦点事件");
    // },
    // // 内容改变事件
    // onEditorChange(e) {
    //   // console.log(e);
    //   // console.log("内容改变事件");
    // },
    okback() {
      // this.$store.commit("setContent", this.content);
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.editor {
  height: 100%;
  .btm-btn {
    box-shadow: 0px -1px 1px rgba(0, 0, 0, 0.1);
    height: 60px;
    padding: 8px 15px;
    .btn-ok {
      width: 100%;
      height: 100%;
      background-color: #0082ef;
      border-radius: 4px;
      line-height: 44px;
      text-align: center;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
.wo-editor1 {
  height: calc(100% - 60px - 157px);
}
.wo-editor2 {
  height: calc(100% - 60px - 57px);
}
/deep/ .vue-html5-editor {
  /deep/ .toolbar {
    white-space: nowrap;
    /deep/ ul {
      overflow: auto;
    }
  }

  .content {
    height: calc(100% - 37px);
    /deep/ * {
      max-width: 100vw;
      white-space: pre-wrap !important;
    }
  }
}
// /deep/ .quill-editor {
//   .ql-snow {
//     border: none;
//   }
//   .ql-toolbar {
//     height: 46px;
//     background-color: #f4f5f6;
//   }
//   .ql-container {
//     height: calc(100% - 46px);
//   }
// }
</style>
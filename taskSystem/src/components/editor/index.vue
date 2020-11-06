<template>
  <!-- Two-way Data-Binding -->
  <div>
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
    />
    <div style="text-align: right; padding-right: 10px">{{ TiLength }}/500</div>
  </div>
</template>

<script>
// You can also register Quill modules in the component

import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  props: {
    content: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "请在这里输入",
    },
    empty:{
      type: Boolean,
      default:false,
    },
    sonEditor:{
      type: Boolean,
      default: false
    }
  },
  watch: {
    placeholder:{
      handler(val){
          this.editorOption.placeholder = val;
      },
      immediate:true
    },
    empty: {
      deep: true,
      immediate: true,
      handler(val) {
        let _ql_blank = document.getElementsByClassName('ql-blank');
        _ql_blank = _ql_blank[_ql_blank.length - 1]
        // _ql_blank =  _ql_blank.slice(_ql_blank.length-1,_ql_blank.length);
        console.log(_ql_blank)
        if (_ql_blank && _ql_blank.className){
          if (val){
            _ql_blank.className += ' is-empty'
          } else {
            _ql_blank?.classList.remove('is-empty')
          }
        }

      }
    },
  },
  data() {
    return {
      TiLength: 0,
      editorOption: {
        placeholder: "请在这里输入",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            // [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: "ordered" }, { list: "bullet" }], //列表
            [{ align: [] }], //对齐方式
            // [{ indent: "-1" }, { indent: "+1" }], // 缩进
            // [{ direction: "rtl" }], // 文本方向
            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
            [{ font: [] }], //字体
          ],
        },
      },
    };
  },
  components: {
    quillEditor,
  },
  methods: {
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      this.content = html;
      quill.deleteText(500, 1);
      this.TiLength = quill.getLength() - 1;
      this.$emit("change",html,this.TiLength);
    },
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted() {
    this.TiLength = this.$refs.myQuillEditor.quill.getLength() - 1;
  },
};
</script>
<style scoped lang="less">
/deep/.ql-toolbar {
  border-color: #e8e8ee;
}
/deep/.ql-container {
  border: none;
  min-height: 100px;
  .ql-editor {
    min-height: 100px;
  }
  .ql-editor.ql-blank::before{
    font-style:inherit;
    color: #c8c9cc;
  }
  .ql-editor.ql-blank.is-empty::before{
    color: red;
  }
}

</style>

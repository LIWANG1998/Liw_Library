<template>
  <div class="box">
    <quill-editor
      class="editor"
      v-model="messages"
      :options="editorOption"
      ref="myQuillEditor"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @ready="onEditorReady"
    ></quill-editor>
    <van-button color="#0082EF" @click="submit()" block>确定</van-button>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
// import { getWord } from "../../api/home";
export default {
  components: {},
  data() {
    return {
      status: "", //区分跳转页面的状态
      type: "",
      id: "",
      messages: "",
      title: "",
      value: [],
      content: null,
      file_url: "", //传过来的文件
      editorOption: {
        modules: {
          // syntax: {
          //   highlight: text => hljs.highlightAuto(text).value
          // },
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }]
            // [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
            // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
            // [{'direction': 'rtl'}],                         // text direction

            // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
            // [{'header': [1, 2, 3, 4, 5, 6, false]}],

            // [{'color': []}, {'background': []}],          // dropdown with defaults from theme
            // [{'font': []}],
            // [{'align': []}],
            // ['link', 'formula']//去除video即可
            // ['link', 'image', 'video', 'formula']//去除video即可
          ]
        },
        placeholder: "请输入文字内容..."
      }
    };
  },

  methods: {
    //获取文件
    getFile() {
      let data = new URLSearchParams();
      data.append("path", this.file_url);
      getWord(data).then(res => {
        if (res.code == 1) {
          // console.log(res);

          this.messages = res.data;
          // // console.log(this.messages);
        }
      });
    },

    // 提交
    submit() {
    //   // console.log(this.messages);
    //   // console.log('133');
      
    //   if (this.status == 1) {
    //     // console.log("sendingDetails");
    //     sessionStorage.setItem("content", this.messages);
    //     this.$router.push({
    //       path: "/sendingDetails",
    //       query: {
    //         fid: this.id,
    //         type: this.type
    //       }
    //     });
    //   } else {
    //     // console.log("draft");
    //     sessionStorage.setItem("content", this.messages);
    //     this.$router.push({
    //       path: "/draft",
    //       query: {
    //         id: this.id,
    //         type: this.type
    //       }
    //     });
    //   }
    },

    onEditorBlur() {
      // console.log("blur", this.messages);
    },

    onEditorFocus() {
      // console.log("focus", this.messages);
    },

    onEditorReady() {
      // console.log("ready", this.messages);
    }
  },
  activated() {
    if (sessionStorage.getItem("content")) {
      this.messages = sessionStorage.getItem("content");
    }
  },
  created() {
    // console.log( this.content);
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.status = this.$route.query.status;
    // console.log(this.status);

    this.file_url = this.$route.query.key;
    if (this.file_url) {
      this.getFile();
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
    margin-top:2px ;

  background-color: #fff;
}
/deep/.ql-editor {
  height: 81vh;
}
/* .wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
  
      .title {
        font-size: $font-size-large;
        color: $text-main;
        padding-bottom: px2rem(6);
        line-height: 150%;
      }
  
      .input-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: px2rem(5) 0;
        box-sizing: border-box;
  
        .editor{
          width: 100%;
          height: px2rem(200);
        }
  
        .sub-title {
          font-size: $font-size-normal;
          color: $text-normal;
        }
  
        .field {
          flex: 1;
          border: 1px solid $border-third;
        }
      }
    }
  
    div.ql-container.ql-snow{
      height: px2rem(100);
    }
  
    div.ql-editor.ql-blank{
      height: px2rem(50);
    }
   */
</style>
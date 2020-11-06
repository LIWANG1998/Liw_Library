<template>
  <van-popup
    v-if="_show"
    v-model="_show"
    :class="['sub-task', 'popup']"
    :overlay="false"
  >
    <van-form  ref="addSonForm" scroll-to-error :show-error-message="false" @submit="onSubmit">
      <div class="box">
        <van-field
          v-model="form.title"
          required
          name="title"
          label="任务标题"
          placeholder="请添加标题限制20个字符"
          maxlength="20"
          autocomplete="false"
          clearable
          :rules="[{ required: true, message: '请添加标题限制20个字符' }]"
        />
        <van-field
          :value="form.content"
          required
          name="content"
          rows="1"
          label="任务内容"
          type="text"
          class="border-none"
          :rules="[{ required: true, message: '请添加内容限制500个字符' }]"
        >
          <template #input>
            <input type="hidden" />
<!--            <div v-if="isEditorErr" style="color: #ee0a24">-->
<!--              请添加内容限制500个字符-->
<!--            </div>-->
          </template>
        </van-field>
        <editor
          id="sonEditor"
          sonEditor = 'true'
          :empty="isEditorErr"
          :content="form.content"
          @change="editorChange"
          placeholder="请添加内容限制500个字符"
        ></editor>
        <van-field
          v-model="leadUserName"
          name="subtask_lead_user"
          label="负责人"
          input-align="right"
          autocomplete="false"
          right-icon="arrow"
          label-class="label-user"
          readonly
          placeholder="不选择负责人则全员可见"
          @click="handleLead"
        >
          <template #label>
            <span class="label">负责人</span>
            <span class="gray">（{{ leadUserNum }}）</span>
          </template>
        </van-field>
      </div>
      <div class="box">
        <div class="title border-none">
          上传附件
          <label class="gray" />
        </div>
        <van-field name="file_url">
          <template #input>
            <upload :file="fileUrl" @change="handleFile" />
          </template>
        </van-field>
      </div>
      <footer>
        <van-button type="default" native-type="button" @click="handleCancel">
          返回
        </van-button>
        <van-button
          @click="onSubmit"
          type="info"
          :disabled="button.loading"
          :loading="button.loading"
          :loading-text="button.text"
        >
          保存
        </van-button>
      </footer>
    </van-form>
    <list-check
      :show.sync="leadUserShow"
      :data="userData"
      :selectUser="form.subtask_lead_user"
      @done="listCheckDone"
    ></list-check>
  </van-popup>
</template>
<script>
let lodash = require("lodash");
import { upload, popup, listCheck, editor } from "@/components";
import {task} from "@/api"
export default {
  components: {
    upload,
    popup,
    listCheck,
    editor,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
    userData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        title: "",
        content: "",
        file_url: [],
        subtask_lead_user: "",
      },
      fileUrl: [],
      leadUserShow: false,
      leadUserName: "",
      leadUserNum: 0,
      button: {
        loading: false,
        text: "保存中",
      },
      isEdit: false,
      isEditorErr: false,
    };
  },
  computed: {
    _show: {
      get: function () {
        return this.show;
      },
      set: function (val) {
        this.$emit("update:show", val);
      },
    },
  },
  watch: {
    // data: {
    //   handler(val) {
    //     console.log(val)
    //     if (val.id){
    //       this.getSonTask(val.id)
    //     }else if (val.title) {//新增时修改子任务
    //       Object.keys(this.form).forEach((keys) => {
    //         this.form[keys] = val[keys];
    //       });
    //       if (val.id) {
    //         this.form.id = val.id;
    //       }
    //       this.fileUrl = val.file_url;
    //       this.isEdit = true;
    //     } else {
    //       Object.keys(this.form).forEach((keys) => {
    //         this.form[keys] = Array.isArray(this.form[keys]) ? new Array() : "";
    //       });
    //       this.fileUrl = val.file_url;
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    show:{
      immediate: true,
      deep:true,
      handler(val){
       if (val){
         document.title = this.data.id ? '编辑子任务' : '新增子任务'
         if (this.data.id){
           this.getSonTask(this.data.id)
         }else if (this.data.title) {//新增时修改子任务
           Object.keys(this.form).forEach((keys) => {
             this.form[keys] = this.data[keys];
           });
           if (this.data.id) {
             this.form.id = this.data.id;
           }
           this.fileUrl = this.data.file_url;
           this.isEdit = true;
         } else {
           Object.keys(this.form).forEach((keys) => {
             this.form[keys] = Array.isArray(this.form[keys]) ? new Array() : "";
           });
           this.fileUrl = this.data.file_url;
         }
       } else {
         document.title = '发起任务'
       }
      }
    }
  },
  methods: {
    handleFile(val) {
      this.form.file_url = val;
    },
    handleCancel() {
      this._show = false;
      this.button.loading = false;
    },
    editorChange(val, length) {
      this.form.content = val;
      if (length > 0) {
        this.isEditorErr = false;
      } else {
        this.isEditorErr = true;
      }
    },
    handleLead() {
      if (this.userData.user && this.userData.user.length > 0) {
        this.leadUserShow = true;
      } else {
        return this.$notify({ type: "danger", message: "请选择主任务接收人" });
      }
    },
    listCheckDone(val) {
      this.form.subtask_lead_user = val.map((item) => item.id).join(",");
      this.form.subtask_lead_username = val.map((item) => {
          let _par = {name: item.name}
          return _par
      }
      )
      this.leadUserNum = val.length;
      this.leadUserName = val.map((item) => item.name);
    },
    onSubmit() {
      this.isEditorErr = false
      this.$refs.addSonForm
        .validateAll()
        .then(() =>{
          this.button.loading = true;
          let postData = Object.assign({}, this.form);
          postData.file_url = postData.file_url;
          setTimeout(() => {
            this.$emit("confirm", this.form);
            this._show = false;
            this.button.loading = false;
          }, 1000);
        }).catch((err) =>{
        this.isEditorErr = !this.isEditorErr
        this.isEditorErr = err.some(item =>{
          return item.name == 'content'
        })
        console.log(this.isEditorErr)
      })
    },
    async getSonTask(id) {
      let res = await task.getSonTask({id})
      if (res){
        let _data = res.data
        Object.keys(this.form).forEach((keys) => {
          this.form[keys] = _data[keys];
          if (_data.id) {
            this.form.id = _data.id;
          }
          this.fileUrl = _data.file_url;
          this.isEdit = true;
          this.form.subtask_lead_user = _data.subtask_lead_user
          this.leadUserNum = _data.subtask_lead_username.length;
          this.leadUserName = _data.subtask_lead_username.map((item) => item.name);
        });
      }
    }
  },
};
</script>
<style lang="less" scoped>
footer {
  padding: 0;
}
</style>

<template>
  <van-popup
    v-if="_show"
    v-model="_show"
    :class="['update-task','popup']"
    :overlay="false"
  >
    <van-form @submit="onSubmit">
      <div class="box">
        <van-field
          v-model="formShow.status"
          required
          name="title"
          label="任务状态"
          maxlength="12"
          autocomplete="false"
          clickable
          is-link
          center
          input-align="right"
          readonly
          @click="actionShow=true"
        />
        <van-field
          v-model="form.remarks"
          name="content"
          rows="4"
          autosize
          label="备注"
          type="textarea"
          maxlength="100"
          placeholder="请添加内容限制100个字符"
          class="border-none"
          show-word-limit
        />
      </div>
      <div class="box">
        <van-field
          v-model="formShow.notice_id"
          name="cc_userid"
          input-align="right"
          autocomplete="false"
          right-icon="arrow"
          label-class="label-title"
          readonly
          placeholder="请选择通知人"
          @click="pickerUserShow = true"
        >
          <template #label>
            <label>选择通知人</label>
            <span class="gray">(除发起人,接收人以外)</span>
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
            <upload
              :file="fileUrl"
              @change="handleFile"
            />
          </template>
        </van-field>
      </div>
      <action-sheet
        v-model="actionShow"
        :actions="actions"
        :round="false"
        @select="onSelect"
      />
      <picker-user
        :show.sync="pickerUserShow"
        :data="pickerUserData"
        :filter-data="filter"
        @confirm="pickerUserSubmit"
      />
      <footer>
        <van-button
          type="default"
          native-type="button"
          @click="handleCancel"
        >
          返回
        </van-button>
        <van-button
          type="info"
          :disabled="button.loading"
          :loading="button.loading"
          :loading-text="button.text"
        >
          更新
        </van-button>
      </footer>
    </van-form>
  </van-popup>
</template>
<script>

import { ActionSheet } from "vant";
import { pickerUser, upload } from "@/components";
import { task } from "@/api";
export default {
  components: {
    ActionSheet,
    upload,
    pickerUser,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    id: {
      type: Number | String,
      required: true,
    },
    pid: {
      type: Number | String,
      default: 0,
    },
    type: {
      type: String,
      required: true,
      default: "main",
    },
    filter: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {
        id: 0,
        status: 0,
        remarks: "",
        notice_id: "",
        task_id: "",
        file_url: [],
        pid: 0,
      },
      fileUrl: [],
      actionShow: false,
      pickerUserShow: false,
      pickerUserData: [],
      actions: [
        {
          name: "未完成",
          value: 0,
        },
        {
          name: "已完成",
          value: 1,
        },
      ],
      formShow: {
        status: "未完成",
      },
      button: {
        loading: false,
        text: "保存中",
      },
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
    show(val) {
      if (val) {
        this.getInfo();
      }
    },
  },
  created() {
    this.getInfo();
    this.$store.commit("SET_PICKER_USER",{filter:this.filter})
  },
  methods: {
    // 取消
    handleCancel() {
      this._show = false;
      this.button.loading = false;
    },
    onSelect(item) {
      this.form.status = item.value;
      this.formShow.status = item.name;
      this.actionShow = false;
    },
    handleFile(val) {
      this.form.file_url = val;
    },
    pickerUserSubmit(val) {
      this.form.notice_id = val.join(",");
      this.formShow.notice_id = `已选择${val.length}人`;
      this.pickerUserData = val;
    },
    onSubmit() {
      this.button.loading = true;
      this.updateProgress();
    },
    async updateProgress() {
      let postData = Object.assign({}, this.form);
      postData.file_url = postData.file_url&&postData.file_url.length > 0 ? postData.file_url : "";
      try {
        const { code, msg } = await task.updateProgress(postData);
        if (code) {
          this.$notify({ type: "success", message: msg });
          setTimeout(() => {
            this.button.loading = false;
            this._show = false;
          }, 500);
          if (this.type == "sub") {
            this.$bus.emit("subLoad");
            this.$bus.emit("load");
          } else {
            this.$bus.emit("load");
          }
        } else {
          if (code == 2) {
            this.$notify({ type: "danger", message: msg });
            this.$router.push("/");
            return false;
          }
          setTimeout(() => {
            this.button.loading = false;
            this._show = false;
          }, 500);
          if (this.type == "sub") {
            this.$bus.emit("subLoad");
            this.$bus.emit("load");
          } else {
            this.$bus.emit("load");
          }
          this.$notify({ type: "danger", message: msg });
        }
      } catch {
        this.button.loading = false;
        this.$notify({ type: "danger", message: "更新失败" });
      }
    },
    async getInfo() {
      let postData = { task_id: this.id };
      if (this.type == "sub") {
        postData.task_pid = this.pid;
      }
      const { code, data } = await task.getProgressInfo(postData);
      if (code) {
        this.fileUrl = data.file_url;
        console.log(data.notice_userid);
        this.pickerUserData = data.notice_userid;
        Object.keys(this.form).forEach((keys) => {
          this.form[keys] = data[keys];
        });
        this.formShow.status = this.actions.find(
          (item) => item.value == data.status
        ).name;
      } else if (code == 2) {
        this.$notify({ type: "danger", message: msg });
        this.$router.push("/");
        return false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.update-task {
  .title {
    line-height: 30px;
  }
  /deep/.label-title {
    width: 60%;
    font-size: 13px;
  }
  .gray {
    font-size: 12px;
    color: @gray;
  }
  .van-action-sheet__item {
    background: @white;
    border-bottom: 1px solid #ebedf0;
    color: #323233;
  }
}
</style>

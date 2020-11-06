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
          label="开始方式"
          maxlength="12"
          autocomplete="false"
          clickable
          is-link
          center
          input-align="right"
          readonly
          @click="actionShow=true"
        />
      </div>
      <div
        v-if="form.status"
        class="box"
      >
        <van-field
          v-model="form.start_time"
          required
          name="start_time"
          label="开始时间"
          placeholder="点击选择时间"
          input-align="right"
          right-icon="arrow"
          readonly
          clickable
          @click="handleChangeDate('start_time')"
        />
        <van-field
          v-model="form.end_time"
          name="end_time"
          required
          label="结束时间"
          placeholder="点击选择时间"
          input-align="right"
          right-icon="arrow"
          readonly
          clickable
          @click="handleChangeDate('end_time')"
        />
      </div>
      <action-sheet
        v-model="actionShow"
        :actions="actions"
        :round="false"
        @select="onSelect"
      />
      <van-popup
        v-model="showPopup"
        position="bottom"
        round
        :safe-area-inset-bottom="true"
        :lazy-render="true"
      >
        <date-time
          v-model="pickerDate"
          :min-date="minDate"
          type="datetime"
          @confirm="popupConfirm"
          @cancel="showPopup = false"
        />
      </van-popup>
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
          确定
        </van-button>
      </footer>
    </van-form>
  </van-popup>
</template>
<script>
import { common } from "@/api";
import { ActionSheet } from "vant";
import { dateTime } from "@/components";
import { task } from "@/api";
const currentDate = new Date();
//引入日期格式工具
let moment = require("moment");
moment.locale("zh-cn"); //汉化
export default {
  components: {
    ActionSheet,
    dateTime
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number | String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true,
      default: "main"
    }
  },
  data() {
    return {
      form: {
        id: 0,
        status: 0,
        start_time: "",
        end_time: ""
      },
      actionShow: false,
      actions: [
        {
          name: "立即开始",
          value: 0
        },
        {
          name: "定时开始",
          value: 1
        }
      ],
      formShow: {
        status: "立即开始"
      },
      showPopup: false,
      timeType: "start_time", //当前时间弹窗类型
      minDate: this.transformDate(this.startTime),
      pickerDate: currentDate,
      button: {
        loading: false,
        text: "保存中"
      }
    };
  },
  computed: {
    _show: {
      get: function() {
        return this.show;
      },
      set: function(val) {
        this.$emit("update:show", val);
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.form.start_time = this.startTime;
        this.form.end_time = this.endTime;
      }
    }
  },
  methods: {
    // 取消
    handleCancel() {
      this._show = false;
      this.button.loading = false;
      document.querySelector("body").removeAttribute("style");
    },
    onSelect(item) {
      this.form.status = item.value;
      this.formShow.status = item.name;
      this.actionShow = false;
    },
    // 弹窗确定事件
    popupConfirm(value) {
      let formVal = this.timeType;
      this.form[formVal] = moment(value.date).format("YYYY-MM-DD HH:mm");
      if (
        formVal == "start_time" &&
        moment(value.date).isAfter(moment(this.form.end_time))
      ) {
        this.form.end_time = moment(value.date).format("YYYY-MM-DD HH:mm");
      }
      this.showPopup = false;
    },
    handleBack() {
      this.$router.go(-1);
    },
    // 时间选择
    handleChangeDate(type) {
      this.pickerDate = this.transformDate(this.form[type]);
      this.timeType = type;
      this.showPopup = true;
      if (type === "end_time") {
        this.minDate = this.transformDate(this.form.start_time);
      }
    },
    //字符串转成为日期
    transformDate(date) {
      return date ? new Date(date.replace(/-/g, "/")) : new Date();
    },
    onSubmit() {
      this.startTask();
    },
    // 开始任务接口
    async startTask() {
      let postData = Object.assign({}, this.form);
      postData.id = this.id;
      postData.status = 1;
      if (!this.form.status) {
        postData.start_time = moment(new Date()).format("YYYY-MM-DD HH:mm");
        if (moment(new Date()).isAfter(moment(this.form.end_time))) {
          return this.$notify({
            type: "danger",
            message: "任务结束时间小于当前时间,无法立即开始,请选择定时开始"
          });
        }
      } else {
        if (moment(new Date()).isAfter(moment(this.form.end_time))) {
          return this.$notify({
            type: "danger",
            message: "任务结束时间必须大于当前时间"
          });
        }
      }
      this.button.loading = true;
      try {
        const { code, msg } = await task.complete(postData);
        this.button.loading = false;
        if (code) {
          this.$router.go(-1);
          return this.$notify({ type: "success", message: msg });
        } else {
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        return this.$notify({ type: "danger", message: "任务操作失败" });
      }
    }
  }
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
}
</style>
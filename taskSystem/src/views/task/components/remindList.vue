<template>
  <div class="remind-list">
    <van-button
      class="add-btn"
      native-type="button"
      @click="
        modePopupShow = true;
        editIndex = null;
      "
    >
      新增自定义提醒
      <van-icon name="plus" color="#0082EF" />
    </van-button>
    <div class="list">
      <van-row v-for="(item, index) in _list" :key="index" class="item">
        <div class="title flex flex-between flex-al">
          <div class="flex flex-al">
            <svg-icon icon-class="notice" class="icon" />
            提醒方式
          </div>
          <div class="gary">{{ getText("custom_type", item.custom_type) }}</div>
        </div>
        <div class="content">
          <div>提醒时间</div>
          <div class="time" v-html="getTime(item)"></div>
          <div class="reminder">
            <label>提醒人</label>
            <span>{{ getText("reminder", item.reminder) }}</span>
          </div>
        </div>
        <div class="action flex">
          <div class="red" @click="handleDel(index, item)">删除</div>
          <div @click="handleEdit(index)">编辑</div>
        </div>
      </van-row>
    </div>
    <van-popup
      v-model="modePopupShow"
      class="popup remind-add"
      :overlay="false"
      :get-container="getContainer"
    >
      <van-cell
        title="提醒设置"
        is-link
        center
        @click="handleSetAction('custom_type')"
      >
        <template #default>{{ actionName["custom_type"] }}</template>
      </van-cell>
      <van-cell
        title="时间类型"
        is-link
        center
        @click="handleSetAction('num_type')"
        v-if="
          form.custom_type == 2 ||
          form.custom_type == 3 ||
          form.custom_type == 5 ||
          form.custom_type == 7
        "
      >
        <template #default>{{ actionName["num_type"] }}</template>
      </van-cell>
      <van-cell
        title="提醒时间"
        is-link
        center
        @click="handleSetAction('num')"
        v-if="
          form.custom_type == 2 ||
          form.custom_type == 3 ||
          form.custom_type == 5 ||
          form.custom_type == 7 ||
          form.custom_type == 8
        "
      >
        <template #default>
          <template v-if="form.custom_type == 8">
            {{ actionName["time"] }}
          </template>
          <template v-else>
            {{ actionName["num"] }}{{ actionName["num_type"] }}
          </template>
        </template>
      </van-cell>
      <van-cell
        title="提醒人"
        center
        value-class="cell-title"
        is-link
        @click="handleSetAction('reminder')"
      >
        <template #default>{{ actionName["reminder"] }}</template>
      </van-cell>
      <footer>
        <van-button
          type="default"
          native-type="button"
          @click="modePopupShow = false"
          >取消</van-button
        >
        <van-button
          type="info"
          native-type="button"
          :loading="button.loading"
          :loading-text="button.text"
          @click="save"
          >保存</van-button
        >
      </footer>
      <van-action-sheet
        v-model="showAction"
        :actions="actionList"
        cancel-text="取消"
        close-on-click-action
        safe-area-inset-bottom
        @select="handleSelect"
        @open="handleOpen"
        :round="false"
      />
      <van-popup
        v-model="timePickerShow"
        position="bottom"
        safe-area-inset-bottom
        round
      >
        <div class="popup_btn">
          <span @click="timePickerShow = false">取消</span>
          <span @click="onConfirm(currentDate)">确定</span>
        </div>
        <div class="time_title">
          <span>年</span>
          <span>月</span>
          <span>日</span>
          <span>时</span>
          <span>分</span>
        </div>
        <van-datetime-picker
          class="time_picker"
          :show-toolbar="false"
          v-model="currentDate"
          type="datetime"
          :min-date="minDate"
          title=""
        />
      </van-popup>
    </van-popup>
  </div>
</template>
<script>
//引入日期格式工具
let moment = require("moment");
moment.locale("zh-cn"); //汉化
import { task } from "@/api";
import { getFormDate } from "@/utils/format/remind";
import { deepClone } from "@/utils";
const blueColor = "#0082EF";
export default {
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      list: [],
      form: {
        custom_type: 1,
        num: 5,
        num_type: 1,
        date: null,
        custom_hour: null,
        reminder: 6,
        operate_type: 1,
        id: null,
      },
      currentDate: new Date(),
      timePickerShow: false, //时间选择器
      modePopupShow: false, //添加编辑弹窗显示
      page: {
        page: 0,
        num: 6,
      },
      button: {
        loading: false,
        text: "保存中...",
      },
      actionName: {
        custom_type: "任务开始时",
        reminder: "所有人员",
        num_type: "分钟",
        num: 5,
        time: "请选择时间",
      },
      showAction: false,
      actionList: [],
      actionData: {
        custom_type: [
          { name: "任务开始时", value: 1, color: "" },
          { name: "任务开始前", value: 2, color: "" },
          { name: "任务开始后", value: 3, color: "" },
          { name: "任务完成时", value: 4, color: "" },
          { name: "任务逾期后", value: 5, color: "" },
          { name: "任务截止时", value: 6, color: "" },
          { name: "任务截止后", value: 7, color: blueColor },
          { name: "自定义时间", value: 8, color: "" },
        ],
        num_type: [
          { name: "分钟", value: 1, color: blueColor },
          { name: "小时", value: 2, color: "" },
          { name: "天", value: 3, color: "" },
        ],
        num: [
          { name: "5", value: 5, color: blueColor },
          { name: "10", value: 10, color: "" },
          { name: "15", value: 15, color: "" },
          { name: "20", value: 20, color: "" },
          { name: "25", value: 25, color: "" },
          { name: "30", value: 30, color: "" },
          { name: "35", value: 35, color: "" },
          { name: "40", value: 40, color: "" },
          { name: "45", value: 45, color: "" },
          { name: "50", value: 50, color: "" },
          { name: "55", value: 55, color: "" },
        ],
        reminder: [
          { name: "发起人", value: 1, color: "" },
          { name: "接收人", value: 2, color: "" },
          { name: "抄送人", value: 3, color: "" },
          { name: "未阅读人员", value: 4, color: "" },
          { name: "任务完成人员", value: 5, color: "" },
          { name: "所有人员", value: 6, color: blueColor },
          { name: "仅发起人和接收人", value: 7, color: "" },
        ],
      },
      actionType: "status",
      remindTime: "",
      editIndex: null,
      minDate: new Date()
    };
  },
  watch: {
    data: {
      handler(val) {
        this.list = val;
        console.log(val)
      },
      immediate: true,
    }
  },
    computed: {
    _list() {
      return this.list.filter((item) => item.operate_type != 3);
    },
  },
  created() {
    this.actionName.time = moment().format("YYYY-MM-DD HH:mm")
    let date = this.actionName.time.split(" ");
    this.form.date = date[0];
    this.form.custom_hour = date[1];
  },
  methods: {
    // 请求数据

    getTime(item) {
      if (item.custom_type == 8) {
        moment.locale("en");
        let date = moment(`${item.date} ${item.custom_hour}`).format(
          "YYYY/MM/DD A HH:mm"
        );
        return `${date.split(" ")[0]} <span class="blue">${
          date.split(" ")[1]
        } ${date.split(" ")[2]}</span>`;
      } else if (item.custom_type == 1 || item.custom_type == 4  || item.custom_type == 6) {
        return this.getText("custom_type", item.custom_type);
      } else {
        return `${this.getText(
          "custom_type",
          item.custom_type
        )} <span class="blue">${item.num}</span> ${this.getText(
          "num_type",
          item.num_type
        )}`;
      }
    },
    //根据值显示文字
    getText(type, val) {
      if(val)
      return this.actionData[type].find((item) => item.value == val).name;
    },
    // 提醒人选择
    handleSelect(val) {
      this.actionName[this.actionType] = val.name;
      this.form[this.actionType] = val.value;
    },
    // 打开弹窗前
    handleOpen() {
      this.actionList.forEach((item) => {
        item.color = "";
      });
      let index = this.actionList.findIndex(
        (item) => item.name == this.actionName[this.actionType]
      );
      if (index > -1) this.$set(this.actionList[index], "color", blueColor);
    },
    handleSetAction(type) {
      if (type == "num") {
        this.actionType = type;
        if (this.form.custom_type == 8) {
          this.timePickerShow = true;
          this.currentDate = new Date(`${this.form.date} ${this.form.custom_hour}`);
        } else {
          this.actionList = this.actionData[type];
          this.showAction = true;
        }
        return false;
      }
      this.actionList = this.actionData[type];
      this.actionType = type;
      this.showAction = true;
    },
    onConfirm(val) {
      this.actionName.time = moment(val).format("YYYY-MM-DD HH:mm");
      let date = this.actionName.time.split(" ");
      this.form.date = date[0];
      this.form.custom_hour = date[1];
      this.timePickerShow = false;
    },
    //删除提醒模式
    handleDel(index, item) {
      let _this = this
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否删除该提醒模式",
        })
        .then(() => {
          if (item.id) {
            this.list[index].operate_type = 3;
            _this.$set(_this.list, index, this.list[index])
          } else {
            _this.list.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    handleEdit(index, item) {
      console.log(index)
      this.editIndex = index;
      this.form = this.list[index];
      this.modePopupShow = true;
      this.actionName.custom_type = this.getText(
        "custom_type",
        this.form.custom_type
      );
      this.actionName.num = this.getText("num", this.form.num);
      this.actionName.num_type = this.getText("num_type", this.form.num_type);
      this.actionName.reminder = this.getText("reminder", this.form.reminder);
      this.actionName.time = `${this.form.date} ${this.form.custom_hour}`;
    },
    //保存自定义提醒模式
    //
    save() {
      if (this.list.length == 10) {
        return this.$notify({
          type: "danger",
          message: "自定义提醒模式不能超过十个",
        });
      }
      if (this.editIndex == 0 || this.editIndex) {
        this.form.operate_type = this.list[this.editIndex].id ? 2 : this.form.operate_type;
        this.$set(this.list, this.editIndex, getFormDate(deepClone(this.form)))
      } else {
        this.list.push(getFormDate(deepClone(this.form)));
      }
      this.$emit("change", this.list);
      this.modePopupShow = false;
      console.log(this.list)
    },
    // 设置弹窗的挂载点
    getContainer() {
      return document.querySelector(".task-add");
    },
    //下拉刷新
  },
};
</script>
<style lang="less" scoped>
.remind-list {
  height: 100%;
  font-size: 14px;
  position: relative;
  font-size: 15px;
  padding: 0 0 55px;
  .add-btn {
    color: #0082ef;
    width: 100%;
    border: 0;
    margin-top: 10px;
  }
  .flex {
    display: flex;
  }
  .flex-between {
    justify-content: space-between;
  }
  .flex-al {
    align-items: center;
  }
  .list {
    min-height: 400px;
    .item {
      background: @white;
      margin: 16px 27px 0;
      box-shadow: 0px 3px 6px rgba(212, 201, 201, 0.2);
      .blue {
        color: @blue;
      }
      .title {
        height: 48px;
        line-height: 48px;
        padding: 0 20px;
        background: linear-gradient(137deg, #ffffff 0%, #ebecee 100%);
        .gary {
          color: #909399;
        }
        .icon {
          font-size: 23px;
          margin-right: 6px;
        }
      }
      .content {
        padding: 13px 20px;
      }
      .time {
        font-size: 20px;
        font-weight: bold;
        margin: 5px 0 16px;
      }
      .reminder {
        font-size: 15px;
        color: #303133;
        span {
          color: #909399;
          margin-left: 20px;
        }
      }
      .action {
        margin: 0 20px;
        margin-top: 5px;
        border-top: 1px solid #ebebeb;
        height: 48px;
        line-height: 48px;
        color: #303133;
        font-size: 15px;
        .red {
          color: #f95d5d;
        }
        div {
          flex: 1;
          text-align: center;
          &:nth-child(1) {
            position: relative;
            &::after {
              position: absolute;
              content: "";
              background: #ebebeb;
              height: 22px;
              width: 1px;
              right: 0;
              top: 11px;
            }
          }
        }
      }
    }
  }
  .remind-add {
    position: absolute;
    height: 100vh;
  }
}
/deep/.van-picker__confirm {
  color: @blue;
}
  .time_title{
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    color: #303133;
    font-size: 15px;
  }
  .time_picker{
    padding: 0 10px;
  }
  .popup_btn{
    padding: 15px 10px 30px;
    font-size: 16px;
    color: #606266;
    display: flex;
    justify-content: space-between;
    span:nth-child(2) {
      color: #0082EF;
    }
  }
</style>

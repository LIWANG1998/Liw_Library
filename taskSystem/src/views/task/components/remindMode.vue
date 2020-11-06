<template>
  <van-popup
    v-if="_show"
    v-model="_show"
    :class="['remind-mode', 'popup']"
    :overlay="false"
  >
    <van-form @submit="onSubmit">
      <van-tabs type="card" v-model="active" sticky animated swipeable>
        <van-tab title="默认提醒">
          <van-cell-group class="box">
            <van-cell
              :title="item.name"
              v-for="(item, index) in defaultData"
              :key="index"
              title-class="cell-title"
              center
            >
              <template #default>
                <van-switch
                  v-model="item.checked"
                  active-color="#67C23A"
                  :active-value="true"
                  :inactive-value="false"
                  size="30"
                />
              </template>
            </van-cell>
          </van-cell-group>
          <van-cell-group class="box">
            <van-cell title="重复提醒" title-class="cell-title" center>
              <template #default>
                <van-switch
                  v-model="form.is_re_reminder"
                  active-color="#67C23A"
                  :active-value="1"
                  :inactive-value="2"
                  size="30"
                />
              </template>
            </van-cell>
            <div v-show="form.is_re_reminder == 1">
              <van-cell title="提醒频率" class="test" center value-class="cell-title">
                <template #default>
                  <van-button
                    type="default"
                    :class="['rate', item.value == form.rate ? 'active' : '']"
                    v-for="(item, index) in rateData"
                    :key="index"
                    native-type="button"
                    @click="handleRateChange(item)"
                    >{{ item.name }}</van-button
                  >
                </template>
              </van-cell>
              <van-cell
                title="提醒时间"
                center
                value-class="cell-title"
                is-link
                @click="openTime"
              >
                <template #default>{{ remindTime }}</template>
              </van-cell>
              <van-cell
                title="提醒人"
                center
                value-class="cell-title"
                is-link
                @click="showRole = true"
              >
                <template #default>{{ remindUser }}</template>
              </van-cell>
            </div>
          </van-cell-group>
        </van-tab>
        <van-tab title="自定义提醒">
          <remind-list
            :data="listData"
            @change="remindListChange"
          ></remind-list>
        </van-tab>
      </van-tabs>
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
          show-toolbar
          ref="time"
          :columns="columns"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
      <van-action-sheet
        v-model="showRole"
        :actions="actions"
        cancel-text="取消"
        close-on-click-action
        safe-area-inset-bottom
        @select="onSelect"
        :round="false"
      />
      <footer>
        <van-button type="default" native-type="button" @click="handleCancel"
          >返回</van-button
        >
        <van-button
          type="info"
          :disabled="button.loading"
          :loading="button.loading"
          :loading-text="button.text"
          >确定</van-button
        >
      </footer>
    </van-form>
  </van-popup>
</template>
<script>
import { common } from "@/api";
import { getTime, getWeek, getDate } from "./date";
import remindList from "./remindList";
const blueColor = "#0082EF";
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    type: {//提醒模式1默认2自定义3默认+重复提醒
      type: Number,
      required: 1,
    },
    data: {
      type: Array,
      required: [],
    },
  },
  components: {
    remindList,
  },
  data() {
    return {
      active: 0,
      form: {
        default_hour: "00:00",
        week: 0,
        num: 0,
        reminder: 6,
        is_re_reminder: 2,
        id:null,
        rate: 1,//提醒频率
      },
      defaultData: [
        {
          name: "任务开始前30分钟提醒所有人",
          value: 1,
          checked: true,
        },
        {
          name: "任务截止前30分钟提醒未完成任务人及发起人",
          value: 2,
          checked: true,
        },
        {
          name: "主任务进度通知发起人",
          value: 3,
          checked: true,
        },
        {
          name: "子任务进度通知发起人",
          value: 4,
          checked: true,
        },
        {
          name: "主任务完成提醒发起人",
          value: 5,
          checked: true,
        },
      ],
      rateData: [
        {
          name: "每天",
          value: 1,
        },
        {
          name: "每周",
          value: 2,
        },
        {
          name: "每月",
          value: 3,
        },
      ],
      actions: [
        { name: "发起人", value: 1, color: "" },
        { name: "接收人", value: 2, color: "" },
        { name: "抄送人", value: 3, color: "" },
        { name: "未阅读人员", value: 4, color: "" },
        { name: "任务完成人员", value: 5, color: "" },
        { name: "所有人员", value: 6, color: blueColor },
        { name: "仅发起人和接收人", value: 7, color: "" },
      ],
      showPicker: false,
      remindTime: "00:00",//提醒时间
      remindUser: "所有接收人",//提醒人
      showRole: false,
      listData: [],
      button: {
        loading: false,
        text: "保存中",
      },
      form_:{},//暂存父组件转来的模式
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
    columns: function () {
      if (this.form.rate === 1) {
        return getTime().map((item) => item.name);
      }
      if (this.form.rate === 2) {
        return [
          {
            values: getWeek().map((item) => item.name),
            defaultIndex: 0,
          },
          {
            values: getTime().map((item) => item.name),
            defaultIndex: 0,
          },
        ];
      }
      if (this.form.rate === 3) {
        return [
          {
            values: getDate().map((item) => item.name),
            defaultIndex: 0,
          },
          {
            values: getTime().map((item) => item.name),
            defaultIndex: 0,
          },
        ];
      }
    },
  },
  watch: {
    _show(val) {
      if (val) {
          console.log(this.data)
        this.active = this.type == 1  || this.type == 3? 0 : 1;
        let data = [].concat(this.data)
        if (this.active == 0) {
          if (this.data.length > 0) {
            Object.keys(this.form).forEach((item) => {
              this.form[item] = data[0][item]?data[0][item]:this.form[item];
              if(this.form.is_re_reminder==2){
                this.form.rate = 1;
              }
            });
            this.form.week = this.form.week==0?0:parseInt(this.form.week) - 1;
            this.form.num = this.form.num==0?0:parseInt(this.form.num) - 1;
            let default_type = this.data[0].default_type
              .split(",")
              .map((item) => Number(item));
            this.defaultData.forEach((item) => {
              if (default_type.indexOf(item.value) > -1) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            });
          }
          // this.defaultData = defaultData;
          this.setRmindText();
          this.actions.forEach(item =>{
            if (item.value == this.form.reminder){
              this.remindUser = item.name
            }
          })
        } else {
          this.listData = this.data;
        }
        console.log(this.data)
      }
    },
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val)

      }
    },
  },
  methods: {
    // 选择时间弹窗确定按钮
    onConfirm(val) {
      let index1 =0,
          index2 =0;
      if(Array.isArray(val)) {
        index1 = this.columns[0].values.findIndex(item=>item==val[0]);
        index2 = this.columns[1].values.findIndex(item=>item==val[1]);
      } else {
        index1 = this.columns.findIndex(item=>item==val);
      }
      this.setRemindRate(index1,index2);
      this.setRmindText();
      this.showPicker = false;
    },
    //回显提示频率时间
    setRmindTime() {
      let columns = [],hourIndex=0;
      switch (this.form.rate) {
        case 1:
          columns = this.columns;
          hourIndex = columns.findIndex(item=>item==this.form.default_hour);
          this.$nextTick(() => {
            this.$refs.time.setColumnIndex(0, parseInt(hourIndex));
          });
          break;
        case 2:
          columns = this.columns;
          hourIndex = columns[1].values.findIndex(item=>item==this.form.default_hour);
          this.$nextTick(() => {
            this.$refs.time.setColumnIndex(0, parseInt(this.form.week));//修改周选中
            this.$refs.time.setColumnIndex(1, parseInt(hourIndex));////修改周选中时间
          });
          break;
        case 3:
          columns = this.columns;
          hourIndex = columns[1].values.findIndex(item=>item==this.form.default_hour);
          this.$nextTick(() => {
            this.$refs.time.setColumnIndex(0, parseInt(this.form.num));//修改号
            this.$refs.time.setColumnIndex(1, parseInt(hourIndex));//修改月选中时间
          });
          break;
      }
    },
    setRmindText(){
       let columns = this.columns,week=null,num=null;
       switch (this.form.rate) {
          case 1:
            console.log(this.form.default_hour)
             this.remindTime = this.form.default_hour;
            break;
          case 2:
             week = parseInt(this.form.week);
             this.remindTime = `${columns[0].values[week]} ${this.form.default_hour}`;
            break;
          case 3:
              num = parseInt(this.form.num);
              this.remindTime = `${columns[0].values[num]} ${this.form.default_hour}`;
            break;
       }
    },
    // 设置提醒频率
    setRemindRate(index1,index2) {
      switch (this.form.rate) {
        case 1:
          this.form.default_hour = this.columns[index1];
          break;
        case 2:
          this.form.week = parseInt(index1);
          console.log(this.columns[1].values);
          this.form.default_hour = this.columns[1].values(index2);
          break;
        case 3:
          this.form.num = parseInt(index1);
          this.form.default_hour = this.columns[1].values(index2);
          break;
      }
    },
    // 提醒人选择
    onSelect(val) {
      this.remindUser = val.name;
      this.actions.forEach((item) => {
        if (item.name === this.remindUser) {
          item.color = blueColor;
          this.form.reminder = item.value;
        } else {
          item.color = "";
        }
      });
    },
    openTime() {
      this.showPicker = true;
      this.setRmindTime();
    },
    // 自定义提醒列表
    remindListChange(val) {
      this.listData = val;
      console.log(val)
    },
    //取消按钮
    handleCancel() {
      this._show = false;
      this.button.loading = false;
    },
    //切换提醒频率
    handleRateChange(item) {
      this.form.rate = item.value;
      this.setRmindText();
    },
    //点击保存
    onSubmit() {
      //operate_type/操作类型1新增2修改3删除
      this.button.loading = true;
      let mode = [];
      let defaultData = this.defaultData.filter((item) => item.checked);
      let default_type = defaultData.map((item) => item.value).join(",");
      let formData = Object.assign({},this.form);
      formData.week = parseInt(formData.week) + 1;
      formData.num = parseInt(formData.num) + 1;
      if (this.active == 0) {
        let _pathType = formData.id ? 2 : 1
        mode.push({
          default_type: default_type,
          operate_type: _pathType,
          ...formData,
        });
      } else {
        mode = this.listData;
      }
      setTimeout(() => {
        //接口remind_type：1默认提醒2自定义提醒3默认提醒中选中重复提醒
        let _modelType = this.active == 1 ? 2 : this.active == 0 && this.form.is_re_reminder == 1? 3 : 1
        this.$emit("confirm", mode, _modelType);
        this._show = false;
        this.button.loading = false;
      }, 1000);
    },
  },
};
</script>
<style lang="less" scoped>

.remind-mode {
  /deep/.van-sticky {
    background: @white;
    padding: 10px 0;
    .van-tabs__nav--card {
      border-color: @blue;
      margin: 0 15%;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      .van-tab {
        border-color: @blue;
        color: @blue;
        height: 40px;
        line-height: 40px;
      }
    }
    .van-tabs__nav--card .van-tab.van-tab--active {
      background: @blue;
      color: @white;
    }
  }
  /deep/.van-tab__pane{
    height: calc(100vh - 56px - 64px);
    overflow-y: scroll;
    /*margin-bottom: 10px;*/
  }
  /deep/.van-picker__confirm {
    color: @blue;
  }
  .picker-user {
    /deep/.van-sticky {
      background: @white;
      padding: 0;
    }
  }
  .box {
    margin-top: 10px;
    .cell-title {
      flex: 3;
    }
    .rate {
      margin: 0 5px;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      width: 75px;
      background: #f1f2f5;
      color: #303133;
      &.active {
        background-color: @blue;
        color: @white;
        border-color: @blue;
      }
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.dropItem {
  background: #f5f7fa;
  position: relative;
  overflow: hidden;
  .drop-box {
    padding: 0 15px;
    background: @white;
    overflow: auto;
    .item-row {
      padding: 15px 0;
      border-top: 1px solid #ebeef5;
      .label {
        line-height: 42px;
      }
      .user-number {
        color: #c0c4cc;
        font-size: 14px;
      }
      /deep/.ml0{
        margin: 0;
      }
      span {
        background: #f1f2f5;
        color: #303133;
        width: 80px;
        text-align: center;
        line-height: 32px;
        height: 32px;
        display: inline-block;
        border-radius: 4px;
        margin: 7px;
        vertical-align: middle;
        &.active {
          background: @blue;
          color: @white;
        }
      }
      .time-input {
        span {
          background: #f5f7fa;
          display: inline-block;
          width: 120px;
          border: 1px solid #d1d5df;
          text-align: left;
          padding-left: 10px;
          box-sizing: border-box;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  /deep/.van-picker__confirm {
    color: @blue;
  }
  .foot {
    margin-top: 20px;
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      border: none;
      display: block;
      border-radius: 0;
      width: 100%;
    }
  }
}
</style>

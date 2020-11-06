<template>
  <div class="dropItem" :style="`height:${height}px`">
    <div class="drop-box" :style="`height:${height - 44}px`">
      <van-row class="item-row" v-if="userType">
        <van-col :span="4" class="label">人员范围</van-col>
        <van-col :span="20">
          <template  v-for="(item, index) in _userOption">
             <span
               :key="index"
               :class="item.value == selectData.people_type ? 'active' : ''"
               @click="handleCheck(item.value, 'people_type')"
             >{{ item.name }}</span>
          </template>
          <span
            v-if="userInfo.type>0"
            :class="selectData.people_type == 4 ? 'active' : ''"
            @click="
              showPickerUser = true;
              pickerUserType = 'userid';
              selectData.people_type = 4;
            "
          >自定义</span
          >
          <label
            class="user-number"
            v-if="
              userInfo.cooperation == userInfo.type &&
              selectData.people_type == 4 &&
              pickerUserData[pickerUserType].length > 0
            "
          >已选择{{ pickerUserData["userid"].length }}人</label
          >
        </van-col>
      </van-row>
      <van-row class="item-row" v-if="userType">
        <van-col :span="4" class="label">参与人员</van-col>
        <van-col :span="20">
          <span
            v-for="(item, index) in sendOption"
            :key="index"
            :class="item.value == selectData.belong_to ? 'active' : ''"
            @click="handleCheck(item.value, 'belong_to')"
          >{{ item.name }}</span>
        </van-col>
      </van-row>
<!--      <van-row class="item-row" v-if="userType">-->
<!--        <van-col :span="4" class="label">任务状态</van-col>-->
<!--        <van-col :span="20">-->
<!--          <span-->
<!--            v-for="(item, index) in statusOption"-->
<!--            :key="index"-->
<!--            :class="item.value == selectData.status ? 'active' : ''"-->
<!--            @click="handleCheck(item.value, 'status')"-->
<!--          >{{ item.name }}</span>-->
<!--        </van-col>-->
<!--      </van-row>-->
<!--      <van-row class="item-row">-->
<!--        <van-col :span="4" class="label">任务级别</van-col>-->
<!--        <van-col :span="20">-->
<!--          <span-->
<!--            v-for="(item, index) in levelOption"-->
<!--            :key="index"-->
<!--            :class="item.value == selectData.level ? 'active' : ''"-->
<!--            @click="handleCheck(item.value, 'level')"-->
<!--            >{{ item.name }}</span-->
<!--          >-->
<!--        </van-col>-->
<!--      </van-row>-->
      <van-row class="item-row">
        <van-col :span="4" class="label">统计时间</van-col>
        <van-col :span="20">
          <span
            v-for="(item, index) in timeOption"
            :key="index"
            :class="item.value == selectData.time ? 'active' : ''"
            @click="handleTimeCheck(item.value, 'time')"
            >{{ item.name }}</span
          >
          <div class="time-input" v-show="selectData.time == 4">
            <span
              @click="
                showDateType = 'start';
                showDatePicker = true;
              "
              >{{ selectData.start_time }}</span
            >
            -
            <span
              @click="
                showDateType = 'end';
                showDatePicker = true;
              "
              >{{ selectData.end_time }}</span
            >
          </div>
          <van-popup v-model="showDatePicker" position="bottom">
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
        </van-col>
      </van-row>
    </div>
    <van-row class="foot">
      <van-col :span="12">
        <van-button @click="cancel">取消</van-button>
      </van-col>
      <van-col :span="12">
        <van-button type="info" @click="confirm">确定</van-button>
      </van-col>
    </van-row>
    <pickerUser
      :show.sync="showPickerUser"
      :data="pickerUserData[pickerUserType]"
      @confirm="confirmPickerUser"
    ></pickerUser>
  </div>
</template>
<script>
import { pickerUser } from "@/components";
import { getStore } from "@/utils/store";
import {mapGetters} from "vuex";


export default {
  props: {
    height: {
      type: Number,
      default: 300,
    },
    userType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectData: {
        people_type:1,
        belong_to:1,
        status:1,
        time:1,
        start_time:'',
        end_time:'',
        level: -1,
        userid:'',
      },
      option: [
        {
          name: "归属类型",
          param: "role",
          value: [
            {
              name: "全部",
              value: "0",
            },
            {
              name: "我发起的",
              value: "1",
            },
            {
              name: "我接收的",
              value: "2",
            },
            {
              name: "我抄送的",
              value: "3",
            },
          ],
        },
        {
          name: "任务状态",
          param: "state",
          value: [
            {
              name: "全部",
              value: "0",
            },
            {
              name: "待开始",
              value: "3",
            },
            {
              name: "执行中",
              value: "2",
            },
            {
              name: "已逾期",
              value: "1",
            },
            {
              name: "已完成",
              value: "4",
            },
          ],
        },
      ],
      timeOption: [
        {
          name: "近一周",
          value: 1,
        },
        {
          name: "近一个月",
          value: 2,
        },
        {
          name: "近半年",
          value: 3,
        },
        {
          name: "自定义",
          value: 4,
        },
      ],
      //人员范围1我的 2所在部门 3全部 4自定义userid
      userOption:[
        {
          name: "我的",
          value: 1,
        },
        {
          name: "所在部门",
          value: 2,
        },
        {
          name: "全部",
          value: 3,
        },
      ],
      sendOption: [
        {
          name: "全部",
          value: 1,
        },
        {
          name: "我发起的",
          value: 2,
        },
        {
          name: "我参与的",
          value: 3,
        },
      ],
      statusOption: [
        {
          name: "全部",
          value: 1,
        },
        {
          name: "待开始",
          value: 2,
        },
        {
          name: "执行中",
          value: 3,
        },
        {
          name: "已逾期",
          value: 4,
        },
        {
          name: "已完成",
          value: 5,
        },
      ],
      handOption: [
        {
          name: "全部",
          value: 1,
        },
        {
          name: "我参与的",
          value: 2,
        },
      ],
      levelOption: [
        {
          name: "全部",
          value: -1,
        },
        {
          name: "普通",
          value: 0,
        },
        {
          name: "紧急",
          value: 1,
        },
        {
          name: "非常紧急",
          value: 2,
        },
      ],
      timeType: "",
      currentDate: new Date(),
      showDatePicker: false,
      showDateType: "start",
      startTime: "2020-09-01",
      endTime: "2020-09-02",
      showPickerUser: false,
      pickerUserData: {
        userid: [],
        participant_userid: [],
      },
      pickerUserType: "initiator_userid",
      user_Type:'',//type 0个人 1部门2公司3集团
      type:'',//
    };
  },
  components: {
    pickerUser,
  },
  created() {
    this.startTime = moment(this.currentDate).format("YYYY-MM-DD");
    this.endTime = moment(this.currentDate).add(1, "days").format("YYYY-MM-DD");
    this.user_Type = getStore({ name: "userInfo",type:1 })?.type;
    this.type = this.userInfo.type + 1
  },
  computed: {
    ...mapGetters(["userInfo"]),
    getDate() {
      let startDate = null,
        endDate = null;
      switch (this.timeType) {
        case 0:
          startDate = moment()
            .week(moment().week())
            .startOf("week")
            .format("YYYY-MM-DD");
          endDate = moment()
            .week(moment().week())
            .endOf("week")
            .format("YYYY-MM-DD");
          break;
        case 1:
          startDate = moment()
            .month(moment().month())
            .startOf("month")
            .format("YYYY-MM-DD");
          endDate = moment()
            .month(moment().month())
            .endOf("month")
            .format("YYYY-MM-DD");
          break;
        case 2:
          startDate = moment()
            .year(moment().year())
            .startOf("year")
            .format("YYYY-MM-DD");
          endDate = moment()
            .year(moment().year())
            .endOf("year")
            .format("YYYY-MM-DD");
          break;
        default:
          break;
      }
      return `${startDate} - ${endDate}`;
    },
    _userOption(){
      if(this.userInfo.type>0) {
        return [this.userOption[0],this.userOption[1]];
      } else if(this.userInfo.type>=1) {
       return [this.userOption[0],this.userOption[1],this.userOption[2]];
      }  else {
        return [this.userOption[0]];
      }
    }
  },
  methods: {
    // 点击选择
    handleCheck(value, param) {
      this.selectData[param] = value;
    },
    handleTimeCheck(value, param) {
      // this.selectData[`${type}_time_type`] = value;
      this.selectData[param] = value;
      this.timeType = value;
    },
    onConfirm(date) {
      this.selectData[`${this.showDateType}_time`] = moment(
        date
      ).format("YYYY-MM-DD");
      this.showDatePicker = false;
    },
    confirmPickerUser(data) {
      this.selectData[this.pickerUserType] = data.join(",");
      this.pickerUserData[this.pickerUserType] = data;
    },
    confirm() {
      // console.log(this.selectData)
      console.log(this.selectData)
      this.$emit("confirm", this.selectData);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style>
.van-dropdown-item__content {
  max-height: 100%;
}
</style>
<style lang="less" scoped>
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

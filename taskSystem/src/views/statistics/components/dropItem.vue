<template>
  <div class="dropItem" :style="`height:${height}px`">
    <div class="drop-box" :style="`height:${height - 44}px`">
      <van-row v-if="type != '5' && type != '6'" class="item-row">
        <van-col :span="24" class="label">人员范围</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in _peopleOption"
            :key="index"
            :class="[item.value == selectData.people_type ? 'active' : '',  index == 0 || index == 4 ? 'ml0' : '']"
            @click="handleCheck(item.value, 'people_type')"
          >{{ item.name }}</span
          >
          <span
            v-if="user_Type > 0"
            :class="selectData.people_type == 3 ? 'active' : ''"
            @click="
              showPickerUser = true;
              pickerUserType = 'people_userid';
            "
          >自定义</span
          >
          <br>
          <label
            class="user-number"
            v-if="
              selectData.people_type == 3 &&
              pickerUserData[pickerUserType].length > 0
            "
          >已选择{{ pickerUserData["people_userid"].length }}人</label
          >
        </van-col>
      </van-row>
      <van-row v-if="type != '5' && type != '6'" class="item-row">
        <van-col :span="24" class="label">任务角色(可多选)</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in roleOption"
            :key="index"
            :class="[item.check ? 'active' : '',  index == 0 ? 'ml0' : '']"
              @click="handleCheck(item.value, 'role')"
          >{{ item.name }}</span>
        </van-col>
      </van-row>
      <van-row v-if="type != '5' && type != '6'" class="item-row">
        <van-col :span="24" class="label">任务级别（可多选）</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in levelOption"
            :key="index"
            :class="[selectData.level && selectData.level.some(it => item.value == it) ? 'active' : '', index == 0 ? 'ml0' : '']"
            @click="handleCheck(item.value, 'level')"
            >{{ item.name }}</span
          >
        </van-col>
      </van-row>
      <van-row v-if="type == '5'" class="item-row">
        <van-col :span="24" class="label">发起时间</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in timeOption"
            :key="index"
            :class="[item.value == selectData.create_time_type ? 'active' : '', index == 0 ? 'ml0' : '']"
            @click="handleTimeCheck(item.value, 'create')"
            >{{ item.name }}</span
          >
          <div class="time-input" v-show="selectData.create_time_type == 4">
            <span
              @click="
                showDateType = 'start';
                showDatePicker = true;
              "
              >{{ selectData.create_time_start }}</span
            >
            -
            <span
              @click="
                showDateType = 'end';
                showDatePicker = true;
              "
              >{{ selectData.create_time_end }}</span
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
      <van-row v-if="type == '6'" class="item-row">
        <van-col :span="24" class="label">结束时间</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in timeOption"
            :key="index"
            :class="[item.value == selectData.end_time_type ? 'active' : '', index == 0 ? 'ml0' : '']"
            @click="handleTimeCheck(item.value, 'end')"
            >{{ item.name }}</span
          >
          <div class="time-input" v-show="selectData.end_time_type == 4">
            <span
              @click="
                showDateType = 'start';
                showDatePicker = true;
              "
              >{{ selectData.end_time_start }}</span
            >
            -
            <span
              @click="
                showDateType = 'end';
                showDatePicker = true;
              "
              >{{ selectData.end_time_end }}</span
            >
          </div>
          <van-popup v-model="showDatePicker" position="bottom">
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              @confirm="onConfirm"
              @cancel="showDatePicker = false"
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
import { DropdownMenu, DropdownItem } from "vant";
import { pickerUser } from "@/components";
import { getStore, setStore } from "@/utils/store";
import {mapGetters} from "vuex";

export default {
  props: {
    height: {
      type: Number,
      default: 500,
    },
    userType: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: '',
    },
    data:{
      type:Object,
      default:()=>{}
    },
    show:{
      type: Boolean,
      default:() =>{}
    },
  },
  data() {
    return {
      selectData: {
        task_role:[0, 1, 2, 3],
        initiator_type: 1,
        initiator_userid: "",
        participant_type: 1,
        participant_userid: "",
        level: [-1, 0, 1, 2],
        create_time_type: 1,
        create_time_start: "",
        create_time_end: "",
        end_time_type: 1,
        end_time_start: "",
        end_time_end: "",
      },
      peopleOption: [//人员范围：0全员 1本人 2所属部门 3自定义用户
        {
          name: "我的",
          value: 1,
        },
        {
          name: "部门",
          value: 2,
        },
        {
          name: "全部",
          value: 0,
        },
      ],
      roleOption:[//0全部1发起2接收3抄送
        {
          name: "全部",
          value: 0,
          check:true,
        },
        {
          name: "发起",
          value: 1,
          check:true,
        },
        {
          name: "接收",
          value: 2,
          check:true,
        },
        {
          name: "抄送",
          value: 3,
          check:true,
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
          name: "近一年",
          value: 3,
        },
        {
          name: "自定义",
          value: 4,
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
        initiator_userid: [],
        participant_userid: [],
      },
      pickerUserType: "initiator_userid",
      user_Type:'',//type 0个人 1部门2公司3集团
    };
  },
  components: {
    pickerUser,
  },
  watch:{
    show: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val){
          if (this.data){
            this.selectData = Object.assign(this.selectData, this.data)
            if (this.selectData.people_type == 3){//自定义用户
              this.pickerUserData.people_userid = this.selectData.people_userid?.split(',')
            }
            this.levelOption.forEach(item =>{
              item.check = this.selectData.level?.some(it => it == item.value) ? true : false
            })
            this.statusOption.forEach(item =>{
              item.check = this.selectData.status?.some(it => it == item.value) ? true : false
            })
            this.roleOption.forEach(item =>{
              item.check = this.selectData.role_type?.some(it => it == item.value) ? true : false
            })
          }
        }
      }
    },
  },
  created() {
    this.startTime = moment(this.currentDate).format("YYYY-MM-DD");
    this.endTime = moment(this.currentDate).add(1, "days").format("YYYY-MM-DD");
    this.user_Type = getStore({ name: "userInfo",type:1 })?.type;
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
     _peopleOption(){
      if(this.userInfo.type>0) {
        return [this.peopleOption[0],this.peopleOption[1]];
      } else if(this.userInfo.type>=1) {
       return [this.peopleOption[0],this.peopleOption[1],this.peopleOption[2]];
      }  else {
        return [this.peopleOption[0]];
      }
    }
  },
  methods: {
    // 点击选择
    handleCheck(value, param) {
      let _this = this
      if (param == 'level' || param == 'status' || param == 'role'){
        if (param == 'level' || param == 'status'){
          this.selectData[param] = []
        } else {
          let _name = 'task_' + param
          this.selectData[_name] = []
        }
        let _nameOption = param + 'Option'
        _this[_nameOption].forEach(item =>{
          if ((param == 'status' && value == 0) || (param == 'level' && value == -1) || (param == 'role' && value == 0)){
            item.check = true
          } else {
            item.check = item.value == value ? !item.check : item.check
          }
        })
        let _flag = _this[_nameOption].some((item, index) =>{
          return index > 0 && item.check == false
        })//是否全选
        if (_flag){//取消全选
          if (param == 'status'){ //任务状态 0全部 1待开始 2执行中 3已逾期 4已完成
            _this[_nameOption][0].check = false
          } else if (param == 'level'){//级别 -1 全部 0普通 1紧急 2非常紧急
            _this[_nameOption][0].check = false
          } else if (param == 'role'){//任务角色：0全部1发起2接收3抄送
            _this[_nameOption][0].check = false
          }
        } else {//全选
          _this[_nameOption].forEach(item => {
            item.check = true
          })
        }
        if (param == 'level' || param == 'status'){
          _this[_nameOption].forEach(item =>{
            if (item.check){
              _this.selectData[param].push(item.value)
            }
          })
        } else {
          _this[_nameOption].forEach(item =>{
            if (item.check){
              let _name = 'task_' + param
              _this.selectData[_name].push(item.value)
            }
          })
        }
      }else {
        _this.selectData[param] = value;
      }
    },
    handleTimeCheck(value, type) {
      this.selectData[`${type}_time_type`] = value;
      this.timeType = type;
    },
    onConfirm(date) {
      this.selectData[`${this.timeType}_time_${this.showDateType}`] = moment(
        date
      ).format("YYYY-MM-DD");
      this.showDatePicker = false;
    },
    confirmPickerUser(data) {
      this.selectData[this.pickerUserType] = data.join(",");
      this.pickerUserData[this.pickerUserType] = data;
    },
    confirm() {
      if (this.type == 5 && this.selectData.launch_time == 3){
        if (!this.selectData.l_start_time && !this.selectData.l_end_time){
          this.$notify({ type: "danger", message: "请完善发起时间" })
        }
      } else if (this.type == 6 && this.selectData.end_time == 3) {
        if (!this.selectData.e_start_time && !this.selectData.e_start_time){
          this.$notify({ type: "danger", message: "请完善结束时间" })
        }
      } else if (this.selectData.people_type == 3 && this.selectData.people_userid){
        this.$notify({ type: "danger", message: "请选择自定义人员" })
      } else {
        setStore({
          name: "selectData",
          content: this.selectData,
        });
        let _params = Object.assign({}, this.selectData)
        _params.level = _params.level.join(',')
        _params.task_role = _params.task_role.join(',')
        this.$emit("confirm", _params);
      }
      // this.$emit("confirm", this.selectData);
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
      /deep/.ml0{
        margin: 7px 10px 7px 0;
      }
      span {
        background: #f1f2f5;
        color: #303133;
        width: 60px;
        text-align: center;
        line-height: 32px;
        height: 32px;
        display: inline-block;
        border-radius: 4px;
        margin: 7px 10px;
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

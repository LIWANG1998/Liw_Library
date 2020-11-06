<template>
  <div class="dropItem" :style="`height:${height}px`">
    <div class="drop-box" :style="`height:${height - 44}px`">
      <van-row v-if="page == 'chart' && userType" class="item-row">
        <van-col :span="24" class="label">排行维度</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in  _peopleWOption"
            :key="index"
            :class="[item.value == selectData.people_type ? 'active' : '',  index == 0 || index == 4 ? 'ml0' : '']"
            @click="handleCheck(item.value, 'people_type')"
          >{{ item.value == 0 ? '公司' : item.name }}</span
          >
          <span
            v-if="user_Type > 0 && (selectData.people_type == 2 || selectData.people_type == 3)"
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
      <van-row v-if="type != '1' && type != '5' && type != '6' && page != 'chart' && userType" class="item-row">
        <van-col :span="24" class="label">人员范围</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in _peopleWOption"
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
      <van-row v-if="type != '5' && type != '6' &&page!='stati'&& page != 'chart' && page != 'info' && userType" class="item-row">
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
      <van-row v-if="type != '5' && type != '6' && page != 'stati' && page != 'info'" class="item-row">
        <van-col :span="24" class="label">任务状态（可多选）</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in statusOption"
            :key="index"
            :class="[item.check ? 'active' : '', index == 0 || index == 4 ? 'ml0' : '']"
            @click="handleCheck(item.value, 'status')"
          >{{ item.name }}</span
          >
        </van-col>
      </van-row>
      <van-row v-if="type != '5' && type != '6'" class="item-row">
        <van-col :span="24" class="label">任务级别（可多选）</van-col>
        <van-col :span="24">
          <span
            v-for="(item, index) in levelOption"
            :key="index"
            :class="[item.check ? 'active' : '', index == 0 || index == 4 ? 'ml0' : '']"
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
            :class="[item.value == selectData.launch_time ? 'active' : '', index == 0 ? 'ml0' : '']"
            @click="handleTimeCheck(item.value, 'launch')"
          >{{ item.name }}</span
          >
          <div class="time-input" v-show="selectData.launch_time == 3">
            <span
              @click="
                showDateType = 'start';
                showDatePicker = true;
              "
            >{{ selectData.l_start_time }}</span
            >
            -
            <span
              @click="
                showDateType = 'end';
                showDatePicker = true;
              "
            >{{ selectData.l_end_time }}</span
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
            :class="[item.value == selectData.end_time ? 'active' : '', index == 0 ? 'ml0' : '']"
            @click="handleTimeCheck(item.value, 'end')"
          >{{ item.name }}</span
          >
          <div class="time-input" v-show="selectData.end_time == 3">
            <span
              @click="
                showDateType = 'start';
                showDatePicker = true;
              "
            >{{ selectData.e_start_time }}</span
            >
            -
            <span
              @click="
                showDateType = 'end';
                showDatePicker = true;
              "
            >{{ selectData.e_end_time }}</span
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
<!--    -->
    <pickerUser
      :page = '1'
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
      page:{
        type: String,
        default:''
      }
    },
    data() {
      return {
        selectData: {
          people_type: 1,
          role_type:[0,1,2,3],//任务角色：0全部1发起2接收3抄送
          people_userid: "",
          level: [-1, 0, 1, 2],
          status: [0, 1, 2, 3, 4],//任务状态 0全部 1待开始 2执行中 3已逾期 4已完成
          launch_time:0,
          l_start_time:'',
          l_end_time:'',
          end_time:0,
          e_start_time:'',
          e_end_time:'',
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
        timeOption: [//发起时间0不限 1近一周 2近一个月 3自定义
          {
            name: "不限",
            value: 0,
          },
          {
            name: "近一周",
            value: 1,
          },
          {
            name: "近一个月",
            value: 2,
          },
          {
            name: "自定义",
            value: 3,
          },
        ],
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
        peopleWOption: [//人员范围：0全员 1本人 2所属部门 3自定义用户
          {
            name: "个人",
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
            check:true,
          },
          {
            name: "普通",
            value: 0,
            check:true,
          },
          {
            name: "紧急",
            value: 1,
            check:true,
          },
          {
            name: "非常紧急",
            value: 2,
            check:true,
          },
        ],
        statusOption:[//任务状态 0全部 1待开始 2执行中 3已逾期 4已完成
          {
            name: "全部",
            value: 0,
            check:true,
          },
          {
            name: "待开始",
            value: 1,
            check:true,
          },
          {
            name: "执行中",
            value: 2,
            check:true,
          },
          {
            name: "已逾期",
            value: 3,
            check:true,
          },
          {
            name: "已完成",
            value: 4,
            check:true,
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
        timeType: "",
        currentDate: new Date(),
        showDatePicker: false,
        showDateType: "start",
        startTime: "2020-09-01",
        endTime: "2020-09-02",
        showPickerUser: false,
        pickerUserData: {
          people_userid: [],
        },
        pickerUserType: "people_userid",
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
                if(!Array.isArray(this.selectData.level)) {
                  this.selectData.level = this.selectData.level?this.selectData.level.split(",").map(Number):[]
                }
                if(!Array.isArray(this.selectData.status)) {
                  this.selectData.status = this.selectData.status?this.selectData.status.split(",").map(Number):[]
                }
                if(!Array.isArray(this.selectData.role_type)) {
                  this.selectData.role_type = this.selectData.role_type?this.selectData.role_type.split(",").map(Number):[]
                }
                this.levelOption.forEach(item =>{
                  item.check = this.selectData.level.some(it => it == item.value) ? true : false
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
      _peopleWOption(){
        if(this.userInfo.type==1) {
          return [this.peopleOption[0],this.peopleOption[1]];
        } if(this.userInfo.type==2) {
          return [this.peopleOption[0],this.peopleOption[1],this.peopleOption[2]];
        } else {
          return [this.peopleOption[0]];
        }
      }
    },
    methods: {
      // 点击选择
      handleCheck(value, param) {
        let _this = this
        if (param == 'level' || param == 'status' || param == 'role'){//多选项
          if (param == 'role'){
            let _name = param + '_type'
            this.selectData[_name] = []
          } else {
            this.selectData[param] = []
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
              if (param == 'status' || param == 'level' || param == 'role'){ //任务状态 0全部 1待开始 2执行中 3已逾期 4已完成//级别 -1 全部 0普通 1紧急 2非常紧急//任务角色：0全部1发起2接收3抄送
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
            } else {//角色类型
              _this[_nameOption].forEach(item =>{
                if (item.check){
                  let _name = param + '_type'
                  _this.selectData[_name].push(item.value)
                }
              })
            }
        }else {//其他单选项
          _this.selectData[param] = value;
        }
      },
      handleTimeCheck(value, type) {
        this.selectData[`${type}_time`] = value;
        this.timeType = type;
      },
      onConfirm(date) {
        if (this.timeType == 'launch') {
          this.selectData[`l_${this.showDateType}_time`] = moment(
            date
          ).format("YYYY-MM-DD");
        } else if (this.timeType == 'end'){
          this.selectData[`e_${this.showDateType}_time`] = moment(
            date
          ).format("YYYY-MM-DD");
        }
        this.showDatePicker = false;
      },
      confirmPickerUser(data) {
        this.selectData[this.pickerUserType] = data.join(",");
        this.selectData.people_type = 3
        this.pickerUserData[this.pickerUserType] = data;
      },
      confirm() {
        // people_type: 1,
        //   role_type:[0,1,2,3],//任务角色：0全部1发起2接收3抄送
        //   people_userid: "",
        //   level: [-1, 0, 1, 2],
        //   status: [0, 1, 2, 3, 4],//任务状态 0全部 1待开始 2执行中 3已逾期 4已完成
        //   launch_time:0,
        //   l_start_time:'',
        //   l_end_time:'',
        //   end_time:0,
        //   e_start_time:'',
        //   e_end_time:'',
        let _flag = true
        if (this.type == 5 && this.selectData.launch_time == 3){
           if (!this.selectData.l_start_time || !this.selectData.l_end_time){
             this.$notify({ type: "danger", message: "请完善发起时间" })
             _flag = false
           }
        } else if (this.type == 6 && this.selectData.end_time == 3) {
          if (!this.selectData.e_start_time || !this.selectData.e_start_time){
            this.$notify({ type: "danger", message: "请完善结束时间" })
            _flag = false
          }
        } else if (this.selectData.people_type == 3 && !this.selectData.people_userid){
             this.$notify({ type: "danger", message: "请选择自定义人员" })
          _flag = false
        }
        if (_flag) {
          setStore({
            name: "selectData",
            content: this.selectData,
          });
          let _params =JSON.parse(JSON.stringify(this.selectData))
          _params.status = _params.status.join(',')
          _params.level = _params.level.join(',')
          _params.role_type = _params.role_type.join(',')
          this.$emit("confirm", _params);
        }
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
    overflow: auto;
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

<template>
  <div class="approval">
    <div class="choiseBox">
      <div class="infoTitle">
        <div class="docInfo">{{type==1?'发文信息':type==2?'收文信息':'签报信息'}}</div>
        <div class="tit">
          <div>{{type==1?'发文标题':type==2?'收文标题':'签报标题'}}</div>
          <div @click="lookFile()" v-if="!next">
            <van-icon name="eye-o" size="18" color="#66B5FF" />
            <span class="preview">公文预览</span>
          </div>
        </div>
        <div class="inputValue">
          <van-field
            v-model="document_arr.title"
            autosize
            :placeholder="`请在此处输入${type==1?'发文':type==2?'收文':'签报'}标题`"
            @change="changeText()"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
        </div>
      </div>
    </div>
    <div class="division"></div>

    <div class="choise" v-if="showInfo">
      <img src="../../../assets//img/home/title.png" alt />
      <div class="title">
        <div>{{type==1?'发文字号':type==2?'收文字号':'签报字号'}}</div>
        <!-- {{type==1?'发文':type==2?'收文':'签报'}} -->
        <div style="color:#0082EF;font-size:16px">发文后自动生成</div>
      </div>
    </div>

    <div class="choise" v-else>
      <img src="../../../assets/img/home/title.png" alt />
      <div class="level">
        <van-field
          :label="type==1?'发文字号':type==2?'收文字号':'签报字号'"
          v-model="document_arr.word_no"
          input-align="right"
          :border="false"
          disabled
        />
        <div class="noicon"></div>
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets/img/home/title.png" alt />
      <div class="level">
        <van-field
          :disabled="swenStatus == 1 ? true : false"
          label="来文字号"
          v-model="document_arr.received_wordno"
          placeholder="请输入来文字号"
          input-align="right"
          :border="false"
        />
        <div class="noicon"></div>
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets/img//home/house.png" alt />
      <div class="level">
        <van-field
                :disabled="swenStatus == 1 ? true : false"
                @change="changeText()"
                label="来文单位"
                v-model="document_arr.received_delivery"
                placeholder="请输入来文单位"
                input-align="right"
                :border="false"
                rows="1"
                autosize
                type="textarea"
        />
        <div class="noicon"></div>
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets//img/home/user.png" alt />
      <div v-if="swenStatus && swenStatus == 1" class="level">
        <van-field
                :disabled="swenStatus == 1 ? true : false"
                @change="changeText()"
                label="接收时间"
                v-model="document_arr.receiving_time"
                placeholder="请输入接收时间"
                input-align="right"
                :border="false"
                rows="1"
                autosize
                type="textarea"
        />
        <van-icon name="noicon" />
      </div>
      <div v-else class="level">
        <van-field
                @change="changeText()"
                label="接收时间"
                v-model="document_arr.receiving_time"
                placeholder="请输入接收时间"
                input-align="right"
                :border="false"
                rows="1"
                autosize
                type="textarea"
                @click="datePicker = true"
                disabled
        />
        <van-popup v-model="datePicker" round position="bottom">
          <van-datetime-picker
                  v-model="currentDate"
                  type="date"
                  title="选择年月日"
                  :formatter="formatter"
                  :min-date="minDate"
                  :max-date="maxDate"
                  @confirm="dateConfirm"
                  @cancel="datePicker=false"
          />
        </van-popup>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets/img/home//key.png" alt />
      <div class="level">
        <van-field
          readonly
          clickable
          label="公文密级程度"
          :value="secret_level_name "
          placeholder="请选择公文密级程度"
          @click="showPicker = true"
          input-align="right"
          :border="false"
          @change="changeText()"
        />
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            @change="onChange"
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets/img/home/fire.png" alt />
      <div class="level">
        <van-field
          @change="changeText()"
          readonly
          clickable
          label="公文紧急程度"
          :value="urgent_level_name"
          placeholder="请选择公文紧急程度"
          @click="urgentPicker = true"
          input-align="right"
          :border="false"
        />
        <van-popup v-model="urgentPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="urgentcolumns"
            @cancel="urgentPicker = false"
            @confirm="onConfirmDegree"
          />
        </van-popup>
        <van-icon name="arrow" />
      </div>
    </div>
<!--    <div class="choise">-->
<!--      <img src="../../../assets/img//home/house.png" alt />-->
<!--      <div class="level">-->
<!--        <van-field-->
<!--          :disabled="swenStatus == 1 ? true : false"-->
<!--          @change="changeText()"-->
<!--          label="来文单位"-->
<!--          v-model="document_arr.received_delivery"-->
<!--          placeholder="请输入来文单位"-->
<!--          input-align="right"-->
<!--          :border="false"-->
<!--          rows="1"-->
<!--          autosize-->
<!--          type="textarea"-->
<!--          -->
<!--        />-->
<!--        <div class="noicon"></div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="choise">
      <img src="../../../assets//img/home/user.png" alt />
      <div class="level">
        <van-field
          @change="changeText()"
          label="签发人"
          v-model="document_arr.issuer"
          placeholder="请输入签发人"
          input-align="right"
          :border="false"
          rows="1"
          autosize
          type="textarea"
        />
        <div class="noicon"></div>
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets//img/home/house1.png" alt />
      <div class="level">
        <van-field
          @change="changeText()"
          label="接收单位"
          v-model="document_arr.receiving_unit"
          placeholder="请输入接收单位"
          input-align="right"
          :border="false"
          rows="1"
          autosize
          type="textarea"
        />
        <div class="noicon"></div>
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets//img/home/user.png" alt />
      <div class="level">
        <van-field
          @change="changeText()"
          label="接收人"
          v-model="document_arr.receiving_user"
          placeholder="请输入接收人"
          input-align="right"
          :border="false"
          rows="1"
          autosize
          type="textarea"
        />
        <div class="noicon"></div>
      </div>
    </div>
    <div class="choise" v-for="(item,index) in addList" :key="index">
      <img src="../../../assets/img/home/moren.png" alt />
      <div class="level">
        <van-field
          @change="changeText()"
          @input="changeInput(item.e_name,item.value)"
          :label="item.c_name"
          v-model="item.value"
          :placeholder="'请输入'+item.c_name"
          input-align="right"
          :border="false"
          rows="1"
          autosize
          type="textarea"
           maxlength="30" 
        />
        <div class="noicon"></div>
      </div>
    </div>
    <div class="nextStep" @click="nextStep()" v-if="next">
      <van-button type="primary" block color="linear-gradient(to right, #0082EF, #04A9FE)">下一步</van-button>
    </div>
    <!-- 弹窗 -->
    <van-popup v-model="tableStatus">
      <div class="infoBox" @click="tableStatus=false">
        <div class="titleTable">
          <div>收文单位</div>
        </div>
        <table align="center" cellspacing="0" cellpadding="6" border="1">
          <tbody>
            <tr align="center">
              <td height="44px">收文标题</td>
              <td colspan="3">{{document_arr.title}}</td>
            </tr>
            <tr align="center">
              <td height="44px">收文字号</td>
              <td colspan="3">发文后自动生成</td>
            </tr>
            <tr align="center">
              <td height="44px">来文字号</td>
              <td colspan="3">{{document_arr.received_wordno}}</td>
            </tr>
            <tr align="center">
              <td height="44px">公文密级程度</td>
              <td width="25%">{{secret_level_name}}</td>
              <td width="25%">公文紧急程度</td>
              <td width="25%">{{urgent_level_name}}</td>
            </tr>
            <tr align="center">
              <td height="80px">来文单位</td>
              <td>{{document_arr.received_delivery}}</td>
              <td>签发人</td>
              <td>{{document_arr.issuer}}</td>
            </tr>
            <tr align="center">
              <td height="80px">接收单位</td>
              <td>{{document_arr.receiving_unit}}</td>
              <td>接收人</td>
              <td>{{document_arr.receiving_user}}</td>
            </tr>
            <tr align="center">
              <td height="44px">接收时间</td>
              <td colspan="3">{{document_arr.receiving_time}}</td>
            </tr>
            <tr align="center" v-for="(item,index) in addList" :key="index">
              <td height="44px">{{item.c_name}}</td>
              <td colspan="3">{{item.value}}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:5px;word-wrap:break-word;" v-html="docContent||content"></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { temInfo } from "../../../api/home";
import look from "../../../assets/js/lookDetail";

export default {
  props: {
    next: {
      type: String,
      default: () => ""
    },
    info: {
      type: String,
      default: () => ""
    },
    type: {
      default: () => ""
    },
    fields: {
      type: Array,
      default: () => []
    },
    degree: {
      type: Array,
      default: () => []
    }, //密级程度列表
    urgen_level: {
      type: Array,
      default: () => []
    }, //紧急程度列表
    tid: {
      type: String,
      default: () => ""
    }, //紧急程度列表

    isShowTable: {
      default: () => ""
    },
    docContent: {
      default: () => ""
    },
    lid: {
      default: () => ""
    },
    swenStatus: {
      //发文转收文
      default: () => ""
    },
    receivingTime: {
      //转收文时的接收时间
      default: () => ""
    },
    status:{//8草稿箱
      default: () => ""
    }
  },
  data() {
    return {
      datePicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      tableStatus: false,
      showTable: false,
      id: "",
      content: "",
      showInfo: true,
      value: "",
      showPicker: false,
      urgentPicker: false,
      columns: [], //密级程度数组
      urgentcolumns: [], //紧急程度数组
      secret_level_name: "", //密级程度name
      urgent_level_name: "", //紧急程度的name
      document_arr: {
        title: "",
        received_wordno: "",
        word_no: "",
        receiving_time: "",
        secret_level: "",
        urgen_level: "",
        received_delivery: "",
        issuer: "",
        receiving_unit: "",
        receiving_user: ""
      },
      //
      addList: [], //人为新增的内容
      mjList: [], //密级
      jjList: [], //紧急
      mjData: [],
      jjData: [],
      show: true, //显示预览
      tepId: "",
      docList: {}, //文本列表
      allFields: [],
      flag: true
    };
  },
  methods: {
    //文字变化就改变 点了立即审核就传过去
    changeText() {
      this.$emit("listenDoc", this.document_arr);
      // sessionStorage.setItem("document_arr", JSON.stringify(this.document_arr)); //发文标题内容
    },
    //向父组件传值
    lookFile() {
      this.$emit("listenShow", this.show, this.document_arr);
    },
    //输入框改变
    changeInput(name, value) {
      var key = name;
      var value = value;
      this.document_arr[key] = value;
    },
    onChange(picker, value, index) {
      var keyId = value.id;
      var text = value.text;
    },
    //获取时间
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      }
      return val;
    },

    dateConfirm(val) {
      this.document_arr.receiving_time = this.timeFormat(val);
      this.datePicker = false;
    },
    timeFormat(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + "-" + month + "-" + day;
    },

    //密级按钮
    onConfirm(value) {
      this.document_arr.secret_level = value.id;
      this.secret_level_name = value.text;
      this.showPicker = false;
      // sessionStorage.setItem("document_arr", JSON.stringify(this.document_arr)); //发文标题内容
    },
    //紧急按钮
    onConfirmDegree(value, index) {
      // console.log(value, "555");
      this.urgent_level_name = value.text;
      this.document_arr.urgent_level = value.id;
      this.urgentPicker = false;
      // sessionStorage.setItem("document_arr", JSON.stringify(this.document_arr)); //发文标题内容
    },
    //点击下一步
    nextStep() {
      // console.log(this.document_arr, "this.document_arr");
      // this.addList = [];
      sessionStorage.setItem("content", this.docContent); //发文标题内容
      sessionStorage.setItem("document_arr", JSON.stringify(this.document_arr)); //发文标题内容
      this.$router.push({
        path: "/approval",
        query: {
          id: this.$route.query.tid,
          type: this.$route.query.type,
          lid: this.lid,
          fid: this.$route.query.fid,
          status:this.status
        }
      });
    },
    bbtn() {
      look.$on("lookApro", message => {
        //这里最好用箭头函数，不然this指向有问题
        if (message == 1) {
          //存储本地
          sessionStorage.setItem(
            "document_arr",
            JSON.stringify(this.document_arr)
          ); //发文标题内容
        }
      });
    }
  },

  watch: {
    fields:{
     deep:true,
      immediate:true,
      handler:function (newValue, oldVal) {
        // console.log(46545,newValue);
        // if (this.flag) {
          if (this.swenStatus && this.swenStatus == 1) {
            newValue.forEach((item, index) => {
              if (item.e_name == "title") {
                this.$set(this.document_arr, "title", item.value);
              }
              if (item.e_name == "word_no") {
                this.$set(this.document_arr, "received_wordno", item.value);
              }
              if (item.e_name == "copy_users") {
                this.$set(this.document_arr, "received_delivery", item.value);
              }
            });
            this.$set(this.document_arr, "receiving_time", this.receivingTime);
            // console.log(121, this.document_arr);
          } else {
            this.addList = [];
            newValue.forEach((item, index) => {
              if (item.is_system == 0) {
                this.addList.push(item);
              }
              if (item.value != "" && item.value !== undefined) {
                var key = item.e_name;
                var value = item.value;
                this.document_arr[key] = value;
              }
            });
          }
          // this.flag = false;
        // }
      }
    },
    degree(newValue, oldValue) {
      //密级程度
      for (var i = 0; i < newValue.length; i++) {
        if (this.document_arr.secret_level == newValue[i].id) {
          this.secret_level_name = newValue[i].name;
        }
        var item = {};
        item["id"] = newValue[i].id;
        item["text"] = newValue[i].name;
        this.mjData.push(item);
        this.columns = this.mjData;
      }
    },
    //紧急程度
    urgen_level(newValue, oldValue) {
      for (var i = 0; i < newValue.length; i++) {
        if (this.document_arr.urgent_level == newValue[i].id) {
          this.urgent_level_name = newValue[i].name;
        }
        var item = {};
        item["id"] = newValue[i].id;
        item["text"] = newValue[i].name;
        this.jjData.push(item);
        this.urgentcolumns = this.jjData;
      }
    },
    tid(newValue, oldValue) {
      if (newValue) {
        // this.getTemplateInfo(); //获取模板信息
      }
    },
    docContent(newValue, oldValue) {},

    //发文的类型
    type(newValue, oldValue) {},
    isShowTable(newValue, oldValue) {
      if (newValue || oldValue) {
        this.tableStatus = true;
      }
    }
  },
  activated() {
    this.content = sessionStorage.getItem("content");
  },
  mounted() {
    if (this.info != "") {
      this.showInfo = false;
    }
  },

  created() {
    this.bbtn();
    // console.log(this.document_arr, " this.document_arr");
  }
};
</script>
<style lang="scss" scoped>
/deep/ .van-cell {
  margin-top: 15px;
}

.van-field {
  font-size: 15px;
}

//审批部分
.approval {
  position: relative;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  font-size: 15px;

  .title {
    height: 48px;
    line-height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-right: 20px;
  }

  .choise {
    display: flex;

    .level {
      display: flex;
      width: 400px;
      border-top: 1px solid #ebeef5;
    }

    img {
      width: 12px;
      height: 12px;
      vertical-align: text-bottom;
      padding: 20px 12px;
    }

    .van-icon {
      padding: 18px 10px;
      color: #c7c7cc;
    }

    .noicon {
      padding: 17px;
    }
  }
}

.choiseBox {
  .infoTitle {
    height: 130px;
    background-color: #fff;
    padding: 10px 15px 0;

    .docInfo {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 25px;
    }

    .tit {
      display: flex;
      justify-content: space-between;
      height: 27px;
      line-height: 27px;
      font-size: 14px;
      margin-bottom: 5px;

      .van-icon {
        vertical-align: text-top;
        padding-right: 3px;
      }
    }
  }
}

.nextStep {
  width: 384px;
  height: 44px;
  margin: 10px auto;
}

.division {
  height: 10px;
  background-color: #f5f6f7;
  width: 100%;
}

.preview {
  color: #66b5ff;
}

.infoBox {
  width: 360px;
  padding: 19px;
  font-size: 14px;

  .time {
    position: absolute;
    right: 5px;
    top: 5px;
    color: #a7a8aa;
    font-size: 12px;
  }

  .titleTable {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    color: #f00;

    div:nth-child(1) {
      font-size: 16px;
    }
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
  }

  table td {
    border: 2px solid #f00;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }

  table td:nth-child(1) {
    color: #f00;
  }

  table td:nth-child(3) {
    color: #f00;
  }
}

// tab2
.content {
  padding: 0px 15px;
  padding-bottom: 90px;
}
</style>
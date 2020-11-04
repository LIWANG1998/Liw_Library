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

    <div class="choise" v-if="document_arr.word_no==''">
      <img src="../../../assets//img/home/title.png" alt />
      <div class="title">
        <div>{{type==1?'发文字号':type==2?'收文字号':'签报字号'}}</div>
        <div style="color:#0082EF;font-size:16px">{{type==1?'发文':type==2?'收文':'签报'}}后自动生成</div>
      </div>
    </div>
    <!-- <template v-for="item in 6">
      <div :key="item" class="cell">
        <div class="cell-title">{{item}}</div>
      </div>
    </template>-->
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
      <img src="../../../assets/img/home//key.png" alt />
      <div class="level">
        <van-field
          readonly
          clickable
          label="公文密级程度"
          :value="secret_level_name"
          placeholder="请选择公文密级程度"
          @click="showPicker = true"
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
    <div class="choise">
      <img src="../../../assets//img/home/house1.png" alt />
      <div class="level">
        <div class="level-titles">发文单位</div>
        <div class="level-content">
          <tags-input v-model="sendingunits" :sendingunit="sendingunit" class="tags-input" />
          <div class="choiseIcon" @click="choisedep()">
            <span>+</span>
          </div>
        </div>
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets//img/home/user.png" alt />
      <div class="level">
        <div class="level-titles">签发人</div>
        <div class="level-content">
          <tags-input v-model="issuerdatas" :sendingunit="issuerdata" class="tags-input" />
          <div class="choiseIcon" @click="choiseUser()">
            <span>+</span>
          </div>
        </div>
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets/img//home/house.png" alt />
      <div class="level">
        <div class="level-titles">主送单位</div>
        <div class="level-content">
          <tags-input
            v-model="maindeliveryunits"
            :sendingunit="maindeliveryunit"
            class="tags-input"
          />
          <div class="choiseIcon" @click="choisecom()">
            <span>+</span>
          </div>
        </div>
      </div>
    </div>
    <div class="choise">
      <img src="../../../assets//img/home/user.png" alt />
      <div class="level">
        <div class="level-titles">接收人</div>
        <div class="level-content">
          <tags-input v-model="receivers" :sendingunit="receivers" class="tags-input" />
        </div>
      </div>
    </div>
    <!-- <div class="choise">
      <img src="../../../assets//img/home/user.png" alt />
      <div class="level">
        <van-field
          @change="changeText()"
          label="接收人"
          v-model="document_arr.reviewer"
          placeholder="请输入接收人"
          input-align="right"
          :border="false"
          rows="1"
          autosize
          type="textarea"
        />
        <div class="noicon"></div>
      </div>
    </div>-->
    <!-- <div class="choise">
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
    </div>-->
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
          <div>发文单</div>
        </div>
        <table align="center" cellspacing="0" cellpadding="6" border="1">
          <tbody>
            <tr align="center">
              <td height="44px">发文标题</td>
              <td colspan="3">{{document_arr.title}}</td>
            </tr>
            <tr align="center">
              <td height="44px">发文字号</td>
              <td colspan="3">发文后自动生成</td>
            </tr>
            <tr align="center">
              <td height="44px">公文密级程度</td>
              <td width="25%">{{secret_level_name}}</td>
              <td width="25%">公文紧急程度</td>
              <td width="25%">{{urgent_level_name}}</td>
            </tr>
            <tr align="center">
              <td height="80px">发文单位</td>
              <td>{{document_arr.copy_users}}</td>
              <td>接收人</td>
              <td>{{document_arr.reviewer}}</td>
            </tr>
            <tr align="center">
              <td height="80px">主送单位</td>
              <td>{{document_arr.main_delivery}}</td>
              <td>签发人</td>
              <td>{{document_arr.issuer}}</td>
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
import InputType from "@/components/InputType.vue";
import TagsInput from "@/components/TagsInput.vue";
import { temInfo } from "../../../api/home";
import look from "../../../assets/js/lookDetail";

export default {
  components: {
    TagsInput,
    InputType,
  },
  props: {
    next: {
      type: String,
      default: () => "",
    },
    info: {
      type: String,
      default: () => "",
    },
    type: {
      default: () => "",
    },
    fields: {
      type: Array,
      default: () => [],
    },
    degree: {
      type: Array,
      default: () => [],
    }, //密级程度列表
    urgen_level: {
      type: Array,
      default: () => [],
    }, //紧急程度列表
    tid: {
      type: String,
      default: () => "",
    }, //紧急程度列表

    isShowTable: {
      default: () => "",
    },
    docContent: {
      default: () => "",
    },
    lid: {
      default: () => "",
    },
    status: {
      //8草稿箱
      default: () => "",
    },

    // 选人的信息
    pel: {
      type: Object,
    },
  },
  data() {
    return {
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
        title: "", //发文标题
        word_no: "", //规则id
        secret_level: "", //密级程度
        urgent_level: "", //紧急程度
        main_delivery: {
          select: [],
          text: "",
        }, //主送单位
        copy_users: {
          select: [],
          text: "",
        }, //发文单位
        reviewer: "", //接收人
        issuer: {
          select: [],
          text: "",
        }, //签发人
      },
      sendingunit: [], //发文单位
      sendingunits: [], //发文单位
      maindeliveryunit: [], //主送单位
      maindeliveryunits: [], //主送单位
      issuerdata: [], //签发人
      issuerdatas: [], //签发人
      receivers: [], //接收人
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
      flag: true,
    };
  },
  methods: {
    // 深拷贝
    StoP(a) {
      return JSON.parse(JSON.stringify(a));
    },
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
    //选择签发人
    choiseUser() {
      this.pel.depUserss = true;
      this.pel.type = 2;
      this.pel.ckt = {
        zzjg: true, // 显示 组织架构
        bm: false, // 可以选部门
        ren: true, // 可以选人
        tag: false, // 显示 标签
        dw: false, // 显示 单位
        radio: false, // 是否为单选
      };
      this.pel.result = this.StoP(this.issuerdata);
      this.pel.results = this.StoP(this.issuerdatas);
    },
    //选择部门发文单位
    choisedep() {
      this.pel.depUserss = true;
      this.pel.type = 1;
      this.pel.ckt = {
        zzjg: true, // 显示 组织架构
        bm: true, // 可以选部门
        ren: false, // 可以选人
        tag: false, // 显示 标签
        dw: false, // 显示 单位
        radio: false, // 是否为单选
      };
      this.pel.result = this.StoP(this.sendingunit);
      this.pel.results = this.StoP(this.sendingunits);
    },
    //选择部门主送单位
    choisecom() {
      this.pel.depUserss = true;
      this.pel.type = 3;
      this.pel.ckt = {
        zzjg: false, // 显示 组织架构
        bm: false, // 可以选部门
        ren: false, // 可以选人
        tag: false, // 显示 标签
        dw: true, // 显示 单位
        radio: false, // 是否为单选
      };
      this.pel.result = this.StoP(this.maindeliveryunit);
      this.pel.results = this.StoP(this.maindeliveryunits);
      // console.log(this.maindeliveryunits);
    },
    //密级按钮
    onConfirm(value) {
      // console.log(value, "value");
      this.document_arr.secret_level = value.id;
      this.secret_level_name = value.text;
      this.showPicker = false;
    },
    //紧急按钮
    onConfirmDegree(value, index) {
      // console.log(value, "555");
      this.urgent_level_name = value.text;
      this.document_arr.urgent_level = value.id;
      this.urgentPicker = false;
    },
    //点击下一步
    nextStep() {
      sessionStorage.setItem("document_arr", JSON.stringify(this.document_arr)); //发文标题内容
      this.$store.commit("getDocument", this.document_arr);
      // console.log(this.$store.state, "this.document_arr");
      // console.log(this.$route.query);
      this.$router.push({
        path: "/approval",
        query: {
          tid: this.$route.query.tid,
          type: this.$route.query.type,
          lid: this.lid, //流程id,
          fid: this.$route.query.fid,
          status: this.status,
        },
      });
    },
    bbtn() {
      look.$on("lookApro", (message) => {
        //这里最好用箭头函数，不然this指向有问题
        if (message == 1) {
          //存储本地
          sessionStorage.setItem(
            "document_arr",
            JSON.stringify(this.document_arr)
          ); //发文标题内容
        }
      });
    },
  },
  watch: {
    fields(newValue, oldValue) {
      if (this.flag) {
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
        this.flag = false;
      }
    },
    // degree(newValue, oldValue) {
    //   //密级程度
    //   for (var i = 0; i < newValue.length; i++) {
    //     if (this.document_arr.secret_level == newValue[i].id) {
    //       this.secret_level_name = newValue[i].name;
    //     }
    //     var item = {};
    //     item["id"] = newValue[i].id;
    //     item["text"] = newValue[i].name;
    //     this.mjData.push(item);
    //     this.columns = this.mjData;
    //   }
    // },
    // //紧急程度
    // urgen_level(newValue, oldValue) {
    //   for (var i = 0; i < newValue.length; i++) {
    //     if (this.document_arr.urgent_level == newValue[i].id) {
    //       this.urgent_level_name = newValue[i].name;
    //     }
    //     var item = {};
    //     item["id"] = newValue[i].id;
    //     item["text"] = newValue[i].name;
    //     this.jjData.push(item);
    //     this.urgentcolumns = this.jjData;
    //   }
    // },
    tid(newValue, oldValue) {
      if (newValue) {
        // this.getTemplateInfo(); //获取模板信息
      }
    },
    docContent(newValue, oldValue) {
      // // console.log(newValue, "docContent");
    },
    //发文的类型
    type(newValue, oldValue) {},
    isShowTable(newValue, oldValue) {
      if (newValue || oldValue) {
        this.tableStatus = true;
      }
    },

    // 监听发文单位
    sendingunits(n, o) {
      let text = [];
      this.document_arr.copy_users.select = [];
      n.forEach((v) => {
        if (v.type == 100) {
          text.push(v.title);
        } else {
          this.document_arr.copy_users.select.push({
            id: v.id,
            name: v.title,
          });
        }
      });
      this.document_arr.copy_users.text = text.join();
      // console.log(this.document_arr);
    },
    // 监听主送单位
    maindeliveryunits(n, o) {
      this.receivers = [];
      this.maindeliveryunits.forEach((e) => {
        if (e.type == 4) {
          this.receivers.push({
            doc_receiver: e.doc_receiver,
            receiver_name: e.receiver_name,
            title: e.receiver_name,
            w_id: e.doc_receiver,
            type: 500,
          });
        }
      });
      let text = [];
      this.document_arr.main_delivery.select = [];
      n.forEach((v) => {
        if (v.type == 100) {
          text.push(v.title);
        } else {
          this.document_arr.main_delivery.select.push({
            id: v.id,
            name: v.title,
          });
        }
      });
      this.document_arr.main_delivery.text = text.join();
    },
    // 监听签发人
    issuerdatas(n, o) {
      let text = [];
      this.document_arr.issuer.select = [];
      n.forEach((v) => {
        if (v.type == 100) {
          text.push(v.title);
        } else {
          this.document_arr.issuer.select.push({
            id: v.id,
            name: v.title,
          });
        }
      });
      this.document_arr.issuer.text = text.join();
    },
    // 监听接收人
    receivers(n, o) {
      let text = [];
      n.forEach((e) => {
        text.push(e.title);
      });
      this.document_arr.reviewer = text.join();
    },
  },
  mounted() {
    if (this.info != "") {
      this.showInfo = false;
    }
  },
  created() {
    // setTimeout(() => {
    //   this.document_arr = JSON.parse(sessionStorage.getItem('document_arr'))
    //   // console.log(this.document_arr, '    this.document_arr');
    // }, 200)

    // // console.log(typeof JSON.parse(sessionStorage.getItem('document_arr')),'44');
    // if(JSON.parse(sessionStorage.getItem('document_arr'))!={}){
    //   this.document_arr=JSON.parse(sessionStorage.getItem('document_arr'))
    //   // console.log( this.document_arr,' this.document_arr');

    // }
    this.bbtn();
    // console.log(this.fields);
    // let a = {};
    // this.fields.forEach((v, i) => {
    //   let key = v.e_name;
    //   a[key] = v;
    // });
    // // console.log(a);
    // console.log("机密成都", this.degree);
    // 处理 下拉公文机密程度
    this.columns = this.degree.map((v) => {
      return {
        id: v.id,
        text: v.name,
      };
    });
    this.urgentcolumns = this.urgen_level.map((v) => {
      return {
        id: v.id,
        text: v.name,
      };
    });
    // 选人的时候 通知改变
    this.$bus.$on("lw_selectdata", () => {
      if (this.pel.type == 1) {
        this.sendingunit = this.StoP(this.pel.result);
        this.sendingunits = this.StoP(this.pel.results);
      }
      if (this.pel.type == 2) {
        this.issuerdata = this.StoP(this.pel.result);
        this.issuerdatas = this.StoP(this.pel.results);
      }
      if (this.pel.type == 3) {
        this.maindeliveryunit = this.StoP(this.pel.result);
        this.maindeliveryunits = this.StoP(this.pel.results);
      }
    });
  },
};
</script>
<style lang="scss" scoped>
// /deep/.van-cell {
//   margin-top: 15px;
// }

.van-field {
  font-size: 15px;
}

//审批部分
.approval {
  position: relative;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  font-size: 15px;
  .cell {
    height: 60px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 12px;
    display: flex;
    align-items: center;
    * {
      box-sizing: border-box;
    }
  }
  .title {
    height: 61px;
    line-height: 54px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-right: 20px;
  }

  .choise {
    display: flex;
    .level {
      border-top: 1px solid #ebeef5;
      position: relative;
      flex: 1;
      display: flex;
      width: 400px;
      min-height: 60px;
      /deep/ .van-cell {
        margin-top: 15px;
        padding: 0;
        .van-cell__title.van-field__label {
          width: 120px !important;
        }
      }
      .level-titles {
        width: 120px;
        margin-top: 15px;
      }
      .level-content {
        margin-top: 15px;
        display: flex;
        flex: 1;
        // margin-right: 38px;
        .tags-input {
          flex: 1;
        }
        .choiseIcon {
          position: relative;
          background-color: #e0e5f2;
          width: 22px;
          height: 22px;
          color: #000;
          font-size: 22px;
          border-radius: 50%;
          margin-right: 15px;
          span {
            position: absolute;
            left: 50%;
            top: 45%;
            transform: translate(-50%, -50%);

            color: #fff;
          }
        }
      }
    }
    img {
      margin-top: 21px;
      width: 12px;
      height: 12px;
      padding: 0 12px;
      // vertical-align: text-bottom;
      // padding: 20px 12px;
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
    padding-bottom: 18px;

    .docInfo {
      font-size: 14px;
      font-weight: 500;
      background: #f8f8f8;
      height: 36px;
      line-height: 36px;
      padding-left: 14px;
    }
    .inputValue {
      padding-left: 14px;
      /deep/.van-cell {
        margin-top: 15px;
      }
    }
    .tit {
      display: flex;
      justify-content: space-between;
      margin-top: 17px;
      margin-bottom: -5px;
      font-size: 14px;
      padding-left: 14px;

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
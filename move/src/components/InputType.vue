<template>
  <div class="input-type">
    <div class="show-pup" v-if="item.showpup"></div>
    <template v-if="item.input_type == 1">
      <div class="input-type-cell">
        <div class="input-type-lt flex-ac">
          <div class="red_dian" v-if="!item.is_d">
            {{ item.is_must == 1 ? "*" : "" }}
          </div>
          <span>{{ item.c_name }}</span>
        </div>
        <div class="input-type-rt">
          <template
            v-if="item.e_name == 'received_delivery' || item.e_name == 'issuer'"
          >
            <template v-if="!item.is_d">
              <tags-input
                class="input-type-rt-flex tags-input"
                v-model="item.values"
                :sendingunit="item.value"
                :item="item"
              />
            </template>
            <template v-else>
              <template v-if="item.input_type == 1">
                <div class="inputvalue">{{ item_value(item.value) }}</div>
              </template>
              <template v-else>
                <div class="inputvalue">{{ item.value }}</div>
              </template>
            </template>
          </template>
          <template v-else>
            <template v-if="!item.is_d">
              <van-field
                class="input-type-rt-flex"
                v-model="item.value"
                maxlength="20"
                :placeholder="'请输入' + item.c_name"
              />
            </template>
            <template v-else>
              <div class="inputvalue">{{ item.value }}</div>
            </template>
          </template>
        </div>
      </div>
    </template>
    <template v-if="item.input_type == 3 && item.input_type_new == 2">
      <div class="input-type-cell">
        <div class="input-type-lt flex-ac">
          <div class="red_dian" v-if="!item.is_d">
            {{ item.is_must == 1 ? "*" : "" }}
          </div>
          <span>{{ item.c_name }}</span>
        </div>
        <div class="input-type-rt">
          <template v-if="!item.is_d">
            <van-field
              class="input-type-rt-flex"
              readonly
              clickable
              v-model="item.value"
              :placeholder="'请选择' + item.c_name"
              @click="showPickers = true"
            />
          </template>
          <template v-else>
            <div class="inputvalue">{{ item.value }}</div>
          </template>
        </div>
      </div>
    </template>
    <template v-if="item.input_type == 2">
      <div class="input-type-cell">
        <div class="input-type-lt flex-ac">
          <div class="red_dian" v-if="!item.is_d">
            {{ item.is_must == 1 ? "*" : "" }}
          </div>
          <span>{{ item.c_name }}</span>
        </div>
        <div class="input-type-rt">
          <template v-if="!item.is_d">
            <van-field
              readonly
              v-model="item.value"
              :placeholder="'请输入' + item.c_name"
              @click="showPicker"
            />
            <div class="choiseNumIcon" v-if="!item.is_c" @click="showPicker">
              <van-icon name="arrow" />
            </div>
          </template>
          <template v-else>
            <div class="inputvalue">{{ item.value }}</div>
          </template>
        </div>
      </div>
    </template>
    <template v-if="item.input_type == 3 && item.e_name == 'word_no'">
      <div class="input-type-cell">
        <div class="input-type-lt flex-ac">
          <div class="red_dian" v-if="!item.is_d">
            {{ item.is_must == 1 ? "*" : "" }}
          </div>
          <span>{{ item.c_name }}</span>
        </div>
        <div class="input-type-rt">
          <van-field
            class="input-type-rt-flex"
            readonly
            v-model="item.value"
            :placeholder="'请选择' + item.c_name"
            @click="choiseNum"
          />
          <div
            class="choiseNumIcon"
            v-if="!item.is_c && !item.showpup"
            @click="choiseNum"
          >
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div
        class="wordNo"
        v-if="iss.value.length > 0"
        @click="funColorFun(iss.value[0])"
      >
        {{ iss.value[0].word_no }}
        <span class="funColor" v-if="!item.showpup">
          <img src="@/assets/img/home/edits.png" alt />
        </span>
      </div>
    </template>
    <template
      v-if="
        item.input_type_new > 2 &&
        item.e_name != 'word_no' &&
        item.e_name != 'receiving_time'
      "
    >
      <div class="input-type-cell">
        <div class="input-type-lt flex-ac">
          <div class="red_dian" v-if="!item.is_d">
            {{ item.is_must == 1 ? "*" : "" }}
          </div>
          <span>{{ item.c_name }}</span>
        </div>
        <div class="input-type-rt">
          <template v-if="!item.is_d">
            <tags-input
              class="input-type-rt-flex tags-input"
              v-model="item.values"
              :sendingunit="item.value"
              :item="item"
            />
            <template v-if="!item.is_c">
              <div class="choiseIcon" @click="choiseUser">
                <div class="choiseIcon-o">
                  <van-icon name="add-o" />
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="inputvalue">{{ itemvalues(item.values) }}</div>
          </template>
        </div>
      </div>
    </template>
    <!-- <template v-if="item.input_type_new >2 && item.e_name!='word_no'"></template> -->
    <!-- 弹窗 -->
    <!-- 选择字号 -->
    <!-- <van-popup v-model="iss.numStatus" position="left" :style="{ height: '100%',width:'100%' }">
      <choiceNum v-if="iss.numStatus" :iss="iss" @statusclick="statusclick"></choiceNum>
    </van-popup>-->
    <!-- 选紧急程度 -->
    <van-popup v-model="urgentPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="urgentcolumns"
        @cancel="urgentPicker = false"
        @confirm="onConfirmDegree"
      />
    </van-popup>
    <!-- 选择人员 -->
    <!-- <van-popup v-model="pel.depUserss" position="left" :style="{ height: '100%',width:'100%' }">
      <pickclass v-if="pel.depUserss" :pel="pel" @choiseUsercg="choiseUsercg" />
    </van-popup>-->
    <!-- 选时间 -->
    <van-popup v-model="showPickers" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择完整时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="showPickers = false"
      />
    </van-popup>
    <!-- 修改字号 -->
    <!-- <van-popup v-model="fonts.show" position="left" :style="{ height: '100%',width:'100%' }">
      <div class="box-div" v-if="fonts.show">
        <div class="top">{{fonts.value.name}}</div>
        <van-field v-model="fonts.value.word_no" placeholder="请填写字号" ref="word_no" />
        <van-button type="info" @click="okfontsFun">确定</van-button>
      </div>
    </van-popup>-->
  </div>
</template>

<script>
import ChoiceNum from "@/views/quick/components/choiceNum.vue";
import TagsInput from "@/components/TagsInput.vue";
import pickclass from "@/components/pickclass/pickclass.vue";
import { secretTypeList, urgentTypeList, check_word_wo_re } from "@/api/home";

export default {
  components: {
    TagsInput,
    ChoiceNum,
    pickclass,
  },
  props: {
    // // 当前数据
    // item: {
    //   type: Object,
    // },
    add_page: {
      type: Boolean,
    },
    // siss: {
    //   type: Object,
    // },
    keys: {
      type: String,
    },
  },
  name: "InputType",
  data() {
    return {
      fonts: {
        show: false,
        value: {},
      },
      title_text: "",
      showPickers: false,
      minDate: new Date(2009, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      urgentPicker: false,
      urgentcolumns: [],
      // pel: {
      //   depUserss: false, //选人的弹框
      //   ckt: {
      //     zzjg: true, // 显示 组织架构
      //     bm: true, // 可以选部门
      //     ren: true, // 可以选人
      //     tag: true, // 显示 标签
      //     dw: true, // 显示 单位
      //     radio: false, // 是否为单选
      //   },
      //   result: [], // 打勾选中的
      //   results: [], // 打勾选中的所有信息
      // },
      // iss: {
      //   numStatus: false,
      //   value: [],
      // },
    };
  },
  computed: {
    userinfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
    itemvalues() {
      return (va) => {
        // console.log("ddsadsadsadsa", va);
        let a = va.map((v) => {
          // console.log(v);
          return v.title;
        });
        // console.log(a.join());
        return a.join();
      };
    },
    item() {
      return this.$store.state.edittext.document_arrs[this.keys];
    },
    siss() {
      return this.$store.state.edittext.isss;
    },
    iss() {
      return this.$store.state.edittext.iss;
    },
    pel() {
      return this.$store.state.edittext.pel;
    },
    fields_data() {
      return this.$store.state.edittext.document_arrs;
    },
    item_value() {
      return (v) => {
        let as = v.map((r) => {
          return r.title;
        });
        return as.join();
      };
    },
  },
  watch: {
    // item: {
    //   deep: true,
    //   handler(v, o) {
    //     this.$store.commit("setdocument_arr_one", {
    //       key: this.keys,
    //       data: v,
    //     });
    //   },
    // },
  },
  created() {
    // console.log(this.$store.state.edittext);
    // // console.log("this.keys", this.keys);
    // // console.log(
    //   "this.$state",
    //   this.$store.state.edittext.document_arrs[this.keys]
    // );
    // sessionStorage.getItem("iss")
    //   ? (this.iss = JSON.parse(sessionStorage.getItem("iss")))
    //   : "";
    this.title_text = document.title;
    // // console.log(this.title_text);
    // // console.log(this.item.c_name);
    // // console.log("add_page", this.add_page);
    if (this.item.e_name == "secret_level") {
      this.get_secretTypeList(1);
    }
    if (this.item.e_name == "urgent_level") {
      this.get_secretTypeList(2);
    }
    // if (this.item.e_name == "receiving_user") {
    //   // console.log(this.userinfo);
    //   this.item.values.push({
    //     w_id: "lw_lw",
    //     title: this.userinfo.name,
    //     type: 100,
    //   });
    // }
    // if (this.item.e_name == "receiving_time") {
    //   this.item.value = this.timeFormate();
    // }
    if (this.item.e_name == "word_no") {
      if (this.siss.id != "") {
        this.iss.value.push(this.siss);
      }
    }
    // if (this.iss.value.length > 0) {
    //   sessionStorage.setItem("iss", JSON.stringify(this.iss));
    // }
  },
  activated() {
    this.maxDate = new Date();
  },
  methods: {
    //显示当前时间（年月日时分秒）
    timeFormate() {
      let year = new Date().getFullYear();
      let month =
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1;
      let date =
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate();
      let hh =
        new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours();
      let mm =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      return year + "-" + month + "-" + date + " " + hh + ":" + mm + ":" + ss;
    },
    // 修改字号接口
    okfontsFun() {
      // this.fonts.show = false;
      this.check_word_wo_re();
    },
    async check_word_wo_re() {
      let _res = await check_word_wo_re({
        word_no: this.fonts.value.word_no,
      });
      if (_res.code == 1) {
        this.fonts.show = false;
        this.iss.value[0].word_no = this.fonts.value.word_no;
        sessionStorage.setItem("iss", JSON.stringify(this.iss));
        // console.log(this.iss);
      } else {
        this.$toast(_res.msg);
      }
    },
    // 修改字号
    funColorFun() {
      this.$router.push({
        path: `/setnum?id=${
          this.$route.query?.fid ? this.$route.query.fid : ""
        }`,
      });
    },
    //封装一个可以选择比较的属性的方法
    compare(property) {
      //这里就是返回一个排序比较函数
      return (a, b) => {
        return b[property] - a[property];
      };
    },
    // 默认赋值下拉选择
    defaultDropdown() {
      this.urgentcolumns.sort(this.compare("weight"));
      // console.log(this.urgentcolumns);
      this.item.value = this.urgentcolumns[0].text;
      this.item.value_id = this.urgentcolumns[0].id;
    },
    // 加来密集程度下拉选择
    /* num 判断是加载密级程度 还是 紧急程度 */
    async get_secretTypeList(num) {
      let _res = num == 1 ? await secretTypeList() : await urgentTypeList();
      if (_res.code == 1) {
        let arr = _res.data.data;
        arr.forEach((item) => {
          var obj = {};
          obj["id"] = item.id;
          obj["text"] = item.name;
          obj["weight"] = item.weight;
          this.urgentcolumns.push(obj);
        });
        // 默认赋值下拉选择
        this.add_page ? this.defaultDropdown() : "";
      }
    },
    // 处理时间段的 返回开始时间 和 结束时间
    formatNumber(n) {
      return n < 10 ? "0" + n : n;
    },
    getDate(time) {
      let y = time.getFullYear();
      let m = this.formatNumber(time.getMonth() + 1);
      let d = this.formatNumber(time.getDate());
      let h = this.formatNumber(time.getHours());
      let mm = this.formatNumber(time.getMinutes());
      let ss = this.formatNumber(time.getSeconds());
      return `${y}-${m}-${d}`;
    },
    // 深拷贝
    StoP(a) {
      return JSON.parse(JSON.stringify(a));
    },
    //紧急按钮
    onConfirmDegree(value, index) {
      this.item.value = value.text;
      this.item.value_id = value.id;
      this.urgentPicker = false;
    },
    // 打开选择人
    choiseUser() {
      if (this.item.input_type_new == 5) {
        this.pel.ckt = {
          zzjg: true, // 显示 组织架构
          bm: true, // 可以选部门
          ren: true, // 可以选人
          tag: true, // 显示 标签
          dw: false, // 显示 单位
          radio: false, // 是否为单选
        };
      }
      if (this.item.input_type_new == 6) {
        this.pel.ckt = {
          zzjg: true, // 显示 组织架构
          bm: true, // 可以选部门
          ren: false, // 可以选人
          tag: false, // 显示 标签
          dw: false, // 显示 单位
          radio: false, // 是否为单选
        };
      }
      if (this.item.input_type_new == 7) {
        this.pel.ckt = {
          zzjg: true, // 显示 组织架构
          bm: true, // 可以选部门
          ren: false, // 可以选人
          tag: false, // 显示 标签
          dw: true, // 显示 单位
          radio: false, // 是否为单选
          hl:
            this.item.e_name == "main_delivery" ||
            this.item.e_name == "receiving_unit"
              ? true
              : false,
        };
      }
      if (this.item.input_type_new == 8) {
        this.pel.ckt = {
          zzjg: true, // 显示 组织架构
          bm: true, // 可以选部门
          ren: true, // 可以选人
          tag: false, // 显示 标签
          dw: false, // 显示 单位
          radio: false, // 是否为单选
        };
      }
      if (this.item.input_type_new == 9) {
        this.pel.ckt = {
          zzjg: false, // 显示 组织架构
          bm: false, // 可以选部门
          ren: false, // 可以选人
          tag: false, // 显示 标签
          dw: true, // 显示 单位
          radio: false, // 是否为单选
          hl:
            this.item.e_name == "main_delivery" ||
            this.item.e_name == "receiving_unit"
              ? true
              : false,
        };
      }
      this.$router.push({
        path: "/selectpage",
        query: {
          key: this.keys,
        },
      });
      // this.pel.depUserss = true;
      // this.pel.result = this.StoP(this.item.value);
      // this.pel.results = this.StoP(this.item.values);
    },
    // 触发更新事件
    // choiseUsercg(t) {
    //   this.item.value = this.StoP(this.pel.result);
    //   this.item.values = this.StoP(this.pel.results);
    //   if (this.item.e_name == "main_delivery") {
    //     // this.fields_data.reviewer.values = [];
    //     this.item.values.forEach((e) => {
    //       if (e.type == 4) {
    //         this.fields_data.reviewer.values.push({
    //           receiver_name: e.receiver_name,
    //           title: e.receiver_name,
    //           w_id: e.doc_receiver,
    //           type: 500,
    //           id: e.id,
    //         });
    //       }
    //     });
    //   }
    // },
    // 下拉选人
    showPicker() {
      this.urgentPicker = true;
    },
    // 打开发文字号
    choiseNum() {
      this.$router.push({
        path: "/choicenum",
        query: {
          key: this.keys,
          type: this.$route.query.type ? this.$route.query.type : 1,
        },
      });
      // this.iss.numStatus = true;
      // document.title = "选择发文字号";
    },
    // 触发更新事件
    statusclick(t) {
      document.title = this.title_text;
      if (this.iss.value.length > 0) {
        this.item.value = this.iss.value[0].name;
        this.item.value_id = this.iss.value[0].id;
      } else {
        this.item.value = "";
        this.item.value_id = "";
      }
      sessionStorage.setItem("iss", JSON.stringify(this.iss));
    },
    // 确认事件
    onConfirm(e) {
      // console.log(e);
      this.currentDate = e;
      var d = new Date(e);
      this.item.value = this.getDate(d);

      // console.log(this.item);
      this.showPickers = false;
    },
  },
};
</script>

<style lang='scss' scoped>
/deep/ .van-cell::after {
  border: none;
}

.input-type {
  width: 100%;
  position: relative;

  .show-pup {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 2;
  }

  .input-type-cell {
    padding: 8px 12px;
    font-size: 15px;
    display: flex;
    align-items: center;
    background-color: white;

    .input-type-lt {
      width: 120px;

      .red_dian {
        width: 10px;
        color: red;
      }
    }

    .input-type-rt {
      flex: 1;
      display: flex;
      align-items: center;

      .input-type-rt-flex {
        flex: 1;
      }

      .tags-input {
        padding: 10px 16px !important;
      }
    }
  }

  .inputvalue {
    width: 240px;
    padding: 10px 16px !important;
    word-wrap: break-word;
    word-wrap: break-all;
    white-space: pre-wrap;
    word-break: normal;
  }

  .choiseIcon {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 40px;
    height: 40px;
    color: white;
    font-size: 25px;

    .choiseIcon-o {
      background-color: #e0e5f2;
      display: flex;
      align-items: center;
      border-radius: 50%;
      width: 25px;
      height: 25px;
    }

    // margin-left: 12px;
  }

  .choiseNumIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
    width: 25px;
    height: 25px;
  }

  .van-field {
    font-size: 15px;
  }
}

.wordNo {
  display: flex;
  justify-content: space-between;
  padding: 0 12px 0 22px;
  background-color: white;
  height: 47px;
  line-height: 47px;
  font-size: 15px;
  color: #666666;

  img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    padding: 0 15px;
  }

  /deep/ .van-rate__icon {
    margin-right: 4px;
    margin-top: 3px;
  }
}

.funColor {
  color: #0082ef;
}

/deep/ .box-div {
  height: 100%;
  width: 100%;
  background-color: #f2f2f2;
  font-size: 16px;
  padding-top: 10px;
  box-sizing: border-box;

  .top {
    height: 48px;
    color: #909399;
    background-color: white;
    padding-left: 16px;
    line-height: 48px;
  }

  .van-cell {
    height: 66px;
    display: flex;
    align-items: center;

    .van-field__control {
      font-size: 16px;
    }
  }

  .van-button {
    margin: 24px 15px;
    width: 384px;
    border-radius: 4px;
  }
}
</style>
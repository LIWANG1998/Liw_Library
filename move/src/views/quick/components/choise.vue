<template>
  <div class="approval">
    <div>
      <div class="choiseBox">
        <div class="infoTitle">
          <div class="docInfo">
            <img src="../../../assets/img/home/fInfo.png" alt class="fimg" />
            发文信息
          </div>
          <!-- <div class="tit">
            <div>发文标题</div>
            <div @click="lookFile()" v-if="!next">
              <van-icon name="eye-o" size="18" color="#66B5FF" />
              <span class="preview">公文预览</span>
            </div>
          </div>
          <div class="inputValue">
            <van-field
              v-model="document_arr.title"
              rows="1"
              autosize
              type="textarea"
              placeholder="请在此处输入发文标题"
              @change="changeText()"
            />
          </div>-->
        </div>
      </div>
      <div class="choise">
        <div class="level">
          <van-field
            label="发文标题"
            v-model="document_arr.title"
            placeholder="请在此处输入"
            input-align="left"
            :border="false"
          />
        </div>
        <div class="noicon"></div>
      </div>
      <div class="choise">
        <div class="level">
          <van-field
            readonly
            clickable
            label="发文字号"
            :value="wordNoName"
            placeholder="请选择发文字号"
            input-align="left"
            :border="false"
            @click="choiseNum()"
          />
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="wordNo" v-if="iss.value.length>0">
        {{iss.value[0].word_no}}
        <span class="funColor">
          <img src="../../../assets/img/home/edits.png" alt @click="choiseNum()" />
        </span>
      </div>
      <div class="wordNo" v-if="getRules!=''&&getRules==undefined">
        不需要字号规则
        <span class="funColor">
          <img src="../../../assets/img/home/edits.png" alt @click="choiseNum()" />
        </span>
      </div>
      <div class="choise">
        <div class="level borderNo">
          <van-field
            readonly
            clickable
            label="公文密级"
            :value="secret_level_name"
            placeholder="请选择"
            @click="showPicker = true"
            input-align="left"
            :border="false"
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
        <div class="level">
          <van-field
            readonly
            clickable
            label="公文紧急"
            :value="urgent_level_name"
            placeholder="请选择"
            @click="urgentPicker = true"
            input-align="left"
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
      <!-- <div class="choise">
        <div class="borderNo">
          <div class="level">
            <van-field
              label="发文单位"
              v-model="fun_sendingunit"
              placeholder="请选择"
              input-align="left"
              :border="false"
              rows="1"
              autosize
              :readonly="true"
              type="textarea"
            />
            <div class="choiseIcon" @click="choisedep()">
              <span>+</span>
            </div>
          </div>
          <div class="level_shu">
            <van-field
              v-model="document_arr.copy_users.text"
              placeholder="请输入"
              input-align="left"
              :border="false"
              rows="1"
              autosize
              type="textarea"
            />
          </div>
        </div>
      </div>-->
      <div class="choise">
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
      <!-- <div class="choise">
        <div class="level">
          <van-field
            label="签发人"
            v-model="document_arr.issuer"
            placeholder="请选择/输入"
            input-align="left"
            :border="false"
            rows="1"
            autosize
            type="textarea"
          />
          <div class="choiseIcon">
            <span @click="choiseUser()">+</span>
          </div>
        </div>
      </div>-->

      <div class="choise">
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
        <div class="level">
          <div class="level-titles">接收人</div>
          <div class="level-content">
            <tags-input v-model="receivers" :sendingunit="receivers" class="tags-input" />
          </div>
        </div>
      </div>
      <div class="division"></div>
      <div class="choise">
        <div class="level">
          <van-field
            readonly
            clickable
            label="套红模板"
            placeholder="请选择"
            input-align="right"
            :border="false"
            @click="choiseTep()"
          />
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="wordNo" v-if="red.value.length>0">
        {{red.value[0].name}}
        <div class="flex-ac">
          <div class="coll-ection flex-ac" @click="redSetCommonly">
            <svg-icon
              :iconClass="red.is_default==0?'coll-ection':'coll-ection-act'"
              class="coll-ection-icon"
            /><span style="margin-top:2px">常用</span>
          </div>
          <div class="file-del flex-ac" @click="reddelFun">
            <svg-icon iconClass="file-del" class="file-del-icon" />
          </div>
        </div>
      </div>
      <div class="nextStep" @click="nextStep" v-if="next">
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
  </div>
</template>

<script>
import TagsInput from "@/components/TagsInput.vue";
import {
  secretTypeList,
  urgentTypeList,
  redTemplateList,
  red_set_commonly,
} from "@/api/home";
import look from "../../../assets/js/lookDetail";
import { document_wordno_manager } from "@/api/audit";
export default {
  components: {
    TagsInput,
  },

  props: {
    back_wen: {
      type: Boolean,
    },
    fields: {
      type: Array,
    },
    getTep: {
      type: Object,
      default: () => "",
    },
    getRules: {
      type: Object,
      default: () => "",
    },
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
    // 选择发文字号的信息
    iss: {
      type: Object,
    },
    // 选择套红模版
    red: {
      type: Object,
    },
    word_no_id: {
      type: Number,
    },
    red_templete_id: {
      type: Number,
    },
  },

  data() {
    return {
      all_word_no: "", // 所有发文字号
      tags: [],
      rateValue: 0, //是否收藏
      // ruleNum: "", //传过来的规则
      tepList: "", //传过来的模板
      columns: [], //密级程度数组
      urgentcolumns: [], //紧急程度数组
      // wordNoName: "", //字号显示
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
        reviewer: {
          select: [],
          text: "",
        }, //接收人
        issuer: {
          select: [],
          text: "",
        }, //签发人
      },
      sendingunit: [], //发文单位
      sendingunits: [], //发文单位
      issuerdata: [], //签发人
      issuerdatas: [], //签发人
      maindeliveryunit: [], //主送单位
      maindeliveryunits: [], //主送单位
      receivers: [], //接收人
      //
      tableStatus: false,
      showTable: false,
      id: "",
      content: "",
      showInfo: true,
      value: "",
      showPicker: false,
      urgentPicker: false,
      secret_level_name: "", //密级程度name
      urgent_level_name: "", //紧急程度的name

      addList: [], //人为新增的内容
      mjData: [],
      jjData: [],
      show: true, //显示预览

      flag: true,
    };
  },
  methods: {
    // 删除套红模板
    reddelFun() {
      // console.log(this.red);
      this.red.value = [];
    },
    init() {
      this.fields.forEach((el) => {
        if (el.e_name == "title") {
          this.document_arr.title = el.value;
        }
        if (el.e_name == "word_no") {
          if (this.word_no_id != -1) {
            // console.log(this.word_no_id);
            this.get_document_wordno_manager(this.word_no_id);
          } else {
            this.get_document_wordno_manager(el.value);
          }
        }
        if (el.e_name == "copy_users") {
          this.sendingunits = el.value.select.map((e) => {
            this.sendingunit.push("bm" + e.id);
            return {
              id: e.id,
              title: e.name,
              w_id: "bm" + e.id,
              img: "",
              onc: false,
              type: 1,
            };
          });
        }
        if (el.e_name == "issuer") {
          this.issuerdatas = el.value.select.map((e) => {
            this.issuerdata.push("ren" + e.id);
            return {
              id: e.id,
              title: e.name,
              w_id: "ren" + e.id,
              img: "",
              onc: false,
              type: 1,
            };
          });
        }
        if (el.e_name == "main_delivery") {
          this.maindeliveryunits = el.value.select.map((e) => {
            this.maindeliveryunit.push("dw" + e.id);
            return {
              doc_receiver: e.name,
              id: e.id,
              title: e.name,
              w_id: "dw" + e.id,
              img: "",
              onc: false,
              type: 1,
            };
          });
        }
        if (el.e_name == "reviewer") {
          this.receivers = el.value.select.map((e) => {
            return {
              receiver_name: e.name,
              title: e.name,
              w_id: e.id,
              type: 500,
              id: e.id,
            };
          });
          // console.log("this.receivers", this.receivers);
        }
      });
      this.get_redTemplateList(this.red_templete_id);
    },
    //获取全部字号
    async get_document_wordno_manager(id) {
      let { data } = await document_wordno_manager({
        type: 1,
      });
      data.forEach((el) => {
        if (el.id == id) {
          // console.log(el);
          this.iss.value = [el];
        }
      });
    },
    // 设置常用套红模版
    async redSetCommonly() {
      let _data = {
        id: this.red.value[0].id, // 套红模板的id
        status: this.red.is_default == 0 ? 1 : 0, //	0取消 1设为常用
        type: 1, // 1发文 2收文 3签报
      }; // 参数
      // console.log(_data);
      let _res = await red_set_commonly(_data);
      // console.log(_res);
      this.$toast(_res.msg);
      if (_res.code == 1) {
        this.red.is_default =
          this.red.is_default == 0
            ? (this.red.is_default = 1)
            : (this.red.is_default = 0);
      }
    },
    //获取套红模版
    async get_redTemplateList(id) {
      let { data } = await redTemplateList({
        type: 1,
        sort: "DESC",
      });
      // console.log("DESCd", data);
      data.data.forEach((el) => {
        if (el.id == id) {
          this.red.value = [el];
        }
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
    defaultDropdown(_num) {
      _num == 1
        ? this.columns.sort(this.compare("weight"))
        : this.urgentcolumns.sort(this.compare("weight"));
      _num == 1
        ? (this.secret_level_name = this.columns[0].text)
        : (this.urgent_level_name = this.urgentcolumns[0].text);
      _num == 1
        ? (this.document_arr.secret_level = this.columns[0].id)
        : (this.document_arr.urgent_level = this.urgentcolumns[0].id);
    },
    // 加来密集程度下拉选择
    /* num 判断是加载密级程度 还是 紧急程度 */
    async get_secretTypeList(_num) {
      let _res = _num == 1 ? await secretTypeList() : await urgentTypeList();
      if (_res.code == 1) {
        let arr = _res.data.data;
        arr.forEach((item) => {
          var obj = {};
          obj["id"] = item.id;
          obj["text"] = item.name;
          obj["weight"] = item.weight;
          _num == 1 ? this.columns.push(obj) : this.urgentcolumns.push(obj);
        });
        // 默认赋值下拉选择
        this.defaultDropdown(_num);
      }
    },

    // 深拷贝
    StoP(a) {
      return JSON.parse(JSON.stringify(a));
    },
    // new---------------------------------------------------------------------
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
    closetags(it) {
      // console.log(it);
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
    },
    // 选择字号
    choiseNum() {
      this.iss.numStatus = true;
      // this.$emit("listenNum", true);
    },
    //选择套红模板
    choiseTep() {
      this.red.showtf = true;
    },
    // 获取密级程度
    getSecretTypeList() {
      secretTypeList().then((res) => {
        // console.log(res);
        if (res.code == 1) {
          let arr = res.data.data;
          arr.forEach((item) => {
            var obj = {};
            obj["id"] = item.id;
            obj["text"] = item.name;
            this.columns.push(obj);
          });
        }
      });
    },
    //获取紧急程度
    getUrgentTypeList() {
      urgentTypeList().then((res) => {
        if (res.code == 1) {
          let arr = res.data.data;
          arr.forEach((item) => {
            var obj = {};
            obj["id"] = item.id;
            obj["text"] = item.name;
            this.urgentcolumns.push(obj);
          });
        }
      });
    },
    //密级按钮
    onConfirm(value) {
      this.document_arr.secret_level = value.id;
      this.secret_level_name = value.text;
      this.showPicker = false;
      // console.log(this.document_arr);
    },
    //紧急按钮
    onConfirmDegree(value, index) {
      this.urgent_level_name = value.text;
      this.document_arr.urgent_level = value.id;
      this.urgentPicker = false;
    },
    // new---------------------------------------------------------------------
    //文字变化就改变 点了立即审核就传过去
    //向父组件传值
    lookFile() {
      this.$emit("listenShow", this.show, this.document_arr);
    },

    onChange(picker, value, index) {
      // console.log(value, 5555555555555);
      var keyId = value.id;
      var text = value.text;
    },
    // 必填项判断
    required() {
      let document_arrs = JSON.parse(sessionStorage.getItem("document_arrs"));
      // console.log(document_arrs);
      if (!sessionStorage.getItem("content")) {
        this.$toast(`请填写正文内容`);
        return false;
      }
      // console.log(document_arrs);
      // 发文标题
      if (!document_arrs.title) {
        this.$toast("请填写发文标题");
        return false;
      }
      if (!document_arrs.word_no) {
        this.$toast("请填写发文字号");
        return false;
      }
      if (!document_arrs.secret_level) {
        this.$toast("请填写公文密级");
        return false;
      }
      if (!document_arrs.urgent_level) {
        this.$toast("请填写公文紧急");
        return false;
      }
      if (
        document_arrs.copy_users.select.length == 0 &&
        !document_arrs.copy_users.text
      ) {
        this.$toast("请填写发文单位");
        return false;
      }
      if (
        document_arrs.issuer.select.length == 0 &&
        !document_arrs.issuer.text
      ) {
        this.$toast("请填写签发人");
        return false;
      }
      if (
        document_arrs.main_delivery.select.length == 0 &&
        !document_arrs.main_delivery.text
      ) {
        this.$toast("请填写主送单位");
        return false;
      }
      if (
        document_arrs.reviewer.select.length == 0 &&
        !document_arrs.reviewer.text
      ) {
        this.$toast("请填写接收人");
        return false;
      }
      return true;
    },
    //点击下一步
    nextStep() {
      this.set_vuex_data();
      if (this.required()) {
        this.$router.push({
          path: "/approval",
          query: {
            type: 0,
          },
        });
      }
    },
    // 设置vuex数据
    set_vuex_data() {
      let document_arr = this.StoP(this.document_arr);
      this.$store.commit("getDocument", document_arr);
      sessionStorage.setItem(
        "document_arrs",
        JSON.stringify(this.document_arr)
      );
      sessionStorage.setItem("red", JSON.stringify(this.red));
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
    "iss.value"(newValue, oldValue) {
      if (newValue.length > 0) {
        this.document_arr.word_no = newValue[0].id;
      }
      // console.log("aaaaaa", this.document_arr);
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
            id: e.id,
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
      this.document_arr.reviewer.select = [];
      n.forEach((v) => {
        if (v.type == 100) {
          text.push(v.title);
        } else {
          this.document_arr.reviewer.select.push({
            id: v.id,
            name: v.title,
          });
        }
      });
      this.document_arr.reviewer.text = text.join();
    },
    // 选人的时候 通知改变
    lw_selectdatas() {
      // console.log("不是吧asir");
    },
  },
  computed: {
    fun_sendingunit() {
      let a = this.sendingunits.map((v) => {
        return v.title;
      });
      return a.join(";");
      le;
    },
    wordNoName() {
      // console.log(this.iss.value);
      return this.iss.value.length > 0 ? this.iss.value[0].name : "";
    },
  },
  mounted() {
    // if (this.getRules) {
    //   this.document_arr.word_no = this.getRules.id;
    //   this.wordNoName = this.getRules.word_no;
    // }
  },
  created() {
    this.get_secretTypeList(1);
    this.get_secretTypeList(2);
    // console.log("进来了", this.fields, this.columns, this.urgentcolumns);
    if (this.back_wen) {
      this.init();
    }
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
    this.bbtn();
    // ----------------------------------------

    //+++++++++++++++++++++++++++++++++++++++

    // 接收父组件的提醒，提交数据到vuex
    this.$bus.$off("remind_set_vuex");
    this.$bus.$on("remind_set_vuex", () => {
      this.set_vuex_data();
    });
  },
};
</script>
<style lang="scss" scoped>
/deep/.van-cell {
  margin-top: 15px;
}
/deep/ .van-cell {
  padding: 0;
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
    line-height: 48px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-right: 20px;
    padding-left: 15px;
  }

  .choise {
    display: flex;
    .level {
      position: relative;
      display: flex;
      width: 400px;
      min-height: 60px;
      // line-height: 60px;
      margin-left: 15px;
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
          margin-top: 0;
          width: 22px;
        }
      }
    }
    .level_shu {
      margin-left: 135px;
      margin-right: 35px;
      margin-bottom: 20px;
      /deep/ .van-cell {
        margin-top: 0;
      }
    }
    img {
      width: 12px;
      height: 12px;
      vertical-align: text-bottom;
      padding: 20px 12px;
    }

    .van-icon {
      margin: 20px 10px;
      color: #c7c7cc;
    }
    .choiseIcon {
      position: relative;
      background-color: #e0e5f2;
      width: 22px;
      height: 22px;
      color: #000;
      font-size: 22px;
      border-radius: 50%;

      margin-top: 17px;
      margin-right: 15px;
      span {
        position: absolute;
        left: 50%;
        top: 45%;
        transform: translate(-50%, -50%);

        color: #fff;
      }
    }
    .noicon {
      width: 55px;
      color: #0082ef;
      font-size: 14px;
    }
  }
}

.choiseBox {
  .infoTitle {
    // padding-bottom: 18px;

    .docInfo {
      font-size: 14px;
      font-weight: 500;
      background: #f8f8f8;
      height: 40px;
      line-height: 40px;
      padding-left: 14px;
      .fimg {
        width: 14px;
        height: 14px;
        padding-right: 3px;
        vertical-align: middle;
        margin-bottom: 2px;
      }
    }
    .inputValue {
      padding-left: 14px;
    }
    .tit {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      margin-top: 17px;
      margin-bottom: -7px;
      font-size: 14px;
      margin-left: 14px;

      div:nth-child(1) {
        padding-bottom: 12px;
        font-size: 16px;
      }

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
.wordNo {
  display: flex;
  justify-content: space-between;
  margin-left: 15px;
  padding-right: 15px;

  height: 47px;
  line-height: 47px;
  font-size: 15px;
  color: #666666;
  img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    padding-left: 24px;
  }
  /deep/.van-rate__icon {
    margin-right: 4px;
  }
  .file-del {
    margin-left: 10px;
  }
  .file-del-icon {
    width: 16px;
    height: 16px;
    margin: 0 10px;
  }
  .coll-ection {
    margin-left: 10px;
    color: #606266;
    .coll-ection-icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }
}
.funColor {
  color: #0082ef;
}

.borderNo {
  border-top: none !important;
}
</style>
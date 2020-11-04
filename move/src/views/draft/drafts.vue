<template>
  <div class="box" id="box">
    <!-- 正文内容 -->
    <div class="text-box">
      <div class="text-content flex-jsb">
        <div class="text-content-left flex-ac text-z">
          <svg-icon iconClass="text-z" />
          <span class="text-w">正文内容</span>
        </div>
        <div
          v-if="uptrues"
          class="text-content-right flex-ac ed-text"
          @click="editContent"
        >
          <svg-icon iconClass="ed-text" />
          <span class="text-w">编辑正文</span>
        </div>
      </div>
      <div class="text-box-content">
        <div class="text-box-content-top flex-ac">
          <template v-if="uptrue">
            <div class="text-box-content-top-addfile flex-ac-jc">
              <van-uploader
                :after-read="afterRead"
                accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              >
                <svg-icon iconClass="add-file" class="add-file" />
              </van-uploader>
            </div>
          </template>
          <template v-if="ele.item != []">
            <template v-for="(item, index) in ele.item">
              <div
                :key="index"
                class="text-box-content-top-addfile two-flile flex-ac-jc"
              >
                <img :src="img(item)" alt />
                <div class="red-del" @click="closeEleFun(index)">
                  <svg-icon iconClass="red-del" />
                </div>
              </div>
            </template>
          </template>
        </div>
        <template v-if="uptrues">
          <div
            class="text-box-content-bottom"
            v-html="content"
            @click="editContent"
          ></div>
        </template>
        <template v-else>
          <div class="text-box-content-bottom"></div>
        </template>
      </div>
    </div>
    <!-- 附件 -->
    <template v-if="fujian">
      <div class="upDown-box">
        <div class="text-content flex-jsb">
          <div class="text-content-left flex-ac text-z">
            <svg-icon iconClass="enclo-sure" />
            <span class="text-w">附件</span>
          </div>
        </div>
        <div class="text-box-content">
          <div class="text-box-content-top flex-ac">
            <div class="text-box-content-top-addfile flex-ac-jc">
              <van-uploader :after-read="enclosure" :accept="accept">
                <svg-icon iconClass="add-file" class="add-file" />
              </van-uploader>
            </div>
          </div>
          <!-- 附件列表 -->
          <template v-if="enclosure_file.length != 0">
            <div
              class="detail flex-ac"
              v-for="(item, index) in enclosure_file"
              :key="index"
            >
              <svg-icon
                @click="openpages(item.path)"
                :iconClass="icon_img(item.path)"
                class="file-icon"
              />
              <div class="oldName" @click="openpages(item.path)">
                {{ item.oldname }}
              </div>
              <div class="file-del" @click="delFile(item)">
                <svg-icon iconClass="file-del" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- 公文字段 -->
    <div class="choise-box" v-if="fields.length > 0">
      <div class="text-content flex-jsb">
        <div class="text-content-left flex-ac text-z">
          <svg-icon iconClass="send-info" />
          <span class="text-w">{{
            type == 1 ? "发文信息" : type == 2 ? "收文信息" : "签报信息"
          }}</span>
        </div>
      </div>
      <template v-for="(item, index) in fields_data">
        <input-type
          :key="index"
          :keys="index"
          :item="item"
          :add_page="add_page"
        />
      </template>
    </div>
    <!-- 套红模板 -->
    <div class="res-template">
      <div class="input-type-cell">
        <div class="input-type-lt flex-ac">
          <div class="red_dian"></div>
          套红模板
        </div>
        <div class="input-type-rt">
          <van-field
            class="input-type-rt-flex"
            :value="red.value.length > 0 ? red.value[0].name : ''"
            readonly
            :placeholder="'请选择'"
            @click="choiseNum"
          />
          <div class="choiseNumIcon" @click="choiseNum">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div class="input-type-cell-bt flex-ac" v-if="red.value.length > 0">
        <span class="flex-col-bd ellipsis">{{ red.value[0].name }}</span>
        <div class="coll-ection flex-ac" @click="redSetCommonly">
          <svg-icon
            :iconClass="red.is_default == 0 ? 'coll-ection' : 'coll-ection-act'"
            class="coll-ection-icon"
          />
          <span style="margin-top: 2px">常用</span>
        </div>
        <div class="file-del flex-ac" @click="reddelFun">
          <svg-icon iconClass="file-del" class="file-del-icon" />
        </div>
      </div>
    </div>
    <!-- 下一步 -->
    <div class="nextStep flex-ac-jc" @click="nextStep">
      <van-button
        type="primary"
        block
        color="linear-gradient(to right, #0082EF, #04A9FE)"
        >下一步
      </van-button>
    </div>
    <div @click="sTable()">
      <lookFile></lookFile>
    </div>
    <!-- 填写正文和签章的信息 -->
    <van-popup
      v-model="editState"
      position="left"
      :style="{ height: '100%', width: '100%' }"
    >
      <div class="quill" v-show="editState">
        <div class="quill-top">
          <!-- <template v-for="(item, index) in ele.item">
            <su-spend
              @suSpendFun="suSpendFun(item)"
              @closeEleFun="closeEleFun(index)"
              :item="item"
              :key="index"
              :i="index"
              :div="'.ql-container'"
            />
          </template>-->
          <quill-editor
            class="editor"
            v-model="content"
            :options="editorOption"
            ref="myQuillEditor"
          ></quill-editor>
        </div>
        <div class="quill-bottom">
          <ele-sign :ele="ele" />
          <van-button class="subbtn" color="#0082EF" @click="submit" block
            >确定
          </van-button>
        </div>
      </div>
    </van-popup>
    <!-- 预览文件 -->
    <van-popup
      v-model="show"
      position="left"
      :style="{ height: '100%', width: '100%' }"
    >
      <div class="viewDocuments">
        <div class="close-box flex-ac-jc" @click="show = false">
          <van-icon name="cross" class="cross" />
        </div>
        <viewDocument v-if="show" :ele="ele" :datas="datas"></viewDocument>
      </div>
    </van-popup>
    <!-- 预览文件 -->
    <!-- <van-popup
      v-model="show"
      position="left"
      @click="show=false"
      :style="{ height: '100%',width:'100%' }"
    >
      <div v-if="show">
        <div id="print" class="infoBox">
          <div class="big-title">发文单</div>
          <div class="line fir" v-for="(item,index) in view_data.fir" :key="'fir'+index">
            <div class="head">{{item.c_name}}</div>
            <div class="body">{{item.value}}</div>
          </div>
          <div class="line sec">
            <div class="item" v-for="(item) in view_data.sec" :key="item.e_name">
              <div class="head">{{item.c_name}}</div>
              <div class="body">{{item .value}}</div>
            </div>
          </div>
          <div class="line thr" v-for="(item,index) in view_data.thr" :key="'sec'+index">
            <div class="item" v-for="(item2) in item" :key="item2.e_name">
              <div class="head">{{item2.c_name}}</div>
              <div class="body">{{item2.value}}</div>
            </div>
          </div>
          <div class="file-text">
            <div class="head">
              <h3>名冠天下公司文件</h3>
              <p>FW-2012-2232</p>
            </div>
            <div class="body">
              <template v-for="(item, index) in ele.item">
                <su-spenddown :item="item" :key="index" :i="index" :div="'.file-text>.body'" />
              </template>
              <pre v-html="content"></pre>
            </div>
          </div>
        </div>
      </div>
    </van-popup>-->
    <!-- 选择套红模板 -->
    <!-- <van-popup v-model="red.showtf" position="left" :style="{ height: '100%',width:'100%' }">
      <redTemplete v-if="red.showtf" :red="red"></redTemplete>
    </van-popup>-->
    <!--    //更多按钮-->
    <!--    <showFun-->
    <!--            :commomType="commomType"-->
    <!--            role="self"-->
    <!--            :type="type"-->
    <!--            :docId="fid"-->
    <!--            :process="process.processType"-->
    <!--            :button="auth"-->
    <!--            @saveDraft="cancel($event)"-->
    <!--    ></showFun>-->
    <!--    <documentDetail></documentDetail>-->
    <!--    //更多按钮-->
    <showFun
      :tid="templete_id"
      :commomType="commomType"
      role="self"
      :type="type"
      :docId="fid"
      :process="process.processType"
      :button="auth"
      @saveDraft="cancel($event)"
    ></showFun>
    <div @click="updataVuex">
      <documentDetail></documentDetail>
    </div>
  </div>
</template>
<script>
import { approvalBefore } from "../../api/home";

let loc = false;
import store from "@/store";
import { get_file_img, openpage } from "@/assets/js/public.js";
import showFun from "../../components/common/showFun";
import documentDetail from "../../components/common/documentDetail";
import approval from "../approval/approval";
import {
  qiniuToken,
  documentInfo,
  getWord,
  temInfo,
  red_set_commonly,
  red_template_one,
  secretTypeList,
  urgentTypeList,
  check_word_wo_re,
} from "@/api/home"; //接口
import { getDate } from "@/assets/js/up";
import { getDistributeDetail, document_wordno_manager } from "@/api/audit";
import pickclass from "@/components/pickclass/pickclass"; //new
import { saveFile } from "@/assets/js/public";
import InputType from "@/components/InputType";
import eleSign from "@/components/EleSign";
import { HttpUrl, small_down, set_vuex_data } from "@/js/public.js";
import redTemplete from "@/components/redTemplete"; //new
import lookFile from "@/components/lookFile"; //new
import SuSpend from "@/components/SuSpend"; //new
import SuSpenddown from "@/components/SuSpenddown"; //new
import viewDocument from "@/components/viewDocument"; //new
import bus from "@/assets/js/eventBus.js";

export default {
  name: "draft",
  components: {
    approval,
    pickclass,
    InputType,
    eleSign,
    redTemplete,
    lookFile,
    SuSpend,
    SuSpenddown,
    viewDocument,
    showFun,
    documentDetail,
  },
  data() {
    return {
      // fujian: false, // 是否可以上传附件
      // uptrue: false, // 是否可以上传正文
      // uptrues: false, // 是否可以编辑正文
      // datas: {
      //   fields: {},
      //   process: {},
      //   content: "",
      // },
      accept: "*/*",
      isFirstEnter: false, // 是不是首页

      fid: "", //文件id
      templete_id: "", //模板的id
      lid: "", //流程id,
      type: "", //发文类型
      cut: "", // 行为记录
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            // ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }][
              ({ script: "sub" }, { script: "super" })
            ], // superscript/subscript
            // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
            // [{'direction': 'rtl'}],                         // text direction

            // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            // [{'color': []}, {'background': []}],          // dropdown with defaults from theme
            // [{'font': []}],
            [{ align: [] }],
            // ['link', 'formula']//去除video即可
            // ['link', 'image', 'video', 'formula']//去除video即可
          ],
        },
        placeholder: "请输入文字内容...",
      },
      isShowTable: 1,
      local: 0, //储存本地
      // content: "", //公文的信息
      fTitle: "", //发文信息
      filesList: [{ oldname: "", path: "", size: "" }],
      content_file: [{ oldname: "", path: "" }], //正文附件
      // enclosure_file: [], //附件
      path: "", //七牛云文件地址
      qiniuYun: {
        key: "", //图片名字
        token: "", //token
      },
      more: true,
      // fields_data: {},
      add_page: true, // 判断是新增页面调用还是审批页面调用
      degree: [], //密级程度
      urgen_level: [], //紧急程度
      editState: false,
      swenStatus: "", //1--转收文
      receivingTime: "", //接收时间
      distributeId: "", //公文转换记录id
      status: "", //公文状态8-草稿

      //预览公文
      show: false,
      view_data: {
        fir: [],
        sec: [],
        thr: [],
      },
      radio_data: {
        urgent_level: "",
        secret_level: "",
      },
      //字号
      all_word_no: null,
      red_templete: null,
      // 电子签章
      // ele: {
      //   type_ele: false, //电子签章弹窗
      //   item: [],
      //   zhiqian: [],
      // },
      // 当前印章id
      eleid: "",
      eleimg: "",
      // isss: { id: "", name: "", word_no: "" },
      commomType: 1, //公共按钮状态提交拟稿
      auth: [], //按钮权限
    };
  },
  methods: {
    openpages(el) {
      openpage(el);
    },
    inits() {
      //type值：1发文，2收文，3签报，5转发文，6转收文
      //发文收文签报 id:发文模板id
      //草稿：d_id:草稿发文的id，（草稿传过来的type类型还是1,2,3代表发文收文签报）（通过判断是否
      // 有d_id）
      // 驳回重新发：传过来的type类型还是1,2,3代表发文收文签报，d_id为驳回文章id  can_edit代表是否驳回
      // 只有驳回才会传&can_edit
      //转发文：file_id：发过来的签报id，id:选择的模板id，类型默认为发文
      //转收文：file_id：发过来的发文id，id:选择的模板id，类型默认为收文

      // this.content = sessionStorage.getItem("content");
      // this.enclosure_file = JSON.parse(sessionStorage.getItem("enclosure_file"));
      this.fid = this.$route.query.fid;
      this.templete_id = this.$route.query.tid;
      this.type = this.$route.query.type;
      this.cut = this.$route.query.cut;
      this.distributeId = this.$route.query.distributeId;
      this.red.type = this.$route.query.type;
      this.auth = JSON.parse(sessionStorage.getItem("button"));
      // console.log(this.red);
      // if (sessionStorage.getItem("document_arrs")) {
      //   // this.init();
      // } else {
      if (this.cut) {
        //有公文id有两种情况：1.草稿，2.驳回
        // //获取模板信息
        // let data = new URLSearchParams();
        // data.append("id", this.templete_id); //模板id
        temInfo({ id: this.templete_id }).then((res) => {
          this.fields = res.data.fields;
          this.lid = res.data.technological_process_id;
          // console.log(this.fields);
          let _reg = RegExp(/1/);
          let _regs = RegExp(/2/);
          this.uptrue = _reg.test(res.data.content_type);
          this.uptrues = _regs.test(res.data.content_type);
          this.fujian = res.data.fujian == 1 ? true : false;
          this.red_templete = res.data.red_template_id;
          console.log(res);
          if (res.data.red_template_id) {
            // console.log({ id: res.data.red_template_id });
            red_template_one({ id: res.data.red_template_id }).then((red_) => {
              this.red.value.push(red_.data);
            });
          }
          if (this.cut == 15) {
            this.setiss(
              res.data.word_no_id,
              res.data.word_no,
              res.data.word_name
            );
          }
          if (this.cut == 16) {
            this.fid = this.distributeId;
            this.getDocumentInfo(1);
          } else {
            this.getDocumentInfo(this.fid ? 1 : 2);
          }
        });
      } else {
        this.getTemplateInfo();
      }
      // }
      this.getQiniuToken();
      this.get_document_wordno_manager();
    },
    // 设置字号
    setiss(id, word_no, name) {
      this.isNum.id = id;
      this.isNum.word_no = word_no;
      this.isNum.name = name;
    },
    // 初始化数据
    init() {
      this.content = sessionStorage.getItem("content")
        ? sessionStorage.getItem("content")
        : "";
      this.fields_data = sessionStorage.getItem("document_arrs")
        ? JSON.parse(sessionStorage.getItem("document_arrs"))
        : {};
      this.fields = sessionStorage.getItem("fieldss")
        ? JSON.parse(sessionStorage.getItem("fieldss"))
        : {};
      this.enclosure_file = sessionStorage.getItem("gercontentFile")
        ? JSON.parse(sessionStorage.getItem("gercontentFile"))
        : [];
      this.red = sessionStorage.getItem("red")
        ? JSON.parse(sessionStorage.getItem("red"))
        : {
            showtf: false,
            value: [],
            is_default: 0, // 是不是常用
          };
      this.ele = sessionStorage.getItem("ele")
        ? JSON.parse(sessionStorage.getItem("ele"))
        : {
            type_ele: false, //电子签章弹窗
            item: [],
          };
      this.fujian = sessionStorage.getItem("fujian")
        ? JSON.parse(sessionStorage.getItem("fujian"))
        : false;
      this.uptrue = sessionStorage.getItem("uptrue")
        ? JSON.parse(sessionStorage.getItem("uptrue"))
        : false;
      this.uptrues = sessionStorage.getItem("uptrues")
        ? JSON.parse(sessionStorage.getItem("uptrues"))
        : false;
      // console.log(this.fujian, this.uptrue, this.uptrues);
    },
    // 设置初始化数据
    set_init() {
      sessionStorage.setItem("content", this.content ? this.content : "");
      sessionStorage.setItem(
        "gercontentFile",
        JSON.stringify(this.enclosure_file)
      );
      sessionStorage.setItem("document_arrs", JSON.stringify(this.fields_data));
      sessionStorage.setItem("fieldss", JSON.stringify(this.fields));
      sessionStorage.setItem("red", JSON.stringify(this.red));
      sessionStorage.setItem("ele", JSON.stringify(this.ele));
      sessionStorage.setItem("fujian", this.fujian);
      sessionStorage.setItem("uptrue", this.uptrue);
      sessionStorage.setItem("uptrues", this.uptrues);
    },
    // 移除电子签章
    closeEleFun(n) {
      this.ele.item.splice(n, 1);
      this.saveeleid();
    },
    // 设置常用套红模版
    async redSetCommonly() {
      let _data = {
        id: this.red.value[0].id, // 套红模板的id
        status: this.red.is_default == 0 ? 1 : 0, //	0取消 1设为常用
        type: this.type, // 1发文 2收文 3签报
        templete_id: this.templete_id, // int 当前公文模板的id 在发文时设置常用时 必填
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
    // 删除套红模板
    reddelFun() {
      // console.log(this.red);
      this.red.value = [];
    },
    // 打开套红模板
    choiseNum() {
      this.$router.push({
        path: "/redtemplete",
      });
      this.red.showtf = true;
    },
    //获取模板信息
    getTemplateInfo() {
      let _this = this;
      let data = new URLSearchParams();
      data.append("id", this.templete_id); //模板id
      temInfo(data).then((res) => {
        _this.degree = res.data.degree; //密级程度
        _this.fields = res.data.fields;
        // console.log(JSON.stringify(_this.fields));
        _this.lid = res.data.technological_process_id;
        _this.urgen_level = res.data.urgen_level; //密级程度
        let _reg = RegExp(/1/);
        _this.uptrue = _reg.test(res.data.content_type);
        let _regs = RegExp(/2/);
        _this.uptrues = _regs.test(res.data.content_type);
        _this.fujian = res.data.fujian == 1 ? true : false;
        _this.red.type = res.data.type;
        // console.log(
        //   "_reg.test(res.data.content_type)",
        //   _reg.test(res.data.content_type)
        // );
        _this.radio_data = {
          urgent_level: res.data.urgen_level,
          secret_level: res.data.degree,
        };
        if (!this.$store.state.edittext.document_arrs.hasOwnProperty("title")) {
          _this.content = "";
          res.data.fields.forEach((v, i) => {
            let key = v.e_name;
            _this.$set(v, "value", "");
            _this.$set(v, "values", "");
            _this.$set(v, "value_id", "");
            _this.$set(
              v,
              "value",
              v.input_type_new > 3 ||
                v.e_name == "received_delivery" ||
                v.e_name == "issuer"
                ? []
                : ""
            );
            _this.$set(
              v,
              "values",
              v.input_type_new > 3 ||
                v.e_name == "received_delivery" ||
                v.e_name == "issuer"
                ? []
                : ""
            );
            // this.fields_data[key] = v;
            _this.$set(_this.fields_data, key, v);
            if (v.e_name == "word_no") {
              if (res.data.word_no_id != null) {
                v.value_id = res.data.word_no_id;
                v.value = res.data.word_name;
                _this.setiss(
                  res.data.word_no_id,
                  res.data.word_no,
                  res.data.word_name
                );
                // this.isss.id = res.data.word_no_id;
                // this.isss.word_no = res.data.word_no;
                // this.isss.name = res.data.word_name;
              }
            }
            if (v.e_name == "receiving_time") {
              v.value = _this.timeFormate;
            }
            if (v.e_name == "receiving_user") {
              v.values.push({
                w_id: "lw_lw",
                title: _this.userinfo.name,
                type: 100,
              });
            }
          });
          if (res.data.redtemplete_list.length != 0) {
            _this.red.value = [];
            _this.red.value.push(res.data.redtemplete_list[0]);
            _this.red.is_default = res.data.redtemplete_list[0].is_default;
          }
          // console.log(this.$store.state.edittext);
        }
        // this.$store.commit("setdocument_arrs", this.fields_data);
        // // console.log(this.$store.state);
        //  初始化审批流程
        this.initProcess();
      });
    },
    // 排序
    sortData(a, b) {
      return a.position.zindex - b.position.zindex;
    },
    // 修改签章
    saveeleid() {
      // console.log(this.ele);
      let _ele = this.ele.item.map((v) => {
        if (v.hasOwnProperty("handle")) {
          return {
            id: "",
            signature_id: v.signature_id,
            signature_img: v.img_data,
            position: v.position,
            signature_base: v.img_data,
          };
        } else {
          if (v.type != 100) {
            return {
              id: v?.id ? v?.id : "",
              signature_id: v.signature_id,
              signature_img: this.img_s(v.img),
              position: v.position,
              signature_base: v.signature_base,
            };
          } else {
            return {
              id: v?.id ? v?.id : "",
              signature_id: "",
              signature_img: this.img_s(v.img),
              position: v.position,
              signature_base: v.signature_base,
            };
          }
        }
      });
      _ele.sort(this.sortData);
      let _eles = _ele.map((v, i) => {
        v.position.zindex = 500 + i;
        return v;
      });
      // console.log(_ele);
      this.$store.state.edittext.eles = _ele;
      // console.log(this.$store.state.edittext);
    },
    submit() {
      this.editState = false;
      this.saveeleid();
      sessionStorage.setItem("content", this.content);
      this.$store.commit("getContent", this.content);
    },
    sTable() {
      // this.isShowTable++;
      set_vuex_data(this.type);
      this.set_view_document_data();
      this.$router.push({
        path: "/viewDocument",
      });
    },
    //获取全部字号
    async get_document_wordno_manager() {
      let { data } = await document_wordno_manager({
        type: this.$route.query.type,
      });
      this.all_word_no = data;
    },
    editContent() {
      // this.$store.commit("setContent", this.content);
      this.$router.push({
        path: "/editor",
        query: {
          content: 11,
        },
      });
      // this.editState = true;
    },
    // 显示更多
    isMore() {
      this.more = !this.more;
    },
    //删除文件
    delFile(info) {
      this.enclosure_file.forEach((item, index) => {
        if (info.oldname == item.oldname && info.path == item.path) {
          this.enclosure_file.splice(index, 1);
        }
      });
      // sessionStorage.setItem(
      //   "enclosure_file",
      //   JSON.stringify(this.enclosure_file)
      // );
      // this.$store.commit("gercontentFile", this.enclosure_file);
      // this.$store.commit("setEnclosure_file", this.enclosure_file);
    },
    //获取七牛toten
    getQiniuToken() {
      qiniuToken().then((res) => {
        this.path = res.url;
        this.qiniuYun.token = res.token;
      });
    },
    //正文附件
    afterRead(files) {
      this.content_file[0].oldname = files.file.name;
      let text = files.file.name.split("."); // 获取文件后缀
      if (text[1] == "docx" || text[1] == "txt") {
        this.$toast.loading({
          message: "上传中...",
          duration: 0,
          forbidClick: true,
        });
      } else {
        this.$toast("请上传DOCX和TXT文件");
        return;
      }
      let timestamp = Date.parse(new Date()); // 获取当前事件戳
      let randomnumber = Math.round(Math.random() * 10000); // 获取4位随机数
      let num = String(timestamp) + String(randomnumber); // 拼接当前事件戳转加随机数
      let key = `document/${getDate(timestamp)}${this.$md5(num)}.${text[1]}`; // 拼成完整的key
      let _this = this;
      const { file } = files;
      // 上传提交
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      formData.append("token", this.qiniuYun.token);
      this.$axios
        .post("https://upload-z2.qiniup.com", formData)
        .then(function (response) {
          if (response.data.key) {
            // _this.editState = true;
            // // console.log(_this.editState, "  this.editState");
            let data = new URLSearchParams();
            data.append("path", _this.path + "/" + response.data.key);
            getWord(data).then((res) => {
              if (res.code == 1) {
                // console.log(res);
                _this.$store.commit("setContent", res.data);
                _this.$router.push({
                  path: "/editor",
                  query: {
                    content: 12,
                  },
                });
                _this.$toast.clear();
                _this.$toast.success("上传成功");
                // _this.content = res.data;
              }
            });
          }
          _this.content_file[0].path = _this.path + "/" + response.data.key;
        })
        .catch(function (error) {
          _this.$toast.clear();
          _this.$toast.fail("上传失败");
          // console.log(error);
        });
    },
    // 上传附件
    enclosure(files) {
      // console.log(files);
      saveFile(files, this.callFile);
    },
    //七牛云上传返回来的文件数据
    callFile(val) {
      this.enclosure_file.push(val);
      this.$store.commit("setEnclosure_file", this.enclosure_file);
      this.$store.commit("gercontentFile", this.enclosure_file);
      // console.log(this.enclosure_file, "44444444");
    },
    // 获取草稿/驳回的详情页
    async getDocumentInfo(a) {
      let res =
        a == 1
          ? await documentInfo({ id: this.fid, cut: this.cut })
          : await getDistributeDetail({ id: this.distributeId });
      let _data = a == 1 ? res.data : res.data.data;
      if (a == 1 && res.code == 1) {
        this.status = _data.status;
        // this.fields = _data.fields; //公文字段
        this.degree = _data.degree; //密级程度
        this.urgen_level = _data.urgen_level; //紧急程度
        this.radio_data = {
          urgent_level: _data.urgen_level,
          secret_level: _data.degree,
        };
        // console.log(this.radio_data);
        // sessionStorage.setItem("red_templete", _data.red_templete);
        // this.$store.commit("getredtempleteid", _data.red_templete);
        // sessionStorage.setItem("caogao_process", JSON.stringify(_data.process));
        // sessionStorage.setItem(
        //   "approval_file",
        //   JSON.stringify(_data.files_all.approval_file)
        // );
        // sessionStorage.setItem("opinion", _data.opinion);
        // sessionStorage.setItem(
        //   "process_urgent_level",
        //   _data.process_urgent_level
        // );
        this.auth = _data.button;
        sessionStorage.setItem("button", JSON.stringify(_data.button));
        this.$store.commit("gercontentFile", this.enclosure_file);
        // console.log(this.$store.state.edittext.document_arrs);
        if (!this.$store.state.edittext.document_arrs.hasOwnProperty("title")) {
          this.content = _data.content;
          this.red_templete = _data.red_templete;
          this.red.type = _data.type;
          if (_data.red_templete) {
            let red_ = await red_template_one({ id: _data.red_templete });
            this.red.value = [];
            this.red.value.push(red_.data);
          }
          // 拿到模板之后,对应模板回填数据
          let _fields_datasone = {};
          let _fields_datastwo = {};
          let _fields = [];
          this.fields.forEach((v, i) => {
            let _key = v.e_name;
            _fields_datasone[_key] = v;
          });
          _data.fields.forEach((v, i) => {
            let _key = v.e_name;
            _fields_datastwo[_key] = v;
          });
          for (let key in _fields_datasone) {
            // console.log(key);
            this.$set(
              _fields_datasone[key],
              "value",
              _fields_datastwo.hasOwnProperty(key)
                ? _fields_datastwo[key].value
                : _fields_datasone[key].input_type_new > 3
                ? {
                    select: [],
                    text: "",
                  }
                : ""
            );
            _fields.push(_fields_datasone[key]);
          }
          // 拿到模板之后,对应模板回填数据
          // 数据回显的时候会用到
          _fields.forEach((v, i) => {
            let _key = v.e_name;
            this.$set(v, "values", "");
            this.$set(v, "value_id", "");
            if (v.e_name == "word_no") {
              v.value_id = _data.word_no_id;
              if (_data.word_no_id != null) {
                v.value = _data.word_name;
                this.setiss(
                  res.data.word_no_id,
                  res.data.word_no,
                  res.data.word_name
                );
                // this.isss.id = _data.word_no_id;
                // this.isss.word_no = _data.word_no;
                // this.isss.name = _data.word_name;
              }
            }
            if (typeof v.value == "number") {
              v.value_id = v.value;
              if (v.e_name == "secret_level") {
                this.degree.forEach((vv) => {
                  if (vv.id == v.value) {
                    v.value = vv.name;
                  }
                });
              }
              if (v.e_name == "urgent_level") {
                this.urgen_level.forEach((vv) => {
                  if (vv.id == v.value) {
                    v.value = vv.name;
                  }
                });
              }
            }
            if (
              (v.value != null && typeof v.value == "object") ||
              (v.e_name == "received_delivery" && v.input_type_new != 1) ||
              (v.e_name == "issuer" && v.input_type_new != 1)
            ) {
              let _textq =
                v.input_type_new == 5
                  ? "ren"
                  : v.input_type_new == 6
                  ? "bm"
                  : v.input_type_new == 7 || v.input_type_new == 9
                  ? "dw"
                  : "";
              let _value = [];
              // console.log(v);
              if (v.e_name == "reviewer") {
                v.values = v.value.select.map((e) => {
                  return {
                    receiver_name: e.name,
                    title: e.name,
                    w_id: e.id,
                    type: 500,
                    id: e.id,
                    wid: e.wid,
                  };
                });
              } else if (
                v.e_name == "main_delivery" ||
                v.e_name == "receiving_unit"
              ) {
                v.values = v.value.select.map((e) => {
                  _value.push(_textq + e.id);
                  return {
                    doc_receiver: e.name,
                    id: e.id,
                    title: e.name,
                    w_id: _textq + e.id,
                    img: "",
                    onc: false,
                    type: 1,
                  };
                });
                v.value.inter &&
                  v.value.inter.forEach((el) => {
                    _value.push("hl" + el.id);
                    v.values.push({
                      doc_receiver: el.name,
                      id: el.id,
                      title: el.name,
                      w_id: "hl" + el.id,
                      img: "",
                      onc: false,
                      type: 1,
                    });
                  });
              } else {
                // console.log(v);
                v.values = v.value.select.map((e) => {
                  _value.push(_textq + e.id);
                  return {
                    id: e.id,
                    title: e.name,
                    w_id: _textq + e.id,
                    img: "",
                    onc: false,
                    type: 1,
                  };
                });
              }
              // 判断有没有自己输入的东西
              if (v.value.text) {
                let a_s = v.value.text.split(",");
                a_s.forEach((e) => {
                  v.values.push({
                    w_id: "lw_" + new Date().getTime(),
                    title: e,
                    type: 100,
                  });
                });
              }
              v.value = _value;
            }
            if (v.e_name == "received_wordno") {
              v.showpup = true;
            }
            if (
              (v.e_name == "received_delivery" && v.input_type_new == 1) ||
              (v.e_name == "issuer" && v.input_type_new == 1)
            ) {
              v.values = [];
              let a_s = v.value.split(",");
              a_s.forEach((e) => {
                v.values.push({
                  w_id: "lw_" + new Date().getTime(),
                  title: e,
                  type: 100,
                });
              });
              v.value = v.values;
            }
            this.$set(this.fields_data, _key, v);
          });
          console.log(this.fields_data);
          // if (_data.msg !== null) {
          //   sessionStorage.setItem("way", _data.msg.way);
          // }
          this.enclosure_file = [];
          _data.files_all.enclosure_file.forEach((item, index) => {
            let cardNumObj = {
              oldname: item.old_name,
              path: item.path,
              size: item.size,
            };
            this.enclosure_file.push(cardNumObj);
            sessionStorage.setItem(
              "enclosure_file",
              JSON.stringify(this.enclosure_file)
            );
          });
          // this.enclosure_file = [];
          // if (this.fujian) {
          //   _data.files_all.enclosure_file.forEach((item, index) => {
          //     let cardNumObj = {
          //       oldname: item.old_name,
          //       path: item.path,
          //       size: item.size,
          //     };
          //     this.enclosure_file.push(cardNumObj);
          //   });
          // }
          // 草稿来的时候
          if (this.cut == 11 || this.cut == 15 || this.cut == 16) {
            this.ele.item = [];
            this.ele.item = _data.signature;
            // _data.signature.forEach((e, i) => {
            //   e.img = e.signature_img;
            //   this.ele.item = [];
            //   this.ele.item.push(e);
            // });
            let _process = {
              process: _data.process ? _data.process : "",
              process_urgent_level: _data.process_urgent_level
                ? _data.process_urgent_level
                : "",
              approval_file: _data.files_all.approval_file
                ? _data.files_all.approval_file
                : "",
              opinion: _data.opinion ? _data.opinion : "",
            };
            sessionStorage.setItem("caogao_process", JSON.stringify(_process));
          }
        }
      }
      if (a == 2 && res.code == 1) {
        this.status = _data.status;
        // this.fields = _data.fields; //公文字段
        this.degree = _data.degree; //密级程度
        this.urgen_level = _data.urgen_level; //紧急程度
        this.radio_data = {
          urgent_level: _data.urgen_level,
          secret_level: _data.degree,
        };
        // console.log(this.radio_data);
        if (!this.$store.state.edittext.document_arrs.hasOwnProperty("title")) {
          this.content = _data.content;
          this.red_templete = _data.red_templete;
          this.red.type = _data.type;
          if (_data.red_templete) {
            let red_ = await red_template_one({ id: _data.red_templete });
            this.red.value = [];
            this.red.value.push(red_.data);
          }
          // this.$store.commit("getredtempleteid", _data.red_templete);
          // 拿到模板之后,对应模板回填数据
          let _fields_datasone = {};
          let _fields_datastwo = {};
          let _fields = [];
          this.fields.forEach((v, i) => {
            let _key = v.e_name;
            _fields_datasone[_key] = v;
          });
          _data.get_document_fields.forEach((v, i) => {
            let _key = v.e_name;
            if (v.e_name == "received_delivery" || v.e_name == "issuer") {
              let a_rr = v.value.select.map((r) => {
                return r.name;
              });
              if (a_rr.length > 0) {
                if (v.value.text != "") {
                  v.value = a_rr.join() + "," + v.value.text;
                } else {
                  v.value = a_rr.join();
                }
              } else {
                v.value = v.value.text;
              }
            }
            _fields_datastwo[_key] = v;
          });
          for (let key in _fields_datasone) {
            // console.log(key);
            this.$set(
              _fields_datasone[key],
              "value",
              _fields_datastwo.hasOwnProperty(key)
                ? _fields_datastwo[key].value
                : _fields_datasone[key].input_type_new > 3
                ? {
                    select: [],
                    text: "",
                  }
                : ""
            );
            _fields.push(_fields_datasone[key]);
          }
          // 拿到模板之后,对应模板回填数据
          // 数据回显的时候会用到
          _fields.forEach((v, i) => {
            let _key = v.e_name;
            this.$set(v, "values", "");
            this.$set(v, "value_id", "");
            if (v.e_name == "word_no") {
              // console.log(this.isNum)
              v.value_id = this.cut == 15 ? this.isNum.id : _data.word_no_id;
              if (_data.word_no_id != null) {
                v.value = this.cut == 15 ? this.isNum.name : _data.word_name;
                if (this.cut != 15) {
                  this.setiss(_data.word_no_id, _data.word_no, _data.word_name);
                }
              }
            }
            if (typeof v.value == "number") {
              v.value_id = v.value;
              if (v.e_name == "secret_level") {
                this.degree.forEach((vv) => {
                  if (vv.id == v.value) {
                    v.value = vv.name;
                  }
                });
              }
              if (v.e_name == "urgent_level") {
                this.urgen_level.forEach((vv) => {
                  if (vv.id == v.value) {
                    v.value = vv.name;
                  }
                });
              }
            }
            if (
              (v.value != null && typeof v.value == "object") ||
              (v.e_name == "received_delivery" && v.input_type_new != 1) ||
              (v.e_name == "issuer" && v.input_type_new != 1)
            ) {
              let _textq =
                v.input_type_new == 5
                  ? "ren"
                  : v.input_type_new == 6
                  ? "bm"
                  : v.input_type_new == 7
                  ? "dw"
                  : "";
              let _value = [];
              // console.log(v);
              if (v.e_name == "reviewer") {
                v.values = v.value.select.map((e) => {
                  return {
                    receiver_name: e.name,
                    title: e.name,
                    w_id: e.id,
                    type: 500,
                    id: e.id,
                  };
                });
              } else if (v.e_name == "main_delivery") {
                v.values = v.value.select.map((e) => {
                  _value.push(_textq + e.id);
                  return {
                    doc_receiver: e.name,
                    id: e.id,
                    title: e.name,
                    w_id: _textq + e.id,
                    img: "",
                    onc: false,
                    type: 1,
                  };
                });
              } else {
                // console.log(v);
                v.values = v.value.select.map((e) => {
                  _value.push(_textq + e.id);
                  return {
                    id: e.id,
                    title: e.name,
                    w_id: _textq + e.id,
                    img: "",
                    onc: false,
                    type: 1,
                  };
                });
              }
              // 判断有没有自己输入的东西
              if (v.value.text) {
                let a_s = v.value.text.split(",");
                a_s.forEach((e) => {
                  v.values.push({
                    w_id: "lw_" + new Date().getTime(),
                    title: e,
                    type: 100,
                  });
                });
              }
              v.value = _value;
            }
            if (v.e_name == "received_wordno") {
              v.showpup = true;
            }
            if (v.e_name == "receiving_time") {
              v.value = this.timeFormate;
            }
            if (
              (v.e_name == "received_delivery" && v.input_type_new == 1) ||
              (v.e_name == "issuer" && v.input_type_new == 1)
            ) {
              v.values = [];
              let a_s = v.value.split(",");
              a_s.forEach((e) => {
                v.values.push({
                  w_id: "lw_" + new Date().getTime(),
                  title: e,
                  type: 100,
                });
              });
              v.value = v.values;
            }
            this.$set(this.fields_data, _key, v);
          });
          // if (_data.msg !== null) {
          //   sessionStorage.setItem("way", _data.msg.way);
          // }
          this.enclosure_file = [];
          _data.files_all.enclosure_file.forEach((item, index) => {
            let cardNumObj = {
              oldname: item.old_name,
              path: item.path,
              size: item.size,
            };
            this.enclosure_file.push(cardNumObj);
            sessionStorage.setItem(
              "enclosure_file",
              JSON.stringify(this.enclosure_file)
            );
          });
          // this.$store.commit("gercontentFile", this.enclosure_file);
          // if (this.fujian) {
          //   _data.files_all.enclosure_file.forEach((item, index) => {
          //     let cardNumObj = {
          //       oldname: item.old_name,
          //       path: item.path,
          //       size: item.size,
          //     };
          //     this.enclosure_file.push(cardNumObj);
          //   });
          // }
          if (this.cut == 11 || this.cut == 15) {
            this.ele.item = [];
            this.ele.item = _data.signature;
            // _data.signature.forEach((e, i) => {
            //   e.img = e.signature_img;
            //   this.ele.item = [];
            //   this.ele.item.push(e);
            // });
            let _process = {
              process: _data.process ? _data.process : "",
              process_urgent_level: _data.process_urgent_level
                ? _data.process_urgent_level
                : "",
              approval_file: _data.files_all.approval_file
                ? _data.files_all.approval_file
                : "",
              opinion: _data.opinion ? _data.opinion : "",
            };
            sessionStorage.setItem("caogao_process", JSON.stringify(_process));
          }
        }
        // console.log(this.fields_data);
      }
    },
    //调整预览的数据格式
    set_view_document_data() {
      let fls = JSON.parse(JSON.stringify(this.fields_data));
      fls.word_no.value =
        this.iss.value.length > 0 ? this.iss.value[0].word_no : "";
      // 字号
      // console.log(fls);
      // console.log(this.datas);
      this.datas.fields = fls;
      this.datas.process = this.red.value[0];
      this.datas.content = this.content;
    },
    //
    updataVuex() {
      set_vuex_data(this.type);
      this.saveeleid();
    },
    //点击下一步
    nextStep() {
      set_vuex_data(this.type);
      this.saveeleid();
      // console.log(this.$store.state.edittext);
      // this.set_init();
      if (this.required()) {
        this.$router.push({
          path: "/approval",
          query: {
            tid: this.$route.query.tid,
            type: this.$route.query.type,
            lid: this.lid, //流程id,
            fid: this.$route.query.fid,
            status: this.status,
            did: this.$route.query.distributeId,
          },
        });
      }
    },
    required() {
      let is_pass = true;
      let document_arrs = this.fields_data;
      // if (!sessionStorage.getItem("content")) {
      //   this.$toast(`请填写正文内容`);
      //   return false;
      // }
      for (const key in document_arrs) {
        if (document_arrs[key].is_must == 1) {
          if (
            (document_arrs[key].value == [] ||
              document_arrs[key].value == "") &&
            (document_arrs[key].values == [] || document_arrs[key].values == "")
          ) {
            is_pass = false;
            this.$toast(`请填写${document_arrs[key].c_name}`);
            break;
          }
        }
      }
      return is_pass;
    },
    //---------------公用按钮--------------------------
    cancel(val) {
      // console.log(val);
    },
    //  正常拟稿时通过选择的模板初始化审核和抄送人
    initProcess() {
      let _this = this;
      let _param = {
        approval_id: this.lid,
      };
      approvalBefore(_param).then((res) => {
        if (res && res.code == 1) {
          _this.process.processType = 3;
          _this.process.checked.name = res.data.explain.name;
          _this.process.checked.collect = res.data.collect;
          _this.process.checked.id = this.lid;
          //正常发文拟稿指定流程抄送人回填
          let _approval_copy = [];
          if (res.data.approval_copy) {
            //itme.type：1.上级，2：标签，3：单个成员，4：申请人，5：部门
            //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
            res.data.approval_copy.forEach((item, index) => {
              //初始化抄送人
              let _data = {
                id: item.value,
                img: item.avatar ? item.avatar : _this.headImg,
                title: item.title,
                w_id: "ren" + item.value,
                type:
                  item.type == 1
                    ? 4
                    : item.type == 2
                    ? 3
                    : item.type == 3
                    ? 2
                    : item.type == 4
                    ? 5
                    : 1,
              };
              _approval_copy.push(_data);
            });
          }
          _this.process.checkedCopy = _approval_copy;
          //    审核人回填数据
          _this.initAuditor(res.data.data);
          //  是否允许编辑
          _this.process.edit_approval = res.data.explain?.root_setting
            ? res.data.explain.root_setting.edit_approval
            : 2;
          _this.process.edit_cclist = res.data.explain.root_setting.edit_cclist;
        }
      });
    },
    //初始化审核人
    initAuditor(val) {
      let _lists = []; //选人组件中results
      let _list = []; //选人组件中result
      val.forEach((item, index) => {
        let _params = {};
        //itme.type：1.上级，2：标签，3：单个成员，4：申请人，5：部门
        //选人组件type:1.部门，2.单人，3.标签,4.上级，5、申请人，
        this.$set(
          _params,
          "type",
          item.type == 3
            ? 2
            : item.type == 5
            ? 1
            : item.type == 2
            ? 3
            : item.type == 1
            ? 4
            : 5
        );
        if (_params.type == 1 || _params.type == 3) {
          this.$set(_params, "id", item.value);
          this.$set(
            _params,
            "img",
            _params.type == 1
              ? require("@/assets/img/newImg/headImg.png")
              : _params.type == 3
              ? require("@/assets/img/newImg/headImg.png")
              : ""
          );
          this.$set(_params, "title", item.title);
          this.$set(
            _params,
            "w_id",
            (_params.type == 1 ? "bm" : _params.type == 3 ? "tag" : "") +
              item.id
          );
          this.$set(_params, "approver_type", item.approver_type);
          _list.push(_params.w_id);
        } else if (_params.type == 2) {
          item.info.forEach((items, index) => {
            this.$set(_params, "id", items.userid);
            this.$set(
              _params,
              "img",
              items.avatar ? items.avatar : this.headImg
            );
            this.$set(_params, "title", items.name);
            this.$set(_params, "w_id", "ren" + items.userid);
            this.$set(_params, "approver_type", item.approver_type);
            _list.push(_params.w_id);
          });
        } else if (_params.type == 4) {
          this.$set(_params, "id", item.value);
          this.$set(_params, "img", item.avatar ? item.avatar : this.headImg);
          this.$set(_params, "title", item.title);
          this.$set(_params, "w_id", "top" + item.value);
          this.$set(_params, "approver_type", item.approver_type);
          _list.push(_params.w_id);
        } else if (_params.type == 5) {
          this.$set(
            _params,
            "id",
            JSON.parse(sessionStorage.getItem("userInfo")).userid
          );
          this.$set(
            _params,
            "img",
            JSON.parse(sessionStorage.getItem("userInfo")).avatar
          );
          this.$set(_params, "title", item.title);
          this.$set(
            _params,
            "w_id",
            "sq" + JSON.parse(sessionStorage.getItem("userInfo")).id
          );
          this.$set(_params, "approver_type", item.approver_type);
          _list.push(_params.w_id);
        }
        _lists.push(_params);
      });
      // this.auditorList = _lists
      this.process.checkedAuditor = _lists;
    },
  },
  computed: {
    icon_img() {
      return (v) => {
        return get_file_img(v);
      };
    },
    userinfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
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
      return year + "-" + month + "-" + date;
    },
    // 修改字号接口

    get_document_arr() {
      return this.$store.state.document_arr;
    },
    img() {
      return (v) => {
        let q_base64 = "data:image/png;base64,";
        // console.log(q_base64 + v.img_data);
        return q_base64 + v.img_data;
      };
    },
    img_s() {
      return (v) => {
        let text = String(v).startsWith("http");
        let imgurl = "";
        if (text) {
          imgurl = v;
        } else {
          imgurl = HttpUrl + v;
        }
        return imgurl;
      };
    },
    isNum() {
      return this.$store.state.edittext.isss;
    },
    content: {
      get() {
        return this.$store.state.edittext.content;
      },
      set(value) {
        this.$store.state.edittext.content = value;
      },
    },
    enclosure_file: {
      get() {
        return this.$store.state.edittext.enclosure_file;
      },
      set(value) {
        this.$store.state.edittext.enclosure_file = value;
      },
    },
    fujian: {
      get() {
        return this.$store.state.edittext.fujian;
      },
      set(value) {
        this.$store.state.edittext.fujian = value;
      },
    },
    uptrue: {
      get() {
        return this.$store.state.edittext.uptrue;
      },
      set(value) {
        this.$store.state.edittext.uptrue = value;
      },
    },
    uptrues: {
      get() {
        return this.$store.state.edittext.uptrues;
      },
      set(value) {
        this.$store.state.edittext.uptrues = value;
      },
    },
    red() {
      return this.$store.state.edittext.red;
    },
    datas() {
      return this.$store.state.edittext.datas;
    },
    ele() {
      return this.$store.state.edittext.ele;
    },
    fields_data() {
      return this.$store.state.edittext.document_arrs;
    },
    fields: {
      get() {
        return this.$store.state.edittext.fields;
      },
      set(value) {
        this.$store.state.edittext.fields = value;
      },
    },
    iss() {
      return this.$store.state.edittext.iss;
    },
    process: {
      get() {
        return this.$store.state.processNew &&
          this.$store.state.processNew.process
          ? this.$store.state.processNew.process
          : {};
      },
      set(value) {
        this.$store.state.processNew.process = value;
      },
    },
  },
  created() {
    this.inits();
  },
  mounted() {
    // 加水印
    this.$setWatermark("box");
  },
  activated() {
    if (loc) {
      this.inits();
    }
    // // console.log(this.$store.state.edittext);
    // this.content = this.$store.state.edittext.content;
    // this.enclosure_file = this.$store.state.edittext.enclosure_file;
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.type == 1) {
      document.title = "发文拟稿";
    } else if (to.query.type == 2) {
      document.title = "收文拟稿";
    } else {
      document.title = "签报拟稿";
    }

    if (
      !from.name ||
      from.name == "home" ||
      from.name == "officialtep" ||
      from.name == "temporary" ||
      from.name == "dispatchBank" ||
      from.name == "prepareFile" ||
      from.name == "success" ||
      from.name == "sendingDetails" ||
      !store.state.edittext.document_arrs.hasOwnProperty("title")
    ) {
      loc = true;
    } else {
      loc = false;
    }
    if (from.name == "approval") {
      bus.$emit("show", 0);
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
.viewDocuments {
  width: 793px;
  padding: 24px;

  .close-box {
    position: fixed;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    z-index: 500;

    .cross {
      font-size: 24px;
    }
  }
}

// 预览公文样式
.infoBox {
  position: relative;
  padding: 19px;
  font-size: 12px;
  margin-bottom: 60px;

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .big-title {
    border: 1px solid #ff0000;
    color: #ff0000;
    text-align: center;
    min-height: 44px;
    line-height: 44px;
  }

  .line {
    display: flex;
    align-items: center;
    border: 1px solid #ff0000;
    border-top: none;

    .head {
      text-align: center;
      width: 86px;
    }

    .body {
      padding-left: 20px;
      border-left: 1px solid #ff0000;
    }
  }

  .fir {
    .head {
      min-height: 44px;
      line-height: 44px;
    }

    .body {
      // width: 298px;
      min-height: 44px;
      line-height: 44px;
    }
  }

  .sec {
    width: 100%;

    .item {
      display: flex;
      align-items: center;
      // width: 50%;
      max-width: 188px;
      flex: 1;

      &:first-child {
        .body {
          border-right: 1px solid #ff0000;
        }
      }

      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 86px;
        min-height: 44px;
      }

      .body {
        padding-left: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 44px;
        flex: 1;
        border-left: 1px solid #ff0000;
      }
    }
  }

  .thr {
    display: flex;
    position: relative;
    overflow: hidden;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;

    .item {
      display: flex;
      flex: 1;
      max-width: 188px;
      height: 100%;

      &:first-child {
        .body {
          border-right: 1px solid #ff0000;
        }
      }

      .head {
        display: flex;
        justify-content: center;
        padding-top: 20px;
        width: 86px;
        min-height: 86px;
      }

      .body {
        flex: 1;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: 20px 0 0 0;
        min-height: 86px;
        // width: 104px;
      }
    }
  }

  .file-text {
    margin-top: 20px;

    .head {
      text-align: center;

      h3 {
        color: #fa5555;
        padding: 10px 0;
        font-size: 20px;
        font-weight: 600;
        border-bottom: 1px solid #f56c6c;
      }
    }

    .body {
      position: relative;
    }

    .body pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/deep/ .lookDetail {
  width: 48px;
  height: 48px;
}

.box {
  font-size: 14px;
  position: relative;
  // height: 100%;
  // overflow: auto;
  .text-content {
    height: 40px;
    padding: 0 15px;

    .text-z {
      color: #909399;
      font-size: 14px;
    }

    .text-w {
      margin-left: 5px;
    }

    .ed-text {
      color: #0082ef;
      font-size: 14px;
    }
  }

  // .text-box {
  //   .text-box-content {
  //     // height: 200px;
  //   }
  // }

  .text-box-content {
    background-color: white;
    padding: 15px;

    .text-box-content-top {
      flex-wrap: wrap;

      .text-box-content-top-addfile {
        width: 40px;
        height: 40px;
        background-color: #f6f6f6;
        border-radius: 3px;
        margin-right: 24px;
        margin-bottom: 10px;

        .add-file {
          color: #0082ef;
          font-size: 18px;
        }
      }

      .two-flile {
        background-color: #dcdfe6;
        position: relative;

        .red-del {
          position: absolute;
          top: -10px;
          right: -5px;
        }

        img {
          max-width: 40px;
          max-height: 40px;
        }
      }
    }

    .text-box-content-bottom {
      height: 110px;
      margin: 10px 0;
      line-height: 28px;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 4;
      overflow: hidden;

      /deep/ * {
        max-width: 100vw;
        white-space: pre-wrap !important;
      }
    }
  }

  .upDown-box {
    .text-box-content-top-addfile {
      margin-bottom: 0 !important;
    }
  }

  .detail {
    background-color: #f9f9f9;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    margin-top: 15px;
    height: 40px;
    padding: 0 10px;

    .file-icon {
      width: 23px;
      height: 24px;
    }

    .oldName {
      padding: 0 10px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .textDetail {
      font-size: 16px;
      margin-left: 12px;

      div:nth-child(2) {
        color: #9b9b9b;
        font-size: 14px;
      }
    }
  }

  .res-template {
    margin-top: 15px;

    .input-type-cell {
      padding: 4px 12px;
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
          padding: 10px 16px !important;
          font-size: 15px;
        }

        /deep/ .van-cell::after {
          border: none;
        }
      }
    }

    .input-type-cell-bt {
      border-top: 1px solid rgba(235, 238, 245, 1);
      height: 60px;
      background-color: white;
      padding: 0 15px 0 22px;

      .coll-ection {
        margin-left: 10px;
        color: #606266;

        .coll-ection-icon {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }

      .file-del {
        margin: 0 10px;
      }

      .file-del-icon {
        width: 16px;
        height: 16px;
        margin: 0 10px;
      }
    }

    .choiseNumIcon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
      width: 25px;
      height: 25px;
    }
  }
}

.nextStep {
  padding: 0 15px;
  margin-top: 15px;
  height: 60px;
  background-color: white;
  position: relative;
  z-index: 5;
}

.upDown {
  margin-bottom: 10px;
}

.quill {
  height: 100vh;
  background-color: #fff;
  position: relative;

  .qui-ll {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    background-color: pink;
    z-index: 11;
  }

  .quill-top {
    height: calc(100% - 44px - 57px - 40px);
    overflow-y: auto;
    position: relative;
    top: 40px;

    .elesign-top {
      position: relative;
      // min-height: 100px;
      // background-color: violet;
      padding: 0 20px 20px;
      display: flex;
      flex-wrap: wrap;

      .elesign-top-box {
        width: 96px;
        height: 96px;
        margin: 20px 13px 0;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 230, 230, 1);
        position: relative;

        img {
          max-width: 90px;
          max-height: 90px;
        }

        .close-icons {
          top: -10px;
          right: -10px;
          position: absolute;
          height: 20px;
          width: 20px;
          color: white;
          background-color: #e6e6e6;
          border-radius: 50%;
        }
      }
    }
  }

  .quill-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

/deep/ .quill-editor {
  position: relative;
  left: 0;
  right: 0;

  .ql-toolbar {
    z-index: 1;
    border: none;
    background-color: #f4f5f6;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  .ql-container {
    border: none;
  }

  .ql-editor {
    overflow-y: visible;
    min-height: calc(100vh - 141px);
    height: auto;
  }
}

/* 添加浮动的 新增按钮 */
.newlyadded {
  position: fixed;
  right: 10px;
  bottom: 25%;
  z-index: 99;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #0082ef;
  padding: 2px;
}

.newlyadded div {
  display: block;
  font-size: 12px;
  color: #0082ef;
}

/* 添加浮动的 新增按钮  */
/deep/ .van-field__label {
  width: 100px !important;
}

.choise-box {
  position: relative;
  z-index: 6;

  .docInfo {
    padding: 0 12px;
    line-height: 40px;
    background: #f8f8f8;
  }
}
</style>
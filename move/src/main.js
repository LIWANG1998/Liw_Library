import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "lib-flexible";
import "font-awesome/css/font-awesome.min.css";
import "@/icons"; //注入图标
import md5 from "js-md5";


// 富文本框
import VueHtml5Editor from 'vue-html5-editor';
import options from '@/js/h5_editor';
Vue.use(VueHtml5Editor,options);
// 富文本框

// import Vconsole from "vconsole";
// new Vconsole();
Vue.prototype.$md5 = md5;
Vue.prototype.$axios = axios;

import "./css/pulic.css";
import "@/utils/derective.js";
import VueWechatTitle from "vue-wechat-title";
router.beforeEach((to, from, next) => {
  if (to.path == "/setToken") {
    next();
  } else {
    if (to.meta.title) {
      document.title = to.meta.title;
      next();
    }
  }
});

import VueQuillEditor from "vue-quill-editor";
// 加水印
import { setWatermark } from "@/utils/utils";
Vue.prototype.$setWatermark = setWatermark;
//html转pdf
import htmlToPdf from "@/js/use_pdf";
Vue.use(htmlToPdf);

// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "./styles/weui.css";
//文件对比
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/merge/merge.js";
import "codemirror/addon/merge/merge.css";
import DiffMatchPatch from "diff-match-patch";
window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;
Vue.prototype.$CodeMirror = CodeMirror;
const $bus = new Vue();
Vue.prototype.$bus = $bus;

// 使用签名组件
import vueEsign from "vue-esign";
Vue.use(vueEsign);

// end
Vue.use(VueQuillEditor, {
  placeholder: "请输入内容",
});
import {
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Lazyload,
  Image,
  Icon,
  Tab,
  Tabs,
  List,
  PullRefresh,
  Cell,
  CellGroup,
  Dialog,
  Field,
  Search,
  Collapse,
  CollapseItem,
  Popup,
  DatetimePicker,
  Picker,
  Checkbox,
  CheckboxGroup,
  Divider,
  Radio,
  RadioGroup,
  Uploader,
  ImagePreview,
  NoticeBar,
  Swipe,
  SwipeItem,
  TreeSelect,
  Pagination,
  Toast,
  Step,
  Steps,
  Progress,
  Col,
  Row,
  ActionSheet,
  DropdownMenu,
  DropdownItem,
  Form,
  Notify,
  Rate,
  Tag,
  Overlay,
  SwipeCell,
} from "vant";
Vue.config.productionTip = false;
Vue.use(Button)
  .use(NavBar)
  .use(TabbarItem)
  .use(Tabbar)
  .use(Lazyload)
  .use(Image)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)
  .use(Cell)
  .use(CellGroup)
  .use(Dialog)
  .use(Field)
  .use(Search)
  .use(Collapse)
  .use(CollapseItem)
  .use(Popup)
  .use(DatetimePicker)
  .use(Picker)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(Divider)
  .use(RadioGroup)
  .use(Radio)
  .use(Uploader)
  .use(ImagePreview)
  .use(NoticeBar)
  .use(Swipe)
  .use(SwipeItem)
  .use(Notify)
  .use(Form)
  .use(Tag)
  .use(Overlay).use(SwipeCell);
Vue.use(Rate);
Vue.use(TreeSelect);
Vue.use(Pagination);
Vue.use(Toast);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Progress);
Vue.use(Col);
Vue.use(Row);
Vue.use(ActionSheet);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.prototype.$notify = Notify;
Vue.prototype.$dialog = Dialog;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import bus from "./utils/bus";
import "lib-flexible";
import router from "./router";
import "vant/lib/index.less";
import "./assets/theme/sprite.less";
import * as filters from "./filters/index";
import Vuex from 'vuex';
import  '@/utils/directives';
import download from './components/download';
import VueAnimateNumber from 'vue-animate-number';
import './icons'


import {
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  PullRefresh,
  List,
  CellGroup,
  Cell,
  Skeleton,
  Col,
  Row,
  Tag,
  Image,
  Search,
  Dialog,
  Swipe,
  SwipeItem,
  Icon,
  Button,
  Notify,
  Step,
  Steps,
  Form,
  Field,
  Area,
  Popup,
  Picker,
  Calendar,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Sticky,
  Uploader,
  Toast,
  Switch,
  Empty
} from "vant";


Vue.use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(PullRefresh);
Vue.use(List)
  .use(Cell)
  .use(Skeleton)
  .use(Col)
  .use(Row)
  .use(Tag);
Vue.use(Image)
  .use(Search)
  .use(Dialog)
  .use(Swipe)
  .use(SwipeItem);
Vue.use(Icon)
  .use(Button)
  .use(Notify)
  .use(Step)
  .use(Steps)
  .use(Popup);
Vue.use(Form)
  .use(Field)
  .use(Area)
  .use(Picker);
Vue.use(Calendar)
  .use(RadioGroup)
  .use(Radio)
  .use(CellGroup);
Vue.use(CheckboxGroup)
  .use(Checkbox)
  .use(Sticky)
  .use(Uploader)
  .use(Toast);
Vue.use(Switch).use(Empty);
Vue.use(bus);

Vue.use(Vuex);

Vue.use(download);
Vue.use(VueAnimateNumber)

Vue.config.productionTip = false;
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import Vue from 'vue'
import App from './App.vue'
import router from '@/router' // 路由
import VueJsonp from 'vue-jsonp';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/assets/css/common.css'
import '@/assets/font/iconfont.css'
import VueCountUp from 'vue-countupjs'
import loading from '@/assets/js/loading.js' // 引入loading

Vue.config.productionTip = false;

Vue.use(VueJsonp);
Vue.use(Antd);
Vue.use(VueCountUp);
Vue.use(loading);// 全局使用loading

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'watchStorage') {
      // 创建一个StorageEvent事件
      var newStorageEvent = document.createEvent('StorageEvent');
      const storage = {
          setItem: function (k, val) {
              sessionStorage.setItem(k, val);

              // 初始化创建的事件
              newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

              // 派发对象
              window.dispatchEvent(newStorageEvent)
          }
      }
      return storage.setItem(key, newVal);
  }
}

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;
if (!Object.entries) {
    Object.entries = function entries(O) {
        return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
    };
}
import axios from "axios";
import { Toast } from "vant";
import vue from "vue";
import router from "../router";
import store from "../store/index";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://lotus.mgtx-tech-dev.mgtx.com.cn"
    : window.location.protocol + "//" + window.location.host;
const baseURLhd = window.location.protocol + "//" + window.location.host;
// console.log(baseURL);
vue.prototype.$axios = axios;
const server = axios.create({
  baseURL: baseURL,
  // baseURL: baseURL,
  headers: {
    token: sessionStorage.getItem("token"),
  },
  // baseURL: "http://192.168.8.27", //韩杰
  // baseURL: 'http://192.168.8.141',//张同明
  //    baseURL:baseURLhd
});

//全局加载提示
let toast = null;
let time = null;

let route_obj = {};

// 添加请求拦截器
server.interceptors.request.use(
  (config) => {
    //为请求头对象，添加token验证的Authorization字段
    config.headers.token = sessionStorage.getItem("token");
    if (!route_obj[router.app._route.name]) {
      toast = Toast.loading({
        forbidClick: true,
        message: "加载中",
        duration: 5000,
      });
      store.commit("SET_OVERLAY", true);
      clearTimeout(time);
      time = null;
      time = setTimeout(() => {
        toast = Toast.fail({
          forbidClick: true,
          message: "服务器请求失败...",
        });
        store.commit("SET_OVERLAY", false);
      }, 5000);
    }

    return config;
    // 在发送请求之前做些什么
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
server.interceptors.response.use(
  (response) => {
    if (!route_obj[router.app._route.name]) {
      route_obj[router.app._route.name] = true;
      clearTimeout(time);
      time = null;
      store.commit("SET_OVERLAY", false);
      Toast.clear();
    }
    // 对响应数据做点什么
    const code = response.status;

    if (code < 200 || code > 300) {
      return Promise.reject("error");
    } else {
      switch (response?.data?.code) {
        case 0:
          break;
        case 1001:
          Toast.fail("参数格式不正确");
          break;
        case 1002:
          Toast.fail("参数不能为空");
          break;
        case 1003:
          Toast.fail("参数格式不正确");
          break;
        case 100:
          // Toast.fail("您的权限不足，详情请咨询超级管理员");
          store.commit("set_show_auth", true);
          break;
      }

      return response.data;
    }
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default server;

import axios from 'axios'
import { message } from 'ant-design-vue';
// import { getToken } from '../cache'
import RESTFUL_ERROR_CODE_MAP from './restful_error_code'
import qs from "qs";

function errorReport(url, error, requestOptions, response) {
  if (window.$sentry) {
    const errorInfo = {
      error: typeof error === 'string' ? new Error(error) : error,
      type: 'request',
      requestUrl: url,
      requestOptions: JSON.stringify(requestOptions)
    }

    if (response) {
      errorInfo.response = JSON.stringify(response)
    }

    window.$sentry.log(errorInfo)
  }
}
const DEFAULT_OPTIONS = {
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: process.env.NODE_ENV === 'development' ? '/api/' : "",//本地代理
  timeout: 300000,
  headers: {
    timestamp: new Date().getTime(),
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Account': "wwa0b0b8a275ac94b8_ant",
    "x-requested-with": "XMLHttpRequest"
  }
}

const responseLog = (response) => {
  if (process.env.NODE_ENV === 'development') {
    const randomColor = `rgba(${Math.round(Math.random() * 255)},${Math.round(
      Math.random() * 255
    )},${Math.round(Math.random() * 255)})`
    console.log(
      '%c┍------------------------------------------------------------------┑',
      `color:${randomColor};`
    )
    console.log('| 请求地址：', response.config.url)
    console.log('| 请求参数：', response.config.data ? qs.parse(response.config.data) : {})
    console.log('| 返回数据：', response.data)
    console.log(
      '%c┕------------------------------------------------------------------┙',
      `color:${randomColor};`
    )
  }
}

const instance = axios.create(DEFAULT_OPTIONS)

instance.interceptors.request.use(
  (config) => {
    // if (sessionStorage.getItem('userInfo') && JSON.parse(sessionStorage.getItem('userInfo').corpid)) {
    //   config.headers['corpid'] =JSON.parse(sessionStorage.getItem('userInfo').corpid)
    // }
    return config
  },
  (error) => {
    // Toast.clear()
    Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    responseLog(response)
    const code = response.data.code
    const msg = RESTFUL_ERROR_CODE_MAP[code];
    if (code == 401) {
      let IS_WECHAT = /MicroMessenger/i.test(navigator.userAgent);
      if (response.data['is_wx3']) {
        let href_hex = location.href.split("").map(function (item) { return item.charCodeAt().toString(16) }).join("");
        window.location.href = response.data['login_url'] + href_hex;
      } else {
          if (IS_WECHAT) {
              location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + response.data['appid'] + "&redirect_uri=http://" + location.host + "/admin/public_login/pc_wxwork_login.html&response_type=code&scope=SCOPE&state=" + encodeURIComponent(location.href) + "#wechat_redirect";
          } else {
              setTimeout(function () { location.href = "/structure/Login/wxwork_login_href"; }, 600);
          }
      }
      return;
    }
    if (msg) {
      message.error({
        maxCount: 1,
        content: response.data.message || msg
      });
      return Promise.reject(new Error(response.data.message || msg))
    } else {
      return response
    }
  },
  (thrown) => {
    let code = thrown.message.replace(/[^0-9]/ig, "");
    // window.location.href = "/structure/Login/wxwork_login_href";
    message.error({
      maxCount: 1,
      content: RESTFUL_ERROR_CODE_MAP[code]
    });
    setTimeout(() => {
    }, 1000)
    return Promise.reject(thrown)
  }
)

export default async function (options) {
  const {
    url
  } = options
  const requestOptions = Object.assign({}, options)
  try {
    const {
      data,
      data: {
        errno,
        errmsg
      }
    } = await instance.request(requestOptions)
    if (errno) {
      errorReport(url, errmsg, requestOptions, data)
      throw new Error(errmsg)
    }
    return data
  } catch (err) {
    errorReport(url, err, requestOptions)
    throw err
  }
}

// 防抖 delay可以给默认值
export function debouce(func, delay = 50) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function formatDate(date, fmt) {
  //   1.获取年份
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  // 2.获取
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}
export const url =
  // 'http://192.168.8.141';//张同明
  // "http://192.168.8.27"; //韩杰
  process.env.NODE_ENV === "development"
    ? "http://lotus.mgtx-tech-dev.mgtx.com.cn"
    : window.location.protocol + "//" + window.location.host;

export function screenHeight(num) {
  let h =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return h - num;
}

// 加水印
import watermark from "@/js/watermark.js";
import { get_watermark } from "@/api/home.js";
export async function setWatermark(elt) {
  // 调用shui
  let a = await get_watermark();
  if (a.code == 1) {
    watermark.set(a.data, elt);
  }
}

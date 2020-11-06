import {
  common
} from "@/api";
export const initPlatform = () => {
  const UA = navigator.userAgent
  const info = UA.match(/\s{1}DSBRIDGE[\w\.]+$/g)
  if (info && info.length > 0) {
    const infoArray = info[0].split('_')
    window.$appVersion = infoArray[1]
    window.$systemVersion = infoArray[2]
    window.$platform = infoArray[3]
  } else {
    window.$appVersion = undefined
    window.$systemVersion = undefined
    window.$platform = 'browser'
  }
}

export const createRandomNum = (n) => {
  let rnd = ''
  for (let i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10)
  }
  return parseInt(rnd, 10)
}

export function get(object, path) {
  const keys = path.split('.')
  let result = object

  keys.forEach(key => {
    result = result[key] ? result[key] : ''
  })

  return result
}

export function judgeType(obj) {
  // tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
}
export function deepClone(data) {
  const type = judgeType(data);
  let obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    // 对原型上的方法也拷贝了....
    for (const key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
export function isImageUrl(url) {
  return IMAGE_REGEXP.test(url);
}

function createImg(url, warterMark, isCloud, host) {
  if (isCloud) {
    url = `${host}${url}`;
  }
  let time = new Date();
  let year = time.getFullYear() + "年";
  let month = parseInt(time.getMonth()) + 1 + "月";
  let day = time.getDate() + "日";
  let hour = time.getHours() + ":";
  let min = time.getMinutes();
  let nowTime = year + month + day + " " + hour + min;
  let img = new Image();
  img.src = url;
  img.setAttribute("crossorigin", "crossorigin");
  return new Promise((resolve, reject) => {
    img.onload = () => {
      var canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500 / img.width * img.height;
      var ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      for (var i = 0; i < 120; i++) {
        ctx.rotate((-45 * Math.PI) / 180); // 水印初始偏转角度
        for (var j = 0; j < 10; j++) {
          ctx.textAlign = "left";
          ctx.textBaseline = "Middle";
          ctx.font = "14px microsoft yahei";
          ctx.fillStyle = "rgba(180,180,180,0.5)";
          ctx.fillText(warterMark, (j * 260) - 600, i * 100);
        }
        ctx.rotate((45 * Math.PI) / 180); // 把水印偏转角度调整为原来的，不然他会一直转
      }
      console.log(canvas.toDataURL())
      resolve(canvas.toDataURL());
    }
  })
}
/**
 *
 *
 * @param {*} imgUrl
 * @param {*} warterMark
 * @param {*} isCloud//是否是云盘数据
 * @returns
 */
async function previewImg(imgUrl, warterMark, isCloud, host) {
  if (isCloud) {
    const {
      data: {
        url
      },
      code
    } = await common.downLoadRemoteImg({
      url: imgUrl
    });
    if (code) {
      return await createImg(url, warterMark, isCloud, host);
    } else {
      return false;
    }
  }
  return await createImg(imgUrl, warterMark, isCloud, host);
}

export {
  previewImg
}

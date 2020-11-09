export const checkDev = (name, qurey) => {
  let ua = navigator.userAgent.toLocaleLowerCase();
  let pf = navigator.platform.toLocaleLowerCase();
  let isAndroid = (/android/i).test(ua) || ((/iPhone|iPod|iPad/i).test(ua) && (/linux/i).test(pf)) ||
    (/ucweb.*linux/i.test(ua));
  let isIOS = (/iPhone|iPod|iPad/i).test(ua) && !isAndroid;
  let isWinPhone = (/Windows Phone|ZuneWP7/i).test(ua);
  let mobileRoutes = {
    home: "/index",
    execute: "/execute",
    finish: "/finish",
    add: "/add",
    draft: '/draft',
    statis: '/statistics',
    allTask: '/my/taskList',
    report: "/report",
    chartInfo: '/statistics/chart/info',
    chartInfoList: '/statistics/chart/infoList',
    info: '/info',
    edit: '/edit',
    about: '/about'
  };
  // console.log(mobileRoutes)
  const host='/m/dist/#';
  
  if (isAndroid || isIOS || isWinPhone) {
    if (mobileRoutes[name]) {
      if (Object.keys(qurey).length > 0) {
        console.log(urlEncode(qurey));
        location.href = host + mobileRoutes[name] + "?" + urlEncode(qurey).substr(1);
      } else {
        location.href = host + mobileRoutes[name];
      }
    } else {
      location.href = host;
    }
  }
}

export function urlEncode(param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}

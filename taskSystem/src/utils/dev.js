export const checkPc = (name, qurey) => {
  console.log()
  let ua = navigator.userAgent.toLocaleLowerCase();
  let pf = navigator.platform.toLocaleLowerCase();
  let isAndroid = (/android/i).test(ua) || ((/iPhone|iPod|iPad/i).test(ua) && (/linux/i).test(pf)) ||
    (/ucweb.*linux/i.test(ua));
  let isIOS = (/iPhone|iPod|iPad/i).test(ua) && !isAndroid;
  let isWinPhone = (/Windows Phone|ZuneWP7/i).test(ua);
  let pcRoutes = {
    home: "/home",
    execute: "/taskList/executing",
    finish: "/taskList/finished",
    add: "/taskDetail/addTask",
    draft: '/taskList/drafts',
    statis: '/dataSta/rankingList',
    allTask: '/taskList/allTask',
    report: "/dataSta/monthlyReport",
    chartInfo: '/dataSta/rankDetail',
    chartInfoList: '/dataSta/rankTaskDetail',
    info: '/taskDetail/taskDetail',
    edit: '/taskDetail/editTask',
    about: '/homePage/taskUs'
  };
  const host='/pcnew/dist/#'
  if (!isAndroid && !isIOS && !isWinPhone) {
    if (pcRoutes[name]) {
      if (Object.keys(qurey).length > 0) {
        location.href = host + pcRoutes[name] + "?" + urlEncode(qurey).substr(1);
      } else {
        location.href = host + pcRoutes[name];
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
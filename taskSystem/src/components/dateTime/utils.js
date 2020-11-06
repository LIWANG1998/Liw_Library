import {isNaN} from "@/utils/validate/number"
let moment = require("moment");
moment.locale("zh-cn"); //汉化

export function times(n, iteratee,type,minDate) {
  var index = -1;
  var result = Array(n);

  if(type==="year") {
    while (++index < n) {
      result[index] = moment(minDate).add(index, 'days').format("YYYY年M月D日")
    }
  } else {
    while (++index < n) {
      result[index] = iteratee(index);
    }
  }

  return result;
}

export function getTrueValue(value) {
  if (!value) {
    return 0;
  }

  while (isNaN(parseInt(value, 10))) {
    if (value.length > 1) {
      value = value.slice(1);
    } else {
      return 0;
    }
  }

  return parseInt(value, 10);
}

export function getMonthEndDay(year, month) {
  return 32 - new Date(year, month - 1, 32).getDate();
}
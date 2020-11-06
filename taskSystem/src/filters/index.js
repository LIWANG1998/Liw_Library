let moment = require("moment");
moment.locale("zh-cn"); //汉化
/**
 * date1 开始时间
 * 格式化
 * item 数据列
 */
const timeFormat = (date1, format, item, type) => {
  if (item) {
    let date2 = item.end_time;
    let finish = item.finish_time
      ? moment(item.finish_time)
      : moment(new Date());
    let totalDay = calcDiffDay(date1, date2);
    let diffDay = item.status == (2 || 3) ? calcDiffDay(finish, date2) : calcDiffDay(new Date(), date2);
    let outDay = calcDiffDay(date2, new Date());
    let text = "";
    if (item.status == 0 || item.status == 1) {
      if (moment(date1).isAfter(moment(new Date()))) {
        text = `共${totalDay}天`
      } else {
        text = `剩余${diffDay}天`
      }
      if (moment(date2).isBefore(moment(new Date()))) {
        text = `逾期${outDay}天`;
      }
    }
    if (item.status == 2 || item.status == 3) {
      if (moment(finish).isAfter(moment(new Date()))) {
        text = `共${totalDay}天 逾期${outDay}天`;
      }
      text = `共${totalDay}天 ${text}`;
    }
    if (type == "drafts") {
      return `${moment(date1).format(format)}-${moment(date2).format(format)} 共${totalDay}天`;
    }
    return `${moment(date1).format(format)}-${moment(date2).format(format)} ${text}`;
  } else {
    return moment(date1).format(format);
  }
};

// 计算时间差
function calcDiffDay(date1, date2) {
  let diffday = moment(date2).diff(moment(date1), "days");
  return Math.abs(Math.floor(diffday * 10) / 10)
}
export {
  timeFormat
};

const nowDate = new Date();
const nowYear = nowDate.getFullYear();
const nowMonth = nowDate.getMonth() + 1;
const getYears = () => {
  let years = [];
  for (let i = 0; i <= 10; i++) {
    years.push(nowYear - i + "年");
  }
  return years;
}

const getMonths = (year) => {
  let endMonth = 12;
  if (year == nowYear) {
      endMonth = nowMonth;
  }
    let months = [];
  for (let i = endMonth; i > 0; i--) {
    months.push(i + "月");
  }
  return months;
}

export {
  getYears,
  getMonths,
}

import { getMonthEndDay} from "./utils";

export function getBoundary(type, value, Date) {
  const boundary = Date;
  const year = boundary.getFullYear();
  let month = 1;
  let date = 1;
  let hour = 0;
  let minute = 0;
  if (type === "max") {
    month = 12;
    date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
    hour = 23;
    minute = 59;
  }
  if (value.getFullYear() === year) {
    month = boundary.getMonth() + 1;
    if (value.getMonth() + 1 === month) {
      date = boundary.getDate();
      if (value.getDate() === date) {
        hour = boundary.getHours();
        if (value.getHours() === hour) {
          minute = boundary.getMinutes();
        }
      }
    }
  }
  return {
    [`${type}Year`]: year,
    [`${type}Month`]: month,
    [`${type}Date`]: date,
    [`${type}Hour`]: hour,
    [`${type}Minute`]: minute
  };
}

export function getRange(value,min,max){
  const {
    maxYear,
    maxDate,
    maxMonth,
    maxHour,
    maxMinute
  } =getBoundary("max", value, max);

  const {
    minYear,
    minDate,
    minMonth,
    minHour,
    minMinute
  } = getBoundary("min", value,min);


  let result = [
    {
      type: "year",
      range: [min, max]
    },
    {
      type: "hour",
      range: [minHour, maxHour]
    },
    {
      type: "minute",
      range: [minMinute, maxMinute]
    }
  ];
  return result;
}

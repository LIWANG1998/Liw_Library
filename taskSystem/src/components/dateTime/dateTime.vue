<template>
  <van-picker
    ref="picker"
    show-toolbar
    :columns="columns"
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="onChange"
  />
</template>
<script>
//引入日期格式工具
let moment = require("moment");
moment.locale("zh-cn"); //汉化

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
import { times, getMonthEndDay, getTrueValue } from "./utils";
import { getBoundary, getRange } from "./dateTime";

export default {
  name: "DateTime",
  props: {
    type: {
      type: String,
      default: "datetime"
    },
    minDate: {
      type: Date,
      default: () => new Date(currentYear - 10, 0, 1)
    },
    maxDate: {
      type: Date,
      default: () =>
        moment(currentDate)
          .add("6", "months")
          .toDate()
    },
    value: {
      type: Date,
      default: new Date()
    }
  },
  data() {
    return {
      selectData: [],
      innerValue: this.formatValue(this.value)
    };
  },
  computed: {
    ranges() {
      return getRange(this.value, this.minDate, this.maxDate);
    },
    originColumns() {
      let min = this.minDate;
      return this.ranges.map(({ type, range: rangeArr }) => {
        let n = rangeArr[1] - rangeArr[0] + 1;
        if (type === "year") {
          n = moment(rangeArr[1]).diff(moment(rangeArr[0]), "days");
        }
        let values = times(
          n,
          index => {
            let value = rangeArr[0] + index;
            return `${value}${
              type == "hour" ? "时" : type == "minute" ? "分" : ""
            }`;
          },
          type,
          min
        );
        return {
          type,
          values
        };
      });
    },

    columns() {
      return this.originColumns.map(column => ({
        values: column.values
      }));
    }
  },
  watch: {
    columns: "updateColumnValue",
    minDate: "updateInnerValue",
    maxDate: "updateInnerValue",
    value(val) {
      val = this.formatValue(val);
      if (val.valueOf() !== this.innerValue.valueOf()) {
        this.innerValue = val;
      }
      this.selectData = new Array();
      this.selectData.push(
        moment(val).format("YYYY年M月D日"),
        `${val.getHours()}时`,
        `${val.getMinutes()}分`
      );
    },
    innerValue(val) {
      this.$emit("input", val);
    }
  },
  created() {
    this.selectData = new Array();
    this.selectData.push(
      moment(this.value).format("YYYY年M月D日"),
      `${this.value.getHours()}时`,
      `${this.value.getMinutes()}分`
    );
  },
  mounted() {
    this.updateColumnValue();
    this.$nextTick(() => {
      this.updateInnerValue();
    });
  },
  methods: {
    getPicker() {
      return this.$refs.picker;
    },
    formatValue(value) {
      value = Math.max(value, this.minDate.getTime());
      value = Math.min(value, this.maxDate.getTime());
      return new Date(value);
    },
    formatter(type, value) {
      return value;
    },
    formatDate() {
      if (this.selectData.length == 0) {
        this.selectData.push(
          this.columns[0].values[0],
          this.columns[1].values[0],
          this.columns[2].values[0]
        );
      }
      let formatYear = this.selectData[0]
        .replace("年", "-")
        .replace("月", "-")
        .replace("日", "");
      let dateArr = formatYear.split("-");
      let year = dateArr[0];
      let month = dateArr[1] < 10 ? `0${dateArr[1]}` : dateArr[1];
      let day = dateArr[2] < 10 ? `0${dateArr[2]}` : dateArr[2];
      let hour = this.selectData[1].replace("时", "");
      let min = this.selectData[2].replace("分", "");
      hour = hour < 10 ? `0${hour}` : hour;
      min = min < 10 ? `0${min}` : min;
      return {
        date: moment(`${year}-${month}-${day} ${hour}:${min}`).toDate(),
        selectData: this.selectData
      };
    },
    // 获取边界值

    updateInnerValue() {
      const value = this.formatDate();
      this.innerValue = this.formatValue(value.date);
    },
    updateColumnValue() {
      const value = this.formatDate();
      const { formatter } = this;
      let values = [
        formatter("year", value.selectData[0]),
        formatter("hour", value.selectData[1]),
        formatter("minute", value.selectData[2])
      ];
      this.$nextTick(() => {
        this.getPicker().setValues(values);
      });
    },
    onConfirm() {
      this.$emit("confirm", this.formatDate());
    },
    onCancel() {
      this.$emit("cancel");
    },
    onChange(el, date, index) {
      this.selectData = date;
      this.$nextTick(() => {
        this.updateInnerValue();
      });
    }
  }
};
</script>
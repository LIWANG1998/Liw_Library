<template>
  <div>
    <div ref="chart2" id="c1" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import { Chart, Util } from "@antv/g2";
// import echarts from "echarts";
export default {
  data() {
    return {
        
    };
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    type: { type: Number, default: () => 0 },
  },
  methods: {
    renderView1() {
      const chart = new Chart({
        container: "c1", // 指定图表容器 ID
        width: 600, // 指定图表宽度
        height: 400, // 指定图表高度
      });
      chart.data(this.data);
      chart.scale("value", {
        nice: true,
      });
      chart.tooltip({
        showMarkers: false,
        shared: true,
      });

      chart
        .interval()
        .position("mouth*value")
        .color("name", ["#face1d", "#37c461"]) //颜色的区别属性和颜色的数组
        .adjust([
          {
            type: "dodge",
            marginRatio: 0,
          },
        ]);

      chart.interaction("active-region");

      chart.render();
    },

    // renderView4() {
    //   let myChart = echarts.init(this.$refs.chart2);
    //   //   var total = 10000; // 数据总数
    //   var datas = [];
    //   this.data.forEach((value) => {
    //     datas.push(value.value);
    //   });
    //
    //   myChart.setOption({
    //     backgroundColor: "#071347",
    //     xAxis: {
    //       //   max: total,
    //       splitLine: {
    //         show: false,
    //       },
    //       axisLine: {
    //         show: false,
    //       },
    //       axisLabel: {
    //         show: false,
    //       },
    //       axisTick: {
    //         show: false,
    //       },
    //     },
    //     grid: {
    //       left: 80,
    //       top: 20, // 设置条形图的边距
    //       right: 80,
    //       bottom: 20,
    //     },
    //     yAxis: [
    //       {
    //         type: "category",
    //         inverse: false,
    //         data: this.data,
    //         axisLine: {
    //           show: false,
    //         },
    //         axisTick: {
    //           show: false,
    //         },
    //         axisLabel: {
    //           show: false,
    //         },
    //       },
    //     ],
    //     series: [
    //       {
    //         // 内
    //         type: "bar",
    //         barWidth: 18,
    //         legendHoverLink: false,
    //         silent: true,
    //         itemStyle: {
    //           normal: {
    //             color: {
    //               type: "linear",
    //               x: 0,
    //               y: 0,
    //               x2: 1,
    //               y2: 0,
    //               colorStops: [
    //                 {
    //                   offset: 0,
    //                   color: "#faf", // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 1,
    //                   color: "#faa", // 100% 处的颜色
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //         label: {
    //           normal: {
    //             show: true,
    //             position: "left",
    //             formatter: "{b}",
    //             textStyle: {
    //               color: "#fff",
    //               fontSize: 14,
    //             },
    //           },
    //         },
    //         data: this.data,
    //         z: 1,
    //         animationEasing: "elasticOut",
    //       },
    //       {
    //         // 分隔
    //         type: "pictorialBar",
    //         itemStyle: {
    //           normal: {
    //             color: "#061348",
    //           },
    //         },
    //         symbolRepeat: "fixed",
    //         symbolMargin: 6,
    //         symbol: "rect",
    //         symbolClip: true,
    //         symbolSize: [1, 21],
    //         symbolPosition: "start",
    //         symbolOffset: [1, -1],
    //         // symbolBoundingData: this.total,
    //         data: this.data,
    //         z: 2,
    //         animationEasing: "elasticOut",
    //       },
    //       {
    //         // 外边框
    //         type: "pictorialBar",
    //         symbol: "rect",
    //         // symbolBoundingData: total,
    //         itemStyle: {
    //           normal: {
    //             color: "none",
    //           },
    //         },
    //         label: {
    //           normal: {
    //             formatter: (params) => {
    //               var text;
    //               if (params.dataIndex == 1) {
    //                 text = "{f|  " + params.data + "}";
    //               } else if (params.dataIndex == 2) {
    //                 text = "{f|  " + params.data + "}";
    //               } else if (params.dataIndex == 3) {
    //                 text = "{f|  " + params.data + "}";
    //               } else {
    //                 text = "{f|  " + params.data + "}";
    //               }
    //               return text;
    //             },
    //             rich: {
    //               a: {
    //                 color: "red",
    //               },
    //               b: {
    //                 color: "blue",
    //               },
    //               c: {
    //                 color: "yellow",
    //               },
    //               d: {
    //                 color: "green",
    //               },
    //               f: {
    //                 color: "#ffffff",
    //               },
    //             },
    //             position: "right",
    //             distance: 0, // 向右偏移位置
    //             show: true,
    //           },
    //         },
    //         data: datas,
    //         z: 0,
    //         animationEasing: "elasticOut",
    //       },
    //       {
    //         name: "外框",
    //         type: "bar",
    //         barGap: "-120%", // 设置外框粗细
    //         barWidth: 25,
    //         itemStyle: {
    //           normal: {
    //             color: "transparent", // 填充色
    //             barBorderColor: "#1C4B8E", // 边框色
    //             barBorderWidth: 1, // 边框宽度
    //             // barBorderRadius: 0, //圆角半径
    //             label: {
    //               // 标签显示位置
    //               show: false,
    //               position: "top", // insideTop 或者横向的 insideLeft
    //             },
    //           },
    //         },
    //         z: 0,
    //       },
    //     ],
    //   });
    // },

    renderView3() {
      const chart = new Chart({
        container: "c1",
        autoFit: true,
        height: 500,
      });
      chart.data(this.data);
      chart.coordinate("theta", {
        radius: 0.75,
      });
      chart.tooltip({
        showMarkers: false,
      });
      chart
        .interval()
        .adjust("stack")
        .position("value")
        .color("type", ["#063d8a", "#1770d6", "#47abfc", "#38c060"])
        .style({ opacity: 0.4 })
        .state({
          active: {
            style: (element) => {
              const shape = element.shape;
              return {
                matrix: Util.zoom(shape, 1.1),
              };
            },
          },
        })
        .label("type", (val) => {
          const opacity = val === "四线及以下" ? 1 : 0.5;
          return {
            offset: -30,
            style: {
              opacity,
              fill: "white",
              fontSize: 12,
              shadowBlur: 2,
              shadowColor: "rgba(0, 0, 0, .45)",
            },
            content: (obj) => {
              return obj.type + "\n" + obj.value + "%";
            },
          };
        });

      chart.interaction("element-single-selected");

      chart.render();
    },

    renderView2() {
      const chart = new Chart({
        container: "c1",
        autoFit: true,
        height: 500,
        padding: [20, 0, 50, 100],
      });
      chart.data(this.data);
      console.log(this.data)
      chart.scale({
        // value: {
        //   max: 55000,
        //   min: 0,
        //   alias: "金额（元）",
        // },
      });
      chart.axis("type", {
        tickLine: null,
        line: null,
      });
      chart.axis("value", {
        label: null,
        title: {
          offset: 30,
          style: {
            fontWeight: 300,
          },
        },
        grid: null,
      });
      chart.legend(false);
      chart.coordinate("rect").transpose(); //坐标轴类型
      chart
        .interval()
        .position("type*value")
        .color("cat", ["#face1d", "#37c461", "#2194ff"])
        .size(16)
        .label("value", {
          style: {
            fill: "#8d8d8d",
          },
          offset: 10,
          content: (originData) => {
            //内容文字转换
            return (originData.value + "").replace(
              /(\d)(?=(?:\d{3})+$)/g,
              "$1,"
            );
          },
        });
      //  chart.annotation().text({
      //     top: true,
      //     position: ["书架14", "min"],
      //     content: "家具",
      //     style: {
      //       fill: "#c0c0c0",
      //       fontSize: 12,
      //       fontWeight: "300",
      //       textAlign: "center",
      //     },
      //     offsetX: -70,
      //     rotate: Math.PI * -0.5,
      //   });
      //   chart.annotation().text({
      //     top: true,
      //     position: ["椅子", "min"],
      //     content: "家具",
      //     style: {
      //       fill: "#c0c0c0",
      //       fontSize: 12,
      //       fontWeight: "300",
      //       textAlign: "center",
      //     },
      //     offsetX: -70,
      //     rotate: Math.PI * -0.5,
      //   });
      //   chart.annotation().text({
      //     top: true,
      //     position: ["电话", "min"],
      //     content: "技术",
      //     style: {
      //       fill: "#c0c0c0",
      //       fontSize: 12,
      //       fontWeight: "300",
      //       textAlign: "center",
      //     },
      //     offsetX: -70,
      //     rotate: Math.PI * -0.5,
      //   });
      //   chart.annotation().text({
      //     top: true,
      //     position: ["笔", "min"],
      //     content: "办公用品",
      //     style: {
      //       fill: "#c0c0c0",
      //       fontSize: 12,
      //       fontWeight: "300",
      //       textAlign: "center",
      //     },
      //     offsetX: -70,
      //     rotate: Math.PI * -0.5,
      //   });
      //   chart.annotation().line({   //手写的线
      //     start: ["-20%", "33.2%"],
      //     end: ["100%", "33.2%"],
      //     style: {
      //       stroke: "#c0c0c0",
      //       lineDash: [2, 2],
      //     },
      //   });
      //   chart.annotation().line({
      //     start: ["-20%", "66.8%"],
      //     end: ["100%", "66.8%"],
      //     style: {
      //       stroke: "#c0c0c0",
      //       lineDash: [2, 2],
      //     },
      //   });
      chart.interaction("element-active");

      chart.render();
    },
    renderView5() {
      console.log(this.data)
      const chart = new Chart({
        container: 'c1',
        autoFit: true,
        height: 280,
      });

      chart.data(this.data);
      chart.scale('当前任务量', {
        nice: true,
      });
      chart.tooltip({
        showMarkers: false,
        shared: true,
      });

      chart
              .interval()
              .position('title*当前任务量')
              .color('l(90) 0:#58CFFF 1:#0080FF')
              .adjust([
                {
                  type: 'dodge',
                  marginRatio: 0,
                },
              ]);

      chart.interaction('active-region');

      chart.render();
    }
  },
  mounted() {
    if (this.type == 1) {//柱图
      this.renderView1();
    } else if (this.type == 2) {//双条图
      this.renderView2();
    } else if (this.type == 3) {//饼图
      this.renderView3();
    } else if (this.type == 4) {//单条图
      this.renderView4();
    } else if (this.type == 5) {
      this.renderView5();
    }
  },
};
</script>

<style>
</style>
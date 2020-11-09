import {dataScreen} from '@/api'
let stati = {
    monthChart: {},
    monthCompany: {},
    monthStaff: {},
    monthTime: {},
    render: function () {
        this.renderMonthChart();
        this.renderMonthCompany();
        this.renderMonthStaff();
        this.renderMonthTime();
        this.getData();
    },
    async getData () {
        var that = this;
        let res = await dataScreen.totalTask()
        // dataScreen.totalTask("/Count/totalTask", null, function (res) {
        $(".total").text(res.data.total);
        $(".normal").text(res.data.normal);
        $(".overdue").text(res.data.overdue);
        $(".processing").text(res.data.processing);
        $(".finish").text(res.data.finish);
        $(".now").html(res.data.time);
        $('.counter').countUp({
            delay: 10,
            time: 500
        });
        // })
        // 获取任务指标任务三个状态数据，以及本月任务统计
        postAjax("/Count/level", null, function (res) {
            // 指标直方图的最大宽度为343
            var taskCount = parseInt(res.data.level0, 10) + parseInt(res.data.level1, 10) + parseInt(res.data.level2, 10),
                levelWidth0 = parseInt(res.data.level0, 10) / taskCount * 343,
                levelWidth1 = parseInt(res.data.level1, 10) / taskCount * 343,
                levelWidth2 = parseInt(res.data.level2, 10) / taskCount * 343;
            $(".target1 .num").text(res.data.level0);
            $(".target2 .num").text(res.data.level1);
            $(".target3 .num").text(res.data.level2);
            $(".target1 .line-box").css("width", levelWidth0);
            $(".target2 .line-box").css("width", levelWidth1);
            $(".target3 .line-box").css("width", levelWidth2);
            that.monthChart.option["xAxis"]["data"] = $.map(res.data.dep, function (item) {
                return item.dep_name;
            });
            that.monthChart.option["series"][0]["data"] = $.map(res.data.dep, function (item) {
                return item.num_yes;
            });
            that.monthChart.option["series"][1]["data"] = $.map(res.data.dep, function (item) {
                return item.num_no;
            });
            that.monthChart["dom"].setOption(that.monthChart.option);
        })
        // 获取本月目标响应时间以及处理时间
        postAjax("/Count/countResponse", null, function (res) {
            var timeResponse = parseInt(res.data.time / res.data.num) || 0;
            var timeFinish = parseInt(res.data.finish / res.data.num) || 0;
            var total = timeResponse + timeFinish;
            $(".time1 .num").text(stati.formatNumber(timeResponse) + "秒");
            $(".time2 .num").text(stati.formatNumber(timeFinish) + "秒");
            $(".time1 .line-box").css("width", timeResponse / total * 343);
            $(".time2 .line-box").css("width", timeFinish / total * 343);
        })
        // 公司逾期排行
        postAjax("/Count/overdue", null, function (res) {
            that.monthCompany.option["yAxis"]["data"] = $.map(res.data, function (item) {
                return item.dep_name;
            });
            that.monthCompany.option["series"][0]["data"] = $.map(res.data, function (item) {
                return item.num;
            });
            that.monthCompany["dom"].setOption(that.monthCompany.option);
        })
        // 员工逾期排行
        postAjax("/Count/staff", null, function (res) {
            that.monthStaff.option["yAxis"]["data"] = $.map(res.data, function (item) {
                return item.username[0].name;
            });
            that.monthStaff.option["series"][0]["data"] = $.map(res.data, function (item) {
                return item.num;
            });
            that.monthStaff["dom"].setOption(that.monthStaff.option);
        })
        // 响应时间排行
        postAjax("/Count/response", null, function (res) {
            that.monthTime.option["yAxis"]["data"] = $.map(res.data, function (item) {
                return item.name;
            });
            that.monthTime.option["series"][0]["data"] = $.map(res.data, function (item) {
                return item.time;
            });
            that.monthTime["dom"].setOption(that.monthTime.option);
        })
    },
    renderMonthChart: function () {
        this.monthChart["dom"] = echarts.init(document.getElementById('monthChart'), 'walden');
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                left: "140px",
                textStyle: {
                    color: "#63A3D3"
                }
            },
            grid: {
                top: "57px",
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: [],
                splitLine: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        var newParamsName = "";
                        var paramsNameNumber = value.length;
                        var provideNumber = 4; //一行显示几个字
                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                        if (paramsNameNumber > provideNumber) {
                            for (var p = 0; p < rowNumber; p++) {
                                var tempStr = "";
                                var start = p * provideNumber;
                                var end = start + provideNumber;
                                if (p == rowNumber - 1) {
                                    tempStr = value.substring(start, paramsNameNumber);
                                } else {
                                    tempStr = value.substring(start, end) + "\n";
                                }
                                newParamsName += tempStr;
                            }

                        } else {
                            newParamsName = value;
                        }
                        return newParamsName;
                    },
                    color: ['#63A3D3']
                },
                axisLine: {
                    lineStyle: {
                        color: ['#085187']
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                boundaryGap: true,
                splitLine: {
                    lineStyle: {
                        color: ['#085187']
                    }
                },
                axisLabel: {
                    color: ['#63A3D3']
                },
                min: 0,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                name: '已完成',
                type: 'bar',
                barWidth: '24px',
                data: [],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [{
                            offset: 0,
                            color: '#C7D5FF'
                        },
                        {
                            offset: 1,
                            color: '#2657F4'
                        }
                        ]
                    )
                },
            },
            {
                name: '未完成',
                type: 'bar',
                barWidth: '24px',
                data: [],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [{
                            offset: 0,
                            color: '#FFF5D5'
                        },
                        {
                            offset: 1,
                            color: '#E6BE39'
                        }
                        ]
                    )
                },
            }
            ]
        };
        this.monthChart["option"] = option;
    },
    renderMonthCompany: function () {
        this.monthCompany["dom"] = echarts.init(document.getElementById('monthCompany'), 'walden');
        var option = {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: "5%",
                left: '0%',
                right: '5%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                minInterval: 1,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    color: ['#63A3D3']
                },
                min: 0,
                axisLine: {
                    lineStyle: {
                        color: ['#085187']
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                data: [],
                boundaryGap: true,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        return stati.formatName(value);
                    },
                    color: ['#63A3D3']
                },
                axisLine: {
                    lineStyle: {
                        color: ['#085187']
                    }
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                name: '本月任务统计',
                type: 'pictorialBar',
                symbol: 'rect',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [{
                            offset: 0,
                            color: '#E3F949'
                        },
                        {
                            offset: 1,
                            color: '#27CEEE'
                        }
                        ]
                    ),
                },
                symbolRepeat: true,
                symbolSize: [8, 12],
                symbolMargin: 1,
                symbolOffset: [7, 0],
                data: [],
                z: 2
            }]
        };
        this.monthCompany["option"] = option;
    },
    renderMonthStaff: function () {
        this.monthStaff["dom"] = echarts.init(document.getElementById('monthStaff'), 'walden');
        var option = {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: "5%",
                left: '0%',
                right: '5%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                minInterval: 1,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    color: ['#63A3D3']
                },
                min: 0,
                axisLine: {
                    lineStyle: {
                        color: ['#085187']
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                data: [],
                boundaryGap: true,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    color: ['#63A3D3']
                },
                axisLine: {
                    lineStyle: {
                        color: ['#085187']
                    }
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                name: '当月员工逾期排行榜',
                type: 'pictorialBar',
                symbol: 'rect',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [{
                            offset: 0,
                            color: '#E008E3'
                        },
                        {
                            offset: 1,
                            color: '#5F5FD1'
                        }
                        ]
                    ),
                },
                symbolRepeat: true,
                symbolSize: [8, 12],
                symbolMargin: 1,
                symbolOffset: [7, 0],
                data: [],
                z: 2
            },]
        };
        this.monthStaff["option"] = option;
    },
    renderMonthTime: function () {
        this.monthTime["dom"] = echarts.init(document.getElementById('monthTime'), 'walden');
        var option = {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (item) {
                    var str = '<div><p>'+item[0].name+'</p>'
                        for(var i=0;i<item.length;i++){
                            str += '<p>'+item[i].seriesName+":"+ stati.formatNumber(item[i].data, 0) + "秒"+'</p>';
                        }
                    str+="</div>"
                    return str;
                },
            },
            grid: {
                top: "5%",
                left: '0%',
                right: '5%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                minInterval: 1,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: function (num) {
                        return stati.formatNumber(num, 0) + "秒";
                    },
                    color: ['#63A3D3']
                },
                min: 0,
                axisLine: {
                    lineStyle: {
                        color: ['#085187']
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                data: [],
                boundaryGap: true,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    align: "right",
                    color: ['#63A3D3']
                },
                axisLine: {
                    lineStyle: {
                        color: ['#085187']
                    }
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                name: '当月员工最快响应排行榜',
                type: 'pictorialBar',
                symbol: 'rect',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [{
                            offset: 0,
                            color: '#FB8A26'
                        },
                        {
                            offset: 1,
                            color: '#FFE044'
                        }
                        ]
                    ),
                },
                symbolRepeat: true,
                symbolSize: [8, 12],
                symbolMargin: 1,
                symbolOffset: [7, 0],
                data: [],
                z: 2
            },]
        };
        this.monthTime["option"] = option;
    },
    formatName(name) {
        // 格式名字
        var newParamsName = "";
        var paramsNameNumber = name.length;
        var provideNumber = 4; //一行显示几个字
        var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
        if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
                var tempStr = "";
                var start = p * provideNumber;
                var end = start + provideNumber;
                if (p == rowNumber - 1) {
                    tempStr = name.substring(start, paramsNameNumber);
                } else {
                    tempStr = name.substring(start, end) + "\n";
                }
                newParamsName += tempStr;
            }

        } else {
            newParamsName = name;
        }
        return newParamsName;
    },
    formatNumber(num, point) {
        // 格式化数字
        var numStr = num.toString()
        // 十万以内直接返回
        if (numStr.length < 6) {
            return numStr;
        }
        //大于8位数是亿
        else if (numStr.length > 8) {
            var decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
            return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
        }
        //大于6位数是十万 (以10W分割 10W以下全部显示)
        else if (numStr.length > 5) {
            var decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
            return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
        }
    },
    init: function () {
        stati.render();
    }
}
$(document).ready(function () {
    stati.init()
});
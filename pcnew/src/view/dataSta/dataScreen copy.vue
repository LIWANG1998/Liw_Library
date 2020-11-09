<template>
    <div>
        <header>
            <p class="name">轻松任务数据大屏</p>
            <p class="now">{{totalTask.now}}</p>
        </header>
        <div></div>
        <section class="content">
            <div class="flex number">
                <div class="number-box">
                    <p>任务总数</p>
                    <v-countup class="number total counter" :delay="0.01" :duration="0.5" :start-value="0" :end-value="totalTask.total"></v-countup>
                </div>
                <div class="number-box">
                    <p>正常任务</p>
                    <v-countup class="number normal counter" :delay="0.01" :duration="0.5" :start-value="0" :end-value="totalTask.normal"></v-countup>
                </div>
                <div class="number-box">
                    <p>逾期任务</p>
                    <v-countup class="number overdue counter" :delay="0.01" :duration="0.5" :start-value="0" :end-value="totalTask.overdue"></v-countup>
                </div>
                <div class="number-box">
                    <p>处理中</p>
                    <v-countup class="number processing counter" :delay="0.01" :duration="0.5" :start-value="0" :end-value="totalTask.processing"></v-countup>
                </div>
                <div class="number-box">
                    <p>已完成</p>
                    <v-countup class="number finish counter" :delay="0.01" :duration="0.5" :start-value="0" :end-value="totalTask.finish"></v-countup>
                </div>
            </div>
            <div class="flex">
                <div class="box monthTarget">
                    <div class="title">本月指标</div>
                    <div class="content">
                        <div class="chart" id="monthTarget">
                            <div class="target-box target1">
                                <div>非常紧急任务</div>
                                <div class="line-box" :style="[{width:levelHigh.width}]">
                                    <div class="line"></div>
                                </div>
                                <div class="num">{{levelHigh.data}}</div>
                            </div>
                            <div class="target-box target2">
                                <div>紧急任务</div>
                                <div class="line-box" :style="[{width:levelmiddle.width}]">
                                    <div class="line"></div>
                                </div>
                                <div class="num">{{levelmiddle.data}}</div>
                            </div>
                            <div class="target-box target3">
                                <div>普通任务</div>
                                <div class="line-box" :style="[{width:levellow.width}]">
                                    <div class="line"></div>
                                </div>
                                <div class="num">{{levellow.data}}</div>
                            </div>
                            <div class="target-box time1" style="margin-top: 31px;">
                                <div>平均响应时长</div>
                                <div class="line-box">
                                    <div class="line"></div>
                                </div>
                                <div class="num">0秒</div>
                            </div>
                            <div class="target-box time2">
                                <div>平均处理时长</div>
                                <div class="line-box">
                                    <div class="line"></div>
                                </div>
                                <div class="num">0秒</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box monthChart">
                    <div class="title">本月任务统计</div>
                    <div class="content">
                        <div class="chart-title">
                            <span></span>
                            <span></span>
                            <span></span>
                            <label style="margin-left: 5px;">当月任务量</label>
                        </div>
<!--                        <div class="chart" id="monthChart" style="height: 222px;padding-top: 10px;"></div>-->
                        <a-x class="chart" style="height: 276px;padding: 40px 10px;" v-if="monthChart.length > 0" :data="monthChart" :type="5"></a-x>
                    </div>
                </div>
            </div>
            <div class="flex rank">
                <div class="box">
                    <div class="title">当月公司逾期排行榜</div>
                    <div class="content">
                        <div class="chart" id="monthCompany"></div>
                    </div>
                </div>
                <div class="box">
                    <div class="title">当月员工逾期排行榜</div>
                    <div class="content">
                        <div class="chart" id="monthStaff"></div>
                    </div>
                </div>
                <div class="box">
                    <div class="title">当月员工最快响应排行榜</div>
                    <div class="content">
                        <div class="chart" id="monthTime"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script src="lib/layui-v2.5.5/layui.js" charset="utf-8"></script>
<script src="api/index.js"></script>
<script src="api/common.js"></script>
<script src="js/echarts.min.js?v=2.0.0" charset="utf-8"></script>
<script src="/static/lib/number/jquery.waypoints.min.js"></script>
<!--<script src="@/assets/js/stati.js"></script>-->
<script>import {dataScreen} from '@/api'
import { Chart } from '@antv/g2';
  import aX from "@/components/imgview.vue";
    export default {
        name: "dataScreen",
        components:{
            aX
        },
        data() {
            return {
                totalTask:{
                    total:'',
                    normal:'',
                    overdue:'',
                    processing:'',
                    finish:'',
                    now:'',
                },
                levelHigh:{
                    data:'',
                    width: '',
                },
                levelmiddle:{
                    data:'',
                    width: '',
                },
                levellow:{
                    data:'',
                    width: '',
                },
                showtime1:{
                    data:'',
                    width: '',
                },
                showtime2:{
                    data:'',
                    width: '',
                },
                monthChart:[],//
            };
        },
        methods:{
            //获取统计数据
            async getData () {
                let res = await dataScreen.totalTask()
                if (res){
                    this.totalTask = res.data
                }

            },
            //获取统计数据
            async dataScreen () {
                let res = await dataScreen.totalTask()
                if (res){
                    this.totalTask = res.data
                }

            },
            // 获取任务指标任务三个状态数据，以及本月任务统计
           async level(){
                let res = await dataScreen.level()
               if (res){
                   // 指标直方图的最大宽度为343
                   let taskCount = parseInt(res.data.level0, 10) + parseInt(res.data.level1, 10) + parseInt(res.data.level2, 10),
                       levelWidth0 = parseInt(res.data.level0, 10) / taskCount * 343,
                       levelWidth1 = parseInt(res.data.level1, 10) / taskCount * 343,
                       levelWidth2 = parseInt(res.data.level2, 10) / taskCount * 343;
                       this.levelHigh.data = res.data.level0
                       this.levelHigh.width = levelWidth0
                       this.levelmiddle.data = res.data.level1
                       this.levelmiddle.width = levelWidth1
                       this.levellow.data = res.data.level2
                       this.levellow.width = levelWidth2
                   // dep_name: "深圳中物兴华有限公司"
                   // num_no: 0
                   // num_yes: 0
                   // wx_depid: "999999"
                   // this.monthChart =  res.data.dep.map(item =>{
                   //     return { name: 'London', title: 'Jan.', 月均降雨量: 18.9 }
                   // })
                   // for (const key of res.data.dep) {
                   //   let param = {}
                   //   param.name = key
                   // }
                   // dep_name: "深圳区域"
                   // num_no: 0
                   // num_yes: 0
                   // wx_depid: "3"
                   res.data.dep.forEach(item =>{
                     this.monthChart.push({
                         name: '未完成',
                         title: item.dep_name,
                         '当前任务量': item.num_no,

                     })
                       this.monthChart.push({
                           name: '已完成',
                           title: item.dep_name,
                           '当前任务量': item.num_yes,

                       })
                   })
                   console.log(this.monthChart)
               }
           },
            //格式化数据
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
            //月影响时间
            async countResponse() {
                let res = await dataScreen.countResponse()
                if (res){
                    let timeResponse = parseInt(res.data.time / res.data.num) || 0;
                    let timeFinish = parseInt(res.data.finish / res.data.num) || 0;
                    let total = timeResponse + timeFinish;
                    this.showtime1.data = this.formatNumber(timeResponse) + "秒"
                    this.showtime1.width = timeResponse / total * 343
                    this.showtime2.data = this.formatNumber(timeFinish) + "秒"
                    this.showtime2.width = timeFinish / total * 343
                }
            }

        },
        created() {
            this.getData()
            this.level()
        }
    }
</script>

<style scoped>
    @import '../../assets/css/stati.css';


</style>
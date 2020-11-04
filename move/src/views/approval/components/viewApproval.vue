<template>
    <div class="box">
        <!-- 紧急程度 -->
        <div class="degree">
            <div class="chiose">
                <img style="width: 11px;height: 14px" src="@/assets/img/newImg/fire.png" alt/>
                <div class="title">紧急程度</div>
            </div>
            <div class="contentbox">
                <div class="radios-box flex-ac">
                    <template v-for="(item,index) in radioslist">
                        <div
                                class="radios-box-cl flex-ac"
                                v-if="current.process_urgent_level == item.name"
                                :key="index"
                        >
                            <div
                                    class="radios-cell flex-ac-jc"
                                    :style="current.process_urgent_level == item.name?{borderColor:item.color}:''"
                            >
                                <template v-if="current.process_urgent_level == item.name">
                                    <div
                                            class="radios-cell-nei"
                                            :style="current.process_urgent_level == item.name?{backgroundColor:item.color}:''"
                                    ></div>
                                </template>
                            </div>
                            <div
                                    class="radios-box-cl-font flex-ac-jc"
                                    :style="current.process_urgent_level == item.name?{color:item.color}:''"
                            >{{item.text}}</div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <!--    当前审核节点-->
        <div class="degree">
            <div class="chiose current">
                <div class="currentNode">
                    <img style="width: 15px;height: 15px" src="@/assets/img/newImg/currentNode.png" alt/>
                    <div class="title">当前审核节点</div>
                </div>
                <div v-if="current.status < 3 && button && button.cuiban == 1 " class="currentNode" @click="submitUrge">
                    <img style="width: 14px;height: 14px" src="@/assets/img/newImg/urge.png" alt/>
                    <div style="color: #4A99ED;">一键催办</div>
                </div>
            </div>
            <div class="contentbox">
                <div class="current">
                    <div class="dept">
                        <span v-if="current.name">{{current.name}}</span>
                        <span v-if="current.flag == 1 || current.flag == 2 || current.flag == 4" class="flag">{{ current.approver_type == 1? '会签' :  '或签' }}</span>
                        <van-icon v-if="isShowCurren" @click="isShowCurren = false" name="arrow-down" color="#BBBBBB" style="margin-left: 5px;"/>
                        <van-icon v-if="!isShowCurren" @click="isShowCurren = true" name="arrow-up" color="#BBBBBB" style="margin-left: 5px;"/>
                    </div>
                    <div v-if="isShowCurren">
                        <div v-for="(item, index) in current.username" :key="index">
                            <div class="deptItem">
                                <div>
                                    <img class="subUserImg" :src="item.avatar" alt/>
                                    <span>{{item.name}}</span>
                                    <div class="subDept">
                                        <span>（{{item.dname.join('/')}}</span>
                                        <span v-if="current.applicant.position">-{{current.applicant.position}}</span>）
                                    </div>
                                </div>
<!--                                <div v-for="(it, num) in statusList" :key="num" style="display: flex;justify-content: space-between;align-items: center">-->
<!--                                    <div>-->
<!--                                        <span class="dotto" v-if="item.handle == 1 || item.handle == 2 || item.handle == 3" :style="{backgroundColor: it.color}"></span>-->
<!--                                        <span class="dotto" v-else-if="item.status == it.status" :style="{backgroundColor: it.color}"></span>-->
<!--                                    </div>-->
<!--                                    <div>-->
<!--                                        <span v-if="item.handle == 1 || item.handle == 2 || item.handle == 3" :style="{color: it.color}">{{it.name}}</span>-->
<!--                                        <span v-else-if="item.status == it.status" :style="{color: it.color}">{{it.name}}</span>-->
<!--                                    </div>-->
<!--                                </div>-->
                                <div style="display: flex;justify-content: space-between;align-items: center">
                                    <span class="dotto" :class="item.handle == 1? 'statDot_2' : item.handle == 2 ? 'statDot_2' : item.handle == 3 && item.status != 6?'statDot_3' :item.handle == 3 && item.status == 6? 'statDot_2' : item.handle == 4 && item.status == 3? 'statDot_3' : item.handle == 4 && item.status == 8 ? 'statDot_5' : item.handle == 4 ? 'statDot_4' : 'statDot_3'"></span>
                                    <span v-if="item.handle == 1" class="statSpan_1">未查看</span>
                                    <span v-else-if="item.handle == 2" class="statSpan_1">已查看</span>
                                    <span v-else-if="item.handle == 3" class="statSpan_1">未提交</span>
                                    <!--                                <span v-if="item.handle == 4" class="statSpan_3">已提交</span>-->
                                    <span v-else-if="item.status == 3" class="statSpan_3">审核通过</span>
                                    <span v-else-if="item.status == 4" class="statSpan_2">驳回</span>
                                    <span v-else-if="item.status == 5" class="statSpan_1">已撤回</span>
                                    <span v-else-if="item.status == 6" class="statSpan_3">暂放</span>
                                    <span v-else-if="item.status == 7" class="statSpan_1">已报废</span>
                                    <span v-else-if="item.status == 8" class="statSpan_5">已转审</span>
    <!--                                    <span v-if="!item.status" class="statSpan_1">未提交</span>-->
                                    <span v-else class="statSpan_1">未提交</span>
                                </div>
                            </div>
                            <!--                            &lt;!&ndash;                            附件&ndash;&gt;-->
                            <div v-if="item.file && item.file.length" class="deptItem">
                                <div class="file">
                                    <img style="width: 15px;height: 15px;margin-right: 3px"
                                         src="@/assets/img/newImg/file.png" alt/>附件
                                </div>
                                <img @click="goFilePage" style="width: 15px;height: 15px;margin-right: 3px"
                                     src="@/assets/img/newImg/fileLoad.png" alt/>
                            </div>
                            <div v-if="item.transfer" class=" turnUser">
                                <div class="transfer" v-for="(items, num) in item.transfer" :key="num">
                                    <div class="transfer_info">
                                        <img style="width: 16px;height: 12px;margin-right: 3px"
                                             src="@/assets/img/newImg/turnIcon.png" alt/>
                                        <img class="subUserImg" :src="items.avatar" alt/>
                                        <span>{{items.name}}</span>
                                        <div class="transfer_info_dpt">
                                            <span>（{{items.dname.join('/')}}</span>
                                            <span v-if="current.applicant.position">-{{current.applicant.position}}</span>）
                                        </div>
                                    </div>
                                    <div class="transfer_icon" style="display: flex;justify-content: space-between;align-items: center;">
                                        <span class="dotto" :class="items.handle == 1? 'statDot_2' : items.handle == 2 ? 'statDot_2' : items.handle == 3?'statDot_3' : items.handle == 4 && items.status == 3 ? 'statDot_2' : items.handle == 4 ? 'statDot_4' : 'statDot_3'"></span>
                                        <span v-if="items.handle == 1" class="statSpan_1">未查看</span>
                                        <span v-else-if="items.handle == 2" class="statSpan_2">已查看</span>
                                        <span v-else-if="items.handle == 3" class="statSpan_3">未提交</span>
                                        <span v-else-if="items.handle == 4 && items.status == 8" class="statSpan_5">已转审</span>
                                        <span v-else-if="items.handle == 4" class="statSpan_4">已提交</span>
                                    </div>
                                </div>
                            </div>
                            <!--                        </div>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--        提交人-->
        <!-- 提交人 -->
        <div class="degree">
            <div class="chiose">
                <img style="width: 13px;height: 13px" src="@/assets/img/newImg/subUser.png" alt/>
                <div class="title">提交人</div>
            </div>
            <div class="contentbox">
                <div style="display: flex;align-items: center">
                    <img class="subUserImg" :src="current.applicant.avatar" alt/>
                    <span class="subName" style="">{{current.applicant.name}}</span>
                    <div class="subDept">
                        <span>（{{current.applicant.dname.join('/')}}</span>
                        <span v-if="current.applicant.position">-{{current.applicant.position}}</span>）
                    </div>
                </div>
            </div>
        </div>
        <!--    上下处理节点-->
        <div class="degree">
            <div class="chiose">
                <img style="width: 16px;height: 7px" src="@/assets/img/newImg/node.png" alt/>
                <div class="title">上下处理节点</div>
            </div>
            <div class="contentbox">
                <div>
                    <div class="upnode">
<!--                        flag:1部门、2标签、3人员、4上级、5申请人-->
                        <div class="title">上一节点:</div>
                        <span v-if="prv.name" class="nodeAuditorType" style="">{{prv.name}}</span>
                        <span v-if="prv.flag == 1 ||  prv.flag == 2 ||prv.flag == 3 || prv.flag == 4" class="flag">{{ prv.approver_type == 1? '会签' :  '或签' }}</span>
                    </div>
                    <div style="display: flex;flex-wrap: wrap" v-if="prv.username">
                        <div style="width: 60px;padding-bottom: 30px" v-for="(item, index) in prv.username" :key="index">
                            <div class="nodeItem">
                                <img :src="item.avatar" alt/>
                            </div>
                            <div class="TitName">{{item.name}}</div>
                        </div>
                    </div>
                    <template style="display: flex;flex-wrap: wrap" v-else>
                        <div style="width: 60px;padding-bottom: 30px" v-for="(item, index) in prv" :key="index">
                            <div class="nodeItem">
                                <img :src="item.username.avatar" alt/>
                            </div>
                            <div class="TitName">{{item.username.name}}</div>
                        </div>
                    </template>
                </div>
                <div v-if="!(next instanceof Array)">
                    <div class="upnode">
                        <div class="title">即将流向:</div>
                         <span v-if="next.name" class="nodeAuditorType" style="">{{next.name}}</span>
                         <span v-if="next.flag == 1 || next.flag == 2 ||next.flag == 3 || next.flag == 4" class="flag">{{ next.approver_type == 1? '会签' :  '或签' }}</span>
                    </div>
                    <div style="display: flex;flex-wrap: wrap">
                        <div style="width: 60px;" v-for="(item, index) in next.username" :key="index + 1 ">
                            <div class="nodeItem">
                                <img :src="item.avatar" alt/>
                            </div>
                            <div class="TitName">{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let radioslist = [
    {
        name: "1",
        text: "普通",
        color: "#999898",
    },
    {
        name: "2",
        text: "紧急",
        color: "#FF5B5B",
    },
    {
        name: "3",
        text: "加急",
        color: "#D12D2D",
    },
];
let statusList = [
    {
        handle: 1,
        name: '未查看',
        color:'#f56c6c'
    },
    {
        handle: 2,
        name: '已查看',
        color:'#f56c6c'
    },
    {
        handle: 3,
        name: '未提交',
        color:'#f56c6c'
    },
    {
        status: 3,
        name: '审核通过',
        color:'#f5ac40'
    },
    {
        status: 4,
        name: '驳回',
        color:'#f56c6c'
    },
    {
        status: 5,
        name: '已撤回',
        color:'#f56c6c'
    },
    {
        status: 6,
        name: '暂放',
        color:'#f5ac40'
    },
    {
        status: 7,
        name: '已报废',
        color:'#f56c6c'
    },
    {
        status: 8,
        name: '已转审',
        color:'#909399'
    },
]
import { getApprovalInfo, subApprovalUrge } from "../../../api/audit";

export default {
  name: "viewApproval",
  data() {
    return {
      radioslist,
      chioseBtnStatus: undefined, //紧急程度按钮
      message: "", //处理意见留言内容
      radio: null, //单选框选中
      current: { applicant: { dname: [] } },
      prv: [],
      next: [],
      button: {}, //按钮权限
      isShowCurren: true, //显示当前审核人
        statusList,//公文状态
    };
  },
  props: {
    approvalInfo: {
      type: Object,
      default: () => {},
    },
    active: {
      //collect审批组件内选中tab状态1.当前审批2.意见汇总，3.附件列表
      type: [String, Number],
      default: "",
    },
  },
  watch: {
    approvalInfo: {
      immediate: true,
      handler: function (val) {
        if (val.data) {
          // console.log("approvalInfo", val);
          this.current = val.data.current;
          this.current.process_urgent_level = this.current?.process_urgent_level
            ? this.current.process_urgent_level.toString()
            : "";
          this.prv = val.data.prv;
          this.next = val.data.next;
          this.chioseBtnStatus = this.current?.process_urgent_level
            ? this.current.process_urgent_level.toString()
            : "";
          this.radio = this.current?.handle
            ? this.current.handle.toString()
            : "";
          // console.log(this.prv);
        }
      },
    },
  },
  methods: {
    //    催办
    submitUrge() {
      let that = this;
      let datas = new URLSearchParams();
      datas.append("id", that.current.where_id);
      subApprovalUrge(datas).then((res) => {
        if (res.code == 1) {
          that.$toast.success({
            message: "催办成功",
          });
        } else {
          that.$toast.fail({
            message: res.msg,
          });
        }
      });
    },
      //到附件列表页下载
      goFilePage() {
          this.$emit("goFilePage", true);
      },
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.button = JSON.parse(sessionStorage.getItem("button"));
  },
};
</script>

<style lang="scss" scoped>
.box {
  font-size: 14px;
}

/*公用box*/
.degree {
  width: 100%;
  height: auto !important;
  background-color: #fff;
  margin-bottom: 10px;

  .chiose {
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 10px 10px 10px 15px;
    border: 1px solid #f5f6f7;

    .title {
      margin-left: 10px;
      color: #909399;
    }
  }

  .current {
    justify-content: space-between;

    .currentNode {
      display: flex;
      align-items: center;
    }
  }

  .contentbox {
    /*padding: 20px 10px;*/
    background: #ffffff;
    padding: 10px 20px;
    .radios-box {
      .radios-box-cl {
        margin-right: 50px;
        .radios-cell {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid;
          border-color: #d8dfe6;
          .radios-cell-nei {
            width: 8px;
            height: 8px;
            background-color: #f5ac40;
            border-radius: 50%;
          }
        }
          .radios-box-cl-font {
              height: 60px;
              font-size: 16px;
              padding-left: 8px;
              line-height: 1rem;
          }
      }
    }
    .radios {
      height: 60px;
      display: flex;
      align-items: center;
    }

    .subUserImg {
      width: 32px;
      height: 32px;
      margin-right: 5px;
      border-radius: 50%;
    }

    .subName {
      display: inline-block;
      max-width: 20%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subDept {
      display: flex;
      align-items: center;
      display: inline-block;
      color: #adafb3;
      max-width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subDeptName {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 28px;
    }

    .upnode {
      display: flex;
      margin-bottom: 10px;

      .title {
        color: #909399;
        margin-right: 10px;
      }
    }

    .nodeItem {
      display: flex;
      justify-content: center;
      margin-bottom: 5px;

      img {
        height: 36px;
        width: 36px;
        border-radius: 18px;
      }
    }

    .userBox {
      display: flex;
      align-items: center;

      img {
        width: 32px;
        height: 32px;
        margin-right: 5px;
      }
    }

    .dept {
      display: flex;
      align-items: center;
    }

    .deptItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;

      div:nth-child(1) {
        display: flex;
        align-items: center;
        max-width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file {
        color: #909399;
        font-size: 12px;
      }
    }

    .turnUser {
      border-top: 1px dashed #dcdfe6;
      margin-top: 5px;
      padding-top: 10px;
      .transfer {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        .transfer_info {
          width: 80%;
          display: flex;
          /*justify-content: space-between;*/
          align-items: center;
          .transfer_info_dpt {
            color: #adafb3;
            max-width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .current {
      padding: 0 8px;
    }
  }

  .btn {
    width: 112px;
    height: 48px;
    background: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #606266;

    .Ospan {
      display: inline-block;
      margin-left: 5px;
    }
  }
  .dotto {
    display: inline-block;
    height: 4px;
    width: 4px;
    background: #909399;
    border-radius: 50%;
    margin-right: 5px;
  }
  .statSpan_1,
  .statSpan_2 {
    font-size: 12px !important;
    color: #f56c6c;
  }

  .statSpan_3 {
    font-size: 12px !important;
    color: #f5ac40;
  }

  .statSpan_4 {
    font-size: 12px !important;
    color: #41aaff;
  }
  .statSpan_5 {
    font-size: 12px !important;
    color: #909399;
  }
  .statDot_1,
  .statDot_2 {
    font-size: 12px !important;
    background: #f56c6c;
  }

  .statDot_3 {
    font-size: 12px !important;
    background: #f5ac40;
  }

  .statDot_4 {
    font-size: 12px !important;
    background: #41aaff;
  }
  .statDot_5 {
    font-size: 12px !important;
    background: #909399;
  }
}

/*    提交人*/
.upnodecontent {
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;
  background-color: #ffffff;
  margin-top: 10px;

  .content {
    width: 100%;
    background-color: #f5f5f5;
    height: auto;
    display: flex;
    height: 58px;
    line-height: 58px;
    padding: 2px 8px;
    box-sizing: border-box;

    div {
      padding: 0 10px;
    }

    .partment {
      max-width: 60%;
      color: #909399;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .name {
    width: 22%;
  }

  .content_1 {
    border-left: 3px solid #0082ef;
    background: linear-gradient(271deg, #f3f9ff 0%, #ffff 100%);
  }

  .content_2 {
    border-left: 3px solid #62c232;
    background: linear-gradient(
      271deg,
      #f7fcf5 0%,
      rgba(255, 255, 255, 1) 100%
    );
  }
}

/*    处理状态*/
.dobox {
  width: 100%;
  height: 36px;
  line-height: 36px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background-color: #f6f6f6;

  .van-radio-group--horizontal {
    width: 90%;
  }

  .radios {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .van-radio-group--horizontal {
      width: 80%;
      justify-content: space-between;
    }
  }
}

/*    未查看*/
.status {
  height: 36px;
  line-height: 36px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  color: #909399;

  .statusbox {
    margin-right: 10px;
    display: inline-block;
    height: 4px;
    line-height: 4px;
    width: 4px;
    background: rgba(144, 147, 153, 1);
    border-radius: 50%;
  }

  .color {
    background: #0082ef;
  }
}
.nodeAuditorType {
  display: inline-block;
  size: 15px;
  color: #303133;
  margin-left: 10px;
}
.TitName {
    text-align: center;
    max-width: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/*    会签或签*/
.flag {
    display: inline-block;
    margin-left: 5px;
    width: 35px;
    text-align: center;
    color: #41aaff;
    font-size: 12px;
    border: 1px solid #41aaff;
}
</style>
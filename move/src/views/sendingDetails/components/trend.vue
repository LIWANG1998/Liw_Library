<template>
  <div class="process">
    <template v-for="(item,index) in trendLists">
      <div :key="index" class="steps">
        <div class="step-left">
          <div class="step flex-ac step-s">
            <svg-icon
              :iconClass="item.rstatus==3?'approval-pass':item.rstatus==4?'approval-nopa':item.rstatus==6?'approval-stop':'approval-wait'"
              class="approval-pass"
            />
          </div>
          <div class="step-cell" v-if="index==trendList.length-1?false:true">
            <div class="step-row"></div>
          </div>
        </div>
        <div class="step-right">
          <div class="step">
            <div class="setpItem">
              <!-- <img src="../../../assets//img/detail/user.png" alt /> -->
              <div>{{item.title}}</div>
              <div>·{{{1:'等待中',2:'审核进行中',3:"审核通过",4:"审核拒绝",5:"已撤销",6:"暂放",7:"报废"}[item.rstatus]}}</div>
              <div class="status" @click="showIcon(item)">
                <div class="chioseStatus">{{{1:"会签",2:"或签"}[item.approver_type]}}</div>
                <img src="../../../assets//img/detail/down.png" alt class="icon" />
              </div>
            </div>
          </div>
          <div v-show="item.showIcon">
            <div v-for="(item,index) in item.handle" :key="index">
              <div class="step">
                <div class="setpItem flex-ac">
                  <svg-icon
                    :iconClass="item.rstatus==3?'app-ok':item.rstatus==4?'app-no':''"
                    class="app-ok"
                  />
                  <img :src="item.avatar" alt />
                  <div class="name ellipsis">{{item.name}}</div>
                </div>
                <div style="color: #909499;display: flex;justify-content: flex-end;">
                  <div style="padding-right: 5px;color: #000;">
                    {{{3:'审核通过',4:'审核拒绝',5:"已撤销",6:"暂放",7:"报废",8:"已转审"}[item.rstatus]}}
                    <span
                      v-if="item.rstatus"
                    >·</span>
                  </div>
                  {{item.rtime}}
                </div>
              </div>
              <div class="content" v-if="item.explain">{{item.explain}}</div>
              <template v-for="(item,index) in item.transfer">
                <div class="content-xia" :key="index">
                  <div class="zhuan">
                    <img
                      style="width: 16px;height: 12px;margin-right: 3px;margin-top:18px"
                      src="@/assets/img/newImg/turnIcon.png"
                      alt
                    />
                  </div>
                  <div class="zhuanren">
                    <div class="step">
                      <div class="setpItem flex-ac">
                        <svg-icon
                          :iconClass="item.rstatus==3?'app-ok':item.rstatus==4?'app-no':''"
                          class="app-ok"
                        />
                        <img :src="item.avatar" alt />
                        <div class="name ellipsis">{{item.name}}</div>
                      </div>
                      <div style="color: #909499;display: flex;justify-content: flex-end;">
                        <div style="padding-right: 5px;color: #000;">
                          {{{3:'审核通过',4:'审核拒绝',5:"已撤销",6:"暂放",7:"报废",8:"已转审",2:"待审核"}[item.rstatus]}}
                          <span
                            v-if="item.rstatus"
                          >·</span>
                        </div>
                        {{item.rtime}}
                      </div>
                    </div>
                    <div class="content" v-if="item.explain">{{item.explain}}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    trendList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showStyle: "0", //展开状态
    };
  },
  methods: {
    showIcon(v) {
      v.showIcon = !v.showIcon;
    },
  },
  computed: {
    trendLists() {
      // console.log("this.trendList", this.trendList);
      let a = this.trendList.map((v, i) => {
        this.$set(v, "showIcon", i == 0 ? true : false);
        return v;
      });
      return a;
    },
  },
  watch: {
    // trendList(newValue,oldValue){
    //   // console.log(newValue,'trendList');
    // }
  },
  created() {
    // console.log(this.trendList, "trendList");
  },
};
</script>
<style lang="scss" scoped>
.van-step--vertical {
  padding-right: 20px;
}
.steps {
  display: flex;
  .step-left {
    margin-right: 15px;
    .step-s {
      margin: 10px 0 0;
    }
    .approval-pass {
      width: 16px;
      height: 16px;
    }
    .step-cell {
      height: calc(100% - 30px);
      .step-row {
        margin: 0 auto;
        width: 1px;
        height: 100%;
        background-color: #d8d8d8;
      }
    }
  }
  .step-right {
    flex: 1;
  }
}
.process {
  margin: 16px;
  img {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }

  .step {
    display: flex;
    justify-content: space-between;
    position: relative;
    color: #000;
    height: 28px;
    line-height: 28px;
    font-size: 15px;
    margin: 10px 0;

    .setpItem {
      display: flex;
      position: relative;
      .name {
        width: 75px;
      }
      .app-ok {
        position: absolute;
        left: 21px;
        top: -5px;
        width: 12px;
        height: 12px;
      }
      // .goods {
      //   position: absolute;
      //   left: 21px;
      //   top: -5px;
      //   width: 12px;
      //   height: 12px;
      //   background-color: aliceblue;
      //   border-radius: 50%;
      //   padding: 1px;
      // }
    }
  }

  .status {
    display: flex;
    .chioseStatus {
      width: 35px;
      height: 20px;
      line-height: 23px;
      border: 1px solid rgba(85, 171, 244, 1);
      font-size: 12px;
      color: #55abf4;
      text-align: center;
      margin: 2px 10px;
    }
  }

  .icon {
    width: 6px;
    height: 4px;
    margin-top: 12px;
  }
}

.content {
  padding: 7px;
  box-sizing: border-box;
  color: #000;
  background: rgba(246, 246, 246, 1);
}
.content-xia {
  display: flex;
  .zhuanren {
    flex: 1;
  }
}
</style>
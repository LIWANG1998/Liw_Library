<template>
  <div class="box">
    <van-search
      v-model="data.kwd"
      placeholder="搜索字号"
      input-align="center"
      @input="search"
      @cancel="cancel"
    />
    <div class="rules">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="rules-cell">
          <van-radio :name="0" v-model="radio" @click="changeRule(1)">不需要字号规则</van-radio>
        </div>
        <van-radio-group v-model="radio">
          <template v-for="(item,index) in ruleNum">
            <div class="rules-cell" :key="index">
              <van-radio :name="item.id" v-model="radio" @click="changeRule(item)">
                <div class="rules-cell-box flex-ac-jsb">
                  <div class="rules-cell-box-left">
                    <div class="rules-cell-box-left-top flex-ac">
                      <span class="titles">{{item.name}}</span>
                      <span class="using flex-ac-jc" v-if="item.is_default==1">常用</span>
                    </div>
                    <div class="rules-cell-box-left-bm">{{item.word_no}}</div>
                  </div>
                  <div class="rules-cell-box-right flex-ac" @click.stop="SetDefaultFun(item)">
                    <svg-icon
                      :iconClass="item.is_default==0?'coll-ection':'coll-ection-act'"
                      class="coll-ection-icon"
                    /><span style="margin-top:2px">常用</span>
                  </div>
                </div>
              </van-radio>
            </div>
          </template>
        </van-radio-group>
      </van-list>
    </div>
    <div class="pickclass-btn">
      <!-- <van-button type="default" class="btn" @click="onCancel">取消</van-button> -->
      <van-button
        type="info"
        class="btn"
        @click="determine"
        block
        color="linear-gradient(to right, #0082EF, #04A9FE)"
      >确认</van-button>
    </div>
  </div>
</template>

<script>
import {
  getDocWordManager,
  delDocmentWord,
  document_wordno_setcomm,
} from "@/api/home"; //接口
import { document_wordno_manager } from "@/api/audit";
import { debounce } from "@/js/public.js";
export default {
  props: {
    iss: {
      type: Object,
    },
  },
  data() {
    return {
      radio: 0,
      rateValue: 0, //是否收藏
      ruleNum: [], //字号规则列表
      choiserule: {}, //选择的规则
      searchValue: "", // 搜索的内容
      data: {
        type: 1,
        kwd: "",
        page: 0,
        limit: 10,
      },
      loading: false,
      finished: false,
    };
  },
  methods: {
    // 搜索
    search: debounce(function () {
      this.data.page = 0;
      this.ruleNum = [];
      this.getList();
    }, 500),
    //清空搜索
    // 加载数据
    onLoad() {
      this.getList();
    },
    cancel() {},
    onCancel() {
      this.iss.numStatus = false;
    },
    //确定按钮
    determine() {
      this.iss.numStatus = false;
      if (JSON.stringify(this.choiserule) == "{}") {
      } else {
        this.iss.value = [];
        if (this.radio != 0) {
          this.iss.value.push(this.choiserule);
        }
        this.$emit("statusclick");
      }
    },
    //选择的值
    changeRule(item) {
      // console.log(item, 5555555);
      this.choiserule = item;
    },
    // 获取数据
    async getList() {
      this.data.page++;
      this.loading = true;
      this.finished = false;
      let _res = await getDocWordManager(this.data);
      setTimeout(() => {
        // console.log(_res);
        if (_res.code == 1) {
          this.ruleNum.push.apply(this.ruleNum, _res.data);
          // 加载状态结束
          this.loading = false;
          if (this.ruleNum.length == _res.count) {
            this.finished = true;
          }
          // console.log(this.ruleNum, "规则字号");
        }
      }, 500);
    },
    // getList() {
    //   getDocWordManager({
    //     type: 1,
    //     sort: "desc",
    //   }).then((res) => {
    //     if (res.code == 1) {
    //       this.ruleNum = res.data;
    //       // console.log(this.ruleNum, "规则字号");
    //     }
    //   });
    // },
    //删除编码
    delWord(id) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "此操作将删除该字号规则, 是否继续?",
        })
        .then(() => {
          delDocmentWord({
            id: id,
          }).then((res) => {
            if (res.code == 1) {
              this.$toast.success({
                message: res.msg,
              });
              this.getList();
            } else {
              this.$toast.fail({
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$toast.success({
            message: "已取消",
          });
        });
    },
    // 设置常用字号
    async SetDefaultFun(v) {
      let _data = {
        id: v.id, // 套红模板的id
        is_default: v.is_default == 0 ? 1 : 0, //	0取消 1设为常用
      }; // 参数
      // console.log(_data);
      let _res = await document_wordno_setcomm(_data);
      // console.log(_res);
      this.$toast(_res.msg);
      if (_res.code == 1) {
        v.is_default =
          v.is_default == 0 ? (v.is_default = 1) : (v.is_default = 0); 
          
      }
    },
  },
  created() {
    // console.log(this.iss);
    this.iss.value.length > 0 ? (this.radio = this.iss.value[0].id) : "";
    // console.log(this.radio);
  },
  mounted() {
    // this.getList();
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.box {
  height: 100%;
  background-color: #f2f2f2;
  padding-top: 0;
  margin: 0 auto;
  .rules {
    height: calc(100% - 48px - 60px);
    padding: 16px 15px;
    overflow-y: auto;
    .rules-cell {
      height: 78px;
      background-color: white;
      border-radius: 8px;
      margin-bottom: 12px;
      /deep/ .van-radio {
        height: 100%;
        padding: 15px;
        .van-radio__label {
          margin-left: 13px;
          font-size: 16px;
          font-weight: 500;
          width: 100%;
        }
        .van-radio__icon {
          width: 22px;
        }
      }
      .rules-cell-box {
        .rules-cell-box-left {
          flex: 1;
          .rules-cell-box-left-top {
            .titles {
              height: 20px;
            }
            .using {
              margin-left: 10px;
              font-size: 12px;
              color: #839ccf;
              height: 20px;
              background-color: #eaf0fc;
              border-radius: 2px;
              width: 34px;
            }
          }
          .rules-cell-box-left-bm {
            margin-top: 8px;
            font-size: 13px;
            font-weight: 400;
          }
        }

        .rules-cell-box-right {
          .coll-ection-icon {
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }
        }
      }
    }
  }
  .pickclass-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 15px;
    background-color: white;
    box-shadow: 0px -1px 0px rgba(230, 230, 230, 1);
    .btn {
      flex: 1;
    }
  }
}
.van-search {
  height: 48px;
}
</style>
<template>
  <div class="ListCard init" @click="toexamine(item)">
    <div class="card">
      <div class="card-left" :style="{ backgroundColor: colorFun(1) }"></div>
      <div class="card-svg-div">
        <svg-icon :iconClass="process_icon(lab, item)" class="card-svg" />
        <span class="card-text" :style="{ color: process_color(lab, item) }">{{
          process_urgent(lab, item)
        }}</span>
      </div>
      <div class="flex-ac card-main">
        <div class="card-header ellipsis" :class="lab == 2 ? 'max-w' : ''">
          {{ item.title }}
        </div>
        <template v-if="lab == 2">
          <div
            class="zhuangtai"
            :style="{
              color: doc_color[item.doc_type].color,
              borderColor: doc_color[item.doc_type].color,
            }"
          >
            <div>{{ doc_color[item.doc_type].text }}</div>
          </div>
        </template>
      </div>
      <div class="card-tops ellipsis">{{ item.word_no }}</div>
      <div class="card-footer flex-ac-jsb">
        <div class="card-footer-left ellipsis">
          <div class="card-footer-left-qiu">
            {{ type == 1 ? "发" : type == 2 ? "收" : "签" }}
          </div>
          <span class="card-footer-left-zhi"
            >{{ item.name }}/{{ item_unit(item.unit) }}</span
          >
        </div>
        <template>
          <div class="card-footer-right">
            <div class="card-footer-right-btn flex-ac-jc">
              {{ item.ff_lab == 0 ? "去审核" : "去查看" }}
            </div>
          </div>
        </template>
        <!-- <template v-if="lab==2">
          <div class="card-footer-right">
            <div
              class="zhuangtai"
              :style="{color:cygw_color[item.dtype].color,borderColor:cygw_color[item.dtype].color}"
            >
              <div>{{cygw_color[item.dtype].text}}</div>
            </div>
          </div>
        </template> -->
      </div>
    </div>
  </div>
</template>
<script>
let dian_color = {
  1: {
    color: "#5DB5FF",
    text: "待审",
  },
  2: {
    color: "#5DB5FF",
    text: "待审",
  },
  4: {
    color: "#F56C6C",
    text: "驳回",
  },
  3: {
    color: "#62C232",
    text: "完成",
  },
  9: {
    color: "#07346D",
    text: "归档",
  },
  6: {
    color: "#F5AC40",
    text: "暂放",
  },
  10: {
    color: "#0B8D2E",
    text: "发布",
  },
  8: {
    color: "#909399",
    text: "草稿",
  },
  9: {
    color: "#909399",
    text: "报废",
  },
  20: {
    color: "#909399",
    text: "预发文",
  },
  11: {
    color: "#0B8D2E",
    text: "草稿",
  },
};
let bg_color = {
  lan: {
    backgroundColor: "#5DB5FF",
  },
  lv: {
    backgroundColor: "#62C232",
  },
  hong: {
    backgroundColor: "#F56C6C",
  },
  hui: {
    backgroundColor: "#818181",
  },
};
let svg_item = {
  jiaji: {
    text: "加急",
    svg: "jiaji",
  },
  putong: {
    text: "普通",
    svg: "putong",
  },
  jinji: {
    text: "紧急",
    svg: "jinji",
  },
  shouwen: {
    text: "收文",
    svg: "shouwen",
  },
};
// 1传阅，2分发，3呈送，4抄送，5待审，6审核通过，7审核拒绝，8撤销，9暂放，10报废，11草稿，12归档，13发布
let cygw_color = {
  1: {
    text: "传阅",
    color: "#0082EF",
  },
  2: {
    text: "分发",
    color: "#0082EF",
  },
  3: {
    text: "呈送",
    color: "#0082EF",
  },
  4: {
    text: "抄送",
    color: "#0082EF",
  },
  5: {
    text: "待审",
    color: "#0082EF",
  },
  6: {
    text: "审核通过",
    color: "#0082EF",
  },
  7: {
    text: "审核拒绝",
    color: "#0082EF",
  },
  8: {
    text: "撤销",
    color: "#0082EF",
  },
  9: {
    text: "暂放",
    color: "#0082EF",
  },
  10: {
    text: "报废",
    color: "#0082EF",
  },
  11: {
    text: "草稿",
    color: "#0082EF",
  },
  12: {
    text: "归档",
    color: "#0082EF",
  },
  13: {
    text: "发布",
    color: "#0082EF",
  },
  14: {
    text: "传阅",
    color: "#0082EF",
  },
};

let doc_color = {
  0: {
    text: "传阅",
    color: "#0082EF",
  },
  1: {
    text: "抄送",
    color: "#0082EF",
  },
  2: {
    text: "分发",
    color: "#0082EF",
  },
  3: {
    text: "已签收",
    color: "#62C232",
  },
  4: {
    text: "被退回",
    color: "#F56C6C",
  },
  5: {
    text: "新审核",
    color: "#0082EF",
  },
  6: {
    text: "已超期",
    color: "#F56C6C",
  },
  7: {
    text: "已完成",
    color: "#62C232",
  },
  8: {
    text: "已报废",
    color: "#818181",
  },
  9: {
    text: "已完成",
    color: "#62C232",
  },
};
export default {
  name: "ListCard",
  props: {
    item: {
      type: Object,
    },
    type: {
      type: Number,
    },
    lab: {
      type: Number,
    },
  },
  data() {
    return {
      cygw_color,
      bg_color,
      dian_color,
      doc_color,
    };
  },
  computed: {
    item_unit() {
      return (v) => {
        // console.log(v);
        if (v && v.charAt(v.length - 1) == ",") {
          v = v.substring(0, v.lastIndexOf(","));
        }
        return v;
      };
    },
    colorFun() {
      return (v) => {
        return dian_color[v == "-" ? 8 : v == undefined ? 9 : v]?.color
          ? dian_color[v == "-" ? 8 : v == undefined ? 9 : v]?.color
          : dian_color[8];
      };
    },
    process_urgent() {
      return (b, v) => {
        if (v.ff_lab == 0 || b == 2) {
          return v.process_urgent_level == 1
            ? "普通"
            : v.process_urgent_level == 2
            ? "加急"
            : "紧急";
        } else {
          return "收文";
        }
      };
    },
    process_icon() {
      return (b, v) => {
        if (v.ff_lab == 0 || b == 2) {
          return v.process_urgent_level == 1
            ? "putong"
            : v.process_urgent_level == 2
            ? "jinji"
            : v.process_urgent_level == 3
            ? "jiaji"
            : "putong";
        } else {
          return "shouwen";
        }
      };
    },
    process_color() {
      return (b, v) => {
        if (v.ff_lab == 0 || b == 2) {
          return v.process_urgent_level == 1
            ? "#303133"
            : v.process_urgent_level == 2 || v.process_urgent_level == 3
            ? "#FFFFFF"
            : "#0082EF";
        } else {
          return "#0082EF";
        }
      };
    },
  },
  created() {},
  methods: {
    toexamine(item) {
      // console.log(item);
      if (item.r_status == 8) {
        if (item.is_fast == 1) {
          this.$router.push({
            path: "/quick",
            query: {
              fid: item.id,
              cut: 11,
            },
          });
        } else {
          this.$router.push({
            path: "/draft",
            query: {
              tid: item.templete_id,
              type: this.type,
              fid: item.id,
              lid: item.approval_id,
              cut: 11,
            },
          });
        }
      } else {
        this.$router.push({
          path: `/sendingDetails`,
          query:
            item.ff_lab == 1
              ? {
                  fid: item.id,
                  distributeId: item.distribute_id,
                  type: this.type,
                  lab: 2,
                }
              : {
                  fid: item.id,
                  type: this.type,
                  lid: item.approval_id,
                },
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.ListCard {
  .card {
    width: 100%;
    border-radius: 4px;
    height: 137px;
    background-color: #ffffff;
    margin-bottom: 15px;
    padding: 15px;
    position: relative;
    .card-left {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      border-radius: 4px 0 0 4px;
    }
    .card-svg-div {
      position: absolute;
      top: 0;
      right: 9px;
      width: 28px;
      height: 34px;
      .card-svg {
        position: absolute;
        height: 100%;
        width: 100%;
      }
      .card-text {
        text-align: center;
        position: absolute;
        font-size: 11px;
        top: 3px;
        left: 0;
        right: 0;
        z-index: 1;
        color: white;
      }
    }
    .card-main {
      margin-right: 40px;
      line-height: 23px;
    }
    .max-w {
      max-width: 250px;
    }
    .card-header {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: #303133;
      position: relative;
      // flex: 1;
    }
    /*    状态*/
    .zhuangtai {
      margin-left: 8px;
      float: right;
      display: flex;
      align-items: center;
      height: 18px;
      line-height: 18px;
      border: 1px solid #818181;
      font-size: 12px;
      padding: 1px 5px;
    }
    .card-tops {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #303133;
    }
    .card-footer {
      margin-top: 13px;
      border-top: 1px solid #e6eef5;
      height: 54px;
      width: 100%;
      .card-footer-left {
        flex: 1;
        .card-footer-left-qiu {
          display: inline-block;
          width: 27px;
          height: 27px;
          border-radius: 50%;
          background-color: #dcdfe6;
          color: #909399;
          line-height: 27px;
          text-align: center;
        }
        .card-footer-left-zhi {
          display: inline;
          font-size: 14px;
          margin-left: 6px;
        }
      }
      .card-footer-right {
        width: 84px;
        .card-footer-right-btn {
          float: right;
          width: 50px;
          height: 28px;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
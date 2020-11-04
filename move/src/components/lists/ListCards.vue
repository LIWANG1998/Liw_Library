<template>
  <div class="ListCard init" @click="toexamine(item)">
    <div class="card">
      <div class="card-left" :style="{backgroundColor:colorFun(item.r_status)}"></div>
      <div class="card-svg-div">
        <svg-icon
          :iconClass="item.process_urgent_level==1?'putong':item.process_urgent_level==2?'jinji':item.process_urgent_level==3?'jiaji':'shouwen'"
          class="card-svg"
        />
        <span
          class="card-text"
          :style="{color:item.process_urgent_level==1?'#303133':item.process_urgent_level==2 || item.process_urgent_level==3?'#FFFFFF':'#0082EF'}"
        >{{item.process_urgent_level_cn}}</span>
      </div>
      <div class="card-header ellipsis">{{item.title}}</div>
      <div class="card-tops ellipsis">{{item.word_no}}</div>
      <div class="card-footer flex-ac-jsb">
        <div class="card-footer-left ellipsis">
          <div class="card-footer-left-qiu">{{item.type==1?"发":item.type==2?"收":"签"}}</div>
          <span class="card-footer-left-zhi">{{item.creater}}/{{item.dep_name}}</span>
        </div>
        <template v-if="lab==1">
          <div class="card-footer-right">
            <div class="card-footer-right-btn flex-ac-jc">去审核</div>
          </div>
        </template>
        <template v-if="lab==2">
          <div class="card-footer-right">
            <div class="zhuangtai" :style="{color:colorFun(item.r_status)}">
              <div class="dian" :style="{backgroundColor:colorFun(item.r_status)}"></div>
              <div>{{item.status}}</div>
            </div>
          </div>
        </template>
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
export default {
  name: "ListCard",
  props: {
    item: {
      type: Object,
    },
    lab: {
      type: Number,
    },
  },
  data() {
    return {
      bg_color,
      dian_color,
    };
  },
  computed: {
    colorFun() {
      return (v) => {
        // console.log(v);
        return dian_color[v == "-" ? 8 : v == undefined ? 9 : v]?.color
          ? dian_color[v == "-" ? 8 : v == undefined ? 9 : v]?.color
          : dian_color[8];
      };
    },
  },
  created() {
    // console.log(this.item);
  },
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
              type: item.type,
              fid: item.id,
              lid: item.approval_id,
              cut: 11,
            },
          });
        }
      } else {
        this.$router.push({
          path: `/sendingDetails`,
          query: {
            fid: item.id,
            type: item.type,
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
    .card-header {
      margin-right: 52px;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: #303133;
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
        /*    状态*/
        .zhuangtai {
          float: right;
          display: flex;
          align-items: center;
          height: 28px;
          line-height: 28px;
          padding-left: 10px;
          .dian {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>
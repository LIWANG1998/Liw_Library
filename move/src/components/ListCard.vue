<template>
  <div class="content">
    <div
      class="line"
      :style="{'background-color':{2:'#5DB5FF',1:'#5DB5FF',3:'#5DB5FF'}[item.process_urgent_level]}"
    ></div>
    <div class="detail" @click="toexamine(item)">
      <div class="msg">
        <div class="top">
          <div class="title">{{item.title}}</div>
          <div class="word-no">{{item.word_no}}</div>
        </div>
        <div class="bottom">
          <div class="flex">
            <div class="state">{{item.type==1?"发":item.type==2?"收":"签"}}</div>
            <div class="user">{{item.creater}}/{{item.dep_name}}</div>
          </div>
          <div class="to-examine flex-ac-jc">
            <div>{{pageType ==2 ? '去查看' : '去审核'}}</div>
          </div>
        </div>
      </div>
      <div
        class="proStatus"
        :class="'proStatus'+item.process_urgent_level"
      >{{item.process_urgent_level==1?"普通":item.process_urgent_level==2?"紧急":"加急"}}</div>
    </div>
  </div>
</template>
<script>
// 卡片右侧的颜色
let listcolor = {
  1: {
    "background-color": "#5DB5FF",
  },
  2: {
    "background-color": "#5DB5FF",
  },
  3: {
    "background-color": "#5DB5FF",
  },
};
export default {
  props: {
    // 循环传过来的 item
    item: {
      type: Object,
    },
    pageType: {
      //1.从待审页面列表，2.待阅页面列表
      type: [String, Number],
    },
  },
  name: "ListCard",
  data() {
    return {
      listcolor, // 卡片右侧的颜色
    };
  },
  created() {
    // console.log(this.item);
  },
  methods: {
    toexamine(item) {
      this.$router.push({
        path: "/sendingDetails",
        query: {
          fid: item.id,
          type: item.type,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  width: 384px;
  height: 137px;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 15px;
  border-radius: 4px;
  position: relative;

  .line {
    height: 100%;
    width: 4px;
    border-radius: 4px 0px 0px 4px;
    /* background-color: #f5ac40; */
  }
  .msg {
    .top {
      height: 82px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid rgba(230, 238, 245, 1);
      color: #303133;
      font-size: 14px;
      .title {
        color: #303133;
        font-size: 16px;
        width: 317px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 500;
        font-size: 16px;
      }
      .word-no {
        margin-top: 10px;
      }
    }
    .bottom {
      display: flex;
      height: 55px;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      .state {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 27px;
        height: 27px;
        background: rgba(144, 147, 153, 0.1);
        border-radius: 50%;
        font-size: 12px;
        color: #909399;
      }
      .user {
        margin-left: 10px;
      }
      .to-examine {
        width: 50px;
        height: 28px;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
      }
    }
  }

  .detail {
    width: 348px;
    padding: 0 16px 0px 15px;
  }
}
.flex {
  display: flex;
  align-items: center;
}
.proStatus {
  position: absolute;
  top: 0;
  right: 10px;
  width: 34px;
  height: 40px;
  text-align: center;
  color: #fff;
  font-size: 11px;
  box-sizing: border-box;
  padding-top: 4px;
}
//普通
.proStatus1 {
  background: url("../assets/img/document/normal.png") no-repeat;
  background-size: 34px 40px;
}
//紧急
.proStatus2 {
  background: url("../assets/img/document/so-urgent.png") no-repeat;
  background-size: 34px 40px;
}
//加急
.proStatus3 {
  background: url("../assets/img/document/urgent.png") no-repeat;
  background-size: 34px 40px;
}

.van-icon {
  position: absolute;
  top: 34px;
  right: 20px;
}
</style>
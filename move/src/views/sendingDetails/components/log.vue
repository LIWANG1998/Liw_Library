<template>
  <div class="content">
    <div class="logList flex-ac-jsb" v-for="(item,index) in logList" :key="index">
      <div class="logList-left">
        <div class="username flex-ac-jsb">
          <span>{{item.operation}}</span>
          <!-- <div
            @click="lookDetail()"
            class="look flex-ac"
            v-if="item.xiugai!==0&&item.xiugai!==null"
          >
            <span style="color:#303133">立即查看</span>
            <van-icon name="arrow" style="margin:2px 0 0 5px" size="16" />
          </div> -->
        </div>
        <div class="detail">
          <div>
            <span style="color:#606266">{{item.create_time}}</span>
            <span
              style="color:#909399;padding:0px 20px"
            >{{{1:'未查看',2:'已查看',3:'未提交',4:'已提交'}[item.handle]}}</span>
            <span v-if="item.xiugai!==0&&item.xiugai!==null" style=" color:#F56C6C">有修改</span>
            <span v-else style="color:#909399">无修改</span>
          </div>
        </div>
      </div>
      <div class="logList-right" v-if="item.handle==1">
        <div class="infobtn" @click="Urging">催办</div>
      </div>
    </div>
  </div>
</template>

<script>
import { approvalUrge } from "@/api/home";
export default {
  props: {
    logList: {
      type: Array,
      default: () => [],
    },
    userid: {
      type: String,
      default: () => "",
    },
    fid: {
      default: () => "",
    },
    wid: {
      type: [String, Number],
    },
  },
  data() {
    return {};
  },
  methods: {
    lookDetail() {
      this.$router.push({
        path: "/detail",
        query: {
          id: this.userid,
          fid: this.fid,
        },
      });
    },
    // 催办
    Urging(v) {
      approvalUrge({ id: this.wid }).then((res) => {
        this.$toast.success(res.msg);
      });
    },
  },

  created() {
    // console.log(this.logList);
  },
};
</script>
<style lang="scss" scoped>
// .content {
//   height: 85vh;
//   background-color: #fafafa;
// }

.logList {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  margin: 10px 0;
  background-color: #ffffff;
  .logList-left {
    flex: 1;
  }
  .logList-right {
    .infobtn {
      color: white;
      padding: 5px 10px;
      background-color: #0082ef;
      border-radius: 3px;
      margin-right: 10px;
    }
  }
  .username {
    font-weight: 500;
    font-size: 16px;
  }

  .detail {
    display: flex;
    justify-content: space-between;
    height: 25px;
    line-height: 25px;
    margin-top: 6px;
    font-size: 14px;

    .look {
      .van-icon {
        vertical-align: text-top;
        color: rgba(199, 199, 204, 1);
        padding-left: 8px;
      }
    }
  }
}
</style>
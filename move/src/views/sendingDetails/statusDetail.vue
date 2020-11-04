<template>
  <div class="box">
    <!-- <van-search v-model="value" placeholder="请输入搜索关键词" input-align="center" /> -->
    <div v-if="num!==0" style="margin-top:5px">
      <div class="list" v-for="(item,index) in detailList" :key="index">
        <div class="username">{{item.operation}}</div>
        <div class="date">
          <span style="color: #606266;">{{item.create_time}}</span>
          <span class="look">{{{1:'未查看',2:'已查看',3:'未提交',4:'已提交'}[item.handle]}}</span>
        </div>
        <div
          class="btn"
          @click="urging()"
          v-if="(type==1||type==2||type==3) && (item.handle==1 ||item.handle==2||item.handle==3) && item.status==2 && item.operation!=userinfo.name"
        >
          <van-button color="#F56C6C">催办</van-button>
        </div>
      </div>
    </div>
    <div class="page" v-if="num!==0">
      <div class="total">总数：{{num}}份</div>
      <!-- <van-pagination v-model="currentPage" :page-count="12" mode="simple" /> -->
    </div>
    <div v-else class="no-data">
      <div class="img">
        <img :src="datano" alt />
      </div>没有更多数据
    </div>
  </div>
</template>

<script>
import { procedureJournal, approvalUrge } from "../../api/home";

export default {
  data() {
    return {
      datano: require("@/assets/img/noData/noData.png"),
      value: "",
      currentPage: 1,
      type: "", //类型默认：6 总人次，查询类型 1 未查看 2 已查看 3未提交 4已提交 5 催租 6 总人次
      detailList: [],
      num: 0,
      where: "", //审核节点
      fid: "", //公文id
      userinfo: JSON.parse(sessionStorage.getItem("userInfo")),
    };
  },
  methods: {
    urging() {
      let data = new URLSearchParams();
      data.append("id", this.where);
      approvalUrge(data).then((res) => {
        if (res.code == 1) {
          this.$toast.success({
            message: "催办成功",
            overlay: true,
          });
        } else {
          this.$toast.fail({
            message: res.msg,
            overlay: true,
          });
        }
      });
    },
    getProcedureJournal() {
      let data = new URLSearchParams();
      data.append("data_id", this.fid);
      data.append("type", this.type);
      procedureJournal(data).then((res) => {
        if (res.code == 1) {
          this.detailList = res.data.data;
          this.num = res.data.data.length;
          // console.log(this.detailList, "  this.detailList");
        }
      });
    },
  },
  created() {
    // console.log(this.detailList);

    this.type = this.$route.query.type;
    this.where = this.$route.query.where;
    this.fid = this.$route.query.fid;

    // console.log(this.type);
    this.getProcedureJournal();
  },
};
</script>
<style lang="scss" scoped>
.box {
  font-size: 14px;
  position: relative;
  height: 100vh;
  background-color: #f5f6f7;
}

.no-data {
  margin: 0 auto;
  text-align: center;
  font-size: 16px;
  padding-top: 50px;
  .img {
    width: 80%;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
}

.list {
  position: relative;
  // height: 78px;
  background: #fff;
  padding: 15px 15px 10px;
  box-sizing: border-box;
  margin-top: 5px;

  .username {
    font-size: 16px;
    font-weight: 600;
    color: rgba(48, 49, 51, 1);
    padding-bottom: 6px;
    width: 310px;
    word-break: break-all;
  }

  .look {
    display: inline-block;
    margin-left: 27px;
    color: #f56c6c;
  }
}

.btn {
  position: absolute;
  right: 15px;
  top: 30%;

  .van-button {
    width: 64px;
    height: 31px;
  }
}
// .date {
//   margin-top: 5px;
// }
.page {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;

  .total {
    text-align: center;
    margin-bottom: 15px;
  }

  .van-pagination {
    background-color: #fff;
  }
}
</style>
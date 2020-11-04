<template>
  <div class="box">
    <div class="successImg">
      <img src="../../assets/img/home/success.png" alt />
    </div>
<!--    //成功提示-->
    <div>
      <!-- <template v-if="page == 'cy' || page == 'ff' || page=='yfw'">
        <div class="text">{{page == 'ff'? '分发成功' : page=='cy' || page=='yfw'?'传阅成功' : '提交成功'}}</div>
      </template> -->
      <template v-if="$route.query.text">
        <div class="text">{{$route.query.text}}成功</div>
      </template>
      <template v-else>
        <div class="text">{{status==8?'已存入草稿' : status== 7? '已报废' : '提交成功'}}</div>
      </template>
    </div>
<!--  提交成功后按钮  -->
    <div>
      <div class="btn" @click="lookDetail(3)" v-if="page=='yfw'">
        <van-button v-if="type == 1 || type == 0" color="#0082EF" block>查看预发文详情</van-button>
      </div>
      <div class="btn" @click="lookDetail()" v-else-if="page == 'cy' || page == 'ff'">
        <van-button color="#0082EF" block>查看公文详情</van-button>
      </div>
      <div class="btn" @click="lookDetail(1)" v-else-if="status==2">
        <van-button v-if="type == 1 || type == 0" color="#0082EF" block>查看发文详情</van-button>
        <van-button v-else-if="type == 2" color="#0082EF" block>查看收文详情</van-button>
        <van-button v-else-if="type == 3" color="#0082EF" block>查看签报详情</van-button>
      </div>
      <div v-else-if="status == 7" class="btn" @click="$router.push(`/filingBox?id=3&&type=${type}`)">
        <van-button color="#0082EF" block>前往报废箱查看</van-button>
      </div>
      <div v-else class="btn" @click="$router.push(`dispatchBank/${type}`)">
        <van-button color="#0082EF" block>前往公文库查看</van-button>
      </div>
    </div>
    <div class="goback" @click="$router.push(`/home`)">回到首页</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fid: "",
      type: "",
      status: "",
      page: "",
    };
  },
  methods: {
    lookDetail(val) {
      if (val && val == 2) {
        this.$router.push({
          path: `/quick`,
          query: {
            fid: this.fid,
            cut: 100,
          },
        });
      } else if (val && val == 3){//预发文
        this.$router.push({
          path: `/sendingDetails`,
          query: {
            fid: this.fid,
            status: 20,
            type: this.type,
          },
        });
      } else {
        this.$router.push({
          path: "sendingDetails",
          query: {
            fid: this.fid,
            type: this.type,
          },
        });
      }
    },
  },
  watch: {
    type: {
      handler: function (val) {
        // console.log(val);
      },
    },
  },
  mounted() {
    this.fid = this.$route.query.id;
    this.type = this.$route.query.type;
    this.status = this.$route.query.status;
    this.page = this.$route.query.page;
    // console.log(this.type);
    sessionStorage.removeItem("content");
    sessionStorage.removeItem("document_arr");
    sessionStorage.removeItem("enclosure_file");
    sessionStorage.removeItem("approval_file");
    sessionStorage.removeItem("currentDoc");
    sessionStorage.removeItem("document_arrs");
    sessionStorage.removeItem("gercontentFile");
    sessionStorage.removeItem("red");
    sessionStorage.removeItem("ele");
    sessionStorage.removeItem("fieldss");
    sessionStorage.removeItem("button");
    sessionStorage.removeItem("iss");
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  position: relative;

  .successImg {
    width: 92px;
    height: 92px;
    margin: 0 auto;
    padding-top: 69px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.btn {
  width: 384px;
  height: 44px;
  margin: 0 auto;
}

.text {
  font-size: 18px;
  font-weight: 500;
  color: rgba(48, 49, 51, 1);
  text-align: center;
  margin: 20px 0 40px 0;
}

.goback {
  width: 100%;
  height: 60px;
  line-height: 60px;
  position: absolute;
  left: 0;
  bottom: 0;
  text-align: center;
  color: #004580;
  font-size: 14px;
}
</style>



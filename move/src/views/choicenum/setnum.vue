<template >
  <div class="setnum">
    <div class="box-div">
      <div class="top">{{isss.name}}</div>
      <van-field v-model="title" placeholder="请填写字号" ref="word_no" />
      <van-button type="info" @click="okfontsFun">确定</van-button>
    </div>
  </div>
</template>
<script>
import { check_word_wo_re } from "@/api/home";
export default {
  name: "setnum",
  data() {
    return {
      title: "",
    };
  },
  computed: {
    isss() {
      return this.$store.state.edittext.isss;
    },
    iss() {
      return this.$store.state.edittext.iss;
    },
  },
  activated() {
    // console.log("asdasda", this.isss, this.iss);

    this.title = this.isss.word_no;
  },
  mounted() {
    this.$refs.word_no.focus();
  },
  methods: {
    // 修改字号接口
    okfontsFun() {
      // this.fonts.show = false;
      this.check_word_wo_re();
    },
    async check_word_wo_re() {
      let _res = await check_word_wo_re({
        word_no: this.title,
        id: this.$route.query.id,
      });
      if (_res.code == 1) {
        this.isss.word_no = this.title;
        this.iss.value[0].word_no = this.title;
        this.$router.go(-1);
        // console.log(this.isss);
      } else {
        this.$toast(_res.msg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.setnum {
  height: 100vh;
  /deep/.box-div {
    height: 100%;
    width: 100%;
    background-color: #f2f2f2;
    font-size: 16px;
    padding-top: 10px;
    box-sizing: border-box;
    .top {
      height: 48px;
      color: #909399;
      background-color: white;
      padding-left: 16px;
      line-height: 48px;
    }
    .van-cell {
      height: 66px;
      display: flex;
      align-items: center;
      .van-field__control {
        font-size: 16px;
      }
    }
    .van-button {
      margin: 24px 15px;
      width: 384px;
      border-radius: 4px;
    }
  }
}
</style>
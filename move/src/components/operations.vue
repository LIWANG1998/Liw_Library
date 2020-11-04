<template>
  <div class="remind">
    <div class="top">
      <div class="img">
        <img :src="topImg" alt />
      </div>
      <div class="text">无可见范围</div>
    </div>
    <div class="contents">
      <h4>解决办法:</h4>
      <p>在"登录企业微信-应用管理-可见范围"中可设置员工可见范围</p>
      <img :src="roleRange" alt />
    </div>
<!--    <van-button type="info" @click="goSet" class="btn go-set">去设置</van-button>-->
    <div class="btn btn-close" @click="btnclose">我知道了</div>
  </div>
</template>
<script>
export default {
  name: "Operations",
  data() {
    return {
      topImg: require("@/assets/img/remind/jinggao.png"),
      roleRange: require("@/assets/img/remind/role_range.png"),
    };
  },
  props: {
    remindShow: {
      type: Object,
    },
  },
  created() {},
  methods: {
    // 关闭弹窗
    btnclose() {
      this.$router.go(-1)
    },
    // 去设置
    goSet() {
      this.remindShow.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.remind {
  background: #ffffff;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .top {
    text-align: center;
    .img {
      margin-bottom: 15px;
    }
    .text {
      font-size: 18px;
    }
    margin-bottom: 60px;
  }
  .contents {
    padding: 0 40px 40px;
    h4 {
      margin: 0;
      font-size: 20px;
      line-height: 33px;
      color: #333333;
      font-weight: 500;
      padding-bottom: 20px;
    }
    p {
      color: #303133;
      font-size: 18px;
      font-weight: 400;
      line-height: 28px;
      padding-bottom: 25px;
    }
    img {
      width: 100%;
    }
  }
  .admin-users {
    min-height: 140px;
    margin-bottom: 20px;
    p {
      padding: 20px;
      color: #303133;
      font-size: 14px;
    }
    .admin-users-list {
      display: flex;
      flex-wrap: wrap;
      .admin-users-list-cell {
        width: 20%;
        // height: 70px;
        display: flex;
        padding: 0 10px;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
        img {
          width: 100%;
          margin-bottom: 5px;
        }
        .admin-users-list-cell-text {
          text-align: center;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .btn {
    width: 100%;
    font-size: 16px;
    text-align: center;
  }
  .btn-close {
    color: #0082ef;
    padding: 20px;
  }
}
</style>
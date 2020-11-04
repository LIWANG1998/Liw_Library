<template>
  <div class="box">
    <div class="bg"></div>
    <div class="files">
      <div class="item" @click="$router.push(`/officialOut?lab=1&title=分发列表`)" v-if="labOne">
        <div class="flex">
          <div class="img">
            <img src="../../assets/img/document/send.png" alt />
          </div>
          <div class="title">公文发送</div>
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="item" @click="$router.push(`/officialOut?lab=2&title=接收列表`)" v-if="labTwo">
        <div class="flex">
          <div class="img">
            <img src="../../assets/img/document/receive.png" alt />
          </div>
          <div class="title">公文接收</div>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      auth: "", //权限设置
      labOne: true,
      labTwo: true,
    };
  },
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem("SET_AUTH"))[4];
    // console.log(this.auth, "this.auth");
    if (this.auth.indexOf("document_send_left") == -1) {
      this.labOne = false;
    }
    if (this.auth.indexOf("document_receive_left") == -1) {
      this.labTwo = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.bg {
  width: 274px;
  height: 193px;
  background: url("../../assets/img/document/background.png");
  background-size: 274px 193px;
  margin-top: 50px;
}

.box {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f6f7;
  .files {
    width: 100%;
    margin-top: 30px;
    padding: 0 15px;
    box-sizing: border-box;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06);
      border-radius: 6px;
      padding: 0 20px;
      margin-bottom: 20px;
      .flex {
        display: flex;
        align-items: center;
        .img {
          width: 38px;
          height: 30px;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .title {
        color: #000000;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}
</style>
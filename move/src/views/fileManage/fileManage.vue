<template>
  <div class="box">
    <div class="bg"></div>
    <div class="content">
      <router-link class="funList" v-for="(item,index) in funList" :key="index" :to="item.url">
        <div class="title">
          <div class="img">
            <img :src="item.img" alt />
          </div>
          <div>{{item.text}}</div>
        </div>

        <van-icon name="arrow" />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      auth: [], //权限设置
      funList: [
        {
          img: require("@/assets/img/fileManage/file.png"),
          text: "归档箱",
          url: "/filingBox?id=0&title=归档箱&ac=0",
          status: "",
        },
        {
          img: require("@/assets/img/fileManage/cc.png"),
          text: "抄送公文",
          url: "/filingBox?id=1&title=抄送公文&ac=0",
          status: "",
        },
        {
          img: require("@/assets/img/fileManage/circulation.png"),
          text: "传阅公文",
          url: "/filingBox?id=2&title=传阅公文&ac=0",
          status: "",
        },
        {
          img: require("@/assets/img/fileManage/abandonment.png"),
          text: "废弃箱",
          url: "/filingBox?id=3&title=废弃箱&ac=0",
          status: "",
        },
      ],
    };
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.box {
  color: #303133;
  font-size: 15px;
  .bg {
    width: 276px;
    height: 178px;
    background: url("../../assets/img/fileManage/bg.png");
    background-size: 276px 178px;
    margin: 80px auto;
  }
}
.content {
  padding-left: 15px;
}
.funList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 385px;
  height: 64px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06);
  opacity: 1;
  border-radius: 6px;
  margin-bottom: 15px;
  padding: 0 20px;
  box-sizing: border-box;
  color: #c7c7cc;
  .img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    display: flex;
    align-items: center;
    color: #000000;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
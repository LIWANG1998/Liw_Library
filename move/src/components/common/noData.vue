<template>
  <div class="box">
    <div class="imgStyle">
      <img src="../../assets/img/noData/noData.png" alt />
      <div class="tips">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "noData",
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100vh;
  background-color: #fff !important;
  position: relative;
}
.tips {
  color: #8dc7f7;
  text-align: center;
  padding-top: 15px;
  font-size: 16px;
}
.imgStyle {
  position: absolute;
  top: 20%;
  left: 50%;
  width: 200px;
  height: 146px;
  transform: translate(-50%, -50%);
  > img {
    width: 100%;
    height: 100%;
  }
}
</style>


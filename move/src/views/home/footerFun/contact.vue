<template>
  <!-- 联系客户 -->
  <div class="box">
    <img class="topLeft" src="../../../assets/img/footer/lxkf-top.png" alt />
    <!-- <img class="topCenter" src="../../../assets/img/footer/ys_center.png" alt=""> -->
    <div class="conterBox">
      <div class="centerTop">客服电话：4000-2828-80</div>
      <div class="centerIntop"></div>
      <div class="centerCenter">
        感谢您对我们的信任和支持，如果系统有BUG、
        <br />或者您有好的功能建议，欢迎反馈！
        <br />我们会及时进行处理，对系统进行优化和升级，
        <br />让您有更好的使用体验！
        <br />
      </div>
      <div class="qrcode">
        <img src="../../../assets/img/footer/er.jpg" alt="">
      </div>
      <div class="centerBott">
        联系客服，请微信扫码添加
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.box {
  height: 100vh;
  background-color: #fff;
  position: relative;
}
.topLeft {
  width: 96px;
  height: 123px;
  margin-left: 15px;
}
.topCenter {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 104.94px;
  height: 186.38px;
}
.conterBox {
  position: absolute;
  top: 100px;
  left: 50%;
  width: 353px;
  height: 570px;
  transform: translateX(-50%);
}
.centerTop {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #96b5d6;
  background-color: #fff;
  color: #000;
  font-size: 16px;
  width: 286px;
  height: 54px;
  line-height: 54px;
  border-radius: 30px;
  text-align: center;
  z-index: 5;
  overflow: hidden;
}
.centerIntop {
  height: 54px;
  width: 286px;
  margin: 98px auto 30px;
  background: #96b5d6;
  transform: translate(3px, 5px);
  border: 1px solid #96b5d6;
  border-radius: 30px;
}
.centerCenter {
  color: #2d3034;
  font-size: 14px;
  text-align: center;
  line-height: 23px;
  margin-bottom: 30px;
}
.qrcode{
  width: 160px;
  height: 160px;
  margin: 0 auto 10px;
  img{
    width: 100%;
    height: 100%;
  }
}
.centerBott{
  text-align: center;
  font-size: 13px;
  color: #000;
}
</style>
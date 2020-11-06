<template>
  <div class="contact">
    <div class="head">
      <div class="bg"></div>
      <div class="qr-code">
        <span>
          <img :src="require('@/assets/images/contact.png')" />
        </span>
        <div>扫描二维码添加客服企业微信</div>
      </div>
    </div>
    <van-cell title="客服联系电话" is-link>
      <a class="tel_a" :href="'tel:' + tel">
        {{tel}}
      </a>
    </van-cell>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tel: "4000 2828 80",
    };
  },
};
</script>
<style lang="less" scoped>
  .contact {
  .head {
    background: @white;
    margin-bottom: 10px;
    .bg {
      position: absolute;
      height: 60px;
      width: 100%;
      background: @wx-blue;
      &::after {
        content: "";
        width: 110%;
        height: 290px;
        position: absolute;
        left: -5%; //椭圆左边隐藏10%，右边隐藏10%
        bottom: -140px;
        border-radius: 80%; //左上角，右上角，右下角，左下角
        background: @wx-blue;
      }
    }
    img {
      width: 236px;
    }
    .qr-code {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 60px 0 20px;
      font-size: 16px;
      span {
        display: inline-block;
        background: @white;
        width: 236px;
        height: 236px;
        overflow: hidden;
        border-radius: 4px;
        box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .tel_a{
    color: #000000;
  }
}
</style>

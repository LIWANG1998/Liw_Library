<template>
  <div class="home-footer-warp">
    <div class="home-footer-title">{{footer.title}}</div>
    <div class="home-footer-list">
      <span
        v-for="item in footer.list"
        :key="item.id"
        class="footer-btn"
        @click="choiseFun(item.id)"
      >{{item.text}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "homeFooter",
  data() {
    return {
      footer: {
        title: "技术支持：名冠天下",
        list: [
          { id: 0, text: "联系客服" },
          { id: 1, text: "意见反馈" },
          { id: 2, text: "帮助中心" }
        ]
      }
    };
  },
  methods: {
    choiseFun(id) {
      if (id == 0) {
        this.$router.push(`/contact`);
      } else if (id == 1) {
        this.$router.push(`/optimization`);
      } else {
        location.href = "https://www.mgtx.cn/portal/page/index/id/42.html";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.home-footer-warp {
  text-align: center;
  padding-bottom: 10px;

  .home-footer-title {
    font-size: 12px;
    color: #b8b8b8;
  }

  .home-footer-list {
    margin-top: 4px;
    font-size: 12px;
    color: #4a77ac;

    .footer-btn + .footer-btn {
      margin: 5px;
    }
  }
}
</style>
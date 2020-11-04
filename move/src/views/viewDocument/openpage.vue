<template>
  <div class="openpage">
    <!-- 图片 -->
    <template v-if="type && type == 'svg-img'">
      <div class="img">
        <img :src="path" alt="" />
      </div>
    </template>
    <template v-else-if="type && type == 'svg-video'">
      <video :src="path">您的浏览器不支持 video 标签。</video>
    </template>
    <template v-else-if="type && type == 'svg-music'">
      <audio :src="path">您的浏览器不支持 audio 标签。</audio>
    </template>
    <template v-else-if="type && (type == 'svg-txt' || type == 'svg-pdf')">
      <iframe
        :src="path"
        class="iframe"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        allowtransparency="yes"
      ></iframe>
    </template>
    <!-- <template v-else>
      <div></div>
    </template> -->
  </div>
</template>
<script>
export default {
  name: "openpage",
  data() {
    return {};
  },
  created() {},
  computed: {
    path() {
      return this.$store.state.openpage.path
        ? this.$store.state.openpage.path
        : null;
    },
    type() {
      return this.$store.state.openpage.type
        ? this.$store.state.openpage.type
        : null;
    },
  },
  activated() {
    // console.log(this.$store.state.openpage);
  },
};
</script>
<style lang="scss" scoped>
.openpage {
  height: 100vh;
  width: 100vw;
  background-color: white;
  position: relative;
  .img {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    padding: 20px;
    img {
      width: 100%;
    }
  }
  .iframe {
    min-height: 100vh;
    width: 100vw;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
<template>
  <router-link class="home-box-item-warp" :to="boxItem.url">
    <div>
      <van-icon :name="boxItem.icon" class="box-item-icon" />
    </div>
    <div class="box-item-text">{{boxItem.text}}</div>
  </router-link>
</template>

<script>
export default {
  name: "homeBoxItem",
  props: {
    boxItem: {
      type: Object,
      default: () => {},
    },
  },
  computed: {},
  created() {
    // console.log(this.boxItem);
  },
};
</script>

<style scoped lang="scss">
.home-box-item-warp {
  text-align: center;
  width: 33.33%;
  box-sizing: border-box;
  padding: 20px 0;
  .box-item-icon {
    font-size: 40px;
  }

  .box-item-text {
    margin-top: 10px;
    color: #000000;
    font-size: 15px;
  }
}
</style>
<template>
  <div class="home-box-warp" v-if="boxList.length>0">
    <div class="home-box-title van-hairline--bottom">{{title}}</div>
    <div class="home-box-content-warp">
      <home-box-item
        :boxItem="item"
        v-for="item in boxList"
        :key="item.id"
        v-show="item.status==true"
      />
    </div>
  </div>
</template>

<script>
import HomeBoxItem from "./homeBoxItem";

export default {
  name: "homeBox",
  components: { HomeBoxItem },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    boxList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped lang="scss">
.home-box-warp {
  width: 384px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.06);
  margin: 15px;
  border-radius: 4px;

  .home-box-title {
    height: 48px;
    color: #000000;
    display: flex;
    align-items: center;
    font-size: 17px;
    padding-left: 20px;
    font-weight: 600;
    border-bottom: 1px solid #f0f0f0;
  }

  .home-box-content-warp {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>
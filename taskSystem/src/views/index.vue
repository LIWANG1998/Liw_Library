<template>
  <div class="main">
    <router-view />
    <div style="height:60px;" />
    <van-tabbar v-model="active" route>
      <van-tabbar-item
        v-for="(item,index) in getNavList"
        :key="index"
        :to="item.path"
        :class="item.path=='/add'?'nav-add':''"
      >
        <span>{{ item.title }}</span>
        <template #icon="props">
          <!-- <i :class="['sprite-icon','nav-icon',props.active ? item.active : item.inactive]"></i> -->
          <svg-icon :icon-class="props.active ? item.active : item.inactive" class="nav-icon" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      active: 0,
      load: false,
      navList: [
        {
          path: "/execute",
          title: "执行中",
          active: "nav1-active",
          inactive: "nav1",
        },
        {
          path: "/finish",
          title: "已结束",
          active: "nav2-active",
          inactive: "nav2",
        },
        {
          path: "/add",
          title: "发起任务",
          active: "nav-add",
          inactive: "nav-add",
        },
        {
          path: "/draft",
          title: "草稿箱",
          active: "nav3-active",
          inactive: "nav3",
        },
        {
          path: "/my",
          title: "个人中心",
          active: "nav4-active",
          inactive: "nav4",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["power"]),
    getNavList() {
      if (
        !this.power.is_initiate ||
        this.power.is_super_admin ||
        this.power.is_system == 3
      ) {
        return this.navList.filter((item, index) => index != 2);
      }
      return this.navList;
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  height: 100%;
  width: 100%;
  .van-tabbar-item {
    font-size: 11px;
    position: relative;
  }
  /deep/.van-tabbar {
    height: 54px;
    box-shadow: 1px 0 4px 0px rgba(227, 227, 227, 0.6);
    .van-tabbar-item__icon {
      img {
        height: 25px;
      }
    }
    .nav-icon {
      display: block;
      width: 23px;
      height: 23px;
    }
    .nav-add {
      position: relative;
      .nav-icon {
        position: absolute;
        top: -33px;
        left: -26px;
        z-index: 2;
        width: 53px;
        height: 53px;
      }
      span {
        position: relative;
        bottom: -13px;
      }
    }
  }
}
</style>

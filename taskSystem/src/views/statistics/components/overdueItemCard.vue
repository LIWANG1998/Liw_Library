<template>
  <div class="overdue-item-box">
    <div class="overdue-item-title">
      {{ itemData.title }}
    </div>
    <span class="overdue-item-level">
      <img
        v-for="(item, index) in getLevel(itemData.level)"
        :key="index"
        :src="item"
      >
    </span>
    <div class="overdue-item-nameState-box">
      <span
        class="overdue-item-name"
      >{{ itemData.userid?`${itemData.userid[0].dep_name}-${itemData.userid[0].name}`:"" }}</span>
      <div class="overdue-item-state">
        <span :style="{ color: '#F56C6C' }">{{ itemData.status === 1 ? "已逾期" : "已逾期完成" }}</span>
        <van-icon name="arrow" />
      </div>
    </div>

    <div class="overdue-item-time-box">
      {{ itemData.start_time |timeFormat("MM月DD日 HH:mm",itemData) }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["itemData"],
  data() {
    return {
      levelImg: [
        { 0: require(`@/assets/images/level0.png`) },
        { 1: require(`@/assets/images/level1.png`) },
        { 2: require(`@/assets/images/level2.png`) },
      ],
    };
  },
  watch: {
    itemData(newData, preData) {
      this.itemData = newData;
    },
  },
  methods: {
    getLevel(level) {
      const levelImg =
        level !== null ? require(`@/assets/images/level2.png`) : null;
      let imgs = [];
      for (let i = 0; i < Number(level) + 1; i++) {
        imgs.push(levelImg);
      }
      return imgs;
    },
  },
};
</script>

<style lang="less">
.overdue-item-box {
  padding: 10px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(48, 49, 51, 0.08);
  margin: 0 15px 15px;
  border-radius: 4px;
  .overdue-item-title {
    font-size: 14px;
    color: #303133;
  }

  .overdue-item-level {
    margin-top: 7px;
    display: inline-block;
    img {
      width: 12px;
      margin-right: 3px;
      position: relative;
      top: 2px;
    }
  }
  .overdue-item-nameState-box {
    display: flex;
    justify-content: space-between;
    .overdue-item-name {
      color: #909399;
      font-size: 14px;
      margin: 10px 0px 8px;
    }
    .overdue-item-state {
      font-size: 18px;
      color: #c0c4cc;
      display: flex;
      align-items: center;
    }
    i {
      top: 1px;
    }
  }
  .overdue-item-time-box {
    color: #f56c6c;
    font-size: 13px;
    background: linear-gradient(
      84deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 235, 235, 1) 100%
    );
    // opacity: 1;
    border-radius: 4px;
    display: inline-block;
    padding: 4px 15px 4px 0;
  }
}
</style>

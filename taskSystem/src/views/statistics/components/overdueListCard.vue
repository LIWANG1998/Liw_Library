<template>
  <div class="overdue-list-item">
    <div class="overdue-name">
      {{ cardData.name }}
    </div>
    <div class="overdue-flex">
      <van-icon name="arrow" />
      <div class="overdue-num">
        逾期{{ Number(cardData.number) }}次
      </div>
    </div>
    <div class="overdue-time">
      {{ cardData.time!=0?`最近逾期时间${cardData.time}`:"暂无" }}
    </div>
    <div class="overdue-line" />
    <div class="overdue-progress-box">
      <div
        class="overdue-progress"
        :style="{
          width: (Number(cardData.number) / Number(cardData.total)) * 100 + '%'
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["cardData", "urlType"],
  data() {
    return {};
  },
  watch: {
    cardData(newData, preData) {
      this.cardData = newData;
    },
  },
};
</script>

<style lang="less">
.overdue-list-item {
  margin: 0px 15px 15px;
  background: #fff;
  box-shadow: 0px 2px 4px rgba(48, 49, 51, 0.08);
  border-radius: 4px;
  padding: 13px 0 6px;

  .overdue-name {
    line-height: 24px;
    font-size: 17px;
    color: #000;
    padding: 0 11px;
  }
  .overdue-flex {
    display: flex;
    color: #f56c6c;
    font-size: 19px;
    align-items: center;
    line-height: 27px;
    flex-direction: row-reverse;
    padding: 0 11px;
    .van-icon {
      line-height: 27px;
      color: #c0c4cc;
      top: 1px;
    }
  }

  .overdue-time {
    font-size: 15px;
    line-height: 21px;
    color: #909399;
    padding: 0 11px;
  }
  .overdue-line {
    height: 1px;
    background: rgba(48, 49, 51, 0.08);
    width: 100%;
    margin-top: 10px;
  }
  .overdue-progress-box {
    padding: 6px 11px 0px;
    .overdue-progress {
      height: 21px;
      background: linear-gradient(
        90deg,
        rgba(254, 240, 240, 1) 0%,
        rgba(248, 151, 151, 1) 100%
      );
    }
  }
}
</style>

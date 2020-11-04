<template>
  <!-- 预览公文内容 -->
  <div class="preview init">
    <h2>发文单</h2>
    <div class="content-text" ref="content_text">
      <div class="line fir" v-for="(item,index) in view_data.fir" :key="'fir'+index">
        <div class="head">{{item.c_name}}</div>
        <div class="content">{{item.value}}</div>
      </div>
      <div class="line sec" v-for="(item,index) in view_data.sec" :key="'sec'+index">
        <div class="item" v-for="(item2) in item" :key="item2.e_name">
          <div class="head">{{item2.c_name}}</div>
          <div class="content">{{item2.value}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>


<style lang="scss" scoped>
//  预览公文内容
.preview {
  width: 750px;
  padding: 0 30px 30px 30px;
  h2 {
    text-align: center;
    color: #fa5555;
    margin-bottom: 20px;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
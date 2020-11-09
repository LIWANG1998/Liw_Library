<template>
  <a-row class="depart-box">
    <a-col :span="4" class="left-box">
      <framework
        @changeDepart="handlDepartChange"
        :reload.sync="reload"
      ></framework>
    </a-col>
    <a-col :span="20" class="right-box">
      <framework-list
        :departData="departData"
        @reload="reloadData"
      ></framework-list>
    </a-col>
  </a-row>
</template>
<script>
import framework from "./components/framework";
import frameworkList from "./components/frameworkList";
export default {
  data() {
    return {
      departData: "",
      reload: false
    };
  },
  components: {
    framework,
    frameworkList
  },
  methods: {
    handlDepartChange(data) {
      this.departData = data;
    },
    reloadData() {
      this.reload = true;
    }
  }
};
</script>
<style lang="less" scoped>
.depart-box {
  background: #fff;
  padding: 20px 10px;
  .title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .right-box {
    border-left: 1px solid #f6f6f6;
  }
}
</style>

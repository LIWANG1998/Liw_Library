<template>
  <div class="box">
    <van-search
      v-model="searchVal"
      @input.native="inputSearchInfo(searchVal)"
      @clear="clearData()"
      placeholder="请输入搜索关键词"
      input-align="center"
    />
    <div id="menu" class="tabs">
      <div v-if="lab == 1">
        <span @click="choise(1)" :class="{addColor:type==1}">发文</span>
        <span @click="choise(2)" :class="{addColor:type==2}">收文</span>
      </div>
      <div v-else></div>
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="selectVal"
          title="筛选"
          ref="item"
          :options="lab == 1 ? option1 : option2"
        />
      </van-dropdown-menu>
    </div>
    <div class="articleList">
      <articleList :doctype="type" :lab="lab" :selectVal="selectVal" :searchVal="searchVal"></articleList>
    </div>
  </div>
</template>

<script>
import  articleList from "./components/articleList";
import noData from "@/components/common/noData";
export default {
  components: {
    articleList,
    noData,
  },
  data() {
    return {
      searchVal: "", //搜索
      selectVal: "", //筛选
      lab: "", //1---我分发的，2---我接收的
      type: "1", //1发文，2收文，3签报
      isShow: false, //是否显示弹出层
      selectVal: 0,
      option1: [
        //lab为‘1’时的行筛选条件
        { text: "全部", value: 0 },
        { text: "处理中", value: 1 },
        { text: "已签收", value: 2 },
        { text: "被退回", value: 3 },
      ],
      option2: [
        //lab为‘2’时的行筛选条件
        { text: "全部", value: 4 },
        { text: "待查阅", value: 0 },
        { text: "待签收", value: 1 },
        { text: "已签收", value: 2 },
        { text: "已退回", value: 3 },
      ],
    };
  },
  methods: {
    init_data() {
      this.searchVal = ""; //搜索
      this.selectVal = ""; //筛选
      this.type = "1"; //1发文，2收文，3签报
      this.isShow = false; //是否显示弹出层
      this.selectVal = 0;
    },
    choise(val) {
      this.flag = !this.flag;
      this.type = val;
      if (this.lab == 1) {
        this.selectVal = 0;
      } else if (this.lab == 2) {
        this.selectVal = 4;
      }
    },
    // 输入搜索
    inputSearchInfo(val) {
      // console.log("搜索", val);
      if (this.lab == 1) {
        this.selectVal = 0;
      } else if (this.lab == 2) {
        this.selectVal = 4;
      }
    },
    //清空搜索框
    clearData() {},
  },
  created() {
    this.init_data();
    if (this.$route.query.lab) {
      this.lab = this.$route.query.lab;
    }
    if (this.lab == 1) {
      this.selectVal = 0;
    } else if (this.lab == 2) {
      this.selectVal = 4;
    }
  },
  activated() {
    this.init_data();
    if (this.$route.query.lab) {
      this.lab = this.$route.query.lab;
    }
    if (this.lab == 1) {
      this.selectVal = 0;
    } else if (this.lab == 2) {
      this.selectVal = 4;
    }
  },
  beforeRouteEnter(to, from, next) {
    document.title = to.query.title;
    next();
  },
};
</script>
<style lang="scss" scoped>
.tabs {
  display: flex;
  margin-top: 5px;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background-color: #fff;
  font-size: 16px;
  padding: 0 15px;
  justify-content: space-between;
  box-sizing: border-box;
  color: #303133;
  font-weight: 520;
  box-shadow: 0px 2px 8px rgba(48, 49, 51, 0.08);

  span {
    display: inline-block;
    margin-right: 30px;
  }

  .addColor {
    border-bottom: 2px solid #0082ef;
    color: #0082ef !important;
  }

  .filter {
    img {
      width: 15px;
      height: 15px;
      vertical-align: middle;
    }
  }
}
/*  筛选组件*/
/deep/.van-dropdown-menu__bar {
  height: 100% !important;
  box-shadow: 0 0 0 #fff !important;
}
</style>
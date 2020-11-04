<template>
  <div class="checked-box">
    <div class="checked-box-top">
      <van-search
        v-model="keywords"
        input-align="center"
        placeholder="请输入搜索关键词"
        @input="onSearchs"
        @clear="onClears"
      />
    </div>
    <div class="checked-box-content">
      <template v-if="lists.length>0">
        <van-cell v-for="item in lists" :key="item.w_id">
          <div class="pickclass-content-left">
            <img class="fileimg" :src="item.img" alt />
            <span class="pickclass-content-left-text">{{item.title}}</span>
          </div>
          <template #right-icon>
            <div class="pickclass-content-right" @click="delclick(item)">
              <img class="delicon" :src="delicon" alt />
            </div>
          </template>
        </van-cell>
      </template>
      <template v-else>
        <div class="no-data">
          <noData></noData>
        </div>
      </template>
    </div>
    <div class="pickclass-btn checked-box-btn">
      <van-button type="default" class="btn" @click="onCancelck">
        <span>返回</span>
      </van-button>
      <van-button type="info" class="btn" @click="onOkck">确认</van-button>
    </div>
  </div>
</template>
<script>
import { getDeptList, getTagsList, getListCompant } from "@/api/home";
import { addRoles } from "@/api/organization";
import { HttpUrl } from "@/js/public.js";
import { debounce } from "@/js/public.js";
import noData from "@/components/common/noData";
export default {
  components: {
    noData,
  },
  name: "selectpage",
  data() {
    return {
      delicon: require("@/assets/img/pickclass/delicon.png"),
      keywords: "", // 搜索关键字
      lists: [],
    };
  },
  computed: {
    fields_data() {
      return this.$store.state.edittext.document_arrs;
    },
    item() {
      return this.$route.query.type == 1
        ? this.$store.state.processNew[this.keys]
        : this.$store.state.edittext.document_arrs[this.keys];
    },
    pel() {
      return this.$store.state.edittext.pel;
    },
    turnUser() {
      return this.$store.state.processNew.turnUser;
    },
    navcell() {
      return 12345;
    },
  },
  methods: {
    // 深拷贝
    StoP(a) {
      return JSON.parse(JSON.stringify(a));
    },
    // 图片路径处理
    imgTo(urls) {
      let text = String(urls).startsWith("http");
      let imgurl = "";
      if (text) {
        imgurl = urls;
      } else {
        imgurl = this.HttpUrl + urls;
      }
      return imgurl;
    },
    // onSearchs() {
    //   this.lists = [];
    //   this.pel.results.forEach((v, i) => {
    //     let reg = RegExp(this.keywords);
    //     if (reg.test(v.title)) {
    //       this.lists.push(v);
    //     }
    //   });
    //   // console.log(this.lists);
    // },
    onSearchs: debounce(function () {
      this.lists = [];
      this.pel.results.forEach((v, i) => {
        let reg = RegExp(this.keywords);
        if (reg.test(v.title)) {
          this.lists.push(v);
        }
      });
      // console.log(this.lists);
    }, 550),
    onClears() {
      this.lists = this.pel.results;
      // console.log(this.keywords);
    },
    // 删除选中的
    delclick(item) {
      var _i = this.lists.map((v) => v.w_id).indexOf(item.w_id);
      this.lists.splice(_i, 1);
      var i = this.pel.results.map((v) => v.w_id).indexOf(item.w_id);
      this.pel.results.splice(i, 1);
      this.pel.result.splice(i, 1);
    },
    onCancelck() {
      this.$router.go(-1);
    },
    onOkck() {
      this.$router.go(-1);
    },
  },
  created() {},
  activated() {
    this.lists = JSON.parse(JSON.stringify(this.pel.results));
  },
};
</script>
<style lang="scss" scoped>
.checked-box {
  height: 100%;
  .checked-box-top {
    height: 53px;
  }
  .checked-box-content {
    height: calc(100% - 53px - 60px);
    overflow-y: auto;
    .no-data {
      margin: 0 auto;
      text-align: center;
    }
  }
  .pickclass-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 15px;
    background-color: white;
    box-shadow: 0px -1px 0px rgba(230, 230, 230, 1);
    .btn {
      width: 187px;
      /deep/ .van-button__text {
        display: flex;
        justify-content: center;
        align-items: center;
        .btnback {
          color: #0082ef;
          font-size: 18px;
          transform: rotateY(180deg);
          margin-right: 10px;
        }
      }
    }
  }
}
.pickclass-content-left {
  display: flex;
  align-items: center;
  .fileimg {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
  .pickclass-content-left-text {
    font-size: 15px;
    margin-left: 15px;
  }
}
.pickclass-content-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30px;
  .delicon {
    width: 16px;
  }
}
</style> 
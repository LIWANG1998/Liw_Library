<template>
  <div class="box">
    <van-search v-model="searchValue" placeholder="关键词" input-align="center" @input="search" />
    <!-- 列表 -->
    <div class="division"></div>
    <div v-if="tepList && tepList.length < 1" class="noData">没有更多数据了</div>
    <van-radio-group v-if="tepList.length > 0" class="teps" v-model="radio">
      <template v-for="(item,index) in tepList">
        <div class="tep" :key="index">
          <img :src="redimg" alt @click="lookRed(item)" />
          <div class="title">
            <div>
              <span class="title-font">{{item.name}}</span>
              <span class="used" v-show="item.is_default==1">常用</span>
            </div>
            <div>
              {{item.username}}
              <span class="vertical">|</span>
              {{item.create_time}}
            </div>
          </div>
          <van-radio :name="item.id" @click="changeTep(item)"></van-radio>
        </div>
      </template>
    </van-radio-group>
    <div class="buttonbox">
      <van-button type="default" class="cancel" @click="cancel">取消</van-button>
      <van-button color="#0082EF" class="ensure" @click="submitBtn">确定</van-button>
    </div>
  </div>
</template>

<script>
import { redTemplateList } from "@/api/home";
import { debounce } from "@/js/public.js";
export default {
  data() {
    return {
      title_text: "",
      redimg: require("@/assets/img/document/red-img.png"),
      searchValue: "",
      radio: "",
      tepList: [],
      choiseTep: {}, //选择的规则
    };
  },
  computed: {
    red() {
      return this.$store.state.edittext.red;
    },
  },
  methods: {
    // 查看桃红模板
    lookRed(ie) {
      // console.log(ie);
      this.$router.push({ path: "/lookred", query: { content: ie.content } });
    },
    //选中的值
    changeTep(item) {
      this.choiseTep = item;
    },
    search: debounce(function () {
      this.getRedTemplateList();
    }, 850),
    cancel() {
      this.$router.go(-1);
    },
    //取消
    //提交
    submitBtn() {
      this.red.value = [];
      this.red.is_default = this.choiseTep.is_default; // 是不是常用
      if (this.radio != "") this.red.value.push(this.choiseTep);
      this.$router.go(-1);
    },
    //获取套红模板列表
    getRedTemplateList() {
      redTemplateList({
        keyword: this.searchValue,
        sort: "DESC",
        type: this.red.type,
      }).then((res) => {
        if (res.code == 1) {
          this.tepList = res.data.data ? res.data.data : [];
          // console.log(this.tepList, " this.tepList");
        }
      });
    },
  },
  //   created() {
  //     this.getRedTemplateList();
  //   },
  activated() {
    this.red.value.length > 0 ? (this.radio = this.red.value[0].id) : "";
    this.getRedTemplateList();
  },
  //   mounted() {
  //     this.getRedTemplateList();
  //   },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
/deep/.van-search {
  height: 48px;
}
.box {
  background-color: #fff;
  height: 100%;
  .division {
    height: 10px;
    background-color: #f2f2f2;
  }
  .teps {
    height: calc(100% - 48px - 10px - 57px);
    overflow-y: auto;
  }
  .tep {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid #f4f4f4;
    .title {
      width: 300px;
      height: 56px;
      .title-font {
        font-size: 16px;
        font-weight: 500;
      }
      .used {
        font-size: 12px;
        color: rgba(131, 156, 207, 1);
        background: rgba(234, 240, 252, 1);
        border-radius: 2px;
        padding: 2px 5px;
        margin-left: 6px;
      }
      .vertical {
        display: inline-block;
        margin: 0 8px;
      }
      div:nth-child(1) {
        margin: 4px 0 11px 0;
        font-size: 16px;
        color: #303133;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      div:nth-child(2) {
        font-size: 11px;
        color: #909399;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    img {
      display: block;
      width: 44px;
      height: 56px;
      margin-right: 15px;
      transform: scale(1.3);
    }
  }
}
.buttonbox {
  width: 100%;
  background-color: #ffffff;
  height: 57px;
  line-height: 57px;
  color: #303133;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #e6e6e6;

  .cancel {
    width: 187px;
    height: 44px;
    margin-right: 10px;
  }

  .ensure {
    width: 187px;
    height: 44px;
    color: #303133;
  }
}
.noData {
  width: 100%;
  height: 60px;
  line-height: 60px;
  color: #cccccc;
  text-align: center;
}
</style>
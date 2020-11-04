<template>
  <div class="elesign">
    <div
      class="elesign-top"
      :class="
        ele.zhiqian.length > 0 || ele.item.length > 0
          ? 'elesign-h2'
          : 'elesign-h1'
      "
      v-if="ele.zhiqian.length > 0 || ele.item.length > 0"
    >
      <template v-if="ele.zhiqian.length > 0 || ele.item.length > 0">
        <template v-for="(item, index) in ele.zhiqian">
          <div class="elesign-top-box flex-ac-jc" :key="'z' + index">
            <img :src="img(item)" alt />
          </div>
        </template>
        <template v-for="(item, index) in ele.item">
          <div class="elesign-top-box flex-ac-jc" :key="index">
            <img :src="img(item)" alt />
            <div class="close-icons flex-ac-jc" @click="closeEleFun(index)">
              <van-icon name="cross" />
            </div>
          </div>
        </template>
      </template>
      <!-- <template v-else>
        <div class="no_data">暂无签章</div>
      </template>-->
      <!-- <div class="elesign-top-box flex-ac-jc" v-if="eleitemlh">
        <div class="close-icons flex-ac-jc" @click="closeEleFun">
          <van-icon name="cross" />
        </div>
        <img :src="img(ele.item[0].img)" alt />
      </div>-->
    </div>
    <div class="elesign-bottom">
      <div class="elesign-bottom-left">上次签章</div>
      <div class="elesign-bottom-right" @click="type_showFun">
        选择签章
        <van-icon name="arrow" class="arrow-icon" color="#DCDFE6" size="18" />
      </div>
    </div>
    <!-- 选择签章类型 -->
    <van-popup class="type-show-box" v-model="type_show" position="bottom">
      <template v-for="(item, index) in item_type">
        <div
          class="type-show-box-cell cell-bb"
          :key="index"
          @click="openType(item.type)"
        >
          {{ item.title }}
        </div>
      </template>
      <div class="type-show-box-cell cell-close" @click="type_showClose">
        取消
      </div>
    </van-popup>
    <!-- 签字 -->
    <van-popup
      v-model="sign.show"
      @close="sign_close"
      position="bottom"
      class="sign-model"
    >
      <div class="tips">
        <div class="icon"></div>
        <span>请在下面的签字区域签字</span>
      </div>
      <div class="region">
        <vue-esign class="esign" :height="225" id="esign" ref="esign" />

        <span class="clear" @click="handleReset">清除</span>
      </div>
      <div class="sign-btns">
        <van-button type="default" @click="sign.show = false">取消</van-button>
        <van-button type="info" @click="handleGenerate">确定</van-button>
      </div>
    </van-popup>
    <!-- 选择电子签章 -->
    <!-- <van-popup v-model="ele.type_ele" position="left" :style="{ height: '100%' ,width: '100%' }">
      <check-elesign :ele="ele" />
    </van-popup>-->
  </div>
</template>
<script>
import checkElesign from "@/components/CheckElesign";
import { HttpUrl } from "@/js/public.js";
import { dataURLtoFile, saveFile_sign } from "@/assets/js/public.js";
export default {
  components: {
    checkElesign,
  },
  name: "EleSign",
  props: {
    ele: {
      type: Object,
    },
  },
  data() {
    return {
      zhiqian: [],
      //签字
      sign: {
        show: false,
        imgUrl: null,
      },
      HttpUrl,
      type_show: false, //选择类型弹窗
      item_type: [
        {
          title: "签字",
          type: 1,
        },
        {
          title: "电子签章",
          type: 2,
        },
      ],
    };
  },
  created() {
    // console.log(this.ele);
  },
  activated() {
    this.type_show = false;
  },
  computed: {
    eleitemlh() {
      // console.log("this.ele.item", this.ele.item);
      return this.ele.item.length > 0;
    },
    img() {
      return (v) => {
        let q_base64 = "data:image/png;base64,";
        return q_base64 + v.img_data;
      };
    },
  },
  methods: {
    // 打开选择框
    type_showFun() {
      this.type_show = true;
      // console.log(this.type_show);
    },
    // 关闭选择框
    type_showClose() {
      this.type_show = false;
    },
    // 开打对应的签章弹窗
    openType(t) {
      // console.log(t);
      t == 2 ? this.typeEle() : this.typeSign();
    },
    // 打开选择电子签章
    typeEle() {
      this.type_show = false;
      this.$router.push({
        path: "/checkelesign",
      });
    },
    // 打开选择手签
    typeSign() {
      this.type_show = false;
      this.sign.show = true;
    },

    // 移除
    closeEleFun(n) {
      this.ele.item.splice(n, 1);
    },
    //关闭详情弹窗的时候
    sign_close() {
      this.handleReset();
    },
    // 签字
    handleReset() {
      this.$refs.esign.reset();
    },
    // 签章层级初始化
    initsuSpend() {
      let a_zindex= 500;
      let ele_arr = [...this.ele.zhiqian, ...this.ele.item];
      if( ele_arr.length > 0){
        let _max = ele_arr.reduce((a, b) => {
          return b.position.zindex > a?.position?.zindex ? b : a;
        });
        a_zindex =_max.position.zindex + 1;
      }
      return a_zindex;
    },
    async handleGenerate() {
      this.$refs.esign
        .generate()
        .then((res) => {
          this.sign.imgUrl = res;
          let file = dataURLtoFile(
            this.sign.imgUrl,
            Date.parse(new Date()) + "" + Math.round(Math.random() * 10000)
          );
          saveFile_sign(file, (res) => {
            // console.log("his.ele.item.push", res);
            this.ele.item.push({
              type: 100,
              // id: res.oldname,
              img: res.path,
              signature_id: "",
              signature_img: res.path,
              signature_base: this.sign.imgUrl.replace(
                "data:image/png;base64,",
                ""
              ),
              img_data: this.sign.imgUrl.replace("data:image/png;base64,", ""),
              position: {
                left: 400 - 142,
                top: 120,
                zindex: this.initsuSpend(),
                width: 142,
              },
            });
          });
          this.sign.show = false;
          this.$toast("签章设置成功，请到预览中调整位置大小");
        })
        .catch((err) => {
          // console.log(err);
          this.$notify({ type: "danger", message: "签字错误" });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
// 上下 左右 剧中
.flex-ac-jc {
  display: flex;
  align-items: center;
  justify-content: center;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.elesign-h1 {
  height: 157px;
}
.elesign-h2 {
  height: 57px;
}
.elesign {
  box-shadow: 0px -1px 1px rgba(0, 0, 0, 0.1);
  .elesign-top {
    position: relative;
    height: 100px;
    // background-color: violet;
    padding: 0 20px 20px;
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    .elesign-top-box {
      width: 96px;
      height: 96px;
      margin: 20px 13px 0;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(230, 230, 230, 1);
      position: relative;
      img {
        max-width: 90px;
        max-height: 90px;
      }
      .close-icons {
        top: -10px;
        right: -10px;
        position: absolute;
        height: 20px;
        width: 20px;
        color: white;
        background-color: #e6e6e6;
        border-radius: 50%;
      }
    }
    .no_data {
      font-size: 16px;
      margin: 0 auto;
      margin-top: 20px;
    }
  }
  .elesign-bottom {
    position: relative;
    z-index: 1;
    height: 57px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -1px 1px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    .elesign-bottom-left {
      font-size: 13px;
    }
    .elesign-bottom-right {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #0082ef;
      font-weight: 500;
      .arrow-icon {
        margin-left: 10px;
      }
    }
  }
  .type-show-box {
    padding: 0 14px 4px;
    border-radius: 8px 8px 0px 0px;
    .type-show-box-cell {
      line-height: 56px;
      text-align: center;
      font-size: 17px;
      color: #303133;
    }
    .cell-bb {
      border-bottom: 1px #f3f3f3 solid;
      font-weight: 500;
    }
    .cell-close {
      font-weight: 400;
      font-size: 16px;
      color: #909399;
    }
  }
  .sign-model {
    padding: 30px 25px;
    box-sizing: border-box;
    .tips {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 21px;
        height: 26px;
        background: url("../assets/img/seal/sign.png");
        background-size: 21px 26px;
        margin-right: 10px;
      }
      span {
        color: #303133;
        font-size: 16px;
      }
    }
    .region {
      position: relative;
      margin-top: 26px;
      height: 225px;
      border: 1px dashed rgba(220, 223, 230, 1);
      border-radius: 2px;

      .clear {
        position: absolute;
        bottom: 10px;
        right: 15px;
        color: #f56c6c;
        font-size: 16px;
      }
    }
    .sign-btns {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      margin-top: 24px;
      button {
        flex: 1;
        margin-right: 12px;
      }
    }
  }
}
</style>
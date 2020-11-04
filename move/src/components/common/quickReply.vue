<template>
  <div class="content">
    <div class="title">
      <div class="titBtn">
        <p @click="changeShowPage('cancel')">取消</p>
        <p style="font-size: 17px">快捷回复</p>
        <p @click="changeShowPage('sure')">确定</p>
      </div>
      <p style="color: #C0C4CC;size: 13px;line-height: 30px">长按可删除回复内容</p>
    </div>
    <div class="list">
      <div class="listItem">
        <van-checkbox-group v-model="radio" @change="changeRadio">
          <van-checkbox v-for="item in nimbleList" :name="item.id" :key="item.id">
            <div
              @touchstart="start(item)"
              @touchmove="(e)=>{move(e)}"
              @touchend="end(item)"
              style="width:100%;display: flex;align-items: center;justify-content: space-between"
            >
              <span class="message">{{item.content}}</span>
              <van-icon @click="onReply('edit',item)" name="edit" />
            </div>
          </van-checkbox>
        </van-checkbox-group>
      </div>
    </div>
    <div v-if="nimbleList.length < 10" class="btn">
      <div @click="onReply('add')" class="addBtn">
        <van-icon color="#0082EF" name="add" />
        <span>新增快捷回复</span>
      </div>
    </div>
    <!--        &lt;!&ndash;        新增快捷回复&ndash;&gt;-->
    <!--        <van-popup v-model="showUpdataReply" position="right" :style="{ height: '100%',width:'100%'}" >-->
    <!--            <updata-reply :content="content" @handleChangePage =handleChangePage($event)></updata-reply>-->
    <!--        </van-popup>-->
  </div>
</template>

<script>
import bus from "@/assets/js/replyBus.js";
import { getNimbleList, delNimbleList } from "@/api/nimble.js";
import updataReply from "./updataReply";

export default {
  name: "quickReply",
  components: {
    updataReply,
  },
  data() {
    return {
      radio: [],
      show: false,
      nimbleList: [], //快捷回复列表
      type: "cancel", //cancel：关闭编辑页，add:新增，edit:编辑,close:新增或编辑后关闭
      longClick: 0,
      timeOutEvent: 0,
      message: [],
      showUpdataReply: false,
      content: {
        type: "cancel", //cancel：关闭编辑页，add:新增，edit:编辑,close:新增或编辑后关闭
        id: "",
        message: "",
      },
    };
  },
  props: {
    showReply: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    // type:{
    //     handler:function (val) {
    //         if (val) {
    //             // console.log(val)
    //             if (val !== 'cancel'){
    //                 this.getNimble()
    //             }
    //         }
    //     }
    // },
    showReply: {
      handler: function (val, oldVal) {
        if (!val && oldVal) {
          this.$emit("getmessage", this.message);
        }
        if (val == true) {
          this.getNimble();
        }
      },
    },
  },
  methods: {
    async getNimble() {
      let res = await getNimbleList();
      this.nimbleList = res.data;
      // console.log(res.data, this.nimbleList);
    },
    start(item) {
      // console.log(item);
      let that = this;
      this.longClick = 0;
      this.timeOutEvent = setTimeout(function () {
        that.$dialog.confirm({
          title: '提示',
          message: '确认要删除此条快捷回复吗？',
        })
            .then(() => {
              // on confirm
              //长按
              that.longClick = 1;
              delNimbleList({ id: item.id }).then((res) => {
                if (res && res.code == 1) {
                  getNimbleList().then((res) => {
                    that.nimbleList = res.data;
                  });
                  that.$toast.success(res.msg);
                } else {
                  that.$toast.fail(res.msg);
                }
              });
            })
            .catch(() => {
              // on cancel
            });

      }, 1000);
    },
    move(e) {
      // console.log(e);
      clearTimeout(this.timeOutEvent);
      this.timeOutEvent = 0;
      //   e.preventDefault();
      // console.log("这是滑动");
    },
    end(item) {
      clearTimeout(this.timeOutEvent);
      if (this.timeOutEvent != 0 && this.longClick == 0) {
        //点击
      }
      return false;
    },
    //新增修改快捷回复
    onReply(type, item = { id: "", content: "" }) {
      //type:add,edit
      // // console.log(type, item)
      // this.showUpdataReply = true
      this.content = {
        type: type,
        id: item.id,
        message: item.content,
      };
      this.$router.push({
        path: "/updataReply",
        query: { content: this.content },
      });
    },
    //选中快捷回复
    changeRadio(val) {
      this.message = [];
      this.nimbleList.forEach((item) => {
        this.radio.forEach((items) => {
          if (item.id == items) {
            this.message.push(item.content);
          }
        });
      });
    },
    //确定修改或新增后
    handleChangePage(type) {
      this.showUpdataReply = false;
      if (type == "close") {
        this.getNimble();
      }
    },
    //向父组件传值
    changeShowPage(type) {
      let _message = this.message.length > 0 ? this.message.join("\n") : "";
      let _data = {
        type: type,
        message: _message,
      };
      this.$emit("getmessage", _data);
      this.radio = [];
      this.message = [];
    },
  },
  created() {
    this.getNimble();
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  box-sizing: border-box;
  padding: 5px 10px;
}
.titBtn {
  color: #303133;
  size: 17px;
  display: flex;
  justify-content: space-between;
}

.title {
  height: 60px;
  text-align: center;
  /*padding-top: 15px;*/
}

.list {
  height: calc(100% - 20px - 60px - 40px);
  padding: 0 15px 15px;
  overflow: auto;
  .listItem {
    /deep/ .van-checkbox-group {
      // overflow: scroll;
      .van-checkbox {
        height: 56px;
        line-height: 56px;
        display: flex;
        border-bottom: 1px solid #f0f0f0;

        .van-checkbox__icon {
          flex: 0 0 auto;
        }
        .van-checkbox__label {
          flex: 1 1 auto;
        }
      }
    }
  }
}

.btn {
  height: 40px;
  width: 100%;
  /*position: fixed;*/
  /*bottom: 0;*/

  .addBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0082ef;
    height: 44px;
    background: #f1f3f5;

    span {
      color: #0082ef;
    }
  }
}
.message {
  display: inline-block;
  max-width: 90%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
<template>
  <div
    @touchmove.prevent
    class="lookDetail"
    @click="goAuditPage()"
    ref="dragBox"
    @touchstart="touchstartHandle('dragBox',$event)"
    @touchmove="touchmoveHandle('dragBox',$event)"
  >
    <div v-if="isShowPage == 1">
      <span v-if="can_approval == 1">立即审核</span>
      <span v-else>审核详情</span>
    </div>
    <div v-else-if="isShowPage == 2">公文详情</div>
  </div>
</template>

<script>
import look from "../../assets/js/lookDetail";
export default {
  props: {
    isShowPage: {
      //显示公文详情还是审核详情        1-按钮明‘审核详情’,2-'公文详情'
      default: () => "",
    },
    can_approval:{
      default:() => 2
    }
  },

  data() {
    return {
      coordinate: {
        client: {},
        elePosition: {},
      },
    };
  },
  methods: {
    //  去审核页面
    goAuditPage(id) {
      look.$emit("lookApro", 1);
      this.$emit("saveeleid");
      // this.$router.push({
      //   path: `/collect/1`,
      //   query: {
      //     docId: this.fid, //公文id
      //     where: this.where, //流程id
      //     type: this.type, //发文类型
      //     temId: this.temId //模板id
      //   }
      // });
    },
    touchstartHandle(refName, e) {
      let element = e.targetTouches[0];
      // 记录点击的坐标
      this.coordinate.client = {
        x: element.clientX,
        y: element.clientY,
      };
      // 记录需要移动的元素坐标
      this.coordinate.elePosition.left = this.$refs[refName].offsetLeft;
      this.coordinate.elePosition.top = this.$refs[refName].offsetTop;
    },
    touchmoveHandle(refName, e) {
      let element = e.targetTouches[0];
      // 根据初始 client 位置计算移动距离(元素移动位置=元素初始位置+光标移动后的位置-光标点击时的初始位置)
      let x =
        this.coordinate.elePosition.left +
        (element.clientX - this.coordinate.client.x);
      let y =
        this.coordinate.elePosition.top +
        (element.clientY - this.coordinate.client.y);
      // 限制可移动距离，不超出可视区域
      x =
        x <= 0
          ? 0
          : x >= innerWidth - this.$refs[refName].offsetWidth
          ? innerWidth - this.$refs[refName].offsetWidth
          : x;
      y =
        y <= 0
          ? 0
          : y >= innerHeight - this.$refs[refName].offsetHeight
          ? innerHeight - this.$refs[refName].offsetHeight
          : y;
      // 移动当前元素
      this.$refs[refName].style.left = x + "px";
      this.$refs[refName].style.top = y + "px";
    },
  },
  watch: {
    where(newValue, oldValue) {
      // console.log(newValue, "newValue");
    },
    isShowPage: {
      immediate: true,
      handler: function (val) {
        if (val && val == 1) {
          //公文详情页
          this.dis = "审核详情";
        } else if (val && val == 2) {
          //审核详情页
          this.dis = "公文详情";
        }
      },
    },
    can_approval:{
      handler:function (val) {
        // console.log('就是看到房价', val)
      }
    }
  },
};
</script>

<style scoped lang="scss">
.lookDetail {
  position: fixed;
  right: 10px;
  bottom: 25%;
  z-index: 99;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #e5e5e5;
  padding: 2px;
  div {
    display: block;
    font-size: 12px;
    margin-left: 8px;
  }
}
</style>
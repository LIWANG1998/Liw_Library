<!-- 拖拽滑动 -->
<template>
  <div
    id="default_drag_comp"
    class="default_drag_comp"
    @touchstart.stop="down"
    @touchmove.stop="move"
    @touchend.stop="end"
    :style="{zIndex:item.position.zindex,left:`${item.position.left}px`,top:`${item.position.top}px`,width:`${item.position.width}px`}"
  >
    <img :src="img(item)" alt />
    <div class="red-del" @click="closeEleFun">
      <svg-icon iconClass="red-del" />
    </div>
    <div class="suo-fang" @touchstart.stop="downS" @touchmove.stop="moveS" @touchend.stop="endS">
      <svg-icon iconClass="suo-fang" />
    </div>
  </div>
</template>

<script>
import { HttpUrl } from "@/js/public.js";
import { IndexAnchor } from "vant";
export default {
  name: "SuSpend",
  data() {
    return {
      zIndex: 500, // 基础高度
      zNum: 0, // 签章个数
      flags: false,
      flagss: false,
      position: { x: 0, y: 0 },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      disX: 0,
      disY: 0,
      disW: 0,
      disH: 0,
    };
  },
  props: {
    item: {
      type: Object,
    },
    i: {
      type: Number,
    },
    div: {
      type: String,
    },
  },
  components: {},

  computed: {
    img() {
      return (v) => {
        
        let q_base64 = "data:image/png;base64,";
        // console.log(q_base64 + v.img_data);
        return q_base64 + v.img_data;
      };
    },
  },

  mounted() {
    this.zNum = document.querySelectorAll(".default_drag_comp").length;
  },

  methods: {
    // 删除章
    closeEleFun() {
      this.$emit("closeEleFun");
    },
    // 实现移动端拖拽
    downS(e) {
      let suofang = document.querySelectorAll(".default_drag_comp")[this.i];
      this.flagss = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.disX = touch.clientX;
      this.disY = touch.clientY;
      this.disW = suofang.offsetWidth; // 获取拖拽前p的宽
      // this.disH = suofang.offsetHeight; // 获取拖拽前p的高
    },
    moveS(event) {
      event.preventDefault();
      let suofang = document.querySelectorAll(".default_drag_comp")[this.i];
      if (this.flagss) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        //拖拽时为了对宽和高 限制一下范围，定义两个变量

        var W = touch.clientX - this.disX + this.disW;
        // var H = touch.clientY - this.disY + this.disH;

        if (W < 120) {
          W = 120;
        }
        if (W > 142) {
          W = 142;
        }
        // if (H < 100) {
        //   H = 100;
        // }
        // if (H > 500) {
        //   H = 500;
        // }
        suofang.style.width = W + "px"; // 拖拽后物体的宽
        // suofang.style.height = H + "px"; // 拖拽后物体的高
      }
    },
    //鼠标释放时候的函数
    endS() {
      this.flagss = false;
      this.item.position.width = document.querySelectorAll(
        ".default_drag_comp"
      )[this.i].offsetWidth;
    },
    // 实现移动端拖拽
    down() {
      this.$emit("suSpendFun");
      let default_drag_comp = document.querySelectorAll(".default_drag_comp")[
        this.i
      ];

      this.flags = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.maxW =
        document.querySelectorAll(this.div)[0].clientWidth -
        default_drag_comp.offsetWidth;
      this.maxH =
        document.querySelectorAll(this.div)[0].clientHeight -
        default_drag_comp.offsetHeight;
      this.position.x = touch.clientX - default_drag_comp.offsetLeft;
      this.position.y = touch.clientY - default_drag_comp.offsetTop;
      this.dx = touch.clientX;
      this.dy = touch.clientY;
    },
    move(event) {
      event.preventDefault();
      let default_drag_comp = document.querySelectorAll(".default_drag_comp")[
        this.i
      ];
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;

        if (this.nx < 0) {
          this.nx = 0;
        } else if (this.nx > this.maxW) {
          this.nx = this.maxW;
        }

        if (this.ny < 0) {
          this.ny = 0;
        } else if (this.ny >= this.maxH) {
          this.ny = this.maxH;
        }

        default_drag_comp.style.left = this.nx + "px";
        default_drag_comp.style.top = this.ny + "px";
        //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
        document.addEventListener(
          "touchmove",
          function () {
            event.preventDefault();
          },
          false
        );
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false;
      this.item.position.left = this.nx;
      this.item.position.top = this.ny;
    },
  },
};
</script>
<style scoped lang="scss">
#default_drag_comp {
  width: 100px;
  //   background-color: pink;
  position: absolute;
  .red-del {
    position: absolute;
    top: 0;
    right: 0;
  }
  .suo-fang {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  img {
    max-width: 100%;
  }
}
</style>
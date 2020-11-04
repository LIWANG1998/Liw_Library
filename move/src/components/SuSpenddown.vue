<!-- 拖拽滑动 -->
<template>
  <div
    id="default_drag_comps"
    class="default_drag_comps"
    :style="{zIndex:item.position.zindex,left:`${item.position.left}px`,top:`${item.position.top}px`,width:`${item.position.width}px`}"
  >
    <img :src="img(item)" alt />
  </div>
</template>

<script>
import { HttpUrl } from "@/js/public.js";
import { IndexAnchor } from "vant";
export default {
  name: "SuSpenddown",
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
        // let _img = v?.img ? v?.img : v?.signature_img;
        // let text = String(_img).startsWith("http");
        // let imgurl = "";
        // if (text) {
        //   imgurl = _img;
        // } else {
        //   imgurl = HttpUrl + _img;
        // }
        // console.log(q_base64 + v.img_data);
        return q_base64 + v.img_data;
      };
    },
  },
  created() {
    // console.log(this.item);
  },
  mounted() {
    this.zNum = document.querySelectorAll(".default_drag_comps").length;
  },

  methods: {
    getBase64(imgUrl) {
      window.URL = window.URL || window.webkitURL;
      var xhr = new XMLHttpRequest();
      xhr.open("get", imgUrl, true);
      // 至关重要
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status == 200) {
          //得到一个blob对象
          var blob = this.response;
          // console.log("blob", blob);
          // 至关重要
          let oFileReader = new FileReader();
          oFileReader.onloadend = function (e) {
            // 此处拿到的已经是 base64的图片了
            let base64 = e.target.result;
            // console.log("方式一》》》》》》》》》", base64);
          };
          oFileReader.readAsDataURL(blob);
          //====为了在页面显示图片，可以删除====
          var img = document.createElement("img");
          img.onload = function (e) {
            window.URL.revokeObjectURL(img.src); // 清除释放
          };
          let src = window.URL.createObjectURL(blob);
          img.src = src;
          //document.getElementById("container1").appendChild(img);
          //====为了在页面显示图片，可以删除====
        }
      };
      xhr.send();
    },
  },
};
</script>
<style scoped lang="scss">
#default_drag_comps {
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
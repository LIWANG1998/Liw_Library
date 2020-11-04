<template>
  <div class="detail">
    <div class="fileContent">
      <svg-icon
        @click="openpages(file.path)"
        :iconClass="icon_img(file.path)"
        class="file-icon"
      />
      <div class="textDetail" @click="openpages(file.path)">
        <div class="name" v-if="file.old_name">{{ file.old_name }}</div>
        <div class="name" v-if="file.oldname">{{ file.oldname }}</div>
      </div>
    </div>
    <a
      v-if="file.id && is_and"
      class="imgBox"
      :href="url + `?id=${file.id}&type=1&token=${token}`"
      :download="file.oldname"
    >
      <img
        class="img"
        style="width: 10px"
        src="@/assets/img/newImg/gload.png"
        alt
      />
    </a>
    <!--        新上传的附件可删除-->
    <div v-if="!file.id" class="imgBox">
      <img
        class="img"
        style="width: 16px; height: 16px"
        @click="delFile(file)"
        src="@/assets/img/newImg/del.png"
      />
    </div>
  </div>
</template>

<script>
import { url } from "@/utils/utils.js";
import { get_file_img, openpage } from "@/assets/js/public.js";
export default {
  name: "loadFile",
  data() {
    return {
      url: `${url}/red_template_download/`,
    };
  },
  props: {
    file: {
      type: Object,
      default: () => {},
    },
    authLoad: {
      //是否有权下载
      type: Boolean,
      default: undefined,
    },
  },
  methods: {
    openpages(el) {
      openpage(el);
    },
    delFile(file) {
      this.$emit("delFile", file);
    },
  },
  watch: {
    file: {
      immediate: true,
      handler: function (val) {
        // console.log("file组件file", val);
      },
    },
    // authLoad: {
    //     immediate: true,
    //     handler: function (val) {
    //         // console.log('file组件authLoad', val);
    //     }
    // }
  },
  computed: {
    icon_img() {
      return (v) => {
        return get_file_img(v);
      };
    },
    is_and() {
      return this.$store.state.andriod_ios;
    },
  },
  created() {
    this.token = sessionStorage.getItem("token");
  },
};
</script>

<style lang="scss" scoped>
.detail {
  background: #f9f9f9;
  /*width: 382px;*/
  margin: 0 auto;
  height: 40px;
  border-radius: 2px;
  border: 1px solid rgba(217, 217, 217, 1);
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;

  .fileContent {
    display: flex;
    align-items: center;
    width: 95% !important;
    // width: 99%;
    .file-icon {
      width: 22px;
      height: 24px;
    }
    .oldName {
      width: 280px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .textDetail {
      margin-left: 12px;

      div:nth-child(2) {
        color: #9b9b9b;
        font-size: 14px;
      }
      .name {
        max-width: 280px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .imgBox {
    /*vertical-align: middle;*/
    padding: 0;
    height: 16px;

    > img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
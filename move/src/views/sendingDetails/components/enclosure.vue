<template>
  <div class="box">
    <div class="filebox">
      <div class="upload">
        <div class="fileContent">
          <img src="@/assets/img/home/sfile.png" alt />
          附件内容
        </div>
        <a
          class="all"
          :href="addUrl + `?document_id=${d_id}&type=2&token=${token}`"
          download
          v-if="allfile.length != 0 && authLoad && is_and"
        >
          <img src="@/assets/img/home/all.png" alt />
          全部下载
        </a>
      </div>
      <!-- 附件列表 -->
      <template v-if="allfile.length != 0">
        <div
          class="detail flex-ac"
          v-for="(item, index) in allfile"
          :key="'q' + index"
        >
          <svg-icon
            @click="openpages(item.path)"
            :iconClass="icon_img(item.path)"
            class="file-icon"
          />
          <div @click="openpages(item.path)" class="oldName">
            {{ item.old_name }}
          </div>
          <a
            v-if="authLoad && is_and"
            class="file-del"
            :href="`${urls}?id=${item.id}&type=1&token=${token}`"
          >
            <svg-icon iconClass="up-down" />
          </a>
        </div>
      </template>
      <template v-if="enclosure_file.length != 0">
        <div
          class="detail flex-ac"
          v-for="(item, index) in enclosure_file"
          :key="'h' + index"
        >
          <svg-icon :iconClass="icon_img(item.path)" class="file-icon" />
          <div class="oldName">{{ item.oldname }}</div>
          <div class="file-del" @click="delFile(item)">
            <svg-icon iconClass="file-del" />
          </div>
        </div>
      </template>
      <NoData v-if="enclosure_file.length == 0 && allfile.length == 0" />
      <div v-if="can_approval == 1 ? true : false">
        <van-uploader class="upFile" :after-read="enclosure">
          <van-button icon="plus" color="#0082EF" block>上传附件</van-button>
        </van-uploader>
      </div>
    </div>
  </div>
</template>

<script>
import {
  templateDownload,
  qiniuToken,
  file_manager_download,
} from "@/api/home";
import NoData from "@/components/common/noData.vue";
import { get_file_img, openpage } from "@/assets/js/public.js";
import { saveFile } from "@/assets/js/public";
import { getDate } from "@/assets/js/up";
import { url } from "@/utils/utils.js";
export default {
  // props:['files_all'],
  props: {
    files_all: {
      default: () => "",
    },
    can_approval: {
      type: [String, Number],
    },
  },
  data() {
    return {
      urls: `${url}/red_template_download/`,
      addUrl: `${url}/enclosure_download/`,
      credit_ratio: 50,
      allfile: [],
      // enclosure_file: [],
      path: "",
      qiniuYun: {
        key: "", //图片名字
        token: "", //token
      },
      d_id: "", //文件的id
      token: "",
      type: "", //公文类型
      authLoad: false, //是否有权限下载
    };
  },
  computed: {
    icon_img() {
      return (v) => {
        return get_file_img(v);
      };
    },
    enclosure_file: {
      get() {
        return this.$store.state.edittext.enclosure_file;
      },
      set(value) {
        this.$store.state.edittext.enclosure_file = value;
      },
    },
    is_and() {
      return this.$store.state.andriod_ios;
    },
  },
  methods: {
    openpages(el) {
      openpage(el);
    },
    //获取七牛toten
    getQiniuToken() {
      qiniuToken().then((res) => {
        this.path = res.url;

        this.qiniuYun.token = res.token;
      });
    },
    enclosure(files) {
      // console.log(files);
      saveFile(files, this.callFile);
    },
    //七牛云上传返回来的文件数据
    callFile(val) {
      this.enclosure_file.push(val);
    }, //删除文件
    delFile(info) {
      this.enclosure_file.forEach((item, index) => {
        if (info.oldname == item.oldname && info.path == item.path) {
          this.enclosure_file.splice(index, 1);
        }
      });
    },
    // 下载附件
    async updown(v) {
      let _res = await file_manager_download({
        status: 2,
        path: v.path,
      });
      // console.log(_res);
    },
  },
  components: {
    NoData,
  },
  created() {
    let enclosure_file = this.files_all.enclosure_file;
    // console.log(enclosure_file, "enclosure_file");
    if (enclosure_file && enclosure_file.length > 0) {
      this.d_id = enclosure_file[0].d_id;
      this.allfile = enclosure_file;
    }
    this.token = sessionStorage.getItem("token");

    this.getQiniuToken();
    this.type = this.$route.query.type;
    let authList = JSON.parse(sessionStorage.getItem("SET_AUTH"))[this.type];
    // console.log(JSON.parse(sessionStorage.getItem("SET_AUTH")), this.type);
    authList.forEach((item, index) => {
      if (this.type == 1) {
        //判断发文是否有权限下载
        if (item == "post_download") {
          this.authLoad = true;
        }
      } else if (this.type == 2) {
        //收文
        if (item == "get_download") {
          this.authLoad = true;
        }
      } else if (this.type == 3) {
        //签发
        if (item == "sign_download") {
          this.authLoad = true;
        }
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.filebox {
  padding: 19px 10px 0;

  .upload {
    display: flex;
    justify-content: space-between;
    height: 32px;
    line-height: 32px;

    // background-color: red;
    .fileContent {
      width: 112px;
      height: 32px;
      background: rgba(0, 130, 239, 1);
      border-radius: 0px 16px 0px 0px;
      color: #fff;
      font-size: 16px;

      img {
        width: 14.64px;
        height: 13.03px;
        padding-left: 10px;
      }
    }

    .all {
      font-size: 14px;
      color: #0082ef;

      img {
        width: 15px;
        height: 15px;
        padding-right: 2px;
        vertical-align: middle;
      }
    }
  }
}

// 上传附件
.upFile {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 384px;
  height: 40px;
  padding: 15px 15px;

  .van-button {
    width: 384px;
    height: 40px;
  }
}

.detail {
  background-color: #f9f9f9;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  margin-top: 15px;
  height: 40px;
  padding: 0 10px;
  .file-icon {
    width: 23px;
    height: 24px;
  }
  .oldName {
    padding: 0 10px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .textDetail {
    font-size: 16px;
    margin-left: 12px;

    div:nth-child(2) {
      color: #9b9b9b;
      font-size: 14px;
    }
  }
}
// .enclosureList {
//   padding-top: 20px;
//   .porgressBox {
//     height: 58px;
//     background-color: #deecf7;
//     position: absolute;
//     top: 0;
//     left: 0;
//     opacity: 0.3;
//   }
//   .detail {
//     position: relative;
//     height: 58px;
//     border-radius: 2px;
//     border: 1px solid rgba(217, 217, 217, 1);
//     display: flex;
//     padding: 8px 10px 0px 10px;
//     box-sizing: border-box;
//     justify-content: space-between;
//     margin-bottom: 10px;
//     background-color: #f9f9f9;

//     .fileContent {
//       display: flex;
//       width: 95%;

//       .textDetail {
//         font-size: 16px;
//         margin-left: 12px;
//         width: 80%;

//         .oldName {
//           // background-color: red;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }
//         div:nth-child(2) {
//           color: #9b9b9b;
//           font-size: 14px;
//         }
//       }
//     }

//     img {
//       width: 40px;
//       height: 40px;
//     }

//     .del {
//       display: block;

//       margin-top: 8px;
//       > img {
//         width: 10px;
//         height: 16px;
//         vertical-align: middle;
//       }
//     }
//   }
// }
</style>
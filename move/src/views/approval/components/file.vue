<template>
  <div class="contentbox">
    <div style="padding-bottom: 50px">
      <!--                头部菜单tab-->
      <div class="header">
        <div class="left">
          <div style="margin-right: 4px">
            <img
              src="../../../assets/img/home/filegroup.png"
              style="width: 14px; height: 13px"
              alt
            />
          </div>
          <div>附件内容</div>
        </div>
        <div v-if="show && authLoad && is_and" class="right">
          <a
            class="all"
            :href="addUrl + `?document_id=${docId}&type=4&token=${token}`"
            download
          >
            <img src="../../../assets/img/newImg/all.png" alt />
            全部下载
          </a>
        </div>
      </div>
      <!--        附件列表-->
      <div class="enclosureList">
        <div v-for="(item, index) in list" :key="index">
          <div>
            <load-file :file="item" @delFile="delFile"></load-file>
          </div>
        </div>
      </div>
      <div v-if="showNoData">
        <no-data></no-data>
      </div>
    </div>
    <!--        上传附件-->
    <div class="uploadBox" v-if="!isFin">
      <van-uploader :after-read="afterRead">
        <van-button icon="plus" color="#0082EF" block class="upbtn"
          >上传附件</van-button
        >
      </van-uploader>
    </div>
  </div>
</template>

<script>
import { getApprovalOpinion } from "@/api/audit";
import { qiniuToken } from "@/api/home";
import noData from "@/components/common/noData";
import loadFile from "@/components/common/loadFile";
import { saveFile } from "@/assets/js/public";
import { url } from "@/utils/utils.js";
export default {
  name: "file",
  components: {
    noData,
    loadFile,
  },
  data() {
    return {
      url: `${url}/red_template_download/`,
      addUrl: `${url}/enclosure_download/`,
      list: undefined,
      nodeList: [], //审核中已提交附件
      // audit_file: [], //新增附件
      showNoData: false,
      show: false, //该审批是否已有审核附件
      token: "",
      type: "", //页面类型
      authLoad: false,
      // fileList:[],//附件列表
    };
  },
  props: {
    docId: {
      type: [Number, String],
      default: undefined,
    },
    approvalId: {
      type: [Number, String],
      default: undefined,
    },
    active: {
      type: [Number, String],
      default: undefined,
    },
    isFin: {
      type: Boolean,
    },
  },
  watch: {
    audit_file: {
      immediate: true,
      handler: function (val, oldVal) {
        if (oldVal) {
          //初始化不改变
          this.list = this.nodeList.concat(val);
          if (this.list && this.list.length > 0) {
            this.show = true;
            this.showNoData = false;
          } else {
            this.show = false;
            this.showNoData = true;
          }
        }
      },
    },
  },
  computed: {
    audit_file: {
      get() {
        return this.$store.state.processNew.app_files;
      },
      set(value) {
        this.$store.state.processNew.app_files = value;
      },
    },
    is_and() {
      // console.log(this.$store.state.andriod_ios);
      return this.$store.state.andriod_ios;
    },
  },
  methods: {
    // 将上传附件上传七牛云
    afterRead(files) {
      saveFile(files, this.callFile);
    },
    //七牛云上传后返回来的文件数据
    callFile(val) {
      this.audit_file.push(val);
      this.showNoData = false;
    },
    //获取流程走向流程日志筛选附件
    getApprovalOpinion() {
      let datas = new URLSearchParams();
      datas.append("data_id", this.docId);
      // datas.append("approval_id", this.approvalId);
      getApprovalOpinion(datas).then((res) => {
        let fileList = [];
        res.data.forEach((item, index) => {
          //    从userinfo对象中将所有审核附件筛选出来
          if (item.userinfo) {
            item.userinfo.forEach((items, num) => {
              if (items.file) {
                fileList = fileList.concat(items.file);
              }
              if (items.transfer && items.transfer.length > 0) {
                items.transfer.forEach((it) => {
                  fileList = fileList.concat(it.file);
                });
              }
            });
          }
        });
        // console.log("筛选后", res.data, fileList);
        this.nodeList = fileList; //将筛选后的附件列表赋值给list显示
        this.list = this.nodeList.concat(this.audit_file);
        if (this.list && this.list.length > 0) {
          this.show = true;
          this.showNoData = false;
        } else {
          this.show = false;
          this.showNoData = true;
        }
      });
    },
    //删除文件
    delFile(file) {
      this.list.forEach((item) => {
        if (file.oldname == item.oldname && file.path == item.path) {
          this.list.splice(item, 1);
        }
      });
      this.audit_file.forEach((item) => {
        if (file.oldname == item.oldname && file.path == item.path) {
          this.audit_file.splice(item, 1);
        }
      });
      // sessionStorage.setItem("audit_file", JSON.stringify(this.audit_file));
    },
  },
  created() {
    this.getApprovalOpinion();
    this.token = sessionStorage.getItem("token");
    this.type = this.$route.query.type;
    let authList = JSON.parse(sessionStorage.getItem("SET_AUTH"))[this.type];
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
.contentbox {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  padding: 20px 15px 45px;
  box-sizing: border-box;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    color: #ffffff;
    font-size: 16px;
    width: 112px;
    border-radius: 0px 16px 0px 0px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    margin-right: 10px;
    background: #0082ef !important;
    justify-content: center;
    align-items: center;

    // div {
    // }
  }

  .right {
    height: 32px;
    line-height: 32px;
    color: #0082ef;
    display: flex;
    align-items: center;

    a {
      color: #0082ef;
    }

    img {
      height: 15px;
      vertical-align: middle;
    }
  }
}

/*    附件列表*/
.enclosureList {
  padding: 20px 0;

  .detail {
    .fileContent {
      display: flex;

      .textDetail {
        font-size: 16px;
        margin-left: 12px;

        div:nth-child(2) {
          color: #9b9b9b;
          font-size: 14px;
        }
      }
    }

    img {
      width: 40px;
      height: 40px;
    }

    .del {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-top: 12px;

      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

/*    上传附件*/
.uploadBox {
  width: 100%;
  padding: 0 15px;
  background-color: #ffffff;
  position: fixed;
  bottom: 5px;
  right: 0;
  left: 0;

  .upbtn {
    width: 384px;
    height: 40px;
    margin: 0 auto;
    margin-top: 10px;
    box-sizing: border-box;
  }
}
</style>
<template>
  <div class="headers">
    <div class="header flex-col">
      <div class="flex-col" style="width: 100%">
        <a-input-search
          placeholder="请输入单位名称"
          @search="onSearch"
          enter-button
          v-model="Searchterms"
          :maxLength="20"
        />
        <!-- <span class="open-search" @click="change_search">
        {{SearchTriangle?"高级搜索":"收起搜索"}}
        <i class="triangle" v-if="SearchTriangle"></i>
        <i class="triangle-top" v-else></i>
      </span> -->
      </div>
      <!-- <SeniorSearch class="SeniorSearch" :obj="obj" @oninSearch="oninSearch" ref="searchDetail" /> -->
      <div class="flex-col">
        <a-button
          type="primary"
          style="margin-right: 16px"
          @click="showModal_my"
          >获取密钥</a-button
        >
        <a-button type="primary" @click="showModal">添加互联单位</a-button>
      </div>
    </div>
    <div class="visible_ren hand" @click="fun_user">
      默认接收人：{{
        visiblerange.visual.length > 0 ? visiblerange.visual[0].title : "无"
      }}
    </div>
    <a-modal
      v-model="visible"
      cancelText="取消"
      okText="确定"
      title="添加互联单位"
      @cancel="form.name = ''"
      @ok="handleOk"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="单位密钥" prop="name">
          <a-input placeholder="请输入单位密钥" v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal v-model="visible_my" title="获取密钥" wrapClassName="visible_my">
      <div class="visible_my-body">{{ sysAppIds }}</div>
      <div class="visible_my-footer">
        <a-button
          type="primary"
          v-clipboard:copy="sysAppIds"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          >复制密钥</a-button
        >
      </div>
    </a-modal>
    <a-modal
      v-model="visible_ren"
      cancelText="取消"
      okText="确定"
      title="默认接收人"
      :confirm-loading="confirmLoading"
      @cancel="visible_ren = false"
      @ok="fun_user_ok"
    >
      <div class="visible_ren_open">
        <div class="visible_ren_open-header flex-col-db">
          <div>
            <span class="red-title">*</span>
            <span>接收人</span>
          </div>
          <div class="hand" style="color: #0774cf" @click="usersUsed">编辑</div>
        </div>
        <div class="visible_ren_open-mian">
          <template v-for="item in CCpersonradio.tagsrange.visual">
            <a-tag
              closable
              @close="() => deleteUser(item.del_id)"
              :key="item.del_id"
            >
              {{ item.title }}</a-tag
            >
          </template>
        </div>
      </div>
    </a-modal>
    <!-- 选择用户 -->
    <a-modal
      ref="used"
      class="transfer-modal"
      title="人员选单"
      :visible="CCperson"
      :confirm-loading="confirmLoading"
      @ok="CChandleOk"
      @cancel="CChandleCancel"
      cancelText="取消"
      okText="确认"
    >
      <div>
        <Framelist
          :range="CCpersonradio.tagsrange"
          :tag="{
            tab: true,
            bm: false,
            pe: true,
            company: false,
            label: false,
            role: false,
            lately: false,
            rad: true, // 单选
          }"
          :restype="4"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
// import SeniorSearch from "@/views/components/seniorSearch/seniorSearch.vue";
import {
  get_secret,
  check_code,
  receiver_user,
  set_receiver,
} from "@/api/interconnection.js";
import Framelist from "@/views/sendout/draft/addcompoents/components/organization/framelist.vue"; //选择人员
export default {
  name: "Header",
  data() {
    return {
      visual: [],
      CCperson: false,
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      CCpersonradio: {
        tagsrange: {
          visual: [], //打开了获取到的数组
        },
      },
      confirmLoading: false, // 弹窗确认按钮加载动画
      sysAppIds: "", // 密钥
      Searchterms: "", // 搜索词
      visible: false,
      visible_my: false,
      visible_ren: false,
      // disabled_search: true,
      // SearchTriangle: true,
      // 新建用户
      new_user: "",
      rules: {
        name: [
          {
            required: true,
            message: "请输入单位密钥",
            trigger: "blur",
          },
        ],
      },
      form: {
        name: "",
      },
      // obj: {
      //   // 最上层搜索条件
      //   one: {},
      //   tree: [],
      //   // 日期选择
      //   condition: [
      //     {
      //       text: "创建时间",
      //       chlid: [
      //         { text: "不限" },
      //         { text: "近一周" },
      //         { text: "近一月" },
      //         { text: "近三月" }
      //       ]
      //     }
      //   ],
      //   // 日期选择后结果
      //   timenum: [{ num: 0, text: "创建时间", time: [] }],
      //   // 模板type
      //   num: 1,
      //   // 等于1时模板分类就隐藏
      //   dhOnoff: 1
      // }
    };
  },
  components: {
    // SeniorSearch,
    Framelist,
  },
  created() {
    this.get_secret();
    this.get_receiver_user();
  },
  methods: {
    deleteUser(id) {
      const CCpersonradio = this.CCpersonradio.tagsrange.visual.filter(
        (item) => item.del_id != id
      );
      console.log(CCpersonradio);
      this.CCpersonradio.tagsrange.visual = CCpersonradio;
    },
    //可以使用的用户
    usersUsed() {
      this.CCperson = true;
    },
    // 弹窗 确定
    CChandleOk(e) {
      let _this = this;
      let user = [];
      this.CCpersonradio.tagsrange.visual.forEach((item, index) => {
        if (item.type == 4) {
          user = [...user, ...item.userids];
        } else if (item.type == 5) {
          item.all_users.forEach((el2) => {
            user.push(el2.userid);
          });
        } else {
          user.push(item.value);
        }
      });
      user = Array.from(new Set(user));
      this.form.use_user_ids = user.join();
      this.CCperson = false;
    },
    // 弹窗 取消
    CChandleCancel(e) {
      this.CCperson = false;
    },
    // 获取secre密钥
    async get_secret() {
      let res = await get_secret();
      if (res.code == 1) {
        this.sysAppIds = res.data;
      }
    },
    // 获取默认接收人
    async get_receiver_user() {
      let res = await receiver_user();
      if (res.code == 1) {
        console.log(res);
        if (res.data.length > 0) {
          let el = res.data[0];
          this.visiblerange.visual = [
            {
              value: el.userid,
              title: el.name,
              del_id: "pe" + el.userid,
              type: 2,
            },
          ];
        }
        console.log(this.visiblerange.visual);
      }
    },

    onSearch() {
      // this.disabled_search = false;
      this.$emit("update_user", this.Searchterms);
      // setTimeout(() => {
      //   this.disabled_search = true;
      // }, 3000);
    },
    // //显示/收起搜索
    // change_search() {
    //   if (this.SearchTriangle) {
    //     this.$refs.searchDetail.$el.style.height = "auto";
    //   } else {
    //     this.$refs.searchDetail.$el.style.height = "0px";
    //     this.$emit("onChange",this.obj.one);
    //   }
    //   this.SearchTriangle = !this.SearchTriangle;
    // },
    onCopy() {
      this.$message.success("复制成功");
      this.visible_my = false;
    },
    onError() {
      this.$message.error("复制失败");
      this.visible_my = false;
    },
    showModal() {
      this.visible = true;
    },
    showModal_my() {
      this.visible_my = true;
    },
    fun_user() {
      this.visible_ren = true;
      this.CCpersonradio.tagsrange.visual = JSON.parse(
        JSON.stringify(this.visiblerange.visual)
      );
    },
    async fun_user_ok() {
      this.confirmLoading = true;
      let userid_arr = this.CCpersonradio.tagsrange.visual.map((item) => {
        return item.value;
      });
      let userids = userid_arr.join(",");
      let res = await set_receiver({ userids });
      if (res.code == 1) {
        this.visible_ren = false;
        this.confirmLoading = false;
        setTimeout(() => {
          this.$router.go(0);
        }, 100);
      }
      else{
        this.confirmLoading = false;
      }
      // setTimeout(() => {
      //   this.visible_ren = false;
      //   this.confirmLoading = false;
      //   // setTimeout(() => {
      //   //   this.$router.go(0);
      //   // }, 100);
      // }, 1000);
    },
    // 子组件需要调用的组件
    // oninSearch() {
    //   this.$emit("onChange",this.obj.one);
    //   this.SearchTriangle = true;
    //   this.$refs.searchDetail.$el.style.height = "0px";
    // },
    // 重置高级搜索数据
    // chonghzi() {
    //   // 清空头部数据表
    //   this.obj.one = {};
    //   // 输入框重置
    //   this.obj.tree.forEach((e) => {
    //     e.intext = "";
    //   });
    //   // 模板文字重置
    //   this.mbtext = "";
    //   // 日期重置
    //   this.obj.timenum.forEach((e) => {
    //     e.time = [];
    //     e.num = 0;
    //   });
    // },
    async handleOk(e) {
      this.confirmLoading = true;
      if (this.form.name.length != 0) {
        let dt = await check_code({
          code: this.form.name,
        });
        if (dt.code == 1) {
          this.form.name = "";
          this.visible = false;
          this.confirmLoading = false;
          setTimeout(() => {
            this.$router.go(0);
          }, 100);
        }

        // if (dt.code == 1) {
        //   this.$router.push({
        //     path: "/roleset/roleEditing",
        //     query: {
        //       id: dt.data,
        //     },
        //   });
        // }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  justify-content: space-between;
  height: 60px;
  .headerbtn {
    margin-left: 20px;
  }
}
.visible_ren {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #0082ef;
  margin-left: 13px;
}
/deep/.ant-input-group-wrapper {
  width: 290px;
}
.open-search {
  width: 200px;
  margin-left: 10px;
  cursor: pointer;
  color: #0082ef;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  .triangle {
    width: 0;
    height: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-top: 4px solid #b4bccc;
    border-bottom: 4px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    top: 8px;
    left: 54px;
  }
  .triangle-top {
    width: 0;
    height: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-bottom: 4px solid #b4bccc;
    border-top: 4px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    top: 2px;
    left: 54px;
  }
}
.SeniorSearch {
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
  top: 59px;
}
/deep/.ant-modal-header {
  border-bottom: 0px solid #ccc;
}
/deep/.ant-modal-footer {
  border-top: 0px solid #ccc;
}
/deep/.ant-input-wrapper {
  display: flex;
  width: 240px;
  .ant-btn {
    border: 1px solid rgba(218, 218, 219, 1);
    background: white;
    color: #dadadb;
    box-shadow: none;
  }
}
/deep/ .ant-form {
  width: 100%;
  .ant-row {
    display: flex;
    margin-bottom: 0;
    .ant-form-item-label {
      flex: 0 0 80px !important;
    }
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
/deep/.visible_my {
  .ant-modal-body {
    padding: 11px 60px 34px;
  }
  .ant-modal-footer {
    display: none;
  }
  .visible_my-body {
    margin-bottom: 27px;
  }
  .visible_my-footer {
    text-align: center;
  }
}

.visible_ren_open-header {
  .red-title {
    color: #f56c6c;
    margin-right: 5px;
  }
}
.visible_ren_open-mian {
  padding: 14px 12px 0 12px;
  flex-wrap: wrap;
  margin-top: 15px;
  border: 1px solid #dcdfe6;
  height: 90px;
  border-radius: 3px;
  overflow-y: auto;
  /deep/ .ant-tag {
    margin-bottom: 14px;
  }
}
.transfer-modal {
  /deep/.ant-modal {
    width: 710px !important;
  }
}
</style>
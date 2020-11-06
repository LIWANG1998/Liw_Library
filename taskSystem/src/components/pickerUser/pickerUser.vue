<template>
  <van-popup v-if="_show" v-model="_show" :class="['picker-user','popup']" :overlay="false">
    <van-sticky>
      <van-search
        v-model="keyword"
        input-align="center"
        placeholder="请输入姓名"
        @search="onSearch"
        @clear="handleClear"
      />
      <van-checkbox-group v-if="!single" v-model="selectData">
        <template v-if="isSearch">
          <template v-if="searchData.length >0 ">
            <div v-for="(item,index) in searchData" :key="index" class="item">
              <van-cell v-if="item.isuser" clickable center>
                <template #icon>
                  <img :src="item.avatar" class="icon-file" />
                </template>
                <template #title>
                  <div>{{ item.label }}</div>
                </template>
                <template #right-icon>
                  <van-checkbox shape="square" :name="item.id" @click="handleClick(item)" />
                </template>
              </van-cell>
            </div>
          </template>
          <van-empty
            v-else
            class="custom-image"
            :image="require('@/assets/images/nodata.png')"
            description="暂无数据"
          />
        </template>
        <van-tabs v-else v-model="active" color="#0082EF" :line-width="40" :line-height="2">
          <van-tab title="组织架构">
            <depart :page="page" :single="single" />
          </van-tab>
          <van-tab title="标签">
            <tag :is-load="isload" :single="single" />
          </van-tab>
        </van-tabs>
      </van-checkbox-group>
      <van-radio-group v-else v-model="selectData">
        <template v-if="isSearch">
          <template v-if="searchData.length >0 ">
            <div v-for="(item,index) in searchData" :key="index" class="item">
              <van-cell v-if="item.isuser" clickable center>
                <template #icon>
                  <img :src="item.avatar" class="icon-file" />
                </template>
                <template #title>
                  <div>{{ item.label }}</div>
                </template>
                <template #right-icon>
                  <van-radio :name="item.id" @click="handleClick(item)" />
                </template>
              </van-cell>
            </div>
          </template>
          <van-empty
            v-else
            class="custom-image"
            :image="require('@/assets/images/nodata.png')"
            description="暂无数据"
          />
        </template>
        <van-tabs v-else v-model="active" color="#0082EF" :line-width="40" :line-height="2">
          <van-tab title="组织架构">
            <depart :single="single" :filter="filterData" />
          </van-tab>
          <van-tab title="标签">
            <tag :is-load="isload" :single="single" :filter="filterData" />
          </van-tab>
        </van-tabs>
      </van-radio-group>
    </van-sticky>
    <van-dialog
      v-model="dialogShow"
      title="是否将所选人员创建为标签"
      show-cancel-button
      :before-close="beforeClose"
      class="tags"
    >
      <van-field v-model="tagName" border clearable label="标签名称" placeholder="请输入标签名称（15字内）" maxlength="15"/>
    </van-dialog>
    <footer>
      <div class="total">
        <van-checkbox v-if="!single&&filterData.length==0" v-model="isTagAdd">创建为标签</van-checkbox>
        <div class="select">已选择：{{ single && selectData.length>0?1:selectData.length }} 人</div>
      </div>
      <div class="action">
        <van-button type="default" native-type="button" @click="handleCancel ">取消</van-button>
        <van-button
          type="info"
          native-type="button"
          :loading="button.loading"
          :loading-text="button.text"
          @click="handleConfirm"
        >确定</van-button>
      </div>
    </footer>
  </van-popup>
</template>
<script>
import tag from "./tag";
import depart from "./depart";
import { common } from "@/api";
import { deepClone } from "@/utils";
import { mapGetters } from "vuex";
export default {
  name: "PickerUser",
  components: {
    depart,
    tag,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array,
      default: () => new Array(),
    },
    obj: {
      type: Object,
      default: () => {},
    },
    single: {
      type: Boolean,
      default: false,
    },
    filterData: {
      type: Array,
      default: () => new Array(),
    },
    page: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectData: [],
      innerValue: this.value,
      keyword: "",
      active: 0,
      tagName: "",
      dialogShow: false,
      isTagAdd: false,
      isload: false,
      isSearch: false,
      searchData: [],
      filter: [],
      button: {
        loading: false,
        text: "保存中",
      },
      selectObj: {
        user: [],
        dep: [],
      },
    };
  },
  watch: {
    // data(val) {
    //   console.log('选人组件', val)
    //   this.selectData = val;
    // },
    show(val) {
      if (val) {
        this.searchData = [];
        this.isSearch = false;
        this.keyword = "";
        let obj = { user: [], dep: [] };
        this.selectObj = this.obj ? this.obj : obj;
        this.selectData = this.data;
      }
    },
  },
  computed: {
    ...mapGetters({
      pickerUser: "pickerUser",
      pickerUserType: "pickerUserType",
    }),
    _show: {
      get: function () {
        return this.show;
      },
      set: function (val) {
        this.$emit("update:show", val);
      },
    },
  },
  created() {
    let that = this;
    this.$bus.on("change", (data, checked) => {
      this.handleClick(data, checked);
    });
    this.$bus.on("selectAll", (data, checked) => {
      let isExit = that.selectData.find((item) => item == data.id);
      let index = that.selectData.findIndex((item) => item == data.id);
      if (!isExit) {
        that.selectData.push(data.id);
      } else {
        if (!checked) {
          that.selectData.splice(index, 1);
        }
      }
    });
  },
  methods: {
    async onSearch() {
      if (this.keyword) {
        const { code, data } = await common.getUserSearch({
          keyword: this.keyword,
        });
        this.searchData = this.converData(data);
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    },
    handleClear() {
      this.isSearch = false;
    },
    handleConfirm() {
      if (this.selectData.length == 0) {
        return this.$notify({ type: "danger", message: "请选择人员!" });
      } else {
        this.isTagAdd ? (this.dialogShow = true) : this.comfirm();
      }
    },
    converData(data) {
      let pickerUserData = this.pickerUser.data ? this.pickerUser.data : [];
      if (this.filterData && this.filterData.length > 0) {
        pickerUserData = this.filterData;
      }
      let type = this.pickerUser.type;
      let curType = this.pickerUserType;
      if (type != curType && pickerUserData.length > 0) {
        return data.filter((item) => {
          return !pickerUserData.includes(item.id);
        });
      }
      return data;
    },
    // 添加标签
    async handleAddTags(done) {
      try {
        const { code, msg } = await common.addTags({
          type: 0,
          tag_name: this.tagName,
          status: 1,
          userid: this.selectObj.user.map((item) => item.id).join(","),
          userid_list: this.selectObj.user.map((item) => item.id).join(","),
          dep_list: this.selectObj.dep.join(","),
        });
        if (code) {
          this.comfirm();
          done();
        } else {
          done(false);
          return this.$notify({ type: "danger", message: msg });
        }
      } catch {
        done(false);
        return this.$notify({ type: "danger", message: "添加失败!" });
      }
    },
    // 点击确定创建标签
    beforeClose(action, done) {
      if (action === "confirm") {
        if (this.tagName == "") {
          done(false);
          return this.$notify({ type: "danger", message: "请输入标签名称（15字内）" });
        } else {
          this.handleAddTags(done);
        }
      } else {
        done();
        this.isTagAdd = false;
      }
    },
    // 选择用户
    handleClick(val, checked) {
      if (this.single) {
        this.selectObj.user = val;
        this.selectObj.dep = val.parentid;
      } else {
        if (!this.checkUser(val.id)) {
          this.selectObj.user.push(val);
          this.selectObj.dep.push(val.parentid);
        } else {
          if (!checked) {
            let index = this.selectObj.user.findIndex(
              (item) => item.id == val.id
            );
            this.selectObj.dep.splice(index, 1);
            this.selectObj.user.splice(index, 1);
          }
        }
      }
    },
    // 判断当前用户是否存在
    checkUser(id) {
      if (this.selectObj.user.some((item) => item.id == id)) {
        return true;
      } else {
        return false;
      }
    },
    // 确定按钮
    comfirm() {
      this.button.loading = true;
      setTimeout(() => {
        this._show = false;
        this.button.loading = false;
        this.$emit("confirm", this.selectData, this.selectObj);
      }, 1000);
    },
    // 取消按钮
    handleCancel() {
      setTimeout(() => {
        this._show = false;
        this.button.loading = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.picker-user {
  .title {
    line-height: 30px;
  }
  .gray {
    font-size: 13px;
  }
  /deep/.van-cell:not(:last-child)::after {
    border-bottom: 0;
  }
  .van-search {
    background-color: @white-light;
    .van-search__content {
      border-radius: 2px;
      overflow: hidden;
      background: @white;
      text-align: center;
    }
    .van-search__action {
      color: @blue;
    }
  }
  .van-cell__title {
    display: flex;
    align-items: center;
  }
  .icon-file {
    width: 32px;
    margin-right: 10px;
  }
  /deep/.van-tabs__content {
    margin-top: 1px;
  }
  footer {
    background: @white;
    border-top: @gray-light solid @border-width-base;
    display: block;
    .action {
      display: flex;
      font-size: 14px;
      align-items: center;
      justify-content: space-between;
      .van-button {
        flex: 1;
      }
    }
    .total {
      display: flex;
      font-size: 12px;
      align-items: center;
      justify-content: space-between;
      line-height: 30px;
      border-bottom: 1px solid @border-color;
      padding: 0 10px;
      .select {
        margin-left: 10px;
      }
    }
    .van-button {
      min-width: 60px;
      height: 40px;
      text-align: center;
      flex: unset;
    }
  }
  .tags {
    /deep/.van-dialog__content {
      padding: 20px 0;
    }
  }
}
</style>

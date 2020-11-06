<template>
  <div class="depart">
    <template v-if="depData.length>0">
      <div class="head">
        <div
          v-for="(item,index) in headData"
          :key="index"
          :class="index < headData.length -1?'active':''"
          @click="index < headData.length -1?handleHeadChange(item.id,index):''"
        >
          {{ item.label }}
          <van-icon
            v-if="index < headData.length -1"
            name="arrow"
          />
        </div>
      </div>
      <div class="list">
        <div
          v-for="(dItem,dIndex) in depData"
          :key="dIndex"
        >
          <div
            v-show="dItem.id == headData[headData.length -1].id"
            class="item"
          >
            <template v-if=" dItem.dep.length > 0">
              <div
                v-for="(item,index) in dItem.dep"
                :key="index"
              >
                <van-cell
                  v-if="item.isuser"
                  clickable
                  center
                >
                  <template #icon>
                    <img
                      :src="item.avatar"
                      class="icon-file"
                    >
                  </template>
                  <template #title>
                    <div>{{ item.label }}</div>
                  </template>
                  <template #right-icon>
                    <van-radio
                      v-if="single"
                      :name="item.id"
                      @click="handleClick(item)"
                    />
                    <van-checkbox
                      v-else
                      shape="square"
                      :name="item.id"
                      @click="handleClick(item)"
                    />
                  </template>
                </van-cell>
                <van-cell
                  v-else
                  :title="item.label"
                  is-link
                  center
                  @click="handleDepart(item)"
                >
                  <template #icon>
                     <i class="file-icon sprite-icon icon-file"></i>
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
          </div>
        </div>
      </div>
    </template>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/nodata.png')"
      description="暂无数据"
    />
  </div>
</template>
<script>
import { common } from "@/api";
import { mapGetters } from "vuex";
import { sharedProps } from "../index";
export default {
  name: "Depart",
  props: {
    single: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Array,
      default: () => new Array(),
    },
    data: {
      type: Array,
      default: () => new Array(),
    },
    axtt:{
      type: Array
    },
    page:{
      type:Number,
      default:() => ''
    }
  },
  data() {
    return {
      headData: [{ id: 0, label: "全部" }],
      depData: [],
      depId: "",
      selectData: {
        user: [],
        dep: [],
      },
    };
  },
  created() {
    this.getDepartNodeInit();
    if (this.pickerUser.obj && this.pickerUser.obj.user) {
      this.selectData.user = this.pickerUser.obj.user;
      this.selectData.dep = this.pickerUser.obj.dep;
    }
  },
  computed: mapGetters({
    pickerUser: "pickerUser",
    pickerUserType: "pickerUserType",
  }),
  methods: {
    async getDepartNodeInit() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      let _params = {}
      if (this.page) {
        _params.is_data = this.page
      }
      const { data } = await common.getDepartNodeInit(_params);
      if (data) this.depData.push({ id: "0", dep: data });
      this.$toast.clear();
    },
    async getDepartNodeChild(id) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      this.depId = id.replace(/D/, "");
      const { data } = await common.getDepartNodeChild({ parentId: id });
      if (data) this.depData.push({ id: id, dep: this.converData(data) });
      this.$toast.clear();
    },
    // 选择接受人或者是抄送人，过滤数据
    converData(data) {
      let pickerUserData = this.pickerUser.data ? this.pickerUser.data : [];
      let filters = this.pickerUser.filter;
      if (filters && filters.length > 0) {
        pickerUserData = filters;
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
    handleHeadChange(val, index) {
      if (!this.depData.some((item) => item.id == val)) {
        if (val) {
          this.getDepartNodeChild(val);
        } else {
          this.getDepartNodeInit();
        }
      }
      this.headData = this.headData.slice(0, index + 1);
    },
    handleDepart(item) {
      this.headData.push(item);
      if (!this.depData.some((i) => i.id == item.id)) {
        this.getDepartNodeChild(item.id);
      }
    },
    handleClick(val) {
      val.parentid = this.depId;
      this.$bus.emit("change", val, false);
    },
  },
};
</script>
<style lang="less" scoped>
.depart {
  font-size: 14px;
  .head {
    line-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    background: @white;
    overflow-x: auto;
    touch-action: pan-x;
    & > div {
      display: flex;
      align-items: center;
      color: @gray;
      flex-shrink: 0;
      &.active {
        color: @blue;
      }
    }
  }
  .van-cell {
    height: 50px;
    overflow: hidden;
  }
  .icon-file {
    width: 32px;
    margin-right: 10px;
  }
  .list {
    height: calc(100vh - 220px);
    overflow: auto;
  }
}
</style>

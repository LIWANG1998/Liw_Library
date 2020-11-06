<template>
  <div class="tag-panel">
    <template v-if="tags.length >0">
      <van-radio-group v-model="radio">
        <Collapse v-model="active" accordion>
          <div v-for="(item,index) in tags" :key="index" class="item">
            <div class="click-area" @click="handleAllClick(item,index)" />
            <CollapseItem center :title="item.tag_name" title-class="title">
              <template #icon>
                 <i class="file-icon sprite-icon icon-file" @click="handleGetUser(item,index)"></i>
              </template>
              <template #right-icon>
                <van-icon v-if="item.checked" name="success" color="#0082EF" size="20px" />
                <div v-else />
              </template>
              <template v-if="item.children&&item.children.length >0">
                <van-cell
                  v-for="(cItem,cIndex) in item.children"
                  :key="cIndex"
                  clickable
                  center
                  class="user"
                >
                  <template #icon>
                    <img :src="cItem.avatar" class="icon-file" />
                  </template>
                  <template #title>
                    <div>{{ cItem.label }}</div>
                  </template>
                  <template #right-icon>
                    <van-radio v-if="single" :name="cItem.id" @click="handleClick(cItem)" />
                    <van-checkbox
                      v-else
                      shape="square"
                      :name="cItem.id"
                      @click="handleClick(cItem)"
                    />
                  </template>
                </van-cell>
              </template>
              <div v-else class="no-data">该标签暂无可选人员或已在任务中</div>
            </CollapseItem>
          </div>
        </Collapse>
      </van-radio-group>
    </template>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/nodata.png')"
      description="暂无标签"
    />
  </div>
</template>
<script>
import { common } from "@/api";
import { Collapse, CollapseItem } from "vant";
import { mapGetters } from "vuex";
export default {
  components: {
    Collapse,
    CollapseItem,
  },
  props: {
    single: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Array,
      default: () => new Array(),
    },
    isLoad: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectData: {
        user: [],
        dep: [],
      },
      tags: [],
      active: "",
      radio: "",
      button: {
        loading: false,
        text: "保存中",
      },
    };
  },
  watch: {
    isLoad(val) {
      if (val) this.getTagList();
    },
  },
  created() {
    this.getTagList();
  },
  computed: mapGetters({
    pickerUser: "pickerUser",
    pickerUserType: "pickerUserType",
  }),
  methods: {
    async getTagList() {
      // this.userData = user.data;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      const {
        data: { personal },
      } = await common.getTags();
      personal.forEach((item) => {
        item.checked = false;
      });
      this.tags = personal;
    },
    async getTagUserList(id, index, all) {
      // this.userData = user.data;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      let tagId = id;
      let {
        data: {
          data: { userid_list },
        },
      } = await common.getTagsUser({
        id: tagId,
      });
      this.$toast.clear();
      userid_list = userid_list.map((item) => {
        return {
          id: item.userid,
          label: item.name,
          dep_id: item.dep_id,
          avatar: item.avatar,
        };
      });
      // this.tags[index].children = this.fileterData(data);
      if (!all)
        this.$set(this.tags[index], "children", this.fileterData(userid_list));
      return this.fileterData(userid_list);
    },
    // 选择接受人或者是抄送人，过滤数据
    fileterData(data) {
      let pickerUserData = this.pickerUser.data ? this.pickerUser.data : [];
      let type = this.pickerUser.type;
      let curType = this.pickerUserType;
      let filters = this.pickerUser.filter;
      if (filters && filters.length > 0) {
        pickerUserData = filters;
      }
      if (type != curType && pickerUserData.length > 0) {
        return data.filter((item) => {
          return !pickerUserData.includes(item.id);
        });
      }
      return data;
    },
    handleGetUser(item, index) {
      if (this.active === "") {
        this.getTagUserList(item.id, index);
      }
    },
    handleClick(val, checked) {
      val.parentid = val.dep_id;
      this.$bus.emit("change", val, checked);
    },
    async handleAllClick(item, index) {
      let userData = await this.getTagUserList(item.id, index, true);
      item.checked = !item.checked;
      // 全选之前，先清空选择，然后实现选中;
      userData.forEach((user) => {
        this.handleClick(user, item.checked);
        this.$bus.emit("selectAll", user, item.checked);
      });
      this.tags[index] = item;
    },
  },
};
</script>
<style scoped lang="less">
.tag-panel {
  height: calc(100vh - 180px);
  overflow: auto;

  .van-cell {
    padding: 10px 0;
  }

  .user {
    padding-left: 20px;
  }

  .item {
    background-color: @white;
    position: relative;
  }

  .click-area {
    height: 56px;
    width: calc(100% - 56px);
    left: 56px;
    position: absolute;
    top: 0;
    z-index: 2;
  }

  .van-collapse-item--border::after {
    border: none;
  }

  /deep/.van-collapse-item__content {
    padding: 0 16px;
  }

  .no-data {
    line-height: 30px;
    padding: 5px 0;
    text-align: center;
  }

  .icon-file {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
}
</style>

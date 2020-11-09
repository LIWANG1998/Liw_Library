<template>
  <div class="framework">
    <div class="title">公司组织架构</div>
    <a-tree
      :tree-data="data"
      :props="defaultProps"
      @select="handleDepartClick"
      :show-icon="true"
      :check-strictly="true"
      :check-on-click-node="true"
      :default-expand-all="true"
      :expand-on-click-node="false"
    >
      <a-icon slot="switcherIcon" type="folder" />
    </a-tree>
  </div>
</template>
<script>
import { common } from "@/api";
export default {
  props: ["reload"],
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "dep_name",
      },
    };
  },
  watch: {
    reload(val) {
      if (val) {
        this.getDepartData();
      }
    },
  },
  computed: {
    _reload: {
      get() {
        return this.reload;
      },
      set() {
        this.$emit("update:reload", false);
      },
    },
  },
  created() {
    this.getDepartData();
  },
  methods: {
    async getDepartData() {
      const { data } = await common.getDepart();
      this.data = this.buildTree(data);
    },
    buildTree(list) {
      let temp = {};
      let tree = [];
      for (let i in list) {
        list[i].key = list[i].id;
        list[i].title = list[i].dep_name;
        temp[list[i].wx_depid] = list[i];
      }
      for (let k in temp) {
        let parent = temp[temp[k]["parentid"]];
        if (parent) {
          (parent.children || (parent.children = [])).push(temp[k]);
        } else {
          tree.push(temp[k]);
        }
      }
      return tree;
    },
    //   点击节点
    handleDepartClick(data, e) {
      console.log(data);
      this.$emit("changeDepart", e.node.dataRef.depid);
    },
  },
};
</script>
<style lang="less" scoped>
.title {
  line-height: 40px;
  font-size: 14px;
}
.framework {
  max-height: 100%;
  height: calc(100vh - 200px);
  overflow: auto;
  /deep/.ant-tree .ant-tree-switcher-icon {
    font-size: 18px !important;
    color: #707070;
  }
  /deep/.ant-tree
    li
    span.ant-tree-switcher.ant-tree-switcher_close
    .ant-tree-switcher-icon
    svg {
    transform: rotate(0deg);
  }
  .a-tree {
    font-size: 14px;
  }
  .is-horizontal {
    display: none;
  }
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
    .el-scrollbar__view {
      padding: 0;
    }
  }
}
</style>

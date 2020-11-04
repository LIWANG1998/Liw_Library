<template>
  <div class="treebigbox">
    <a-tree :tree-data="children" show-icon @select="onSelect" @expand="onExpand" :selectedKeys="treeModel">
      <a-icon slot="FolderFilled" type="folder" theme="twoTone" />
      <a-icon slot="Folders" type="tag" twoToneColor="#333333" />
    </a-tree>
  </div>
</template>
<script>
export default {
  name: "Tree",
  data() {
    return {
      treeModel:[]
    };
  },
  mounted() {
  },
  props: ["children"],
  methods: {
    // 点击列表调用的函数
    onSelect(keys) {
      this.treeModel = keys
      this.$emit("treeClick", keys);
    },
    // 点击三角调用的的方法
    onExpand() {
      console.log(this.children);
    },
    // 父组件重新同步组织架构调用的函数
    onReset(){
      this.treeModel = []
    }

  }
};
</script>

<style lang="less" scoped>
.treebigbox {
  height: 600px;
  overflow-y: auto;
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper {
  width: calc(100% - 25px);
  height: 40px;
  line-height: 40px;
  border-radius: 0px;
  padding-left: 20px;
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
  border-right: 2px solid #0082ef;
  background: #e5f2fe;
}
/deep/ .ant-tree li span.ant-tree-iconEle {
  height: 40px;
  line-height: 40px;
}
/deep/ .ant-tree li span.ant-tree-switcher {
  height: 40px;
  line-height: 40px;
}
</style>

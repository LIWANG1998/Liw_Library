<template>
  <div class="list-div">
    <div class="list-type" v-if="_wx3 && tag.hl">
      <a-radio-group
        v-model="radiovalue"
        @change="radioChange"
        button-style="solid"
      >
        <a-radio-button value="a">当前组织</a-radio-button>
        <a-radio-button value="b">互联单位</a-radio-button>
      </a-radio-group>
    </div>
    <div class="list-box">
      <div class="list-box-cl list-box-left">
        <div class="list-search">
          <a-input-search
            :placeholder="
              radiovalue == 'a' ? search_placeholder[tab] : '请输入单位名称'
            "
            v-model="kwd"
            @search="onSearch"
          />
        </div>
        <div>
          <template v-if="radiovalue == 'a'">
            <a-tabs v-model="tab" @change="callback">
              <a-tab-pane :key="1" v-if="tag.tab" tab="组织架构">
                <Tree
                  :show_data_flag="show_data_flag"
                  :show_data_list="show_data_list"
                  :prefix="prefix"
                  :tabs="treeVisual"
                  :res="tag"
                  :transformation="transformation"
                  @treeClick="treeClick"
                />
              </a-tab-pane>
              <a-tab-pane :key="2" v-if="tag.company" tab="收发文单位">
                <Tree
                  :show_data_flag="show_data_flag"
                  :show_data_list="show_data_list"
                  :prefix="null"
                  :tabs="treeVisualS"
                  :res="tag"
                  :transformation="transformation"
                  @treeClick="treeClick"
                />
              </a-tab-pane>
              <a-tab-pane :key="3" v-if="tag.label" tab="标签">
                <Tree
                  :show_data_flag="show_data_flag"
                  :show_data_list="show_data_list"
                  :prefix="null"
                  :tabs="treeVisualS"
                  :res="tag"
                  :transformation="transformation"
                  @treeClick="treeClick"
                />
              </a-tab-pane>
              <a-tab-pane :key="4" v-if="tag.role" tab="角色">
                <Tree
                  :show_data_flag="show_data_flag"
                  :show_data_list="show_data_list"
                  :prefix="null"
                  :tabs="treeVisualS"
                  :res="tag"
                  :transformation="transformation"
                  @treeClick="treeClick"
                />
              </a-tab-pane>
              <a-tab-pane :key="5" v-if="tag.lately" tab="最近选择">
                <Tree
                  :show_data_flag="show_data_flag"
                  :show_data_list="show_data_list"
                  :prefix="null"
                  :tabs="treeVisualS"
                  :res="tag"
                  :transformation="transformation"
                  @treeClick="treeClick"
                />
              </a-tab-pane>
            </a-tabs>
          </template>
          <template v-else>
            <a-tabs>
              <a-tab-pane key="1" tab="互联单位">
                <Tree
                  :show_data_flag="show_data_flag"
                  :show_data_list="show_data_list"
                  :prefix="null"
                  :tabs="treeVisualS"
                  :res="tag"
                  :transformation="transformation"
                  @treeClick="treeClick"
                />
              </a-tab-pane>
            </a-tabs>
          </template>
        </div>
      </div>
      <div class="list-box-cl list-box-right">
        <div class="list-box-right-top">
          <span
            >{{ radiovalue == "a" ? tips[tab] : "已选择单位" }}({{
              range.visual.length
            }})</span
          >
          <span
            v-show="range.visual.length"
            class="list-box-right-top-close hand"
            @click="listCloseFun"
            >全部删除</span
          >
        </div>
        <div class="list-box-right-bottom">
          <template v-for="item in range.visual">
            <div class="list-box-right-bottom-cl" :key="item.del_id">
              <div class="flex-center">
                <a-icon
                  :type="
                    item.type == 1
                      ? 'folder'
                      : item.type == 2 || item.type == 6
                      ? 'user'
                      : item.type == 4
                      ? 'tag'
                      : ''
                  "
                  style="margin-right: 5px"
                />
                <span class="name" :title="item.title">{{ item.title }}</span>
              </div>
              <span style="cursor: pointer" @click="delvisualcl(item)">
                <a-icon type="close" />
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Getorganizationaldata } from "@/api/postflowpathset.js";
import {
  OrganiZationalList,
  addLabelList,
  document_role_index,
} from "@/api/public.js";
import Tree from "@/views/sendout/draft/addcompoents/components/organization/tree.vue";
import { get_role_list } from "@/api/roleset.js";
import { document_recently_circulated } from "@/api/incoming.js";
import { list_company } from "@/api/draft.js";
import { inter_list } from "@/api/interconnection.js";
export default {
  name: "Framelist",
  data() {
    return {
      radiovalue: "a", // 切换互联企业
      kwd: "",
      treeClickid: "", // 点击文件夹的id
      treeVisual: null,
      treetagsid: "", // 点击文件夹的id
      treeVisualS: {
        tree: { children: [] },
      },
      treeRole: { tree: { children: [] } },
      treeChoices: { tree: { children: [] } },
      kwdtype: this.restype,

      //默认tab选项
      default_key: 1,

      //搜索框提示语
      search_placeholder: {
        1: "请输入姓名、部门名称",
        2: "请输入收发文单位名称",
        3: "请输入标签单位",
        4: "请输入角色名称",
        5: "请输入人员名称",
      },

      //单位前缀
      prefix: "",

      tab: 1,

      tips: {
        1: "已选择的部门、人员",
        2: "已选择的部门、人员",
        3: "已选择的部门、人员",
        4: "已选择的部门、人员",
        5: "已选择的部门、人员",
      },
    };
  },
  //tab(显示组织架构), company(显示发文收文单位), bm(可选组织架构的部门), pe(可选组织架构的人)
  //label(显示标签),role(角色),lately(最近选择)

  //自定义type   1组织架构(部门)，2组织架构(人)，3发文收文单位，4标签，5角色，6最近选择
  props: [
    "range",
    "tag",
    "restype",
    "show_data_list",
    "show_data_flag",
    "transformation",
  ],
  components: {
    Tree,
  },
  mounted() {},
  computed: {
    _wx3() {
      let a = sessionStorage.getItem("userinfo")
        ? JSON.parse(sessionStorage.getItem("userinfo")).wx3 == 1
          ? true
          : false
        : false;
      return a;
    },
  },
  created() {
    this.get_tab_datas();
    this.update_father_data();
    if (this.tag.tab) {
      this.tab = 1;
    } else if (this.tag.company) {
      this.tab = 2;
    } else if (this.tag.label) {
      this.tab = 3;
    } else if (this.tag.role) {
      this.tab = 4;
    } else if (this.tag.lately) {
      this.tab = 5;
    }
  },
  methods: {
    // 切换互联企业单位
    radioChange(e) {
      if (e.target.value == "b") {
        this.get_inter_list();
      } else {
        this.callback(this.tab);
      }
    },
    // 更新数据
    update_father_data() {
      // this.tab = 1;
      if (this.show_data_list) {
        this.show_data_list.forEach((el) => {
          this.range.visual.push({
            value: el.id,
            title: el.name,
            receiver_name: el.receiver_name,
            del_id: el.del_id,
            type: el.type,
          });
        });
      }
    },
    //数据获取
    get_tab_datas() {
      if (this.radiovalue == "b") {
        this.get_inter_list();
        return;
      }
      if (this.tag.tab) {
        // 组织架构的数据list
        this.addList();
        return;
      }
      if (this.tag.company) {
        // 发文收文单位的数据
        this.get_list_company();
        return;
      }
      if (this.tag.label) {
        // 标签数据
        this.get_tags();
        return;
      }
      if (this.tag.role) {
        // 角色数据
        this.get_roles();
        return;
      }
      if (this.tag.lately) {
        // 最近选择
        this.get_document_recently_circulated();
        return;
      }
    },

    // 弹窗 搜索
    onSearch() {
      if (this.radiovalue == "a") {
        switch (this.tab) {
          case 1:
            if (this.kwd.trim().length <= 0) {
              this.addList();
              return;
            }
            Getorganizationaldata({ type: this.kwdtype, kwd: this.kwd }).then(
              (res) => {
                if (this.kwdtype == 3) {
                  this.treeVisualS.tree.children = res.data;
                } else {
                  this.treeVisual.tree.children = res.data;
                }
              }
            );
            break;
          case 2:
            this.get_list_company();
            break;
          case 3:
            Getorganizationaldata({ type: 3, kwd: this.kwd }).then((res) => {
              this.treeVisual.tree.children = res.data;
            });
            break;
          case 4:
            this.get_roles();
            break;
          case 5:
            this.get_document_recently_circulated();
            break;
        }
      } else {
        this.get_inter_list();
      }
    },
    // tab切换
    callback(key) {
      this.kwd = "";
      switch (key) {
        case 1:
          this.addList();
          break;
        case 2:
          this.get_list_company();
          break;
        case 3:
          this.get_tags();
          break;
        case 4:
          this.get_roles();
          break;
        case 5:
          this.get_document_recently_circulated();
          break;
      }
    },
    // 获取组织架构列表信息
    addList() {
      OrganiZationalList({
        dept_id: this.treeClickid,
        type: this.tag.pe ? 3 : 1,
        keyword: this.kwd,
      }).then((data) => {
        this.treeVisual = data.data;
        this.prefix = data.data.tree.title;
      });
    },

    //获取发文收文单位的信息
    async get_list_company() {
      let { data } = await list_company({
        keyword: this.kwd,
        limit: 100000, //获取全部数据
      });
      if (data.data) {
        data.data.forEach((el) => {
          el.type = 3;
          el.key = el.id;
        });
      }
      this.treeVisualS.tree.children = data.data;
    },

    // 获取互联单位数据
    async get_inter_list() {
      let { code, data } = await inter_list({
        kwd: this.kwd,
        limit: 100000, //获取全部数据
      });
      if (code == 1) {
        data.forEach((el) => {
          el.type = 7;
          el.key = el.id;
          el.title = el.corp_name;
        });
        this.treeVisualS.tree.children = data;
      }
    },
    //获取标签数据
    async get_tags() {
      let data = await addLabelList({ kwd: this.kwd });
      data.data.tags.forEach((el) => {
        el.type = 4;
      });
      //   children
      this.treeVisualS.tree.children = data.data.tags;
    },
    //获取角色数据
    async get_roles() {
      let data = await document_role_index({
        name: this.kwd,
        limit: 100000, //获取全部数据
      });
      if (data.data && data.data.datas) {
        data.data.datas.forEach((el) => {
          el.title = el.role_name;
          el.type = 5;
        });
        this.treeVisualS.tree.children = data.data.datas;
      }
    },
    //获取最近选择
    async get_document_recently_circulated() {
      let data = await document_recently_circulated();
      data.data.forEach((el) => {
        el.type = 6;
        el.title = el.name;
      });
      this.treeVisualS.tree.children = data.data;
    },
    // 选择人员
    treeClick(e) {
      // 单选
      if (this.tag.rad) {
        this.range.visual = [];
      }
      //传过来的是部门内的人
      if (e.length || e.length == 0) {
        if (e.length > 0) {
          e.forEach((el) => {
            if (!this.range.visual.some((v) => v.del_id == el.del_id)) {
              this.range.visual.push(el);
            }
          });
        }
      } else {
        if (!this.range.visual.some((v) => v.del_id == e.del_id)) {
          this.range.visual.push(e);
        }
      }
    },

    // 删除
    delvisualcl(item) {
      //删除某个树形结构的数据（多选的）
      for (let i in this.range.visual) {
        if (this.range.visual[i].del_id == item.del_id) {
          this.range.visual.splice(i, 1);
        }
      }
    },
    // 全部删除
    listCloseFun() {
      this.range.visual = [];
    },
    //------------ 可见范围  ------------

    //当输入框内容为空的时候重置搜索
    has() {
      if (this.kwd.trim().length <= 0) {
        this.addList();
      }
    },
  },
  watch: {
    show_data_flag() {
      this.kwd = "";
      if (!this.tab.hl) {
        this.radiovalue = "a";
      }
      this.update_father_data();
      if (this.radiovalue == "b") {
        this.get_inter_list();
        return;
      }
      if (this.tag.tab) {
        this.tab = 1;
        this.addList();
      } else if (this.tag.company) {
        this.tab = 2;
        this.get_list_company();
      } else if (this.tag.label) {
        this.tab = 3;
        this.get_tags();
      } else if (this.tag.role) {
        this.tab = 4;
        this.get_roles();
      } else if (this.tag.lately) {
        this.tab = 5;
        this.get_document_recently_circulated();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.list-div {
  .list-type {
    text-align: center;
    padding: 16px 0;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);
    /deep/ .ant-radio-button-wrapper {
      background-color: #f5f7fa;
      border-radius: 0;
      border: none;
    }
    /deep/ .ant-radio-button-wrapper-checked {
      background-color: #1890ff !important;
    }
  }
  .list-box-top {
    margin: 15px 0;
    text-align: center;
  }
  .list-box {
    height: 466px;
    display: flex;
    .list-box-cl {
      height: 100%;
      padding: 0 2px;
      box-sizing: border-box;
      .list-box-cl-cell {
        height: 40px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        .transfer-icon {
          font-size: 24px;
          margin: 0 10px;
        }
        .transferlist-icon {
          color: #e6b821;
        }
        .transferlistcl-icon {
          color: #6fb9f6;
        }
      }
      .list-box-cl-cell-activ {
        background-color: #f2f7ff;
      }
    }
    .list-box-right {
      width: 330px;
      padding: 0 0 0 20px;
      border-left: 1px solid #ebeef5;
      .list-box-right-top {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .list-box-right-top-close {
          color: #0082ef;
        }
      }
      .list-box-right-bottom {
        padding: 10px 0;
        height: 430px;
        overflow: auto;
        .list-box-right-bottom-cl {
          line-height: 40px;
          height: 40px;
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
        }
        .list-box-right-bottom-cl:hover {
          background-color: #e6f7ff;
        }
      }
    }
    .list-box-left {
      width: 390px !important;
      position: relative;
      .list-search {
        width: 330px;
        padding: 12px 0px;
        position: absolute;
        top: 40px;
        left: 0;
        z-index: 10;
        box-sizing: border-box;
      }
      /deep/ .ant-tabs-bar {
        margin: 0;
        height: 40px;
        .ant-tabs-tab {
          padding: 10px 6px;
          margin: 0 15px 0 0;
        }
      }
      /deep/ .ant-tabs .ant-tabs-top-content .ant-tabs-tabpane {
        height: 390px;
        overflow: auto;
        margin-top: 50px;
      }
    }
  }
}
.flex-center {
  display: flex;
  align-items: center;
}
.name {
  width: 210px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

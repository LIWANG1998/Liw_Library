<template>
  <div class="main">
    <div class="main table-content-at" :style="{height:`${height + 54 + 12}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        @change="ChangeSort"
        :scroll="{ y: height }"
      >
        <span slot="name" slot-scope="item,record">
          <span>{{item}}</span>
          <span class="main-table-at-cy" v-if="record.status == 1">常用</span>
        </span>
        <span slot="operation" slot-scope="item,record">
          <div class="flex-db operation">
            <span style="color:#0082EF" @click="editclick(record,4)">预览</span>
            <span style="color:#0082EF" @click="editclick(record,1)">编辑</span>
            <a
              :href="`${HttpUrl}/red_template_download?id=${record.key}&type=2&token=${$store.state.token}`"
              download="name"
            >
              <span style="color:#0082EF" @click="editclick(record,2 )">下载</span>
            </a>
            <span style="color:#fa5555" @click="editclick(record,3)">删除</span>
          </div>
        </span>
        <!-- <span >无权限</span> -->
      </a-table>
    </div>
    <Pagetion
      @pageChange="pagechangemsonset"
      @currentchange="currentchangemsonset"
      :paging="paging"
      class="Page"
    />
    <a-modal v-model="visibles" cancelText="取消" okText="确定" title="修改套红模板名称" @ok="handleOks">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="模板名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 套红预览 -->
    <a-modal
      class="transfer-modal"
      title="套红模板预览"
      :visible="view_template.visible"
      :confirm-loading="confirmLoading"
      @ok="view_template.visible=false"
      @cancel="view_template.visible=false"
      :footer="null"
      cancelText="取消"
      okText="确认"
    >
      <div class="view_template">
        <span class="content" v-html="view_template.content"></span>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  Delloadcrims,
  Setloadcrims,
  Getloadcrims,
  Download,
} from "@/api/postcrimsonset.js";
import { Calculatedaltitude } from "@/js/public.js";
import Pagetion from "@/views/components/Pagination.vue";
import { HttpUrl, preview_url } from "@/js/public.js";

export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      row: {},
      height: 0,
      visibles: false,
      form: {
        //修改套红模板内容
        name: "",
      },
      rules: {
        // 修改套红模板内容判断
        name: [
          {
            required: true,
            message: "请输入发文分类名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 15,
            message: "请输入不超过15个字符",
            trigger: ["change", "blur"],
          },
        ],
      },
      HttpUrl,
      // 传送给分页的数据
      paging: {
        total: null,
        current: 1,
        pageSize: 10,
      },
      getpostList: false, //分页改变的时候判断获取查询的数据还是列表数据
      table_data: {}, //排序
      view_template: { visible: false, content: "" }, //套红模板预览
      //弹窗动画
      confirmLoading: false,
    };
  },
  components: {
    Pagetion,
  },
  created() {
    // 获取套红模板列表
    this.getloadcrims();

    // 获取查询之后的表格
    this.onList();

    // 查询之后改变页数
    this.$bus.$on("postpostcrimsInquire", (val) => {
      this.paging.current = val;
    });

    // 发送页数和显示条数给其他组件
    this.$bus.$emit("postsendpage", {
      defaultCurrent: this.paging.current,
      defaultPageSize: this.paging.pageSize,
    });

    this.columns = [
      {
        title: "模板名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: { customRender: "name" },
      },
      {
        title: "创建账号",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        key: "create_time",
        ellipsis: true,
        sorter: (a, b) => a.create_time.length - b.create_time.length,
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        width: 160,
        scopedSlots: { customRender: "operation" },
      },
    ];
  },
  mounted() {
    this.height = Calculatedaltitude(10, 60, 12, 54, 59);
  },
  methods: {
    ///postcrimsonset/crimsonadd   type：1:=>新建，2=>预览，3=>编辑
    editclick(el, num) {
      // num:1=>编辑，2=>下载，3=>删除，4=>预览
      if (num == 1) {
        this.row = el;
        this.form.name = el.name;
        this.$router.push({
          path: "/postcrimsonset/crimsonadd",
          query: { id: el.key, type: 3 },
        });
      }
      if (num == 2) {
        this.row = el;
      }
      if (num == 3) {
        this.row = el;
        this.showModal();
      }
      if (num == 4) {
        this.view_template.visible = true;
        this.view_template.content = el.content;
      }
    },
    // 点击确定关闭编辑套红模板弹窗
    handleOks() {
      // this.setloadcrims();
      this.visibles = false;
    },
    // 点击删除按钮，打开弹窗
    showModal() {
      this.visible = this.$confirm({
        title: "提示",
        content: "删除后数据不可恢复，是否继续？",
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: this.handleOk,
      });
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.delloadcrims();
    },
    // 页码发生变化
    pagechangemsonset(val) {
      this.paging.current = val;
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("postsetpostList", {
          current: this.paging.current,
          page: this.paging.pageSize,
        });
      } else {
        this.getloadcrims();
      }
    },
    // 条数发生变化
    currentchangemsonset(val) {
      this.paging.pageSize = val;
      this.paging.current = 1;
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("postsetpostList", {
          current: this.paging.current,
          page: this.paging.pageSize,
        });
      } else {
        this.getloadcrims();
      }
    },
    // 获取套红模板列表
    getloadcrims() {
      Getloadcrims({
        page: this.paging.current,
        type: 1,
        sort: this.table_data.sort_type,
        order_field: this.table_data.sort_field,
      }).then((res) => {
        if (res.code == 1) {
          let arr = [];
          res.data.data.map((v) => {
            let obj = {};
            obj.key = v.id;
            obj.name = v.name;
            obj.create_time = v.create_time;
            obj.age = v.username;
            obj.path = v.path;
            obj.status = v.status;
            obj.content = v.content
            arr.push(obj);
          });
          this.data = arr;
          this.paging.total = res.data.count;
        } else {
          this.data = [];
          this.paging.total = 0;
        }
      });
    },
    // 获取查询后的列表
    onList() {
      // 接收点击查询之后传来的参数
      this.$bus.$on("postloadList", (val) => {
        if (val.res.data) {
          let arr = [];
          val.res.data.map((v) => {
            let obj = {};
            obj.key = v.id;
            obj.name = v.name;
            obj.create_time = v.create_time;
            obj.age = v.username;
            obj.path = v.path;
            obj.content = v.content;
            arr.push(obj);
          });
          this.data = arr;
          this.paging.total = val.total;
          this.getpostList = val.getpostList;
        } else {
          this.data = [];
          this.paging.total = 0;
        }
      });
    },
    // 删除套红模板
    delloadcrims() {
      Delloadcrims({ id: this.row.key }).then((res) => {
        if (res.code == 1) {
          this.getloadcrims();
        }
      });
    },
    // 排序变化
    ChangeSort(p, f, s) {
      if (s.order) {
        let order = "";
        switch (s.order) {
          case "ascend":
            order = "asc";
            break;
          case "descend":
            order = "desc";
            break;
        }
        this.table_data.sort_field = s.columnKey;
        this.table_data.sort_type = order;
        this.$bus.$emit("crimsonsetsort", { sort: order, field: s.columnKey });
        if (this.getpostList) {
          this.onList();
        } else {
          this.getloadcrims();
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  padding-top: 0;

  .operation {
    * {
      cursor: pointer;
    }
  }
}

/deep/ .maincontent {
  position: relative;

  .Page {
    position: absolute;
    bottom: 0px;
  }
}
.main-table-at-cy {
  display: inline-block;
  text-align: center;
  font-size: 12px;
  width: 34px;
  height: 20px;
  background: #eaf0fc;
  color: #839ccf;
  margin-left: 6px;
}
.transfer-modal {
  /deep/ .ant-modal-footer {
    border: none;
  }
  /deep/.ant-modal-content {
    width: 606px;
  }
  .view_template {
    display: flex;
    margin-top: 50px;
    height: 500px;
   /deep/ .content {
      position: relative;
      width: 555px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      overflow-y: auto;
      overflow-x: hidden;
      * {
        position: relative !important;
        max-width: 548px !important;
        word-break: break-all !important;
        word-wrap: break-word !important;
        white-space: pre-wrap !important;

      }
      .w-e-text {
        padding: 0 !important;
        word-break: break-all;
        word-wrap: break-word;
      }
      pre {
        text-align: center;
      }
    }
  }
}
</style>
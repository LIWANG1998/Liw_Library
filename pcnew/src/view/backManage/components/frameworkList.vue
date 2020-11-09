<template>
  <div class="user-list_box">
    <a-row class="header" type="flex" align="middle" justify="space-between">
      <a-col class="title">用户列表</a-col>
      <a-col class="right-btn">
        <a-button
          type="primary"
          :loading="btnOptions.departLoading"
          @click="syncShow = true"
          >{{ btnOptions.departTxt }}</a-button
        >
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-between">
      <a-col>
        已选 {{ selectNumber }} 位用户
        <a-button
          type="primary"
          :disabled="selectNumber == 0"
          @click="handleEdit('all', selectData)"
          >批量编辑</a-button
        >
      </a-col>
      <a-col>
        <a-form :model="searchInfo" layout="inline">
          <a-form-item>
            <a-select v-model="searchInfo.u_roles" placeholder="请选择角色">
              <a-select-option
                v-for="item in roleList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select v-model="searchInfo.field">
              <a-select-option value="name">姓名</a-select-option>
              <a-select-option value="mobile">手机号 </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="searchInfo.keyword"
              :placeholder="
                searchInfo.field === 'name' ? '请输入姓名' : '请输入手机号'
              "
              clearable
              @keyup.enter.native="handleSearch"
            ></a-input>
          </a-form-item>
          <a-form-item style="margin-right: 0">
            <a-button type="primary" @click="handleSearch">查询</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <div v-if="tableData.length > 0">
      <a-table
        :header-cell-style="headClass"
        :dataSource="tableData"
        :rowKey="(row) => row.id"
        height="410"
        :scroll="{ x: 'calc(640px + 50%)', y: 440 }"
        :row-selection="{
          selectedRowKeys: selectData,
          onChange: handleSelectionChange,
          getCheckboxProps: getCheckboxProps,
        }"
        :pagination="pageInfo"
        @change="handleTableChange"
      >
        <a-table-column
          key="name"
          title="姓名"
          data-index="name"
          align="center"
          :width="70"
        ></a-table-column>
        <a-table-column
          key="gender"
          title="性别"
          data-index="gender"
          align="center"
          :width="80"
        >
          <template slot-scope="gender">
            {{ gender == 0 ? "保密" : gender == 1 ? "男" : "女" }}
          </template>
        </a-table-column>
        <a-table-column
          key="avatar"
          title="头像"
          data-index="avatar"
          align="center"
          :width="60"
        >
          <template slot-scope="avatar">
            <a-avatar shape="square" :src="avatar" slot="reference"></a-avatar>
          </template>
        </a-table-column>
        <a-table-column
          key="mobile"
          title="手机号"
          data-index="mobile"
          align="center"
          :width="120"
        ></a-table-column>
        <a-table-column
          key="email"
          title="邮箱"
          data-index="email"
          align="center"
          :width="80"
          :ellipsis="true"
        ></a-table-column>
        <a-table-column
          key="department_name"
          show-overflow-tooltip
          title="部门"
          data-index="department_name"
          align="left"
          :width="100"
          :ellipsis="true"
        ></a-table-column>
        <a-table-column
          key="position"
          show-overflow-tooltip
          title="职位"
          data-index="position"
          :ellipsis="true"
          :width="100"
        ></a-table-column>
        <a-table-column
          key="u_role_name"
          title="角色"
          data-index="u_role_name"
          :width="110"
          :ellipsis="true"
        ></a-table-column>
        <a-table-column title="操作" key="edit" align="center" :width="80" fixed="right">
          <template slot-scope="record">
            <a-button
              type="primary"
              size="small"
              :disabled="record.u_roles == 2"
              @click="handleEdit('single', record)"
              >编辑</a-button
            >
          </template>
        </a-table-column>
      </a-table>
    </div>

    <div class="no-data" v-else>
      <img
        src="@/assets/images/nodata.png"
        alt="暂无数据"
        class="no-data-img"
      />
    </div>
    <edit-info
      :show.sync="editShow"
      :roleList="roleList"
      :data="editData"
      :type="type"
      @update="getUserData"
    ></edit-info>
    <sync-data
      :show.sync="syncShow"
      @update="
        pageInfo.page = 1;
        getUserData;
      "
    ></sync-data>
  </div>
</template>
<script>
import editInfo from "./editInfo";
import syncData from "./syncData";
import { common } from "@/api";

export default {
  props: ["departData"],
  components: {
    editInfo,
    syncData,
  },
  data() {
    return {
      searchInfo: {
        keyword: "",
        mobile: "",
        u_roles: undefined,
        field: "name",
        type: 2,
        state: 1,
      },
      roleList: [],
      tableData: [],
      loading: true,
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 人`,
      },
      editShow: false,
      editData: "",
      selectNumber: 0,
      type: "",
      selectData: [],
      syncShow: false,
      btnOptions: {
        departLoading: false,
        departTxt: "同步组织架构",
        tagsLoading: false,
        tagsTxt: "同步标签",
      },
    };
  },
  watch: {
    departData(val) {
      this.searchInfo.dep_id = val;
      this.getUserData();
    },
  },
  created() {
    this.getUserData();
    this.getRoleData();
  },
  filters: {
    formatAvatar(img, rootPath) {
      let imgUrl = "",
        path = `http://${rootPath.split("/")[2]}`;
      if (img.includes("http") || img.includes("https")) {
        imgUrl = img;
      } else {
        imgUrl = path + img;
      }
      return imgUrl;
    },
  },
  computed: {
    getRootPath() {
      return this.$store.state.common.rootPath;
    },
    headClass() {
      return { background: "#F2F3F5" };
    },
  },
  methods: {
    async getUserData() {
      let search = Object.assign(this.searchInfo, this.pageInfo);
      delete search.showTotal;
      this.loading = true;
      const { data, total } = await common.getUsers(search);
      this.tableData = data;
      this.pageInfo.total = total;
    },
    async getRoleData() {
      const { data } = await common.getAllRole();
      // data.unshift({
      //   id:"",
      //   name:"请选择角色"
      // })
      this.roleList = data;
    },
    handleSearch() {
      this.pageInfo.page = 1;
      this.getUserData();
    },
    handleTableChange(page) {
      this.pageInfo.page = page.current;
      this.getUserData();
    },
    handleEdit(type, row) {
      this.editShow = true;
      this.editData = row;
      this.type = type;
    },
    // 设置可选项
    getCheckboxProps(record) {
      console.log(record.u_roles,record.u_roles >= 2);
      return {
        props: {
          disabled: record.u_roles <= 2, // Column configuration not to be checked
        },
      };
    },
    // 全选操作
    handleSelectionChange(val) {
      this.selectData = val;
      this.selectNumber = val.length;
    },
    // 同步组织架构
  },
};
</script>
<style lang="less" scoped>
.user-list_box {
  padding-left: 10px;
  .header {
    margin-bottom: 10px;
    border-bottom: 1px solid #f6f6f6;
  }
  .title {
    line-height: 40px;
    font-size: 16px;
    text-align: left;
  }
  .ant-input {
    width: 162px;
    display: inline-block;
  }
  .ant-select {
    /*width: 116px;*/
    width: 140px;
  }
  /deep/.ant-table td {
    padding: 5px 10px;
  }
  /deep/.ant-table th {
    padding: 10px;
  }
  .right-btn {
    text-align: right;
    box-sizing: border-box;
  }
  /deep/ .ant-pagination-total-text {
    background-color: #fff;
  }
}
</style>

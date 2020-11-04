  <template>
  <div class="mains">
    <div class="table-content-at" :style="{ height: `${height + 54 + 24}px` }">
      <a-table
        v-if="userList"
        :scroll="{ y: height }"
        :columns="columns"
        :data-source="userList"
        :pagination="false"
        :row-key="(record) => record.id"
      >
        <span slot="state" slot-scope="item, record">
          <span :style="{ color: inter_state[record.state].color }"
            ><span class="status_span">·</span>
            {{ inter_state[record.state].text }}</span
          >
        </span>
        <span slot="operation" slot-scope="item, record">
          <a-button type="danger" @click="disassociate(record)">
            取消关联
          </a-button>
        </span>
      </a-table>
    </div>
    <a-pagination
      v-model="paging.current"
      :total="paging.total"
      :page-size="paging.size"
      :page-size-options="pageSizeOptions"
      @change="pageChange"
      show-size-changer
      @showSizeChange="onShowSizeChange"
      class="a-pagination"
    ></a-pagination>
    <!-- <a-modal
      title="删除用户"
      :visible="delete_visible"
      :confirm-loading="confirmLoading"
      @ok="delete_ok"
      @cancel="delete_visible = false"
      okText="确认"
      cancelText="取消"
    >
      <p>{{ ModalText }}</p>
    </a-modal> -->
  </div>
</template>
<script>
let inter_state = {
  0: {
    text: "单位已删除应用",
    color: "#F56C6C",
  },
  1: {
    text: "正常",
    color: "#0082EF",
  },
};
import { unbind_comapny } from "@/api/interconnection.js";
import Pagination from "@/views/components/Pagination.vue";
import { Calculatedaltitude } from "@/js/public.js";
export default {
  name: "Main",
  props: {
    userList: {
      default: null,
    },
    count: {
      default: null,
    },
  },
  components: {
    Pagination,
  },
  data() {
    return {
      inter_state,
      data: null,
      columns: null,
      rowSelection: null,
      // load_flag: false,
      //删除提醒
      // delete_visible: false,
      // ModalText: "该操作不可逆，请谨慎操作",
      // confirmLoading: false,
      //删除的用户id
      // delete_id: null,

      //tabel高度
      height: 0,
      // 分页组件参数
      paging: {
        current: 1,
        total: null,
        size: 10,
      },
      //当前页条数
      pageSizeOptions: ["10", "20", "30", "40", "50"],
    };
  },
  mounted() {
    this.height = Calculatedaltitude(60, 60, 70);
  },
  created() {
    this.columns = [
      {
        title: "单位名称",
        dataIndex: "corp_name",
        key: "corp_name",
        ellipsis: true,
      },
      {
        title: "状态",
        dataIndex: "state",
        key: "state",
        scopedSlots: { customRender: "state" },
        ellipsis: true,
      },
      {
        title: "添加者",
        dataIndex: "add_user",
        key: "add_user",
        ellipsis: true,
      },
      {
        title: "添加时间",
        dataIndex: "add_time",
        key: "add_time",
        ellipsis: true,
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 170,
      },
    ];

    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
  },
  methods: {
    //分页操作
    pageChange(val) {
      this.paging.current = val;
      this.$emit("update_user", this.paging);
    },
    onShowSizeChange(size, pageSize) {
      this.paging.size = pageSize;
      this.$emit("update_user", this.paging);
    },
    // 解除互联
    disassociate(el) {
      let _this = this;
      this.$confirm({
        title: "提示?",
        content: (h) => (
          <div style="color:#606266;font-size:15px">确认要解除互联关系？</div>
        ),
        onOk() {
          _this.delete_user(el.id);
        },
        onCancel() {},
        class: "test",
      });
      // this.delete_visible = true;
      // this.delete_id = el.id;
    },
    // 解除互联
    async delete_user(id) {
      let { code } = await unbind_comapny({ id });
      if (code == 1) {
        this.$emit("update_user", this.paging);
      }
      // this.delete_id = null;
      // this.delete_visible = false;
    },
    //确认删除
    // delete_ok() {
    //   if (this.delete_id) {
    //     this.delete_user(this.delete_id);
    //   }
    // },
  },
  watch: {
    count() {
      this.paging.total = this.count;
    },
  },
};
</script>
<style lang="less" scoped>
.mains {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
}
.a-pagination {
  margin: 10px 0px !important;
}
.status_span {
  font-size: 40px;
  line-height: 0px;
  vertical-align: -7px;
}
</style>
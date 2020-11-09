<template>
  <a-modal
    title="编辑信息"
    :visible.sync="editShow"
    width="550px"
    class="pickUserBox"
    centered
    :confirm-loading="confirmLoading"
    @cancel="editShow = false"
    @ok="submit('editForm')"
  >
    <a-form-model
      :model="formData"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 14 }"
      ref="editForm"
      class="editForm"
    >
      <a-form-model-item label="姓名" v-if="type == 'single'">
        <a-input v-model="formData.name" disabled></a-input>
      </a-form-model-item>
      <a-form-model-item label="角色" prop="role_id">
        <a-select v-model="formData.role_id">
          <a-select-option
            v-for="item in _roleList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import { common } from "@/api";
export default {
  props: ["show", "roleList", "data", "type"],
  data() {
    return {
      loading: true,
      formData: {
        id: "",
        name: "",
        role_id: "",
      },
      confirmLoading: false,
      rules: {
        role_id: [{ required: true, message: "请选择角色", trigger: "blur" }],
      },
    };
  },
  watch: {
    data() {
      this.setData();
    },
  },
  created() {
    setTimeout(() => {
      if (this.data) this.setData();
      this.loading = false;
    }, 1000);
  },
  computed: {
    editShow: {
      get: function () {
        return this.show;
      },
      set: function (val) {
        this.$emit("update:show", val);
      },
    },
    _roleList(){
      return this.roleList.filter(item=>item.id!==2);
    },
  },
  methods: {
    setData() {
      if (this.type === "single") {
        this.formData.id = this.data.id;
        this.formData.name = this.data.name;
        this.formData.role_id =
          Number(this.data.u_roles) > 0 ? Number(this.data.u_roles) : "";
        let index = this.roleList.findIndex(item=>item.id==this.data.u_roles);
        if(index < 0){
           this.formData.role_id = "";
        }
      } else {
        let postData = {
          id: this.data.join(","),
          role_id: "",
        };
        this.formData = postData;
      }
    },
    async saveData() {
      try {
        const { code, msg} = await common.setRole(this.formData);
        this.confirmLoading = false;
        if (code) {
          this.editShow = false;
          this.$message.success(msg)
          this.$emit("update");
        } else {
          this.$message.error(msg)
        }
      } catch {
        this.confirmLoading = false;
      }
    },
    submit(form) {
      this.confirmLoading = true;
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.saveData();
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.editForm {
  width: 70%;
  margin-left: 10%;
  .el-select,
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-button {
    margin-left: 40px;
  }
}
</style>

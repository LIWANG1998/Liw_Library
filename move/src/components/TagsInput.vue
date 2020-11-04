<template>
  <div class="muli-tags" @click="focus">
    <template v-for="(tag, index) in tags">
      <van-tag
        :key="index"
        closeable
        size="medium"
        type="primary"
        @close="delTag(tag)"
        >{{ tag.title }}</van-tag
      >
    </template>
    <!-- <button class="btn" v-for="(tag, index) in tags" :key="index" @click="delTag(index)">
      {{tag}}
      <span>x</span>
    </button>-->
    <template v-if="!item.is_d">
      <input
        type="text"
        ref="input"
        @keyup.enter="add"
        @keydown.188="split"
        @blur="split"
        v-model="current"
        :placeholder="
          item.input_type_new == 1 && item.input_type == 1
            ? '请输入'
            : '请输入/选择'
        "
        maxlength="8"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true,
      default: () => [],
    },
    sendingunit: {
      type: Array,
      required: true,
      default: () => [],
    },
    item: {
      type: Object,
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    split(e) {
      e.preventDefault();
      this.add(e);
    },
    add(e) {
      const val = e.target.value;
      if (!val) return;
      if (
        this.tags.find((item) => {
          return item.title == val;
        }) != undefined
      ) {
        return true;
      }
      //   if (this.tags.indexOf(val) > -1) return;
      var timestamp = new Date().getTime();
      this.tags.push({
        w_id: "lw_" + timestamp,
        title: val,
        type: 100,
      });
      this.$emit("input", this.tags);
      this.current = "";
    },
    // del(e) {
    //   // console.log(e);
    //   if (!e.target.value.length) {
    //     this.sendingunit.pop();
    //     this.tags.pop();
    //     this.$emit("input", this.tags);
    //     // console.log(this.tags);
    //   }
    // },
    delTag(v) {
      if (v.type == 500) {
        return;
      }
      let _wid = v.w_id;
      console.log(v, this.tags, this.fields_data, _wid);
      let index = this.tags.map((item) => item.w_id).indexOf(v.w_id);
      this.sendingunit.splice(index, 1);
      this.tags.splice(index, 1);
      this.$emit("input", this.tags);
      let vi = this.fields_data?.reviewer
        ? "reviewer"
        : this.fields_data?.receiving_user
        ? "receiving_user"
        : null;
      console.log(vi)
      if (!!v.doc_receiver && vi) {
        // console.log(v.id);
        // let _index = this.fields_data?.reviewer?.values
        //   .map((item) => item.id)
        //   .indexOf(v.id);
        // this.fields_data?.reviewer?.values.splice(_index, 1);
        for (
          let ins = this.fields_data[vi].values.length - 1;
          ins >= 0;
          ins--
        ) {
          if (this.fields_data[vi].values[ins].wid == v.w_id) {
            this.fields_data[vi]?.values.splice(ins, 1);
          }
        }
      }
      if (v.receiver && vi) {
        for (
          let ins = this.fields_data[vi].values.length - 1;
          ins >= 0;
          ins--
        ) {
          if (this.fields_data[vi].values[ins].wid == v.w_id) {
            this.fields_data[vi]?.values.splice(ins, 1);
          }
        }
      }
      // console.log(this.tags);
    },
  },
  computed: {
    tags() {
      return this.value.slice();
    },
    fields_data() {
      return this.$store.state.edittext.document_arrs;
    },
  },
  created() {
    // console.log("this.item", this.item);
  },
  data() {
    return {
      current: "",
    };
  },
};
</script>

<style lang='scss' scoped>
.muli-tags {
  //   padding: 5px 10px;
  display: block;

  //   border: 1px solid #ccc;
  input {
    background: transparent;
    border: none;
    width: 100%;
  }
  input::-webkit-input-placeholder {
    color: #c0c4cc;
  }
  input::-moz-input-placeholder {
    color: #c0c4cc;
  }
  input::-ms-input-placeholder {
    color: #c0c4cc;
  }
  .btn {
    margin: 0 5px 3px 0;
    padding: 4px 5px;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0 0 4px;
  }
  /deep/.van-tag {
    margin-right: 5px;
    margin-bottom: 3px;
  }
}
</style>
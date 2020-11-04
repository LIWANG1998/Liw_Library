<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <Header @update_user="get_search" @onChange="onChange" />
      <Main
        class="Main"
        @update_user="get_page"
        :userList="data"
        :count="count"
      />
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Header from "./components/header.vue";
import Main from "./components/main.vue";
import { inter_list } from "@/api/interconnection.js";
export default {
  name: "interconnection",
  components: {
    Header,
    Main,
    Maintitle,
    Maincontent,
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false, // 返回开关
      },
      //数据
      data: null,
      count: null,
      search: "",
      obj: {
        one: {},
      },
    };
  },
  created() {
    this.get_list();
  },
  methods: {
    //接收子组件传过来的值
    get_search(search) {
      this.search = search;
      this.get_list(1, 10, this.search);
    },
    get_page(paging) {
      this.get_list(paging.current, paging.size, this.search);
    },
    onChange(obj) {
      this.obj.one = obj;
      this.get_list(1, 10, this.search);
    },
    //发送请求,获取数据
    // async get_list(page = 1, limit = 10, name = "") {
    //   let obj = this.obj;
    //   let { code, data, msg } = await get_role_list({
    //     page,
    //     limit,
    //     name,
    //     start_time: obj.one["创建时间"]?.arry[0],
    //     end_time: obj.one["创建时间"]?.arry[1],
    //   });
    //   this.data = data.datas;
    //   this.count = data.count;
    // },
    async get_list(page = 1, limit = 10, kwd = "") {
      let res = await inter_list({ kwd, page, limit });
      console.log(res);
      if (res.code == 1) {
        this.data = res.data;
        this.count = res.count;
      } else {
        this.data = [];
        this.count = 0;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.maincontent {
  padding-top: 10px;
}
</style>
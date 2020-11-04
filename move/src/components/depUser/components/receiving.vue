<template>
  <div class="listitem" :style="`height:${height}px;`">
    <van-checkbox-group v-model="result" ref="checkDep">
      <van-cell-group>
        <van-cell  v-for="(item, index) in dataList" clickable :key="index" >
          <div >
            <img class="fileimg" src="../../../assets/img/home/zuzhifile.png" alt />
            <span class="name">{{item.title}}</span>
          </div>
          <template #right-icon>
            <van-checkbox :name="item.id" />
          </template>
        </van-cell>

        <!-- </van-list> -->
      </van-cell-group>
    </van-checkbox-group>
  </div>
</template>

<script>
import { url, screenHeight } from "@/utils/utils.js";
// import { depList } from '@/api/organization'
import { getDeptList, getListCompant } from "@/api/home";

export default {
  props: ["keys", "adddatas", "active"],

  data() {
    return {
      showUser: true, //显示人员
      showUdep: true, //显示部门

      result: [], //组织架构菜单选中的值
      deps: { child_dept: [], members: [] }, //部门列表
      choiseAll: true,
      depTotal: 0, //选择部门多少人
      dept_id: "",
      nums: {
        dem_num: 0,
        usernum: 0,
      },
      height: "",
      ids: "",
      url,
      show: false,
      userClickItem: "",
      newID: [],
      arr: [], // lx储存的选中数据
      finished: false, // lx分页相关
      loading: false,
      count: 0,
      page: 1,
      limit: 10,
      //
      dataList:[],
      //

    };
  },
  // beforeMount() {

  // },
  created() {
    this.getListCompant();
  },
  mounted() {
    this.height = screenHeight(228.6);
  },
  activated() {},
  watch: {},

  methods: {
    //   receiver_name文书名字
   getListCompant(){
       getListCompant().then(res=>{
          if(res.code==1){
              this.dataList=res.data.data
          }
       })

   },
    onLoad() {
      this.geListCompant();
    },
  },
};
</script>

<style lang="scss" scoped>
.listitem {
  color: #2d3034;
  padding-bottom: 110px;
  overflow: auto;

  .toptitle {
    margin-top: 10px;
    font-size: 16px;
    padding: 0px 20px;
    height: 40px;
    font-weight: 900;
  }

  .textbox {
    font-size: 14px;
    padding: 0px 20px;
    min-height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      color: rgb(149, 148, 148);
    }

    .imgs {
      height: 40px;
      width: 40px;
      border-radius: 5px;
    }
  }

  .yesbtn {
    height: 30px;
    padding: 0px 20px;
  }

  .van-cell {
    .fileimg {
      vertical-align: top;
      width: 40px;
      height: 40px;
      //   border: 1px dotted #2d3034;
      vertical-align: middle;
    }

    .fileimg-box {
      display: inline-block;
      vertical-align: top;
    }

    .demname {
      font-size: 12px;
      color: #959595;
      margin-left: 10px;
      width: 250px;
    }

    .name {
      display: inline-block;
      width: auto;
      padding-left: 10px;
    }

    .names {
      font-size: 14px;
      margin-left: 15px;
    }
  }

  .bottboxs {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    width: 100%;
    box-sizing: border-box;
    bottom: 60px;
    background-color: #ffffff;
    position: fixed;
    right: 0;
    max-width: 720px;
  }

  .bottommenu {
    padding: 0 20px;
    display: flex;
    max-width: 720px;
    align-items: center;
    height: 60px;
    line-height: 60px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    border-top: 1px solid #f5f6f7;
  }
}
</style>
<template>
  <div class="task my-task">
    <van-sticky>
      <DropdownMenu>
        <DropdownItem
          @open="showMenu = 'start', show = true"
          ref="start"
          title="发起时间"
        >
          <drop-item-new
            type="5"
            :show="show"
            :data="query"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
        <DropdownItem
          @open="showMenu = 'end', show = true"
          ref="end"
          title="结束时间"
        >
          <drop-item-new
            type="6"
            :show="show"
            :data="query"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
        <DropdownItem
          title="筛选"
          ref="item"
          @open="showMenu = 'item', show = true"
          icon="filter-o">
          <drop-item-new
            :show="show"
            :data="query"
            @cancel="handleDorpItemCancel()"
            @confirm="handleDorpItemConfirm($event)"
          ></drop-item-new>
        </DropdownItem>
      </DropdownMenu>
    </van-sticky>
<!--    <list type="allTask" :isFull="true" :query="query" />-->
    <div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :offset="60"
          finished-text="没有更多了"
          class="list"
          @load="onLoad"
        >
          <van-row class="row" gutter="20">
              <van-col
              class="col"
              :span="12"
              v-for="(item, index) in list"
              :key="index"
              >
                <router-link :to="'/taskUserList?ui=' + item.userid">
                 <div class="bg">
                  <div class="flex bor_bot">
                    <div class="flex">
                      <img :src="item.avatar">
                      <span class="name">{{item.name}}</span>
                    </div>
                    <van-icon class="icon" name="arrow"  color="#C0C4CC" size="16"/>
                  </div>
                  <div class="count">
                    <span>相关任务数</span>
                    <span>{{item.tr_count}}</span>
                  </div>
                </div>
                </router-link>
              </van-col>
          </van-row>
        </van-list>
      </van-pull-refresh>
    </div>

  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
import dropItemNew from "../components/dropItemNew";
// import list from "@/views/task/components/list";
import { statistics } from "@/api";
import { getStore, setStore } from "@/utils/store";
import { mapGetters } from "vuex";
export default {
  components: {
    DropdownMenu,
    DropdownItem,
    // list,
    dropItemNew
  },
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      total: 0,
      showMenu:'',
      show:false,
      query: '',
      page: {
        page: 0,
        num: 10,
      },
      statusOption: [
        {
          text: "全部",
          value: 1,
        },
        {
          text: "待开始",
          value: 2,
        },
        {
          text: "执行中",
          value: 3,
        },
        {
          text: "已逾期",
          value: 4,
        },
        {
          text: "已完成",
          value: 5,
        },
      ],
      levelData: [
        { text: "全部", value: -1 },
        { text: "普通", value: 0 },
        { text: "紧急", value: 1 },
        { text: "非常紧急", value: 2 },
      ],
      pageType:1,//1：任务总量 2.待处理 3.我发起的 4.我参与的 5.完成数量 6.逾期次数 7.逾期数量
      list:[]
    };
  },
  watch:{
    query: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.page.page = 1
          this.getInfo()
        }
      }
    },
  },
  methods: {
    handleDorpItemCancel() {
      this.show = false
      this.$refs[this.showMenu].toggle();
    },
    handleDorpItemConfirm(val) {
      this.show = false
      this.query = Object.assign(this.query, val);
      this.$refs[this.showMenu].toggle();
      this.page.page = 1
      this.getInfo()
    },
     async getInfo(){
       try {
         let _data = JSON.parse(JSON.stringify(this.query))
         _data.status = _data.status instanceof Array ? _data.status.join(',') : _data.status
         _data.level = _data.level instanceof Array ? _data.level.join(',') : _data.level
         _data.role_type = _data.role_type instanceof Array ? _data.role_type.join(',') : _data.role_type
         let _params = Object.assign(_data, this.page);
         let {code, data :{ data, total}} = await statistics.getCountDetails(_params)
         if (code == 1) {
           this.total = total;
           this.loading = false
           if (this.page.page === 1) {
             this.list = data;
           } else {
             this.list = [...this.list, ...data];
           }
           if (this.list.length >= this.total) {
             this.finished = true;
           }
         } else {
           this.finished = true;
         }
       } catch (e) {
         console.log(e)
       }
    },
    // 加载数据
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
        this.page.page = 1;
      } else {
        this.page.page++;
      }
      this.getInfo();
    },
    //下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
  created() {
    this.query = getStore({name: 'selectData'})
    this.pageType = this.$route.query.type
    this.onRefresh()
  },
};
</script>
<style lang="less" scope>
.my-task {
  .task-list {
    // height: 600px;
    height: auto;
  }
}
.row{
  border-top: 10px solid @white-light;
  padding: 8px 16px;
  .bg{
    padding: 10px;
    background: #FFFFFF;
    margin-bottom: 10px;
    .bor_bot{
      padding: 5px 0 10px;
      border-bottom: 1px solid #E8E8E8;
    }
    .name{
      display: inline-block;
      color: #303133;
      font-size: 15px;
      margin-left: 6px;
    }
    img{
      width: 26px;
      height: 26px;
    }
    .flex{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .count{
      padding: 12px 0;
      span{
        display: inline-block;
        height: 37px;
        line-height: 37px;
      }
      span:nth-child(1) {
        color: #909399;
        font-size: 16px;
      }
      span:nth-child(2) {
        margin-left: 10px;
        color: #303133;
        font-size: 26px;
      }
    }
  }
}

</style>

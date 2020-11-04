<template>
  <div>
    <!-- 统计图 -->
    <div class="count">
      <div class="conutList" @click="lookDetail(6)">
        <div>
          <img src="@/assets/img/detail/allPep.png" alt />
        </div>
        <div class="tables">
          <div class="num">{{topdata.count||0}}</div>
          <div class="people">总人次</div>
        </div>
      </div>
      <div class="conutList" @click="lookDetail(1)">
        <div>
          <img src="@/assets/img/detail/noLook.png" alt />
        </div>
        <div class="tables">
          <div class="num">{{topdata.weikan||0}}</div>
          <div class="people">未查看</div>
        </div>
      </div>
      <div class="conutList" @click="lookDetail(2)">
        <div>
          <img src="@/assets/img/detail/yLook.png" alt />
        </div>
        <div class="tables">
          <div class="num">{{topdata.yikan||0}}</div>
          <div class="people">已查看</div>
        </div>
      </div>
      <div class="conutList" @click="lookDetail(3)">
        <div>
          <img src="@/assets/img/detail/noSub.png" alt />
        </div>
        <div class="tables">
          <div class="num">{{topdata.zanfang||0}}</div>
          <div class="people">暂放</div>
        </div>
      </div>
      <div class="conutList" @click="lookDetail(4)">
        <div>
          <img src="@/assets/img/detail/ySub.png" alt />
        </div>
        <div class="tables">
          <div class="num">{{topdata.yijiao||0}}</div>
          <div class="people">已提交</div>
        </div>
      </div>
      <div class="conutList" >
        <div>
          <img src="@/assets/img/detail/allTime.png" alt />
        </div>
        <div class="tables">
          <div class="num">{{topdata.urge||0}}</div>
          <div class="people">总催办次</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    topdata: {
      type: Object,
      default: () => {}
    },
    where: {
      type: Number,
      default: () => 0
    },
    fid: {
      // type: String,
      default: () => ''
    }
  },

  data() {
    return {};
  },
  methods: {
    lookDetail(type) {
      this.$router.push({
        path: "/statusDetail",
        query: {
          type: type,
          where: this.where,
          fid:this.fid
        }
      });
    }
  },
  //
  watch: {
    topdata(newValue, oldValue) {
      // console.log(newValue, "newValue");
    }
   
  },
  created() {

  }
};
</script>
<style lang="scss" scoped>
//统计模块
.count {
  display: flex;
  margin-top: 29px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0px 15px 0;

  img {
    width: 50px;
    height: 50px;
    padding: 0px 10px;
  }

  .conutList {
    display: flex;
    width: 187px;
    height: 50px;
    padding: 10px 0;
    background-color: #F5F6F7;
    margin-bottom: 10px;
  }

  .tables {
    .num {
      font-weight: 500;
      color: rgba(48, 49, 51, 1);
      font-size: 19px;
    }

    .people {
      font-size: 15px;
      color: #303133;
    }
  }
}
</style>
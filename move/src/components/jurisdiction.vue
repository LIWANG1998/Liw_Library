<template>
  <div class="remind">
    <div class="top">
      <div class="img">
        <img :src="topImg" alt />
      </div>
      <div class="text">无操作权限</div>
    </div>
    <div class="contents">
      <h4>解决办法:</h4>
      <p>可联系您公司管理员</p>
      <p>
        <span v-for="(item, index) in mangerList" :key="index">{{item.name}}{{mangerList.length == ++index ? '' : '、' }}</span>
        将你加入操作权限内，添加步骤如下：
      </p>
      <p>再"登录系统 - 组织架构 - 权限编辑" 中可设置员工使用权限</p>
    </div>
<!--    <van-button type="info" @click="goSet" class="btn go-set">去设置</van-button>-->
    <div class="btn btn-close" @click="btnclose">我知道了</div>
  </div>
</template>
<script>
import store from "../store";
import {getuserMange} from '@/api/audit.js';

export default {
  name: "Jurisdiction",
  data() {
    return {
      topImg: require("@/assets/img/remind/jinggao.png"),
      roleRange: require("@/assets/img/remind/role_range.png"),
      mangerList:[],//超级管理员列表
    };
  },
  props: {
    remindShow: {
      type: Object,
    },
  },
  created() {
    this.getManger()
  },
  methods: {
    // 关闭弹窗
    btnclose() {
      // this.remindShow.show = false;
      store.commit('set_show_auth', false)
      this.$router.push('/home')
    },
    // 去设置
    goSet() {
      // this.remindShow.show = false;
    },
    //查询超级管理员
    getManger(){
      getuserMange().then(res =>{
        let _list = res.data.map((item, index) =>{
          return {name: item.name}
        })
        this.mangerList = _list
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.remind {
  z-index:700;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  background: #ffffff;
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .top {
    text-align: center;
    .img {
      margin-bottom: 15px;
    }
    .text {
      font-size: 18px;
    }
    margin-bottom: 60px;
  }
  .contents {
    padding: 0 40px 40px;
    h4 {
      margin: 0;
      font-size: 20px;
      line-height: 33px;
      color: #333333;
      font-weight: 500;
      padding-bottom: 20px;
    }
    p {
      color: #303133;
      font-size: 18px;
      font-weight: 400;
      line-height: 28px;
      padding-bottom: 15px;
    }
  }
  .admin-users {
    min-height: 140px;
    margin-bottom: 20px;
    p {
      padding: 20px;
      color: #303133;
      font-size: 14px;
    }
    .admin-users-list {
      display: flex;
      flex-wrap: wrap;
      .admin-users-list-cell {
        width: 20%;
        // height: 70px;
        display: flex;
        padding: 0 10px;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
        img {
          width: 100%;
          margin-bottom: 5px;
        }
        .admin-users-list-cell-text {
          text-align: center;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .btn {
    width: 100%;
    font-size: 16px;
    text-align: center;
  }
  .btn-close {
    color: #0082ef;
    padding: 20px;
  }
}
</style>
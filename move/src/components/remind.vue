<template>
  <div class="remind">
    <div class="top">
      <div class="img">
        <img :src="topImg" alt />
      </div>
      <div class="text">系统提醒</div>
    </div>
    <div class="contents">
      创建者您好，组织架构的超级管理人员也为本系统的超级管理员你可对其进行设置/取消管理者。
    </div>
    <div class="admin-users">
      <p>这些同事是系统管理员</p>
      <div class="admin-users-list">
        <template v-for="(item, index) in mangerList">
          <div class="admin-users-list-cell" :key="index">
            <img
              v-if="item.avatar && item.avatar.indexOf('http') !== -1"
              :src="item.avatar"
              alt
            />
            <img v-else :src="headImg" alt />
            <div class="admin-users-list-cell-text">{{ item.name }}</div>
          </div>
        </template>
      </div>
    </div>
    <van-button type="info" @click="goSet" class="btn go-set"
      >去设置</van-button
    >
    <div class="btn btn-close" @click="btnclose">我知道了</div>
  </div>
</template>
<script>
import { getuserMange } from "@/api/audit.js";
export default {
  name: "Remind",
  data() {
    return {
      topImg: require("@/assets/img/remind/jinggao.png"),
      headImg: require("@/assets/img/newImg/headImg.png"),
      mangerList: [], //超级管理员列表
    };
  },
  props: {
    remindShow: {
      type: Object,
    },
  },
  created() {
    this.getManger();
  },
  methods: {
    // 关闭弹窗
    btnclose() {
      this.remindShow.show = false;
    },
    // 去设置
    goSet() {
      this.remindShow.show = false;
      this.$router.push("/organization/list");
    },
    //查询超级管理员
    getManger() {
      getuserMange().then((res) => {
        this.mangerList = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.remind {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
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
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    margin: 0 auto;
    padding: 10px;
    font-size: 14px;
    line-height: 22px;
    color: #303133;
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
          border-radius: 50%;
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
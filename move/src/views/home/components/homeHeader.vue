<template>
  <div class="home-header-warp">
    <div class="home-header-content-warp">
      <div class="home-header-content van-hairline--bottom">
        <div class="home-info">
          <div class="home-welcome">欢迎进入名冠天下公文管理系统</div>
          <div class="home-name">{{user.name}}</div>
          <div class="home-power">{{user.role_name}}</div>
        </div>
        <div class="home-icon">
          <van-image width="64" height="64" :src="user.avatar">
            <template v-slot:loading>
              <van-image width="64" height="64" :src="require('@/assets/img/home/userimg.png')" />
            </template>
          </van-image>
        </div>
      </div>
      <div class="home-header-bottom-content" @click="$router.push(`/agency?state=1&id=1`)">
        <div class="title">
          <img :src="require('@/assets/img/home/bell.png')" alt />
          当前有
          <span class="num">{{total.pendingFile||0}}</span>条待办公文未处理，
          <span class="num">{{total.toBeRead||0}}</span>条待阅公文未处理
        </div>
        <div>
          <van-icon name="arrow" size="15" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "homeHeader",
  props: {
    user: {
      type: Object,
      default: () => {},
    },
    total: {
      default: () => "",
    },
  },
  watch: {
    user() {
      // console.log("看我", this.user);
    },
  },
  created() {
    // console.log("total", this.total);
  },
};
</script>

<style scoped lang="scss">
@import "src/styles/main.scss";

.home-header-warp {
  height: 147px;
  position: relative;
  padding-bottom: 65px;

  &:after {
    position: absolute;
    left: 0;
    right: 0;
    content: "";
    background: #4f76b9;
    z-index: 2;
    height: 140px;
    border-radius: 0 0 10% 10%;
  }

  .home-header-content-warp {
    height: 192px;
    position: absolute;
    width: 384px;
    top: 20px;
    left: 15px;
    right: 15px;
    z-index: 10;
    border-radius: 4px;
    background: #ffffff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
    .home-header-content {
      height: 150px;
      padding: 20px;
      display: flex;
      box-sizing: border-box;
      justify-content: space-between;

      .home-info {
        font-size: $min-size;
        color: $grey;
        width: 275px;
        .home-welcome {
          color: #2d3034;
          font-size: 15px;
          font-weight: 500;
        }

        .home-name {
          font-size: 24px;
          font-weight: 600;
          margin: 31px 0 4px 0;
        }

        .home-power {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .home-icon {
        width: 64px;
        height: 64px;
        border-radius: 4px;
        overflow: hidden;
      }
    }

    /deep/ .van-notice-bar__content {
      width: 100%;
    }

    /deep/ .van-notice-bar__wrap {
      align-items: center;
    }

    .home-header-bottom-content {
      color: $grey;
      display: flex;
      align-items: center;
      padding: 12px 10px 0px 12px;
      border-top: 1px solid #e4e6e9;
      .title {
        flex: 3;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        img {
          width: 16px;
          height: 18px;
          vertical-align: text-top;
          margin-right: 4px;
        }
      }
      .van-icon {
        margin-top: -2px;
        color: #c7c7cc;
      }
      /deep/ .icon-ding {
        font-size: 14px;
        position: absolute;
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
      }

      .num {
        color: $blue;

        &:after,
        &:before {
          content: "  ";
        }
      }
    }

    .notice-swipe {
      height: 40px;
      line-height: 40px;
    }

    .van-swipe-item {
      padding-left: 5px;
    }

    .home-header-bottom-btn {
      color: $blue;
      flex: 1;
    }
  }
}
.van-icon {
  vertical-align: middle;
}
</style>
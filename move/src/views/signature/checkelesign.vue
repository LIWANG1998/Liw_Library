<template>
  <div class="check-elesign">
    <div class="check-elesign-top flex-ac">
      <van-search
        v-model="data.name"
        placeholder="请输入关键词"
        input-align="center"
        @input="search"
      />
    </div>
    <div class="check-elesign-top-tab">
      <van-tabs v-model="data.status" @click="changedata">
        <template v-for="(item, index) in activeData">
          <van-tab :title="item.title" :key="index" :name="item.name"></van-tab>
        </template>
      </van-tabs>
    </div>
    <div class="check-elesign-top-cek flex-ac">
      <template v-for="(item, index) in cekbox">
        <div
          :key="index"
          class="check-elesign-top-cek-box flex-ac-jc"
          :class="{ cekmine: item.ckid == data.type }"
          @click="pickme(item.ckid)"
        >
          {{ item.title }}
        </div>
      </template>
    </div>
    <div class="check-elesign-content">
      <template v-if="list.length > 0">
        <van-list v-model="loading" :finished="finished" @load="onLoad">
          <template v-for="(item, index) in list">
            <div class="ele-box" :key="index" @click="ckeckeleFun(item)">
              <div class="ele-box-img flex-ac-jc">
                <img :src="img(item)" alt />
              </div>
              <div class="ele-box-bm">
                <div class="ele-box-bm-title">{{ item.name }}</div>
                <div class="ele-box-bm-cont">
                  <span>{{ item.create_user_name }}</span>
                  <span class="ele-box-bm-cont-time">{{ item.time }}</span>
                </div>
              </div>
              <div
                class="pass_cell_show"
                v-if="eleItem && item.id == eleItem.id"
              >
                <div class="pass_cell_show_top">
                  <div class="pass_cell_show_top_s">
                    <van-icon name="success" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </van-list>
      </template>
      <template v-else>
        <noData></noData>
      </template>
    </div>
    <div class="check-elesign-bottom flex-ac-jsb">
      <van-button
        type="default"
        class="check-elesign-bottom-btn"
        @click="cencel"
        >取消</van-button
      >
      <van-button type="info" class="check-elesign-bottom-btn" @click="istOK"
        >确认</van-button
      >
    </div>
    <!-- 选择电子 使用密码签章 -->
    <van-popup v-model="ispass" position="bottom" class="pwsbox">
      <div class="title">请输入密码</div>
      <van-field v-model="password" type="password" placeholder="请输入密码" />
      <div class="bottom-btn">
        <van-button type="default" class="btn" @click="cencelpass"
          >取消</van-button
        >
        <van-button
          type="info"
          class="btn"
          style="margin-left: 12px"
          @click="isOKpass"
          >确认</van-button
        >
      </div>
    </van-popup>
  </div>
</template>
<script>
import { getEleIndex, ele_me_list, ele_check } from "@/api/home.js";
import { HttpUrl } from "@/js/public.js";
import noData from "@/components/common/noData";
import { debounce } from "@/js/public.js";
export default {
  // props: {
  //   ele: {
  //     type: Object,
  //   },
  // },
  components: {
    noData,
  },
  name: "CheckElesign",
  computed: {
    img() {
      return (v) => {
        let q_base64 = "data:image/png;base64,";
        return q_base64 + v.img_data;
      };
    },
    ele() {
      return this.$store.state.edittext.ele;
    },
  },
  data() {
    return {
      password: "",
      ispass: false,
      HttpUrl,
      list: [],
      loading: false,
      finished: false,
      activeData: [
        {
          title: "常用签章",
          name: 3,
        },
        {
          title: "所有签章",
          name: 1,
        },
        {
          title: "我的签章",
          name: 2,
        },
        {
          title: "授权给我的",
          name: 4,
        },
      ],
      cekbox: [
        { title: "个人签字", ckid: 1 },
        { title: "单位印章", ckid: 2 },
        { title: "私人印章", ckid: 3 },
      ],
      ckele: "", // 选中的ckid
      eleItem: null,
      data: {
        name: "", // 关键字搜索
        status: 2, // 选中的tab 1全部 2我创建的 3我常用的
        type: 1, // 1个人签名2单位印章3私人印章
        page: 0,
        limit: 10,
      },
      one_tab: 0,
    };
  },
  created() {
    // if (this.ele.item.length != 0 && this.ele.item[0].id != "mgtx") {
    //   this.eleItem = this.ele.item[0];
    // }
  },
  activated() {
    this.init_data();
    this.eleItem = null;
    this.onLoad();
  },
  watch: {
    active(n, o) {
      // console.log(n);
    },
  },
  methods: {
    init_data() {
      this.password = "";
      this.ispass = false;
      this.list = [];
      this.loading = false;
      this.finished = false;
      this.ckele = ""; // 选中的ckid
      this.eleItem = null;
      this.data = {
        name: "", // 关键字搜索
        status: 3, // 选中的tab 1全部 2我创建的 3我常用的
        type: 1, // 1个人签名2单位印章3私人印章
        page: 0,
        limit: 10,
      };
      this.one_tab = 0;
    },
    search: debounce(function () {
      this.changedata();
    }, 500),
    // 数据改变请求
    changedata() {
      this.list = [];
      this.data.page = 0;
      this.onLoad();
    },
    // 加载数据
    async getEleIndexFun() {
      this.loading = true;
      this.finished = false;
      let _res = await getEleIndex(this.data);
      this.list.push.apply(this.list, _res.data.datas);
      if (this.list.length == 0 && this.one_tab == 0 && this.data.status == 3) {
        this.data.status = 4;
        this.onLoad();
      }
      this.one_tab = 1;
      // 加载状态结束
      this.loading = false;
      // 数据全部加载完成
      if (_res.data.datas.length < this.data.limit) {
        this.finished = true;
      }
    },
    async ele_me_listFun() {
      this.loading = true;
      this.finished = false;
      let _res = await ele_me_list(this.data);
      this.list.push.apply(this.list, _res.data.datas);
      // 加载状态结束
      this.loading = false;
      this.one_tab = 1;
      // 数据全部加载完成
      if (_res.data.datas.length < this.data.limit + 1) {
        this.finished = true;
      }
    },
    // 加载数据
    onLoad() {
      this.data.page++;
      if (this.data.status == 4) {
        this.ele_me_listFun();
      } else {
        this.getEleIndexFun();
      }
    },
    // 选择签章
    ckeckeleFun(v) {
      if (this.eleItem && v.id == this.eleItem.id) {
        this.eleItem = null;
      } else {
        this.eleItem = v;
      }
    },
    // 选择签章类型
    pickme(i) {
      this.data.type = i;
      this.changedata();
    },
    // 取消
    cencel() {
      // this.ele.type_ele = false;
      this.$router.go(-1);
    },
    // 签章层级初始化
    initsuSpend() {
      let a_zindex= 500;
      let ele_arr = [...this.ele.zhiqian, ...this.ele.item];
      if( ele_arr.length > 0){
        let _max = ele_arr.reduce((a, b) => {
          return b.position.zindex > a?.position?.zindex ? b : a;
        });
        a_zindex =_max.position.zindex + 1;
      }
      return a_zindex;
    },
    // 确认
    istOK() {
      if (!this.eleItem) {
        this.$toast("请选择电子签章");
      } else {
        if (this.eleItem.is_pwd) {
          this.ispass = true;
        } else {
          this.ispass = false; // 关闭密码弹窗
          this.ele.type_ele = false; // 关闭签章弹窗
          // this.ele.item = [];
          this.eleItem.signature_id = this.eleItem.id;
          this.eleItem.signature_img = this.eleItem.img;
          this.eleItem.signature_base = this.eleItem.img;
          this.$set(this.eleItem, "position", {
            left: 400 - 142,
            top: 120,
            zindex: this.initsuSpend(),
            width: 142,
          });
          this.eleItem.id = "";
          this.ele.item.push(this.eleItem);
          this.$toast("签章设置成功，请到预览中调整位置大小");
          this.$router.go(-1);
        }
      }
    },

    // 取消密码
    cencelpass() {
      this.ispass = false;
      this.password = "";
    },
    // 确认密码
    isOKpass() {
      this.elecheck();
    },
    // 验证密码接口
    async elecheck() {
      let a = await ele_check({
        id: this.eleItem.id,
        pwd: btoa(this.password),
      });
      if (a.code == 1) {
        this.ispass = false; // 关闭密码弹窗
        this.ele.type_ele = false; // 关闭签章弹窗
        // this.ele.item = [];
        this.eleItem.signature_id = this.eleItem.id;
        this.eleItem.signature_img = this.eleItem.img;
        this.eleItem.signature_base = this.eleItem.img;
        this.$set(this.eleItem, "position", {
          left: 400 - 142,
          top: 120,
          zindex: this.initsuSpend(),
          width: 142,
        });
        this.eleItem.id = "";
        this.ele.item.push(this.eleItem);
        this.$toast("签章设置成功，请到预览中调整位置大小");
        this.$router.go(-1);
      } else {
        this.$notify({ type: "danger", message: a.msg });
        this.password = "";
        // this.ispass = false; // 关闭密码弹窗
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// 上下 剧中
.flex-ac {
  display: flex;
  align-items: center;
}
// 上下 左右 剧中
.flex-ac-jc {
  display: flex;
  align-items: center;
  justify-content: center;
}
// 上下 剧中 左右对齐
.flex-ac-jsb {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.check-elesign {
  height: 100%;
  .check-elesign-top {
    height: 48px;
    padding: 0 15px;
    /deep/.van-search {
      flex: 1;
      .van-field {
        padding: 5px;
      }
    }
  }
  .check-elesign-top-cek {
    height: 65px;
    background-color: #f2f2f2;
    .check-elesign-top-cek-box {
      width: 76px;
      height: 33px;
      border-radius: 33px;
      margin: 0 5px 0 15px;
      background-color: white;
      font-size: 15px;
      color: #909399;
    }
    .cekmine {
      background-color: #0082ef;
      color: white;
    }
  }
  .check-elesign-content {
    height: calc(100% - 48px - 44px - 65px - 60px);
    overflow-y: auto;
    background-color: #f2f2f2;
    padding: 0 15px;
    /deep/.van-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .van-list__finished-text,
      .van-list__loading {
        margin: 0 auto;
      }
    }
    .ele-box {
      width: 186px;
      background-color: white;
      margin-bottom: 12px;
      border-radius: 5px;
      position: relative;
      .ele-box-img {
        height: 140px;
        width: 100%;
        img {
          max-width: 110px;
          max-height: 110px;
        }
      }
      .ele-box-bm {
        box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.06);
        border-radius: 0px 0px 2px 2px;
        padding: 0 12px;

        .ele-box-bm-title {
          padding-top: 10px;
          font-size: 14px;
          font-weight: 500;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .ele-box-bm-cont {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin: 5px 0 8px;
          font-size: 12px;
          color: #909399;
          .ele-box-bm-cont-time {
            border-left: 1px solid #dcdfe6;
            padding-left: 8px;
            margin-left: 8px;
          }
        }
      }
      .pass_cell_show {
        position: absolute;
        border-radius: 5px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border: 1px solid #41aaff;
        .pass_cell_show_top {
          width: 44px;
          height: 44px;
          position: absolute;
          top: 0;
          right: 0;
          border-top: 44px solid #41aaff;
          border-left: 44px solid transparent;
          .pass_cell_show_top_s {
            color: white;
            font-size: 18px;
            position: absolute;
            top: -44px;
            right: 4px;
          }
        }
      }
    }
  }
  .check-elesign-bottom {
    padding: 0 15px;
    height: 60px;
    border-top: 1px solid rgba(230, 230, 230, 1);
    .check-elesign-bottom-btn {
      font-size: 16px;
      border-radius: 4px;
      width: 187px;
    }
  }
  .pwsbox {
    padding: 28px 37px;
    border-radius: 8px 8px 0px 0px;
    .title {
      font-size: 20px;
      font-weight: 500;
      color: rgba(48, 49, 51, 1);
      text-align: center;
      margin: 20px 0;
    }
    /deep/.van-cell::after {
      border: none;
    }
    /deep/.van-field__control {
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      line-height: 48px;
      font-size: 16px;
      padding: 0 10px;
      margin-bottom: 10px;
    }
    .bottom-btn {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      .btn {
        width: 117px;
      }
    }
  }
}
/deep/.van-tab--active {
  color: #0082ef;
}
/deep/ .van-tabs__line {
  background-color: #0082ef;
  width: 20px !important;
  transition-duration: 0.2s !important;
}
</style>
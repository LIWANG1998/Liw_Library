<template>
  <div class="check-elesign">
    <div class="check-elesign-top flex-ac" v-show="elearray.length == 0">
      <van-search
        v-model="data.name"
        placeholder="请输入关键词"
        input-align="center"
        @input="search"
      />
    </div>
    <div class="check-elesign-top-tab" v-show="elearray.length == 0">
      <van-tabs v-model="data.status" @click="changedata">
        <template v-for="(item, index) in activeData">
          <van-tab :title="item.title" :key="index" :name="item.name"></van-tab>
        </template>
      </van-tabs>
    </div>
    <div class="check-elesign-checkBox flex-ac" v-show="elearray.length > 0">
      <span class="check-btn" @click="check_cancel">取消</span>
      <span class="check-content">已选中{{ elearray.length }}个对象</span>
      <span class="check-btn" @click="check_ckeck">全选</span>
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
    <div
      class="check-elesign-content"
      :class="elearray.length > 0 ? 'ck' : 'no_ck'"
    >
      <template v-if="listlength">
        <noData></noData>
      </template>
      <template v-else>
        <van-list v-model="loading" :finished="finished" @load="onLoad">
          <template v-for="(item, index) in list">
            <template v-if="item.auth == 3">
              <div class="ele-box" :key="index">
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
                <div class="pass_cell_show" v-show="ckeckeleBox(item.id)">
                  <div class="pass_cell_show_top">
                    <div class="pass_cell_show_top_s">
                      <van-icon name="success" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
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
                <div class="pass_cell_show" v-show="ckeckeleBox(item.id)">
                  <div class="pass_cell_show_top">
                    <div class="pass_cell_show_top_s">
                      <van-icon name="success" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </van-list>
      </template>
    </div>
    <div class="check-elesign-bottom flex-ac-jsb" v-show="elearray.length > 0">
      <div
        class="bottombtn btn-setting flex-fd"
        v-show="elearray.length == 1"
        @click="on_to_setting"
      >
        <van-icon name="setting-o" />
        <span class="bottombtn-font">设置</span>
      </div>
      <div
        class="bottombtn btn-delete flex-fd"
        v-if="data.status != 4"
        @click="delSignature"
      >
        <van-icon name="delete" />
        <span class="bottombtn-font">删除</span>
      </div>
    </div>
    <div @click="addSignature">
      <icon></icon>
    </div>
  </div>
</template>
<script>
import {
  getEleIndex,
  delEleIndex,
  ele_me_list,
  ele_check,
} from "@/api/home.js";
import { HttpUrl } from "@/js/public.js";
import icon from "./compontens/icon";
import noData from "@/components/common/noData";
import { debounce } from "@/js/public.js";
export default {
  name: "CheckElesign",
  components: {
    icon,
    noData,
  },
  computed: {
    listlength() {
      return this.list.length == 0 ? true : false;
    },
    img() {
      return (v) => {
        let q_base64 = "data:image/png;base64,";
        return q_base64 + v.img_data;
      };
    },
    ckeckeleBox() {
      return (id) => {
        return this.elearray.includes(id);
      };
    },
    set_auth_Nature() {
      let _auth = JSON.parse(sessionStorage.getItem("SET_AUTH"));
      let _natrue = false;
      _auth.forEach((item) => {
        if (item == "set_ele_chapter") {
          _natrue = true;
        }
      });
      return _natrue;
    },
  },
  data() {
    return {
      ck_h_style: {
        ck: {
          height: "calc(100% - 48px - 44px - 65px - 41px)",
        },
        no_ck: {
          height: "calc(100% - 48px - 44px - 65px)",
        },
      },
      password: "",
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
        status: 3, // 选中的tab 1全部 2我创建的 3我常用的
        type: 1, // 1个人签名2单位印章3私人印章
        page: 0,
        limit: 12,
      },
      elearray: [],
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
    sessionStorage.getItem("ele_url")
      ? (this.data.status = Number(sessionStorage.getItem("ele_url")))
      : 3;
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
        limit: 12,
      };
      this.elearray = [];
      this.one_tab = 0;
    },
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
        this.list = [];
        this.data.page = 0;
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
      let _index = this.elearray.indexOf(v.id);
      this.eleItem = v;
      _index != -1 ? this.elearray.splice(_index, 1) : this.elearray.push(v.id);
    },
    // 选择签章类型
    pickme(i) {
      this.data.type = i;
      this.changedata();
    },
    // 取消全选
    check_cancel() {
      this.elearray = [];
    },
    // 全选
    check_ckeck() {
      this.elearray = this.list.map((el) => {
        return el.id;
      });
    },
    //添加签章
    addSignature() {
      sessionStorage.setItem("ele_url", this.data.status);
      this.$router.push(`/sealdetails`);
    },
    //删除签章
    async delSignature() {
      this.$dialog
        .confirm({
          title: "警告",
          message: "删除后数据不可恢复,是否继续？",
        })
        .then(async () => {
          let _data = await delEleIndex({
            ids: this.elearray.join(),
          });
          this.$toast(_data.msg);
          if (_data.code == 1) {
            this.elearray = [];
            this.list = [];
            this.data.page = 0;
            this.onLoad();
          }
        })
        .catch(() => {});
    },
    // 编辑印章
    on_to_setting() {
      this.$router.push({
        path: "/sealdetails",
        query: {
          id: this.elearray[0],
        },
      });
    },

    search: debounce(function () {
      this.changedata();
    }, 500),
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
  // display: inline-block;
}
.check-elesign {
  height: 100vh;
  .check-elesign-top {
    height: 48px;
    padding: 0 15px;
    background-color: white;
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
  .check-elesign-checkBox {
    height: 92px;
    background-color: white;
    font-size: 16px;
    .check-btn {
      color: #0082ef;
      padding: 10px 15px;
    }
    .check-content {
      flex: 1;
      text-align: center;
    }
  }
  .check-elesign-content {
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
    .mei {
      text-align: center;
    }
  }
  .ck {
    height: calc(100% - 48px - 44px - 65px - 60px);
  }
  .no_ck {
    height: calc(100% - 48px - 44px - 65px);
  }
  .check-elesign-bottom {
    padding: 0 15px;
    height: 60px;
    border-top: 1px solid rgba(230, 230, 230, 1);
    background-color: white;
    .bottombtn {
      flex: 1;
      /deep/ .van-icon {
        font-size: 22px;
      }
      .bottombtn-font {
        font-size: 13px;
        line-height: 24px;
      }
    }
    .btn-setting {
      position: relative;
      &::after {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        content: "";
        height: 20px;
        width: 1px;
        background-color: #dcdfe6;
      }
    }
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
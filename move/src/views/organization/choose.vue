<template>
  <div class="choose" :style="`height:${height}px;`">
    <div class="choose-box" v-if="offOn">
      <div class="choose-inbox flex-col">
        已选人员
        <span class="blue numtext">({{ result.length }}人)</span>
        <div class="flex-col-bd"></div>
        <span class="blue" @click="onOffOn">查看</span>
        <van-icon class="blue" name="arrow" size="14px" />
      </div>
      <div class="choose-inbox flex-col" @click="jsshow = true">
        <span style="padding-right: 20px">角色</span>
        <!-- <div class="flex-col-bd"></div> -->
        <div class="flex-col-bd ellipsis" style="text-align: right">
          {{ roleresult_text }}
        </div>
        <!-- <van-dropdown-menu>
          <van-dropdown-item
            @change="onchanges"
            :value="value1"
            :options="option1"
          />
        </van-dropdown-menu> -->
        <!-- <span class>请选择</span> -->
      </div>
    </div>
    <!--        人员列表-->
    <div class="listitem" v-else>
      <van-cell-group>
        <van-list
          offset="0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
        >
          <!-- 搜索栏 -->
          <div class="header-search">
            <van-search
              placeholder="搜索姓名"
              background="#FFFFFF"
              class="searchBox"
              input-align="center"
              v-model="kwd"
              @search="onSearch"
              @clear="onSearchCancel"
              @blur="addBlur"
            />
          </div>
          <van-cell v-for="(item, index) in depTag" clickable :key="index">
            <div class="flex-col">
              <img class="fileimg" :src="item.avatar | img(url)" alt />
              <div class="fileimg-bott-box flex-col-bd">
                <div class="box">
                  <span class="name">{{ item.name }}</span>
                  <span class="bemname">{{ item.role_name }}</span>
                  <van-icon
                    name="delete"
                    class="delete"
                    size="16px"
                    @click="onDelete(item.userid)"
                  />
                </div>
                <div class="dep_name ellipsis">{{ item.dep_name }}</div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-cell-group>
    </div>
    <div class="flex-col boxben" v-if="offOn">
      <div class="flex-col-bd cancel" @click="onCancel">重新选择</div>
      <div class="flex-col-bd ascertain" @click="onConserve">保存</div>
    </div>
    <div class="flex-col boxben" v-else>
      <div class="flex-col-bd cancel" @click="onCancel">重新选择</div>
      <div class="flex-col-bd ascertain" @click="onYesOk">确定</div>
    </div>
    <van-popup v-model="jsshow" position="bottom" :style="{ height: '60%' }">
      <van-checkbox-group v-model="roleresult">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in option1"
            clickable
            :key="item.value"
            :title="item.text"
            @click="toggle(index)"
          >
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-popup>
  </div>
</template>
<script>
import { organization, organSetRoles } from "../../api/organization";
import { getRole } from "@/api/psublic.js";
import { url, screenHeight } from "@/utils/utils.js";

export default {
  name: "personchoose",
  data() {
    return {
      roleresult_text: "",
      roleresult_id: "",
      roleresult: [],
      depTag: [], //部门
      result: "", //人员选中的值
      total: 0, //总人数
      id: "", //部门的id
      choiseAll: true,
      height: "",
      offOn: true,
      url,
      option1: [],
      value1: 0,
      docId: "", //传阅选择人员
      loading: true, // 懒加载状态
      finished: false, // 懒加载到了最底部
      error: false, // 懒加载错误
      page: 1, // 页数
      kwd: "", // 搜索的关键词
      ids: "", // 跳转过来传来的ids
      jsshow: false,
    };
  },
  activated() {
    this.height = screenHeight(0);
    this.ids = sessionStorage.getItem("ids");
    this.addUserList(this.ids);
    this.addgetRole();
    this.result = this.ids.split(",");
    console.log(this.result);
    if (this.$route.query.docId) {
      this.docId = this.$route.query.docId;
      this.offOn = false;
    }
  },
  watch: {
    roleresult: {
      deep: true,
      handler(v) {
        console.log(v);
        this.roleArrey();
      },
    },
  },
  methods: {
    roleArrey() {
      let a_arrey = [];
      let a_id = [];
      this.roleresult.forEach((e) => {
        a_arrey.push(e.text);
        a_id.push(e.value);
      });
      this.roleresult_text =
        this.roleresult.length == 0 ? "选择角色" : a_arrey.join(",");
      this.roleresult_id = a_id.join(",");
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
      // console.log(this.roleresult);
    },
    //  输入框点击清除按钮事件
    onSearchCancel() {
      this.addUserList(this.ids);
    },
    // 输入框脱离聚焦
    addBlur() {
      this.addUserList(this.ids);
    },
    // 输入框确定按钮
    onSearch() {
      this.addUserList(this.ids);
    },
    onLoad() {
      if (this.deps?.members?.length != 0) {
        this.page++;
        this.addUserList(sessionStorage.getItem("ids"));
      }
    },
    // 返回上一页
    onCancel() {
      sessionStorage.setItem("num", 2);
      this.$router.go(-1);
      sessionStorage.removeItem("ids");
      this.offOn = true;
    },
    // 确定选中的人员
    onYesOk() {
      let that = this;
      // this.page = 1;
      // this.kwd = "";
      // this.addUserList(this.result.join(","));
      sessionStorage.setItem("ids", this.result);
      if (this.docId) {
        this.offOn = false;
      } else {
        this.offOn = true;
      }
    },
    // 展示人或者展示数据
    onOffOn() {
      this.offOn = false;
    },
    // 删除本个用户
    onDelete(id) {
      let num = this.result.indexOf(id);
      this.result.splice(num, 1);
      for (let i = 0; i < this.depTag.length; i++) {
        if (this.depTag[i].userid == id) {
          this.depTag.splice(i, 1);
        }
      }
    },
    // 选择角色id
    onchanges(key) {
      this.value1 = key;
    },
    // 点击保存按钮
    onConserve(key) {
      this.setRoles();
    },
    // 获取用户信息
    addUserList(ids) {
      this.loading = true;
      let _this = this;
      let _Timeout;
      let _onOff = true;
      if (_this.page != 1) {
        _Timeout = setTimeout(() => {
          _this.error = true;
          _onOff = false;
          _this.loading = false;
        }, 3000);
      }
      organization({
        userids: ids,
        page: this.page,
        limit: 20,
        kwd: this.kwd,
      }).then((data) => {
        // console.log(data);
        clearTimeout(_Timeout);
        if (data.code == 1 && _onOff) {
          if (this.page * 20 > this.result.length) {
            _this.finished = true;
          } else {
            _this.finished = false;
          }
          if (_this.page > 1) {
            _this.depTag.push(...data.data);
            _this.loading = false;
          } else {
            _this.depTag = data.data;
            _this.loading = false;
          }
          if (data.data.length == 1) {
            getRole().then((res) => {
              let arrys = res.data.datas;
              this.option1 = [];
              for (let i = 0; i < arrys.length; i++) {
                this.option1.push({
                  text: arrys[i].role_name,
                  value: arrys[i].id,
                });
              }
              let arr = data.data[0].role_name.split(";");
              this.roleresult = this.option1.filter((el) => {
                return arr.includes(el.text);
              });
            });
            this.roleresult_text = data.data[0].role_name
              ? data.data[0].role_name
              : "选择角色";
          } else {
            this.roleresult = [];
            this.roleresult_text = "选择角色";
          }
        } else {
          _this.page--;
          _this.error = true;
          _this.loading = false;
        }
      });
    },
    // 获取角色信息
    addgetRole() {
      // this.option1 = [
      //   {
      //     text: "选择角色",
      //     value: 0,
      //   },
      // ];
      getRole().then((data) => {
        let arrys = data.data.datas;
        // console.log(arrys);
        this.option1 = [];
        for (let i = 0; i < arrys.length; i++) {
          this.option1.push({
            text: arrys[i].role_name,
            value: arrys[i].id,
          });
        }
      });
    },
    // 点击保存后函数
    setRoles() {
      let text = "";
      for (let i = 0; i < this.depTag.length; i++) {
        if (text == "") {
          text += this.depTag[i].userid;
        } else {
          text += `,${this.depTag[i].userid}`;
        }
      }
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true,
      });
      organSetRoles({
        user_ids: text,
        role_ids: this.roleresult_id,
      }).then((data) => {
        this.$toast(data.msg);
        if (data.code == 1) {
          setTimeout(() => {
            this.$router.push({
              path: "/organization/list",
              query: { cx: 1 },
            });
          }, 1500);
        }
      });
    },
  },
  filters: {
    img(urls, url) {
      let text = String(urls).startsWith("http");
      let imgurl = "";
      if (text) {
        imgurl = urls;
      } else {
        imgurl = url + urls;
      }
      return imgurl;
    },
  },
};
</script>
<style lang="scss" scoped>
.header-search {
  position: fixed;
  top: 0px;
  z-index: 5;
  width: 100%;
}
.header {
  background-color: #ffffff;

  .searchBox {
    background-color: #ffffff;
    width: 100%;
    height: 48px;
    box-shadow: 0px 1px 0px rgba(230, 237, 245, 1);
  }
}

.choose-box {
  padding-top: 15px;

  .choose-inbox {
    line-height: 50px;
    padding: 0px 15px 0px 20px;
    background: #ffffff;

    .numtext {
      margin-left: 10px;
    }
  }
}

/deep/ .van-dropdown-menu__bar {
  box-shadow: none;
}

.boxben {
  box-sizing: border-box;
  padding: 0px 20px;
  height: 55px;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 16px;
  line-height: 38px;

  div {
    border-radius: 6px;
  }

  .cancel {
    border: 1px solid #e0e0e0;
  }

  .ascertain {
    margin-left: 10px;
    background: rgb(22, 168, 241);
    color: #ffffff;
    border: 1px solid rgb(22, 168, 241);
  }
}

/*    人员列表*/
.listitem {
  height: auto;
  line-height: 30px;
  color: #2d3034;
  padding-top: 52px;
  padding-bottom: 55px;
  position: relative;
  .van-cell {
    .fileimg {
      width: 40px;
      height: 40px;
      border-radius: 5px;
      vertical-align: top;
      margin-right: 12px;
    }

    .fileimg-bott-box {
      display: inline-block;

      .box {
        position: relative;
        width: 100%;

        .delete {
          position: absolute;
          right: 0px;
          top: 16px;
          color: red;
        }
      }

      .bemname {
        font-size: 14px;
        margin-left: 15px;
      }

      .name {
        font-size: 16px;
      }

      .dep_name {
        font-size: 12px;
        color: #979797;
        width: 250px;
      }
    }
  }
}
</style>
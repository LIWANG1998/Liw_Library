<template>
  <div class="countermark" :style="`height:${height}px;`">
    <van-checkbox-group
      v-model="result"
      @change="chioseNum"
      ref="checkDep"
      v-if="deps.tags != 0 || deps.user != 0"
    >
      <van-cell-group>
        <van-cell v-for="(item, index) in deps.tags" clickable :key="index">
          <div @click="toggle(item.id)">
            <img
              class="fileimg"
              src="../../../assets/img/home/zuzhifile.png"
              alt
            />
            <span class="name">{{ item.title }}</span>
          </div>
          <template #right-icon>
            <van-checkbox
              @click="oncheckbox(item)"
              v-model="item.checkoff"
              :name="item"
            />
          </template>
        </van-cell>
        <van-list
          offset="0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
        >
          <van-cell v-for="(item, index) in deps.user" clickable :key="index">
            <div @click="onPopru(item)">
              <img class="fileimg" :src="item.avatar | img(url)" alt />
              <div class="fileimg-box">
                <span class="name">{{ item.name }}</span>
                <span class="names">{{ item.role_name }}</span>
                <br />
                <span class="demname ellipsis">{{ item.dep_name }}</span>
              </div>
            </div>
            <template #right-icon>
              <van-checkbox
                @click="oncheckbox(item)"
                v-model="item.checkoff"
                :name="item"
              />
            </template>
          </van-cell>
        </van-list>
      </van-cell-group>
    </van-checkbox-group>
    <NoData v-else />
    <!--        底部已选人数总数-->
    <div
      class="bottboxs"
      :style="{ bottom: depTotal == 0 ? '0' : '54px' }"
      v-if="deps.tags != 0 || deps.user != 0"
    >
      <div>
        当前标签：
        <span style="margin-right: 10px">{{ nums.dem_num }}</span>
        总人数：
        <span>{{ nums.usernum }}</span>
      </div>
      <div style="flex: 1"></div>
      <div class="left" @click="checkDepAll" v-if="choiseAll">全选</div>
      <div class="left" @click="cacelDepCheckAll" v-else>取消全选</div>
    </div>
    <div class="bottommenu" v-if="depTotal != 0">
      <div
        @click="goToaNewPlace"
        class="total"
        style="margin-right: 20px; color: #303133"
      >
        已选人员：
        <span class="blue">{{ depTotal }}人</span>
      </div>
      <div style="flex: 1"></div>
      <van-button
        class="yesbtn"
        round
        type="info"
        color="linear-gradient(to right, #0082EF, #04A9FE)"
        @click="goToaNewPlace"
        >确定</van-button
      >
    </div>
    <van-popup v-model="show" round position="bottom">
      <p class="toptitle flex-col">人员信息</p>
      <div class="flex-col textbox">
        <span class="left">头像</span>
        <div class="flex-col-bd"></div>
        <img class="imgs" :src="userClickItem.avatar | img(url)" alt />
      </div>
      <div class="flex-col textbox">
        <span class="left">姓名</span>
        <div class="flex-col-bd"></div>
        <span>{{ userClickItem.name }}</span>
      </div>
      <div class="flex-col textbox">
        <span class="left">性别</span>
        <div class="flex-col-bd"></div>
        <span>{{ userClickItem.gender == 1 ? "男" : "女" }}</span>
      </div>
      <div class="flex-col textbox">
        <span class="left">手机号</span>
        <div class="flex-col-bd"></div>
        <span>{{ userClickItem.mobile }}</span>
      </div>
      <div class="flex-col textbox">
        <span class="left">邮箱</span>
        <div class="flex-col-bd"></div>
        <span>{{ userClickItem.email }}</span>
      </div>
      <div class="flex-col textbox">
        <span class="left">部门</span>
        <div class="flex-col-bd"></div>
        <span>{{ userClickItem.dep_name }}</span>
      </div>
      <div class="flex-col textbox">
        <span class="left">职务</span>
        <div class="flex-col-bd"></div>
        <span>{{ userClickItem.position }}</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { url, screenHeight } from "@/utils/utils.js";
import { getTagsList } from "@/api/home";
import NoData from "@/components/common/noData.vue";
export default {
  name: "countermark",
  data() {
    return {
      result: [], //组织架构菜单选中的值
      deps: [], //部门列表
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
      loading: true, // 懒加载状态
      finished: false, // 懒加载到了最底部
      error: false, // 懒加载错误
      page: 1, // 页数
      dName: "", // 当前标签的所有人，作为数据暂时存放的变量
      selectAllName: "", // 当前全选状态下选中的人
      id: "", // 当前选中的人员所有的id
      selectAll: false, // 判断是否全选
      organizeIds: "", //organizeIds的id
      currentPage: "", //当前页数据
    };
  },
  components: {
    NoData,
  },
  mounted() {
    this.height = screenHeight(245);
    this.judge();
    this.getDeps();
  },
  activated() {
    let num = sessionStorage.getItem("num");
    if (num != 2) {
      this.getDeps();
      sessionStorage.removeItem("num");
    }
  },
  props: ["keys", "active"],
  watch: {
    keys: function (v) {
      if (String(v).includes("空")) {
        this.judge();
        this.dept_id = "";
      } else if (String(v).includes("无")) {
        this.choiseAll = true;
        this.dept_id = "";
        this.eliminate();
        this.getDeps();
      } else {
        if (this.active == 2) {
          this.choiseAll = true;
          this.dept_id = v;
          this.eliminate();
          this.getDeps();
        }
      }
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
  methods: {
    // 点击复选框
    oncheckbox(info) {
        this.chioseNum(this.id, info);
    },
    onLoad() {
      if (this.deps?.members?.length != 0) {
        this.page++;
        this.getDeps();
      }
    },
    onShuju(user) {
      if (user != "") {
        this.deps.tags = [];
        this.deps.user = user;
      } else {
        this.dept_id = "";
        this.getDeps();
      }
    },
    // 点击确定，带上选中人员的id去下一个页面
    goToaNewPlace() {
      sessionStorage.setItem("ids", this.ids);
      this.$router.push({
        name: "personchoose",
      });
    },
    //部门选择多少人
    chioseNum(id, deselectAll) {
      this.id = id;
      let ids = "";
      // 全选就把所有人员数据放进去
      if (this.selectAll) {
        ids = this.selectAllName;
      } else {
        for (let i = 0; i < id.length; i++) {
          if (id[i].userid == undefined) {
            if (ids == [""] || id[i].userids == "") {
              ids += id[i].userids.join(",");
            } else {
              ids += `,${id[i].userids.join(",")}`;
            }
          } else {
            if (ids == [""] || id[i].userid == "") {
              ids += `${id[i].userid}`;
            } else {
              ids += `,${id[i].userid}`;
            }
          }
        }
      }
      // 删除的数据不为空
      if (deselectAll != undefined && this.selectAll) {
        ids = ids.split(",");
        let _num;
        if (deselectAll.userid == undefined) {
          deselectAll.userids.forEach((el) => {
            _num = ids.indexOf(el);
            if (_num != -1) {
              ids.splice(_num, 1);
              this.choiseAll = true;
            } else {
              ids.push(el);
            }
          });
        } else {
          _num = ids.indexOf(deselectAll.userid);
          if (_num != -1) {
            ids.splice(_num, 1);
            this.choiseAll = true;
          } else {
            ids.push(deselectAll.userid);
          }
        }
        ids = ids.join(",");
        this.selectAllName = ids;
        if (ids.split(",").length >= this.dName.split(",").length) {
          this.choiseAll = false;
        }
      }
      this.currentPage = ids;
      sessionStorage.setItem("countermarkIds", this.currentPage);
      if (this.organizeIds != "") {
        if (ids == "") {
          ids = this.organizeIds;
        } else {
          ids = `${ids},${this.organizeIds}`;
        }
      }
      let idss = [...new Set(ids.split(","))];
      this.ids = idss.join(",");
      if (idss[0] == "") {
        this.depTotal = 0;
      } else {
        this.depTotal = idss.length;
      }
    },
    // 点击人员获取数据，然后弹出详情
    onPopru(item) {
      this.show = true;
      this.userClickItem = item;
    },
    // 部门全选
    checkDepAll() {
      this.selectAllName = this.dName;
      this.selectAll = true;
      this.$refs.checkDep.toggleAll(true);
      this.choiseAll = false;
    },
    // 取消全选
    cacelDepCheckAll() {
      this.selectAll = false;
      this.choiseAll = true;
      this.$refs.checkDep.toggleAll(false);
      sessionStorage.removeItem("countermarkIds");
    },
    //获取标签和成员
    getDeps() {
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
      getTagsList({ tagid: this.dept_id, page: this.page, limit: 20 }).then(
        (res) => {
          clearTimeout(_Timeout);
          if (res.code == 1) {
            this.dName = res.data.all_user.join(",");
            if (this.dept_id == "") {
              this.deps = res.data;
              this.deps.tags.forEach((el) => {
                el.checkoff = false;
              });
              this.deps.user = [];
              _this.finished = true;
            } else {
              this.deps.tags = [];
              if (this.page * 20 > res.data.count) {
                _this.finished = true;
              } else {
                _this.finished = false;
              }
              if (_this.page > 1) {
                res.data.user.forEach((el) => {
                  el.checkoff = false;
                });
                _this.deps?.user.push(...res.data.user);
                _this.loading = false;
                // 是否全选状态，是的话就增加选中状态
                if (this.selectAll) {
                  setTimeout(() => {
                    this.$refs.checkDep.toggleAll(true);
                  }, 0);
                }
              } else {
                res.data.user.forEach((el) => {
                  el.checkoff = false;
                });
                _this.deps.user = res.data.user;
                _this.loading = false;
              }
            }
            this.nums.dem_num = res.data.tags.length;
            this.nums.usernum = res.data.count;
          } else {
            _this.page--;
            _this.error = true;
            _this.loading = false;
          }
        }
      );
    },
    // 判断是否有数据，有数据就赋值人数
    judge() {
      let idss;
      this.organizeIds = sessionStorage.getItem("organizeIds");
      if (
        this.organizeIds != undefined &&
        this.organizeIds != "" &&
        this.organizeIds != null
      ) {
        if (this.currentPage != "") {
          this.ids = `${this.currentPage},${this.organizeIds}`;
        } else {
          this.ids = this.organizeIds;
        }
        idss = [...new Set(this.ids.split(","))];
        this.ids = idss.join(",");
        if (idss[0] == "") {
          this.depTotal = 0;
        } else {
          this.depTotal = idss.length;
        }
      } else {
        this.organizeIds = "";
        if (this.currentPage == "") {
          this.depTotal = 0;
        } else {
          this.depTotal = this.currentPage.split(",").length;
        }
      }
    },
    // 点击部门，获取部门id
    toggle(key) {
      this.eliminate();
      this.dept_id = key;
      this.getDeps();
      this.$emit("stratum", key);
    },
    // 清除选中的所有信息
    eliminate() {
      this.page = 1;
      if (this.deps.tags != 0 || this.deps.user != 0) {
        this.$refs.checkDep.toggleAll(false);
      }
      this.selectAll = false;
      this.ids = "";
      this.depTotal = 0;
      this.choiseAll = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.countermark {
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
    height: 45px;
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
      width: 40px;
      height: 40px;
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
      width: 250px !important;
      display: inline-block;
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
    .name {
      display: inline-block;
      width: auto;
      padding-left: 10px;
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
    background-color: #ffffff;
    position: fixed;
  }
  .bottommenu {
    padding: 0 20px;
    display: flex;
    align-items: center;
    height: 60px;
    line-height: 60px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    background-color: #ffffff;
    border-top: 1px solid #f5f6f7;
  }
}
</style>
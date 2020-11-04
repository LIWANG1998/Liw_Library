<template>
  <div class="sealDetails">
    <!-- 签章信息 -->
    <div class="seal-msg public">
      <div class="public-md" v-if="auth != 1"></div>
      <div class="name">
        <van-cell-group :border="false">
          <van-field
            v-model="seal.name"
            label="签章名称"
            placeholder="请输入签章名称"
          />
        </van-cell-group>
      </div>
      <div class="state">
        <div class="title">签章类型</div>
        <div class="tabs">
          <div
            class="tab"
            v-for="item in seal.tabs"
            :key="item.key"
            :class="{ active: item.key == seal.tab }"
            @click="onTabChange(item.key)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- 允许使用的用户 -->
    <div class="allow-user public">
      <div class="public-md" v-if="authFun"></div>
      <div class="title">可以使用的用户</div>
      <div class="flex">
        <div class="authorization-list">
          <div v-for="(item, index) in createPep" :key="'ren' + index">
            <div class="item">
              <div class="head-img">
                <img :src="item.img" alt />
              </div>
              <div class="name">{{ item.title }}</div>
            </div>
          </div>
          <div v-for="(item, index) in seal.agree_list" :key="index">
            <div class="item" v-if="index < 5">
              <div class="head-img">
                <img :src="item.img" alt />
              </div>
              <div class="name">{{ item.title }}</div>
              <div v-if="!authFun" class="x" @click="agree_delete(index)"></div>
            </div>
          </div>
        </div>
        <div
          class="more"
          @click="onOpenDetail(1)"
          v-show="seal.agree_list.length >= 5"
        >
          ...
        </div>
      </div>

      <div v-if="!authFun" class="add-user" @click="agree(1)">
        <div class="icon"></div>
        <span>添加用户</span>
      </div>
    </div>

    <!-- 授权用户 -->
    <div class="authorization public">
      <div class="public-md" v-if="auth != 1"></div>
      <div class="title">允许使用和授权给他人使用的用户</div>
      <div class="flex">
        <div class="authorization-list">
          <div v-for="(item, index) in createPep" :key="'ren' + index">
            <div class="item">
              <div class="head-img">
                <img :src="item.img" alt />
              </div>
              <div class="name">{{ item.title }}</div>
            </div>
          </div>
          <div v-for="(item, index) in seal.so_agree_list" :key="index">
            <div class="item" v-if="index < 5">
              <div class="head-img">
                <img :src="item.img" alt />
              </div>
              <div class="name">{{ item.title }}</div>
              <div
                v-if="auth == 1"
                class="x"
                @click="so_agree_delete(index)"
              ></div>
            </div>
          </div>
        </div>
        <div
          class="more"
          @click="onOpenDetail(2)"
          v-show="seal.so_agree_list.length >= 5"
        >
          ...
        </div>
      </div>

      <div v-if="auth == 1" class="add-user" @click="agree(2)">
        <div class="icon"></div>
        <span>添加用户</span>
      </div>
    </div>

    <!-- 密码 -->
    <!-- 1=>不要密码；2=>要密码 -->
    <div class="password public">
      <div class="public-md" v-if="auth != 1"></div>
      <div class="line">
        <div class="title">免密使用</div>
        <van-radio-group v-model="seal.has_password" direction="horizontal">
          <van-radio :name="0">是</van-radio>
          <van-radio :name="1">否</van-radio>
        </van-radio-group>
      </div>

      <div class="line" v-show="seal.has_password == 1">
        <div class="title">使用密码</div>
        <van-cell-group :border="false">
          <van-field
            v-model="seal.password"
            type="password"
            placeholder="请输入使用密码"
          />
        </van-cell-group>
      </div>
      <div class="line" v-show="seal.has_password == 1">
        <div class="title">确认密码</div>
        <van-cell-group :border="false">
          <van-field
            v-model="seal.confirm_password"
            type="password"
            placeholder="请再次输入密码"
          />
        </van-cell-group>
      </div>
    </div>

    <!-- 上传文件 -->
    <div class="image public">
      <div class="public-md" v-if="auth != 1"></div>
      <div class="flex">
        <div class="title">签章信息</div>
        <span v-if="auth == 1" class="sign" @click="show_sign">签字</span>
      </div>

      <div class="upload">
        <van-uploader
          v-show="!seal.has_file"
          :after-read="afterRead"
          :before-read="beforeRead"
        />
        <div class="show-img" v-show="seal.has_file">
          <img :src="seal.file_view['path']" alt />
          <div v-if="auth == 1" class="x" @click="onClearFile"></div>
        </div>
      </div>
    </div>

    <!-- 创建人和创建时间 -->
    <div class="create public">
      <div class="public-md" v-if="auth != 1"></div>
      <div class="creater">
        <div class="title">创建人</div>
        <div class="content">
          {{ $route.query.id ? creater : get_user_info.name }}
        </div>
      </div>
      <div class="create-time">
        <div class="title">创建时间</div>
        <div class="content">
          {{ $route.query.id ? create_time : timeFormate }}
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btns">
      <van-button type="default" @click="onCancel">取消</van-button>
      <van-button type="info" @click="onSubmit">保存</van-button>
    </div>

    <!-- 签字 -->
    <van-popup
      v-model="sign.show"
      @close="sign_close"
      position="bottom"
      class="sign-model"
    >
      <div class="tips">
        <div class="icon"></div>
        <span>请在下面的签字区域签字</span>
      </div>
      <div class="region">
        <vue-esign
          class="esign"
          :height="225"
          id="esign"
          ref="esign"
          :bgColor.sync="bgColor"
          :lineColor="lineColor"
        />
        <span class="clear" @click="handleReset">清除</span>
      </div>
      <div class="sign-btns">
        <van-button type="default" @click="sign.show = false">取消</van-button>
        <van-button type="info" @click="handleGenerate">确定</van-button>
      </div>
    </van-popup>

    <!-- 更多人 -->
    <van-popup
      v-model="detail.detail_flag"
      position="bottom"
      :style="{ height: '55%' }"
    >
      <div class="detail-top">左滑可删除</div>
      <template v-for="(item, index) in detail.detail_list">
        <van-swipe-cell :key="index">
          <van-cell>
            <div class="detail-list flex-ac">
              <img :src="item.img" alt />
              <span class="titles">{{ item.title }}</span>
            </div>
          </van-cell>
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              @click="detail_delete(index)"
              class="delete-button"
            />
          </template>
        </van-swipe-cell>
      </template>
    </van-popup>
  </div>
</template>

<script>
let loc = true;
import {
  saveFile,
  public_data_files,
  saveFile_sign,
  dataURLtoFile,
} from "@/assets/js/public";
import { HttpUrl } from "@/js/public.js";
import Pickclass from "@/components/pickclass/pickclass.vue";
import { addEle, ele_detail, ele_update } from "@/api/home.js";
import { compressImage } from "@/js/compressImage"; // 图片压缩方法
export default {
  components: { Pickclass },
  data() {
    return {
      config: {
        width: 1000, // 压缩后图片的宽
        height: 1000, // 压缩后图片的高
        quality: 1, // 压缩后图片的清晰度，取值0-1，值越小，所绘制出的图像越模糊
      },
      HttpUrl,
      bgColor: "#ffffff",
      lineColor: "#141414",
      creater: null,
      create_time: null,
      //签章信息
      seal: {
        name: "",
        tabs: [
          { title: "个人签字", key: 1 },
          { title: "单位印章", key: 2 },
          { title: "私人印章", key: 3 },
        ],
        tab: 3, //选中类型

        // 将一些的内容和全部的内容分开显示
        // 允许使用
        agree_list: [],
        agree_list_backfill: [], //数据回填

        // 允许使用和授权给他人使用的用户
        so_agree_list: [],
        so_agree_list_backfill: [], //数据回填

        //密码
        has_password: 0,
        password: "",
        confirm_password: "",

        //文件(提交后台)
        file: null,

        //文件(预览)
        file_view: { path: "" },
        has_file: false,
      },

      // 详情弹窗
      //1=>允许使用，2=>允许使用和授权给他人使用的用户
      detail: {
        detail_flag: false,
        detail_type: 1,
        search: "",
        detail_list: [],
      },
      //签字
      sign: {
        show: false,
        imgUrl: null,
      },
      //权限
      auth: 1,
      // 创建这对象
      createPep: [],
    };
  },
  created() {
    //人员选择确认
    // this.$bus.$on("lw_selectdata", (val) => {
    //   this.set_data(val);
    // });
    //如果是编辑
  },
  activated() {
    if (loc) {
      this.init();
      this.pel.ckt = {
        zzjg: true, // 显示 组织架构
        bm: true, // 可以选部门
        ren: true, // 可以选人
        tag: true, // 显示 标签
        dw: false, // 显示 单位
        radio: false, // 是否为单选
      };
      // console.log("this.seal", this.seal);
      if (this.$route.query.id) {
        this.auth = 4;
        this.get_seal_detail();
      } else {
        this.auth = 1;
        this.createPep.push({
          img: this.get_user_info.avatar,
          title: this.get_user_info.name,
          w_id: "ren" + this.get_user_info.id,
        });
      }
    } else {
      if (this.pel.type == 1) {
        this.seal.agree_list = this.StoP(this.pel.results).filter((item) => {
          console.log(item, this.createPep[0]);
          return item.w_id != this.createPep[0].w_id;
        });
        this.seal.agree_list_backfill = this.StoP(this.pel.result).filter(
          (item) => {
            console.log(item, this.createPep[0]);
            return item != this.createPep[0].w_id;
          }
        );
      } else if (this.pel.type == 2) {
        this.seal.so_agree_list = this.StoP(this.pel.results).filter((item) => {
          console.log(item, this.createPep[0]);
          return item.w_id != this.createPep[0].w_id;
        });
        this.seal.so_agree_list_backfill = this.StoP(this.pel.result).filter(
          (item) => {
            console.log(item, this.createPep[0]);
            return item != this.createPep[0].w_id;
          }
        );
      }
      console.log(this.seal.agree_list, this.seal.so_agree_list);
    }
  },
  computed: {
    //验证
    verification() {
      if (this.seal.name.trim().length > 30) {
        this.$toast("签章名称不得大于30个字");
        return false;
      }
      if (this.seal.has_password == 1) {
        // console.log(this.seal);
        if (
          this.seal.password.trim().length <= 0 ||
          this.seal.confirm_password.trim().length <= 0
        ) {
          this.$toast("请输入使用密码!");
          return false;
        } else {
          if (this.seal.password != this.seal.confirm_password) {
            this.$toast("密码不一致!请重新输入");
            return false;
          } else {
            return true;
          }
        }
      } else {
        if (!this.seal.has_file) {
          this.$toast("请上传签章!");
          return false;
        }
        return true;
      }
    },
    //可使用用户
    agree_list_ids() {
      // let ids = [];
      // this.seal.agree_list.forEach((el) => {
      //   ids.push(el.id);
      // });
      let ck_arr = {
        user: [],
        depart: [],
        tag: [],
        role: [],
      };
      this.seal.agree_list.forEach((item, index) => {
        switch (item.type) {
          case 1:
            ck_arr.depart.push(item.id);
            break;
          case 2:
            ck_arr.user.push(item.id);
            break;
          case 3:
            ck_arr.tag.push(item.id);
            break;
          case 4:
            ck_arr.role.push(item.id);
            break;
        }
      });
      return {
        user: ck_arr.user.join(),
        depart: ck_arr.depart.join(),
        tag: ck_arr.tag.join(),
        role: ck_arr.role.join(),
      };
    },
    //可使用+授权用户
    so_agree_list_ids() {
      let ck_arr = {
        user: [],
        depart: [],
        tag: [],
        role: [],
      };
      this.seal.so_agree_list.forEach((item, index) => {
        switch (item.type) {
          case 1:
            ck_arr.depart.push(item.id);
            break;
          case 2:
            ck_arr.user.push(item.id);
            break;
          case 3:
            ck_arr.tag.push(item.id);
            break;
          case 4:
            ck_arr.role.push(item.id);
            break;
        }
      });
      return {
        user: ck_arr.user.join(),
        depart: ck_arr.depart.join(),
        tag: ck_arr.tag.join(),
        role: ck_arr.role.join(),
      };
    },

    //用户信息
    get_user_info() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
    //显示当前时间（年月日时分秒）
    timeFormate() {
      let year = new Date().getFullYear();
      let month =
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1;
      let date =
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate();
      let hh =
        new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours();
      let mm =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      return year + "-" + month + "-" + date + " " + hh + ":" + mm + ":" + ss;
    },
    //当前时间
    get_now_time() {
      let myDate = new Date();
      return (
        myDate.getFullYear() +
        "-" +
        parseInt(myDate.getMonth() + 1) +
        "-" +
        myDate.getDate()
      );
    },
    // 验证auth
    authFun() {
      // console.log(this.auth, this.auth == 1 || 2 ? false : true);
      return this.auth == 1 || 2 ? false : true;
    },
    pel() {
      return this.$store.state.edittext.pel;
    },
  },
  // watch: {
  //   $route(t, n) {
  //     if (n?.name == "selectpage") {
  //       this.set_data();
  //     }
  //   },
  // },
  methods: {
    init() {
      this.creater = null;
      this.create_time = null;
      //签章信息
      this.seal = {
        name: "",
        tabs: [
          { title: "个人签字", key: 1 },
          { title: "单位印章", key: 2 },
          { title: "私人印章", key: 3 },
        ],
        tab: 3, //选中类型

        // 将一些的内容和全部的内容分开显示
        // 允许使用
        agree_list: [],
        agree_list_backfill: [], //数据回填

        // 允许使用和授权给他人使用的用户
        so_agree_list: [],
        so_agree_list_backfill: [], //数据回填

        //密码
        has_password: 0,
        password: "",
        confirm_password: "",

        //文件(提交后台)
        file: null,

        //文件(预览)
        file_view: { path: "" },
        has_file: false,
      };

      // 详情弹窗
      //1=>允许使用，2=>允许使用和授权给他人使用的用户
      this.detail = {
        detail_flag: false,
        detail_type: 1,
        search: "",
        detail_list: [],
      };
      //签字
      this.sign = {
        show: false,
        imgUrl: null,
      };
      this.createPep = [];
    },
    // 深拷贝
    StoP(a) {
      return JSON.parse(JSON.stringify(a));
    },
    //获取详情
    async get_seal_detail() {
      let { data } = await ele_detail({
        id: this.$route.query.id,
      });
      //处理数据
      this.seal.file = true;
      this.seal.name = data.name;
      this.seal.tab = data.type;
      this.auth = data.auth;
      if (data.is_pwd || data.is_pwd == 0) {
        this.seal.has_password = parseInt(data.is_pwd);
      }
      if (data.pwd) {
        this.seal.password = atob(data.pwd);
        this.seal.confirm_password = atob(data.pwd);
      }

      this.seal.file_view = {
        path: "data:image/png;base64," + data.img_data,
      };
      this.seal.has_file = true;
      this.creater = data.create_user_name;
      this.create_time = data.time;

      // id: "13500000015"
      // img: "http://wework.qpic.cn/bizmail/2GhicIBA61z52EVCfwoy6NYEAmZjPpFtClnwxmEoSl93xMUpjusR3sA/"
      // onc: false
      // title: "刘霜"
      // type: 2
      // w_id: "ren13500000015"

      // 部门
      data.use_user_ids.depart.forEach((el) => {
        let ccList = {
          img:
            "data:image/png;base64,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",
          title: el.dep_name,
          id: el.id,
          type: 1,
          w_id: "bm" + el.id,
        };
        this.seal.agree_list.push(ccList);
        this.seal.agree_list_backfill.push("bm" + el.id);
      });
      // 人员
      data.use_user_ids.user.forEach((el) => {
        let ccList = {
          img: el.avatar,
          title: el.name,
          id: el.userid,
          type: 2,
          w_id: "ren" + el.userid,
        };
        this.seal.agree_list.push(ccList);
        this.seal.agree_list_backfill.push("ren" + el.userid);
      });
      // 角色
      data.use_user_ids.role.forEach((el) => {
        let ccList = {
          img: "/img/tagsimg.9296ebd4.png",
          title: el.role_name,
          id: el.id,
          type: 4,
          w_id: "role" + el.id,
        };
        this.seal.agree_list.push(ccList);
        this.seal.agree_list_backfill.push("role" + el.id);
      });
      // 标签
      data.use_user_ids.tag.forEach((el) => {
        let ccList = {
          img: "/img/tagsimg.9296ebd4.png",
          title: el.tag_name,
          id: el.id,
          type: 3,
          w_id: "tag" + el.id,
        };
        this.seal.agree_list.push(ccList);
        this.seal.agree_list_backfill.push("tag" + el.id);
      });
      // 部门
      data.auth_user_ids.depart.forEach((el) => {
        let ccList = {
          img:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAFtElEQVR4Xu2dv2skZRjHv8/s7GZ/5HaTHBxsRBDsBNHCRv+Q607BQgsLuUNQAuooWtjcFVZeJxbCFZaKYCdyjYKVaKHcGUwQ7i7Zzf7K7Oy8Mgl6Jtm77GaeffJm8w2kSDLzfJ/9fN5n3pktNoJHfjnBLQT4ZXMBaJYRd4uABChCHn0O/zJzAlJNAWTfCVro40XEuJz9LG5c9nhZr7kimg8qkFIZLghn3jQDTk5A0gQuHmBzpY+bMjxc6KjgyJWBTp1iT878VM7MRN9fbOFT2f1//kHB0UYVqNfhJDiVJhmaj4C4FGi3Ea32/i30UPB1V0G726DcfIxP/exMcr3WwjXpZ73sC8723NXOMi/Lp65Hp4Hscr2xuJXtyQI4wfu4APQWdaqzih8Eqh18gB1B5ELE3YsoSsGPxtiFCoGhG6FUuy/IbqxcY0mlKIv4RUBa24KrrRXUw7JfnbEbFQLtZCCIdi7x5koFp39FJE0Ea90m3370z41KR8O9O+juqkoxFvGSAAV7qUWvKQrWY+llJQr2UoteUxSsx9LLShTspRa9pihYj6WXlSjYSy16TVGwHksvK1Gwl1r0mqJgPZZeVqJgL7XoNUXBeiy9rETBXmrRa4qC9Vh6WYmCvdSi1xQF67H0shIFe6lFrykK1mPpZSUK9lKLXlMUrMfSy0oU7KUWvaYoWI+ll5Uo2Estek1RsB5LLytRsJda9JqiYD2WXlbyT7AkVSC9AsHLEDw1MTWHPwH5CMHCd0jSAx9EMnGNOTzQQ8Hx6whkDXAn+fimHQDvYeS+AhaSOfQ19UvyT3AQ/zDV5B55yfI3HN5EWvx+ahpzeIJ/ggvxX7k5O/QAeRVpevu8T/J8Ct5bIXuT/C7S9NvzLHmOBe9ZXofDK0hLv+W+KpzRAvMuGMjurl14BWHhdwzd2A/sPKPuJmp7/gVnGJz8CgTvoBD+eN4knw/B2RzDbQDBNxD8MdHSn+agVO7AyU9whc40p1kce14Ez56l4GdI4Q0MC3dmHzZ5AgVPzur4I0W+RFJ86/gD7Y6gYFXWMsCo+LRqyZzFKDgnwCOnj0pPaJfMU4+C89Abdy4FH0NU461KbWnT1KNgCp5mveQ9lpfovAQPn88J5gRrr6nH1eMEa9PmBHOCtdcUJ9iSKCeYE2y53rgHa9PmBHOCtdcU92BLopxgTrDleuMerE2bE8wJ1l5T3IMtiXKCOcGW6417sDZtTjAnWHtNcQ+2JMoJ5gRbrjfuwdq0OcGcYO01xT3YkignmBNsud64B2vT5gQfO8HrAAJt7kb17mJUeskoa6IYDyd492tAnpuoe68OciOk8jFc6TOf2vJPcDh6AS75EJBnz9Ak30WKz4HgC7iwR8E+EZjzXvyb4DkHbv3yKNiauHEeBRsDt46jYGvixnkUbAzcOo6CrYkb51GwMXDrOAq2Jm6cR8HGwK3jKNiauHEeBRsDt46jYGvixnkUbAzcOo6CrYkb51GwMXDrOAq2Jm6cR8HGwK3jKNiauHEeBRsDt46jYGvixnkUbAzcOo6CrYkb51GwMXDrOAq2Jm6cR8HGwK3jKNiauHGeYK3bRBFinMs4CwJDOEG0cwkuCC3ymGFMQNJEcLW1gnpYNo5mnAWBdjIQRBtVuMaSRR4zjAm0q1uCyIWIuxdRlIJxPONmSWDoRni+dk+y/3+Ot7fqKC/UZpnH2sYEBrtdfLLc3r97jlwJcXeZU2wsYVZx2fTeqz3ATRk+fDzK9uK40eAj06yoG9UVl6Jea+Ga9LPEg8+/kaui2Gsg5nOxkQ7dmCEc+tVt3NiXe1Rw9pvr6xW0ly7w2ViX/cyrSZqgtb2DG0/+J3e84P09OUQPFVQ7FYqeuZp8AZnY3mIfVfQRSXK42GPeonSCWwhwGyU0UAGQvdsVwPXO6oeU5QPpy9nZZRguRak2BDYHeKa5i8tIAXHjWvwHLkQJ+WGet+UAAAAASUVORK5CYII=",
          title: el.dep_name,
          id: el.id,
          type: 1,
          w_id: "bm" + el.id,
        };
        this.seal.so_agree_list.push(ccList);
        this.seal.so_agree_list_backfill.push("bm" + el.id);
      });
      // 人员
      data.auth_user_ids.user.forEach((el) => {
        let ccList = {
          img: el.avatar,
          title: el.name,
          id: el.userid,
          type: 2,
          w_id: "ren" + el.userid,
        };
        this.seal.so_agree_list.push(ccList);
        this.seal.so_agree_list_backfill.push("ren" + el.id);
      });
      // 角色
      data.auth_user_ids.role.forEach((el) => {
        let ccList = {
          img: "/img/tagsimg.9296ebd4.png",
          title: el.role_name,
          id: el.id,
          type: 4,
          w_id: "role" + el.id,
        };
        this.seal.so_agree_list.push(ccList);
        this.seal.so_agree_list_backfill.push("role" + el.id);
      });
      // 标签
      data.auth_user_ids.tag.forEach((el) => {
        let ccList = {
          img: "/img/tagsimg.9296ebd4.png",
          title: el.tag_name,
          id: el.id,
          type: 3,
          w_id: "tag" + el.id,
        };
        this.seal.so_agree_list.push(ccList);
        this.seal.so_agree_list_backfill.push("tag" + el.id);
      });
      // data.use_user_names.forEach((el) => {
      //   this.seal.agree_list.push({
      //     title: el.name,
      //     id: el.userid,
      //     img: el.header,
      //     w_id: "ren" + el.id,
      //   });
      //   this.seal.so_agree_list.push("ren" + el.id);
      // });

      // data.auth_user_names.forEach((el) => {
      //   this.seal.so_agree_list.push({
      //     title: el.name,
      //     id: el.userid,
      //     img: el.header,
      //     w_id: "ren" + el.id,
      //   });
      //   this.seal.so_agree_list_backfill.push("ren" + el.id);
      // });
      this.createPep.push({
        img: data.create_user_avator,
        title: data.create_user_name,
        w_id: "ren" + data.uid,
      });
      console.log(
        this.createPep,
        this.seal.so_agree_list,
        this.seal.agree_list
      );
    },
    //提交
    async onSubmit() {
      if (this.verification) {
        let data = new FormData();
        data.append("name", this.seal.name);
        data.append("type", this.seal.tab);
        data.append("is_pwd", this.seal.has_password);
        data.append(
          "pwd",
          (this.seal.has_password = 0 ? "" : btoa(this.seal.password))
        );
        data.append(
          "re_pwd",
          (this.seal.has_password = 0 ? "" : btoa(this.seal.confirm_password))
        );
        data.append("img", this.seal.file);
        data.append("use_user_ids", JSON.stringify(this.agree_list_ids));
        data.append("auth_user_ids", JSON.stringify(this.so_agree_list_ids));
        if (this.$route.query.id) {
          data.append("id", this.$route.query.id);
          let { code, msg } = await ele_update(data);
          this.$toast(msg);
          if (code == 1) {
            this.$router.push("/signature");
          }
        } else {
          let { code, msg } = await addEle(data);
          this.$toast(msg);
          if (code == 1) {
            this.$router.push("/signature");
          }
        }
      }
    },
    // 取消按钮
    onCancel() {
      this.$router.go(-1);
    },
    //清空文件
    onClearFile() {
      this.seal.file = {
        path: "",
      };
      this.seal.has_file = false;
    },
    //tab切换
    onTabChange(val) {
      this.seal.tab = val;
    },
    //选人删除
    agree_delete(index) {
      this.seal.agree_list.splice(index, 1);
      this.seal.agree_list_backfill.splice(index, 1);
    },
    so_agree_delete(index) {
      this.seal.so_agree_list.splice(index, 1);
      this.seal.so_agree_list_backfill.splice(index, 1);
    },
    //全部列表删除
    detail_delete(index) {
      this.detail.detail_list.splice(index, 1);
      if (this.detail.detail_type == 1) {
        this.seal.agree_list_backfill.splice(index, 1);
      } else {
        this.seal.so_agree_list_backfill.splice(index, 1);
      }
    },

    // 打开详情弹窗
    onOpenDetail(val) {
      this.detail.detail_flag = true;
      this.detail.detail_type = val;
      if (this.detail.detail_type == 1) {
        this.detail.detail_list = this.seal.agree_list;
      } else if (this.detail.detail_type == 2) {
        this.detail.detail_list = this.seal.so_agree_list;
      }
    },
    //关闭详情弹窗的时候
    sign_close() {
      this.handleReset();
    },
    // 签字
    handleReset() {
      this.$refs.esign.reset();
    },
    handleGenerate() {
      this.$refs.esign
        .generate()
        .then((res) => {
          this.sign.imgUrl = res;
          let file = dataURLtoFile(
            this.sign.imgUrl,
            Date.parse(new Date()) + "" + Math.round(Math.random() * 10000)
          );
          saveFile_sign(file, (res) => {
            this.seal.file_view = res;
          });

          this.seal.file = file;
          // console.log(this.seal.file);
          this.seal.has_file = true;
          this.sign.show = false;
        })
        .catch((err) => {
          // console.log(err);
          this.$toast("签字错误");
        });
    },
    // 打开人员弹窗
    //允许使用的用户
    agree(val) {
      this.pel.type = val;
      this.pel.depUserss = true;
      if (this.pel.type == 1) {
        this.pel.result = this.StoP(this.seal.agree_list_backfill);
        this.pel.results = this.StoP(this.seal.agree_list);
      } else {
        this.pel.result = this.StoP(this.seal.so_agree_list_backfill);
        this.pel.results = this.StoP(this.seal.so_agree_list);
      }
      this.$router.push({
        path: "/selectpage",
        query: {
          type: 2,
        },
      });
    },

    //数据配置
    set_data() {
      if (this.pel.type == 1) {
        this.seal.agree_list = this.StoP(this.pel.results);
        this.seal.agree_list_backfill = this.StoP(this.pel.result);
      } else if (this.pel.type == 2) {
        this.seal.so_agree_list = this.StoP(this.pel.results);
        this.seal.so_agree_list_backfill = this.StoP(this.pel.result);
      }
    },

    //展示签字弹窗
    show_sign() {
      this.sign.show = true;
    },

    //文件上传
    beforeRead(file) {
      // console.log(file);
      return public_data_files(file, ["jpg", "png", "jpeg"], 2);
    },
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },
    afterRead(file) {
      let s = file.file.size;
      let c = 200 * 1024;
      if (s > c) {
        this.config.quality = 1 - (s - c) / s;
        compressImage(file.file, this.config).then((_file) => {
          debugger
          this.seal.file = _file;
          this.getBase64(this.seal.file, (imageUrl) => {
            this.seal.file_view.path = imageUrl;
          });
          // saveFile({ file: _file }, this.callback);
        });
      } else {
        debugger
        this.seal.file = file.file;
        this.getBase64(this.seal.file, (imageUrl) => {
          this.seal.file_view.path = imageUrl;
        });
        // saveFile(file, this.callback);
      }
      this.seal.has_file = true;
    },
    callback(file) {
      // console.log(file);
      this.seal.file_view = file;
      // console.log(this.seal);
      this.seal.has_file = true;
    },
  },
  beforeRouteEnter(to, from, next) {
    if (!from.name || from.name == "signature") {
      loc = true;
    } else {
      loc = false;
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
.sealDetails {
  width: 100vw;
  background: rgba(245, 246, 247, 1);
  box-sizing: border-box;
  padding-bottom: 60px;

  .public {
    padding: 13px 20px;
    margin-bottom: 10px;
    background: #fff;
    position: relative;

    .public-md {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .title {
    color: #303133;
    font-size: 16px;
    font-weight: 500;
  }

  .seal-msg {
    display: flex;
    flex-direction: column;

    .name {
      margin-bottom: 26px;

      /deep/ .van-cell-group {
        border: none !important;

        .van-cell__title {
          font-size: 16px;
        }

        .van-cell {
          padding-left: 0;
        }
      }
    }

    .state {
      .tabs {
        display: flex;
        align-items: center;
        margin-top: 13px;

        .tab {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 85px;
          height: 36px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(220, 223, 230, 1);
          border-radius: 18px;
          color: #606266;
          font-size: 16px;
          line-height: 36px;
          margin-right: 24px;
        }

        .active {
          color: #0082ef;
          border: 1px solid #0082ef;
        }
      }
    }
  }

  .add-user {
    display: flex;
    align-items: center;
    height: 48px;
    line-height: 48px;

    .icon {
      width: 22px;
      height: 22px;
      background: url("../../assets/img/seal/add.png");
      background-size: 22px 22px;
      margin-right: 8px;
    }

    span {
      color: #303133;
      font-size: 14px;
    }
  }

  .authorization,
  .allow-user {
    padding: 0 0 0 20px;

    .title {
      height: 48px;
      line-height: 48px;
      box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.06);
    }
  }

  .authorization-list {
    display: flex;
    align-items: center;

    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 64px;
      margin-right: 22px;
      margin-top: 16px;

      .head-img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        color: #303133;
        font-size: 14px;
        margin-top: 8px;
        width: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .x {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        height: 16px;
        background: url("../../assets/img/seal/X.png");
        background-size: 16px 16px;
      }
    }
  }

  .password {
    .line {
      display: flex;
      align-items: center;
      height: 48px;

      .title {
        margin-right: 40px;
      }

      /deep/ .van-cell {
        padding-left: 0;
      }
    }
  }

  .image {
    .flex {
      display: flex;
      justify-content: space-between;

      .sign {
        color: #0082ef;
      }

      margin-bottom: 16px;
    }

    .show-img {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 108px;
      height: 80px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(238, 238, 238, 1);
      border-radius: 2px 2px 0px 0px;

      img {
        width: 63px;
        height: 63px;
      }

      .x {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        height: 16px;
        background: url("../../assets/img/seal/X.png");
        background-size: 16px 16px;
      }
    }
  }

  .create {
    .creater,
    .create-time {
      height: 48px;
      display: flex;
      align-items: center;

      .title {
        width: 70px;
        margin-right: 40px;
      }

      .content {
        font-weight: 400;
      }
    }
  }

  .btns {
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -1px 0px rgba(230, 230, 230, 1);
    padding: 0 15px;
    box-sizing: border-box;

    /deep/ .van-button {
      flex: 1;
      height: 44px;
      margin-right: 10px;
    }

    z-index: 5;
  }

  .more {
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #c0c4cc;
  }

  .detail {
    width: 100vw;
    height: 100vh;

    .head {
      display: flex;
      justify-content: space-between;
      padding: 0 15px;

      /deep/ .van-search {
        width: 100%;
      }

      box-shadow: 0px 1px 0px rgba(230, 237, 245, 1);
    }

    .data-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 20px;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        width: 100%;

        .msg {
          display: flex;
          align-items: center;

          .name {
            margin-left: 15px;
          }
        }

        .head-img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          color: #2d3034;
          font-size: 15px;
        }

        .x {
          width: 14px;
          height: 14px;
          background: url("../../assets/img/seal/detail-x.png");
          background-size: 14px 14px;
        }
      }
    }
  }

  .sign-model {
    padding: 30px 25px;
    box-sizing: border-box;

    .tips {
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        width: 21px;
        height: 26px;
        background: url("../../assets/img/seal/sign.png");
        background-size: 21px 26px;
        margin-right: 10px;
      }

      span {
        color: #303133;
        font-size: 16px;
      }
    }

    .region {
      position: relative;
      margin-top: 26px;
      height: 225px;
      border: 1px dashed rgba(220, 223, 230, 1);
      border-radius: 2px;

      .clear {
        position: absolute;
        bottom: 10px;
        right: 15px;
        color: #f56c6c;
        font-size: 16px;
      }
    }

    .sign-btns {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      margin-top: 24px;

      button {
        flex: 1;
        margin-right: 12px;
      }
    }
  }
}

.detail-list {
  img {
    width: 40px;
    border-radius: 5px;
    overflow: hidden;
  }

  .titles {
    margin-left: 15px;
    font-size: 16px;
    flex: 1;
  }
}

.delete-button {
  height: 100%;
}

.detail-top {
  padding: 0 10px;
  font-size: 16px;
  text-align: center;
  color: rgb(216, 216, 216);
}
</style>
<template>
  <div class="box">
    <div v-if="!isUser">
      <div class="pwd">
        <van-row>
          <van-col span="6">签章名称</van-col>
          <van-col span="18">
            <van-field v-model="name" placeholder="请输入签章名称" />
          </van-col>
        </van-row>
      </div>
      <div class="type">
        签章类型
        <div class="btns">
          <div
            v-for="(item,index) in list"
            :key="index"
            @click="chosieType(item.id)"
            :class="{'choiseBtns':iStatus==item.id}"
          >{{item.text}}</div>
        </div>
      </div>
      <div class="division"></div>
      <!-- 选择用户 -->
      <div class="users">
        <div>可以使用的用户</div>
        <div @click="addUser">
          <van-icon name="plus" />添加用户
        </div>
      </div>
      <div class="division"></div>
      <!-- 允许使用和授权他人的用户 -->
      <div class="users">
        <div>允许使用和授权他人的用户</div>
        <div>
          <van-icon name="plus" />添加用户
        </div>
      </div>
      <div class="division"></div>
      <!-- 使用密码区域 -->
      <div class="pwd">
        <van-row>
          <van-col span="7">免密使用</van-col>
          <van-col span="17">
            <van-radio-group v-model="is_pwd" direction="horizontal">
              <van-radio name="0">是</van-radio>
              <van-radio name="1">否</van-radio>
            </van-radio-group>
          </van-col>
        </van-row>
        <van-row v-if="is_pwd==1">
          <van-col span="6">使用密码</van-col>
          <van-col span="18">
            <van-field v-model="pwd" placeholder="请输入使用密码" type="password" />
          </van-col>
        </van-row>
        <van-row v-if="is_pwd==1">
          <van-col span="6">确定密码</van-col>
          <van-col span="18">
            <van-field v-model="re_pwd" placeholder="请输入确定密码" type="password" />
          </van-col>
        </van-row>
      </div>
      <div class="division"></div>

      <!-- 签章信息 -->
      <div class="info">
        <div class="title">
          <div>签章信息</div>
          <div>签字</div>
        </div>
        <div class="upImgs">
          <van-uploader class="upBox" :after-read="afterRead" :max-count="1">
            <van-icon name="plus" color="#ccc" />
          </van-uploader>
          <div class="imgSize" v-if="imgUrl!=''">
            <img :src="imgUrl" alt />
          </div>
        </div>
      </div>
      <div class="division"></div>

      <!-- 创建人 创建时间 -->
      <div class="pwd">
        <van-row>
          <van-col span="6">创建人</van-col>
          <van-col span="18">
            <van-field v-model="creatName" />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="6">创建时间</van-col>
          <van-col span="18">
            <van-field v-model="value" />
          </van-col>
        </van-row>
      </div>
      <div class="division"></div>
      <!-- 取消和保存按钮 -->
      <div class="buttonbox">
        <van-button type="default" class="cancel" @click="cancel()">取消</van-button>
        <van-button color="#0082EF" class="ensure" @click="submitBtn()">确定</van-button>
      </div>
      <div class="fenge"></div>
    </div>
    <!-- 选人 -->
    <depUser v-else></depUser>
  </div>
</template>

<script>
import { addEle } from "@/api/home.js"; //新增签章depUser
import depUser from "@/components/depUser/statistics"; //渲染
export default {
  components: {
    depUser,
  },
  data() {
    return {
      isUser: false,
      imgUrl: "",
      //新增签章
      name: "", //名称
      type: "", //：1公司2单位3个人
      is_pwd: "0", //是否使用密码0不用1用 （默认0）
      pwd: "", //密码（is_pwd=1时必填）
      re_pwd: "", //	确认密码（is_pwd=1时必填）
      img: "", //图片（图片未处理）
      use_user_ids: "", //可使用用户（用户userid,逗号拼接
      auth_user_ids: "", //可使用/可授权给他人的用户（用户userid,逗号拼接）
      //
      creatName: "", //创建人
      value: "",
      iStatus: "1",
      list: [
        {
          id: 1,
          text: "个人签章",
        },
        {
          id: 2,
          text: "单位签章",
        },
        {
          id: 3,
          text: "私人印章",
        },
      ],
    };
  },
  methods: {
    //添加用户
    addUser() {
      this.$router.push({
        path: "/statistics",
        query: {
          dep: 1,
          user: 0,
        },
      });
    },
    // 确定新增签章
    submitBtn() {
      let data = new FormData();
      data.append("img", this.img);
      data.append("name", this.name);
      data.append("type", this.type);
      data.append("is_pwd", this.is_pwd);
      data.append("pwd", btoa(this.pwd));
      data.append("re_pwd", btoa(this.re_pwd));
      // data.append("use_user_ids", this.form.use_user_ids);
      // data.append("auth_user_ids", this.form.auth_user_ids);
      addEle(data).then((res) => {
        // console.log(res);
      });
    },
    chosieType(id) {
      this.type = id;
      this.iStatus = id;
    },
    //文件上传
    afterRead(file) {
      // if (file.type !== "image/jpeg") {
      //   this.$toast("请上传 jpg格式图片");
      //   return false;
      // }
      this.imgUrl = file.content;
      this.img = file.file;
      // console.log(this.file, "555");
    },
  },
  mounted() {
    this.creatName = JSON.parse(sessionStorage.getItem("userInfo")).name;
  },
};
</script>
<style lang="scss" scoped>
.box {
  position: relative;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}
.van-field {
  padding-top: 13px;
  padding-bottom: 13px;
  padding-left: 20px;
}
/deep/.van-cell__title {
  font-size: 16px !important;
}
.type {
  font-size: 16px;
  padding: 0 20px;
  .btns {
    width: 100%;
    display: flex;
    margin-top: 13px;
    margin-bottom: 12px;
    div {
      width: 76px;
      height: 33px;
      border-radius: 17px;
      background-color: #fff;
      font-size: 15px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;
      border: 1px solid #dcdfe6;
    }
    .choiseBtns {
      border: 1px solid #0082ef;
      color: #0082ef;
    }
  }
}
.division {
  background: #f5f6f7;
  width: 100%;
  height: 10px;
}
.fenge {
  background: #f5f6f7;
  width: 100%;
  height: 15px;
  padding-top: 50px;
}
.users {
  width: 100%;
  padding-left: 20px;
  div:nth-child(1) {
    border-bottom: 1px solid #f0f0f0;
    font-size: 16px;
  }
  div {
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    .van-icon {
      color: #fff;
      background-color: #0082ef;
      border-radius: 50%;
      padding: 3px;
      vertical-align: text-top;
      margin-right: 5px;
    }
  }
}
.van-col {
  display: block;
  height: 48px;
  line-height: 48px;
  .van-radio-group {
    height: 48px;
    line-height: 48px;
  }
}
.pwd {
  padding-left: 20px;
  font-size: 16px;
}
.info {
  padding-left: 20px;
  padding-right: 20px;
  font-size: 16px;
  .title {
    display: flex;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    div:nth-child(2) {
      color: #0082ef;
      font-size: 15px;
    }
  }
}
.upImgs {
  display: flex;
}
.upBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(212, 212, 212, 1);
  border-radius: 4px;
  margin-bottom: 15px;
}
.buttonbox {
  width: 100%;
  background-color: #ffffff;
  height: 57px;
  line-height: 57px;
  color: #303133;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #e6e6e6;

  .cancel {
    width: 187px;
    height: 44px;
    margin-right: 10px;
  }

  .ensure {
    width: 187px;
    height: 44px;
    color: #303133;
  }
}
.imgSize {
  width: 108px;
  height: 80px;
  border: 1px solid rgba(238, 238, 238, 1);
  text-align: center;
  margin-left: 17px;
  margin-bottom: 14px;

  img {
    max-width: 108px;
    max-height: 80px;
  }
}
</style>
